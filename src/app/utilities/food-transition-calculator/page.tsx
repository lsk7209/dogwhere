'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Calculator } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-10 h-10 text-cyan-600 mr-3" />
            사료 전환 계산기
          </h1>
          <p className="text-xl text-gray-600">
            사료 변경 시 점진적 전환 비율을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전환 기간 (일)
                </label>
                <input
                  type="number"
                  min="3"
                  max="14"
                  value={transitionDays || ''}
                  onChange={(e) => setTransitionDays(parseInt(e.target.value) || 7)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">권장: 7-10일</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일일 급여량 (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={dailyAmount || ''}
                  onChange={(e) => setDailyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg hover:bg-cyan-700 transition-colors font-medium text-lg"
            >
              전환 일정 생성
            </button>

            {result && (
              <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">전환 일정표</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.schedule.map((item) => (
                    <div key={item.day} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Day {item.day}</span>
                        <span className="text-sm text-gray-600">
                          기존 {item.oldPercent}% + 신규 {item.newPercent}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">기존 사료:</span>
                          <span className="font-semibold text-gray-900 ml-2">{item.oldFood}g</span>
                        </div>
                        <div>
                          <span className="text-gray-600">신규 사료:</span>
                          <span className="font-semibold text-cyan-700 ml-2">{item.newFood}g</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-cyan-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.newPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-cyan-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 사료 전환 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 사료 전환은 최소 7일 이상 점진적으로 진행하세요</li>
            <li>• 급격한 사료 변경은 소화 불량을 일으킬 수 있습니다</li>
            <li>• 전환 기간 중 강아지의 대변 상태를 관찰하세요</li>
            <li>• 설사나 구토가 발생하면 전환 속도를 늦추세요</li>
            <li>• 기존 사료와 신규 사료를 섞어서 급여하세요</li>
            <li>• 민감한 강아지는 더 긴 전환 기간(10-14일)이 필요할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

