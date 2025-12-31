import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function run() {
    const db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!
    });

    const res = await db.execute("SELECT * FROM public_data_places WHERE slug = 'bcbg-'");
    const row = res.rows[0];

    if (!row) {
        console.log('No row found');
        return;
    }

    // rows in libsql are objects but also iterable
    for (const [key, value] of Object.entries(row)) {
        console.log(`${key}: ${typeof value} (${value})`);
    }
}

run();
