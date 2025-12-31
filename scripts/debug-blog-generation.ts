import { createGeminiClient } from '../src/lib/gemini/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

async function test() {
    console.log('--- START ---');
    try {
        const client = createGeminiClient();
        const blog = await client.generateBlogPost([]);
        console.log('FULL DATA:', JSON.stringify(blog, null, 2));
        console.log('--- END ---');
    } catch (error: any) {
        console.log('--- ERROR ---');
        console.log(error.message);
    }
}

test();
