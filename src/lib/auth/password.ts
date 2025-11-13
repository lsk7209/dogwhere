/**
 * 비밀번호 해싱 및 검증 유틸리티
 * 
 * bcrypt를 사용하여 비밀번호를 안전하게 해싱하고 검증합니다.
 */

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * 비밀번호 해싱
 * @param password 평문 비밀번호
 * @returns 해시된 비밀번호
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 비밀번호 검증
 * @param password 평문 비밀번호
 * @param hashedPassword 해시된 비밀번호
 * @returns 일치 여부
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 환경변수에서 관리자 비밀번호 해시 생성 (초기 설정용)
 * 
 * 이 함수는 초기 설정 시에만 사용하며,
 * 실제 운영에서는 데이터베이스에 해시된 비밀번호를 저장해야 합니다.
 */
export async function getAdminPasswordHash(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    throw new Error('ADMIN_PASSWORD 환경변수가 설정되지 않았습니다')
  }
  
  // 환경변수에서 직접 해시 생성 (임시)
  // 실제 운영에서는 데이터베이스에 저장된 해시를 사용해야 합니다
  return hashPassword(password)
}

