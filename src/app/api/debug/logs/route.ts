export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { handleApiError, AuthenticationError } from '@/lib/api-error'

/**
 * 로그 조회 디버깅 API
 * Edge Runtime에서는 파일 시스템 접근이 제한되므로 빈 결과 반환
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const logPath = searchParams.get('path') || '.cursor/debug.log'

    // Edge Runtime에서는 파일 시스템 접근 불가
    // 로그는 HTTP 엔드포인트를 통해 수집되므로
    // 실제 로그 파일 읽기는 Node.js 환경에서만 가능
    
    // Edge Runtime: 로그 서버에서 조회하거나 빈 결과 반환
    return NextResponse.json({
      success: true,
      data: {
        logs: [],
        analysis: {
          totalLines: 0,
          byHypothesis: {},
          byLocation: {},
          errors: [],
          recent: [],
        },
        path: logPath,
        message: 'Edge Runtime에서는 로그 파일 직접 읽기가 제한됩니다. 로그 서버 엔드포인트를 사용하세요.',
      },
      message: 'Edge Runtime 제한으로 로그를 읽을 수 없습니다.',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
