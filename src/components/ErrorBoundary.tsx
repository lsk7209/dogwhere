'use client'

/**
 * React Error Boundary 컴포넌트
 * 클라이언트 사이드 에러를 캐치하여 사용자에게 친화적인 에러 메시지 표시
 */

import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack
    })

    // 커스텀 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 기본 에러 UI
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-800">
              오류가 발생했습니다
            </h2>
            <p className="mb-4 text-sm text-red-600">
              {this.state.error?.message || '예상치 못한 오류가 발생했습니다.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * 에러 메시지만 표시하는 간단한 컴포넌트
 */
export function ErrorMessage({ 
  error, 
  onRetry 
}: { 
  error: Error | string
  onRetry?: () => void 
}) {
  const message = error instanceof Error ? error.message : error

  return (
    <div className="flex min-h-[200px] items-center justify-center p-4">
      <div className="text-center">
        <p className="mb-4 text-red-600">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  )
}

