export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { collectFromGoogle, collectFromKakao, ingestPlaces } from '@/lib/data-collection/simple-collector'
import { getAllPlaces, getStats } from '@/lib/database/simple-places'

let isCollecting: boolean = false
let lastCollectionTime: string | null = null

// 실제 데이터 수집 실행 API
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

    if (isCollecting) {
      return NextResponse.json({
        success: false,
        error: {
          message: '이미 데이터 수집이 진행 중입니다.',
          code: 'COLLECTION_IN_PROGRESS'
        }
      }, { status: 409 })
    }

    isCollecting = true
    const { region, sources = ['google', 'kakao'], keywords = [] } = await request.json()

    console.log(`Starting simple data collection for region: ${JSON.stringify(region)}`)
    console.log(`Using sources: ${sources.join(', ')}`)

    let allCollectedPlaces: any[] = []

    // 강아지 동반 장소 검색 키워드
    const defaultKeywords = [
      '강아지 동반 카페',
      '펫프렌들리 카페', 
      '강아지 동반 식당',
      '펫프렌들리 레스토랑',
      '강아지 동반 숙박',
      '펫프렌들리 호텔',
      '강아지 놀이터',
      '펫파크',
      '강아지 동반 카페',
      '펫카페',
      '강아지 동반 맛집',
      '펫프렌들리 맛집'
    ]

    const searchKeywords = keywords.length > 0 ? keywords : defaultKeywords
    const baseRegion = region?.sido && region?.sigungu 
      ? `${region.sido} ${region.sigungu}` 
      : region?.sido || '서울'

    // 각 키워드로 검색
    for (const keyword of searchKeywords) {
      const query = `${baseRegion} ${keyword}`
      console.log(`Searching for: ${query}`)

      // Google Places API에서 데이터 수집
      if (sources.includes('google')) {
        console.log(`Collecting from Google Places API for: ${query}`)
        const googlePlaces = await collectFromGoogle(query, region?.coordinates)
        allCollectedPlaces = [...allCollectedPlaces, ...googlePlaces]
        console.log(`Collected ${googlePlaces.length} places from Google Places for "${keyword}"`)
      }

      // 카카오맵 API에서 데이터 수집
      if (sources.includes('kakao')) {
        console.log(`Collecting from Kakao Map API for: ${query}`)
        const kakaoPlaces = await collectFromKakao(query, region?.coordinates)
        allCollectedPlaces = [...allCollectedPlaces, ...kakaoPlaces]
        console.log(`Collected ${kakaoPlaces.length} places from Kakao Map for "${keyword}"`)
      }

      // API 호출 제한을 위한 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 데이터 통합 및 저장
    console.log(`Total collected places: ${allCollectedPlaces.length}`)
    const result = await ingestPlaces(allCollectedPlaces)
    
    lastCollectionTime = new Date().toISOString()
    isCollecting = false

    return NextResponse.json({
      success: true,
      data: {
        status: 'Collection completed',
        result,
        summary: {
          totalCollected: allCollectedPlaces.length,
          added: result.added,
          updated: result.updated,
          skipped: result.skipped,
          sources: sources,
          region: region || '전체 지역'
        }
      },
      message: '간단한 데이터 수집이 성공적으로 완료되었습니다.'
    })

  } catch (error) {
    console.error('Simple Data Collection API error:', error)
    isCollecting = false
    
    return NextResponse.json({
      success: false,
      error: {
        message: '간단한 데이터 수집 중 오류가 발생했습니다.',
        code: 'SIMPLE_DATA_COLLECTION_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

// 데이터 수집 상태 조회 API
export async function GET(request: NextRequest) {
  try {
    const stats = getStats()
    const allPlaces = getAllPlaces()

    // API 키 상태 확인
    const apiKeysStatus = {
      google: !!process.env.GOOGLE_PLACES_KEY,
      kakao: !!process.env.KAKAO_API_KEY,
      openai: !!process.env.OPENAI_API_KEY
    }

    return NextResponse.json({
      success: true,
      data: {
        isCollecting,
        lastCollection: lastCollectionTime,
        stats,
        apiKeysStatus,
        sources: {
          google: allPlaces.filter(p => p.source === 'Google Places').length,
          kakao: allPlaces.filter(p => p.source === 'Kakao Map').length,
          mock: allPlaces.filter(p => p.source.includes('Mock')).length,
          sample: allPlaces.filter(p => p.source === 'sample').length
        }
      },
      message: '간단한 데이터 수집 현황을 성공적으로 가져왔습니다.'
    })
  } catch (error) {
    console.error('Failed to get collection status:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '데이터 수집 현황을 가져오는 중 오류가 발생했습니다.',
        code: 'COLLECTION_STATUS_ERROR'
      }
    }, { status: 500 })
  }
}
