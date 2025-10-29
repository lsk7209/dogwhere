'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plane, Navigation, Home, MapPin, Calendar } from 'lucide-react'

export default function PetTravelPlannerPage() {
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [duration, setDuration] = useState<number>(2)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<any>(null)

  const generatePlan = async () => {
    if (!origin || !destination) {
      alert('출발지와 목적지를 입력해주세요.')
      return
    }

    setLoading(true)
    // TODO: Naver Directions API 또는 Kakao Directions API 연동
    setTimeout(() => {
      setPlan({
        distance: 350,
        duration: '약 4시간',
        accommodations: [
          { name: '펫 호텔 그랜드', address: '목적지 인근', type: 'hotel' },
          { name: '반려견 펜션', address: '목적지 인근', type: 'pension' }
        ],
        experiences: [
          { name: '강아지 공원', description: '목적지 인근 반려견 공원' },
          { name: '반려견 카페', description: '동반 가능 카페' },
          { name: '산책로 코스', description: '전용 산책로' }
        ]
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Plane className="w-10 h-10 text-indigo-600 mr-3" />
            펫 여행 일정 플래너
          </h1>
          <p className="text-xl text-gray-600">
            출발지와 목적지를 입력하면 이동거리, 추천 숙소, 체험 루트를 자동 제안합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                출발지
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="예: 서울"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목적지
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="예: 제주"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                여행 기간 (일)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? '일정 생성 중...' : '여행 일정 만들기'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">여행 일정을 생성하는 중...</p>
            </div>
          )}

          {!loading && plan && (
            <div className="space-y-6">
              {/* 이동 정보 */}
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Navigation className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900">이동 정보</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">이동 거리</p>
                    <p className="text-2xl font-bold text-indigo-700">{plan.distance}km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">소요 시간</p>
                    <p className="text-2xl font-bold text-indigo-700">{plan.duration}</p>
                  </div>
                </div>
              </div>

              {/* 추천 숙소 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Home className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">추천 숙소</h3>
                </div>
                <div className="space-y-3">
                  {plan.accommodations.map((acc: any, idx: number) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{acc.name}</h4>
                      <p className="text-sm text-gray-600">{acc.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 체험 코스 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">체험 코스</h3>
                </div>
                <div className="space-y-3">
                  {plan.experiences.map((exp: any, idx: number) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{exp.name}</h4>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 안내사항</h2>
          <p className="text-gray-700">
            실제 운영 시 Naver Directions API 또는 Kakao Directions API와 한국관광공사 반려동물 여행 데이터를 결합하여 실시간 추천을 제공합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

