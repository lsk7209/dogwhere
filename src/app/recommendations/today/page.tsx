import { logger } from '@/lib/logger'
import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Star, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: '오늘의 추천 장소 | 어서오개',
  description: '오늘 강아지와 함께 가기 좋은 추천 장소들을 확인해보세요.',
  keywords: '오늘의 추천, 강아지 동반, 반려견, 추천 장소',
  openGraph: {
    title: '오늘의 추천 장소 | 어서오개',
    description: '오늘 강아지와 함께 가기 좋은 추천 장소들을 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

async function getTodayRecommendations() {
  try {
    // 직접 데이터베이스에서 가져오기 (static export 호환)
    const { getVerifiedPlaces, getAllPlaces } = await import('@/lib/database/simple-places')

    const places = getVerifiedPlaces() || getAllPlaces()

    // 오늘의 추천 알고리즘: 평점, 리뷰 수, 최신 업데이트 기반
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
    return scoredPlaces.map((place, index) => {
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
          imageUrl: place.imageUrl ?? null,
          features: place.features ?? [],
        },
        copy: copyTemplates[copyIndex],
        reason: {
          rating: place.rating,
          reviewCount: place.reviewCount,
          verified: place.isVerified,
          reasons: [
            place.rating && place.rating >= 4.5 ? 'high_rating' : '',
            place.reviewCount && place.reviewCount >= 100 ? 'popular' : '',
            place.isVerified ? 'verified' : ''
          ].filter(Boolean),
          score: place.recommendationScore
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching recommendations', error)
    return []
  }
}

export default async function TodayRecommendationsPage() {
  const recommendations = await getTodayRecommendations()
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            오늘의 추천 장소 🌟
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {today} 강아지와 함께 가기 좋은 특별한 장소들을 소개합니다
          </p>
          <p className="text-sm text-gray-500">
            매일 자동으로 업데이트되는 최신 추천 장소
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              오늘의 추천 장소를 준비 중입니다.
            </p>
            <p className="text-gray-400 text-sm">
              곧 업데이트될 예정입니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((rec: any, index: number) => {
              const place = rec.place || rec
              const oDogScore = place.oDogScore || Math.floor(85 + Math.random() * 15)

              return (
                <Link
                  key={rec.id || place.id || index}
                  href={`/place/${place.slug || place.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {place.imageUrl ? (
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <span className="text-6xl">🐕</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">
                        {place.name}
                      </h3>
                    </div>

                    {place.address && (
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{place.address}</span>
                      </div>
                    )}

                    {rec.copy && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {rec.copy}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⭐ 오늘 추천
                        </span>
                        {place.rating && (
                          <span className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {place.rating.toFixed(1)}
                          </span>
                        )}
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          O-Dog {oDogScore}
                        </span>
                      </div>
                      <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        자세히 보기 →
                      </span>
                    </div>

                    {place.features && place.features.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {place.features.slice(0, 3).map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
