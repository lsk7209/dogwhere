
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { createPostRepository } from '@/lib/database/db-adapter'
import { createGeminiClient } from '@/lib/gemini/client'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { handleApiError, AuthenticationError } from '@/lib/api-error'
import { logger } from '@/lib/logger'

// 5분 타임아웃 (Vercel Pro 기준)
export const maxDuration = 300;

/**
 * AI 자동 블로그 생성 API
 */
export async function POST(request: NextRequest) {
    try {
        // 인증 확인
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (token !== env.INTERNAL_TOKEN) {
            throw new AuthenticationError('인증이 필요합니다.')
        }

        const { force = false } = await request.json().catch(() => ({}))

        const db = getTursoDatabase()
        const postRepo = createPostRepository()
        const gemini = createGeminiClient()

        // 설정 확인 (간격 체크)
        const settingsResult = await db.execute({
            sql: 'SELECT key, value FROM site_settings WHERE key IN (?, ?, ?)',
            args: ['auto_blog_enabled', 'auto_blog_interval_hours', 'last_auto_blog_at']
        })

        const settings: Record<string, string> = {}
        settingsResult.rows.forEach(row => settings[row[0] as string] = row[1] as string)

        const enabled = settings['auto_blog_enabled'] === 'true'
        const intervalHours = parseInt(settings['auto_blog_interval_hours'] || '12', 10)
        const lastBlogAt = settings['last_auto_blog_at'] ? new Date(settings['last_auto_blog_at']) : new Date(0)
        const now = new Date()

        if (!force) {
            if (!enabled) {
                return NextResponse.json({ success: true, message: '자동 블로그 생성이 비활성화되어 있습니다.', skipped: true })
            }

            const hoursSinceLastBlog = (now.getTime() - lastBlogAt.getTime()) / (1000 * 60 * 60)
            if (hoursSinceLastBlog < intervalHours) {
                return NextResponse.json({
                    success: true,
                    message: `마지막 블로그 생성 후 ${hoursSinceLastBlog.toFixed(1)}시간 경과. 설정 간격(${intervalHours}시간)이 지나지 않았습니다.`,
                    skipped: true
                })
            }
        }

        logger.info('[Blog Auto] 신규 블로그 생성 시작...')

        // 1. 기존 제목 목록 가져오기 (중복 방지)
        const existingTitles = await (postRepo as any).findAllTitles()

        // 2. Gemini로 신규 블로그 생성
        const blogData = await gemini.generateBlogPost(existingTitles)

        logger.info(`[Blog Auto] Gemini Response: ${JSON.stringify(blogData).substring(0, 200)}...`)

        if (!blogData || !blogData.title) {
            throw new Error('Gemini failed to generate valid blog data (missing title)')
        }
        // Validate content length (1700~2500 characters)
        if (blogData.content) {
            const len = blogData.content.replace(/\s/g, '').length
            if (len < 1700 || len > 2500) {
                logger.warn(`[Blog Auto] Generated content length ${len} out of range, may need regeneration`)
            }
        }

        // 3. 슬러그 생성
        const slug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        // 4-1. Placeholder for thumbnail generation. The actual image will be generated later using the `image_prompt`.
        let thumbnailUrl = null // will be updated after image generation

        const id = `post_${Date.now()}`

        // 4. DB 저장
        await (postRepo as any).create({
            id,
            title: blogData.title,
            slug,
            excerpt: blogData.excerpt,
            content: blogData.content,
            author: 'AI 댕댕이 기자',
            date: now.toISOString().split('T')[0],
            category: blogData.category,
            tags: JSON.stringify(blogData.tags),
            featured: false,
            thumbnail_url: thumbnailUrl,
            thumbnail_prompt: blogData.image_prompt || null
        })

        // 5. 설 업데이트 (마지막 실행 시간)
        await db.execute({
            sql: 'INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
            args: ['last_auto_blog_at', now.toISOString()]
        })

        logger.info(`[Blog Auto] 신규 블로그 생성 완료: ${blogData.title}`)

        return NextResponse.json({
            success: true,
            data: {
                id,
                title: blogData.title,
                slug
            },
            message: '신규 블로그 포스트가 생성되었습니다.'
        })
    } catch (error) {
        const fs = require('fs')
        fs.appendFileSync('error_debug.txt', `\n[${new Date().toISOString()}] Blog Gen Error: ${error instanceof Error ? error.message : 'Unknown'}\n${error instanceof Error ? error.stack : ''}\n`)
        return handleApiError(error)
    }
}
