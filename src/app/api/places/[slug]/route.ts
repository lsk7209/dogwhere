/**
 * 장소 상세 조회 API
 * 캐싱 최적화
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { PlaceRepository } from '@/lib/database/d1-repository'
import { PlaceCacheKeys, cachedFetch } from '@/lib/cache/kv-cache'

const CACHE_TTL = 3600 // 1시간

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({
        success: false,
        error: {
          message: '슬러그가 필요합니다.',
          code: 'SLUG_REQUIRED'
        }
      }, { status: 400 })
    }

    // 캐시에서 조회
    const cacheKey = PlaceCacheKeys.bySlug(slug)

    const place = await cachedFetch(
      cacheKey,
      async () => {
        const repository = new PlaceRepository()
        return await repository.findBySlug(slug)
      },
      {
        ttl: CACHE_TTL,
        tags: ['places', 'place-detail']
      }
    )

    if (!place) {
      return NextResponse.json({
        success: false,
        error: {
          message: '해당 장소를 찾을 수 없습니다.',
          code: 'PLACE_NOT_FOUND'
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: place,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=300`,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Place Detail API Error:', error)

    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACE_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}

