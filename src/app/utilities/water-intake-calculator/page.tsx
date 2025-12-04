'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplets, Scale, Activity, CloudSun, Utensils, ArrowLeft, Info, GlassWater } from 'lucide-react'

export default function WaterIntakeCalculatorPage() {
  const [weight, setWeight] = useState<number>(5)
  const [activity, setActivity] = useState<number>(5) // 1-10
  const [foodType, setFoodType] = useState<'dry' | 'wet' | 'mixed'>('dry')

  const calculate = () => {
    let base = weight * 60 // 60ml per kg base

    // Activity factor
    const activityFactor = 1 + (activity - 5) * 0.1 // +/- 10% per level from 5
    base *= activityFactor

    // Food factor (Wet food provides hydration)
    if (foodType === 'wet') base *= 0.7
    if (foodType === 'mixed') base *= 0.85

    return Math.round(base)
  }

  const dailyAmount = calculate()
  const cupSize = 200 // ml
  const cupCount = Math.ceil(dailyAmount / cupSize * 10) / 10

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Droplets className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">음수량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            건강의 기본은 물! 우리 아이에게 필요한 하루 물의 양을 알려드려요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-blue-500" />
                기본 정보
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">몸무게 (kg)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="w-16 text-right font-bold text-gray-900 text-lg">
                      {weight} <span className="text-sm font-normal text-gray-500">kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">활동량 ({activity})</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={activity}
                    onChange={(e) => setActivity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>집순이</span>
                    <span>에너자이저</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">주식 종류</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dry', label: '건사료' },
                      { id: 'mixed', label: '혼합' },
                      { id: 'wet', label: '습식/화식' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setFoodType(item.id as any)}
                        className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${foodType === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                음수량 늘리기 팁
              </h3>
              <ul className="space-y-3 text-blue-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  물그릇을 집안 곳곳에 놓아주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  신선한 물로 자주 갈아주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  물을 안 마신다면 습식 사료를 섞어주세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center justify-center">
                <GlassWater className="w-5 h-5 mr-2 text-blue-500" />
                하루 권장 음수량
              </h2>

              <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse" />
                <div className="relative z-10">
                  <div className="text-6xl font-black text-blue-600 mb-2">
                    {dailyAmount}
                    <span className="text-2xl text-blue-400 ml-1">ml</span>
                  </div>
                  <div className="text-gray-500 font-medium">
                    종이컵 약 {cupCount}잔
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-50 p-5 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-gray-400" />
                    식사 시
                  </h4>
                  <p className="text-sm text-gray-600">
                    사료와 함께 급여하면 소화를 돕고 자연스럽게 수분을 섭취할 수 있습니다.
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    산책 후
                  </h4>
                  <p className="text-sm text-gray-600">
                    산책 직후에는 갈증을 느끼므로 반드시 신선한 물을 충분히 제공해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
