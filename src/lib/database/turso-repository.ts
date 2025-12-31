/**
 * Turso 데이터베이스 Repository
 * D1 Repository와 호환되는 인터페이스 제공
 */

import { getTursoDatabase, isTursoAvailable } from './turso-client'
import { logger } from '../logger'
import { env } from '@/lib/env'

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

/**
 * 데이터베이스에서 조회한 Place 행 타입
 */
export interface PlaceRow {
  id: string
  name: string
  slug: string
  category: string
  subcategory?: string | null
  description: string
  short_description: string
  address: string
  sido: string
  sigungu: string
  dong?: string | null
  latitude: number
  longitude: number
  postal_code?: string | null
  phone?: string | null
  website?: string | null
  instagram?: string | null
  kakao?: string | null
  overall_rating: number
  pet_friendly_rating: number
  service_rating: number
  atmosphere_rating: number
  value_rating: number
  review_count: number
  verified: number | boolean
  featured: number | boolean
  created_at: string
  updated_at: string
  [key: string]: unknown
}

/**
 * 데이터베이스에서 조회한 Post 행 타입
 */
export interface PostRow {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  read_time?: string | null
  image?: string | null // Keep image for now, as thumbnail_url is added, not replaced based on instruction
  location?: string | null
  last_modified?: string | null
  seo_keywords?: string | null
  geo_latitude?: number | null
  geo_longitude?: number | null
  geo_address?: string | null
  featured: number | boolean
  thumbnail_url?: string | null
  thumbnail_prompt?: string | null
  created_at: string
  updated_at: string
  [key: string]: unknown
}

/**
 * 데이터베이스에서 조회한 Event 행 타입
 */
export interface EventRow {
  id: string
  name: string
  slug: string
  event_type: string
  description: string
  address: string
  sido: string
  sigungu: string
  latitude: number
  longitude: number
  start_date: string
  end_date: string
  image?: string | null
  website?: string | null
  created_at: string
  updated_at: string
  [key: string]: unknown
}

/**
 * Turso 데이터베이스 연결 가져오기
 */
function getDB() {
  if (!isTursoAvailable()) {
    throw new Error(
      'Turso database is not available. ' +
      'Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.'
    )
  }

  return getTursoDatabase()
}

/**
 * 장소 Repository
 */
export class PlaceRepository {
  private db: ReturnType<typeof getTursoDatabase> | null

  constructor(db?: ReturnType<typeof getTursoDatabase>) {
    try {
      this.db = db || getDB()
    } catch (error) {
      this.db = null
      if (env.NODE_ENV === 'development') {
        logger.warn('Turso database not available, using fallback')
      }
    }
  }

