'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wheat, Calculator } from 'lucide-react'

export default function CarbohydrateRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyCarbs: number
    dailyCalories: number
    carbPercentage: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산
    let baseCalories = 70 * Math.pow(weight, 0.75)
    
    // 활동량 조정
    const activityFactors: Record<string, number> = {
      low: 0.8,
      normal: 1.0,
      high: 1.3,
      veryHigh: 1.6
    }
    baseCalories *= (activityFactors[activityLevel] || 1.0)

    const dailyCalories = Math.round(baseCalories)

    // 탄수화물 필요량 계산
    // 강아지는 탄수화물을 에너지원으로 사용하지만, 필수 영양소는 아닙니다
    // 단백질과 지방으로 대부분의 에너지를 얻을 수 있습니다
    let carbPercentage = 30 // 기본값 (%)
    
    if (activityLevel === 'veryHigh') {
      carbPercentage = 40 // 매우 활발한 강아지는 더 많은 탄수화물 필요
    } else if (activityLevel === 'low') {
      carbPercentage = 20 // 저활동 강아지는 탄수화물을 줄일 수 있음
    }

    const dailyCarbs = Math.round((dailyCalories * carbPercentage / 100) / 4) // 탄수화물 1g = 4kcal

    let recommendation = ''
    if (carbPercentage < 20) {
      recommendation = '탄수화물 섭취량이 낮습니다. 저탄수화물 식단은 고단백, 고지방 식단과 함께 사용해야 합니다.'
    } else if (carbPercentage > 50) {
      recommendation = '탄수화물 섭취량이 높습니다. 비만 위험이 있으므로 단백질과 지방 비율을 조정하세요.'
    } else {
      recommendation = '적정한 탄수화물 섭취량입니다. 복합 탄수화물(쌀, 보리 등)을 선택하세요.'
    }

    setResult({
      dailyCarbs,
      dailyCalories,
      carbPercentage,
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
            <Wheat className="w-10 h-10 text-amber-600 mr-3" />
            탄수화물 필요량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            활동량 기반 탄수화물 필요량을 계산합니다
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
                활동량
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="low">저활동 (실내 위주)</option>
                <option value="normal">일반 활동 (일반적인 산책)</option>
                <option value="high">고활동 (매일 장시간 운동)</option>
                <option value="veryHigh">매우 활발 (경주견, 작업견 수준)</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 탄수화물 필요량</p>
                  <p className="text-3xl font-bold text-amber-700">{result.dailyCarbs}g</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼로리 필요량</p>
                  <p className="text-2xl font-bold text-amber-700">{result.dailyCalories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">탄수화물 비율</p>
                  <p className="text-2xl font-bold text-amber-700">{result.carbPercentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 20-40%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 탄수화물 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 탄수화물은 강아지에게 필수 영양소는 아니지만 에너지 공급에 도움이 됩니다</li>
            <li>• 복합 탄수화물(쌀, 보리, 귀리 등)이 단순 탄수화물보다 좋습니다</li>
            <li>• 활발한 강아지는 더 많은 탄수화물이 필요합니다</li>
            <li>• 비만 강아지는 탄수화물 섭취를 줄이고 단백질과 지방 비율을 높이세요</li>
            <li>• 저탄수화물 식단은 고단백, 고지방 식단과 함께 사용해야 합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

