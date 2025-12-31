'use client'

import { useState, useEffect, useRef } from 'react'
import { logger } from '@/lib/logger'

interface AdSlotProps {
  id: string
  width?: number
  height?: number
  className?: string
  lazy?: boolean
  lazyOffset?: number
}

export default function AdSlot({
  id,
  width = 728,
  height = 90,
  className = '',
  lazy = true,
  lazyOffset = 200
}: AdSlotProps) {
  const [isVisible, setIsVisible] = useState(!lazy)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer로 지연 로딩
  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: `${lazyOffset}px`
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, lazyOffset])

  // AdSense 스크립트 로딩
  useEffect(() => {
    if (!isVisible || isLoaded) return

    const loadAdSense = () => {
      try {
        // AdSense 스크립트가 이미 로드되었는지 확인
        if (typeof (window as any).adsbygoogle === 'undefined') {
          const script = document.createElement('script')
          script.async = true
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3050601904412736'
          script.crossOrigin = 'anonymous'
          document.head.appendChild(script)
        }

        // 광고 초기화
        setTimeout(() => {
          try {
            ; ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            setIsLoaded(true)
          } catch (error) {
            logger.warn('AdSense initialization failed', { error })
          }
        }, 100)
      } catch (error) {
        logger.warn('AdSense script loading failed', { error })
      }
    }

    loadAdSense()
  }, [isVisible, isLoaded])

  return (
    <div
      ref={containerRef}
      className={`ad-slot ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minHeight: `${height}px`, // CLS 방지를 위한 최소 높이
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        margin: '16px auto'
      }}
    >
      {isVisible ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3050601904412736"
          data-ad-slot={id}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex items-center justify-center text-gray-400 text-sm">
          광고 로딩 중...
        </div>
      )}
    </div>
  )
}

// 미리 정의된 광고 슬롯 크기들
export const AdSlotSizes = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  square: { width: 250, height: 250 },
  mobileBanner: { width: 320, height: 50 },
  leaderboard: { width: 728, height: 90 },
  skyscraper: { width: 160, height: 600 }
} as const
