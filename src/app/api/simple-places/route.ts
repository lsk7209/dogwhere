export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { PlaceRepository, PlaceRow } from '@/lib/database/turso-repository'
import { handleApiError, NotFoundError } from '@/lib/api-error'
import type { SimplePlacesResponse } from '@/types/api'
import type { SimplePlace } from '@/types/simple-place'

// PlaceRow를 SimplePlace로 변환하는 헬퍼 함수
function mapToSimplePlace(row: PlaceRow): SimplePlace {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description || '',
    address: row.address,
    sido: row.sido,
    sigungu: row.sigungu,
    latitude: row.latitude,
    longitude: row.longitude,
    phone: row.phone || undefined,
    website: row.website || undefined,
    rating: row.overall_rating,
    reviewCount: row.review_count,
    imageUrl: (row.main_image as string) || null,
    source: (row.source as string) || 'unknown',
    sourceId: row.id, // Turso에서는 id가 sourceId 역할도 함
    isVerified: !!row.verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// 장소 목록 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repo = new PlaceRepository()

    // 쿼리 파라미터 파싱
    const sido = searchParams.get('sido')
    const sigungu = searchParams.get('sigungu')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')

    let places: SimplePlace[] = []

    if (slug) {
      // 특정 장소 조회
      const place = await repo.findBySlug(slug)
      if (!place) {
        throw new NotFoundError('해당 장소를 찾을 수 없습니다.')
      }
      places = [mapToSimplePlace(place)]
    } else {
      // 필터 적용하여 목록 조회
      const result = await repo.findAll(
        {
          sido: sido || undefined,
          sigungu: sigungu || undefined,
          category: category || undefined
        },
        { field: 'created_at', order: 'DESC' },
        { page: 1, limit: 100 } // 간단한 조회를 위해 상위 100개만
      )
      places = result.data.map(mapToSimplePlace)
    }

    const response: SimplePlacesResponse = {
      success: true,
      data: {
        places,
        total: places.length,
        filters: {
          sido: sido || undefined,
          sigungu: sigungu || undefined,
          category: category || undefined,
          slug: slug || undefined
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5분 캐시
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    return handleApiError(error)
  }
}
