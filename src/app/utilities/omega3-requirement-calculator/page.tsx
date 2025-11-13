'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fish, Calculator } from 'lucide-react'

export default function Omega3RequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [skinCondition, setSkinCondition] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyOmega3: number
    epaDha: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 오메가-3 필요량 계산 (체중 1kg당 mg)
    let omega3PerKg = 50 // 기본값
    
    if (skinCondition === 'dry') {
      omega3PerKg = 80 // 건조한 피부
    } else if (skinCondition === 'allergy') {
      omega3PerKg = 100 // 알레르기
    } else if (skinCondition === 'inflammation') {
      omega3PerKg = 120 // 염증
    } else if (skinCondition === 'arthritis') {
      omega3PerKg = 150 // 관절염
    }

    const dailyOmega3 = Math.round(weight * omega3PerKg)
    
    // EPA + DHA 비율 (오메가-3의 약 30%가 EPA+DHA)
    const epaDha = Math.round(dailyOmega3 * 0.3)

    let recommendation = ''
    if (skinCondition === 'normal') {
      recommendation = '건강한 피부와 털을 유지하기 위해 적정한 오메가-3 섭취량입니다.'
    } else if (skinCondition === 'dry') {
      recommendation = '건조한 피부 개선을 위해 오메가-3 섭취를 늘렸습니다. 생선기름 보충제를 고려하세요.'
    } else if (skinCondition === 'allergy') {
      recommendation = '알레르기 증상 완화를 위해 오메가-3 섭취를 늘렸습니다. 수의사와 상담하여 보충제를 사용하세요.'
    } else if (skinCondition === 'inflammation') {
      recommendation = '염증 완화를 위해 오메가-3 섭취를 늘렸습니다. 고품질 생선기름 보충제를 사용하세요.'
    } else {
      recommendation = '관절염 완화를 위해 오메가-3 섭취를 크게 늘렸습니다. 수의사와 상담하여 적절한 보충제를 선택하세요.'
    }

    setResult({
      dailyOmega3,
      epaDha,
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
            <Fish className="w-10 h-10 text-teal-600 mr-3" />
            오메가-3 필요량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            피부 건강을 위한 오메가-3 필요량을 계산합니다
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
                  피부/건강 상태
                </label>
                <select
                  value={skinCondition}
                  onChange={(e) => setSkinCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="normal">정상</option>
                  <option value="dry">건조한 피부</option>
                  <option value="allergy">알레르기</option>
                  <option value="inflammation">염증</option>
                  <option value="arthritis">관절염</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 오메가-3 필요량</p>
                  <p className="text-3xl font-bold text-teal-700">{result.dailyOmega3}mg</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">EPA + DHA 필요량</p>
                  <p className="text-2xl font-bold text-teal-700">{result.epaDha}mg</p>
                  <p className="text-xs text-gray-500 mt-1">오메가-3의 활성 성분</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 오메가-3 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 오메가-3는 피부와 털 건강에 필수적인 지방산입니다</li>
            <li>• EPA와 DHA는 오메가-3의 주요 활성 성분입니다</li>
            <li>• 생선기름, 아마씨유, 치아씨드 등에 풍부합니다</li>
            <li>• 건조한 피부, 알레르기, 염증 완화에 도움이 됩니다</li>
            <li>• 관절염 완화에도 효과적입니다</li>
            <li>• 고품질 생선기름 보충제를 선택하세요</li>
            <li>• 오메가-3와 오메가-6의 비율을 균형있게 유지하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

