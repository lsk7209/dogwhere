/**
 * Cloudflare Pages Functions - 장소 API
 * Cloudflare 환경에서 직접 실행되는 함수
 */

import { PlaceRepository } from '../../src/lib/database/d1-repository'

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context
  const { searchParams } = new URL(request.url)

  try {
    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
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

    // D1 데이터베이스 가져오기
    const db = env.DB as D1Database
    
    if (!db) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: '데이터베이스 연결을 사용할 수 없습니다.',
            code: 'DB_NOT_AVAILABLE'
          }
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const filters = {
      sido,
      sigungu,
      category,
      verified,
      featured,
      minRating,
      search
    }

    const repository = new PlaceRepository(db)
    
    // 검색 쿼리인 경우
    let result
    if (search) {
      result = await repository.search(search, { page, limit })
    } else {
      // 일반 목록 조회
      result = await repository.findAll(
        filters,
        { field: sortBy, order: sortOrder },
        { page, limit }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
        pagination: result.pagination,
        filters,
        meta: {
          timestamp: new Date().toISOString(),
          version: '2.0'
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        }
      }
    )

  } catch (error) {
    console.error('Places API Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
          code: 'PLACES_FETCH_ERROR',
          details: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : 'Unknown error')
            : undefined
        }
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// OPTIONS 요청 처리 (CORS)
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  })
}

