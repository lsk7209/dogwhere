export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getAllPlaces, getVerifiedPlaces, getPlacesByRegion } from '@/lib/database/simple-places'
import type { SimplePlace } from '@/types/simple-place'
import { handleApiError } from '@/lib/api-error'

// 오늘의 추천 장소 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'kr'
    const sido = searchParams.get('sido') || undefined
    
    // 실제 장소 데이터 가져오기
    let places
    if (sido) {
      places = getPlacesByRegion(sido)
    } else {
      places = getVerifiedPlaces() || getAllPlaces()
    }
    
    // 오늘의 추천 알고리즘: 평점, 리뷰 수, 최신 업데이트 기반
    const today = new Date().toISOString().split('T')[0]
    const dayOfWeek = new Date().getDay() // 0(일요일) ~ 6(토요일)
    
    // 추천 점수 계산 및 정렬
    const scoredPlaces = places
      .map(place => {
        // 기본 점수: 평점 * 20
        let score = (place.rating || 0) * 20
        
        // 리뷰 수 보너스 (최대 20점)
        const reviewBonus = Math.min(place.reviewCount || 0, 500) / 500 * 20
        score += reviewBonus
        
        // 최신성 보너스 (최근 업데이트된 것에 가산점)
        const updatedAt = new Date(place.updatedAt || place.createdAt)
        const daysSinceUpdate = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
        const recencyBonus = Math.max(0, (30 - daysSinceUpdate) / 30 * 15)
        score += recencyBonus
        
        // 검증된 장소 보너스
        if (place.isVerified) {
          score += 10
        }
        
        // 요일 기반 다양성 (같은 카테고리만 나오지 않도록)
        const categoryHash = place.category?.charCodeAt(0) || 0
        const dayDiversity = (categoryHash + dayOfWeek) % 10 * 2
        score += dayDiversity
        
        return {
          ...place,
          recommendationScore: score,
          oDogScore: Math.min(100, Math.max(80, Math.floor(score)))
        }
      })
      .filter(place => place.recommendationScore > 50) // 최소 점수 필터
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 12) // 상위 12개
    
    // 추천 사유 생성
    const recommendations = scoredPlaces.map((place, index) => {
      const reasons = []
      if (place.rating && place.rating >= 4.5) {
        reasons.push('high_rating')
      }
      if (place.reviewCount && place.reviewCount >= 100) {
        reasons.push('popular')
      }
      if (place.isVerified) {
        reasons.push('verified')
      }
      
      // 추천 카피 문구 생성
      const copyTemplates = [
        `강아지와 함께하는 특별한 시간을 제공하는 ${place.category === 'cafe' ? '카페' : '장소'}입니다.`,
        `${place.name}은(는) 반려견 동반 방문객들에게 인기 있는 곳입니다.`,
        `넓은 공간과 편리한 시설을 갖춘 ${place.name}에서 즐거운 시간을 보내보세요.`,
        `최근 많은 강아지 집사들이 찾는 ${place.name}입니다.`,
      ]
      
      const copyIndex = index % copyTemplates.length
      
      return {
        id: `rec_${place.id}`,
        place: {
          ...place,
          imageUrl: place.imageUrl || null,
          features: place.features || []
        },
        copy: copyTemplates[copyIndex],
        reason: {
          rating: place.rating,
          reviewCount: place.reviewCount,
          verified: place.isVerified,
          reasons: reasons,
          score: place.recommendationScore
        }
      }
    })
    
    // 데이터가 없으면 mock 데이터 사용 (fallback)
    let finalRecommendations = recommendations
    if (recommendations.length === 0) {
      const mockPlaces: SimplePlace[] = [
        {
          id: 'place_1',
          name: '카페 포우즈',
          slug: 'cafe-paws-seoul',
          category: 'cafe',
          description: '강아지와 함께하는 특별한 카페입니다.',
          address: '서울 마포구 홍대입구역 1번 출구',
          sido: '서울특별시',
          sigungu: '마포구',
          latitude: 37.55,
          longitude: 126.91,
          rating: 4.6,
          reviewCount: 213,
          imageUrl: null,
          features: ['대형견가능', '물그릇', '그늘', '주차'],
          source: 'sample',
          sourceId: 'sample_1',
          isVerified: true,
          createdAt: '2025-10-01T00:00:00Z',
          updatedAt: '2025-10-28T07:00:00Z'
        },
        {
          id: 'place_2',
          name: '강아지 공원 러브',
          slug: 'dog-park-love-gangnam',
          category: 'outdoor',
          description: '강아지들이 자유롭게 뛰어놀 수 있는 넓은 공원입니다.',
          address: '서울 강남구 테헤란로 123',
          sido: '서울특별시',
          sigungu: '강남구',
          latitude: 37.50,
          longitude: 127.04,
          rating: 4.4,
          reviewCount: 156,
          imageUrl: null,
          features: ['대형견가능', '물그릇', '그늘', '놀이터'],
          source: 'sample',
          sourceId: 'sample_2',
          isVerified: true,
          createdAt: '2025-09-15T00:00:00Z',
          updatedAt: '2025-10-27T10:00:00Z'
        },
        {
          id: 'place_3',
          name: '펫 호텔 스위트',
          slug: 'pet-hotel-suite',
          category: 'hotel',
          description: '프리미엄 펫 호텔 서비스',
          address: '서울 송파구 올림픽로 456',
          sido: '서울특별시',
          sigungu: '송파구',
          latitude: 37.52,
          longitude: 127.12,
          rating: 4.8,
          reviewCount: 89,
          imageUrl: null,
          features: ['대형견가능', '목욕', '미용', '훈련'],
          source: 'sample',
          sourceId: 'sample_3',
          isVerified: true,
          createdAt: '2025-09-20T00:00:00Z',
          updatedAt: '2025-10-25T08:00:00Z'
        }
      ]

      finalRecommendations = mockPlaces.map((place, index) => {
        const copyTemplates = [
          '강아지와 함께하는 특별한 시간을 제공하는 카페입니다.',
          '강아지들이 자유롭게 뛰어놀 수 있는 넓은 공원입니다.',
          '강아지의 안전과 편안함을 최우선으로 하는 프리미엄 펫 호텔입니다.'
        ]
        
        return {
          id: `rec_${place.id}`,
          place: {
            ...place,
            imageUrl: place.imageUrl ?? null,
            features: place.features ?? [],
            recommendationScore: (place.rating || 0) * 20 + (place.reviewCount || 0) / 10,
            oDogScore: Math.min(100, Math.max(80, Math.floor((place.rating || 0) * 20 + (place.reviewCount || 0) / 10)))
          },
          copy: copyTemplates[index] || place.description,
          reason: {
            rating: place.rating,
            reviewCount: place.reviewCount,
            verified: place.isVerified,
            reasons: ['high_rating', 'popular'],
            score: (place.rating || 0) * 20
          }
        }
      })
    }
    
    // 지역별 필터링
    const filteredRecommendations = region === 'kr' || !region
      ? finalRecommendations 
      : finalRecommendations.filter(rec => rec.place.address?.includes(region))

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
    return handleApiError(error)
  }
}
