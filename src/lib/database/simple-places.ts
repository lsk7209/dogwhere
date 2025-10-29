import { SimplePlace, CollectionResult } from '@/types/simple-place'

// 간단한 인메모리 데이터베이스
class SimplePlaceDatabase {
  private places: SimplePlace[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // 기본 샘플 데이터 (20개 이상)
    const samplePlaces = [
      {
        id: 'sample_1',
        name: '카페 포우즈',
        slug: 'cafe-paws-seoul',
        category: 'cafe',
        description: '강아지와 함께 즐길 수 있는 특별한 카페입니다.',
        address: '서울 마포구 홍대입구역 1번 출구 근처',
        sido: '서울특별시',
        sigungu: '마포구',
        latitude: 37.55,
        longitude: 126.91,
        phone: '02-1234-5678',
        website: 'https://www.cafepaws.com',
        rating: 4.6,
        reviewCount: 213,
        source: 'sample',
        sourceId: 'sample_1',
        isVerified: true,
        createdAt: '2025-10-01T00:00:00Z',
        updatedAt: '2025-10-28T07:00:00Z'
      },
      {
        id: 'sample_2',
        name: '도그 파크 러브',
        slug: 'dog-park-love-gangnam',
        category: 'outdoor',
        description: '강남 도심 속 넓은 강아지 운동장입니다.',
        address: '서울 강남구 테헤란로 123',
        sido: '서울특별시',
        sigungu: '강남구',
        latitude: 37.50,
        longitude: 127.04,
        phone: '02-2345-6789',
        website: 'https://www.dogparklove.com',
        rating: 4.8,
        reviewCount: 456,
        source: 'sample',
        sourceId: 'sample_2',
        isVerified: true,
        createdAt: '2025-09-15T00:00:00Z',
        updatedAt: '2025-10-27T10:00:00Z'
      },
      {
        id: 'sample_3',
        name: '펫 호텔 스위트',
        slug: 'pet-hotel-suite',
        category: 'hotel',
        description: '프리미엄 펫 호텔 서비스',
        address: '서울 송파구 올림픽로 456',
        sido: '서울특별시',
        sigungu: '송파구',
        latitude: 37.52,
        longitude: 127.12,
        rating: 4.8,
        reviewCount: 89,
        source: 'sample',
        sourceId: 'sample_3',
        isVerified: true,
        createdAt: '2025-09-20T00:00:00Z',
        updatedAt: '2025-10-25T08:00:00Z'
      },
      {
        id: 'sample_4',
        name: '강아지 미용실 뷰티',
        slug: 'dog-beauty-salon',
        category: 'grooming',
        description: '전문 강아지 미용 서비스',
        address: '서울 강남구 논현로 789',
        sido: '서울특별시',
        sigungu: '강남구',
        latitude: 37.51,
        longitude: 127.02,
        rating: 4.7,
        reviewCount: 145,
        source: 'sample',
        sourceId: 'sample_4',
        isVerified: true,
        createdAt: '2025-09-10T00:00:00Z',
        updatedAt: '2025-10-26T09:00:00Z'
      },
      {
        id: 'sample_5',
        name: '반려견 병원 헬스',
        slug: 'pet-hospital-health',
        category: 'hospital',
        description: '24시간 응급 진료 가능',
        address: '서울 서초구 서초대로 234',
        sido: '서울특별시',
        sigungu: '서초구',
        latitude: 37.48,
        longitude: 127.03,
        rating: 4.9,
        reviewCount: 312,
        source: 'sample',
        sourceId: 'sample_5',
        isVerified: true,
        createdAt: '2025-08-15T00:00:00Z',
        updatedAt: '2025-10-27T11:00:00Z'
      },
      {
        id: 'sample_6',
        name: '한강공원 강아지 운동장',
        slug: 'hangang-dog-park',
        category: 'outdoor',
        description: '한강변 넓은 강아지 운동 공간',
        address: '서울 영등포구 여의도로 123',
        sido: '서울특별시',
        sigungu: '영등포구',
        latitude: 37.53,
        longitude: 126.94,
        rating: 4.5,
        reviewCount: 567,
        source: 'sample',
        sourceId: 'sample_6',
        isVerified: true,
        createdAt: '2025-07-01T00:00:00Z',
        updatedAt: '2025-10-28T06:00:00Z'
      },
      {
        id: 'sample_7',
        name: '카페 도그하우스',
        slug: 'cafe-doghouse',
        category: 'cafe',
        description: '강아지 전용 메뉴가 있는 카페',
        address: '서울 종로구 인사동길 45',
        sido: '서울특별시',
        sigungu: '종로구',
        latitude: 37.57,
        longitude: 126.98,
        rating: 4.4,
        reviewCount: 198,
        source: 'sample',
        sourceId: 'sample_7',
        isVerified: true,
        createdAt: '2025-08-20T00:00:00Z',
        updatedAt: '2025-10-24T10:00:00Z'
      },
      {
        id: 'sample_8',
        name: '반려견 수영장 아쿠아',
        slug: 'dog-pool-aqua',
        category: 'outdoor',
        description: '여름철 강아지 수영 시설',
        address: '서울 노원구 상계로 456',
        sido: '서울특별시',
        sigungu: '노원구',
        latitude: 37.66,
        longitude: 127.06,
        rating: 4.6,
        reviewCount: 234,
        source: 'sample',
        sourceId: 'sample_8',
        isVerified: true,
        createdAt: '2025-06-10T00:00:00Z',
        updatedAt: '2025-10-23T14:00:00Z'
      },
      {
        id: 'sample_9',
        name: '강아지 카페 랑데부',
        slug: 'cafe-rendezvous',
        category: 'cafe',
        description: '로맨틱한 분위기의 반려견 카페',
        address: '서울 용산구 이태원로 123',
        sido: '서울특별시',
        sigungu: '용산구',
        latitude: 37.54,
        longitude: 126.99,
        rating: 4.5,
        reviewCount: 167,
        source: 'sample',
        sourceId: 'sample_9',
        isVerified: true,
        createdAt: '2025-09-05T00:00:00Z',
        updatedAt: '2025-10-22T15:00:00Z'
      },
      {
        id: 'sample_10',
        name: '펫샵 러블리',
        slug: 'petshop-lovely',
        category: 'shop',
        description: '프리미엄 반려동물 용품 전문점',
        address: '서울 강동구 천호대로 789',
        sido: '서울특별시',
        sigungu: '강동구',
        latitude: 37.54,
        longitude: 127.14,
        rating: 4.7,
        reviewCount: 289,
        source: 'sample',
        sourceId: 'sample_10',
        isVerified: true,
        createdAt: '2025-08-25T00:00:00Z',
        updatedAt: '2025-10-21T16:00:00Z'
      },
      {
        id: 'sample_11',
        name: '도그 트레이닝 센터',
        slug: 'dog-training-center',
        category: 'training',
        description: '전문 강아지 훈련 센터',
        address: '서울 관악구 관악로 234',
        sido: '서울특별시',
        sigungu: '관악구',
        latitude: 37.48,
        longitude: 126.95,
        rating: 4.8,
        reviewCount: 145,
        source: 'sample',
        sourceId: 'sample_11',
        isVerified: true,
        createdAt: '2025-07-15T00:00:00Z',
        updatedAt: '2025-10-20T17:00:00Z'
      },
      {
        id: 'sample_12',
        name: '카페 포 그린',
        slug: 'cafe-for-green',
        category: 'cafe',
        description: '자연 친화적 강아지 카페',
        address: '서울 마포구 상암동 456',
        sido: '서울특별시',
        sigungu: '마포구',
        latitude: 37.57,
        longitude: 126.89,
        rating: 4.6,
        reviewCount: 178,
        source: 'sample',
        sourceId: 'sample_12',
        isVerified: true,
        createdAt: '2025-08-30T00:00:00Z',
        updatedAt: '2025-10-19T18:00:00Z'
      },
      {
        id: 'sample_13',
        name: '반려견 호텔 파라다이스',
        slug: 'pet-hotel-paradise',
        category: 'hotel',
        description: '럭셔리 펫 호텔',
        address: '서울 강남구 압구정로 567',
        sido: '서울특별시',
        sigungu: '강남구',
        latitude: 37.53,
        longitude: 127.04,
        rating: 4.9,
        reviewCount: 234,
        source: 'sample',
        sourceId: 'sample_13',
        isVerified: true,
        createdAt: '2025-07-25T00:00:00Z',
        updatedAt: '2025-10-18T19:00:00Z'
      },
      {
        id: 'sample_14',
        name: '강아지 카페 루시',
        slug: 'cafe-lucy',
        category: 'cafe',
        description: '소형견 전용 카페',
        address: '서울 서초구 서초중앙로 890',
        sido: '서울특별시',
        sigungu: '서초구',
        latitude: 37.49,
        longitude: 127.02,
        rating: 4.5,
        reviewCount: 156,
        source: 'sample',
        sourceId: 'sample_14',
        isVerified: true,
        createdAt: '2025-09-12T00:00:00Z',
        updatedAt: '2025-10-17T20:00:00Z'
      },
      {
        id: 'sample_15',
        name: '도그 파크 센트럴',
        slug: 'dog-park-central',
        category: 'outdoor',
        description: '도심 속 넓은 강아지 놀이터',
        address: '서울 중구 명동길 123',
        sido: '서울특별시',
        sigungu: '중구',
        latitude: 37.56,
        longitude: 126.98,
        rating: 4.4,
        reviewCount: 267,
        source: 'sample',
        sourceId: 'sample_15',
        isVerified: true,
        createdAt: '2025-06-20T00:00:00Z',
        updatedAt: '2025-10-16T21:00:00Z'
      },
      {
        id: 'sample_16',
        name: '펫 스파 리라',
        slug: 'pet-spa-rira',
        category: 'grooming',
        description: '프리미엄 강아지 스파 서비스',
        address: '서울 송파구 잠실로 345',
        sido: '서울특별시',
        sigungu: '송파구',
        latitude: 37.51,
        longitude: 127.10,
        rating: 4.7,
        reviewCount: 198,
        source: 'sample',
        sourceId: 'sample_16',
        isVerified: true,
        createdAt: '2025-08-05T00:00:00Z',
        updatedAt: '2025-10-15T22:00:00Z'
      },
      {
        id: 'sample_17',
        name: '카페 반려',
        slug: 'cafe-banryeo',
        category: 'cafe',
        description: '반려견 가족을 위한 따뜻한 카페',
        address: '서울 종로구 삼일대로 456',
        sido: '서울특별시',
        sigungu: '종로구',
        latitude: 37.57,
        longitude: 126.99,
        rating: 4.6,
        reviewCount: 223,
        source: 'sample',
        sourceId: 'sample_17',
        isVerified: true,
        createdAt: '2025-09-18T00:00:00Z',
        updatedAt: '2025-10-14T23:00:00Z'
      },
      {
        id: 'sample_18',
        name: '반려견 보호소 희망',
        slug: 'dog-shelter-hope',
        category: 'shelter',
        description: '반려견 보호 및 입양 센터',
        address: '서울 강북구 한천로 789',
        sido: '서울특별시',
        sigungu: '강북구',
        latitude: 37.63,
        longitude: 127.02,
        rating: 4.8,
        reviewCount: 445,
        source: 'sample',
        sourceId: 'sample_18',
        isVerified: true,
        createdAt: '2025-05-10T00:00:00Z',
        updatedAt: '2025-10-13T08:00:00Z'
      },
      {
        id: 'sample_19',
        name: '강아지 미용실 프리티',
        slug: 'grooming-pretty',
        category: 'grooming',
        description: '전문 미용사 상주 미용실',
        address: '서울 영등포구 여의공원로 234',
        sido: '서울특별시',
        sigungu: '영등포구',
        latitude: 37.52,
        longitude: 126.93,
        rating: 4.5,
        reviewCount: 167,
        source: 'sample',
        sourceId: 'sample_19',
        isVerified: true,
        createdAt: '2025-07-30T00:00:00Z',
        updatedAt: '2025-10-12T09:00:00Z'
      },
      {
        id: 'sample_20',
        name: '도그 카페 라운지',
        slug: 'dog-cafe-lounge',
        category: 'cafe',
        description: '편안한 분위기의 강아지 카페',
        address: '서울 용산구 한강대로 567',
        sido: '서울특별시',
        sigungu: '용산구',
        latitude: 37.53,
        longitude: 126.96,
        rating: 4.4,
        reviewCount: 189,
        source: 'sample',
        sourceId: 'sample_20',
        isVerified: true,
        createdAt: '2025-08-18T00:00:00Z',
        updatedAt: '2025-10-11T10:00:00Z'
      },
      {
        id: 'sample_21',
        name: '반려견 병원 케어',
        slug: 'pet-hospital-care',
        category: 'hospital',
        description: '종합 반려동물 병원',
        address: '서울 노원구 노원로 890',
        sido: '서울특별시',
        sigungu: '노원구',
        latitude: 37.65,
        longitude: 127.07,
        rating: 4.7,
        reviewCount: 312,
        source: 'sample',
        sourceId: 'sample_21',
        isVerified: true,
        createdAt: '2025-06-25T00:00:00Z',
        updatedAt: '2025-10-10T11:00:00Z'
      },
      {
        id: 'sample_22',
        name: '강아지 카페 스튜디오',
        slug: 'dog-cafe-studio',
        category: 'cafe',
        description: '사진 촬영 가능한 카페',
        address: '서울 강동구 구천면로 123',
        sido: '서울특별시',
        sigungu: '강동구',
        latitude: 37.55,
        longitude: 127.15,
        rating: 4.6,
        reviewCount: 245,
        source: 'sample',
        sourceId: 'sample_22',
        isVerified: true,
        createdAt: '2025-09-25T00:00:00Z',
        updatedAt: '2025-10-09T12:00:00Z'
      }
    ]

    // 샘플 데이터 추가
    samplePlaces.forEach(place => {
      this.places.push(place)
    })
  }

