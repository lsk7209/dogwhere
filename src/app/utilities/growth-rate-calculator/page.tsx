'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Calculator } from 'lucide-react'

export default function GrowthRateCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<number>(0)
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [result, setResult] = useState<{
    growthRate: number
    expectedAdultWeight: number
    growthStage: string
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (currentAge <= 0 || currentWeight <= 0) return

    // 견종별 성체 체중 추정 (현재 체중 기반)
    let adultWeightMultiplier = 2.0 // 기본값
    
    if (breedSize === 'small') {
      adultWeightMultiplier = 1.8 // 소형견은 성장이 빠름
    } else if (breedSize === 'large') {
      adultWeightMultiplier = 2.5 // 대형견은 성장이 느림
    }

    // 연령별 성장률 계산
    let growthRate = 0
    let growthStage = ''
    
    if (currentAge <= 3) {
      growthRate = 15 // 매우 빠른 성장
      growthStage = '초기 성장기'
    } else if (currentAge <= 6) {
      growthRate = 10 // 빠른 성장
      growthStage = '성장기'
    } else if (currentAge <= 12) {
      growthRate = 5 // 보통 성장
      growthStage = '후기 성장기'
    } else {
      growthRate = 0 // 성장 완료
      growthStage = '성체'
    }

    const expectedAdultWeight = Math.round(currentWeight * adultWeightMultiplier * 10) / 10

    let recommendation = ''
    if (growthStage === '초기 성장기') {
      recommendation = '매우 빠른 성장 단계입니다. 충분한 영양과 적절한 운동이 필요합니다.'
    } else if (growthStage === '성장기') {
      recommendation = '빠른 성장 단계입니다. 균형잡힌 영양과 규칙적인 운동을 유지하세요.'
    } else if (growthStage === '후기 성장기') {
      recommendation = '성장이 완료되는 단계입니다. 체중 관리를 시작하세요.'
    } else {
      recommendation = '성장이 완료되었습니다. 체중 유지와 건강 관리에 집중하세요.'
    }

    setResult({
      growthRate,
      expectedAdultWeight,
      growthStage,
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
            <TrendingUp className="w-10 h-10 text-purple-600 mr-3" />
            성장 속도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            강아지의 성장 속도와 예상 성체 크기를 계산합니다
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
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">성장 단계</p>
                  <p className="text-2xl font-bold text-purple-700">{result.growthStage}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">월간 성장률</p>
                  <p className="text-3xl font-bold text-purple-700">{result.growthRate}%</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예상 성체 체중</p>
                  <p className="text-3xl font-bold text-purple-700">{result.expectedAdultWeight}kg</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 성장 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견은 6-8개월에 성장이 완료됩니다</li>
            <li>• 중형견은 10-12개월에 성장이 완료됩니다</li>
            <li>• 대형견은 12-18개월에 성장이 완료됩니다</li>
            <li>• 성장기에는 충분한 영양과 적절한 운동이 필요합니다</li>
            <li>• 정기적으로 체중을 측정하여 성장 추이를 모니터링하세요</li>
            <li>• 성장 속도가 너무 빠르거나 느리면 수의사와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

