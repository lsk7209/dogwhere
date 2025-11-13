/**
 * Cloudflare D1 데이터베이스 Repository
 * 대규모 컨텐츠를 위한 최적화된 데이터 접근 레이어
 */

export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export interface FilterParams {
  sido?: string
  sigungu?: string
  category?: string
  verified?: boolean
  featured?: boolean
  search?: string
  minRating?: number
}

export interface SortParams {
  field: string
  order: 'ASC' | 'DESC'
}

import { getD1Database, isD1Available } from './d1-client'

/**
 * D1 데이터베이스 연결 가져오기
 */
function getDB(): D1Database {
  const db = getD1Database()
  
  if (!db) {
    throw new Error(
      'D1 database binding not available. ' +
      'Make sure you have configured D1 binding in wrangler.toml and ' +
      'are running in Cloudflare Workers/Pages environment.'
    )
  }
  
  return db
}

/**
 * 장소 Repository
 */
export class PlaceRepository {
  private db: D1Database | null

  constructor(db?: D1Database) {
    try {
      this.db = db || getDB()
    } catch (error) {
      // D1이 사용 불가능한 환경 (로컬 개발 등)
      this.db = null
      if (process.env.NODE_ENV === 'development') {
        console.warn('D1 database not available, using fallback')
      }
    }
  }

  /**
   * D1 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    return this.db !== null
  }

  /**
   * 페이지네이션된 장소 목록 조회
   */
  async findAll(
    filters: FilterParams = {},
    sort: SortParams = { field: 'created_at', order: 'DESC' },
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginationResult<any>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    // WHERE 조건 구성
    const conditions: string[] = []
    const params: any[] = []

    if (filters.sido) {
      conditions.push('sido = ?')
      params.push(filters.sido)
    }

    if (filters.sigungu) {
      conditions.push('sigungu = ?')
      params.push(filters.sigungu)
    }

    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }

    if (filters.verified !== undefined) {
      conditions.push('verified = ?')
      params.push(filters.verified ? 1 : 0)
    }

    if (filters.featured !== undefined) {
      conditions.push('featured = ?')
      params.push(filters.featured ? 1 : 0)
    }

    if (filters.minRating) {
      conditions.push('overall_rating >= ?')
      params.push(filters.minRating)
    }

