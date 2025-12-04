'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Plane, Navigation, Home, MapPin, Calendar, ArrowLeft, Sun, Cloud, Backpack, Car, Utensils, Camera, CheckCircle } from 'lucide-react'

interface TravelPlanResult {
  distance: number
  duration: string
  weather: { temp: number; condition: string }
  itinerary: {
    day: number
    activities: { time: string; title: string; type: 'move' | 'eat' | 'play' | 'rest'; desc: string }[]
  }[]
  packingList: { category: string; items: string[] }[]
}

export default function PetTravelPlannerPage() {
  const [origin, setOrigin] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [duration, setDuration] = useState<number>(2)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<TravelPlanResult | null>(null)

  const generatePlan = useCallback(async () => {
    if (!origin || !destination) return

    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const samplePlan: TravelPlanResult = {
      distance: 150,
      duration: '2시간 30분',
      weather: { temp: 24, condition: 'sunny' },
      itinerary: Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        activities: [
          { time: '10:00', title: '출발/이동', type: 'move', desc: '휴게소 1회 정차 권장' },
          { time: '12:30', title: '점심 식사', type: 'eat', desc: '애견 동반 식당 예약' },
          { time: '14:00', title: '야외 활동', type: 'play', desc: '해변 산책 및 포토타임' },
          { time: '17:00', title: '숙소 체크인', type: 'rest', desc: '짐 풀기 및 휴식' },
          { time: '18:30', title: '저녁 식사', type: 'eat', desc: '바베큐 파티' }
        ]
      })),
      packingList: [
        { category: '필수품', items: ['사료/간식', '물그릇/밥그릇', '배변패드/봉투', '목줄/하네스'] },
        { category: '의약품', items: ['멀미약', '심장사상충약', '기본 구급상자'] },
        { category: '편의용품', items: ['애착 인형', '담요/방석', '물티슈', '수건'] }
      ]
    }
    setPlan(samplePlan)
    setLoading(false)
  }, [origin, destination, duration])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'move': return <Car className="w-4 h-4" />
      case 'eat': return <Utensils className="w-4 h-4" />
      case 'play': return <Camera className="w-4 h-4" />
      case 'rest': return <Home className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Plane className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">반려견 여행 플래너</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            완벽한 여행을 위한 맞춤형 일정과 체크리스트를 만들어드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-orange-500" />
                여행 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">출발지</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="예: 서울 강남구"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">목적지</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="예: 강원도 속초"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">여행 기간</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <span className="font-bold text-orange-600 w-12 text-right">{duration}박</span>
                  </div>
                </div>

                <button
                  onClick={generatePlan}
                  disabled={loading || !origin || !destination}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-bold flex items-center justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      일정 생성하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2 space-y-8">
            {plan ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Overview Card */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{destination} 여행</h2>
                      <p className="text-orange-100 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {origin} 출발 · {plan.distance}km
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        {plan.weather.condition === 'sunny' ? <Sun className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
                        <span className="text-2xl font-bold">{plan.weather.temp}°C</span>
                      </div>
                      <span className="text-sm text-orange-100">여행하기 좋은 날씨예요!</span>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-orange-500" />
                    추천 일정
                  </h3>
                  {plan.itinerary.map((day) => (
                    <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h4 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">
                        Day {day.day}
                      </h4>
                      <div className="space-y-6 relative before:absolute before:left-[4.5rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="flex gap-6 relative">
                            <div className="w-14 pt-1 text-right text-sm font-bold text-gray-500">
                              {activity.time}
                            </div>
                            <div className="absolute left-[4.5rem] top-2 w-3 h-3 rounded-full bg-white border-2 border-orange-500 -translate-x-[5px] z-10"></div>
                            <div className="flex-1 pt-0.5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`p-1.5 rounded-lg bg-orange-50 text-orange-600`}>
                                  {getActivityIcon(activity.type)}
                                </span>
                                <span className="font-bold text-gray-900">{activity.title}</span>
                              </div>
                              <p className="text-sm text-gray-600 pl-9">{activity.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Packing List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Backpack className="w-6 h-6 mr-2 text-orange-500" />
                    체크리스트
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {plan.packingList.map((category, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 mb-3">{category.category}</h4>
                        <ul className="space-y-2">
                          {category.items.map((item, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-200">
                  <MapPin className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">여행 계획을 시작해보세요</h3>
                <p className="text-gray-500 max-w-md">
                  출발지와 목적지를 입력하면 이동 경로, 맛집, 숙소, 관광지까지
                  반려견과 함께할 수 있는 완벽한 코스를 제안해드립니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
