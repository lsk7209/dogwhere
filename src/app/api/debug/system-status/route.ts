export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase, isTursoAvailable } from '@/lib/database/turso-client'
import { getDatabaseType } from '@/lib/database/db-adapter'

/**
 * 시스템 상태 디버깅 API
 * 다양한 시스템 상태를 종합적으로 확인
 */
export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (선택적 - 개발 환경에서는 생략 가능)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // 프로덕션에서는 인증 필수
    if (process.env.NODE_ENV === 'production') {
      if (!token || token !== env.INTERNAL_TOKEN) {
        return NextResponse.json({
          success: false,
          error: {
            message: '인증이 필요합니다.',
            code: 'AUTH_REQUIRED'
          }
        }, { status: 401 })
      }
    }

    const status: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {},
      publicData: {},
      queue: {},
      api: {},
      system: {},
    }

    // 데이터베이스 상태
    try {
      const dbType = getDatabaseType()
      status.database = {
        type: dbType,
        available: dbType !== 'none',
        tursoAvailable: isTursoAvailable(),
      }

      if (dbType !== 'none') {
        const db = getTursoDatabase()
        
        // 연결 테스트
        await db.execute({ sql: 'SELECT 1', args: [] })
        status.database.connected = true

        // 테이블 목록
        const tablesResult = await db.execute({
          sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
          args: [],
        })
        status.database.tables = tablesResult.rows.map(row => row[0] as string)

        // 공공데이터 통계
        try {
          const publicDataStats = await db.execute({
            sql: `
              SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN regenerated_content IS NOT NULL AND regenerated_content != '' THEN 1 ELSE 0 END) as regenerated,
                SUM(CASE WHEN sitemap_excluded = 0 THEN 1 ELSE 0 END) as in_sitemap,
                SUM(CASE WHEN noindex = 0 THEN 1 ELSE 0 END) as indexed
              FROM public_data_places
            `,
            args: [],
          })
          if (publicDataStats.rows.length > 0) {
            const row = publicDataStats.rows[0]
            status.publicData = {
              total: row[0] as number,
              regenerated: row[1] as number,
              inSitemap: row[2] as number,
              indexed: row[3] as number,
            }
          }
        } catch (error) {
          status.publicData.error = error instanceof Error ? error.message : 'Unknown error'
        }

        // 큐 상태
        try {
          const queueStats = await db.execute({
            sql: `
              SELECT 
                status,
                COUNT(*) as count
              FROM publish_queue
              GROUP BY status
            `,
            args: [],
          })
          const queueStatus: Record<string, number> = {}
          for (const row of queueStats.rows) {
            queueStatus[row[0] as string] = row[1] as number
          }
          status.queue = queueStatus
        } catch (error) {
          status.queue.error = error instanceof Error ? error.message : 'Unknown error'
        }
      }
    } catch (error) {
      status.database.error = error instanceof Error ? error.message : 'Unknown error'
      status.database.connected = false
    }

    // API 키 상태
    status.api = {
      googlePlaces: !!env.GOOGLE_PLACES_KEY,
      kakao: !!env.KAKAO_API_KEY,
      gemini: !!env.GEMINI_API_KEY,
      openai: !!env.OPENAI_API_KEY,
      publicData: !!env.PUBLIC_DATA_API_KEY,
    }

    // 시스템 정보 (Edge Runtime에서는 제한적)
    status.system = {
      runtime: 'edge',
      environment: process.env.NODE_ENV || 'development',
      // Edge Runtime에서는 process.version, process.platform, process.memoryUsage() 사용 불가
      note: 'Edge Runtime에서는 시스템 정보가 제한적입니다.',
    }

    return NextResponse.json({
      success: true,
      data: status,
      message: '시스템 상태를 조회했습니다.',
    })
  } catch (error) {
    const { handleApiError } = await import('@/lib/api-error')
    return handleApiError(error)
  }
}