  /**
   * Turso 사용 가능 여부 확인
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
  ): Promise<PaginationResult<PlaceRow>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    // WHERE 조건 구성
    const conditions: string[] = []
    const params: (string | number | boolean)[] = []

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

    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM places ${whereClause}`
    const countResult = await this.db.execute({
      sql: countQuery,
      args: params,
    })
    const total = (countResult.rows[0]?.total as number) || 0

    // 데이터 조회
    const dataQuery = `
      SELECT * FROM places 
      ${whereClause}
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ? OFFSET ?
    `
    const dataResult = await this.db.execute({
      sql: dataQuery,
      args: [...params, limit, offset],
    })

    const data: PlaceRow[] = dataResult.rows.map(row => {
      const obj: Record<string, unknown> = {}
      dataResult.columns.forEach((col, i) => {
        obj[col] = row[i]
      })
      return obj as PlaceRow
    })

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
  async findBySlug(slug: string): Promise<PlaceRow | null> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT * FROM places WHERE slug = ?',
      args: [slug],
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const obj: Record<string, unknown> = {}
    result.columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj as PlaceRow
  }

  /**
   * ID로 장소 조회
   */
  async findById(id: string): Promise<PlaceRow | null> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT * FROM places WHERE id = ?',
      args: [id],
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const obj: Record<string, unknown> = {}
    result.columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj as PlaceRow
  }

  /**
   * 지역별 장소 개수 조회 (통계용)
   */
  async countByRegion(sido?: string, sigungu?: string): Promise<number> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    let query = 'SELECT COUNT(*) as total FROM places'
    const params: (string | number)[] = []

    if (sido && sigungu) {
      query += ' WHERE sido = ? AND sigungu = ?'
      params.push(sido, sigungu)
    } else if (sido) {
      query += ' WHERE sido = ?'
      params.push(sido)
    }

    const result = await this.db.execute({
      sql: query,
      args: params,
    })

    return (result.rows[0]?.total as number) || 0
  }

  /**
   * 카테고리별 장소 개수 조회
   */
  async countByCategory(category: string): Promise<number> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT COUNT(*) as total FROM places WHERE category = ?',
      args: [category],
    })

    return (result.rows[0]?.total as number) || 0
  }

  /**
   * 검색 (FTS - Full Text Search)
   */
  async search(
    query: string,
    pagination: PaginationParams = { page: 1, limit: 20 }
  ): Promise<PaginationResult<PlaceRow>> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const { page, limit } = pagination
    const offset = (page - 1) * limit
    const searchTerm = `%${query}%`

    // 전체 개수
    const countResult = await this.db.execute({
      sql: `
        SELECT COUNT(*) as total FROM places 
        WHERE name LIKE ? OR description LIKE ? OR address LIKE ?
      `,
      args: [searchTerm, searchTerm, searchTerm],
    })
    const total = (countResult.rows[0]?.total as number) || 0

    // 데이터 조회
    const dataResult = await this.db.execute({
      sql: `
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
      `,
      args: [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset],
    })

    const data: PlaceRow[] = dataResult.rows.map(row => {
      const obj: Record<string, unknown> = {}
      dataResult.columns.forEach((col, i) => {
        obj[col] = row[i]
      })
      return obj as PlaceRow
    })

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
   * 새 장소 추가
   */
  async create(data: Partial<PlaceRow>): Promise<PlaceRow> {
    if (!this.db) throw new Error('Turso database is not available')

    const id = data.id || `place_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const columns = [
      'id', 'name', 'slug', 'category', 'description', 'address', 'sido', 'sigungu',
      'latitude', 'longitude', 'phone', 'website', 'overall_rating', 'review_count',
      'verified', 'created_at', 'updated_at', 'source'
    ]

    const values = [
      id,
      data.name,
      data.slug,
      data.category,
      data.description || '',
      data.address,
      data.sido,
      data.sigungu,
      data.latitude,
      data.longitude,
      data.phone || null,
      data.website || null,
      data.overall_rating || 0,
      data.review_count || 0,
      data.verified ? 1 : 0,
      now,
      now,
      data.source || 'manual'
    ]

    const placeholders = values.map(() => '?').join(', ')

    await this.db.execute({
      sql: `INSERT INTO places (${columns.join(', ')}) VALUES (${placeholders})`,
      args: values as any[],
    })

    const newPlace = await this.findById(id)
    if (!newPlace) throw new Error('Failed to create place')
    return newPlace
  }

  /**
   * 장소 업데이트
   */
  async update(id: string, data: Partial<PlaceRow>): Promise<PlaceRow | null> {
    if (!this.db) throw new Error('Turso database is not available')

    const updates: string[] = []
    const params: (string | number | boolean | null)[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (['name', 'category', 'description', 'address', 'sido', 'sigungu', 'latitude', 'longitude', 'phone', 'website', 'overall_rating', 'review_count', 'verified', 'source'].includes(key)) {
        updates.push(`${key} = ?`)
        params.push(key === 'verified' ? (value ? 1 : 0) : (value === undefined ? null : value as any))
      }
    })

    if (updates.length === 0) return this.findById(id)

    updates.push('updated_at = ?')
    params.push(new Date().toISOString())

    await this.db.execute({
      sql: `UPDATE places SET ${updates.join(', ')} WHERE id = ?`,
      args: ([...params, id] as (string | number | boolean | null)[]) as any[],
    })

    return this.findById(id)
  }

  /**
   * 중복 확인 (이름과 주소 기반)
   */
  async findDuplicate(name: string, address: string): Promise<PlaceRow | null> {
    if (!this.db) throw new Error('Turso database is not available')

    const result = await this.db.execute({
      sql: 'SELECT * FROM places WHERE name = ? AND address = ?',
      args: [name, address],
    })

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    const obj: Record<string, unknown> = {}
    result.columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj as PlaceRow
  }

  /**
   * 통계 조회
   */
  async getStats() {
    if (!this.db) throw new Error('Turso database is not available')

    const result = await this.db.execute({
      sql: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified,
          SUM(CASE WHEN verified = 0 THEN 1 ELSE 0 END) as pending
        FROM places
      `,
      args: []
    })

    const sourceResult = await this.db.execute({
      sql: 'SELECT source, COUNT(*) as count FROM places GROUP BY source',
      args: []
    })

    const sources: Record<string, number> = {}
    sourceResult.rows.forEach(row => {
      sources[String(row[0])] = Number(row[1])
    })

    return {
      total: Number(result.rows[0]?.total || 0),
      verified: Number(result.rows[0]?.verified || 0),
      pending: Number(result.rows[0]?.pending || 0),
      sources
    }
  }
}

/**
 * 블로그 포스트 Repository
 */
export class PostRepository {
  private db: ReturnType<typeof getTursoDatabase> | null

