
import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

async function main() {
    console.log('🔄 Adding thumbnail columns to posts table...');

    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoToken = process.env.TURSO_AUTH_TOKEN

    if (!tursoUrl || !tursoToken) {
        console.error('❌ TURSO env vars missing');
        process.exit(1);
    }

    const client = createClient({
        url: tursoUrl,
        authToken: tursoToken,
    });

    try {
        await client.execute('ALTER TABLE posts ADD COLUMN thumbnail_url TEXT');
        console.log('✅ Added thumbnail_url column');
    } catch (e: any) {
        if (e.message.includes('duplicate column')) {
            console.log('ℹ️ thumbnail_url already exists');
        } else {
            console.error('⚠️ Failed to add thumbnail_url:', e.message);
        }
    }

    try {
        await client.execute('ALTER TABLE posts ADD COLUMN thumbnail_prompt TEXT');
        console.log('✅ Added thumbnail_prompt column');
    } catch (e: any) {
        if (e.message.includes('duplicate column')) {
            console.log('ℹ️ thumbnail_prompt already exists');
        } else {
            console.error('⚠️ Failed to add thumbnail_prompt:', e.message);
        }
    }

    console.log('✨ Migration complete');
}

main();
