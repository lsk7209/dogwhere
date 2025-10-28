// 강아지 동반 장소 데이터 타입 정의
export interface Place {
  id: string
  name: string
  slug: string
  category: PlaceCategory
  subcategory?: string
  description: string
  shortDescription: string
  
  // 위치 정보
  location: {
    address: string
    sido: string
    sigungu: string
    dong?: string
    coordinates: {
      latitude: number
      longitude: number
    }
    postalCode?: string
  }
  
  // 연락처 정보
  contact: {
    phone?: string
    website?: string
    instagram?: string
    kakao?: string
  }
  
  // 운영 정보
  operation: {
    hours: OperatingHours[]
    closedDays?: string[]
    lastOrder?: string
    breakTime?: string
  }
  
  // 강아지 관련 정보
  petPolicy: {
    allowed: boolean
    sizeRestriction?: 'small' | 'medium' | 'large' | 'all'
    additionalFee?: number
    requirements?: string[]
    facilities: PetFacility[]
  }
  
  // 편의시설
  amenities: {
    parking: boolean
    wifi: boolean
    wheelchair: boolean
    smoking: boolean
    outdoor: boolean
    indoor: boolean
    restroom: boolean
    charging: boolean
    custom: string[]
  }
  
  // 가격 정보
  pricing: {
    priceRange: 'low' | 'medium' | 'high'
    averagePrice?: number
    currency: 'KRW'
    additionalFees?: {
      petFee?: number
      parkingFee?: number
    }
  }
  
  // 평점 및 리뷰
  rating: {
    overall: number
    petFriendly: number
    service: number
    atmosphere: number
    value: number
    reviewCount: number
  }
  
  // 이미지
  images: {
    main: string
    gallery: string[]
    thumbnail: string
  }
  
  // 메타데이터
  metadata: {
    verified: boolean
    featured: boolean
    createdAt: string
    updatedAt: string
    lastVerified?: string
    source: DataSource
  }
  
  // SEO 정보
  seo: {
    title: string
    description: string
    keywords: string[]
    canonicalUrl: string
  }
}

export type PlaceCategory = 
  | 'cafe'           // 카페
  | 'restaurant'     // 식당
  | 'accommodation'  // 숙박
  | 'shopping'       // 쇼핑
  | 'entertainment'  // 놀이/엔터테인먼트
  | 'beauty'         // 미용/케어
  | 'medical'        // 의료
  | 'education'      // 교육/훈련
  | 'outdoor'        // 야외활동
  | 'transport'      // 교통
  | 'service'        // 서비스
  | 'other'          // 기타

export interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  open: string
  close: string
  isClosed: boolean
}

export type PetFacility = 
  | 'petMenu'        // 펫 메뉴
  | 'petPlayground'  // 펫 놀이터
  | 'petShower'      // 펫 샤워
  | 'petBed'         // 펫 침대
  | 'petToilet'      // 펫 화장실
  | 'petWater'       // 펫 물그릇
  | 'petTreats'      // 펫 간식
  | 'petGrooming'    // 펫 그루밍
  | 'petSitting'     // 펫 시팅
  | 'petWalking'     // 펫 산책
  | 'petTraining'    // 펫 훈련
  | 'petMedical'     // 펫 의료

export type DataSource = 
  | 'manual'         // 수동 입력
  | 'google_places'  // 구글 플레이스
  | 'kakao_places'   // 카카오 플레이스
  | 'naver_places'   // 네이버 플레이스
  | 'tripadvisor'    // 트립어드바이저
  | 'yelp'           // 옐프
  | 'user_submit'    // 사용자 제출
  | 'api_crawl'      // API 크롤링

// 리뷰 타입
export interface Review {
  id: string
  placeId: string
  userId: string
  userName: string
  userAvatar?: string
  
  rating: {
    overall: number
    petFriendly: number
    service: number
    atmosphere: number
    value: number
  }
  
  content: string
  images?: string[]
  
  // 메타데이터
  createdAt: string
  updatedAt: string
  verified: boolean
  helpful: number
  reportCount: number
}

// 지역 정보 타입
export interface Region {
  code: string
  name: string
  type: 'sido' | 'sigungu' | 'dong'
  parentCode?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  bounds?: {
    northeast: { latitude: number; longitude: number }
    southwest: { latitude: number; longitude: number }
  }
}

// 검색 필터 타입
export interface PlaceFilter {
  category?: PlaceCategory[]
  subcategory?: string[]
  sido?: string
  sigungu?: string
  petSize?: 'small' | 'medium' | 'large' | 'all'
  priceRange?: 'low' | 'medium' | 'high'
  amenities?: PetFacility[]
  rating?: number
  distance?: number
  coordinates?: { latitude: number; longitude: number }
  verified?: boolean
  featured?: boolean
}

// 검색 결과 타입
export interface SearchResult {
  places: Place[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  filters: PlaceFilter
  suggestions?: string[]
}
