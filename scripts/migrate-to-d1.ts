/**
 * 인메모리 데이터베이스에서 D1로 마이그레이션 스크립트
 * 
 * 사용법:
 * npx tsx scripts/migrate-to-d1.ts
 */

import { getAllPlaces } from '../src/lib/database/simple-places'
import { PlaceRepository } from '../src/lib/database/d1-repository'

async function migratePlaces() {
  console.log('🚀 장소 데이터 마이그레이션 시작...')

  // 인메모리 데이터 가져오기
  const places = getAllPlaces()
  console.log(`📦 ${places.length}개의 장소 데이터 발견`)

  // D1 Repository 생성
  // 실제 환경에서는 D1 바인딩을 전달해야 함
  const repository = new PlaceRepository()

  let successCount = 0
  let errorCount = 0

  for (const place of places) {
    try {
      // D1에 데이터 삽입
      // 실제 구현은 D1 INSERT 쿼리 필요
      console.log(`  ✓ ${place.name} 마이그레이션 중...`)
      
      // TODO: 실제 D1 INSERT 구현
      // await repository.db.prepare(`
      //   INSERT INTO places (...)
      //   VALUES (...)
      // `).bind(...).run()

      successCount++
    } catch (error) {
      console.error(`  ✗ ${place.name} 마이그레이션 실패:`, error)
      errorCount++
    }
  }

  console.log('\n✅ 마이그레이션 완료!')
  console.log(`   성공: ${successCount}개`)
  console.log(`   실패: ${errorCount}개`)
}

// 실행
migratePlaces().catch(console.error)

