/**
 * Cloudflare Pages Functions 환경에서 D1 접근
 * Pages Functions의 env 객체를 통해 접근
 */

// Cloudflare Pages Functions Env 타입 정의
interface CloudflareEnv {
  DB?: D1Database
  KV?: KVNamespace
  R2?: R2Bucket
  [key: string]: unknown
}

/**
 * Cloudflare Pages Functions에서 D1 데이터베이스 가져오기
 * 
 * @param env - Cloudflare Pages Functions의 env 객체
 * @returns D1Database 또는 null
 */
export function getD1FromEnv(env: CloudflareEnv | { DB?: D1Database }): D1Database | null {
  if (!env) {
    return null
  }

  // Pages Functions에서는 env.DB로 접근
  if ('DB' in env && env.DB) {
    return env.DB as D1Database
  }

  return null
}

/**
 * Cloudflare 환경에서 D1 데이터베이스 가져오기 (범용)
 * 
 * Next.js API Routes와 Pages Functions 모두 지원
 */
export function getD1Database(env?: CloudflareEnv | { DB?: D1Database }): D1Database | null {
  // Pages Functions에서 env를 전달받은 경우
  if (env) {
    return getD1FromEnv(env)
  }

  // Cloudflare Workers/Pages 환경 (globalThis)
  if (typeof globalThis !== 'undefined') {
    // @ts-expect-error - Cloudflare Workers global binding
    const globalEnv = globalThis.env || globalThis.process?.env
    
    if (globalEnv?.DB) {
      return globalEnv.DB as D1Database
    }
    
    // 직접 바인딩 확인
    // @ts-expect-error
    if (globalThis.DB) {
      // @ts-expect-error
      return globalThis.DB as D1Database
    }
  }

  return null
}

