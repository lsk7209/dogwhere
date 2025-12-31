export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { handleApiError, AuthenticationError, ValidationError, DatabaseError, NotFoundError } from '@/lib/api-error'
import { logger } from '@/lib/logger'

/**
 * 재생성 큐 관리 API
 * 재생성된 컨텐츠가 없는 데이터만 큐에 추가
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

    const { placeId, batch = false, limit = 10 } = await request.json()

    const db = getTursoDatabase()

    if (batch) {
      // 배치 큐 추가: 재생성된 컨텐츠가 없는 데이터만 큐에 추가
      const places = await db.execute({
        sql: `
          SELECT id 
          FROM public_data_places 
          WHERE (regenerated_content IS NULL OR regenerated_content = '')
            AND regeneration_status != 'processing'
            AND id NOT IN (SELECT place_id FROM publish_queue WHERE status IN ('pending', 'processing'))
          ORDER BY created_at ASC
          LIMIT ?
        `,
        args: [limit],
      })

      let added = 0
      let skipped = 0

      for (const row of places.rows) {
        const id = row[0] as string

        try {
          // 이미 재생성된 컨텐츠가 있는지 다시 확인
          const checkResult = await db.execute({
            sql: 'SELECT regenerated_content FROM public_data_places WHERE id = ?',
            args: [id],
          })

          if (checkResult.rows.length > 0) {
            const regeneratedContent = checkResult.rows[0][0] as string | null
            if (regeneratedContent && regeneratedContent.trim() !== '') {
              skipped++
              continue
            }
          }

          // 큐에 추가
          const queueId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          await db.execute({
            sql: `
              INSERT INTO publish_queue (id, place_id, status, created_at)
              VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
            `,
            args: [queueId, id],
          })
          added++
        } catch (error) {
          // UNIQUE 제약 위반 시 이미 큐에 있음
          if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
            skipped++
          } else {
            logger.error(`[Queue] 추가 실패: ${id}`, error as Error)
            skipped++
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          added,
          skipped,
        },
        message: '큐에 항목이 추가되었습니다.',
      })
    } else {
      // 단일 항목 큐 추가
      if (!placeId) {
        throw new ValidationError('placeId가 필요합니다.')
      }

      // 재생성된 컨텐츠가 있는지 확인
      const placeResult = await db.execute({
        sql: 'SELECT regenerated_content FROM public_data_places WHERE id = ?',
        args: [placeId],
      })

      if (placeResult.rows.length === 0) {
        throw new NotFoundError('장소를 찾을 수 없습니다.')
      }

      const regeneratedContent = placeResult.rows[0][0] as string | null

      // 재생성된 컨텐츠가 있으면 큐에 추가하지 않음
      if (regeneratedContent && regeneratedContent.trim() !== '') {
        throw new ValidationError('이미 재생성된 컨텐츠가 있습니다. 재생성은 기존 페이지를 업데이트하는 개념입니다.')
      }

      // 이미 큐에 있는지 확인
      const existingQueue = await db.execute({
        sql: 'SELECT id FROM publish_queue WHERE place_id = ? AND status IN (?, ?)',
        args: [placeId, 'pending', 'processing'],
      })

      if (existingQueue.rows.length > 0) {
        throw new ValidationError('이미 큐에 추가되어 있습니다.')
      }

      // 큐에 추가
      const queueId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await db.execute({
        sql: `
          INSERT INTO publish_queue (id, place_id, status, created_at)
          VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)
        `,
        args: [queueId, placeId],
      })

      return NextResponse.json({
        success: true,
        data: {
          queueId,
          placeId,
        },
        message: '큐에 추가되었습니다.',
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 큐 상태 조회
 */
export async function GET(request: NextRequest) {
  try {
    const db = getTursoDatabase()

    const stats = await db.execute({
      sql: `
        SELECT 
          status,
          COUNT(*) as count
        FROM publish_queue
        GROUP BY status
      `,
      args: [],
    })

    const statusCounts: Record<string, number> = {}
    for (const row of stats.rows) {
      statusCounts[row[0] as string] = row[1] as number
    }

    // 재생성 완료된 데이터 개수
    const regeneratedCount = await db.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM public_data_places
        WHERE regenerated_content IS NOT NULL 
          AND regenerated_content != ''
      `,
      args: [],
    })
    const regenerated = (regeneratedCount.rows[0]?.[0] as number) || 0

    return NextResponse.json({
      success: true,
      data: {
        queue: statusCounts,
        regenerated,
      },
      message: '큐 상태를 조회했습니다.',
    })
  } catch (error) {
    return handleApiError(error)
  }
}

