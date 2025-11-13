export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getAllPlaces, getPlacesByRegion, getPlacesByCategory, getPlaceBySlug } from '@/lib/database/simple-places'

// 장소 목록 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 파싱
    const sido = searchParams.get('sido')
    const sigungu = searchParams.get('sigungu')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')

    let places

    if (slug) {
      // 특정 장소 조회
      const place = getPlaceBySlug(slug)
      if (!place) {
        return NextResponse.json({
          success: false,
          error: {
            message: '해당 장소를 찾을 수 없습니다.',
            code: 'PLACE_NOT_FOUND'
          }
        }, { status: 404 })
      }
      places = [place]
    } else if (sido && sigungu) {
      // 특정 지역 조회
      places = getPlacesByRegion(sido, sigungu)
    } else if (sido) {
      // 시/도 조회
      places = getPlacesByRegion(sido)
    } else if (category) {
      // 카테고리별 조회
      places = getPlacesByCategory(category)
    } else {
      // 전체 조회
      places = getAllPlaces()
    }

    return NextResponse.json({
      success: true,
      data: {
        places,
        total: places.length,
        filters: {
          sido: sido || undefined,
          sigungu: sigungu || undefined,
          category: category || undefined,
          slug: slug || undefined
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5분 캐시
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Simple Places API Error:', error)

    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACES_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}
