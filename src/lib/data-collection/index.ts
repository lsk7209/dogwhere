// 데이터 수집 및 관리 시스템
import { Place, DataSource } from '@/types/place'

// 외부 API 연동을 위한 인터페이스
interface ExternalPlaceData {
  name: string
  address: string
  coordinates: { latitude: number; longitude: number }
  phone?: string
  website?: string
  rating?: number
  category?: string
  description?: string
  images?: string[]
}

// Google Places API 연동
export class GooglePlacesCollector {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchPetFriendlyPlaces(
    location: string,
    radius: number = 5000
  ): Promise<ExternalPlaceData[]> {
    try {
      // Google Places API 호출
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=pet+friendly+${location}&radius=${radius}&key=${this.apiKey}`
      )
      
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API Error: ${data.status}`)
      }

      return data.results.map((place: any) => ({
        name: place.name,
        address: place.formatted_address,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        phone: place.formatted_phone_number,
        website: place.website,
        rating: place.rating,
        category: this.mapGoogleCategory(place.types),
        description: place.editorial_summary?.overview,
        images: place.photos?.map((photo: any) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        )
      }))
    } catch (error) {
      console.error('Google Places API Error:', error)
      return []
    }
  }

  private mapGoogleCategory(types: string[]): string {
    const categoryMap: Record<string, string> = {
      'cafe': 'cafe',
      'restaurant': 'restaurant',
      'lodging': 'accommodation',
      'shopping_mall': 'shopping',
      'amusement_park': 'entertainment',
      'beauty_salon': 'beauty',
      'veterinary_care': 'medical',
      'park': 'outdoor'
    }

    for (const type of types) {
      if (categoryMap[type]) {
        return categoryMap[type]
      }
    }
    return 'other'
  }
}

// 카카오 플레이스 API 연동
export class KakaoPlacesCollector {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchPetFriendlyPlaces(
    query: string,
    x: number,
    y: number,
    radius: number = 5000
  ): Promise<ExternalPlaceData[]> {
    try {
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${x}&y=${y}&radius=${radius}`,
        {
          headers: {
            'Authorization': `KakaoAK ${this.apiKey}`
          }
        }
      )

      const data = await response.json()

      return data.documents.map((place: any) => ({
        name: place.place_name,
        address: place.address_name,
        coordinates: {
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x)
        },
        phone: place.phone,
        website: place.place_url,
        category: this.mapKakaoCategory(place.category_name),
        description: place.place_name
      }))
    } catch (error) {
      console.error('Kakao Places API Error:', error)
      return []
    }
  }

  private mapKakaoCategory(categoryName: string): string {
    const categoryMap: Record<string, string> = {
      '카페': 'cafe',
      '음식점': 'restaurant',
      '숙박': 'accommodation',
      '쇼핑': 'shopping',
      '문화,예술': 'entertainment',
      '미용': 'beauty',
      '의료': 'medical',
      '공원': 'outdoor'
    }

    for (const [korean, english] of Object.entries(categoryMap)) {
      if (categoryName.includes(korean)) {
        return english
      }
    }
    return 'other'
  }
}

// 데이터 정규화 및 변환
export class PlaceDataNormalizer {
  static normalizeExternalData(
    externalData: ExternalPlaceData,
    source: DataSource
  ): Partial<Place> {
    return {
      name: externalData.name,
      description: externalData.description || `${externalData.name}에서 강아지와 함께하는 시간을 보내세요.`,
      shortDescription: externalData.description || externalData.name,
      
      location: {
        address: externalData.address,
        sido: this.extractSido(externalData.address),
        sigungu: this.extractSigungu(externalData.address),
        coordinates: externalData.coordinates
      },
      
      contact: {
        phone: externalData.phone,
        website: externalData.website
      },
      
      operation: {
        hours: [] // 기본값, 실제로는 별도 API 호출 필요
      },
      
      petPolicy: {
        allowed: true, // 펫프렌들리 검색 결과이므로 기본값 true
        sizeRestriction: 'all',
        additionalFee: 0,
        requirements: ['예방접종 완료'],
        facilities: ['petWater'] // 기본 시설
      },
      
      amenities: {
        parking: false,
        wifi: true,
        wheelchair: false,
        smoking: false,
        outdoor: false,
        indoor: true,
        restroom: true,
        charging: false,
        custom: []
      },
      
      pricing: {
        priceRange: 'medium',
        currency: 'KRW'
      },
      
      rating: {
        overall: externalData.rating || 0,
        petFriendly: 0,
        service: 0,
        atmosphere: 0,
        value: 0,
        reviewCount: 0
      },
      
      images: {
        main: externalData.images?.[0] || '',
        gallery: externalData.images || [],
        thumbnail: externalData.images?.[0] || ''
      },
      
      metadata: {
        verified: false,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source
      },
      
      seo: {
        title: `${externalData.name} - 강아지 동반 장소 | 어서오개`,
        description: `${externalData.name}에서 강아지와 함께하는 특별한 시간을 보내세요.`,
        keywords: [externalData.name, '강아지 동반', '펫프렌들리'],
        canonicalUrl: `https://eoseo-ogae.com/place/${this.generateSlug(externalData.name)}`
      }
    }
  }

  private static extractSido(address: string): string {
    const sidoPattern = /(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)/
    const match = address.match(sidoPattern)
    return match ? match[1] : '기타'
  }

  private static extractSigungu(address: string): string {
    const sigunguPattern = /(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s+([가-힣]+(?:구|군|시))/
    const match = address.match(sigunguPattern)
    return match ? match[2] : '기타'
  }

  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }
}

