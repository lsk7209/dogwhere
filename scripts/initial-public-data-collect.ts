/**
 * 공공데이터 초기 전체 수집 스크립트
 * 처음 1회만 실행하여 모든 데이터를 수집합니다.
 * 
 * 사용법:
 *   npx tsx scripts/initial-public-data-collect.ts
 * 
 * 환경 변수:
 *   - TURSO_DATABASE_URL
 *   - TURSO_AUTH_TOKEN
 *   - PUBLIC_DATA_API_KEY (또는 각 API별 키)
 *   - INTERNAL_TOKEN
 *   - NEXT_PUBLIC_SITE_URL
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

import { collectAllPages } from '../src/lib/public-data/collector'
import { createClient } from '@libsql/client'

interface CollectionConfig {
  source: string
  config: {
    apiKey: string
    serviceKey?: string
    baseUrl: string
    endpoint: string
    params?: Record<string, string>
    mobileOS?: string
    mobileApp?: string
    sourceApi?: string
  }
  maxPages?: number
}

// 수집할 공공데이터 소스 목록
const COLLECTION_SOURCES: CollectionConfig[] = [
  // 한국관광공사 반려동물 동반여행 서비스
  {
    source: 'kor-pet-tour',
    config: {
      apiKey: process.env.PUBLIC_DATA_API_KEY || '',
      serviceKey: process.env.PUBLIC_DATA_API_KEY || '',
      baseUrl: 'https://apis.data.go.kr/B551011/KorPetTourService',
      endpoint: '/areaBasedList',
      mobileOS: 'ETC',
      mobileApp: 'dogwhere',
      params: {
        listYN: 'Y', // 목록 조회
        arrange: 'C', // 수정일순 정렬
        contentTypeId: '', // 전체 타입 (12:관광지, 32:숙박, 39:음식점 등)
        // areaCode: '', // 지역코드 (선택)
        // sigunguCode: '', // 시군구코드 (선택)
      },
    },
    maxPages: 100, // 최대 100페이지 (10,000개)
  },
  // 기존 공공데이터 소스
  {
    source: 'data.go.kr',
    config: {
      apiKey: process.env.PUBLIC_DATA_API_KEY || '',
      baseUrl: 'https://apis.data.go.kr',
      endpoint: '/B551011/KorService1/searchKeyword',
      params: {
        keyword: '강아지 동반',
      },
    },
    maxPages: 50,
  },
  // 추가 공공데이터 소스는 여기에 추가
]

/**
 * 슬러그 생성
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * 초기 전체 수집 실행
 */
