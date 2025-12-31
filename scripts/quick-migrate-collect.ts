/**
 * 빠른 마이그레이션 및 수집 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN
const SITE_URL = 'http://localhost:3000'

async function callAPI(endpoint: string, method = 'GET', body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${INTERNAL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${SITE_URL}${endpoint}`, options)
    const text = await response.text()
    
    if (!response.ok) {
      return { success: false, error: { message: `HTTP ${response.status}: ${text.substring(0, 100)}` } }
    }
    
    try {
      return JSON.parse(text)
    } catch {
      return { success: false, error: { message: `Invalid JSON: ${text.substring(0, 100)}` } }
    }
  } catch (error) {
    return { success: false, error: { message: error instanceof Error ? error.message : 'Network error' } }
  }
}

async function main() {
  console.log('🚀 빠른 마이그레이션 및 수집\n')

  // 1. 마이그레이션
  console.log('1️⃣  마이그레이션 실행...')
  const migrateResult = await callAPI('/api/debug/migrate', 'POST')
  if (migrateResult.success) {
    console.log('✅ 마이그레이션 완료')
    console.log(`   테이블: ${migrateResult.data.tables.join(', ')}\n`)
  } else {
    console.log('⚠️  마이그레이션:', migrateResult.error?.message || '알 수 없는 오류\n')
  }

  // 2. 시스템 상태 확인
  console.log('2️⃣  시스템 상태 확인...')
  const statusResult = await callAPI('/api/debug/system-status')
  if (statusResult.success) {
    console.log(`   DB 연결: ${statusResult.data.database.connected ? '✅' : '❌'}`)
    console.log(`   공공데이터: ${statusResult.data.publicData?.total || 0}개\n`)
  }

  // 3. 데이터 수집
  console.log('3️⃣  데이터 수집 시작...')
  const collectResult = await callAPI('/api/public-data/collect', 'POST', {
    source: 'kor-pet-tour',
    incremental: false,
    config: {
      apiKey: process.env.PUBLIC_DATA_API_KEY,
      serviceKey: process.env.PUBLIC_DATA_API_KEY,
      baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
      endpoint: '/areaBasedList',
      mobileOS: 'ETC',
      mobileApp: 'dogwhere',
      sourceApi: 'kor-pet-tour',
      params: {
        listYN: 'Y',
        arrange: 'C',
      },
    },
  })

  if (collectResult.success) {
    console.log('✅ 수집 완료')
    console.log(`   수집: ${collectResult.data.collected}개`)
    console.log(`   추가: ${collectResult.data.added}개`)
    console.log(`   업데이트: ${collectResult.data.updated}개`)
    console.log(`   건너뜀: ${collectResult.data.skipped}개\n`)
  } else {
    console.log('❌ 수집 실패:', collectResult.error?.message)
    if (collectResult.error?.details) {
      console.log('   상세:', collectResult.error.details)
    }
  }

  // 4. 최종 상태
  console.log('4️⃣  최종 상태 확인...')
  const finalStatus = await callAPI('/api/debug/system-status')
  if (finalStatus.success) {
    console.log(`   총 데이터: ${finalStatus.data.publicData?.total || 0}개`)
    console.log(`   재생성 완료: ${finalStatus.data.publicData?.regenerated || 0}개`)
    console.log(`   큐: ${JSON.stringify(finalStatus.data.queue)}\n`)
  }

  console.log('✅ 완료!')
}

main().catch(console.error)

