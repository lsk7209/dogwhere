/**
 * 구조화된 로깅 시스템
 * 프로덕션 환경에서는 에러 및 경고만 로깅하고, 개발 환경에서는 모든 로그 출력
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    // 프로덕션에서는 info 이하 수준의 로그는 무시 (단, info는 명시적으로 남길 수 있음)
    if (!this.isDevelopment && level === 'debug') {
      return
    }

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context && Object.keys(context).length > 0 && { context }),
    }

    // Edge Runtime 및 Cloudflare 환경에서는 console 사용이 권장됨
    switch (level) {
      case 'debug':
        console.debug(`[DEBUG] ${message}`, logEntry.context || '')
        break
      case 'info':
        console.info(`[INFO] ${message}`, logEntry.context || '')
        break
      case 'warn':
        console.warn(`[WARN] ${message}`, logEntry.context || '')
        break
      case 'error':
        console.error(`[ERROR] ${message}`, logEntry.context || '')
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
    const errorDetail = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
    } : { message: String(error) }

    this.log('error', message, {
      ...context,
      error: errorDetail
    })
  }
}

/**
 * 싱글톤 로거 인스턴스
 */
export const logger = new Logger()

/**
 * 하위 호환성 및 편의를 위한 log 객체
 */
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) =>
    logger.error(message, error, context),
}

