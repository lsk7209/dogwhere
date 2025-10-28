// CQS (Content Quality Score) 계산 로직
// CQS(0~1) = Coverage 0.25 + Freshness 0.20 + Structure 0.20 + Originality 0.20 + GEO-Accuracy 0.15

export interface ContentData {
  title: string
  description: string
  features: string[]
  faq: Array<{ question: string; answer: string }>
  images: string[]
  updatedAt: string
  source: string
  canonicalKey: string
  regionCode: string
  address: string
  lat: number
  lng: number
}

export interface CQSResult {
  score: number // 0-1
  breakdown: {
    coverage: number
    freshness: number
    structure: number
    originality: number
    geoAccuracy: number
  }
  factors: {
    coverageWeight: number
    freshnessWeight: number
    structureWeight: number
    originalityWeight: number
    geoAccuracyWeight: number
  }
  shouldIndex: boolean
  reason?: string
}

export function calculateCQS(content: ContentData): CQSResult {
  // 가중치 설정
  const weights = {
    coverage: 0.25,
    freshness: 0.20,
    structure: 0.20,
    originality: 0.20,
    geoAccuracy: 0.15
  }

  // 1. 커버리지 점수 (0-1)
  const coverageScore = calculateCoverageScore(content)

  // 2. 신선도 점수 (0-1)
  const freshnessScore = calculateFreshnessScore(content.updatedAt)

  // 3. 구조 점수 (0-1)
  const structureScore = calculateStructureScore(content)

  // 4. 독창성 점수 (0-1)
  const originalityScore = calculateOriginalityScore(content)

  // 5. 지리적 정확도 점수 (0-1)
  const geoAccuracyScore = calculateGeoAccuracyScore(content)

  // 최종 점수 계산
  const finalScore = 
    coverageScore * weights.coverage +
    freshnessScore * weights.freshness +
    structureScore * weights.structure +
    originalityScore * weights.originality +
    geoAccuracyScore * weights.geoAccuracy

  const shouldIndex = finalScore >= 0.85
  const reason = shouldIndex 
    ? undefined 
    : `CQS 점수가 ${finalScore.toFixed(2)}로 임계값 0.85 미만`

  return {
    score: Math.max(0, Math.min(1, finalScore)),
    breakdown: {
      coverage: coverageScore,
      freshness: freshnessScore,
      structure: structureScore,
      originality: originalityScore,
      geoAccuracy: geoAccuracyScore
    },
    factors: {
      coverageWeight: weights.coverage,
      freshnessWeight: weights.freshness,
      structureWeight: weights.structure,
      originalityWeight: weights.originality,
      geoAccuracyWeight: weights.geoAccuracy
    },
    shouldIndex,
    reason
  }
}

// 커버리지 점수 계산
function calculateCoverageScore(content: ContentData): number {
  let score = 0
  
  // 제목 존재
  if (content.title && content.title.length > 10) score += 0.2
  
  // 설명 존재
  if (content.description && content.description.length > 100) score += 0.3
  
  // 특징 정보
  if (content.features && content.features.length >= 3) score += 0.2
  
  // FAQ 존재
  if (content.faq && content.faq.length >= 2) score += 0.2
  
  // 이미지 존재
  if (content.images && content.images.length >= 1) score += 0.1
  
  return Math.min(score, 1)
}

// 신선도 점수 계산
function calculateFreshnessScore(updatedAt: string): number {
  const now = new Date()
  const updated = new Date(updatedAt)
  
  const daysSinceUpdate = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
  
  // 최근 업데이트일수록 높은 점수
  if (daysSinceUpdate <= 7) return 1.0
  if (daysSinceUpdate <= 30) return 0.9
  if (daysSinceUpdate <= 90) return 0.7
  if (daysSinceUpdate <= 180) return 0.5
  if (daysSinceUpdate <= 365) return 0.3
  return 0.1
}

// 구조 점수 계산
function calculateStructureScore(content: ContentData): number {
  let score = 0
  
  // 제목 구조 (적절한 길이)
  if (content.title && content.title.length >= 20 && content.title.length <= 60) {
    score += 0.3
  }
  
  // 설명 구조 (HTML 태그 포함)
  if (content.description && content.description.includes('<h') && content.description.includes('<p>')) {
    score += 0.4
  }
  
  // FAQ 구조 (질문과 답변이 모두 존재)
  if (content.faq && content.faq.every(item => 
    item.question && item.question.length > 10 && 
    item.answer && item.answer.length > 20
  )) {
    score += 0.3
  }
  
  return Math.min(score, 1)
}

// 독창성 점수 계산
function calculateOriginalityScore(content: ContentData): number {
  let score = 0.5 // 기본 점수
  
  // 소스 다양성
  const sources = ['data.go.kr', 'tourapi', 'google', 'naver', 'kakao']
  if (sources.includes(content.source)) {
    score += 0.2
  }
  
  // 중복 키 체크 (실제로는 데이터베이스에서 확인)
  if (content.canonicalKey && content.canonicalKey.length > 5) {
    score += 0.2
  }
  
  // 내용 길이 (너무 짧으면 독창성 의심)
  if (content.description && content.description.length > 200) {
    score += 0.1
  }
  
  return Math.min(score, 1)
}

// 지리적 정확도 점수 계산
function calculateGeoAccuracyScore(content: ContentData): number {
  let score = 0
  
  // 좌표 존재
  if (content.lat && content.lng && 
      content.lat >= 33 && content.lat <= 39 && 
      content.lng >= 124 && content.lng <= 132) {
    score += 0.4
  }
  
  // 주소 존재
  if (content.address && content.address.length > 10) {
    score += 0.3
  }
  
  // 지역 코드 일치
  if (content.regionCode && content.regionCode.includes('-')) {
    score += 0.3
  }
  
  return Math.min(score, 1)
}

// Thin 게이트 로직
export function shouldCreateCluster(placeCount: number, isHub: boolean = false): boolean {
  // 허브는 항상 생성
  if (isHub) return true
  
  // 클러스터는 조건부 생성
  return placeCount >= 6 // 초기: 6개, 성장: 10개로 조정 가능
}

// 인덱싱 결정
export function shouldIndex(content: ContentData, placeCount: number = 0): {
  shouldIndex: boolean
  reason: string
} {
  const cqs = calculateCQS(content)
  
  if (!cqs.shouldIndex) {
    return {
      shouldIndex: false,
      reason: cqs.reason || 'CQS 점수 부족'
    }
  }
  
  // Thin 게이트 확인
  if (!shouldCreateCluster(placeCount)) {
    return {
      shouldIndex: false,
      reason: `장소 수 ${placeCount}개로 Thin 게이트 미충족 (최소 6개 필요)`
    }
  }
  
  return {
    shouldIndex: true,
    reason: '모든 조건 충족'
  }
}
