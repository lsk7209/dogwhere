/**
 * API를 통한 마이그레이션 및 수집 스크립트
 * 개발 서버가 실행 중일 때 사용
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

if (!INTERNAL_TOKEN) {
  console.error('❌ INTERNAL_TOKEN이 필요합니다.')
  process.exit(1)
}

async function waitForServer() {
  console.log('⏳ 서버 대기 중...')
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${SITE_URL}/api/debug/system-status`, {
        headers: { 'Authorization': `Bearer ${INTERNAL_TOKEN}` },
      })
      if (res.ok) {
        console.log('✅ 서버 준비 완료\n')
        return true
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1000))
    process.stdout.write('.')
  }
  console.log('\n❌ 서버 시작 실패')
  return false
}

async function migrate() {
  console.log('📋 마이그레이션 실행...\n')
  const res = await fetch(`${SITE_URL}/api/debug/migrate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${INTERNAL_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  if (data.success) {
    console.log('✅ 마이그레이션 완료')
    console.log(`   테이블: ${data.data.tables.join(', ')}\n`)
    return true
  } else {
    console.log('❌ 마이그레이션 실패:', data.error?.message)
    return false
  }
}

async function collect() {
  console.log('📥 데이터 수집 시작...\n')
  const res = await fetch(`${SITE_URL}/api/public-data/collect`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${INTERNAL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
        params: { listYN: 'Y', arrange: 'C' },
      },
    }),
  })
  const data = await res.json()
  if (data.success) {
    console.log('✅ 수집 완료')
    console.log(`   수집: ${data.data.collected}개`)
    console.log(`   추가: ${data.data.added}개`)
    console.log(`   업데이트: ${data.data.updated}개`)
    console.log(`   건너뜀: ${data.data.skipped}개\n`)
    return true
  } else {
    console.log('❌ 수집 실패:', data.error?.message)
    return false
  }
}

async function status() {
  const res = await fetch(`${SITE_URL}/api/debug/system-status`, {
    headers: { 'Authorization': `Bearer ${INTERNAL_TOKEN}` },
  })
  const data = await res.json()
  if (data.success) {
    console.log('📊 시스템 상태:')
    console.log(`   DB: ${data.data.database.connected ? '✅' : '❌'}`)
    console.log(`   공공데이터: ${data.data.publicData?.total || 0}개`)
    console.log(`   재생성: ${data.data.publicData?.regenerated || 0}개\n`)
  }
}

async function main() {
  console.log('🚀 마이그레이션 및 수집\n')
  
  if (!(await waitForServer())) process.exit(1)
  
  await status()
  await migrate()
  await collect()
  await status()
  
  console.log('✅ 완료!')
}

main().catch(console.error)

