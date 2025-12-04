'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Calculator, ArrowLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react'

export default function FoodTransitionCalculatorPage() {
  const [transitionDays, setTransitionDays] = useState<number>(7)
  const [dailyAmount, setDailyAmount] = useState<number>(0)
  const [result, setResult] = useState<{
    schedule: Array<{ day: number; oldFood: number; newFood: number; oldPercent: number; newPercent: number }>
  } | null>(null)

  const calculate = () => {
    if (transitionDays <= 0 || dailyAmount <= 0) return

    const schedule = []
    const steps = transitionDays

    for (let day = 1; day <= steps; day++) {
      const newPercent = Math.round((day / steps) * 100)
      const oldPercent = 100 - newPercent

      const newFood = Math.round((dailyAmount * newPercent / 100) * 10) / 10
      const oldFood = Math.round((dailyAmount * oldPercent / 100) * 10) / 10

      schedule.push({
        day,
        oldFood,
        newFood,
        oldPercent,
        newPercent
      })
    }

    setResult({ schedule })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-cyan-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">사료 전환 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            새로운 사료로 바꿀 때, 배탈 없이 안전하게 교체하는 황금 비율을 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-cyan-500" />
                설정 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전환 기간 (일)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="3"
                      max="14"
                      value={transitionDays || ''}
                      onChange={(e) => setTransitionDays(parseInt(e.target.value) || 7)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">일</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 보통 7-10일이 권장됩니다.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">일일 급여량 (g)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={dailyAmount || ''}
                      onChange={(e) => setDailyAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">g</span>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={dailyAmount <= 0}
                  className="w-full bg-cyan-600 text-white py-4 px-6 rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  스케줄 생성하기
                </button>
              </div>

              {/* Guide Box */}
              <div className="mt-8 bg-cyan-50 rounded-xl p-5 border border-cyan-100">
                <h3 className="font-bold text-cyan-800 mb-3 flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  주의사항
                </h3>
                <ul className="space-y-2 text-sm text-cyan-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    변 상태가 묽어지면 이전 단계로 돌아가 며칠 더 유지하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    노령견이나 민감한 강아지는 기간을 더 길게 잡으세요.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">일자별 혼합 비율</h2>
                  <div className="space-y-4">
                    {result.schedule.map((item) => (
                      <div key={item.day} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-sm mr-3">
                              {item.day}
                            </span>
                            <span className="font-bold text-gray-900">Day {item.day}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            총 {dailyAmount}g
                          </div>
                        </div>

                        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <div
                            className="absolute left-0 top-0 h-full bg-cyan-500 transition-all duration-500"
                            style={{ width: `${item.newPercent}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <div className="text-gray-500">
                            기존 사료 <span className="font-bold text-gray-700">{item.oldPercent}%</span> ({item.oldFood}g)
                          </div>
                          <div className="text-cyan-600">
                            새 사료 <span className="font-bold">{item.newPercent}%</span> ({item.newFood}g)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                  <RefreshCw className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">스케줄이 없습니다</h3>
                <p className="text-gray-500">
                  왼쪽에서 전환 기간과 급여량을 입력하고<br />스케줄 생성 버튼을 눌러주세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
