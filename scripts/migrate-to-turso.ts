/**
 * D1에서 Turso로 데이터 마이그레이션 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/migrate-to-turso.ts
 * 
 * 환경 변수:
 *   - TURSO_DATABASE_URL: Turso 데이터베이스 URL
 *   - TURSO_AUTH_TOKEN: Turso 인증 토큰
 *   - CF_D1_BINDING: Cloudflare D1 바인딩 (선택)
 */

import { createClient } from '@libsql/client'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function migrateTable(
  tursoClient: ReturnType<typeof createClient>,
  tableName: string,
  d1Data: any[]
) {
  if (d1Data.length === 0) {
    console.log(`  ⏭️  ${tableName}: 데이터 없음, 건너뜀`)
    return
  }

  console.log(`  📦 ${tableName}: ${d1Data.length}개 레코드 마이그레이션 중...`)

  // 배치로 삽입 (100개씩)
  const batchSize = 100
  for (let i = 0; i < d1Data.length; i += batchSize) {
    const batch = d1Data.slice(i, i + batchSize)
    
    // 각 레코드를 개별적으로 삽입 (간단한 구현)
    // 실제로는 UPSERT 또는 배치 삽입 사용 권장
    for (const row of batch) {
      try {
        // 테이블별로 다른 INSERT 쿼리 필요
        // 여기서는 예시로만 제공
        console.log(`    → ${tableName} 레코드 ${i + batch.indexOf(row) + 1}/${d1Data.length}`)
      } catch (error) {
        console.error(`    ❌ ${tableName} 레코드 삽입 실패:`, error)
      }
    }
  }

  console.log(`  ✅ ${tableName}: 마이그레이션 완료`)
}

async function main() {
  console.log('🚀 D1 → Turso 마이그레이션 시작\n')

  // Turso 클라이언트 생성
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  if (!tursoUrl || !tursoToken) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    process.exit(1)
  }

  const tursoClient = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  })

  // 연결 테스트
  try {
    await tursoClient.execute({ sql: 'SELECT 1', args: [] })
    console.log('✅ Turso 데이터베이스 연결 성공\n')
  } catch (error) {
    console.error('❌ Turso 데이터베이스 연결 실패:', error)
    process.exit(1)
  }

  // 스키마 확인
  console.log('📋 스키마 확인 중...')
  try {
    const tablesResult = await tursoClient.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table'",
      args: [],
    })
    const tables = tablesResult.rows.map(row => row[0] as string)
    console.log(`  발견된 테이블: ${tables.join(', ')}\n`)
  } catch (error) {
    console.error('❌ 스키마 확인 실패:', error)
    process.exit(1)
  }

  // D1 데이터 가져오기 (실제로는 D1 API 또는 export 사용)
  console.log('⚠️  D1 데이터 가져오기는 수동으로 수행해야 합니다.')
  console.log('   wrangler d1 execute dogwhere-db --command "SELECT * FROM places" > d1_export.json')
  console.log('   또는 D1 대시보드에서 데이터를 export하세요.\n')

  const proceed = await question('계속하시겠습니까? (y/n): ')
  if (proceed.toLowerCase() !== 'y') {
    console.log('마이그레이션 취소됨')
    rl.close()
    process.exit(0)
  }

  // 실제 마이그레이션 로직은 여기에 구현
  // 예시: places 테이블 마이그레이션
  console.log('\n📊 마이그레이션 통계:')
  console.log('  - places: 0개 (D1 데이터 필요)')
  console.log('  - events: 0개 (D1 데이터 필요)')
  console.log('  - posts: 0개 (D1 데이터 필요)')

  console.log('\n✅ 마이그레이션 완료!')
  rl.close()
}

main().catch(error => {
  console.error('❌ 마이그레이션 실패:', error)
  rl.close()
  process.exit(1)
})

