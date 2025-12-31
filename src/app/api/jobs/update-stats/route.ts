export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'

/**
 * 통계 업데이트 API
 * GitHub Actions 크론 작업에서 호출
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

    const db = getTursoDatabase()

    // 장소 개수 조회
    const placesCountResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM places',
      args: [],
    })
    const placesTotal = (placesCountResult.rows[0]?.total as number) || 0

    // 이벤트 개수 조회
    const eventsCountResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM events',
      args: [],
    })
    const eventsTotal = (eventsCountResult.rows[0]?.total as number) || 0

    // 포스트 개수 조회
    const postsCountResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM posts',
      args: [],
    })
    const postsTotal = (postsCountResult.rows[0]?.total as number) || 0

    // 검증된 장소 개수
    const verifiedPlacesResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM places WHERE verified = 1',
      args: [],
    })
    const verifiedPlacesTotal = (verifiedPlacesResult.rows[0]?.total as number) || 0

    // 지역별 통계
    const regionStatsResult = await db.execute({
      sql: `
        SELECT sido, COUNT(*) as count 
        FROM places 
        GROUP BY sido 
        ORDER BY count DESC 
        LIMIT 10
      `,
      args: [],
    })

    const regionStats = regionStatsResult.rows.map(row => ({
      sido: row[0] as string,
      count: row[1] as number,
    }))

    return NextResponse.json({
      success: true,
      data: {
        statistics: {
          places: {
            total: placesTotal,
            verified: verifiedPlacesTotal,
            unverified: placesTotal - verifiedPlacesTotal,
          },
          events: {
            total: eventsTotal,
          },
          posts: {
            total: postsTotal,
          },
          regions: regionStats,
        },
        updatedAt: new Date().toISOString(),
      },
      message: '통계가 성공적으로 업데이트되었습니다.',
    })
  } catch (error) {
    console.error('Update Stats API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '통계 업데이트 중 오류가 발생했습니다.',
        code: 'UPDATE_STATS_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

