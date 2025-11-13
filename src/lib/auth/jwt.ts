/**
 * JWT 토큰 생성 및 검증 유틸리티
 * 
 * 관리자 인증을 위한 JWT 토큰을 생성하고 검증합니다.
 */

import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '@/lib/env'

export interface JWTPayload {
  username: string
  iat?: number
  exp?: number
}

/**
 * JWT 토큰 생성
 * @param username 사용자명
 * @param expiresIn 만료 시간 (기본: 24시간)
 * @returns JWT 토큰 문자열
 */
export function generateToken(username: string, expiresIn: string = '24h'): string {
  const payload: JWTPayload = {
    username,
  }

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expiresIn as string,
    issuer: 'dogwhere',
    audience: 'dogwhere-admin',
  } as SignOptions)
}

/**
 * JWT 토큰 검증
 * @param token JWT 토큰 문자열
 * @returns 검증된 페이로드 또는 null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'dogwhere',
      audience: 'dogwhere-admin',
    }) as JWTPayload

    return decoded
  } catch (error) {
    // 토큰 만료, 서명 오류 등
    return null
  }
}

/**
 * 토큰에서 사용자명 추출
 * @param token JWT 토큰 문자열
 * @returns 사용자명 또는 null
 */
export function getUsernameFromToken(token: string): string | null {
  const payload = verifyToken(token)
  return payload?.username || null
}

