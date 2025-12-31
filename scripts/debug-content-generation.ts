/**
 * Gemini 컨텐츠 생성 디버깅 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@libsql/client'
import { createGeminiClient } from '../src/lib/gemini/client'
import * as fs from 'fs'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
    const db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    })

    // 1. 테스트할 장소 하나 가져오기
    const result = await db.execute({
        sql: 'SELECT id, name, category, address, description, raw_data FROM public_data_places LIMIT 1',
        args: []
    })

    if (result.rows.length === 0) {
        console.log('❌ 테스트할 장소가 데이터베이스에 없습니다.')
        return
    }

    const row = result.rows[0]
    const place = {
        id: row[0] as string,
        name: row[1] as string,
        category: row[2] as string,
        address: row[3] as string,
        description: row[4] as string,
        rawData: JSON.parse((row[5] as string) || '{}')
    }

    console.log(`📍 테스트 대상: ${place.name} (${place.id})`)

    // 2. Gemini 클라이언트 생성
    const gemini = createGeminiClient()

    console.log('🤖 Gemini가 컨텐츠를 생성 중입니다...')

    try {
        const result = await gemini.regenerateContent({
            originalData: {
                name: place.name,
                category: place.category,
                address: place.address,
                description: place.description,
                ...place.rawData
            }
        })

        console.log(`✅ 생성 완료`)

        // 파일로 저장 (UTF-8)
        fs.writeFileSync('generation_result.txt', result.content, 'utf8')
        console.log('\n✅ 결과가 generation_result.txt에 저장되었습니다.')
    } catch (error) {
        console.error('❌ 컨텐츠 생성 실패:', error)
    }
}

main()
