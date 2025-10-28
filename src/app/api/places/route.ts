export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { searchPlaces, getPlacesByRegion, getPlacesByCategory, getRecommendedPlaces } from '@/lib/database/places'
import { PlaceFilter } from '@/types/place'

// 장소 목록 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 쿼리 파라미터 파싱
    const sido = searchParams.get('sido')
    const sigungu = searchParams.get('sigungu')
    const category = searchParams.get('category') as any
    const subcategory = searchParams.get('subcategory')
    const petSize = searchParams.get('petSize') as any
    const priceRange = searchParams.get('priceRange') as any
    const amenities = searchParams.get('amenities')?.split(',') as any[]
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined
    const verified = searchParams.get('verified') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'rating'
    
    // 현재 위치 기반 검색
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const distance = searchParams.get('distance') ? parseInt(searchParams.get('distance')!) : undefined

    // 필터 구성
    const filter: PlaceFilter = {
      category: category ? [category] : undefined,
      subcategory: subcategory ? [subcategory] : undefined,
      sido: sido || undefined,
      sigungu: sigungu || undefined,
      petSize,
      priceRange,
      amenities,
      rating,
      verified,
      featured,
      coordinates: lat && lng ? { latitude: parseFloat(lat), longitude: parseFloat(lng) } : undefined,
      distance
    }

    // 빈 필터 제거
    Object.keys(filter).forEach(key => {
      if (filter[key as keyof PlaceFilter] === undefined) {
        delete filter[key as keyof PlaceFilter]
      }
    })

    let result

    // 특별한 케이스 처리
    if (sido && !category && !Object.keys(filter).length) {
      // 지역별 장소 조회
      const places = await getPlacesByRegion(sido, sigungu || undefined)
      result = {
        places,
        total: places.length,
        page: 1,
        limit: places.length,
        hasMore: false,
        filters: filter
      }
    } else if (category && !sido && !Object.keys(filter).length) {
      // 카테고리별 장소 조회
      const places = await getPlacesByCategory(category)
      result = {
        places,
        total: places.length,
        page: 1,
        limit: places.length,
        hasMore: false,
        filters: filter
      }
    } else if (!Object.keys(filter).length) {
      // 추천 장소 조회
      const places = await getRecommendedPlaces(limit)
      result = {
        places,
        total: places.length,
        page: 1,
        limit: places.length,
        hasMore: false,
        filters: filter
      }
    } else {
      // 일반 검색
      result = await searchPlaces(filter, page, limit)
    }

    // 응답 데이터 구성
    const response = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5분 캐시
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Places API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACES_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}

// 장소 추가 API (관리자용)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인 (실제로는 JWT 토큰 검증)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          message: '인증이 필요합니다.',
          code: 'AUTH_REQUIRED'
        }
      }, { status: 401 })
    }

    const placeData = await request.json()
    
    // 데이터 검증
    if (!placeData.name || !placeData.category || !placeData.location) {
      return NextResponse.json({
        success: false,
        error: {
          message: '필수 필드가 누락되었습니다.',
          code: 'VALIDATION_ERROR'
        }
      }, { status: 400 })
    }

    // 실제로는 데이터베이스에 저장
    // const result = await addPlace(placeData)
    
    return NextResponse.json({
      success: true,
      data: {
        id: 'place_' + Date.now(),
        ...placeData,
        createdAt: new Date().toISOString()
      },
      message: '장소가 성공적으로 추가되었습니다.'
    }, { status: 201 })

  } catch (error) {
    console.error('Place Creation Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 추가 중 오류가 발생했습니다.',
        code: 'PLACE_CREATE_ERROR'
      }
    }, { status: 500 })
  }
}