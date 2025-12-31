/**
 * 공통 API 에러 클래스 및 핸들러
 * 모든 API 라우트에서 일관된 에러 처리를 위한 유틸리티
 */

import { NextResponse } from 'next/server'
import type { ApiErrorResponse } from '@/types/api'
import { logger } from './logger'

/**
 * 기본 API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 검증 에러 클래스
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details)
    this.name = 'ValidationError'
  }
}

/**
 * 인증 에러 클래스
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = '인증이 필요합니다.') {
    super(401, 'AUTHENTICATION_FAILED', message)
    this.name = 'AuthenticationError'
  }
}

/**
 * 권한 에러 클래스
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = '권한이 없습니다.') {
    super(403, 'AUTHORIZATION_FAILED', message)
    this.name = 'AuthorizationError'
  }
}

/**
 * 리소스를 찾을 수 없음 에러 클래스
 */
export class NotFoundError extends ApiError {
  constructor(message: string = '리소스를 찾을 수 없습니다.') {
    super(404, 'NOT_FOUND', message)
    this.name = 'NotFoundError'
  }
}

/**
 * 데이터베이스 에러 클래스
 */
export class DatabaseError extends ApiError {
  constructor(message: string = '데이터베이스 오류가 발생했습니다.', details?: unknown) {
    super(500, 'DATABASE_ERROR', message, details)
    this.name = 'DatabaseError'
  }
}

/**
 * API 에러 핸들러
 * 모든 에러를 일관된 형식으로 변환하여 응답
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // ApiError 인스턴스인 경우
  if (error instanceof ApiError) {
    logger.error('API Error', error, {
      statusCode: error.statusCode,
      code: error.code,
      details: error.details
    })

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.code as ApiErrorResponse['error']['code'],
        details: process.env.NODE_ENV === 'development' ? error.details : undefined
      }
    }

    return NextResponse.json(errorResponse, { status: error.statusCode })
  }

  // 일반 Error 인스턴스인 경우
  if (error instanceof Error) {
    logger.error('Unexpected Error', error)

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : '서버 오류가 발생했습니다.',
        code: 'INTERNAL_SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' 
          ? { stack: error.stack } 
          : undefined
      }
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }

  // 알 수 없는 에러
  logger.error('Unknown Error', new Error(String(error)))

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      message: '알 수 없는 오류가 발생했습니다.',
      code: 'INTERNAL_SERVER_ERROR'
    }
  }

  return NextResponse.json(errorResponse, { status: 500 })
}

/**
 * 에러를 ApiError로 변환하는 헬퍼 함수
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(500, 'INTERNAL_SERVER_ERROR', error.message)
  }

  return new ApiError(500, 'INTERNAL_SERVER_ERROR', '알 수 없는 오류가 발생했습니다.')
}

