import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function run() {
    const db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!
    })

    const settings = [
        { key: 'auto_blog_enabled', value: 'true' },
        { key: 'auto_blog_interval_hours', value: '12' },
        { key: 'last_auto_blog_at', value: '' }
    ]

    for (const s of settings) {
        await db.execute({
            sql: 'INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)',
            args: [s.key, s.value]
        })
    }

    console.log('✅ Blog settings initialized')
}

run()
