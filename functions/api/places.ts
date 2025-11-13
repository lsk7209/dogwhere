/**
 * Cloudflare Pages Functions - 장소 API
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
  all<T = unknown>(): Promise<D1Result<T>>
}

interface D1Result<T = unknown> {
  results: T[]
  success: boolean
  meta: {
    duration: number
    rows_read: number
    rows_written: number
  }
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context
  const { searchParams } = new URL(request.url)

  try {
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

    // 쿼리 파라미터 파싱
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = (page - 1) * limit
    
    const sido = searchParams.get('sido')
    const sigungu = searchParams.get('sigungu')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'DESC'

    // WHERE 조건 구성
    const conditions: string[] = []
    const params: any[] = []

    if (sido) {
      conditions.push('sido = ?')
      params.push(sido)
    }

    if (sigungu) {
      conditions.push('sigungu = ?')
      params.push(sigungu)
    }

    if (category) {
      conditions.push('category = ?')
      params.push(category)
    }

    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR address LIKE ?)')
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    // 정렬 필드 검증 (SQL injection 방지)
    const allowedSortFields = ['created_at', 'updated_at', 'overall_rating', 'review_count', 'name']
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'
    const sortOrderSafe = sortOrder === 'ASC' ? 'ASC' : 'DESC'

    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM places ${whereClause}`
    const countResult = await db.prepare(countQuery).bind(...params).first() as any
    const total = countResult?.total as number || 0

    // 데이터 조회
    const dataQuery = `
      SELECT * FROM places 
      ${whereClause}
      ORDER BY ${sortField} ${sortOrderSafe}
      LIMIT ? OFFSET ?
    `
    const dataResult = await db
      .prepare(dataQuery)
      .bind(...params, limit, offset)
      .all()

    const data = dataResult.results || []
    const totalPages = Math.ceil(total / limit)

    return new Response(
      JSON.stringify({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        },
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
          code: 'PLACES_FETCH_ERROR'
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
