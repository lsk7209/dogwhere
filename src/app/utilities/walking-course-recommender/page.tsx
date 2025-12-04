'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Map, Footprints, TreePine, Building2, Mountain, ArrowLeft, Navigation, Clock, Info } from 'lucide-react'

interface Course {
  id: string
  name: string
  type: 'park' | 'trail' | 'city'
  difficulty: 'easy' | 'medium' | 'hard'
  distance: number // km
  duration: number // min
  features: string[]
  desc: string
}

export default function WalkingCourseRecommenderPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'park' | 'trail' | 'city'>('all')
  const [maxDuration, setMaxDuration] = useState<number>(60)

  const courses: Course[] = [
    {
      id: '1',
      name: '한강공원 강아지 숲',
      type: 'park',
      difficulty: 'easy',
      distance: 2.5,
      duration: 40,
      features: ['잔디밭', '식수대', '배변봉투함'],
      desc: '평지 위주의 편안한 산책로로, 강아지들이 뛰어놀기 좋은 넓은 잔디밭이 있습니다.'
    },
    {
      id: '2',
      name: '남산 둘레길 코스',
      type: 'trail',
      difficulty: 'medium',
      distance: 4.0,
      duration: 70,
      features: ['숲길', '경치', '오르막'],
      desc: '자연의 냄새를 맡으며 걷는 숲길 코스입니다. 약간의 경사가 있어 운동량이 충분합니다.'
    },
    {
      id: '3',
      name: '도심 속 가로수길',
      type: 'city',
      difficulty: 'easy',
      distance: 1.5,
      duration: 30,
      features: ['카페', '포토존', '평지'],
      desc: '세련된 거리에서 산책과 함께 반려견 동반 카페를 즐길 수 있는 코스입니다.'
    },
    {
      id: '4',
      name: '북한산 자락길',
      type: 'trail',
      difficulty: 'hard',
      distance: 5.5,
      duration: 90,
      features: ['등산', '계곡', '흙길'],
      desc: '활동량이 많은 대형견에게 추천하는 등산 코스입니다. 시원한 계곡물도 만날 수 있어요.'
    }
  ]

  const filteredCourses = courses.filter(c =>
    (selectedType === 'all' || c.type === selectedType) &&
    c.duration <= maxDuration
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'park': return TreePine
      case 'trail': return Mountain
      case 'city': return Building2
      default: return Map
    }
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <Map className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">산책 코스 추천</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            매일 걷던 길 말고, 오늘은 새로운 곳으로 떠나볼까요?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Filter */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-green-500" />
                코스 찾기
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">선호하는 환경</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'all', label: '전체', icon: Map },
                      { id: 'park', label: '공원', icon: TreePine },
                      { id: 'trail', label: '숲길', icon: Mountain },
                      { id: 'city', label: '도심', icon: Building2 },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedType === type.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 hover:border-green-200 text-gray-600'
                          }`}
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="font-bold text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">최대 소요 시간</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="30"
                      max="120"
                      step="10"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    <div className="w-20 text-right font-bold text-gray-900">
                      {maxDuration}분
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-green-400" />
                산책 에티켓
              </h3>
              <ul className="space-y-3 text-green-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  배변봉투와 물은 필수 지참하세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  리드줄은 2m 이내로 유지해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">•</span>
                  다른 사람에게 달려들지 않게 주의하세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Footprints className="w-5 h-5 mr-2 text-green-500" />
                추천 코스 ({filteredCourses.length})
              </h2>

              <div className="space-y-4">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const TypeIcon = getTypeIcon(course.type)
                    return (
                      <div key={course.id} className="border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-md transition-all group bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                              <TypeIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${getDifficultyColor(course.difficulty)}`}>
                                  {course.difficulty === 'easy' ? '쉬움' : course.difficulty === 'medium' ? '보통' : '어려움'}
                                </span>
                                <span>• {course.distance}km</span>
                                <span>• 약 {course.duration}분</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {course.desc}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {course.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                              #{feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    조건에 맞는 코스가 없습니다. 필터를 조정해보세요.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
