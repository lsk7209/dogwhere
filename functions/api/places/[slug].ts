/**
 * Cloudflare Pages Functions - 장소 상세 API
 * 독립적으로 실행 가능한 최소한의 코드
 */

interface Env {
  DB: D1Database
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(): Promise<T | null>
}

export async function onRequest(context: { request: Request; env: Env; params: { slug: string } }): Promise<Response> {
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
    const db = env.DB
    
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

    // 슬러그로 장소 조회
    const result = await db
      .prepare('SELECT * FROM places WHERE slug = ?')
      .bind(slug)
      .first()

    if (!result) {
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
        data: result,
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
