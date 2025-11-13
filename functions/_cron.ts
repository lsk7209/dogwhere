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

    // 간단한 통계 업데이트 작업 예시
    await updateStatistics(db)

    console.log('[Cron] Scheduled task completed successfully')
  } catch (error) {
    console.error('[Cron] Scheduled task failed:', error)
    // 에러 발생 시에도 재시도하도록 설정 가능
  }
}

/**
 * 통계 업데이트 (예시)
 */
async function updateStatistics(db: D1Database): Promise<void> {
  try {
    console.log('[Cron] Updating statistics...')

    // 장소 개수 조회
    const countResult = await db
      .prepare('SELECT COUNT(*) as total FROM places')
      .first() as any

    const total = countResult?.total as number || 0

    console.log(`[Cron] Total places: ${total}`)

    // 여기에 추가 통계 작업을 구현할 수 있습니다
    // 예: 인기 장소 업데이트, 검색 인덱스 갱신 등

    console.log('[Cron] Statistics update completed')
  } catch (error) {
    console.error('[Cron] Statistics update failed:', error)
    throw error
  }
}
