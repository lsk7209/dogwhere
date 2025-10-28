export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { DataCollectionScheduler } from '@/lib/data-collection'

// 데이터 수집 작업 API
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { region, source } = body

    // API 키 확인
    const googleApiKey = process.env.GOOGLE_PLACES_KEY
    const kakaoApiKey = process.env.KAKAO_API_KEY

    if (!googleApiKey || !kakaoApiKey) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'API 키가 설정되지 않았습니다.',
          code: 'API_KEY_MISSING'
        }
      }, { status: 500 })
    }

    const scheduler = new DataCollectionScheduler(googleApiKey, kakaoApiKey)

    let result
    if (region) {
      // 특정 지역 데이터 수집
      result = await scheduler.collectPlacesForRegion(region.sido, region.sigungu)
    } else {
      // 전체 지역 데이터 수집
      await scheduler.scheduleDataCollection()
      result = { message: '전체 지역 데이터 수집이 완료되었습니다.' }
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: '데이터 수집이 성공적으로 완료되었습니다.'
    }, { status: 200 })

  } catch (error) {
    console.error('Data Collection API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '데이터 수집 중 오류가 발생했습니다.',
        code: 'DATA_COLLECTION_ERROR'
      }
    }, { status: 500 })
  }
}

// 데이터 수집 상태 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region')

    // 실제로는 데이터베이스에서 수집 상태 조회
    const status = {
      lastCollection: '2024-10-28T10:00:00Z',
      totalPlaces: 1250,
      verifiedPlaces: 890,
      pendingReview: 45,
      regions: [
        { sido: '서울특별시', sigungu: '강남구', count: 156, lastUpdated: '2024-10-28T09:30:00Z' },
        { sido: '서울특별시', sigungu: '마포구', count: 134, lastUpdated: '2024-10-28T09:15:00Z' },
        { sido: '제주특별자치도', count: 89, lastUpdated: '2024-10-28T08:45:00Z' }
      ]
    }

    return NextResponse.json({
      success: true,
      data: status
    }, { status: 200 })

  } catch (error) {
    console.error('Data Collection Status API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '데이터 수집 상태 조회 중 오류가 발생했습니다.',
        code: 'STATUS_FETCH_ERROR'
      }
    }, { status: 500 })
  }
}
