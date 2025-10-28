import { SimplePlace, CollectionResult } from '@/types/simple-place'

// 간단한 인메모리 데이터베이스
class SimplePlaceDatabase {
  private places: SimplePlace[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // 기본 샘플 데이터
    this.places.push({
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
    })

    this.places.push({
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
