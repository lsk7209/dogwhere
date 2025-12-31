/**
 * 큐 추가 및 재생성 테스트 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@libsql/client'

config({ path: resolve(process.cwd(), '.env.local') })

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN

// 포트 감지: 환경 변수 우선, 없으면 3002 사용 (현재 실행 중인 포트)
function getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  // 기본값: 3002 (현재 실행 중인 포트)
  return 'http://localhost:3002'
}

if (!INTERNAL_TOKEN) {
  console.error('❌ INTERNAL_TOKEN 환경 변수가 필요합니다.')
  process.exit(1)
}

async function callAPI(baseUrl: string, endpoint: string, method: string = 'GET', body?: any) {
  const url = `${baseUrl}${endpoint}`
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${INTERNAL_TOKEN}`,
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
    return { 
      status: 0, 
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionError: true 
    }
  }
}

async function main() {
  console.log('🚀 큐 추가 및 재생성 테스트 시작\n')
  
  const BASE_URL = getBaseURL()
  console.log(`Base URL: ${BASE_URL}\n`)

  // 서버 연결 확인
  console.log('📋 0단계: 서버 연결 확인')
  console.log('─'.repeat(50))
  const healthCheck = await callAPI(BASE_URL, '/api/public-data/search?q=test&limit=1')
  if (healthCheck.connectionError) {
    console.log('❌ 서버에 연결할 수 없습니다.')
    console.log('   개발 서버를 실행해주세요: npm run dev')
    process.exit(1)
  }
  console.log('✅ 서버 연결 성공\n')

  // 1. 큐 상태 확인
  console.log('📋 1단계: 큐 상태 확인')
  console.log('─'.repeat(50))
  const queueStatus = await callAPI(BASE_URL, '/api/public-data/queue')
  if (queueStatus.status === 200) {
    console.log('✅ 큐 상태 조회 성공')
    console.log(`   큐 상태:`, queueStatus.data?.data?.queue)
    console.log(`   재생성 완료: ${queueStatus.data?.data?.regenerated || 0}개`)
  } else {
    console.log(`❌ 큐 상태 조회 실패: ${queueStatus.status}`)
  }
  console.log('')

  // 2. 큐에 항목 추가 (5개)
  console.log('📋 2단계: 큐에 항목 추가 (5개)')
  console.log('─'.repeat(50))
  const queueAdd = await callAPI(BASE_URL, '/api/public-data/queue', 'POST', { batch: true, limit: 5 })
  if (queueAdd.status === 200) {
    console.log('✅ 큐 추가 성공')
    console.log(`   추가: ${queueAdd.data?.data?.added || 0}개`)
    console.log(`   건너뜀: ${queueAdd.data?.data?.skipped || 0}개`)
  } else {
    console.log(`❌ 큐 추가 실패: ${queueAdd.status}`)
    console.log(`   에러: ${JSON.stringify(queueAdd.data || queueAdd.error)}`)
  }
  console.log('')

  // 3. 큐 상태 재확인
  console.log('📋 3단계: 큐 상태 재확인')
  console.log('─'.repeat(50))
  const queueStatus2 = await callAPI(BASE_URL, '/api/public-data/queue')
  if (queueStatus2.status === 200) {
    console.log('✅ 큐 상태 조회 성공')
    console.log(`   큐 상태:`, queueStatus2.data?.data?.queue)
  }
  console.log('')

  // 4. Gemini 재생성 테스트
  if (process.env.GEMINI_API_KEY) {
    console.log('📋 4단계: Gemini 재생성 테스트 (배치)')
    console.log('─'.repeat(50))
    console.log('   재생성 시작... (약 10-20초 소요)')
    const regenerate = await callAPI(BASE_URL, '/api/public-data/regenerate', 'POST', { batch: true })
    if (regenerate.status === 200) {
      console.log('✅ 재생성 성공')
      const processed = regenerate.data?.data?.processed || 0
      const results = regenerate.data?.data?.results || []
      const success = results.filter((r: any) => r.success).length
      const failed = results.filter((r: any) => !r.success).length
      console.log(`   처리: ${processed}개`)
      console.log(`   성공: ${success}개`)
      console.log(`   실패: ${failed}개`)
      if (success > 0) {
        console.log(`\n   ✅ ${success}개 항목이 재생성되어 사이트맵에 포함되었습니다!`)
      }
    } else {
      console.log(`❌ 재생성 실패: ${regenerate.status}`)
      console.log(`   에러: ${JSON.stringify(regenerate.data || regenerate.error)}`)
    }
    console.log('')
  } else {
    console.log('⏭️  4단계: Gemini 재생성 테스트 건너뜀 (GEMINI_API_KEY 없음)')
    console.log('   .env.local에 GEMINI_API_KEY를 추가하면 재생성 테스트가 가능합니다.')
    console.log('')
  }

  // 5. 최종 상태 확인
  console.log('📋 5단계: 최종 상태 확인')
  console.log('─'.repeat(50))
  const finalQueueStatus = await callAPI(BASE_URL, '/api/public-data/queue')
  if (finalQueueStatus.status === 200) {
    console.log('✅ 최종 큐 상태:')
    console.log(`   큐 상태:`, finalQueueStatus.data?.data?.queue)
    console.log(`   재생성 완료: ${finalQueueStatus.data?.data?.regenerated || 0}개`)
  }

  // 6. 사이트맵 포함 항목 확인
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })

  const sitemapCount = await db.execute({
    sql: `
      SELECT COUNT(*) 
      FROM public_data_places 
      WHERE regeneration_status = 'completed'
        AND regenerated_content IS NOT NULL
        AND regenerated_content != ''
        AND sitemap_excluded = 0
    `,
    args: [],
  })
  const sitemapReady = (sitemapCount.rows[0]?.[0] as number) || 0
  console.log(`   사이트맵 포함 가능: ${sitemapReady}개`)
  console.log('')

  console.log('✅ 테스트 완료!')
  console.log('\n📝 확인 사항:')
  const port = BASE_URL.split(':').pop() || '3000'
  console.log(`   1. 검색 API: http://localhost:${port}/api/public-data/search?q=올리브영&limit=5`)
  console.log(`   2. 사이트맵: http://localhost:${port}/sitemap.xml`)
  if (sitemapReady > 0) {
    console.log(`   3. 재생성된 페이지: http://localhost:${port}/public-data/place/{slug}`)
  }
}

main().catch(error => {
  console.error('❌ 테스트 실패:', error)
  process.exit(1)
})

