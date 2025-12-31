/**
 * 장소 상세 조회 API (Turso 기반)
 */

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { PlaceRepository, PlaceRow } from '@/lib/database/turso-repository'
import { PlaceCacheKeys, cachedFetch } from '@/lib/cache/kv-cache'
import { logger } from '@/lib/logger'
import type { SimplePlace } from '@/types/simple-place'

const CACHE_TTL = 3600 // 1시간

// PlaceRow를 SimplePlace로 변환하는 헬퍼 함수
function mapToSimplePlace(row: PlaceRow): SimplePlace {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    description: row.description || '',
    address: row.address,
    sido: row.sido,
    sigungu: row.sigungu,
    latitude: row.latitude,
    longitude: row.longitude,
    phone: row.phone || undefined,
    website: row.website || undefined,
    rating: row.overall_rating,
    reviewCount: row.review_count,
    imageUrl: (row.main_image as string) || null,
    source: (row.source as string) || 'unknown',
    sourceId: row.id,
    isVerified: !!row.verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  let slug: string | undefined

  try {
    const resolvedParams = await params
    slug = resolvedParams.slug

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
        if (!slug) return null

        try {
          const repository = new PlaceRepository()
          const row = await repository.findBySlug(slug)
          if (!row) return null
          return mapToSimplePlace(row)
        } catch (error) {
          logger.error('Turso access failed', error as Error, { slug })
          return null
        }
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
        version: '2.0 (Turso)'
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=300`,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    logger.error('Place Detail API Error', error as Error, { slug: slug || 'unknown' })

    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACE_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}
