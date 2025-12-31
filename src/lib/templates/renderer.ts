import { josa } from './josa'
import { logger } from '../logger'

/**
 * 템플릿 변수 인터페이스
 */
export interface TemplateVariables {
  [key: string]: unknown
}

/**
 * 템플릿 렌더링 옵션
 */
export interface RenderOptions {
  enableJosa?: boolean
  enablePatterns?: boolean
  enableValidation?: boolean
  seed?: number
}

/**
 * 문장 패턴 인터페이스
 */
export interface SentencePattern {
  intro: string[]
  policy: string[]
  facility: string[]
  best_time_tip: string[]
  [key: string]: string[]
}

/**
 * 템플릿 렌더러 클래스
 */
export class TemplateRenderer {
  private patterns: Map<string, SentencePattern> = new Map()
  private seed: number

  constructor(seed?: number) {
    this.seed = seed ?? Date.now()
  }

  /**
   * 패턴을 로드합니다.
   */
  loadPatterns(patterns: Record<string, SentencePattern>) {
    Object.entries(patterns).forEach(([key, pattern]) => {
      this.patterns.set(key, pattern)
    })
  }

  /**
   * 시드를 기반으로 패턴을 선택합니다.
   */
  private selectPattern(category: string, section: string, word?: string): string {
    const pattern = this.patterns.get(category)
    if (!pattern || !pattern[section]) {
      return ''
    }

    const patterns = pattern[section]
    if (patterns.length === 0) return ''

    // 단어가 있으면 해시를 생성하여 패턴 선택 (Unsigned 32-bit Integer)
    let hash = (this.seed >>> 0)
    if (word) {
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash + word.charCodeAt(i)) >>> 0
      }
    }

    const index = hash % patterns.length
    return patterns[index]
  }

  /**
   * 템플릿 문자열을 렌더링합니다.
   */
  render<T extends TemplateVariables>(template: string, variables: T, options: RenderOptions = {}): string {
    const {
      enableJosa = true,
      enablePatterns = true,
      enableValidation = true
    } = options

    let result = template

    // 1. 기본 변수 치환
    result = this.replaceVariables(result, variables)

    // 2. 조사 처리
    if (enableJosa) {
      result = this.processJosa(result, variables)
    }

    // 3. 패턴 처리
    if (enablePatterns) {
      result = this.processPatterns(result, variables)
    }

    // 4. 조건부 블록 처리
    result = this.processConditionalBlocks(result, variables)

    // 5. 반복 블록 처리
    result = this.processLoopBlocks(result, variables)

    // 6. 검증
    if (enableValidation) {
      result = this.validateOutput(result)
    }

    return result
  }

  /**
   * 변수 치환
   */
  private replaceVariables(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      const value = this.getNestedValue(variables, trimmedKey)
      return value !== undefined ? String(value) : match
    })
  }

  /**
   * 중첩된 객체에서 값을 가져옵니다.
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' && current !== null && key in current
        ? (current as Record<string, unknown>)[key]
        : undefined
    }, obj)
  }

  /**
   * 조사 처리
   */
  private processJosa(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{\s*josa\s+([^}]+?)\s+'([^']+?)'\s*\}\}/g, (match, wordKey, josaString) => {
      const word = this.getNestedValue(variables, wordKey.trim())
      if (!word) return match

      return josa(String(word), josaString)
    })
  }

  /**
   * 패턴 처리
   */
  private processPatterns(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{\s*pattern\s+([^}]+?)\s+'([^']+?)'\s+'([^']+?)'\s*\}\}/g, (match, category, section, wordKey) => {
      const word = this.getNestedValue(variables, wordKey.trim())
      return this.selectPattern(category, section, typeof word === 'string' ? word : undefined)
    })
  }

  /**
   * 조건부 블록 처리
   */
  private processConditionalBlocks(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{\s*#if\s+([^}]+?)\s*\}\}([\s\S]*?)\{\{\s*\/if\s*\}\}/g, (match, condition, content) => {
      const value = this.getNestedValue(variables, condition.trim())
      if (this.isTruthy(value)) {
        return this.render(content, variables, { enableJosa: true, enablePatterns: true, enableValidation: false })
      }
      return ''
    })
  }

  /**
   * 반복 블록 처리
   */
  private processLoopBlocks(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{\s*#each\s+([^}]+?)\s*\}\}([\s\S]*?)\{\{\s*\/each\s*\}\}/g, (match, arrayKey, content) => {
      const array = this.getNestedValue(variables, arrayKey.trim())
      if (!Array.isArray(array)) return ''

      return array.map((item, index) => {
        const itemVariables = {
          ...variables,
          ...(typeof item === 'object' && item !== null ? item : { value: item }),
          '@index': index,
          '@first': index === 0,
          '@last': index === array.length - 1
        }
        return this.render(content, itemVariables, { enableJosa: true, enablePatterns: true, enableValidation: false })
      }).join('')
    })
  }
  /**
   * 값이 참인지 확인
   */
  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value !== 0
    if (typeof value === 'string') return value.length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.keys(value).length > 0
    return true
  }

  /**
   * 출력 검증
   */
  private validateOutput(result: string): string {
    // 빈 변수 치환 제거
    let output = result.replace(/\{\{\s*[^}]+\s*\}\}/g, '')

    // 연속된 공백 정리 (줄바꿈 제외)
    output = output.replace(/[ \t]+/g, ' ')

    // 중복된 줄바꿈 정리
    output = output.replace(/\n\s*\n\s*\n/g, '\n\n')

    return output.trim()
  }

  /**
   * MDX 템플릿을 렌더링합니다.
   */
  renderMDX(template: string, variables: TemplateVariables, options?: RenderOptions): string {
    return this.render(template, variables, options)
  }

  /**
   * 반복 블록 처리 (외부 노출용)
   */
  processLoops(template: string, variables: TemplateVariables): string {
    return this.processLoopBlocks(template, variables)
  }

  /**
   * JSON-LD 템플릿을 렌더링합니다.
   */
  renderJSONLD(template: string, variables: TemplateVariables, options?: RenderOptions): object {
    const result = this.render(template, variables, options)

    try {
      const json = JSON.parse(result)
      return this.cleanJSONLD(json) as object
    } catch (error) {
      logger.error('JSON-LD parsing error', error)
      return {}
    }
  }

  /**
   * JSON-LD에서 빈 값들을 제거합니다.
   */
  private cleanJSONLD(obj: unknown): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanJSONLD(item)).filter(item => item !== null && item !== undefined && item !== '')
    }

    if (obj && typeof obj === 'object') {
      const cleaned: Record<string, unknown> = {}
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const cleanedValue = this.cleanJSONLD(value)
        if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
          cleaned[key] = cleanedValue
        }
      })
      return cleaned
    }

    return obj
  }
}
/**
 * 기본 패턴 데이터
 */