    if (filters.search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR address LIKE ?)')
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    // 정렬 필드 검증 (SQL injection 방지)
    const allowedSortFields = [
      'created_at', 'updated_at', 'overall_rating', 
      'review_count', 'name', 'featured'
    ]
    const sortField = allowedSortFields.includes(sort.field) 
      ? sort.field 
      : 'created_at'
    const sortOrder = sort.order === 'ASC' ? 'ASC' : 'DESC'

    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM places ${whereClause}`
    const countResult = await this.db.prepare(countQuery).bind(...params).first()
    const total = countResult?.total as number || 0

    // 데이터 조회
    const dataQuery = `
      SELECT * FROM places 
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `
    const dataResult = await this.db
      .prepare(dataQuery)
      .bind(...params, limit, offset)
      .all()

    const data = dataResult.results || []
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  }

  /**
   * 슬러그로 장소 조회
   */
  async findBySlug(slug: string): Promise<any | null> {
    const result = await this.db
      .prepare('SELECT * FROM places WHERE slug = ?')
      .bind(slug)
      .first()

    return result || null
  }

  /**
   * ID로 장소 조회
   */
  async findById(id: string): Promise<any | null> {
    const result = await this.db
      .prepare('SELECT * FROM places WHERE id = ?')
      .bind(id)
      .first()

    return result || null
  }

  /**
   * 지역별 장소 개수 조회 (통계용)
   */
  async countByRegion(sido?: string, sigungu?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as total FROM places'
    const params: any[] = []

    if (sido && sigungu) {
      query += ' WHERE sido = ? AND sigungu = ?'
      params.push(sido, sigungu)
    } else if (sido) {
      query += ' WHERE sido = ?'
      params.push(sido)
    }

    const result = await this.db.prepare(query).bind(...params).first()
    return result?.total as number || 0
  }

  /**
   * 카테고리별 장소 개수 조회
   */
  async countByCategory(category: string): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as total FROM places WHERE category = ?')
      .bind(category)
      .first()

    return result?.total as number || 0
  }

  /**
   * 검색 (FTS - Full Text Search)
   */
  async search(
    query: string,
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginationResult<any>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit
    const searchTerm = `%${query}%`

    // 전체 개수
    const countResult = await this.db
      .prepare(`
        SELECT COUNT(*) as total FROM places 
        WHERE name LIKE ? OR description LIKE ? OR address LIKE ?
      `)
      .bind(searchTerm, searchTerm, searchTerm)
      .first()

    const total = countResult?.total as number || 0

    // 데이터 조회
    const dataResult = await this.db
      .prepare(`
        SELECT * FROM places 
        WHERE name LIKE ? OR description LIKE ? OR address LIKE ?
        ORDER BY 
          CASE 
            WHEN name LIKE ? THEN 1
            WHEN description LIKE ? THEN 2
            ELSE 3
          END,
          overall_rating DESC
        LIMIT ? OFFSET ?
      `)
      .bind(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset)
      .all()

    const data = dataResult.results || []
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  }
}

/**
 * 블로그 포스트 Repository
 */
export class PostRepository {
  private db: D1Database

  constructor(db?: D1Database) {
    this.db = db || getDB()
  }

  /**
   * 페이지네이션된 포스트 목록 조회
   */
  async findAll(
    filters: { category?: string; featured?: boolean; search?: string } = {},
    sort: SortParams = { field: 'date', order: 'DESC' },
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<any>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: any[] = []

    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }

    if (filters.featured !== undefined) {
      conditions.push('featured = ?')
      params.push(filters.featured ? 1 : 0)
    }

    if (filters.search) {
      conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)')
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    const allowedSortFields = ['date', 'created_at', 'title', 'featured']
    const sortField = allowedSortFields.includes(sort.field) 
      ? sort.field 
      : 'date'
    const sortOrder = sort.order === 'ASC' ? 'ASC' : 'DESC'

    // 전체 개수
    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as total FROM posts ${whereClause}`)
      .bind(...params)
      .first()

    const total = countResult?.total as number || 0

    // 데이터 조회
    const dataResult = await this.db
      .prepare(`
        SELECT id, title, slug, excerpt, category, date, image, featured 
        FROM posts 
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all()

    const data = dataResult.results || []
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  }

  /**
   * 슬러그로 포스트 조회
   */
  async findBySlug(slug: string): Promise<any | null> {
    const result = await this.db
      .prepare('SELECT * FROM posts WHERE slug = ?')
      .bind(slug)
      .first()

    return result || null
  }

  /**
   * 모든 슬러그 조회 (generateStaticParams용)
   */
  async findAllSlugs(): Promise<string[]> {
    const result = await this.db
      .prepare('SELECT slug FROM posts ORDER BY date DESC')
      .all()

    return (result.results || []).map((row: any) => row.slug)
  }

  /**
   * 카테고리별 포스트 개수
   */
  async countByCategory(): Promise<Record<string, number>> {
    const result = await this.db
      .prepare(`
        SELECT category, COUNT(*) as count 
        FROM posts 
        GROUP BY category
      `)
      .all()

    const counts: Record<string, number> = {}
    for (const row of result.results || []) {
      counts[(row as any).category] = (row as any).count
    }

    return counts
  }
}

/**
 * 이벤트 Repository
 */
export class EventRepository {
  private db: D1Database

  constructor(db?: D1Database) {
    this.db = db || getDB()
  }

  /**
   * 페이지네이션된 이벤트 목록 조회
   */
  async findAll(
    filters: {
      region?: string
      sido?: string
      sigungu?: string
      eventType?: string
      startDate?: string
      endDate?: string
    } = {},
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginationResult<any>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: any[] = []

    if (filters.sido) {
      conditions.push('sido = ?')
      params.push(filters.sido)
    }

    if (filters.sigungu) {
      conditions.push('sigungu = ?')
      params.push(filters.sigungu)
    }

    if (filters.eventType) {
      conditions.push('event_type = ?')
      params.push(filters.eventType)
    }

    if (filters.startDate) {
      conditions.push('start_date >= ?')
      params.push(filters.startDate)
    }

    if (filters.endDate) {
      conditions.push('end_date <= ?')
      params.push(filters.endDate)
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    // 전체 개수
    const countResult = await this.db
      .prepare(`SELECT COUNT(*) as total FROM events ${whereClause}`)
      .bind(...params)
      .first()

    const total = countResult?.total as number || 0

    // 데이터 조회
    const dataResult = await this.db
      .prepare(`
        SELECT * FROM events 
        ${whereClause}
        ORDER BY start_date ASC
        LIMIT ? OFFSET ?
      `)
      .bind(...params, limit, offset)
      .all()

    const data = dataResult.results || []
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    }
  }

  /**
   * 슬러그로 이벤트 조회
   */
  async findBySlug(slug: string): Promise<any | null> {
    const result = await this.db
      .prepare('SELECT * FROM events WHERE slug = ?')
      .bind(slug)
      .first()

    return result || null
  }
}

