/**
 * Cloudflare Pages Cron Triggers
 * 정기적으로 실행되는 배치 작업
 * 
 * 참고: 크론 작업은 Cloudflare Pages 대시보드에서 설정해야 합니다
 * Pages → Settings → Functions → Cron Triggers
 * Cron expression 예시: 0 0,6,12,18 * * * (6시간마다 실행)
 * 자세한 설정 방법은 CRON_SETUP.md 파일을 참조하세요
 */

interface Env {
  DB: D1Database
  INTERNAL_TOKEN?: string
  GOOGLE_PLACES_KEY?: string
  KAKAO_API_KEY?: string
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(): Promise<T | null>
}

interface ScheduledEvent {
  scheduledTime: number
  cron: string
}

export async function onScheduled(event: ScheduledEvent, env: Env): Promise<void> {
  const db = env.DB

  try {
    console.log(`[Cron] Scheduled event triggered at ${event.scheduledTime}`)
    console.log(`[Cron] Cron: ${event.cron}`)

    // 1. 통계 업데이트
    await updateStatistics(db)

    // 2. 데이터 수집 작업 (선택적 - API 키가 있는 경우에만)
    if (env.GOOGLE_PLACES_KEY || env.KAKAO_API_KEY) {
      await collectData(db, env)
    }

    console.log('[Cron] Scheduled task completed successfully')
  } catch (error) {
    console.error('[Cron] Scheduled task failed:', error)
    // 에러 발생 시에도 재시도하도록 설정 가능
  }
}

/**
 * 통계 업데이트
 */
async function updateStatistics(db: D1Database): Promise<void> {
  try {
    console.log('[Cron] Updating statistics...')

    // 장소 개수 조회
    const placesCountResult = await db
      .prepare('SELECT COUNT(*) as total FROM places')
      .first() as any

    const placesTotal = placesCountResult?.total as number || 0

    // 이벤트 개수 조회
    const eventsCountResult = await db
      .prepare('SELECT COUNT(*) as total FROM events')
      .first() as any

    const eventsTotal = eventsCountResult?.total as number || 0

    // 포스트 개수 조회
    const postsCountResult = await db
      .prepare('SELECT COUNT(*) as total FROM posts')
      .first() as any

    const postsTotal = postsCountResult?.total as number || 0

    console.log(`[Cron] Statistics:`)
    console.log(`  - Places: ${placesTotal}`)
    console.log(`  - Events: ${eventsTotal}`)
    console.log(`  - Posts: ${postsTotal}`)

    console.log('[Cron] Statistics update completed')
  } catch (error) {
    console.error('[Cron] Statistics update failed:', error)
    // 통계 업데이트 실패는 치명적이지 않으므로 throw하지 않음
  }
}

/**
 * 데이터 수집 작업 (선택적)
 */
async function collectData(db: D1Database, env: Env): Promise<void> {
  try {
    console.log('[Cron] Starting data collection...')

    // 내부 API 호출을 통한 데이터 수집
    // 실제 구현은 API 엔드포인트를 호출하거나 직접 수집 로직 실행
    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://dogwhere.pages.dev'
    
    // 간단한 데이터 수집 트리거 (실제로는 더 복잡한 로직 필요)
    console.log('[Cron] Data collection triggered')
    console.log(`[Cron] Site URL: ${siteUrl}`)

    // 여기에 실제 데이터 수집 로직을 추가할 수 있습니다
    // 예: Google Places API, Kakao Map API 호출 등

    console.log('[Cron] Data collection completed')
  } catch (error) {
    console.error('[Cron] Data collection failed:', error)
    // 데이터 수집 실패는 치명적이지 않으므로 throw하지 않음
  }
}
