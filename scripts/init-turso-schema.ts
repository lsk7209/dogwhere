/**
 * Turso 데이터베이스에 schema.sql을 적용하는 스크립트
 */

import { createClient } from '@libsql/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// .env.local 파일 로드
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function main() {
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

    const schemaPath = path.join(process.cwd(), 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')

    console.log('📝 스키마 적용 중...')

    // 주석 제거 및 문장 분할
    const cleanSql = schemaSql
        .replace(/--.*$/gm, '') // 한 줄 주석 제거
        .replace(/\/\*[\s\S]*?\*\//g, '') // 여러 줄 주석 제거

    const sqlStatements = cleanSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

    for (const sql of sqlStatements) {
        try {
            await tursoClient.execute(sql)
            console.log(`  ✅ 실행 성공: ${sql.substring(0, 50).replace(/\n/g, ' ')}...`)
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                console.log(`  ℹ️  이미 존재함: ${sql.substring(0, 50).replace(/\n/g, ' ')}...`)
            } else {
                console.error(`  ❌ 실행 실패: ${sql.substring(0, 50).replace(/\n/g, ' ')}...`)
                console.error(`     에러: ${error instanceof Error ? error.message : String(error)}`)
            }
        }
    }

    console.log('\n✨ 스키마 적용 완료!')
}

main().catch(console.error)
