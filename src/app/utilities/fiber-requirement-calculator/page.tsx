'use client'

import { useState } from 'react'
import Link from 'next/link'
import {Leaf, Calculator } from 'lucide-react'

export default function FiberRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [digestiveHealth, setDigestiveHealth] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyFiber: number
    dailyCalories: number
    fiberPercentage: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산
    const baseCalories = 70 * Math.pow(weight, 0.75)
    const dailyCalories = Math.round(baseCalories * 1.6) // 성견 기준

    // 식이섬유 필요량 계산 (체중 1kg당 약 0.5-1g)
    let fiberPerKg = 0.7 // 기본값 (g/kg)
    
    if (digestiveHealth === 'constipation') {
      fiberPerKg = 1.0 // 변비가 있는 경우 더 많은 식이섬유 필요
    } else if (digestiveHealth === 'diarrhea') {
      fiberPerKg = 0.5 // 설사가 있는 경우 식이섬유를 줄임
    } else if (digestiveHealth === 'diabetes') {
      fiberPerKg = 1.2 // 당뇨 강아지는 더 많은 식이섬유 필요
    }

    const dailyFiber = Math.round(weight * fiberPerKg * 10) / 10
    const fiberPercentage = Math.round((dailyFiber * 4 / dailyCalories) * 100 * 10) / 10

    let recommendation = ''
    if (fiberPercentage < 2) {
      recommendation = '식이섬유 섭취량이 부족합니다. 변비 예방과 소화 건강을 위해 식이섬유를 늘리세요.'
    } else if (fiberPercentage > 8) {
      recommendation = '식이섬유 섭취량이 과다할 수 있습니다. 영양소 흡수에 영향을 줄 수 있으므로 조절하세요.'
    } else {
      recommendation = '적정한 식이섬유 섭취량입니다. 현재 식단을 유지하세요.'
    }

    setResult({
      dailyFiber,
      dailyCalories,
      fiberPercentage,
      recommendation
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
            <Leaf className="w-10 h-10 text-green-600 mr-3" />
            식이섬유 권장량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            소화 건강을 위한 식이섬유 권장량을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 체중 (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소화 건강 상태
              </label>
              <select
                value={digestiveHealth}
                onChange={(e) => setDigestiveHealth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="normal">정상</option>
                <option value="constipation">변비</option>
                <option value="diarrhea">설사</option>
                <option value="diabetes">당뇨</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 식이섬유 필요량</p>
                  <p className="text-3xl font-bold text-green-700">{result.dailyFiber}g</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼로리 필요량</p>
                  <p className="text-2xl font-bold text-green-700">{result.dailyCalories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">식이섬유 비율</p>
                  <p className="text-2xl font-bold text-green-700">{result.fiberPercentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 2-8%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 식이섬유 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 식이섬유는 소화 건강과 변비 예방에 중요합니다</li>
            <li>• 수용성 식이섬유(귀리, 보리 등)와 불용성 식이섬유(야채 등)를 균형있게 섭취하세요</li>
            <li>• 변비가 있는 강아지는 식이섬유를 늘리세요</li>
            <li>• 설사가 있는 강아지는 식이섬유를 줄이고 수의사와 상담하세요</li>
            <li>• 당뇨 강아지는 식이섬유가 혈당 조절에 도움이 됩니다</li>
            <li>• 식이섬유를 급격히 늘리면 소화 불량을 일으킬 수 있으므로 점진적으로 증가시키세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

