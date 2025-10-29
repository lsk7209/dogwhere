'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Utensils, Calculator } from 'lucide-react'

export default function FoodCalorieCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activity, setActivity] = useState<string>('normal')
  const [result, setResult] = useState<{
    rer: number
    der: number
    foodAmount: number
    caloriesPer100g: number
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // RER (Resting Energy Requirement) = 70 × (체중^0.75)
    const rer = 70 * Math.pow(weight, 0.75)

    // 활동계수
    const activityFactors: Record<string, number> = {
      low: 1.2,      // 저활동 (거의 움직이지 않음)
      normal: 1.6,   // 일반 활동
      high: 2.0      // 고활동 (매일 운동, 활동적)
    }

    const factor = activityFactors[activity] || 1.6
    const der = rer * factor // DER (Daily Energy Requirement)

    // 사료 칼로리 (일반 건사료 기준 약 350kcal/100g)
    const caloriesPer100g = 350
    const foodAmount = (der / caloriesPer100g) * 100

    setResult({
      rer: Math.round(rer),
      der: Math.round(der),
      foodAmount: Math.round(foodAmount * 10) / 10,
      caloriesPer100g
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="w-10 h-10 text-orange-600 mr-3" />
            반려견 사료 칼로리 계산기
          </h1>
          <p className="text-xl text-gray-600">
            체중과 활동량에 따라 1일 적정 사료량과 칼로리를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                체중 (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-lg"
                placeholder="예: 5.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동량
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="low">저활동 (노령견, 실내 위주)</option>
                <option value="normal">일반 활동 (정상적인 운동량)</option>
                <option value="high">고활동 (매일 운동, 활동적인 견종)</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
            >
              칼로리 계산하기
            </button>

            {result && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">기초 대사량 (RER)</p>
                  <p className="text-2xl font-bold text-gray-900">{result.rer} kcal/day</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 필요 칼로리 (DER)</p>
                  <p className="text-2xl font-bold text-orange-700">{result.der} kcal/day</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 권장 사료량</p>
                  <p className="text-3xl font-bold text-orange-700">{result.foodAmount}g</p>
                  <p className="text-xs text-gray-500 mt-2">
                    * 사료 100g당 약 {result.caloriesPer100g}kcal 기준
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 계산 공식</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>RER (기초 대사량)</strong> = 70 × (체중<sup>0.75</sup>)</p>
            <p><strong>DER (일일 필요 칼로리)</strong> = RER × 활동계수</p>
            <ul className="list-disc list-inside space-y-1 mt-3">
              <li>저활동: 1.2배</li>
              <li>일반 활동: 1.6배</li>
              <li>고활동: 2.0배</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              * 사료 종류에 따라 칼로리가 다를 수 있으니 참고용으로만 사용하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

