/**
 * Edge Runtime 호환 JWT 토큰 생성 및 검증
 * Web Crypto API를 사용하여 Edge Runtime에서 작동
 */

export interface JWTPayload {
  username: string
  iat?: number
  exp?: number
}

/**
 * JWT 토큰 생성 (Edge Runtime 호환)
 * @param username 사용자명
 * @param secret JWT 시크릿 키
 * @param expiresIn 만료 시간 (초 단위, 기본: 24시간)
 * @returns JWT 토큰 문자열
 */
export async function generateToken(
  username: string,
  secret: string,
  expiresIn: number = 86400 // 24시간
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const payload: JWTPayload = {
    username,
    iat: now,
    exp: now + expiresIn,
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  // Base64URL 인코딩
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // 서명 생성
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * JWT 토큰 검증 (Edge Runtime 호환)
 * @param token JWT 토큰 문자열
 * @param secret JWT 시크릿 키
 * @returns 검증된 페이로드 또는 null
 */
export async function verifyToken(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, signature] = parts

    // 서명 검증
    const expectedSignature = await sign(
      `${encodedHeader}.${encodedPayload}`,
      secret
    )

    if (signature !== expectedSignature) {
      return null
    }

    // 페이로드 디코딩
    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as JWTPayload

    // 만료 시간 확인
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

/**
 * HMAC-SHA256 서명 생성
 */
async function sign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(message)

  // Web Crypto API를 사용한 HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  return base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  )
}

/**
 * Base64URL 인코딩
 */
function base64UrlEncode(str: string): string {
  const base64 = btoa(str)
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64URL 디코딩
 */
function base64UrlDecode(str: string): string {
  // 패딩 추가
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return atob(base64)
}

/**
 * 토큰에서 사용자명 추출
 */
export async function getUsernameFromToken(
  token: string,
  secret: string
): Promise<string | null> {
  const payload = await verifyToken(token, secret)
  return payload?.username || null
}

