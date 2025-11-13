'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bone, Calculator } from 'lucide-react'

export default function CalciumRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    dailyCalcium: number
    calciumPerKg: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 칼슘 필요량 계산 (체중 1kg당 mg)
    let calciumPerKg = 120 // 기본값 (성견)
    
    if (age === 'puppy') {
      calciumPerKg = 320 // 강아지는 성장을 위해 더 많은 칼슘 필요
    } else if (age === 'young') {
      calciumPerKg = 200 // 청견도 성장기
    } else if (age === 'senior') {
      calciumPerKg = 100 // 노령견은 조금 덜 필요하지만 골격 건강 유지 필요
    } else if (age === 'pregnant') {
      calciumPerKg = 250 // 임신 중인 강아지는 더 많은 칼슘 필요
    } else if (age === 'lactating') {
      calciumPerKg = 400 // 수유 중인 강아지는 가장 많은 칼슘 필요
    }

    const dailyCalcium = Math.round(weight * calciumPerKg)

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 성장을 위해 충분한 칼슘이 필요합니다. 칼슘과 인의 비율(1.2:1 ~ 1.4:1)을 유지하는 것이 중요합니다.'
    } else if (age === 'senior') {
      recommendation = '노령견은 골격 건강을 위해 적절한 칼슘 섭취가 필요합니다. 칼슘 과다 섭취는 신장에 부담을 줄 수 있습니다.'
    } else if (age === 'pregnant' || age === 'lactating') {
      recommendation = '임신/수유 중인 강아지는 매우 많은 칼슘이 필요합니다. 수의사와 상담하여 적절한 보충제를 고려하세요.'
    } else {
      recommendation = '적정한 칼슘 섭취량입니다. 칼슘과 인의 균형을 유지하는 것이 중요합니다.'
    }

    setResult({
      dailyCalcium,
      calciumPerKg,
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
            <Bone className="w-10 h-10 text-purple-600 mr-3" />
            칼슘 필요량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            성장 단계별 칼슘 필요량을 계산합니다
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
                  <option value="pregnant">임신 중</option>
                  <option value="lactating">수유 중</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼슘 필요량</p>
                  <p className="text-3xl font-bold text-purple-700">{result.dailyCalcium}mg</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">체중 1kg당 칼슘</p>
                  <p className="text-2xl font-bold text-purple-700">{result.calciumPerKg}mg/kg</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 칼슘 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 칼슘은 골격과 치아 건강에 필수적입니다</li>
            <li>• 강아지는 성장을 위해 성견보다 2-3배 많은 칼슘이 필요합니다</li>
            <li>• 칼슘과 인의 비율(1.2:1 ~ 1.4:1)을 유지하는 것이 중요합니다</li>
            <li>• 칼슘 과다 섭취는 골격 발달 문제를 일으킬 수 있습니다</li>
            <li>• 칼슘 부족은 골격 약화와 골절 위험을 증가시킵니다</li>
            <li>• 임신/수유 중인 강아지는 매우 많은 칼슘이 필요합니다</li>
            <li>• 칼슘 보충제는 수의사와 상담 후 사용하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

