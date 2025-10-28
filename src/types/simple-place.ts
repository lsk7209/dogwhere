// 간단한 장소 데이터 타입 정의
export interface SimplePlace {
  id: string
  name: string
  slug: string
  category: string
  description: string
  address: string
  sido: string
  sigungu: string
  latitude: number
  longitude: number
  phone?: string
  website?: string
  rating: number
  reviewCount: number
  source: string
  sourceId: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// 데이터 수집 결과 타입
export interface CollectionResult {
  added: number
  updated: number
  skipped: number
  total: number
}

// API 키 상태 타입
export interface ApiKeysStatus {
  google: boolean
  kakao: boolean
  openai: boolean
}
