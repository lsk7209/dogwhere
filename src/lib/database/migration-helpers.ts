/**
 * 데이터베이스 마이그레이션 헬퍼 함수
 */

import { SimplePlace } from '@/types/simple-place'

/**
 * SimplePlace를 D1 places 테이블 형식으로 변환
 */
export function convertSimplePlaceToD1(place: SimplePlace): Record<string, any> {
  return {
    id: place.id,
    name: place.name,
    slug: place.slug,
    category: place.category,
    subcategory: (place as any).subcategory || null,
    description: place.description || null,
    short_description: place.description?.substring(0, 200) || null,
    
    // 위치 정보
    address: place.address,
    sido: place.sido,
    sigungu: place.sigungu,
    dong: null,
    latitude: place.latitude,
    longitude: place.longitude,
    postal_code: null,
    
    // 연락처 정보
    phone: place.phone || null,
    website: place.website || null,
    instagram: null,
    kakao: null,
    
    // 운영 정보
    operating_hours: null,
    closed_days: null,
    last_order: null,
    break_time: null,
    
    // 강아지 관련 정보
    pet_allowed: true,
    pet_size_restriction: 'all',
    pet_additional_fee: 0,
    pet_requirements: null,
    pet_facilities: null,
    
    // 편의시설
    amenities: null,
    
    // 가격 정보
    price_range: 'medium',
    average_price: null,
    currency: 'KRW',
    additional_fees: null,
    
    // 평점 및 리뷰
    overall_rating: place.rating || 0,
    pet_friendly_rating: place.rating || 0,
    service_rating: place.rating || 0,
    atmosphere_rating: place.rating || 0,
    value_rating: place.rating || 0,
    review_count: place.reviewCount || 0,
    
    // 이미지
    main_image: null,
    gallery_images: null,
    thumbnail_image: null,
    
    // 메타데이터
    verified: place.isVerified ? 1 : 0,
    featured: 0,
    created_at: place.createdAt || new Date().toISOString(),
    updated_at: place.updatedAt || new Date().toISOString(),
    last_verified: null,
    source: place.source || 'manual',
    
    // SEO 정보
    seo_title: null,
    seo_description: null,
    seo_keywords: null,
    canonical_url: null,
  }
}

/**
 * D1 INSERT 쿼리 생성
 */
export function generateInsertQuery(table: string, data: Record<string, any>): { query: string; values: any[] } {
  const columns = Object.keys(data)
  const placeholders = columns.map(() => '?').join(', ')
  const values = columns.map(col => data[col])

  const query = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT(id) DO UPDATE SET
      ${columns.filter(c => c !== 'id').map(c => `${c} = excluded.${c}`).join(', ')}
  `

  return { query, values }
}

