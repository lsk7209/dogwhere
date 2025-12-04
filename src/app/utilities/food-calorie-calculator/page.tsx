'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Utensils, Calculator, ArrowLeft, Activity, Scale, Info, Flame, Check } from 'lucide-react'

export default function FoodCalorieCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activity, setActivity] = useState<string>('normal')
  const [foodKcal, setFoodKcal] = useState<number>(350) // Default 350kcal/100g
  const [result, setResult] = useState<{
    rer: number
    der: number
    foodAmount: number
  } | null>(null)

  const activityLevels = [
    { id: 'low', label: '저활동/노령견', desc: '산책이 적거나 움직임이 둔함', factor: 1.2 },
    { id: 'normal', label: '일반 활동', desc: '하루 1-2회 산책, 보통 활동량', factor: 1.6 },
    { id: 'high', label: '고활동/퍼피', desc: '활동량이 매우 많거나 성장기', factor: 2.0 }
  ]

  const calculate = () => {
    if (weight <= 0) return

    // RER (Resting Energy Requirement) = 70 × (체중^0.75)
    const rer = 70 * Math.pow(weight, 0.75)

    const factor = activityLevels.find(l => l.id === activity)?.factor || 1.6
    const der = rer * factor // DER (Daily Energy Requirement)

    const foodAmount = (der / foodKcal) * 100

    setResult({
      rer: Math.round(rer),
      der: Math.round(der),
      foodAmount: Math.round(foodAmount * 10) / 10
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
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
              <Utensils className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">사료 칼로리 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이에게 딱 맞는 하루 식사량을 계산해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-orange-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">활동량 선택</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setActivity(level.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${activity === level.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 hover:border-orange-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{level.label}</div>
                        <div className="text-xs opacity-70">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">강아지 체중 (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight || ''}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="0.0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 칼로리 (kcal/100g)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={foodKcal || ''}
                        onChange={(e) => setFoodKcal(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-16 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="350"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kcal</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-1">* 사료 뒷면 성분표 확인</p>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={weight <= 0}
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Utensils className="w-5 h-5 mr-2" />
                  급여량 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-orange-100 uppercase tracking-wider">일일 권장 급여량</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.foodAmount}
                      <span className="text-2xl ml-2 font-medium text-orange-200 mb-1">g</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      하루 {Math.round(result.foodAmount / 2)}g씩 2회 급여
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <Flame className="w-4 h-4 mr-2 text-orange-500" />
                        일일 필요 칼로리 (DER)
                      </div>
                      <span className="font-bold text-gray-900">{result.der} kcal</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                        기초 대사량 (RER)
                      </div>
                      <span className="font-bold text-gray-900">{result.rer} kcal</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Scale className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 활동량을 입력하면<br />적정 급여량을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-orange-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-orange-400" />
                  급여 가이드
                </h3>
                <ul className="space-y-3 text-orange-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-400">•</span>
                    계산된 양은 참고용이며, 강아지의 체형 변화를 보며 조절해주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-400">•</span>
                    간식은 하루 총 칼로리의 10%를 넘지 않도록 주의하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-400">•</span>
                    퍼피나 임신/수유견은 수의사와 상담이 필요합니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
