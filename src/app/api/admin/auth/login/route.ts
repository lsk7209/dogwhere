export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'
import { generateToken } from '@/lib/auth/jwt'
import { verifyPassword, hashPassword } from '@/lib/auth/password'

// 관리자 인증 정보 (환경변수에서 읽음)
// 실제 운영에서는 데이터베이스에 해시된 비밀번호를 저장해야 합니다
const ADMIN_USERNAME = env.ADMIN_USERNAME

// 비밀번호 해시 캐시 (실제 운영에서는 데이터베이스에서 조회)
let cachedPasswordHash: string | null = null

async function getAdminPasswordHash(): Promise<string> {
  if (cachedPasswordHash) {
    return cachedPasswordHash
  }
  
  // 환경변수에서 비밀번호를 읽어 해시 생성
  // 실제 운영에서는 데이터베이스에서 해시를 조회해야 합니다
  const password = env.ADMIN_PASSWORD
  cachedPasswordHash = await hashPassword(password)
  return cachedPasswordHash
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 입력 검증
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: '사용자명과 비밀번호를 입력해주세요.'
      }, { status: 400 })
    }

    // 사용자명 검증
    if (username !== ADMIN_USERNAME) {
      return NextResponse.json({
        success: false,
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 })
    }

    // 비밀번호 검증
    const hashedPassword = await getAdminPasswordHash()
    const isValidPassword = await verifyPassword(password, hashedPassword)

    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.'
      }, { status: 401 })
    }

    // JWT 토큰 생성
    const token = generateToken(username, '24h')
    
    // 쿠키에 토큰 저장
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24시간
    })

    return NextResponse.json({
      success: true,
      message: '로그인 성공'
    })
  } catch (error) {
    console.error('로그인 오류:', error)
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

    // JWT 토큰 검증
    const { verifyToken } = await import('@/lib/auth/jwt')
    const payload = verifyToken(token.value)

    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        message: '유효하지 않은 토큰입니다.'
      }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      username: payload.username
    })
  } catch (error) {
    console.error('인증 확인 오류:', error)
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
