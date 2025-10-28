import { NextRequest, NextResponse } from 'next/server'
import { getPlaceBySlug } from '@/lib/database/places'

// 장소 상세 API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 데이터베이스에서 장소 정보 조회
    const place = await getPlaceBySlug(slug)

    if (!place) {
      return NextResponse.json({
        success: false,
        error: {
          message: '해당 장소를 찾을 수 없습니다.',
          code: 'PLACE_NOT_FOUND'
        }
      }, { status: 404 })
    }

    // 관련 장소 추천 (같은 지역, 같은 카테고리)
    const relatedPlaces = await getPlaceBySlug(slug) // 실제로는 관련 장소 로직 구현

    const response = {
      success: true,
      data: {
        place,
        relatedPlaces: [], // TODO: 관련 장소 로직 구현
        reviews: [], // TODO: 리뷰 데이터 연동
        images: place.images,
        metadata: place.metadata
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=600, s-maxage=1200', // 10분 캐시
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Place Detail API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 상세 정보를 가져오는 중 오류가 발생했습니다.',
        code: 'PLACE_DETAIL_ERROR'
      }
    }, { status: 500 })
  }
}

// 장소 업데이트 API (관리자용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 인증 확인
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

    const updateData = await request.json()
    
    // 실제로는 데이터베이스 업데이트
    // const result = await updatePlace(slug, updateData)
    
    return NextResponse.json({
      success: true,
      data: {
        slug,
        ...updateData,
        updatedAt: new Date().toISOString()
      },
      message: '장소 정보가 성공적으로 업데이트되었습니다.'
    }, { status: 200 })

  } catch (error) {
    console.error('Place Update Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 정보 업데이트 중 오류가 발생했습니다.',
        code: 'PLACE_UPDATE_ERROR'
      }
    }, { status: 500 })
  }
}

// 장소 삭제 API (관리자용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 인증 확인
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

    // 실제로는 데이터베이스에서 삭제
    // const result = await deletePlace(slug)
    
    return NextResponse.json({
      success: true,
      message: '장소가 성공적으로 삭제되었습니다.'
    }, { status: 200 })

  } catch (error) {
    console.error('Place Delete Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 삭제 중 오류가 발생했습니다.',
        code: 'PLACE_DELETE_ERROR'
      }
    }, { status: 500 })
  }
}