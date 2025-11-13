/**
 * 최적화된 장소 API 라우트
 * 대규모 컨텐츠를 위한 페이지네이션 및 캐싱 지원
 */

export const dynamic = 'force-dynamic' // 동적 라우트로 변경

import { NextRequest, NextResponse } from 'next/server'
import { PlaceRepository } from '@/lib/database/d1-repository'
import { PlaceCacheKeys, cachedFetch } from '@/lib/cache/kv-cache'

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

    // 캐시 키 생성
    const cacheKey = PlaceCacheKeys.list(filters, page, limit)

    // 캐시된 데이터 가져오기 또는 DB 조회
    const result = await cachedFetch(
      cacheKey,
      async () => {
        const repository = new PlaceRepository()
        
        // 검색 쿼리인 경우
        if (search) {
          return await repository.search(search, { page, limit })
        }
        
        // 일반 목록 조회
        return await repository.findAll(
          filters,
          { field: sortBy, order: sortOrder },
          { page, limit }
        )
      },
      {
        ttl: search ? CACHE_TTL.SEARCH : CACHE_TTL.LIST,
        tags: ['places', category || 'all']
      }
    )

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
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      }
    }, { status: 500 })
  }
}

