/**
 * 인메모리 데이터를 Turso 데이터베이스로 마이그레이션하는 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/migrate-simple-places-to-turso.ts
 */

import { createClient } from '@libsql/client'
import { simplePlaceDB } from '../src/lib/database/simple-places'
import * as dotenv from 'dotenv'
import * as path from 'path'

// .env.local 파일 로드
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function main() {
    console.log('🚀 인메모리 DB → Turso 마이그레이션 시작\n')

    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_AUTH_TOKEN

    if (!tursoUrl || !tursoToken) {
        console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
        process.exit(1)
    }

    const tursoClient = createClient({
        url: tursoUrl,
        authToken: tursoToken,
    })

    // 1. 인메모리 데이터 가져오기
    const places = simplePlaceDB.getAllPlaces()
    console.log(`📋 마이그레이션 대상 데이터: ${places.length}개`)

    if (places.length === 0) {
        console.log('⏹️  마이그레이션할 데이터가 없습니다.')
        return
    }

    // 2. Turso 테이블 존재 여부 확인 및 생성 (필요시)
    // schema.sql의 내용을 기반으로 places 테이블이 이미 있다고 가정하거나 
    // 여기서 간단한 체크를 할 수 있습니다.

    console.log('📦 Turso에 데이터 삽입 중...')

    let successCount = 0
    let errorCount = 0

    for (const place of places) {
        try {
            // places 테이블 스키마에 맞춰 변환
            // SimplePlace -> Database Row
            await tursoClient.execute({
                sql: `
          INSERT OR REPLACE INTO places (
            id, name, slug, category, description, 
            address, sido, sigungu, latitude, longitude,
            phone, website, overall_rating, review_count,
            verified, created_at, updated_at, source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                args: [
                    place.id,
                    place.name,
                    place.slug,
                    place.category,
                    place.description,
                    place.address,
                    place.sido,
                    place.sigungu,
                    place.latitude,
                    place.longitude,
                    place.phone || null,
                    place.website || null,
                    place.rating,
                    place.reviewCount,
                    place.isVerified ? 1 : 0,
                    place.createdAt,
                    place.updatedAt,
                    place.source
                ],
            })
            successCount++
            if (successCount % 5 === 0) {
                console.log(`  ✅ ${successCount}/${places.length} 완료...`)
            }
        } catch (error) {
            console.error(`  ❌ ${place.name} 삽입 실패:`, error)
            errorCount++
        }
    }

    console.log(`\n✨ 마이그레이션 완료!`)
    console.log(`  - 성공: ${successCount}`)
    console.log(`  - 실패: ${errorCount}`)
}

main().catch(error => {
    console.error('❌ 마이그레이션 중 치명적 오류 발생:', error)
    process.exit(1)
})
