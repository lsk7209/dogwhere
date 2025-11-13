/**
 * 최적화된 블로그 포스트 API 라우트
 * 대규모 컨텐츠를 위한 페이지네이션 및 캐싱 지원
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PostRepository } from '@/lib/database/d1-repository'
import { PostCacheKeys, cachedFetch } from '@/lib/cache/kv-cache'

const CACHE_TTL = {
  LIST: 300,      // 5분
  DETAIL: 3600,   // 1시간
  SEARCH: 180     // 3분
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC'

    const filters = {
      category,
      featured,
      search
    }

    // 캐시 키 생성
    const cacheKey = PostCacheKeys.list(filters, page, limit)

    // 캐시된 데이터 가져오기 또는 DB 조회
    const result = await cachedFetch(
      cacheKey,
      async () => {
        const repository = new PostRepository()
        return await repository.findAll(
          filters,
          { field: sortBy, order: sortOrder },
          { page, limit }
        )
      },
      {
        ttl: search ? CACHE_TTL.SEARCH : CACHE_TTL.LIST,
        tags: ['posts', category || 'all']
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
    console.error('Posts API Error:', error)

    return NextResponse.json({
      success: false,
      error: {
        message: '포스트 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'POSTS_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}

