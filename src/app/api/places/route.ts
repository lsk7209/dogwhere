/**
 * 최적화된 장소 API 라우트 (Turso 기반)
 */

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { PlaceRepository, PlaceRow } from '@/lib/database/turso-repository'
import { handleApiError } from '@/lib/api-error'
import type { SimplePlace } from '@/types/simple-place'

// 캐시 TTL 설정 (초 단위)
const CACHE_TTL = {
  LIST: 300,      // 5분
  DETAIL: 3600,   // 1시간
  SEARCH: 180     // 3분
}

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
    sourceId: row.id,
    isVerified: !!row.verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

/**
 * 장소 목록 조회 (페이지네이션 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repo = new PlaceRepository()

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const sido = searchParams.get('sido') || undefined
    const sigungu = searchParams.get('sigungu') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const verified = searchParams.get('verified') === 'true' ? true : undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC'

    // 필터 객체 구성
    const filters = {
      sido,
      sigungu,
      category,
      verified,
      featured,
      search
    }

    // Repository를 통해 데이터 조회
    let result
    if (search) {
      result = await repo.search(search, { page, limit })
    } else {
      result = await repo.findAll(
        { sido, sigungu, category, verified, featured },
        { field: sortBy === 'rating' ? 'overall_rating' : 'created_at', order: sortOrder },
        { page, limit }
      )
    }

    const simplePlaces = result.data.map(mapToSimplePlace)

    return NextResponse.json({
      success: true,
      data: simplePlaces,
      pagination: result.pagination,
      filters,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0 (Turso)'
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL.LIST}, stale-while-revalidate=60`,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    return handleApiError(error)
  }
}
