/**
 * 최적화된 장소 API 라우트
 * 대규모 컨텐츠를 위한 페이지네이션 및 캐싱 지원
 * 
 * 주의: Cloudflare Pages의 output: 'export' 모드에서는 API Routes가 작동하지 않습니다.
 * 대신 functions/api/places.ts를 사용하세요.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { PlaceRepository } from '@/lib/database/d1-repository'
import { PlaceCacheKeys, cachedFetch } from '@/lib/cache/kv-cache'
import { getAllPlaces, getPlacesByRegion, getPlacesByCategory } from '@/lib/database/simple-places'

// 캐시 TTL 설정 (초 단위)
const CACHE_TTL = {
  LIST: 300,      // 5분
  DETAIL: 3600,   // 1시간
  SEARCH: 180     // 3분
}

/**
 * 장소 목록 조회 (페이지네이션 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100) // 최대 100개
    const sido = searchParams.get('sido') || undefined
    const sigungu = searchParams.get('sigungu') || undefined
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const verified = searchParams.get('verified') === 'true' ? true : undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const minRating = searchParams.get('minRating') 
      ? parseFloat(searchParams.get('minRating')!) 
      : undefined
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC'

    // 필터 객체 구성
    const filters = {
      sido,
      sigungu,
      category,
      verified,
      featured,
      minRating,
      search
    }

    // Cloudflare Pages에서는 functions/api/places.ts를 사용
    // 여기서는 개발 환경용 폴백 제공
    
    // 인메모리 DB 사용 (개발 환경)
    let places: any[] = []
    
    if (sido && sigungu) {
      places = getPlacesByRegion(sido, sigungu)
    } else if (sido) {
      places = getPlacesByRegion(sido)
    } else if (category) {
      places = getPlacesByCategory(category)
    } else {
      places = getAllPlaces()
    }

    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase()
      places = places.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.address?.toLowerCase().includes(searchLower)
      )
    }

    // 정렬
    if (sortBy === 'rating') {
      places.sort((a, b) => {
        const ratingA = a.rating || 0
        const ratingB = b.rating || 0
        return sortOrder === 'DESC' ? ratingB - ratingA : ratingA - ratingB
      })
    } else {
      places.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB
      })
    }

    // 페이지네이션
    const total = places.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedPlaces = places.slice(startIndex, startIndex + limit)

    const result = {
      data: paginatedPlaces,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL.LIST}, stale-while-revalidate=60`,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Places API Error:', error)

    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACES_FETCH_ERROR',
        details: env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      }
    }, { status: 500 })
  }
}

