/**
 * 워크플로우 검증 스크립트
 * 데이터베이스 상태를 직접 확인하여 각 단계를 검증합니다.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@libsql/client'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
  console.log('🔍 공공데이터 워크플로우 검증 시작\n')

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    process.exit(1)
  }

  const db = createClient({ url, authToken })

  try {
    // 1. 전체 데이터 통계
    console.log('📊 1단계: 데이터베이스 통계')
    console.log('─'.repeat(50))
    
    const totalResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM public_data_places',
      args: [],
    })
    const total = (totalResult.rows[0]?.[0] as number) || 0
    console.log(`   전체 데이터: ${total}개`)

    const sitemapExcludedResult = await db.execute({
      sql: 'SELECT COUNT(*) FROM public_data_places WHERE sitemap_excluded = 1',
      args: [],
    })
    const sitemapExcluded = (sitemapExcludedResult.rows[0]?.[0] as number) || 0
    console.log(`   사이트맵 제외: ${sitemapExcluded}개`)

    const sitemapIncludedResult = await db.execute({
      sql: 'SELECT COUNT(*) FROM public_data_places WHERE sitemap_excluded = 0',
      args: [],
    })
    const sitemapIncluded = (sitemapIncludedResult.rows[0]?.[0] as number) || 0
    console.log(`   사이트맵 포함: ${sitemapIncluded}개`)
    console.log('')

    // 2. 재생성 상태 통계
    console.log('📊 2단계: 재생성 상태 통계')
    console.log('─'.repeat(50))
    
    const regeneratedResult = await db.execute({
      sql: `
        SELECT COUNT(*) 
        FROM public_data_places 
        WHERE regeneration_status = 'completed' 
          AND regenerated_content IS NOT NULL 
          AND regenerated_content != ''
      `,
      args: [],
    })
    const regenerated = (regeneratedResult.rows[0]?.[0] as number) || 0
    console.log(`   재생성 완료: ${regenerated}개`)

    const pendingResult = await db.execute({
      sql: `
        SELECT COUNT(*) 
        FROM public_data_places 
        WHERE regeneration_status = 'pending'
      `,
      args: [],
    })
    const pending = (pendingResult.rows[0]?.[0] as number) || 0
    console.log(`   재생성 대기: ${pending}개`)
    console.log('')

    // 3. 큐 상태
    console.log('📊 3단계: 발행 큐 상태')
    console.log('─'.repeat(50))
    
    const queueStats = await db.execute({
      sql: `
        SELECT status, COUNT(*) as count
        FROM publish_queue
        GROUP BY status
      `,
      args: [],
    })

    if (queueStats.rows.length === 0) {
      console.log('   큐에 항목 없음')
    } else {
      for (const row of queueStats.rows) {
        console.log(`   ${row[0]}: ${row[1]}개`)
      }
    }
    console.log('')

    // 4. 재생성 완료 + 사이트맵 포함 상태 확인
    console.log('📊 4단계: 재생성 완료 + 사이트맵 포함 상태')
    console.log('─'.repeat(50))
    
    const readyForSitemap = await db.execute({
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
    const readyCount = (readyForSitemap.rows[0]?.[0] as number) || 0
    console.log(`   사이트맵 포함 가능: ${readyCount}개`)

    if (readyCount > 0) {
      const sampleResult = await db.execute({
        sql: `
          SELECT name, slug, regeneration_status, sitemap_excluded, noindex
          FROM public_data_places 
          WHERE regeneration_status = 'completed'
            AND regenerated_content IS NOT NULL
            AND regenerated_content != ''
            AND sitemap_excluded = 0
          LIMIT 3
        `,
        args: [],
      })
      
      console.log(`   샘플 데이터 (최대 3개):`)
      for (const row of sampleResult.rows) {
        console.log(`   - ${row[0]} (${row[1]})`)
        console.log(`     상태: ${row[2]}, 사이트맵: ${row[3] === 0 ? '포함' : '제외'}, noindex: ${row[4] === 0 ? '아니오' : '예'}`)
      }
    }
    console.log('')

    // 5. 큐에 추가 가능한 항목 수
    console.log('📊 5단계: 큐에 추가 가능한 항목')
    console.log('─'.repeat(50))
    
    const queueableResult = await db.execute({
      sql: `
        SELECT COUNT(*) 
        FROM public_data_places 
        WHERE (regenerated_content IS NULL OR regenerated_content = '')
          AND regeneration_status != 'processing'
          AND id NOT IN (
            SELECT place_id FROM publish_queue WHERE status IN ('pending', 'processing')
          )
      `,
      args: [],
    })
    const queueable = (queueableResult.rows[0]?.[0] as number) || 0
    console.log(`   큐에 추가 가능: ${queueable}개`)
    console.log('')

    // 6. 검색 테스트용 샘플 데이터
    console.log('📊 6단계: 검색 테스트용 샘플 데이터')
    console.log('─'.repeat(50))
    
    const sampleSearch = await db.execute({
      sql: `
        SELECT name, category, address, sido, sigungu, sitemap_excluded, noindex
        FROM public_data_places 
        LIMIT 5
      `,
      args: [],
    })

    if (sampleSearch.rows.length > 0) {
      console.log(`   샘플 데이터 (최대 5개):`)
      for (const row of sampleSearch.rows) {
        console.log(`   - ${row[0]} (${row[1] || '카테고리 없음'})`)
        console.log(`     주소: ${row[2] || '없음'}, ${row[3] || ''} ${row[4] || ''}`)
        console.log(`     사이트맵: ${row[5] === 0 ? '포함' : '제외'}, noindex: ${row[6] === 0 ? '아니오' : '예'}`)
      }
    } else {
      console.log('   데이터 없음')
    }
    console.log('')

    console.log('✅ 워크플로우 검증 완료!')
    console.log('\n📝 다음 단계:')
    console.log('   1. 개발 서버 실행: npm run dev')
    console.log('   2. 검색 API 테스트: http://localhost:3000/api/public-data/search?q=올리브영&limit=5')
    console.log('   3. 큐에 항목 추가: POST /api/public-data/queue (batch: true)')
    console.log('   4. 재생성 실행: POST /api/public-data/regenerate (batch: true)')
    console.log('   5. 사이트맵 확인: http://localhost:3000/sitemap.xml')

  } catch (error) {
    console.error('❌ 검증 실패:', error)
    process.exit(1)
  }
}

main()

