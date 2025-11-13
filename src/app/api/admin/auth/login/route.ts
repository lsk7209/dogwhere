export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 실제 운영에서는 환경변수나 데이터베이스에서 관리
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123!'
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 인증 검증
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 실제 운영에서는 JWT 토큰을 사용
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      // 쿠키에 토큰 저장
      const cookieStore = await cookies()
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24시간
      })

      return NextResponse.json({
        success: true,
        token,
        message: '로그인 성공'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')

    if (!token) {
      return NextResponse.json({
        authenticated: false
      }, { status: 401 })
    }

    // 토큰 검증 (실제 운영에서는 JWT 검증)
    try {
      const decoded = Buffer.from(token.value, 'base64').toString('utf-8')
      const [username, timestamp] = decoded.split(':')
      
      // 토큰 만료 검증 (24시간)
      const tokenTime = parseInt(timestamp)
      const now = Date.now()
      const isExpired = (now - tokenTime) > (60 * 60 * 24 * 1000)

      if (isExpired) {
        return NextResponse.json({
          authenticated: false,
          message: '토큰이 만료되었습니다.'
        }, { status: 401 })
      }

      return NextResponse.json({
        authenticated: true,
        username
      })
    } catch {
      return NextResponse.json({
        authenticated: false,
        message: '유효하지 않은 토큰입니다.'
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')

    return NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