async function main() {
  console.log('🚀 공공데이터 초기 전체 수집 시작\n')

  // 환경 변수 확인
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    process.exit(1)
  }

  // Turso 클라이언트 직접 생성
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    process.exit(1)
  }

  const db = createClient({ url, authToken })

  // 연결 테스트
  try {
    await db.execute({ sql: 'SELECT 1', args: [] })
    console.log('✅ 데이터베이스 연결 성공\n')
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error)
    process.exit(1)
  }

  // 기존 데이터 확인
  const existingCount = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM public_data_places',
    args: []
  })
  const existing = (existingCount.rows[0]?.[0] as number) || 0

  if (existing > 0) {
    console.log(`⚠️  기존 데이터가 ${existing}개 있습니다.`)
    console.log('   초기 수집은 데이터가 없을 때만 실행하는 것을 권장합니다.\n')
    
    const readline = require('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const answer = await new Promise<string>((resolve) => {
      rl.question('계속하시겠습니까? (y/n): ', resolve)
    })
    rl.close()

    if (answer.toLowerCase() !== 'y') {
      console.log('수집 취소됨')
      process.exit(0)
    }
  }

  let totalCollected = 0
  let totalAdded = 0
  let totalUpdated = 0
  let totalSkipped = 0

  // 각 소스별로 수집
  for (const sourceConfig of COLLECTION_SOURCES) {
    if (!sourceConfig.config.apiKey) {
      console.log(`⏭️  ${sourceConfig.source}: API 키 없음, 건너뜀\n`)
      continue
    }

    console.log(`📦 ${sourceConfig.source} 수집 시작...`)
    console.log(`   최대 페이지: ${sourceConfig.maxPages || 10}\n`)

    try {
      // 데이터 수집
      const places = await collectAllPages(
        {
          apiKey: sourceConfig.config.apiKey,
          serviceKey: sourceConfig.config.serviceKey,
          baseUrl: sourceConfig.config.baseUrl,
          endpoint: sourceConfig.config.endpoint,
          params: sourceConfig.config.params,
          mobileOS: sourceConfig.config.mobileOS,
          mobileApp: sourceConfig.config.mobileApp,
          sourceApi: sourceConfig.config.sourceApi || sourceConfig.source,
        },
        sourceConfig.maxPages || 10
      )

      console.log(`   수집 완료: ${places.length}개\n`)

      // DB에 저장
      let added = 0
      let updated = 0
      let skipped = 0

      // 배치 중복 체크로 성능 최적화
      const { filterNewPlaces } = await import('../src/lib/public-data/duplicate-checker')
      const { newPlaces, existingPlaces } = await filterNewPlaces(places)

      console.log(`   신규: ${newPlaces.length}개, 기존: ${existingPlaces.length}개\n`)

      // 신규 데이터 저장
      for (const place of newPlaces) {
        try {
          const id = `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          const slug = generateSlug(place.name)

          await db.execute({
            sql: `
              INSERT INTO public_data_places (
                id, public_data_id, source_api, raw_data,
                name, slug, category, address, sido, sigungu,
                latitude, longitude, phone, website,
                sitemap_excluded, noindex,
                collected_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP)
            `,
            args: [
              id,
              place.publicDataId,
              place.sourceApi,
              JSON.stringify(place.rawData),
              place.name,
              slug,
              place.category || null,
              place.address || null,
              place.sido || null,
              place.sigungu || null,
              place.latitude || null,
              place.longitude || null,
              place.phone || null,
              place.website || null,
            ],
          })
          added++
        } catch (error) {
          // UNIQUE 제약 위반 시 중복으로 처리
          if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
            skipped++
            console.log(`   중복 데이터 건너뜀: ${place.name}`)
          } else {
            console.error(`   저장 실패: ${place.name}`, error)
            skipped++
          }
        }
      }

      // 기존 데이터 업데이트
      if (existingPlaces.length > 0) {
        console.log(`   기존 데이터 ${existingPlaces.length}개 업데이트 중...`)
        for (const place of existingPlaces) {
          try {
            await db.execute({
              sql: `
                UPDATE public_data_places 
                SET name = ?, category = ?, address = ?, sido = ?, sigungu = ?, 
                    latitude = ?, longitude = ?, phone = ?, website = ?,
                    raw_data = ?, updated_at = CURRENT_TIMESTAMP
                WHERE public_data_id = ? AND source_api = ?
              `,
              args: [
                place.name,
                place.category || null,
                place.address || null,
                place.sido || null,
                place.sigungu || null,
                place.latitude || null,
                place.longitude || null,
                place.phone || null,
                place.website || null,
                JSON.stringify(place.rawData),
                place.publicDataId,
                place.sourceApi,
              ],
            })
            updated++
          } catch (error) {
            console.error(`   업데이트 실패: ${place.name}`, error)
            skipped++
          }
        }
      }

      console.log(`   ✅ ${sourceConfig.source} 완료:`)
      console.log(`      추가: ${added}개`)
      console.log(`      업데이트: ${updated}개`)
      console.log(`      건너뜀: ${skipped}개\n`)

      totalCollected += places.length
      totalAdded += added
      totalUpdated += updated
      totalSkipped += skipped

      // API 제한을 위한 대기
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`   ❌ ${sourceConfig.source} 수집 실패:`, error)
      console.log('')
    }
  }

  // 최종 통계
  console.log('📊 전체 수집 통계:')
  console.log(`   수집: ${totalCollected}개`)
  console.log(`   추가: ${totalAdded}개`)
  console.log(`   업데이트: ${totalUpdated}개`)
  console.log(`   건너뜀: ${totalSkipped}개\n`)

  // 최종 데이터 개수
  const finalCount = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM public_data_places',
    args: []
  })
  const final = (finalCount.rows[0]?.[0] as number) || 0

  console.log(`✅ 초기 수집 완료! 총 ${final}개 데이터가 저장되었습니다.`)
}

main().catch(error => {
  console.error('❌ 초기 수집 실패:', error)
  process.exit(1)
})

