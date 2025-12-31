/**
 * 데이터베이스 어댑터
 * D1과 Turso를 자동으로 감지하여 사용
 */

import { isTursoAvailable, getTursoDatabase } from './turso-client'
import { isD1Available, getD1Database } from './d1-client'

// Turso Repository 사용
import {
  PlaceRepository as TursoPlaceRepository,
  PostRepository as TursoPostRepository,
  EventRepository as TursoEventRepository,
} from './turso-repository'

// D1 Repository 사용
import {
  PlaceRepository as D1PlaceRepository,
  PostRepository as D1PostRepository,
  EventRepository as D1EventRepository,
} from './d1-repository'

/**
 * 데이터베이스 타입
 */
export type DatabaseType = 'turso' | 'd1' | 'none'

/**
 * 현재 사용 가능한 데이터베이스 타입 확인
 */
export function getDatabaseType(): DatabaseType {
  if (isTursoAvailable()) {
    return 'turso'
  }
  if (isD1Available()) {
    return 'd1'
  }
  return 'none'
}

/**
 * PlaceRepository 인스턴스 생성
 */
export function createPlaceRepository() {
  const dbType = getDatabaseType()
  
  if (dbType === 'turso') {
    return new TursoPlaceRepository(getTursoDatabase())
  } else if (dbType === 'd1') {
    const d1Db = getD1Database()
    if (!d1Db) {
      throw new Error('D1 database is not available')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new D1PlaceRepository(d1Db as any)
  } else {
    throw new Error(
      'No database available. Please configure either Turso (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN) ' +
      'or Cloudflare D1 (CF_D1_BINDING) environment variables.'
    )
  }
}

/**
 * PostRepository 인스턴스 생성
 */
export function createPostRepository() {
  const dbType = getDatabaseType()
  
  if (dbType === 'turso') {
    return new TursoPostRepository(getTursoDatabase())
  } else if (dbType === 'd1') {
    const d1Db = getD1Database()
    if (!d1Db) {
      throw new Error('D1 database is not available')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new D1PostRepository(d1Db as any)
  } else {
    throw new Error(
      'No database available. Please configure either Turso (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN) ' +
      'or Cloudflare D1 (CF_D1_BINDING) environment variables.'
    )
  }
}

/**
 * EventRepository 인스턴스 생성
 */
export function createEventRepository() {
  const dbType = getDatabaseType()
  
  if (dbType === 'turso') {
    return new TursoEventRepository(getTursoDatabase())
  } else if (dbType === 'd1') {
    const d1Db = getD1Database()
    if (!d1Db) {
      throw new Error('D1 database is not available')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new D1EventRepository(d1Db as any)
  } else {
    throw new Error(
      'No database available. Please configure either Turso (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN) ' +
      'or Cloudflare D1 (CF_D1_BINDING) environment variables.'
    )
  }
}

/**
 * 데이터베이스 연결 테스트
 */
export async function testDatabaseConnection(): Promise<{
  type: DatabaseType
  available: boolean
  error?: string
}> {
  const dbType = getDatabaseType()
  
  if (dbType === 'none') {
    return {
      type: 'none',
      available: false,
      error: 'No database configured',
    }
  }

  try {
    if (dbType === 'turso') {
      const db = getTursoDatabase()
      await db.execute({ sql: 'SELECT 1', args: [] })
      return { type: 'turso', available: true }
    } else if (dbType === 'd1') {
      const db = getD1Database()
      if (!db) {
        return { type: 'd1', available: false, error: 'D1 database not available' }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db as any).prepare('SELECT 1').first()
      return { type: 'd1', available: true }
    }
  } catch (error) {
    return {
      type: dbType,
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  return { type: 'none', available: false }
}