export const defaultPatterns: Record<string, SentencePattern> = {
  place: {
    intro: [
      "{{sido_ko}} {{sig_ko}}{{josa sig_ko '은/는'}} {{category_ko}}을(를) 즐기기 좋은 동네입니다. {{name}}{{josa name '은/는'}} {{feature_key}}가 돋보입니다.",
      "{{name}}— 반려견과 함께 {{activity}}기 좋은 {{category_ko}}입니다. {{access_tip}}"
    ],
    policy: [
      "목줄 착용은 기본, 대형견은 직원 안내에 따릅니다.",
      "실내 동반 가능하며, 테라스는 자유롭게 이용 가능합니다."
    ],
    facility: [
      "그늘진 테라스와 좌석 간격이 넉넉해 편안합니다.",
      "물그릇과 포토존이 마련되어 있습니다."
    ],
    best_time_tip: [
      "주말 오전 10시 이전이 한산합니다.",
      "평일 오후 2~4시대가 대기 없이 방문하기 좋습니다."
    ]
  },
  event: {
    intro: [
      "{{title}}{{josa title '은/는'}} {{date_range}} {{venue}}{{josa venue '에서/에서'}} 열립니다.",
      "{{region_label}}에서 {{title}} 행사가 진행됩니다."
    ],
    policy: [
      "반려견 동반 가능하며, 목줄 착용 필수입니다.",
      "대형견은 별도 안내에 따라 입장하시기 바랍니다."
    ],
    facility: [
      "실내외 모두 이용 가능한 넓은 공간입니다.",
      "물그릇과 휴게 공간이 마련되어 있습니다."
    ],
    best_time_tip: [
      "오전 시간대가 한산하여 추천합니다.",
      "주말보다는 평일 방문이 여유롭습니다."
    ]
  }
}

/**
 * 템플릿 렌더러 생성 팩토리 함수
 */
export function createRenderer(options: RenderOptions = {}): TemplateRenderer {
  return new TemplateRenderer(options.seed)
}

export const defaultRenderer = createRenderer()
