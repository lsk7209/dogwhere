// O-Dog 점수 계산 로직
// O-Dog(0–100) = 0.30*rating + 0.20*recency + 0.20*safety(체감·PM2.5) + 0.15*review_trust + 0.15*variance/혼잡

export interface PlaceData {
  rating: number
  reviewCount: number
  updatedAt: string
  createdAt: string
  policyLevel: 'safe' | 'caution' | 'warning'
  features: string[]
  regionCode: string
}

export interface WeatherData {
  temperature: number
  airQuality: number // PM2.5
  humidity: number
}

export interface ODogScoreResult {
  score: number
  breakdown: {
    rating: number
    recency: number
    safety: number
    reviewTrust: number
    variance: number
  }
  factors: {
    ratingWeight: number
    recencyWeight: number
    safetyWeight: number
    reviewTrustWeight: number
    varianceWeight: number
  }
}

export function calculateODogScore(
  place: PlaceData,
  weather?: WeatherData
): ODogScoreResult {
  // 가중치 설정
  const weights = {
    rating: 0.30,
    recency: 0.20,
    safety: 0.20,
    reviewTrust: 0.15,
    variance: 0.15
  }

  // 1. 평점 점수 (0-100)
  const ratingScore = Math.min(place.rating * 20, 100)

  // 2. 최신성 점수 (0-100)
  const recencyScore = calculateRecencyScore(place.updatedAt, place.createdAt)

  // 3. 안전 점수 (0-100)
  const safetyScore = calculateSafetyScore(place.policyLevel, weather)

  // 4. 리뷰 신뢰도 점수 (0-100)
  const reviewTrustScore = calculateReviewTrustScore(place.reviewCount, place.rating)

  // 5. 분산/혼잡 점수 (0-100)
  const varianceScore = calculateVarianceScore(place.features, place.regionCode)

  // 최종 점수 계산
  const finalScore = Math.round(
    ratingScore * weights.rating +
    recencyScore * weights.recency +
    safetyScore * weights.safety +
    reviewTrustScore * weights.reviewTrust +
    varianceScore * weights.variance
  )

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    breakdown: {
      rating: ratingScore,
      recency: recencyScore,
      safety: safetyScore,
      reviewTrust: reviewTrustScore,
      variance: varianceScore
    },
    factors: weights
  }
}

// 최신성 점수 계산
function calculateRecencyScore(updatedAt: string, createdAt: string): number {
  const now = new Date()
  const updated = new Date(updatedAt)
  const created = new Date(createdAt)
  
  const daysSinceUpdate = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))
  const daysSinceCreated = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  
  // 최근 업데이트일수록 높은 점수
  if (daysSinceUpdate <= 7) return 100
  if (daysSinceUpdate <= 30) return 80
  if (daysSinceUpdate <= 90) return 60
  if (daysSinceUpdate <= 180) return 40
  if (daysSinceUpdate <= 365) return 20
  return 10
}

// 안전 점수 계산
function calculateSafetyScore(
  policyLevel: 'safe' | 'caution' | 'warning',
  weather?: WeatherData
): number {
  let baseScore = 0
  
  // 정책 레벨 기반 점수
  switch (policyLevel) {
    case 'safe':
      baseScore = 90
      break
    case 'caution':
      baseScore = 60
      break
    case 'warning':
      baseScore = 30
      break
  }
  
  // 날씨 조건 반영
  if (weather) {
    // 체감온도 (20-25도가 최적)
    const tempScore = Math.max(0, 100 - Math.abs(weather.temperature - 22.5) * 4)
    
    // PM2.5 (0-15 좋음, 16-35 보통, 36-75 나쁨)
    let airScore = 100
    if (weather.airQuality > 35) {
      airScore = Math.max(0, 100 - (weather.airQuality - 35) * 2)
    }
    
    // 가중 평균
    baseScore = (baseScore * 0.6 + tempScore * 0.2 + airScore * 0.2)
  }
  
  return Math.round(baseScore)
}

// 리뷰 신뢰도 점수 계산
function calculateReviewTrustScore(reviewCount: number, rating: number): number {
  // 리뷰 수가 많을수록 신뢰도 높음
  let countScore = 0
  if (reviewCount >= 100) countScore = 100
  else if (reviewCount >= 50) countScore = 80
  else if (reviewCount >= 20) countScore = 60
  else if (reviewCount >= 10) countScore = 40
  else if (reviewCount >= 5) countScore = 20
  else countScore = 10
  
  // 평점이 높을수록 신뢰도 높음 (단, 너무 높으면 의심)
  let ratingScore = 0
  if (rating >= 4.5 && rating <= 4.8) ratingScore = 100
  else if (rating >= 4.0 && rating <= 4.9) ratingScore = 80
  else if (rating >= 3.5 && rating <= 5.0) ratingScore = 60
  else if (rating >= 3.0) ratingScore = 40
  else ratingScore = 20
  
  return Math.round((countScore * 0.7 + ratingScore * 0.3))
}

// 분산/혼잡 점수 계산
function calculateVarianceScore(features: string[], regionCode: string): number {
  let score = 50 // 기본 점수
  
  // 특징이 다양할수록 높은 점수
  const featureScore = Math.min(features.length * 10, 100)
  
  // 지역별 혼잡도 (실제로는 더 정교한 데이터 필요)
  const regionCrowdLevel = getRegionCrowdLevel(regionCode)
  const crowdScore = 100 - regionCrowdLevel
  
  return Math.round((featureScore * 0.6 + crowdScore * 0.4))
}

// 지역별 혼잡도 (임시 구현)
function getRegionCrowdLevel(regionCode: string): number {
  const crowdLevels: Record<string, number> = {
    'seoul-gangnam-gu': 80,
    'seoul-myeongdong': 90,
    'seoul-hongdae': 70,
    'seoul-itaewon': 60,
    'seoul-mapo-gu': 50,
    'seoul-songpa-gu': 40,
    'gyeonggi-suwon-si': 30,
    'busan-haeundae-gu': 60,
    'jeju-jeju-si': 20
  }
  
  return crowdLevels[regionCode] || 50
}