  constructor(db?: ReturnType<typeof getTursoDatabase>) {
    try {
      this.db = db || getDB()
    } catch (error) {
      this.db = null
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Turso database not available for PostRepository, using fallback')
      }
    }
  }

  /**
   * Turso 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    return this.db !== null
  }

  /**
   * 페이지네이션된 포스트 목록 조회
   */
  async findAll(
    filters: { category?: string; featured?: boolean; search?: string } = {},
    sort: SortParams = { field: 'date', order: 'DESC' },
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<PaginationResult<PostRow>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: (string | number | boolean)[] = []

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

    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    // 전체 개수
    const countResult = await this.db.execute({
      sql: `SELECT COUNT(*) as total FROM posts ${whereClause}`,
      args: params,
    })
    const total = (countResult.rows[0]?.total as number) || 0

    // 데이터 조회
    const dataResult = await this.db.execute({
      sql: `
        SELECT id, title, slug, excerpt, category, date, image, featured, thumbnail_url 
        FROM posts 
        ${whereClause}
        ORDER BY ${sortField} ${sortOrder}
        LIMIT ? OFFSET ?
      `,
      args: [...params, limit, offset],
    })

    const data: PostRow[] = dataResult.rows.map(row => {
      const obj: Record<string, unknown> = {}
      for (let i = 0; i < dataResult.columns.length; i++) {
        obj[dataResult.columns[i]] = row[i]
      }
      return obj as PostRow
    })

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
  async findBySlug(slug: string): Promise<PostRow | null> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT * FROM posts WHERE slug = ?',
      args: [slug],
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const obj: Record<string, unknown> = {}
    for (let i = 0; i < result.columns.length; i++) {
      obj[result.columns[i]] = row[i]
    }
    return obj as PostRow
  }

  /**
   * 모든 슬러그 조회 (generateStaticParams용)
   */
  async findAllSlugs(): Promise<string[]> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT slug FROM posts ORDER BY date DESC',
      args: []
    })

    return result.rows.map(row => row[0] as string)
  }

  /**
   * 카테고리별 포스트 개수
   */
  async countByCategory(): Promise<Record<string, number>> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: `
        SELECT category, COUNT(*) as count 
        FROM posts 
        GROUP BY category
      `,
      args: []
    })

    const counts: Record<string, number> = {}
    for (const row of result.rows) {
      const category = row[0] as string
      const count = row[1] as number
      counts[category] = count
    }

    return counts
  }

  /**
   * 새 포스트 생성
   */
  async create(data: Omit<PostRow, 'created_at' | 'updated_at'>): Promise<void> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    // Generate created_at and updated_at if not provided, as the instruction's args imply they are passed.
    // However, the Omit in the signature suggests they are not.
    // To be faithful to the instruction's `args` list, we'll assume they are part of `data` or default to current time.
    const now = new Date().toISOString();
    const created_at = data.created_at || now;
    const updated_at = data.updated_at || now;

    await this.db.execute({
      sql: `
        INSERT INTO posts (
          id, title, slug, excerpt, content, author, date, category, 
          read_time, image, tags, location, last_modified, seo_keywords,
          geo_latitude, geo_longitude, geo_address, featured, thumbnail_url, thumbnail_prompt, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        data.id as any,
        data.title as any,
        data.slug as any,
        (data.excerpt || null) as any,
        data.content as any,
        data.author as any,
        data.date as any,
        data.category as any,
        (data.read_time || null) as any,
        (data.image || null) as any, // Keep image as it's not explicitly removed from the instruction's SQL
        (data.tags || null) as any,
        (data.location || null) as any,
        (data.last_modified || null) as any,
        (data.seo_keywords || null) as any,
        (data.geo_latitude || null) as any,
        (data.geo_longitude || null) as any,
        (data.geo_address || null) as any,
        (data.featured ? 1 : 0) as any,
        (data.thumbnail_url || null) as any,
        (data.thumbnail_prompt || null) as any,
        created_at as any, // Use generated/provided created_at
        updated_at as any, // Use generated/provided updated_at
      ],
    })
  }

  /**
   * 모든 포스트 제목 조회 (중복 방지용)
   */
  async findAllTitles(): Promise<string[]> {
    if (!this.db) {
      throw new Error('Turso database is not available')
    }

    const result = await this.db.execute({
      sql: 'SELECT title FROM posts',
      args: []
    })

    return result.rows.map(row => row[0] as string)
  }
}

/**
 * 이벤트 Repository
 */
export class EventRepository {
  private db: ReturnType<typeof getTursoDatabase>

  constructor(db?: ReturnType<typeof getTursoDatabase>) {
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
  ): Promise<PaginationResult<EventRow>> {
    const { page, limit } = pagination
    const offset = (page - 1) * limit

    const conditions: string[] = []
    const params: (string | number)[] = []

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
    const countResult = await this.db.execute({
      sql: `SELECT COUNT(*) as total FROM events ${whereClause}`,
      args: params,
    })
    const total = (countResult.rows[0]?.total as number) || 0

    // 데이터 조회
    const dataResult = await this.db.execute({
      sql: `
        SELECT * FROM events 
        ${whereClause}
        ORDER BY start_date ASC
        LIMIT ? OFFSET ?
      `,
      args: [...params, limit, offset],
    })

    const data: EventRow[] = dataResult.rows.map(row => {
      const obj: Record<string, unknown> = {}
      for (let i = 0; i < dataResult.columns.length; i++) {
        obj[dataResult.columns[i]] = row[i]
      }
      return obj as EventRow
    })

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
  async findBySlug(slug: string): Promise<EventRow | null> {
    const result = await this.db.execute({
      sql: 'SELECT * FROM events WHERE slug = ?',
      args: [slug],
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    const obj: Record<string, unknown> = {}
    for (let i = 0; i < result.columns.length; i++) {
      obj[result.columns[i]] = row[i]
    }
    return obj as EventRow
  }
}

