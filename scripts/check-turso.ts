/**
 * Turso 데이터베이스 연결 테스트 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/check-turso.ts
 */

import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  console.log('🔍 Turso 데이터베이스 연결 테스트\n')

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    console.error('\n.env.local 파일에 다음을 추가하세요:')
    console.error('TURSO_DATABASE_URL=libsql://your-database.turso.io')
    console.error('TURSO_AUTH_TOKEN=your_turso_auth_token')
    process.exit(1)
  }

  try {
    const client = createClient({
      url,
      authToken,
    })

    // 연결 테스트
    console.log('1️⃣  연결 테스트...')
    const testResult = await client.execute({ sql: 'SELECT 1 as test', args: [] })
    console.log('   ✅ 연결 성공:', testResult.rows[0])

    // 테이블 목록 조회
    console.log('\n2️⃣  테이블 목록 조회...')
    const tablesResult = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      args: [],
    })
    const tables = tablesResult.rows.map(row => row[0] as string)
    console.log(`   ✅ 발견된 테이블 (${tables.length}개):`)
    tables.forEach(table => console.log(`      - ${table}`))

    // 각 테이블의 레코드 수 확인
    console.log('\n3️⃣  레코드 수 확인...')
    for (const table of tables) {
      try {
        const countResult = await client.execute({
          sql: `SELECT COUNT(*) as count FROM ${table}`,
          args: [],
        })
        const count = countResult.rows[0]?.[0] as number || 0
        console.log(`   ${table}: ${count}개 레코드`)
      } catch (error) {
        console.log(`   ${table}: 확인 실패 (${error instanceof Error ? error.message : 'Unknown error'})`)
      }
    }

    // 인덱스 확인
    console.log('\n4️⃣  인덱스 확인...')
    const indexesResult = await client.execute({
      sql: "SELECT name, tbl_name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'",
      args: [],
    })
    if (indexesResult.rows.length > 0) {
      console.log(`   ✅ 발견된 인덱스 (${indexesResult.rows.length}개):`)
      indexesResult.rows.forEach(row => {
        console.log(`      - ${row[0]} (테이블: ${row[1]})`)
      })
    } else {
      console.log('   ⚠️  인덱스 없음')
    }

    console.log('\n✅ 모든 테스트 통과!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 연결 실패:', error)
    if (error instanceof Error) {
      console.error('   메시지:', error.message)
    }
    process.exit(1)
  }
}

main()

