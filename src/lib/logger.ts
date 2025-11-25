/**
 * 구조화된 로깅 시스템
 * 프로덕션 환경에서는 에러만 로깅하고, 개발 환경에서는 모든 로그 출력
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    // Edge Runtime 호환: process.env 사용 (빌드 시에는 사용 가능)
    // 런타임에서는 env 객체를 사용하지만, 로거는 빌드 시에도 작동해야 함
    this.isDevelopment = 
      typeof process !== 'undefined' && 
      process.env?.NODE_ENV === 'development'
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    // 프로덕션에서는 error와 warn만 로깅
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return
    }

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(context && { context }),
    }

    switch (level) {
      case 'debug':
        console.debug('[DEBUG]', logEntry)
        break
      case 'info':
        console.info('[INFO]', logEntry)
        break
      case 'warn':
        console.warn('[WARN]', logEntry)
        break
      case 'error':
        console.error('[ERROR]', logEntry)
        break
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        },
      }),
    }
    this.log('error', error instanceof Error ? error.message : String(error), errorContext)
  }
}

// 싱글톤 인스턴스
export const logger = new Logger()

// 편의 함수
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) =>
    logger.error(message, error, context),
}

