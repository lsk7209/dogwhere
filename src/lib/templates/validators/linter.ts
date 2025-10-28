/**
 * 린팅 규칙 정의
 */
export interface LinterRules {
  length: {
    title: [number, number]
    meta: [number, number]
    place_body: [number, number]
    cluster_body: [number, number]
    event_body: [number, number]
    blog_body: [number, number]
  }
  required: {
    place: string[]
    event: string[]
    area_cluster: string[]
  }
  forbidden_words: string[]
  faq_count: {
    min: number
    max: number
  }
  structure: {
    h1: number
    has_breadcrumb: boolean
    internal_links: number
  }
  jsonld: {
    validate: boolean
  }
  similarity: {
    ngram: number
    max_score: number
  }
}

/**
 * CQS 가중치 정의
 */
export interface CQSWeights {
  coverage: number
  freshness: number
  structure: number
  originality: number
  geo_accuracy: number
  threshold: number
}

/**
 * 린팅 결과
 */
export interface LinterResult {
  isValid: boolean
  score: number
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

/**
 * 기본 린팅 규칙
 */
export const defaultLinterRules: LinterRules = {
  length: {
    title: [45, 60],
    meta: [110, 155],
    place_body: [220, 320],
    cluster_body: [900, 1500],
    event_body: [300, 600],
    blog_body: [900, 1500]
  },
  required: {
    place: ['name', 'address', 'sido_en', 'sig_en', 'category_en', 'updated_at'],
    event: ['title', 'start_date', 'end_date', 'region_code'],
    area_cluster: ['sido_en', 'sig_en', 'category_en', 'robots_index']
  },
  forbidden_words: ['완벽', '100%', '보장', '치료', '의학적'],
  faq_count: { min: 2, max: 3 },
  structure: {
    h1: 1,
    has_breadcrumb: true,
    internal_links: 3
  },
  jsonld: { validate: true },
  similarity: { ngram: 3, max_score: 0.85 }
}

/**
 * 기본 CQS 가중치
 */
export const defaultCQSWeights: CQSWeights = {
  coverage: 0.25,
  freshness: 0.20,
  structure: 0.20,
  originality: 0.20,
  geo_accuracy: 0.15,
  threshold: 0.85
}

/**
 * 콘텐츠 린터 클래스
 */
export class ContentLinter {
  private rules: LinterRules
  private cqsWeights: CQSWeights

  constructor(rules?: LinterRules, cqsWeights?: CQSWeights) {
    this.rules = rules || defaultLinterRules
    this.cqsWeights = cqsWeights || defaultCQSWeights
  }

  /**
   * 콘텐츠를 린팅합니다.
   */
  lint(content: string, type: string, variables: Record<string, any>): LinterResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // 1. 길이 검사
    this.checkLength(content, type, errors, warnings)

    // 2. 필수 필드 검사
    this.checkRequiredFields(variables, type, errors)

    // 3. 금칙어 검사
    this.checkForbiddenWords(content, errors)

    // 4. 구조 검사
    this.checkStructure(content, errors, warnings)

    // 5. FAQ 개수 검사
    this.checkFAQCount(content, errors, warnings)

    // 6. 내부 링크 검사
    this.checkInternalLinks(content, warnings)

    // 7. 유사도 검사
    this.checkSimilarity(content, variables, warnings)

    // 8. CQS 점수 계산
    const score = this.calculateCQS(content, variables, type)

    const isValid = errors.length === 0 && score >= this.cqsWeights.threshold

    return {
      isValid,
      score,
      errors,
      warnings,
      suggestions
    }
  }

  /**
   * 길이 검사
   */
  private checkLength(content: string, type: string, errors: string[], warnings: string[]) {
    const lengthRules = this.rules.length
    const contentLength = content.length

    let minLength: number, maxLength: number

    switch (type) {
      case 'place':
        minLength = lengthRules.place_body[0]
        maxLength = lengthRules.place_body[1]
        break
      case 'event':
        minLength = lengthRules.event_body[0]
        maxLength = lengthRules.event_body[1]
        break
      case 'area_cluster':
        minLength = lengthRules.cluster_body[0]
        maxLength = lengthRules.cluster_body[1]
        break
      case 'blog':
        minLength = lengthRules.blog_body[0]
        maxLength = lengthRules.blog_body[1]
        break
      default:
        return
    }

    if (contentLength < minLength) {
      errors.push(`콘텐츠가 너무 짧습니다. 최소 ${minLength}자 이상 필요합니다. (현재: ${contentLength}자)`)
    } else if (contentLength > maxLength) {
      warnings.push(`콘텐츠가 너무 깁니다. 권장 길이는 ${maxLength}자 이하입니다. (현재: ${contentLength}자)`)
    }
  }

  /**
   * 필수 필드 검사
   */
  private checkRequiredFields(variables: Record<string, any>, type: string, errors: string[]) {
    const requiredFields = this.rules.required[type as keyof typeof this.rules.required]
    if (!requiredFields) return

    requiredFields.forEach(field => {
      if (!variables[field] || variables[field] === '') {
        errors.push(`필수 필드 '${field}'가 누락되었습니다.`)
      }
    })
  }

  /**
   * 금칙어 검사
   */
  private checkForbiddenWords(content: string, errors: string[]) {
    this.rules.forbidden_words.forEach(word => {
      if (content.includes(word)) {
        errors.push(`금칙어 '${word}'가 포함되어 있습니다.`)
      }
    })
  }

