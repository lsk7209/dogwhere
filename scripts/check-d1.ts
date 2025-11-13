/**
 * D1 데이터베이스 연결 확인 스크립트
 * 
 * 사용법:
 * - 로컬: npx tsx scripts/check-d1.ts --local
 * - 프로덕션: npx tsx scripts/check-d1.ts
 */

import { execSync } from 'child_process'

const isLocal = process.argv.includes('--local')
const dbName = 'dogwhere-db'

console.log('🔍 D1 데이터베이스 연결 확인 중...\n')

try {
  // 데이터베이스 정보 확인
  console.log('1️⃣ 데이터베이스 정보 확인...')
  const info = execSync(`wrangler d1 info ${dbName}`, { encoding: 'utf-8' })
  console.log(info)

  // 테이블 목록 확인
  console.log('\n2️⃣ 테이블 목록 확인...')
  const tables = execSync(
    `wrangler d1 execute ${dbName} ${isLocal ? '--local' : ''} --command="SELECT name FROM sqlite_master WHERE type='table'"`,
    { encoding: 'utf-8' }
  )
  console.log(tables)

  // 각 테이블의 레코드 수 확인
  console.log('\n3️⃣ 레코드 수 확인...')
  const tablesToCheck = ['places', 'posts', 'events', 'reviews']
  
  for (const table of tablesToCheck) {
    try {
      const count = execSync(
        `wrangler d1 execute ${dbName} ${isLocal ? '--local' : ''} --command="SELECT COUNT(*) as count FROM ${table}"`,
        { encoding: 'utf-8' }
      )
      console.log(`  ${table}: ${count.match(/\d+/)?.[0] || 0}개`)
    } catch (error) {
      console.log(`  ${table}: 테이블 없음 또는 오류`)
    }
  }

  console.log('\n✅ D1 데이터베이스 연결 확인 완료!')
  
} catch (error) {
  console.error('❌ D1 데이터베이스 연결 확인 실패:', error)
  process.exit(1)
}

