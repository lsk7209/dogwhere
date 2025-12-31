/**
 * 설정을 위한 테이블 생성 마이그레이션 스크립트
 */

import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function main() {
    const url = process.env.TURSO_DATABASE_URL
    const authToken = process.env.TURSO_AUTH_TOKEN

    if (!url || !authToken) {
        console.error('Environment variables missing')
        process.exit(1)
    }

    const client = createClient({ url, authToken })

    try {
        console.log('🚀 Creating settings table...')

        await client.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

        // 기본 설정값 삽입
        const defaultSettings = [
            { key: 'auto_posting_interval_hours', value: '6' },
            { key: 'auto_posting_enabled', value: 'true' },
            { key: 'last_auto_post_at', value: '' },
            { key: 'max_posts_per_session', value: '1' }
        ]

        for (const setting of defaultSettings) {
            await client.execute({
                sql: 'INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)',
                args: [setting.key, setting.value]
            })
        }

        console.log('✅ Settings table created and initialized.')
        process.exit(0)
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    }
}

main()