// 데이터 수집 스케줄러
export class DataCollectionScheduler {
  private googleCollector: GooglePlacesCollector
  private kakaoCollector: KakaoPlacesCollector

  constructor(googleApiKey: string, kakaoApiKey: string) {
    this.googleCollector = new GooglePlacesCollector(googleApiKey)
    this.kakaoCollector = new KakaoPlacesCollector(kakaoApiKey)
  }

  async collectPlacesForRegion(sido: string, sigungu?: string): Promise<Place[]> {
    const places: Place[] = []
    
    // 검색 쿼리 구성
    const queries = [
      '강아지 카페',
      '펫프렌들리 카페',
      '강아지 동반 식당',
      '펫프렌들리 펜션',
      '강아지 놀이터',
      '펫샵',
      '동물병원'
    ]

    for (const query of queries) {
      try {
        // Google Places에서 수집
        const googleResults = await this.googleCollector.searchPetFriendlyPlaces(
          `${query} ${sido} ${sigungu || ''}`
        )

        // 카카오 플레이스에서 수집
        const kakaoResults = await this.kakaoCollector.searchPetFriendlyPlaces(
          `${query} ${sido} ${sigungu || ''}`,
          37.5665, // 서울 중심 좌표 (실제로는 지역별 좌표 사용)
          126.9780
        )

        // 데이터 정규화 및 변환
        const normalizedGoogle = googleResults.map(data => 
          PlaceDataNormalizer.normalizeExternalData(data, 'google_places')
        )

        const normalizedKakao = kakaoResults.map(data => 
          PlaceDataNormalizer.normalizeExternalData(data, 'kakao_places')
        )

        // Place 객체 생성
        const googlePlaces = normalizedGoogle.map((data, index) => ({
          id: `google_${Date.now()}_${index}`,
          slug: data.seo?.canonicalUrl?.split('/').pop() || `place-${Date.now()}-${index}`,
          category: data.category || 'other',
          ...data
        } as Place))

        const kakaoPlaces = normalizedKakao.map((data, index) => ({
          id: `kakao_${Date.now()}_${index}`,
          slug: data.seo?.canonicalUrl?.split('/').pop() || `place-${Date.now()}-${index}`,
          category: data.category || 'other',
          ...data
        } as Place))

        places.push(...googlePlaces, ...kakaoPlaces)
      } catch (error) {
        console.error(`Error collecting places for query "${query}":`, error)
      }
    }

    // 중복 제거 (이름과 주소 기준)
    const uniquePlaces = this.removeDuplicates(places)

    return uniquePlaces
  }

  private removeDuplicates(places: Place[]): Place[] {
    const seen = new Set<string>()
    return places.filter(place => {
      const key = `${place.name}-${place.location.address}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // 정기적인 데이터 수집 작업
  async scheduleDataCollection(): Promise<void> {
    const regions = [
      { sido: '서울특별시', sigungu: '강남구' },
      { sido: '서울특별시', sigungu: '마포구' },
      { sido: '서울특별시', sigungu: '홍대' },
      { sido: '제주특별자치도' },
      { sido: '경기도', sigungu: '수원시' }
    ]

    for (const region of regions) {
      try {
        console.log(`Collecting places for ${region.sido} ${region.sigungu || ''}`)
        const places = await this.collectPlacesForRegion(region.sido, region.sigungu)
        console.log(`Collected ${places.length} places for ${region.sido} ${region.sigungu || ''}`)
        
        // 실제로는 데이터베이스에 저장
        // await savePlacesToDatabase(places)
      } catch (error) {
        console.error(`Error collecting places for ${region.sido} ${region.sigungu || ''}:`, error)
      }
    }
  }
}

// 사용 예시
export const dataCollectionExample = async () => {
  const googleApiKey = process.env.GOOGLE_PLACES_KEY || ''
  const kakaoApiKey = process.env.KAKAO_API_KEY || ''
  
  if (!googleApiKey || !kakaoApiKey) {
    console.error('API keys not found')
    return
  }

  const scheduler = new DataCollectionScheduler(googleApiKey, kakaoApiKey)
  await scheduler.scheduleDataCollection()
}
