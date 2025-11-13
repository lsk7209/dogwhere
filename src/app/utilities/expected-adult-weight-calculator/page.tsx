'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, Calculator } from 'lucide-react'

export default function ExpectedAdultWeightCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<number>(0)
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [result, setResult] = useState<{
    expectedWeight: number
    weightRange: { min: number; max: number }
    confidence: string
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (currentAge <= 0 || currentWeight <= 0) return

    // 연령별 성장률 (현재 체중 대비 성체 체중 비율)
    let growthFactor = 1.0
    
    if (currentAge <= 2) {
      growthFactor = 3.0 // 2개월: 약 3배
    } else if (currentAge <= 3) {
      growthFactor = 2.5 // 3개월: 약 2.5배
    } else if (currentAge <= 4) {
      growthFactor = 2.2 // 4개월: 약 2.2배
    } else if (currentAge <= 6) {
      growthFactor = 1.8 // 6개월: 약 1.8배
    } else if (currentAge <= 9) {
      growthFactor = 1.4 // 9개월: 약 1.4배
    } else if (currentAge <= 12) {
      growthFactor = 1.2 // 12개월: 약 1.2배
    } else {
      growthFactor = 1.0 // 성체
    }

    // 견종별 조정
    if (breedSize === 'small') {
      growthFactor *= 0.9 // 소형견은 조금 덜 성장
    } else if (breedSize === 'large') {
      growthFactor *= 1.1 // 대형견은 조금 더 성장
    }

    const expectedWeight = Math.round(currentWeight * growthFactor * 10) / 10
    const weightRange = {
      min: Math.round(expectedWeight * 0.9 * 10) / 10,
      max: Math.round(expectedWeight * 1.1 * 10) / 10
    }

    let confidence = ''
    if (currentAge <= 4) {
      confidence = '낮음 (성장 초기 단계)'
    } else if (currentAge <= 9) {
      confidence = '중간 (성장 중반 단계)'
    } else {
      confidence = '높음 (성장 후반 단계)'
    }

    let recommendation = ''
    if (currentAge <= 4) {
      recommendation = '성장 초기 단계이므로 예측 정확도가 낮습니다. 정기적으로 체중을 측정하여 추이를 확인하세요.'
    } else if (currentAge <= 9) {
      recommendation = '성장 중반 단계입니다. 예상 체중을 참고하되, 개별 차이가 있을 수 있습니다.'
    } else {
      recommendation = '성장이 거의 완료되었습니다. 예상 체중에 근접할 가능성이 높습니다.'
    }

    setResult({
      expectedWeight,
      weightRange,
      confidence,
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
            <Scale className="w-10 h-10 text-indigo-600 mr-3" />
            예상 성체 체중 계산기
          </h1>
          <p className="text-xl text-gray-600">
            현재 체중과 나이로 성체 체중을 예측합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 나이 (개월)
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={currentAge || ''}
                  onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 체중 (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentWeight || ''}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
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

            <button
              onClick={calculate}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예상 성체 체중</p>
                  <p className="text-4xl font-bold text-indigo-700">{result.expectedWeight}kg</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예상 체중 범위</p>
                  <p className="text-2xl font-bold text-indigo-700">
                    {result.weightRange.min}kg ~ {result.weightRange.max}kg
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예측 정확도</p>
                  <p className="text-xl font-bold text-indigo-700">{result.confidence}</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 성체 체중 예측 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 성장 초기(2-4개월) 단계에서는 예측 정확도가 낮습니다</li>
            <li>• 성장 중반(4-9개월) 단계에서는 예측 정확도가 중간입니다</li>
            <li>• 성장 후반(9-12개월) 단계에서는 예측 정확도가 높습니다</li>
            <li>• 개별 강아지의 성장 속도는 차이가 있을 수 있습니다</li>
            <li>• 정기적으로 체중을 측정하여 성장 추이를 확인하세요</li>
            <li>• 예상 체중은 참고용이며, 수의사와 상담하는 것이 좋습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

