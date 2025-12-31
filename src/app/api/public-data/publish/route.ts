export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'

/**
 * 재생성된 컨텐츠 발행 API
 * 재생성 완료 후 자동 호출 또는 수동 호출
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          message: '인증이 필요합니다.',
          code: 'AUTH_REQUIRED'
        }
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== env.INTERNAL_TOKEN) {
      return NextResponse.json({
        success: false,
        error: {
          message: '유효하지 않은 토큰입니다.',
          code: 'INVALID_TOKEN'
        }
      }, { status: 401 })
    }

    const { placeId, batch = false } = await request.json()

    const db = getTursoDatabase()

    if (batch) {
      // 배치 발행: 재생성 완료된 항목들을 발행
      const places = await db.execute({
        sql: `
          SELECT id FROM public_data_places 
          WHERE regeneration_status = 'completed' 
            AND published = 0
          ORDER BY last_regenerated_at ASC
          LIMIT 50
        `,
        args: [],
      })

      let published = 0
      let failed = 0

      for (const row of places.rows) {
        const id = row[0] as string

        try {
          await db.execute({
            sql: `
              UPDATE public_data_places 
              SET published = 1,
                  sitemap_excluded = 0,
                  noindex = 0,
                  published_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            args: [id],
          })

          // 큐에서 제거
          await db.execute({
            sql: 'DELETE FROM publish_queue WHERE place_id = ?',
            args: [id],
          })

          published++
        } catch (error) {
          console.error(`[Publish] 실패: ${id}`, error)
          failed++
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          published,
          failed,
        },
        message: '배치 발행이 완료되었습니다.',
      })
    } else {
      // 단일 발행
      if (!placeId) {
        return NextResponse.json({
          success: false,
          error: {
            message: 'placeId가 필요합니다.',
            code: 'MISSING_PLACE_ID'
          }
        }, { status: 400 })
      }

      // 재생성 완료 확인
      const placeResult = await db.execute({
        sql: 'SELECT regeneration_status, regenerated_content FROM public_data_places WHERE id = ?',
        args: [placeId],
      })

      if (placeResult.rows.length === 0) {
        return NextResponse.json({
          success: false,
          error: {
            message: '장소를 찾을 수 없습니다.',
            code: 'PLACE_NOT_FOUND'
          }
        }, { status: 404 })
      }

      const status = placeResult.rows[0][0] as string
      const content = placeResult.rows[0][1] as string

      if (status !== 'completed' || !content) {
        return NextResponse.json({
          success: false,
          error: {
            message: '재생성이 완료되지 않았습니다.',
            code: 'REGENERATION_NOT_COMPLETED'
          }
        }, { status: 400 })
      }

      // 발행
      await db.execute({
        sql: `
          UPDATE public_data_places 
          SET published = 1,
              sitemap_excluded = 0,
              noindex = 0,
              published_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [placeId],
      })

      // 큐에서 제거
      await db.execute({
        sql: 'DELETE FROM publish_queue WHERE place_id = ?',
        args: [placeId],
      })

      return NextResponse.json({
        success: true,
        data: {
          placeId,
          published: true,
        },
        message: '발행이 완료되었습니다.',
      })
    }
  } catch (error) {
    console.error('Publish API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '발행 중 오류가 발생했습니다.',
        code: 'PUBLISH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