  /**
   * 구조 검사
   */
  private checkStructure(content: string, errors: string[], warnings: string[]) {
    // H1 태그 개수 검사
    const h1Count = (content.match(/^# /gm) || []).length
    if (h1Count !== this.rules.structure.h1) {
      errors.push(`H1 태그는 정확히 ${this.rules.structure.h1}개여야 합니다. (현재: ${h1Count}개)`)
    }

    // 브레드크럼 검사
    if (this.rules.structure.has_breadcrumb && !content.includes('BreadcrumbList')) {
      warnings.push('브레드크럼이 누락되었습니다.')
    }
  }

  /**
   * FAQ 개수 검사
   */
  private checkFAQCount(content: string, errors: string[], warnings: string[]) {
    const faqCount = (content.match(/^### FAQ/gm) || []).length
    const { min, max } = this.rules.faq_count

    if (faqCount < min) {
      errors.push(`FAQ는 최소 ${min}개 이상 필요합니다. (현재: ${faqCount}개)`)
    } else if (faqCount > max) {
      warnings.push(`FAQ는 최대 ${max}개까지 권장됩니다. (현재: ${faqCount}개)`)
    }
  }

  /**
   * 내부 링크 검사
   */
  private checkInternalLinks(content: string, warnings: string[]) {
    const internalLinkCount = (content.match(/\/[a-z-]+\/[a-z-]+/g) || []).length
    const requiredLinks = this.rules.structure.internal_links

    if (internalLinkCount < requiredLinks) {
      warnings.push(`내부 링크는 최소 ${requiredLinks}개 이상 권장됩니다. (현재: ${internalLinkCount}개)`)
    }
  }

  /**
   * 유사도 검사
   */
  private checkSimilarity(content: string, variables: Record<string, any>, warnings: string[]) {
    // 간단한 n-gram 기반 유사도 검사
    const ngram = this.rules.similarity.ngram
    const maxScore = this.rules.similarity.max_score

    // 실제 구현에서는 더 정교한 유사도 알고리즘 사용
    const similarity = this.calculateNGramSimilarity(content, variables.name || '', ngram)
    
    if (similarity > maxScore) {
      warnings.push(`콘텐츠 유사도가 높습니다. (${(similarity * 100).toFixed(1)}%)`)
    }
  }

  /**
   * n-gram 유사도 계산
   */
  private calculateNGramSimilarity(text1: string, text2: string, n: number): number {
    if (!text1 || !text2) return 0

    const ngrams1 = this.getNGrams(text1.toLowerCase(), n)
    const ngrams2 = this.getNGrams(text2.toLowerCase(), n)

    const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)))
    const union = new Set([...ngrams1, ...ngrams2])

    return intersection.size / union.size
  }

  /**
   * n-gram 생성
   */
  private getNGrams(text: string, n: number): Set<string> {
    const ngrams = new Set<string>()
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.add(text.substring(i, i + n))
    }
    return ngrams
  }

  /**
   * CQS 점수 계산
   */
  private calculateCQS(content: string, variables: Record<string, any>, type: string): number {
    const coverage = this.calculateCoverage(variables, type)
    const freshness = this.calculateFreshness(variables)
    const structure = this.calculateStructure(content)
    const originality = this.calculateOriginality(content)
    const geoAccuracy = this.calculateGeoAccuracy(variables)

    return (
      coverage * this.cqsWeights.coverage +
      freshness * this.cqsWeights.freshness +
      structure * this.cqsWeights.structure +
      originality * this.cqsWeights.originality +
      geoAccuracy * this.cqsWeights.geo_accuracy
    )
  }

  /**
   * 커버리지 점수 계산
   */
  private calculateCoverage(variables: Record<string, any>, type: string): number {
    const requiredFields = this.rules.required[type as keyof typeof this.rules.required] || []
    const filledFields = requiredFields.filter(field => variables[field] && variables[field] !== '')
    return filledFields.length / requiredFields.length
  }

  /**
   * 신선도 점수 계산
   */
  private calculateFreshness(variables: Record<string, any>): number {
    if (!variables.updated_at) return 0

    const updateDate = new Date(variables.updated_at)
    const now = new Date()
    const daysDiff = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24)

    // 30일 이내면 1.0, 90일 이내면 0.5, 그 이상이면 0.0
    if (daysDiff <= 30) return 1.0
    if (daysDiff <= 90) return 0.5
    return 0.0
  }

  /**
   * 구조 점수 계산
   */
  private calculateStructure(content: string): number {
    let score = 0

    // H1 태그 존재
    if (content.includes('# ')) score += 0.3

    // FAQ 섹션 존재
    if (content.includes('### FAQ')) score += 0.3

    // 내부 링크 존재
    if (content.includes('/')) score += 0.2

    // 메타데이터 존재
    if (content.includes('---')) score += 0.2

    return Math.min(score, 1.0)
  }

  /**
   * 독창성 점수 계산
   */
  private calculateOriginality(content: string): number {
    // 간단한 독창성 검사 (실제로는 더 복잡한 알고리즘 필요)
    const uniqueWords = new Set(content.toLowerCase().split(/\s+/))
    const totalWords = content.split(/\s+/).length
    
    return Math.min(uniqueWords.size / totalWords, 1.0)
  }

  /**
   * 지리적 정확도 점수 계산
   */
  private calculateGeoAccuracy(variables: Record<string, any>): number {
    let score = 0

    if (variables.lat && variables.lng) score += 0.4
    if (variables.address) score += 0.3
    if (variables.sido_en && variables.sig_en) score += 0.3

    return Math.min(score, 1.0)
  }
}

/**
 * 기본 린터 인스턴스 생성
 */
export function createLinter(rules?: LinterRules, cqsWeights?: CQSWeights): ContentLinter {
  return new ContentLinter(rules, cqsWeights)
}
