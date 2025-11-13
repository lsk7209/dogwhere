/**
 * Cloudflare Pages Functions - 장소 상세 API
 */

import { PlaceRepository } from '../../../src/lib/database/d1-repository'

export async function onRequest(context: EventContext<{ slug: string }>): Promise<Response> {
  const { request, env, params } = context

  try {
    const { slug } = params

    if (!slug) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: '슬러그가 필요합니다.',
            code: 'SLUG_REQUIRED'
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

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

    const repository = new PlaceRepository(db)
    const place = await repository.findBySlug(slug)

    if (!place) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: '해당 장소를 찾을 수 없습니다.',
            code: 'PLACE_NOT_FOUND'
          }
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: place,
        meta: {
          timestamp: new Date().toISOString(),
          version: '2.0'
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )

  } catch (error) {
    console.error('Place Detail API Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
          code: 'PLACE_FETCH_ERROR'
        }
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

