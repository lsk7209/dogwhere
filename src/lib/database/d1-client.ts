/**
 * Cloudflare D1 데이터베이스 클라이언트
 * Cloudflare Workers/Pages 환경에서 D1 접근
 */

/**
 * Cloudflare 환경에서 D1 데이터베이스 가져오기
 * 
 * Cloudflare Pages/Workers에서는:
 * - 프로덕션: env.DB (wrangler.toml에서 바인딩)
 * - 로컬 개발: wrangler d1 execute 사용
 */
export function getD1Database(): D1Database | null {
  // Cloudflare Workers/Pages 환경
  if (typeof globalThis !== 'undefined') {
    // @ts-expect-error - Cloudflare Workers global binding
    const env = globalThis.env || globalThis.process?.env
    
    if (env?.DB) {
      return env.DB as D1Database
    }
    
    // 직접 바인딩 확인
    // @ts-expect-error
    if (globalThis.DB) {
      // @ts-expect-error
      return globalThis.DB as D1Database
    }
  }

  // Next.js API Route에서 사용하는 경우
  // Cloudflare Pages Functions에서는 env가 자동으로 주입됨
  // 하지만 Next.js에서는 직접 접근 불가능하므로 null 반환
  
  return null
}

/**
 * 개발 환경 체크
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Cloudflare 환경 체크
 */
export function isCloudflareEnvironment(): boolean {
  // Cloudflare Workers/Pages 환경 감지
  return typeof globalThis !== 'undefined' && (
    // @ts-expect-error
    globalThis.env !== undefined ||
    // @ts-expect-error
    globalThis.DB !== undefined ||
    typeof navigator !== 'undefined' && navigator.userAgent.includes('Cloudflare')
  )
}

/**
 * D1 사용 가능 여부 확인
 */
export function isD1Available(): boolean {
  return getD1Database() !== null
}

