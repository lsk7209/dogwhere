/**
 * Cloudflare Pages Cron Triggers
 * 정기적으로 실행되는 배치 작업
 * 
 * wrangler.toml에 cron 설정 필요:
 * [triggers]
 * crons = ["0 */6 * * *"]  # 6시간마다 실행
 */

import { PlaceRepository } from '../src/lib/database/d1-repository'
import { collectFromGoogle, collectFromKakao, ingestPlaces } from '../src/lib/data-collection/simple-collector'

export async function onScheduled(event: ScheduledEvent, env: Env): Promise<void> {
  const db = env.DB as D1Database

  try {
    console.log(`[Cron] Scheduled event triggered at ${event.scheduledTime}`)
    console.log(`[Cron] Cron: ${event.cron}`)

    // 작업 타입에 따라 다른 작업 수행
    // event.cron을 통해 어떤 작업인지 구분 가능
    
    // 예시: 데이터 수집 작업
    await collectAndIngestPlaces(db)

    console.log('[Cron] Scheduled task completed successfully')
  } catch (error) {
    console.error('[Cron] Scheduled task failed:', error)
    // 에러 발생 시에도 재시도하도록 설정 가능
  }
}

/**
 * 장소 데이터 수집 및 저장
 */
async function collectAndIngestPlaces(db: D1Database): Promise<void> {
  try {
    console.log('[Cron] Starting places collection...')

    const defaultKeywords = [
      '강아지 동반 카페',
      '펫프렌들리 카페',
      '강아지 동반 식당',
      '펫프렌들리 레스토랑',
    ]

    let allCollectedPlaces: any[] = []

    // 각 키워드로 검색
    for (const keyword of defaultKeywords.slice(0, 3)) { // 처음 3개만 (API 제한 고려)
      const query = `서울 ${keyword}`
      
      // Google Places API에서 데이터 수집
      const googlePlaces = await collectFromGoogle(query)
      allCollectedPlaces = [...allCollectedPlaces, ...googlePlaces]

      // 카카오맵 API에서 데이터 수집
      const kakaoPlaces = await collectFromKakao(query)
      allCollectedPlaces = [...allCollectedPlaces, ...kakaoPlaces]

      // API 호출 제한을 위한 대기
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // 데이터 통합 및 저장
    console.log(`[Cron] Collected ${allCollectedPlaces.length} places`)
    
    const repository = new PlaceRepository(db)
    
    // 중복 확인 및 저장
    for (const place of allCollectedPlaces) {
      try {
        const existing = await repository.findBySlug(place.slug)
        if (!existing) {
          // 새 장소 추가 로직 (실제 구현 필요)
          console.log(`[Cron] Adding new place: ${place.name}`)
        }
      } catch (error) {
        console.error(`[Cron] Error processing place ${place.name}:`, error)
      }
    }

    console.log('[Cron] Places collection completed')
  } catch (error) {
    console.error('[Cron] Places collection failed:', error)
    throw error
  }
}

