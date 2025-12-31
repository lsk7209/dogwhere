/**
 * 마이그레이션 및 수집 실행 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/run-migrate-and-collect.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

if (!INTERNAL_TOKEN) {
  console.error('❌ INTERNAL_TOKEN 환경 변수가 필요합니다.')
  process.exit(1)
}

async function waitForServer(maxWait = 30) {
  console.log('⏳ 개발 서버 시작 대기 중...')
  for (let i = 0; i < maxWait; i++) {
    try {
      const response = await fetch(`${SITE_URL}/api/debug/system-status`, {
        headers: {
          'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        },
      })
      if (response.ok) {
        console.log('✅ 서버 준비 완료\n')
        return true
      }
    } catch {
      // 서버가 아직 시작되지 않음
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    process.stdout.write('.')
  }
  console.log('\n❌ 서버 시작 시간 초과')
  return false
}

async function runMigration() {
  console.log('📋 데이터베이스 마이그레이션 실행...\n')
  
  try {
    const response = await fetch(`${SITE_URL}/api/debug/migrate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ 마이그레이션 완료')
      console.log(`   생성된 테이블: ${data.data.tables.join(', ')}\n`)
      return true
    } else {
      console.error('❌ 마이그레이션 실패:', data.error?.message)
      return false
    }
  } catch (error) {
    console.error('❌ 마이그레이션 실행 실패:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

async function checkSystemStatus() {
  console.log('🔍 시스템 상태 확인...\n')
  
  try {
    const response = await fetch(`${SITE_URL}/api/debug/system-status`, {
      headers: {
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
      },
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('📊 시스템 상태:')
      console.log(`   데이터베이스: ${data.data.database.connected ? '✅ 연결됨' : '❌ 연결 실패'}`)
      console.log(`   공공데이터: ${data.data.publicData?.total || 0}개`)
      console.log(`   재생성 완료: ${data.data.publicData?.regenerated || 0}개`)
      console.log(`   큐 상태:`, data.data.queue)
      console.log('')
      return true
    } else {
      console.error('❌ 상태 확인 실패:', data.error?.message)
      return false
    }
  } catch (error) {
    console.error('❌ 상태 확인 실패:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

async function collectData() {
  console.log('📥 공공데이터 수집 시작...\n')
  
  const collectConfig = {
    source: 'kor-pet-tour',
    incremental: false, // 초기 수집이므로 false
    config: {
      apiKey: process.env.PUBLIC_DATA_API_KEY || '',
      serviceKey: process.env.PUBLIC_DATA_API_KEY || '',
      baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
      endpoint: '/areaBasedList',
      mobileOS: 'ETC',
      mobileApp: 'dogwhere',
      sourceApi: 'kor-pet-tour',
      params: {
        listYN: 'Y',
        arrange: 'C', // 수정일순
      },
    },
  }

  try {
    const response = await fetch(`${SITE_URL}/api/public-data/collect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${INTERNAL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectConfig),
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ 수집 완료')
      console.log(`   수집: ${data.data.collected}개`)
      console.log(`   추가: ${data.data.added}개`)
      console.log(`   업데이트: ${data.data.updated}개`)
      console.log(`   건너뜀: ${data.data.skipped}개\n`)
      return true
    } else {
      console.error('❌ 수집 실패:', data.error?.message)
      if (data.error?.details) {
        console.error('   상세:', data.error.details)
      }
      return false
    }
  } catch (error) {
    console.error('❌ 수집 실행 실패:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}

async function main() {
  console.log('🚀 마이그레이션 및 수집 시작\n')

  // 1. 서버 대기
  const serverReady = await waitForServer()
  if (!serverReady) {
    process.exit(1)
  }

  // 2. 시스템 상태 확인
  await checkSystemStatus()

  // 3. 마이그레이션 실행
  const migrationSuccess = await runMigration()
  if (!migrationSuccess) {
    console.log('⚠️  마이그레이션 실패했지만 계속 진행합니다...\n')
  }

  // 4. 데이터 수집
  const collectSuccess = await collectData()
  if (!collectSuccess) {
    process.exit(1)
  }

  // 5. 최종 상태 확인
  console.log('📊 최종 상태 확인...\n')
  await checkSystemStatus()

  console.log('✅ 모든 작업 완료!')
  process.exit(0)
}

main().catch(error => {
  console.error('❌ 실행 실패:', error)
  process.exit(1)
})

