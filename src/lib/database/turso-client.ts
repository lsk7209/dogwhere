/**
 * Turso 데이터베이스 클라이언트
 * Vercel 환경에서 Turso 데이터베이스 접근
 * 
 * Turso는 libSQL 기반의 분산 SQLite 데이터베이스입니다.
 * Vercel과 완벽하게 통합되어 있습니다.
 */

import { createClient } from '@libsql/client'

export interface TursoConfig {
  url: string
  authToken: string
}

/**
 * Turso 데이터베이스 클라이언트 생성
 */
export function createTursoClient(config?: TursoConfig) {
  const url = config?.url || process.env.TURSO_DATABASE_URL
  const authToken = config?.authToken || process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    throw new Error(
      'Turso database configuration is missing. ' +
      'Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.'
    )
  }

  // 로컬 개발 환경에서는 http://로 시작하는 URL 사용
  // 프로덕션에서는 libsql://로 시작하는 URL 사용
  const client = createClient({
    url,
    authToken,
  })

  return client
}

/**
 * 싱글톤 Turso 클라이언트 인스턴스
 */
let tursoClient: ReturnType<typeof createClient> | null = null

/**
 * Turso 데이터베이스 클라이언트 가져오기 (싱글톤)
 */
export function getTursoDatabase() {
  if (tursoClient) {
    return tursoClient
  }

  tursoClient = createTursoClient()
  return tursoClient
}

/**
 * Turso 사용 가능 여부 확인
 */
export function isTursoAvailable(): boolean {
  try {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN
    return !!(url && authToken)
  } catch {
    return false
  }
}

/**
 * 개발 환경 체크
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Vercel 환경 체크
 */
export function isVercelEnvironment(): boolean {
  return !!(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_URL
  )
}

