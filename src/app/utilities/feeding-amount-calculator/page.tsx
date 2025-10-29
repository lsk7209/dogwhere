'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Utensils, Calculator } from 'lucide-react'

export default function FeedingAmountCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [activity, setActivity] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyAmount: number
    mealAmount: number
    calories: number
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산 (체중 기반)
    let baseCalories = 70 * Math.pow(weight, 0.75)

    // 연령별 조정
    const ageFactors: Record<string, number> = {
      puppy: 2.0,      // 강아지 (성장기)
      young: 1.6,      // 청견
      adult: 1.6,      // 성견
      senior: 1.2      // 노령견
    }
    baseCalories *= (ageFactors[age] || 1.6)

    // 활동량 조정
    const activityFactors: Record<string, number> = {
      low: 0.8,
      normal: 1.0,
      high: 1.3
    }
    baseCalories *= (activityFactors[activity] || 1.0)

    // 견종 크기별 추가 조정
    const sizeFactors: Record<string, number> = {
      small: 1.1,   // 소형견은 신진대사가 빨라서 더 필요
      medium: 1.0,
      large: 0.95   // 대형견은 상대적으로 덜 필요
    }
    baseCalories *= (sizeFactors[breedSize] || 1.0)

    const dailyCalories = Math.round(baseCalories)
    
    // 사료 100g당 약 350kcal 기준
    const dailyAmount = Math.round((dailyCalories / 350) * 100 * 10) / 10
    
    // 하루 2끼 기준
    const mealAmount = Math.round((dailyAmount / 2) * 10) / 10

    setResult({
      dailyAmount,
      mealAmount,
      calories: dailyCalories
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
            급여량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            견종, 체중, 연령에 따른 하루 급여량을 자동 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                견종 크기
              </label>
              <select
                value={breedSize}
                onChange={(e) => setBreedSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="small">소형견</option>
                <option value="medium">중형견</option>
                <option value="large">대형견</option>
              </select>
            </div>

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
                연령
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="puppy">강아지 (2-12개월)</option>
                <option value="young">청견 (1-2세)</option>
                <option value="adult">성견 (2-7세)</option>
                <option value="senior">노령견 (7세 이상)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동량
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="low">저활동</option>
                <option value="normal">일반 활동</option>
                <option value="high">고활동</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 필요 칼로리</p>
                  <p className="text-3xl font-bold text-orange-700">{result.calories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">하루 급여량</p>
                  <p className="text-3xl font-bold text-orange-700">{result.dailyAmount}g</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">한 끼 급여량 (하루 2끼 기준)</p>
                  <p className="text-3xl font-bold text-orange-700">{result.mealAmount}g</p>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  * 사료 종류에 따라 칼로리가 다를 수 있습니다. 사료 포장지의 표시를 확인하세요.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 급여 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 성장기이므로 성견보다 2배 많은 칼로리가 필요합니다</li>
            <li>• 노령견은 활동량이 줄어들므로 칼로리 섭취를 줄여야 합니다</li>
            <li>• 사료 포장지의 급여 가이드를 참고하되, 개별 강아지 상태에 맞게 조절하세요</li>
            <li>• 비만이나 저체중인 경우 수의사와 상담하여 급여량을 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

