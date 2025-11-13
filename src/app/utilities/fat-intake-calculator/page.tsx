'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplet, Calculator } from 'lucide-react'

export default function FatIntakeCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [healthCondition, setHealthCondition] = useState<string>('healthy')
  const [result, setResult] = useState<{
    dailyFat: number
    dailyCalories: number
    fatPercentage: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산
    let baseCalories = 70 * Math.pow(weight, 0.75)
    
    const ageFactors: Record<string, number> = {
      puppy: 2.0,
      young: 1.6,
      adult: 1.6,
      senior: 1.2
    }
    baseCalories *= (ageFactors[age] || 1.6)

    const dailyCalories = Math.round(baseCalories)

    // 지방 필요량 계산 (칼로리의 비율)
    let fatPercentage = 10 // 기본값 (%)
    
    if (age === 'puppy') {
      fatPercentage = 12 // 강아지는 성장을 위해 더 많은 지방 필요
    } else if (age === 'senior') {
      fatPercentage = 8 // 노령견은 지방 섭취를 줄여야 함
    }

    if (breedSize === 'small') {
      fatPercentage += 1 // 소형견은 신진대사가 빨라서 조금 더 필요
    }

    if (healthCondition === 'obese') {
      fatPercentage = 5 // 비만 강아지는 지방 섭취를 최소화
    } else if (healthCondition === 'underweight') {
      fatPercentage += 2 // 저체중 강아지는 지방 섭취를 늘림
    } else if (healthCondition === 'pancreatitis') {
      fatPercentage = 5 // 췌장염 강아지는 저지방 식단 필요
    }

    const dailyFat = Math.round((dailyCalories * fatPercentage / 100) / 9) // 지방 1g = 9kcal

    let recommendation = ''
    if (fatPercentage < 8) {
      recommendation = '지방 섭취량이 부족합니다. 필수 지방산 부족으로 피부와 털 건강에 영향을 줄 수 있습니다.'
    } else if (fatPercentage > 15) {
      recommendation = '지방 섭취량이 과다할 수 있습니다. 비만이나 췌장염 위험이 있으므로 수의사와 상담하세요.'
    } else {
      recommendation = '적정한 지방 섭취량입니다. 오메가-3, 오메가-6 같은 필수 지방산을 포함한 식단을 유지하세요.'
    }

    setResult({
      dailyFat,
      dailyCalories,
      fatPercentage,
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
            <Droplet className="w-10 h-10 text-yellow-600 mr-3" />
            지방 섭취량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            건강 상태에 따른 적정 지방 섭취량을 계산합니다
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
                  건강 상태
                </label>
                <select
                  value={healthCondition}
                  onChange={(e) => setHealthCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="healthy">건강</option>
                  <option value="obese">비만</option>
                  <option value="underweight">저체중</option>
                  <option value="pancreatitis">췌장염</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 지방 필요량</p>
                  <p className="text-3xl font-bold text-yellow-700">{result.dailyFat}g</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼로리 필요량</p>
                  <p className="text-2xl font-bold text-yellow-700">{result.dailyCalories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">지방 비율</p>
                  <p className="text-2xl font-bold text-yellow-700">{result.fatPercentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 8-15%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 지방 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 지방은 에너지 공급과 필수 지방산 공급에 중요합니다</li>
            <li>• 오메가-3, 오메가-6 같은 필수 지방산은 피부와 털 건강에 필수적입니다</li>
            <li>• 비만 강아지는 지방 섭취를 줄여야 합니다</li>
            <li>• 췌장염이 있는 강아지는 저지방 식단이 필요합니다</li>
            <li>• 고품질 지방(생선기름, 아마씨유 등)을 선택하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

