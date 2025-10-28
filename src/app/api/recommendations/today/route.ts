import { NextRequest, NextResponse } from 'next/server'

// 오늘의 추천 장소 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'kr'
    
    // 실제로는 데이터베이스에서 가져옴
    const recommendations = [
      {
        id: 'rec_1',
        place: {
          id: 'place_1',
          name: '카페 포우즈',
          address: '서울 마포구 홍대입구역 1번 출구',
          category: 'dog-cafe',
          rating: 4.6,
          reviewCount: 213,
          oDogScore: 95,
          safetyLevel: 'safe',
          features: ['대형견가능', '물그릇', '그늘', '주차'],
          imageUrl: null
        },
        copy: '강아지와 함께하는 특별한 시간을 제공하는 카페입니다. 넓은 실내 공간과 야외 테라스를 제공하며, 강아지 전용 메뉴도 있습니다.',
        reason: {
          rating: 4.6,
          safety: 'safe',
          features: ['대형견가능', '물그릇'],
          recency: 'recent'
        }
      },
      {
        id: 'rec_2',
        place: {
          id: 'place_2',
          name: '강아지 공원 러브',
          address: '서울 강남구 테헤란로 123',
          category: 'dog-park',
          rating: 4.4,
          reviewCount: 156,
          oDogScore: 88,
          safetyLevel: 'safe',
          features: ['대형견가능', '물그릇', '그늘', '놀이터'],
          imageUrl: null
        },
        copy: '강아지들이 자유롭게 뛰어놀 수 있는 넓은 공원입니다. 안전한 울타리와 다양한 놀이 시설을 제공합니다.',
        reason: {
          rating: 4.4,
          safety: 'safe',
          features: ['놀이터', '물그릇'],
          recency: 'recent'
        }
      },
      {
        id: 'rec_3',
        place: {
          id: 'place_3',
          name: '펫 호텔 스위트',
          address: '서울 송파구 올림픽로 456',
          category: 'dog-hotel',
          rating: 4.8,
          reviewCount: 89,
          oDogScore: 92,
          safetyLevel: 'safe',
          features: ['대형견가능', '목욕', '미용', '훈련'],
          imageUrl: null
        },
        copy: '강아지의 안전과 편안함을 최우선으로 하는 프리미엄 펫 호텔입니다. 전문적인 케어 서비스를 제공합니다.',
        reason: {
          rating: 4.8,
          safety: 'safe',
          features: ['목욕', '미용'],
          recency: 'recent'
        }
      }
    ]

    // 지역별 필터링 (실제로는 데이터베이스 쿼리)
    const filteredRecommendations = region === 'kr' 
      ? recommendations 
      : recommendations.filter(rec => rec.place.address.includes(region))

    return NextResponse.json({
      success: true,
      data: {
        region,
        date: new Date().toISOString().split('T')[0],
        recommendations: filteredRecommendations
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    })

  } catch (error) {
    console.error('Recommendations API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
