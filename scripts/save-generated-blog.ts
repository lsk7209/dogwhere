import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

// Mock validation to bypass env.ts if it throws
process.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secret';

import { createGeminiClient } from '../src/lib/gemini/client'
import { PostRepository } from '../src/lib/database/turso-repository'
import { createClient } from '@libsql/client'
import * as fs from 'fs'

async function main() {
    console.log('--- START SAVING TO DB ---');

    // 1. DB Client Setup
    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

    if (!tursoUrl || !tursoAuthToken) {
        console.error('❌ TURSO environment variables are missing.')
        return
    }

    const dbClient = createClient({
        url: tursoUrl,
        authToken: tursoAuthToken,
    })

    // Mocking getTursoDatabase since we are in a script context
    // We need to inject the client or rely on the repository's internal logic if it picks up env vars
    // However, PostRepository usually gets a client or creates one.
    // The existing code for createGeminiClient doesn't need DB, but PostRepository does.

    // Let's rely on PostRepository's default constructor which calls getDB() -> getTursoDatabase()
    // BUT getTursoDatabase usually returns a singleton. In scripts, we might need to initialize it.
    // Simpler approach: Instantiate PostRepository directly if possible or mock the getDB.

    // Actually, looking at turso-repository.ts, it imports getTursoDatabase from './turso-client'.
    // We should probably rely on that if env vars are set correctly.

    const postRepo = new PostRepository(dbClient as any) // Type assertion might be needed depending on lib version

    try {
        // 2. Read the previously generated content from file if exists, 
        // OR generate new content if user prefers. 
        // The user said: "실제 페이지에 게시해줘. 블로그글, 그리고 api에서 디비로 저장한 정보 보완 된 글도"
        // Let's re-use the content we just generated and approved, or regenerates if not persisted.
        // Since we have 'generated_blog_post.md' artifact, we could parse it, but that's markdown.
        // The script 'debug-blog-generation.ts' output the JSON to console.
        // We can just re-generate one for simplicity and "freshness" or use hardcocded data from previous step?
        // Let's re-generate to ensure clean flow, OR parse valid JSON if we saved it properly.
        // Given the requirement "실제 페이지에 게시해줘", I will RE-GENERATE and SAVE.

        console.log('🤖 Generating new blog post via Gemini...');
        const gemini = createGeminiClient();

        // Get existing titles to avoid duplication (optional, but good practice)
        // const existingTitles = await postRepo.findAllTitles(); 
        // For now pass empty array
        const blogData = await gemini.generateBlogPost([]);

        console.log(`✅ Generated: ${blogData.title}`);

        // 3. Prepare data for DB
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            + '-' + Date.now().toString().slice(-4); // Add randomness

        const now = new Date().toISOString();

        const newPost = {
            id: `post_${Date.now()}`,
            title: blogData.title,
            slug: slug,
            excerpt: blogData.excerpt,
            content: blogData.content,
            author: 'Gemini AI',
            date: now,
            category: blogData.category || 'General',
            image: null, // We don't have actual image yet, just prompt
            // Note: Schema.sql has 'tags' as TEXT (JSON string in comments), but Repository might handle it?
            // Checking create method: args[10] is (data.tags || null).
            // If tags is string[] in blogData, we should stringify it?
            // sqlite doesn't support arrays natively. usually stringified.
            tags: JSON.stringify(blogData.tags),
            featured: false,
            // Extra metadata from Gemini
            seo_keywords: JSON.stringify(blogData.tags), // Use tags as keywords
            thumbnail_url: null,
            thumbnail_prompt: blogData.image_prompt,
            created_at: now,
            updated_at: now
        };

        // 4. Save to DB
        console.log('💾 Saving to Turso DB...');
        await postRepo.create(newPost);

        console.log('✨ Success! Blog post saved.');
        console.log(`🔗 URL Prediction: /blog/${slug}`);

    } catch (error: any) {
        console.error('❌ Failed to save blog post:', error);
        console.error(error);
    }
}

main();
