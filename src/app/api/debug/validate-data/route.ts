export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'

/**
 * 데이터 검증 디버깅 API
 * 데이터 무결성 및 일관성 검사
 */
export async function GET(request: NextRequest) {
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
    const validations: any = {
      timestamp: new Date().toISOString(),
      checks: [],
    }

    // 1. 재생성된 컨텐츠가 있지만 사이트맵에 포함되지 않은 경우
    try {
      const invalidSitemap = await db.execute({
        sql: `
          SELECT COUNT(*) as count
          FROM public_data_places
          WHERE regenerated_content IS NOT NULL
            AND regenerated_content != ''
            AND regeneration_status = 'completed'
            AND sitemap_excluded = 1
        `,
        args: [],
      })
      const count = (invalidSitemap.rows[0]?.[0] as number) || 0
      validations.checks.push({
        name: '재생성 완료되었지만 사이트맵 제외된 항목',
        status: count === 0 ? 'pass' : 'warning',
        count,
        message: count > 0 ? `${count}개 항목이 사이트맵에 포함되지 않았습니다.` : '정상',
      })
    } catch (error) {
      validations.checks.push({
        name: '재생성 완료되었지만 사이트맵 제외된 항목',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // 2. 큐에 있지만 이미 재생성된 항목
    try {
      const invalidQueue = await db.execute({
        sql: `
          SELECT COUNT(*) as count
          FROM publish_queue pq
          JOIN public_data_places pd ON pq.place_id = pd.id
          WHERE pq.status IN ('pending', 'processing')
            AND pd.regenerated_content IS NOT NULL
            AND pd.regenerated_content != ''
        `,
        args: [],
      })
      const count = (invalidQueue.rows[0]?.[0] as number) || 0
      validations.checks.push({
        name: '큐에 있지만 이미 재생성된 항목',
        status: count === 0 ? 'pass' : 'warning',
        count,
        message: count > 0 ? `${count}개 항목이 중복으로 큐에 있습니다.` : '정상',
      })
    } catch (error) {
      validations.checks.push({
        name: '큐에 있지만 이미 재생성된 항목',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // 3. 슬러그 중복 확인
    try {
      const duplicateSlugs = await db.execute({
        sql: `
          SELECT slug, COUNT(*) as count
          FROM public_data_places
          WHERE slug IS NOT NULL
          GROUP BY slug
          HAVING COUNT(*) > 1
        `,
        args: [],
      })
      const count = duplicateSlugs.rows.length
      validations.checks.push({
        name: '슬러그 중복',
        status: count === 0 ? 'pass' : 'error',
        count,
        message: count > 0 ? `${count}개 중복된 슬러그가 있습니다.` : '정상',
        duplicates: count > 0 ? duplicateSlugs.rows.map(row => ({
          slug: row[0],
          count: row[1],
        })) : [],
      })
    } catch (error) {
      validations.checks.push({
        name: '슬러그 중복',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // 4. public_data_id + source_api 중복 확인
    try {
      const duplicateIds = await db.execute({
        sql: `
          SELECT public_data_id, source_api, COUNT(*) as count
          FROM public_data_places
          GROUP BY public_data_id, source_api
          HAVING COUNT(*) > 1
        `,
        args: [],
      })
      const count = duplicateIds.rows.length
      validations.checks.push({
        name: '공공데이터 ID 중복',
        status: count === 0 ? 'pass' : 'error',
        count,
        message: count > 0 ? `${count}개 중복된 공공데이터 ID가 있습니다.` : '정상',
      })
    } catch (error) {
      validations.checks.push({
        name: '공공데이터 ID 중복',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // 5. 재생성 상태 불일치
    try {
      const statusMismatch = await db.execute({
        sql: `
          SELECT COUNT(*) as count
          FROM public_data_places
          WHERE regeneration_status = 'completed'
            AND (regenerated_content IS NULL OR regenerated_content = '')
        `,
        args: [],
      })
      const count = (statusMismatch.rows[0]?.[0] as number) || 0
      validations.checks.push({
        name: '재생성 상태 불일치',
        status: count === 0 ? 'pass' : 'error',
        count,
        message: count > 0 ? `${count}개 항목의 재생성 상태가 불일치합니다.` : '정상',
      })
    } catch (error) {
      validations.checks.push({
        name: '재생성 상태 불일치',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // 전체 상태 요약
    const passCount = validations.checks.filter((c: { status: string }) => c.status === 'pass').length
    const warningCount = validations.checks.filter((c: { status: string }) => c.status === 'warning').length
    const errorCount = validations.checks.filter((c: { status: string }) => c.status === 'error').length

    validations.summary = {
      total: validations.checks.length,
      pass: passCount,
      warning: warningCount,
      error: errorCount,
      overall: errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'pass',
    }

    return NextResponse.json({
      success: true,
      data: validations,
      message: '데이터 검증이 완료되었습니다.',
    })
  } catch (error) {
    console.error('Validate Data API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '데이터 검증 중 오류가 발생했습니다.',
        code: 'VALIDATE_DATA_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

