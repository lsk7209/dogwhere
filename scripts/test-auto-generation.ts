/**
 * 자동 생성 기능 통합 테스트 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const INTERNAL_TOKEN = process.env.INTERNAL_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function callAPI(endpoint: string, body: any = {}) {
    console.log(`📡 API 호출: ${endpoint}...`)
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${INTERNAL_TOKEN}`
            },
            body: JSON.stringify({ ...body, force: true }) // 테스트를 위해 force: true 강제
        })

        const text = await response.text()
        try {
            const data = JSON.parse(text)
            return { status: response.status, data }
        } catch (e) {
            return { status: response.status, error: text }
        }
    } catch (error) {
        return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

async function main() {
    console.log('🚀 [자동 생성 통합 테스트] 시작\n')

    // 1. 장소 정보 자동 보강 테스트
    console.log('--- 1. 장소 정보 자동 보강 (Enrichment) 테스트 ---')
    // 먼저 큐에 데이터가 있는지 확인하고 없으면 추가
    await callAPI('/api/public-data/queue', { batch: true, limit: 1 })

    const enrichResult = await callAPI('/api/public-data/regenerate', { batch: true })
    if (enrichResult.status === 200) {
        console.log('✅ 장소 보강 성공!')
        console.log(`   결과: ${JSON.stringify(enrichResult.data.data?.results?.[0]?.name || '처리된 항목 없음')}`)
    } else {
        console.log('❌ 장소 보강 실패:', enrichResult.data?.error || enrichResult.error)
    }
    console.log()

    // 2. AI 자유 주제 블로그 생성 테스트
    console.log('--- 2. AI 자유 주제 블로그 생성 (Blog) 테스트 ---')
    const blogResult = await callAPI('/api/admin/blog/generate')
    if (blogResult.status === 200) {
        console.log('✅ 블로그 생성 성공!')
        console.log(`   제목: ${blogResult.data.data?.title}`)
        console.log(`   슬러그: ${blogResult.data.data?.slug}`)
    } else {
        console.log('❌ 블로그 생성 실패:', blogResult.data?.error || blogResult.error)
    }
    console.log()

    console.log('🏁 테스트가 완료되었습니다.')
}

main()
