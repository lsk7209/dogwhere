'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Calculator } from 'lucide-react'

export default function FeedingAdjustmentCalculatorPage() {
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [targetWeight, setTargetWeight] = useState<number>(0)
  const [currentDailyAmount, setCurrentDailyAmount] = useState<number>(0)
  const [result, setResult] = useState<{
    adjustment: number
    newDailyAmount: number
    percentageChange: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (currentWeight <= 0 || targetWeight <= 0 || currentDailyAmount <= 0) return

    const weightDifference = targetWeight - currentWeight
    const weightChangePercent = Math.abs((weightDifference / currentWeight) * 100)

    // 체중 변화에 따른 급여량 조정
    // 목표 체중이 현재보다 높으면 증가, 낮으면 감소
    let adjustmentPercent = 0
    
    if (weightChangePercent <= 5) {
      adjustmentPercent = weightChangePercent * 0.5 // 작은 변화는 0.5배
    } else if (weightChangePercent <= 10) {
      adjustmentPercent = weightChangePercent * 0.7 // 중간 변화는 0.7배
    } else {
      adjustmentPercent = weightChangePercent * 0.9 // 큰 변화는 0.9배
    }

    // 목표 체중이 더 높으면 증가, 낮으면 감소
    if (targetWeight > currentWeight) {
      adjustmentPercent = Math.abs(adjustmentPercent)
    } else {
      adjustmentPercent = -Math.abs(adjustmentPercent)
    }

    const adjustment = Math.round(currentDailyAmount * adjustmentPercent / 100)
    const newDailyAmount = Math.round((currentDailyAmount + adjustment) * 10) / 10
    const percentageChange = Math.round(adjustmentPercent * 10) / 10

    let recommendation = ''
    if (targetWeight > currentWeight) {
      recommendation = `체중 증가를 위해 급여량을 ${Math.abs(percentageChange)}% 증가시켰습니다. 점진적으로 증가시켜 소화 불량을 방지하세요.`
    } else if (targetWeight < currentWeight) {
      recommendation = `체중 감량을 위해 급여량을 ${Math.abs(percentageChange)}% 감소시켰습니다. 급격한 감량은 건강에 해로우므로 점진적으로 진행하세요.`
    } else {
      recommendation = '현재 체중 유지를 위해 급여량을 조정하지 않았습니다.'
    }

    setResult({
      adjustment,
      newDailyAmount,
      percentageChange,
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
            <TrendingUp className="w-10 h-10 text-green-600 mr-3" />
            급여량 조정 계산기
          </h1>
          <p className="text-xl text-gray-600">
            체중 변화에 따른 급여량 조정을 계산합니다
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
                  value={currentWeight || ''}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 체중 (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={targetWeight || ''}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 일일 급여량 (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={currentDailyAmount || ''}
                onChange={(e) => setCurrentDailyAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
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
                  <p className="text-sm text-gray-600 mb-1">급여량 변화</p>
                  <p className={`text-3xl font-bold ${result.adjustment >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {result.adjustment >= 0 ? '+' : ''}{result.adjustment}g ({result.percentageChange >= 0 ? '+' : ''}{result.percentageChange}%)
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">새 일일 급여량</p>
                  <p className="text-3xl font-bold text-green-700">{result.newDailyAmount}g</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 급여량 조정 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 급여량 조정은 점진적으로 진행하세요 (주당 5-10%씩)</li>
            <li>• 체중 변화를 주 1회 측정하여 모니터링하세요</li>
            <li>• 급격한 급여량 변화는 소화 불량을 일으킬 수 있습니다</li>
            <li>• 체중 감량은 수의사와 상담하여 진행하세요</li>
            <li>• 체중 증가는 영양가 있는 사료를 선택하세요</li>
            <li>• 운동량도 함께 조절하여 효과를 높이세요</li>
            <li>• 목표 체중에 도달한 후 유지 급여량으로 조정하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

