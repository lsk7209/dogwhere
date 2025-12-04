'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cookie, Calculator, ArrowLeft, PieChart, AlertTriangle, Scale, Info, CheckCircle } from 'lucide-react'

interface Treat {
  id: string
  name: string
  kcal: number // per gram
  icon: string
}

export default function TreatCalorieCalculatorPage() {
  const [dailyKcal, setDailyKcal] = useState<number>(500)
  const [treatAmount, setTreatAmount] = useState<number>(10)
  const [selectedTreatId, setSelectedTreatId] = useState<string>('snack')

  const treats: Treat[] = [
    { id: 'snack', name: '일반 간식', kcal: 3.5, icon: '🍪' },
    { id: 'chicken', name: '닭가슴살', kcal: 1.65, icon: '🍗' },
    { id: 'apple', name: '사과', kcal: 0.52, icon: '🍎' },
    { id: 'cheese', name: '치즈', kcal: 4.0, icon: '🧀' },
    { id: 'beef', name: '소고기 큐브', kcal: 2.5, icon: '🥩' },
  ]

  const selectedTreat = treats.find(t => t.id === selectedTreatId)!
  const treatKcal = Math.round(treatAmount * selectedTreat.kcal)
  const treatPercent = Math.round((treatKcal / dailyKcal) * 100)
  const isOverLimit = treatPercent > 10

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Cookie className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">간식 칼로리 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            사랑의 간식도 과하면 독이 됩니다. 적정량을 확인해보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-pink-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">하루 권장 칼로리</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={dailyKcal}
                      onChange={(e) => setDailyKcal(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <div className="w-24 text-right font-bold text-gray-900 text-lg">
                      {dailyKcal} <span className="text-sm font-normal text-gray-500">kcal</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">간식 종류</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {treats.map((treat) => (
                      <button
                        key={treat.id}
                        onClick={() => setSelectedTreatId(treat.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedTreatId === treat.id
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-100 hover:border-pink-200 text-gray-600'
                          }`}
                      >
                        <span className="text-2xl">{treat.icon}</span>
                        <span className="font-bold text-xs">{treat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">급여량 (g)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTreatAmount(Math.max(1, treatAmount - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                    >-</button>
                    <input
                      type="number"
                      value={treatAmount}
                      onChange={(e) => setTreatAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 text-center py-2 border-b-2 border-gray-200 focus:border-pink-500 outline-none font-bold text-xl"
                    />
                    <button
                      onClick={() => setTreatAmount(treatAmount + 1)}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
              <h3 className="font-bold text-pink-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                알고 계셨나요?
              </h3>
              <ul className="space-y-2 text-sm text-pink-800">
                <li>• 간식은 하루 총 칼로리의 <strong>10% 이내</strong>로 급여해야 합니다.</li>
                <li>• 간식을 준 만큼 사료량을 줄여야 비만을 예방할 수 있습니다.</li>
                <li>• 사람이 먹는 음식은 염분이 많아 강아지에게 해로울 수 있습니다.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-gray-500" />
                분석 결과
              </h2>

              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="24"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={isOverLimit ? '#ef4444' : '#ec4899'}
                    strokeWidth="24"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - Math.min(treatPercent, 100) / 100)}
                    className="transition-all duration-500 ease-out rounded-full"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-4xl font-black ${isOverLimit ? 'text-red-600' : 'text-pink-600'}`}>
                    {treatPercent}%
                  </span>
                  <span className="text-xs text-gray-500">일일 섭취율</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">간식 칼로리</span>
                  <span className="font-bold text-gray-900">{treatKcal} kcal</span>
                </div>

                <div className={`p-4 rounded-xl text-center ${isOverLimit ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                  <div className="flex justify-center mb-2">
                    {isOverLimit ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
                  </div>
                  <div className="font-bold mb-1">
                    {isOverLimit ? '주의 필요!' : '적정량입니다'}
                  </div>
                  <div className="text-sm opacity-90">
                    {isOverLimit
                      ? '권장량(10%)을 초과했습니다. 양을 줄여주세요.'
                      : '안전한 범위 내에서 급여하고 계시네요!'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
