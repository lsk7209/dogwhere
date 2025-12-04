'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Luggage, Map, Backpack, Utensils, FirstAidKit, Tent, Sun, Snowflake, ArrowLeft, CheckCircle, Circle, Palmtree, Building2 } from 'lucide-react'

interface PackingItem {
  id: string
  name: string
  category: 'essential' | 'food' | 'comfort' | 'health' | 'activity'
  checked: boolean
}

export default function TravelPackingListPage() {
  const [tripType, setTripType] = useState<'hotel' | 'camping' | 'beach'>('hotel')
  const [duration, setDuration] = useState(2)
  const [items, setItems] = useState<PackingItem[]>([])

  useEffect(() => {
    generateList()
  }, [tripType, duration])

  const generateList = () => {
    const baseItems: PackingItem[] = [
      { id: 'food', name: `사료 (${duration * 2}끼 + 여유분)`, category: 'food', checked: false },
      { id: 'water', name: '물병 & 휴대용 물그릇', category: 'food', checked: false },
      { id: 'treats', name: '좋아하는 간식', category: 'food', checked: false },
      { id: 'leash', name: '리드줄 & 하네스', category: 'essential', checked: false },
      { id: 'poopbag', name: '배변봉투 (넉넉히)', category: 'essential', checked: false },
      { id: 'idtag', name: '인식표 (연락처 확인)', category: 'essential', checked: false },
      { id: 'paper', name: '동물등록증/예방접종 증명서', category: 'health', checked: false },
      { id: 'meds', name: '상비약/영양제', category: 'health', checked: false },
      { id: 'bed', name: '평소 쓰는 담요/방석', category: 'comfort', checked: false },
      { id: 'toy', name: '최애 장난감', category: 'comfort', checked: false },
    ]

    if (tripType === 'camping') {
      baseItems.push(
        { id: 'light', name: '야간 산책용 라이트', category: 'activity', checked: false },
        { id: 'bug', name: '해충 방지 스프레이', category: 'health', checked: false },
        { id: 'long', name: '와이어 줄 (롱줄)', category: 'activity', checked: false },
        { id: 'mat', name: '야외용 매트', category: 'comfort', checked: false }
      )
    } else if (tripType === 'beach') {
      baseItems.push(
        { id: 'towel', name: '비치 타올 (여러 장)', category: 'essential', checked: false },
        { id: 'lifevest', name: '구명조끼', category: 'activity', checked: false },
        { id: 'freshwater', name: '헹굼용 생수', category: 'health', checked: false },
        { id: 'sun', name: '강아지용 선크림', category: 'health', checked: false }
      )
    } else if (tripType === 'hotel') {
      baseItems.push(
        { id: 'pad', name: '배변패드', category: 'essential', checked: false },
        { id: 'shampoo', name: '샴푸 & 빗', category: 'essential', checked: false },
        { id: 'manner', name: '매너벨트/기저귀', category: 'essential', checked: false }
      )
    }

    setItems(baseItems)
  }

  const toggleItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100)

  const categories = [
    { id: 'essential', name: '필수품', icon: Backpack, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'food', name: '식사/간식', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'health', name: '건강/위생', icon: FirstAidKit, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'comfort', name: '휴식/안정', icon: Tent, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'activity', name: '활동/놀이', icon: Sun, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

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
              <Luggage className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">여행 짐 싸기 도우미</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            설레는 여행, 빠진 물건 없이 완벽하게 준비하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Map className="w-5 h-5 mr-2 text-green-500" />
                여행 정보
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">여행 타입</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'hotel', label: '호캉스', icon: Building2 },
                      { id: 'camping', label: '캠핑', icon: Tent },
                      { id: 'beach', label: '바다', icon: Palmtree }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setTripType(type.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${tripType === type.id
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">여행 기간</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <span className="font-bold text-green-600 w-16 text-right">{duration}박</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-green-900 rounded-2xl p-6 text-white shadow-lg text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
                    className="transition-all duration-1000 ease-out rounded-full"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black">
                    {progress}%
                  </span>
                </div>
              </div>
              <p className="text-green-100 font-medium">
                {progress === 100 ? '준비 완료! 즐거운 여행 되세요!' : '아직 챙겨야 할 물건이 있어요.'}
              </p>
            </div>
          </div>

          {/* Right Column: Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="space-y-8">
                {categories.map((cat) => {
                  const catItems = items.filter(i => i.category === cat.id)
                  if (catItems.length === 0) return null

                  return (
                    <div key={cat.id}>
                      <h3 className={`flex items-center gap-2 font-bold text-lg mb-4 ${cat.color}`}>
                        <cat.icon className="w-5 h-5" />
                        {cat.name}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {catItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${item.checked
                                ? 'border-green-200 bg-green-50/50'
                                : 'border-gray-100 hover:border-green-200 bg-white'
                              }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                              }`}>
                              {item.checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
