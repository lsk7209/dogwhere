export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { createGeminiClient } from '@/lib/gemini/client'
import { handleApiError, AuthenticationError, ValidationError, NotFoundError } from '@/lib/api-error'
import { logger } from '@/lib/logger'

/**
 * Gemini를 사용한 컨텐츠 재생성 API
 * 발행 큐에서 호출
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('인증이 필요합니다.')
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== env.INTERNAL_TOKEN) {
      throw new AuthenticationError('유효하지 않은 토큰입니다.')
    }

    const { placeId, batch = false, force = false } = await request.json()

    const db = getTursoDatabase()
    const gemini = createGeminiClient()

    if (batch) {
      // 설정 가져오기
      const settingsResult = await db.execute({
        sql: 'SELECT key, value FROM site_settings WHERE key IN (?, ?, ?, ?)',
        args: ['auto_posting_enabled', 'auto_posting_interval_hours', 'last_auto_post_at', 'max_posts_per_session']
      })

      const settings: Record<string, string> = {}
      settingsResult.rows.forEach(row => settings[row[0] as string] = row[1] as string)

      const enabled = settings['auto_posting_enabled'] === 'true'
      const intervalHours = parseInt(settings['auto_posting_interval_hours'] || '6', 10)
      const lastPostAt = settings['last_auto_post_at'] ? new Date(settings['last_auto_post_at']) : new Date(0)
      const maxPosts = parseInt(settings['max_posts_per_session'] || '1', 10)
      const now = new Date()

      // 수동 강제 실행이 아니고, 자동 포스팅이 비활성화되어 있거나 간격이 지나지 않았으면 건너뜀
      if (!force) {
        if (!enabled) {
          return NextResponse.json({ success: true, message: '자동 포스팅이 비활성화되어 있습니다.', skipped: true })
        }

        const hoursSinceLastPost = (now.getTime() - lastPostAt.getTime()) / (1000 * 60 * 60)
        if (hoursSinceLastPost < intervalHours) {
          return NextResponse.json({
            success: true,
            message: `마지막 발행 후 ${hoursSinceLastPost.toFixed(1)}시간 경과. 설정 간격(${intervalHours}시간)이 지나지 않았습니다.`,
            skipped: true
          })
        }
      }

      // 배치 처리: 큐에서 여러 항목 처리
      // 재생성된 컨텐츠가 없는 항목만 처리
      const queueItems = await db.execute({
        sql: `
          SELECT pq.id, pq.place_id, pd.name, pd.category, pd.address, pd.description, pd.raw_data
          FROM publish_queue pq
          JOIN public_data_places pd ON pq.place_id = pd.id
          WHERE pq.status = 'pending'
            AND (pd.regenerated_content IS NULL OR pd.regenerated_content = '')
          ORDER BY pq.priority DESC, pq.created_at ASC
          LIMIT ?
        `,
        args: [maxPosts],
      })

      const results = []

      for (const row of queueItems.rows) {
        const queueId = row[0] as string
        const placeId = row[1] as string
        const name = row[2] as string
        const category = row[3] as string
        const address = row[4] as string
        const description = row[5] as string
        const rawData = JSON.parse((row[6] as string) || '{}')

        try {
          // 큐 상태 업데이트
          await db.execute({
            sql: 'UPDATE publish_queue SET status = ?, attempts = attempts + 1 WHERE id = ?',
            args: ['processing', queueId],
          })

          // Gemini 재생성
          const result = await gemini.regenerateContent({
            originalData: {
              name,
              category,
              address,
              description,
              ...rawData,
            },
          })

          // 재생성된 컨텐츠 저장 및 즉시 사이트맵에 포함
          // 재생성은 기존 페이지 업데이트 개념이므로 바로 노출
          await db.execute({
            sql: `
              UPDATE public_data_places 
              SET regenerated_content = ?, 
                  regeneration_status = 'completed',
                  last_regenerated_at = CURRENT_TIMESTAMP,
                  gemini_model = ?,
                  sitemap_excluded = 0,
                  noindex = 0,
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            args: [result.content, result.model, placeId],
          })

          // 큐 완료 처리 및 제거
          await db.execute({
            sql: 'DELETE FROM publish_queue WHERE id = ?',
            args: [queueId],
          })

          results.push({ placeId, success: true })
        } catch (error) {
          logger.error(`[Regenerate] 실패: ${placeId}`, error as Error)

          // 실패 처리
          await db.execute({
            sql: `
              UPDATE publish_queue 
              SET status = CASE 
                WHEN attempts + 1 >= max_attempts THEN 'failed'
                ELSE 'pending'
              END,
              attempts = attempts + 1,
              error_message = ?
              WHERE id = ?
            `,
            args: [
              error instanceof Error ? error.message : 'Unknown error',
              queueId,
            ],
          })

          results.push({ placeId, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
        }

        // API 제한을 위한 대기
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // 성공적으로 발행된 것이 있으면 마지막 발행 시간 업데이트
      if (results.some(r => r.success)) {
        await db.execute({
          sql: 'INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
          args: ['last_auto_post_at', new Date().toISOString()]
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          processed: results.length,
          results,
        },
        message: '배치 재생성이 완료되었습니다.',
      })
    } else {
      // 단일 항목 처리
      if (!placeId) {
        throw new ValidationError('placeId가 필요합니다.')
      }

      // 장소 정보 조회
      const placeResult = await db.execute({
        sql: 'SELECT name, category, address, description, raw_data FROM public_data_places WHERE id = ?',
        args: [placeId],
      })

      if (placeResult.rows.length === 0) {
        throw new NotFoundError('장소를 찾을 수 없습니다.')
      }

      const row = placeResult.rows[0]
      const name = row[0] as string
      const category = row[1] as string
      const address = row[2] as string
      const description = row[3] as string
      const rawData = JSON.parse((row[4] as string) || '{}')

      // 재생성 상태 업데이트
      await db.execute({
        sql: 'UPDATE public_data_places SET regeneration_status = ? WHERE id = ?',
        args: ['processing', placeId],
      })

      // Gemini 재생성
      const result = await gemini.regenerateContent({
        originalData: {
          name,
          category,
          address,
          description,
          ...rawData,
        },
      })

      // 재생성된 컨텐츠 저장 및 즉시 사이트맵에 포함
      // 재생성은 기존 페이지 업데이트 개념이므로 바로 노출
      await db.execute({
        sql: `
          UPDATE public_data_places 
          SET regenerated_content = ?, 
              regeneration_status = 'completed',
              last_regenerated_at = CURRENT_TIMESTAMP,
              gemini_model = ?,
              sitemap_excluded = 0,
              noindex = 0,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [result.content, result.model, placeId],
      })

      return NextResponse.json({
        success: true,
        data: {
          placeId,
          content: result.content,
          model: result.model,
          tokensUsed: result.tokensUsed,
        },
        message: '컨텐츠 재생성이 완료되었습니다.',
      })
    }
  } catch (error) {
    const fs = require('fs')
    fs.appendFileSync('error_debug.txt', `\n[${new Date().toISOString()}] Regenerate Error: ${error instanceof Error ? error.message : 'Unknown'}\n${error instanceof Error ? error.stack : ''}\n`)
    console.error('Regenerate API error:', error)

    return NextResponse.json({
      success: false,
      error: {
        message: '컨텐츠 재생성 중 오류가 발생했습니다.',
        code: 'REGENERATION_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

