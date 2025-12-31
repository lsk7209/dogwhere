export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

/**
 * API 엔드포인트 테스트 디버깅 API
 * 내부 API 엔드포인트를 테스트하고 결과를 반환
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

    const { endpoint, method = 'GET', body, headers = {} } = await request.json()

    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json({
        success: false,
        error: {
          message: 'endpoint가 필요합니다.',
          code: 'MISSING_ENDPOINT'
        }
      }, { status: 400 })
    }

    // 내부 엔드포인트만 허용
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    // 외부 URL 차단
    if (!url.includes('localhost') && !url.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
      return NextResponse.json({
        success: false,
        error: {
          message: '내부 엔드포인트만 테스트할 수 있습니다.',
          code: 'EXTERNAL_URL_NOT_ALLOWED'
        }
      }, { status: 400 })
    }

    const startTime = Date.now()

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${env.INTERNAL_TOKEN}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const executionTime = Date.now() - startTime
      const responseText = await response.text()
      let responseData: any

      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      return NextResponse.json({
        success: true,
        data: {
          endpoint: url,
          method,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseData,
          executionTime: `${executionTime}ms`,
        },
        message: '엔드포인트 테스트가 완료되었습니다.',
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: '엔드포인트 테스트 중 오류가 발생했습니다.',
          code: 'ENDPOINT_TEST_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Test Endpoint API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '엔드포인트 테스트 중 오류가 발생했습니다.',
        code: 'TEST_ENDPOINT_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

