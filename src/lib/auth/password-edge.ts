/**
 * Edge Runtime 호환 비밀번호 해싱 및 검증
 * Web Crypto API의 PBKDF2를 사용하여 Edge Runtime에서 작동
 */

const SALT_LENGTH = 16 // 128비트 솔트
const ITERATIONS = 100000 // PBKDF2 반복 횟수
const KEY_LENGTH = 32 // 256비트 키

/**
 * 비밀번호 해싱 (Edge Runtime 호환)
 * @param password 평문 비밀번호
 * @returns 해시된 비밀번호 (솔트 포함, 형식: salt:hash)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)

  // 랜덤 솔트 생성
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

  // PBKDF2로 해시 생성
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_LENGTH * 8 // 비트 단위
  )

  // 솔트와 해시를 Base64로 인코딩하여 저장
  const saltBase64 = arrayBufferToBase64(salt)
  const hashBase64 = arrayBufferToBase64(hash)

  return `${saltBase64}:${hashBase64}`
}

/**
 * 비밀번호 검증 (Edge Runtime 호환)
 * @param password 평문 비밀번호
 * @param hashedPassword 해시된 비밀번호 (솔트 포함)
 * @returns 일치 여부
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const [saltBase64, hashBase64] = hashedPassword.split(':')
    if (!saltBase64 || !hashBase64) {
      return false
    }

    const encoder = new TextEncoder()
    const passwordData = encoder.encode(password)
    const salt = base64ToArrayBuffer(saltBase64)
    const expectedHash = base64ToArrayBuffer(hashBase64)

    // 동일한 파라미터로 해시 생성
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )

    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      KEY_LENGTH * 8
    )

    // 해시 비교 (타이밍 공격 방지를 위해 상수 시간 비교)
    return constantTimeEqual(
      new Uint8Array(hash),
      new Uint8Array(expectedHash)
    )
  } catch (error) {
    return false
  }
}

/**
 * ArrayBuffer를 Base64 문자열로 변환
 */
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * Base64 문자열을 ArrayBuffer로 변환
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * 상수 시간 배열 비교 (타이밍 공격 방지)
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }

  return result === 0
}

