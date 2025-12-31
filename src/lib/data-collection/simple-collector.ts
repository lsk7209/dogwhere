import { SimplePlace, CollectionResult } from '@/types/simple-place'
import { PlaceRepository } from '@/lib/database/turso-repository'

import { logger } from '../logger'

// Google Places API 타입 (간단화)
interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  types: string[]
  international_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
}

// 카카오맵 API 타입 (간단화)
interface KakaoPlaceResult {
  id: string
  place_name: string
  address_name: string
  x: string // longitude
  y: string // latitude
  category_group_code: string
  phone?: string
  place_url?: string
}

// Google Places API 호출
export async function collectFromGoogle(query: string, region?: { latitude: number; longitude: number; radius: number }): Promise<SimplePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_KEY

  if (!apiKey) {
    logger.warn('Google Places API key not found. Returning empty list.')
    return []
  }

  try {
    const searchQuery = encodeURIComponent(query)
    const location = region ? `&location=${region.latitude},${region.longitude}&radius=${region.radius}` : ''

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}${location}&key=${apiKey}`,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`)
    }

    const googlePlaces: GooglePlaceResult[] = data.results || []
    return googlePlaces.map(normalizeGooglePlace)
  } catch (error) {
    logger.error('Google Places API error', error)
    return []
  }
}

// 카카오맵 API 호출
export async function collectFromKakao(query: string, region?: { latitude: number; longitude: number; radius: number }): Promise<SimplePlace[]> {
  const apiKey = process.env.KAKAO_API_KEY

  if (!apiKey) {
    logger.warn('Kakao API key not found. Returning empty list.')
    return []
  }

  try {
    const searchQuery = encodeURIComponent(query)
    const x = region?.longitude?.toString() || '127.0276' // 서울 중심
    const y = region?.latitude?.toString() || '37.4979'
    const radius = region?.radius?.toString() || '20000' // 20km

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchQuery}&x=${x}&y=${y}&radius=${radius}`,
      {
        headers: {
          'Authorization': `KakaoAK ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Kakao API error: ${response.status}`)
    }

    const data = await response.json()
    const kakaoPlaces: KakaoPlaceResult[] = data.documents || []

    return kakaoPlaces.map(normalizeKakaoPlace)
  } catch (error) {
    logger.error('Kakao API error', error)
    return []
  }
}

// Google Places 데이터 정규화
function normalizeGooglePlace(googlePlace: GooglePlaceResult): SimplePlace {
  const addressParts = googlePlace.formatted_address.split(', ').reverse()
  const sido = addressParts[addressParts.length - 1] || ''
  const sigungu = addressParts[addressParts.length - 2] || ''

  const category = googlePlace.types.includes('cafe') ? 'cafe' :
    googlePlace.types.includes('restaurant') ? 'restaurant' :
      googlePlace.types.includes('lodging') ? 'accommodation' :
        googlePlace.types.includes('park') ? 'outdoor' : 'other'

  const slug = generateSlug(googlePlace.name, googlePlace.formatted_address)

  return {
    id: `google_${googlePlace.place_id}`,
    slug,
    name: googlePlace.name,
    category,
    description: `${googlePlace.name}은(는) ${category} 카테고리의 장소입니다. Google Places에서 수집된 정보입니다.`,
    address: googlePlace.formatted_address,
    sido,
    sigungu,
    latitude: googlePlace.geometry.location.lat,
    longitude: googlePlace.geometry.location.lng,
    phone: googlePlace.international_phone_number,
    website: googlePlace.website,
    rating: googlePlace.rating || 0,
    reviewCount: googlePlace.user_ratings_total || 0,
    source: 'Google Places',
    sourceId: googlePlace.place_id,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// 카카오맵 데이터 정규화
function normalizeKakaoPlace(kakaoPlace: KakaoPlaceResult): SimplePlace {
  const addressParts = kakaoPlace.address_name.split(' ')
  const sido = addressParts[0] || ''
  const sigungu = addressParts[1] || ''

  const category = kakaoPlace.category_group_code === 'CE7' ? 'cafe' :
    kakaoPlace.category_group_code === 'FD6' ? 'restaurant' :
      kakaoPlace.category_group_code === 'AD5' ? 'accommodation' :
        kakaoPlace.category_group_code === 'CT1' ? 'shopping' :
          kakaoPlace.category_group_code === 'AT4' ? 'entertainment' :
            kakaoPlace.category_group_code === 'HP8' ? 'medical' : 'other'

  const slug = generateSlug(kakaoPlace.place_name, kakaoPlace.address_name)

  return {
    id: `kakao_${kakaoPlace.id}`,
    slug,
    name: kakaoPlace.place_name,
    category,
    description: `${kakaoPlace.place_name}은(는) ${kakaoPlace.category_group_code} 카테고리의 장소입니다. 카카오맵에서 수집된 정보입니다.`,
    address: kakaoPlace.address_name,
    sido,
    sigungu,
    latitude: parseFloat(kakaoPlace.y),
    longitude: parseFloat(kakaoPlace.x),
    phone: kakaoPlace.phone,
    website: kakaoPlace.place_url,
    rating: 0,
    reviewCount: 0,
    source: 'Kakao Map',
    sourceId: kakaoPlace.id,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// 슬러그 생성 함수
function generateSlug(name: string, address: string): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')

  const addressSlug = address
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '')

  return `${nameSlug}-${addressSlug}-${Date.now().toString().slice(-5)}`
}

// 데이터 통합 및 저장
export async function ingestPlaces(places: SimplePlace[]): Promise<CollectionResult> {
  const repo = new PlaceRepository()
  let addedCount = 0
  let updatedCount = 0
  let skippedCount = 0

  for (const newPlace of places) {
    if (!newPlace.name || !newPlace.address) {
      skippedCount++
      continue
    }

    try {
      // 중복 확인
      const existingPlace = await repo.findDuplicate(newPlace.name, newPlace.address)

      if (existingPlace) {
        // 기존 장소 업데이트
        await repo.update(existingPlace.id, {
          category: newPlace.category,
          description: newPlace.description,
          latitude: newPlace.latitude,
          longitude: newPlace.longitude,
          phone: newPlace.phone,
          website: newPlace.website,
          overall_rating: newPlace.rating,
          review_count: newPlace.reviewCount,
          source: newPlace.source
        })
        updatedCount++
      } else {
        // 새 장소 추가
        await repo.create({
          id: newPlace.id,
          name: newPlace.name,
          slug: newPlace.slug,
          category: newPlace.category,
          description: newPlace.description,
          address: newPlace.address,
          sido: newPlace.sido,
          sigungu: newPlace.sigungu,
          latitude: newPlace.latitude,
          longitude: newPlace.longitude,
          phone: newPlace.phone,
          website: newPlace.website,
          overall_rating: newPlace.rating,
          review_count: newPlace.reviewCount,
          verified: false,
          source: newPlace.source
        })
        addedCount++
      }
    } catch (error) {
      logger.error(`Failed to ingest place ${newPlace.name}`, error)
      skippedCount++
    }
  }

  return {
    added: addedCount,
    updated: updatedCount,
    skipped: skippedCount,
    total: places.length
  }
}
