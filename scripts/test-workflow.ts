/**
 * 공공데이터 워크플로우 테스트 스크립트
 * 순차적으로 각 단계를 테스트합니다.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN

if (!INTERNAL_TOKEN) {
  console.error('❌ INTERNAL_TOKEN 환경 변수가 필요합니다.')
  process.exit(1)
}

async function testAPI(endpoint: string, method: string = 'GET', body?: any) {
  const url = `${BASE_URL}${endpoint}`
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(INTERNAL_TOKEN && { Authorization: `Bearer ${INTERNAL_TOKEN}` }),
    },
  }

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return { status: response.status, data }
  } catch (error) {
    return { status: 0, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function waitForServer(maxWait = 30) {
  console.log('⏳ 개발 서버 시작 대기 중...')
  for (let i = 0; i < maxWait; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/public-data/search?q=test&limit=1`)
      if (response.status === 200 || response.status === 400) {
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

async function main() {
  console.log('🚀 공공데이터 워크플로우 테스트 시작\n')
  console.log(`Base URL: ${BASE_URL}\n`)

  // 서버 준비 대기
  const serverReady = await waitForServer()
  if (!serverReady) {
    console.error('❌ 개발 서버가 실행되지 않았습니다.')
    console.error('   먼저 "npm run dev"를 실행해주세요.')
    process.exit(1)
  }

  // 1. 검색 API 테스트
  console.log('📋 1단계: 검색 API 테스트')
  console.log('─'.repeat(50))
  const searchResult = await testAPI('/api/public-data/search?q=올리브영&limit=3')
  if (searchResult.status === 200) {
    console.log('✅ 검색 API 성공')
    const results = searchResult.data?.data?.results || []
    console.log(`   검색 결과: ${results.length}개`)
    if (results.length > 0) {
      console.log(`   첫 번째 결과: ${results[0].name}`)
    }
  } else {
    console.log(`❌ 검색 API 실패: ${searchResult.status}`)
    console.log(`   에러: ${JSON.stringify(searchResult.data || searchResult.error)}`)
  }
  console.log('')

  // 2. 큐 상태 확인
  console.log('📋 2단계: 큐 상태 확인')
  console.log('─'.repeat(50))
  const queueStatus = await testAPI('/api/public-data/queue')
  if (queueStatus.status === 200) {
    console.log('✅ 큐 상태 조회 성공')
    console.log(`   큐 상태:`, queueStatus.data?.data?.queue)
    console.log(`   재생성 완료: ${queueStatus.data?.data?.regenerated}개`)
  } else {
    console.log(`❌ 큐 상태 조회 실패: ${queueStatus.status}`)
  }
  console.log('')

  // 3. 큐에 항목 추가 (배치)
  console.log('📋 3단계: 큐에 항목 추가 (배치)')
  console.log('─'.repeat(50))
  const queueAdd = await testAPI('/api/public-data/queue', 'POST', { batch: true, limit: 5 })
  if (queueAdd.status === 200) {
    console.log('✅ 큐 추가 성공')
    console.log(`   추가: ${queueAdd.data?.data?.added}개`)
    console.log(`   건너뜀: ${queueAdd.data?.data?.skipped}개`)
  } else {
    console.log(`❌ 큐 추가 실패: ${queueAdd.status}`)
    console.log(`   에러: ${JSON.stringify(queueAdd.data || queueAdd.error)}`)
  }
  console.log('')

  // 4. Gemini 재생성 테스트 (배치)
  if (process.env.GEMINI_API_KEY) {
    console.log('📋 4단계: Gemini 재생성 테스트 (배치)')
    console.log('─'.repeat(50))
    const regenerate = await testAPI('/api/public-data/regenerate', 'POST', { batch: true })
    if (regenerate.status === 200) {
      console.log('✅ 재생성 성공')
      console.log(`   처리: ${regenerate.data?.data?.processed || 0}개`)
      console.log(`   성공: ${regenerate.data?.data?.success || 0}개`)
      console.log(`   실패: ${regenerate.data?.data?.failed || 0}개`)
    } else {
      console.log(`❌ 재생성 실패: ${regenerate.status}`)
      console.log(`   에러: ${JSON.stringify(regenerate.data || regenerate.error)}`)
    }
    console.log('')
  } else {
    console.log('⏭️  4단계: Gemini 재생성 테스트 건너뜀 (GEMINI_API_KEY 없음)')
    console.log('')
  }

  // 5. 최종 상태 확인
  console.log('📋 5단계: 최종 상태 확인')
  console.log('─'.repeat(50))
  const finalQueueStatus = await testAPI('/api/public-data/queue')
  if (finalQueueStatus.status === 200) {
    console.log('✅ 최종 큐 상태:')
    console.log(`   큐 상태:`, finalQueueStatus.data?.data?.queue)
    console.log(`   재생성 완료: ${finalQueueStatus.data?.data?.regenerated}개`)
  }

  console.log('\n✅ 워크플로우 테스트 완료!')
}

main().catch(error => {
  console.error('❌ 테스트 실패:', error)
  process.exit(1)
})

