import { Place, PlaceFilter, SearchResult, Review, Region } from '@/types/place'

// 임시 데이터베이스 (실제로는 PostgreSQL, MongoDB 등 사용)
class PlaceDatabase {
  private places: Map<string, Place> = new Map()
  private reviews: Map<string, Review[]> = new Map()
  private regions: Map<string, Region> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  // 샘플 데이터 초기화
  private initializeSampleData() {
    const samplePlaces: Place[] = [
      {
        id: 'place-001',
        name: '멍멍카페 강남점',
        slug: 'meong-meong-cafe-gangnam',
        category: 'cafe',
        subcategory: 'pet-cafe',
        description: '강남구에서 가장 인기 있는 강아지 동반 카페입니다. 넓은 실내 공간과 강아지 전용 놀이터를 갖추고 있어 강아지와 함께 편안하게 시간을 보낼 수 있습니다.',
        shortDescription: '강아지와 함께하는 특별한 카페 시간',
        
        location: {
          address: '서울특별시 강남구 테헤란로 123',
          sido: '서울특별시',
          sigungu: '강남구',
          dong: '역삼동',
          coordinates: {
            latitude: 37.5172,
            longitude: 127.0473
          },
          postalCode: '06292'
        },
        
        contact: {
          phone: '02-1234-5678',
          website: 'https://meongmeongcafe.com',
          instagram: '@meongmeongcafe_gangnam',
          kakao: '@멍멍카페강남'
        },
        
        operation: {
          hours: [
            { day: 'monday', open: '10:00', close: '22:00', isClosed: false },
            { day: 'tuesday', open: '10:00', close: '22:00', isClosed: false },
            { day: 'wednesday', open: '10:00', close: '22:00', isClosed: false },
            { day: 'thursday', open: '10:00', close: '22:00', isClosed: false },
            { day: 'friday', open: '10:00', close: '23:00', isClosed: false },
            { day: 'saturday', open: '09:00', close: '23:00', isClosed: false },
            { day: 'sunday', open: '09:00', close: '22:00', isClosed: false }
          ],
          closedDays: [],
          lastOrder: '21:30',
          breakTime: '15:00-16:00'
        },
        
        petPolicy: {
          allowed: true,
          sizeRestriction: 'all',
          additionalFee: 0,
          requirements: ['예방접종 완료', '건강진단서'],
          facilities: ['petMenu', 'petPlayground', 'petWater', 'petTreats']
        },
        
        amenities: {
          parking: true,
          wifi: true,
          wheelchair: true,
          smoking: false,
          outdoor: true,
          indoor: true,
          restroom: true,
          charging: true,
          custom: ['강아지 전용 놀이터', '펫샤워 시설', '펫시터 상주']
        },
        
        pricing: {
          priceRange: 'medium',
          averagePrice: 6500,
          currency: 'KRW',
          additionalFees: {
            petFee: 0,
            parkingFee: 0
          }
        },
        
        rating: {
          overall: 4.8,
          petFriendly: 4.9,
          service: 4.7,
          atmosphere: 4.8,
          value: 4.6,
          reviewCount: 127
        },
        
        images: {
          main: 'https://images.unsplash.com/photo-1560807341-969085766008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          thumbnail: 'https://images.unsplash.com/photo-1560807341-969085766008?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        
        metadata: {
          verified: true,
          featured: true,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-10-28T00:00:00Z',
          lastVerified: '2024-10-15T00:00:00Z',
          source: 'manual'
        },
        
        seo: {
          title: '멍멍카페 강남점 - 강아지 동반 카페 | 어서오개',
          description: '강남구에서 강아지와 함께 갈 수 있는 최고의 카페. 넓은 놀이터와 펫시터 상주로 안전하고 즐거운 시간을 보내세요.',
          keywords: ['강남구 강아지 카페', '펫프렌들리 카페', '멍멍카페', '강아지 동반 카페'],
          canonicalUrl: 'https://eoseo-ogae.com/place/meong-meong-cafe-gangnam'
        }
      },
      {
        id: 'place-002',
        name: '제주 펫프렌들리 리조트',
        slug: 'jeju-pet-friendly-resort',
        category: 'accommodation',
        subcategory: 'resort',
        description: '제주도 서귀포시에 위치한 강아지 동반 전용 리조트입니다. 바다 전망과 강아지 전용 놀이터를 갖추고 있어 강아지와 함께하는 특별한 휴가를 즐길 수 있습니다.',
        shortDescription: '제주도 바다 전망 펫프렌들리 리조트',
        
        location: {
          address: '제주특별자치도 서귀포시 중문관광단지 123',
          sido: '제주특별자치도',
          sigungu: '서귀포시',
          dong: '중문동',
          coordinates: {
            latitude: 33.2398,
            longitude: 126.4123
          },
          postalCode: '63522'
        },
        
        contact: {
          phone: '064-123-4567',
          website: 'https://jejupetresort.com',
          instagram: '@jeju_pet_resort',
          kakao: '@제주펫리조트'
        },
        
        operation: {
          hours: [
            { day: 'monday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'tuesday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'wednesday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'thursday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'friday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'saturday', open: '00:00', close: '23:59', isClosed: false },
            { day: 'sunday', open: '00:00', close: '23:59', isClosed: false }
          ],
          closedDays: [],
          lastOrder: '22:00',
          breakTime: undefined
        },
        
        petPolicy: {
          allowed: true,
          sizeRestriction: 'all',
          additionalFee: 0,
          requirements: ['예방접종 완료', '건강진단서', '항공사 승인서'],
          facilities: ['petPlayground', 'petShower', 'petBed', 'petWater', 'petTreats', 'petSitting']
        },
        
        amenities: {
          parking: true,
          wifi: true,
          wheelchair: true,
          smoking: false,
          outdoor: true,
          indoor: true,
          restroom: true,
          charging: true,
          custom: ['바다 전망', '강아지 전용 놀이터', '펫샤워 시설', '펫시터 서비스', '렌터카 연계']
        },
        
        pricing: {
          priceRange: 'high',
          averagePrice: 150000,
          currency: 'KRW',
          additionalFees: {
            petFee: 0,
            parkingFee: 0
          }
        },
        
        rating: {
          overall: 4.9,
          petFriendly: 5.0,
          service: 4.8,
          atmosphere: 4.9,
          value: 4.7,
          reviewCount: 89
        },
        
        images: {
          main: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          ],
          thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        
        metadata: {
          verified: true,
          featured: true,
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-10-28T00:00:00Z',
          lastVerified: '2024-10-20T00:00:00Z',
          source: 'manual'
        },
        
        seo: {
          title: '제주 펫프렌들리 리조트 - 강아지 동반 숙박 | 어서오개',
          description: '제주도 서귀포시 바다 전망 펫프렌들리 리조트. 강아지와 함께하는 특별한 제주도 휴가를 즐기세요.',
          keywords: ['제주도 펜션', '강아지 동반 숙박', '펫프렌들리 리조트', '제주도 여행'],
          canonicalUrl: 'https://eoseo-ogae.com/place/jeju-pet-friendly-resort'
        }
      }
    ]

    // 샘플 데이터를 Map에 저장
    samplePlaces.forEach(place => {
      this.places.set(place.id, place)
    })
  }

  // 장소 검색
  async searchPlaces(filter: PlaceFilter, page: number = 1, limit: number = 20): Promise<SearchResult> {
    let results = Array.from(this.places.values())

    // 필터 적용
    if (filter.category && filter.category.length > 0) {
      results = results.filter(place => filter.category!.includes(place.category))
    }

    if (filter.sido) {
      results = results.filter(place => place.location.sido === filter.sido)
    }

    if (filter.sigungu) {
      results = results.filter(place => place.location.sigungu === filter.sigungu)
    }

    if (filter.petSize && filter.petSize !== 'all') {
      results = results.filter(place => 
        place.petPolicy.sizeRestriction === 'all' || 
        place.petPolicy.sizeRestriction === filter.petSize
      )
    }

    if (filter.priceRange) {
      results = results.filter(place => place.pricing.priceRange === filter.priceRange)
    }

    if (filter.amenities && filter.amenities.length > 0) {
      results = results.filter(place => 
        filter.amenities!.every(amenity => 
          place.petPolicy.facilities.includes(amenity)
        )
      )
    }

    if (filter.rating) {
      results = results.filter(place => place.rating.overall >= filter.rating!)
    }

    if (filter.verified) {
      results = results.filter(place => place.metadata.verified)
    }

    if (filter.featured) {
      results = results.filter(place => place.metadata.featured)
    }

    // 거리 기반 필터링 (간단한 구현)
    if (filter.coordinates && filter.distance) {
      results = results.filter(place => {
        const distance = this.calculateDistance(
          filter.coordinates!,
          place.location.coordinates
        )
        return distance <= filter.distance!
      })
    }

    // 정렬 (평점 높은 순)
    results.sort((a, b) => b.rating.overall - a.rating.overall)

    // 페이지네이션
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    return {
      places: paginatedResults,
      total: results.length,
      page,
      limit,
      hasMore: endIndex < results.length,
      filters: filter
    }
  }

  // 장소 상세 정보 조회
  async getPlaceById(id: string): Promise<Place | null> {
    return this.places.get(id) || null
  }

  async getPlaceBySlug(slug: string): Promise<Place | null> {
    for (const place of this.places.values()) {
      if (place.slug === slug) {
        return place
      }
    }
    return null
  }

  // 지역별 장소 조회
  async getPlacesByRegion(sido: string, sigungu?: string): Promise<Place[]> {
    let results = Array.from(this.places.values())
      .filter(place => place.location.sido === sido)

    if (sigungu) {
      results = results.filter(place => place.location.sigungu === sigungu)
    }

    return results.sort((a, b) => b.rating.overall - a.rating.overall)
  }

  // 카테고리별 장소 조회
  async getPlacesByCategory(category: string): Promise<Place[]> {
    return Array.from(this.places.values())
      .filter(place => place.category === category)
      .sort((a, b) => b.rating.overall - a.rating.overall)
  }

  // 추천 장소 조회
  async getRecommendedPlaces(limit: number = 10): Promise<Place[]> {
    return Array.from(this.places.values())
      .filter(place => place.metadata.featured)
      .sort((a, b) => b.rating.overall - a.rating.overall)
      .slice(0, limit)
  }

  // 거리 계산 (Haversine 공식)
  private calculateDistance(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number }
  ): number {
    const R = 6371 // 지구 반지름 (km)
    const dLat = this.toRadians(coord2.latitude - coord1.latitude)
    const dLon = this.toRadians(coord2.longitude - coord1.longitude)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // 장소 추가
  async addPlace(place: Place): Promise<boolean> {
    try {
      this.places.set(place.id, place)
      return true
    } catch (error) {
      console.error('Failed to add place:', error)
      return false
    }
  }

  // 장소 업데이트
  async updatePlace(id: string, updates: Partial<Place>): Promise<boolean> {
    try {
      const existingPlace = this.places.get(id)
      if (!existingPlace) return false

      const updatedPlace = { ...existingPlace, ...updates }
      this.places.set(id, updatedPlace)
      return true
    } catch (error) {
      console.error('Failed to update place:', error)
      return false
    }
  }

  // 장소 삭제
  async deletePlace(id: string): Promise<boolean> {
    try {
      return this.places.delete(id)
    } catch (error) {
      console.error('Failed to delete place:', error)
      return false
    }
  }
}

// 싱글톤 인스턴스
export const placeDB = new PlaceDatabase()

// 편의 함수들
export const searchPlaces = (filter: PlaceFilter, page?: number, limit?: number) => 
  placeDB.searchPlaces(filter, page, limit)

export const getPlaceById = (id: string) => 
  placeDB.getPlaceById(id)

export const getPlaceBySlug = (slug: string) => 
  placeDB.getPlaceBySlug(slug)

export const getPlacesByRegion = (sido: string, sigungu?: string) => 
  placeDB.getPlacesByRegion(sido, sigungu)

export const getPlacesByCategory = (category: string) => 
  placeDB.getPlacesByCategory(category)

export const getRecommendedPlaces = (limit?: number) => 
  placeDB.getRecommendedPlaces(limit)
