'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Atom, Calculator } from 'lucide-react'

export default function PhosphorusRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    dailyPhosphorus: number
    calciumRatio: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 인 필요량 계산 (체중 1kg당 mg)
    let phosphorusPerKg = 100 // 기본값 (성견)
    
    if (age === 'puppy') {
      phosphorusPerKg = 250 // 강아지는 성장을 위해 더 많은 인 필요
    } else if (age === 'young') {
      phosphorusPerKg = 150 // 청견도 성장기
    } else if (age === 'senior') {
      phosphorusPerKg = 80 // 노령견은 조금 덜 필요
    }

    const dailyPhosphorus = Math.round(weight * phosphorusPerKg)

    // 칼슘:인 비율 계산 (권장: 1.2:1 ~ 1.4:1)
    const calciumPerKg = age === 'puppy' ? 320 : age === 'young' ? 200 : age === 'senior' ? 100 : 120
    const calciumRatio = Math.round((calciumPerKg / phosphorusPerKg) * 10) / 10

    let recommendation = ''
    if (calciumRatio < 1.2) {
      recommendation = '칼슘:인 비율이 낮습니다. 칼슘 섭취를 늘리거나 인 섭취를 줄여야 합니다. 골격 발달에 문제가 될 수 있습니다.'
    } else if (calciumRatio > 1.4) {
      recommendation = '칼슘:인 비율이 높습니다. 인 섭취를 늘리거나 칼슘 섭취를 줄여야 합니다.'
    } else {
      recommendation = '적정한 칼슘:인 비율입니다. 골격 건강을 위해 이 비율을 유지하세요.'
    }

    setResult({
      dailyPhosphorus,
      calciumRatio,
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
            <Atom className="w-10 h-10 text-indigo-600 mr-3" />
            인 필요량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            골격 건강을 위한 인 필요량을 계산합니다
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
                  생애 단계
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
            </div>

            <button
              onClick={calculate}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 인 필요량</p>
                  <p className="text-3xl font-bold text-indigo-700">{result.dailyPhosphorus}mg</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">칼슘:인 비율</p>
                  <p className="text-2xl font-bold text-indigo-700">{result.calciumRatio}:1</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 1.2:1 ~ 1.4:1</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 인 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 인은 칼슘과 함께 골격과 치아 건강에 필수적입니다</li>
            <li>• 칼슘:인 비율(1.2:1 ~ 1.4:1)을 유지하는 것이 매우 중요합니다</li>
            <li>• 비율이 맞지 않으면 골격 발달 문제가 발생할 수 있습니다</li>
            <li>• 강아지는 성장을 위해 더 많은 인이 필요합니다</li>
            <li>• 인 과다 섭취는 신장 질환을 악화시킬 수 있습니다</li>
            <li>• 사료의 칼슘:인 비율을 확인하여 적절한 사료를 선택하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

