'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Beef, Calculator } from 'lucide-react'

export default function ProteinRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyProtein: number
    dailyCalories: number
    proteinPercentage: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산
    let baseCalories = 70 * Math.pow(weight, 0.75)
    
    // 연령별 조정
    const ageFactors: Record<string, number> = {
      puppy: 2.0,
      young: 1.6,
      adult: 1.6,
      senior: 1.2
    }
    baseCalories *= (ageFactors[age] || 1.6)

    // 활동량 조정
    const activityFactors: Record<string, number> = {
      low: 0.8,
      normal: 1.0,
      high: 1.3
    }
    baseCalories *= (activityFactors[activityLevel] || 1.0)

    const dailyCalories = Math.round(baseCalories)

    // 단백질 필요량 계산 (견종별, 연령별)
    let proteinPerKg = 2.5 // 기본값 (g/kg)
    
    if (age === 'puppy') {
      proteinPerKg = 4.0 // 강아지는 성장을 위해 더 많은 단백질 필요
    } else if (age === 'senior') {
      proteinPerKg = 2.0 // 노령견은 조금 덜 필요
    }

    if (breedSize === 'large') {
      proteinPerKg *= 0.9 // 대형견은 상대적으로 덜 필요
    } else if (breedSize === 'small') {
      proteinPerKg *= 1.1 // 소형견은 신진대사가 빨라서 더 필요
    }

    if (activityLevel === 'high') {
      proteinPerKg *= 1.2 // 고활동 강아지는 더 많은 단백질 필요
    }

    const dailyProtein = Math.round(weight * proteinPerKg)
    const proteinPercentage = Math.round((dailyProtein * 4 / dailyCalories) * 100)

    let recommendation = ''
    if (proteinPercentage < 18) {
      recommendation = '단백질 섭취량이 부족합니다. 고단백 사료나 단백질 보충을 고려하세요.'
    } else if (proteinPercentage > 30) {
      recommendation = '단백질 섭취량이 과다할 수 있습니다. 신장 건강을 위해 수의사와 상담하세요.'
    } else {
      recommendation = '적정한 단백질 섭취량입니다. 현재 식단을 유지하세요.'
    }

    setResult({
      dailyProtein,
      dailyCalories,
      proteinPercentage,
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
            <Beef className="w-10 h-10 text-red-600 mr-3" />
            단백질 필요량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            견종과 체중에 따른 일일 단백질 필요량을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">저활동</option>
                  <option value="normal">일반 활동</option>
                  <option value="high">고활동</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 단백질 필요량</p>
                  <p className="text-3xl font-bold text-red-700">{result.dailyProtein}g</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼로리 필요량</p>
                  <p className="text-2xl font-bold text-red-700">{result.dailyCalories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">단백질 비율</p>
                  <p className="text-2xl font-bold text-red-700">{result.proteinPercentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 18-30%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 단백질 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 성장을 위해 성견보다 2배 많은 단백질이 필요합니다</li>
            <li>• 단백질은 근육, 피부, 털, 면역 체계에 필수적입니다</li>
            <li>• 고품질 단백질(닭고기, 생선, 계란 등)을 선택하세요</li>
            <li>• 단백질 과다 섭취는 신장에 부담을 줄 수 있으므로 주의하세요</li>
            <li>• 사료 포장지의 영양 성분표를 확인하여 단백질 함량을 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

