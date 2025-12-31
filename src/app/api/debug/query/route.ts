export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'

/**
 * 데이터베이스 쿼리 디버깅 API
 * 안전한 읽기 전용 쿼리만 실행
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

    const { query, params = [] } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: {
          message: '쿼리가 필요합니다.',
          code: 'MISSING_QUERY'
        }
      }, { status: 400 })
    }

    // 안전성 검사: SELECT만 허용
    const trimmedQuery = query.trim().toUpperCase()
    if (!trimmedQuery.startsWith('SELECT')) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'SELECT 쿼리만 허용됩니다.',
          code: 'INVALID_QUERY_TYPE'
        }
      }, { status: 400 })
    }

    // 위험한 키워드 차단
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE']
    for (const keyword of dangerousKeywords) {
      if (trimmedQuery.includes(keyword)) {
        return NextResponse.json({
          success: false,
          error: {
            message: `위험한 키워드가 포함되어 있습니다: ${keyword}`,
            code: 'DANGEROUS_QUERY'
          }
        }, { status: 400 })
      }
    }

    const db = getTursoDatabase()
    const startTime = Date.now()

    try {
      const result = await db.execute({
        sql: query,
        args: params,
      })

      const executionTime = Date.now() - startTime

      // 결과 포맷팅
      const rows = result.rows.map(row => {
        const obj: any = {}
        for (let i = 0; i < result.columns.length; i++) {
          obj[result.columns[i]] = row[i]
        }
        return obj
      })

      return NextResponse.json({
        success: true,
        data: {
          rows,
          columns: result.columns,
          rowCount: rows.length,
          executionTime: `${executionTime}ms`,
        },
        message: '쿼리가 성공적으로 실행되었습니다.',
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: '쿼리 실행 중 오류가 발생했습니다.',
          code: 'QUERY_EXECUTION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Query Debug API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '쿼리 디버깅 중 오류가 발생했습니다.',
        code: 'QUERY_DEBUG_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