  // 모든 장소 조회
  getAllPlaces(): SimplePlace[] {
    return [...this.places]
  }

  // ID로 장소 조회
  getPlaceById(id: string): SimplePlace | undefined {
    return this.places.find(place => place.id === id)
  }

  // 슬러그로 장소 조회
  getPlaceBySlug(slug: string): SimplePlace | undefined {
    return this.places.find(place => place.slug === slug)
  }

  // 지역별 장소 조회
  getPlacesByRegion(sido: string, sigungu?: string): SimplePlace[] {
    return this.places.filter(place => {
      if (place.sido !== sido) return false
      if (sigungu && place.sigungu !== sigungu) return false
      return true
    })
  }

  // 카테고리별 장소 조회
  getPlacesByCategory(category: string): SimplePlace[] {
    return this.places.filter(place => place.category === category)
  }

  // 검증된 장소만 조회
  getVerifiedPlaces(): SimplePlace[] {
    return this.places.filter(place => place.isVerified)
  }

  // 새 장소 추가
  addPlace(place: Omit<SimplePlace, 'id' | 'createdAt' | 'updatedAt'>): SimplePlace {
    const newPlace: SimplePlace = {
      ...place,
      id: `place_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.places.push(newPlace)
    return newPlace
  }

  // 장소 업데이트
  updatePlace(id: string, updates: Partial<SimplePlace>): SimplePlace | undefined {
    const index = this.places.findIndex(place => place.id === id)
    if (index === -1) return undefined

    this.places[index] = {
      ...this.places[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.places[index]
  }

  // 장소 삭제
  deletePlace(id: string): boolean {
    const initialLength = this.places.length
    this.places = this.places.filter(place => place.id !== id)
    return this.places.length < initialLength
  }

  // 중복 확인 (이름과 주소 기반)
  findDuplicate(name: string, address: string): SimplePlace | undefined {
    return this.places.find(place => 
      place.name === name && place.address === address
    )
  }

  // 통계 조회
  getStats() {
    const total = this.places.length
    const verified = this.places.filter(p => p.isVerified).length
    const pending = total - verified
    
    const sources = this.places.reduce((acc, place) => {
      acc[place.source] = (acc[place.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      verified,
      pending,
      sources
    }
  }
}

// 싱글톤 인스턴스
export const simplePlaceDB = new SimplePlaceDatabase()

// 편의 함수들
export const getAllPlaces = () => simplePlaceDB.getAllPlaces()
export const getPlaceById = (id: string) => simplePlaceDB.getPlaceById(id)
export const getPlaceBySlug = (slug: string) => simplePlaceDB.getPlaceBySlug(slug)
export const getPlacesByRegion = (sido: string, sigungu?: string) => 
  simplePlaceDB.getPlacesByRegion(sido, sigungu)
export const getPlacesByCategory = (category: string) => 
  simplePlaceDB.getPlacesByCategory(category)
export const getVerifiedPlaces = () => simplePlaceDB.getVerifiedPlaces()
export const addPlace = (place: Omit<SimplePlace, 'id' | 'createdAt' | 'updatedAt'>) => 
  simplePlaceDB.addPlace(place)
export const updatePlace = (id: string, updates: Partial<SimplePlace>) => 
  simplePlaceDB.updatePlace(id, updates)
export const deletePlace = (id: string) => simplePlaceDB.deletePlace(id)
export const findDuplicate = (name: string, address: string) => 
  simplePlaceDB.findDuplicate(name, address)
export const getStats = () => simplePlaceDB.getStats()
