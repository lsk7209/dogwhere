'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Calculator } from 'lucide-react'

export default function TrainingEffectCalculatorPage() {
  const [beforeScore, setBeforeScore] = useState<number>(0)
  const [afterScore, setAfterScore] = useState<number>(0)
  const [trainingWeeks, setTrainingWeeks] = useState<number>(0)
  const [result, setResult] = useState<{
    improvement: number
    improvementPercent: number
    weeklyProgress: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (beforeScore < 0 || afterScore < 0 || beforeScore > 100 || afterScore > 100) return
    if (trainingWeeks <= 0) return

    const improvement = afterScore - beforeScore
    const improvementPercent = beforeScore > 0 
      ? Math.round((improvement / beforeScore) * 100 * 10) / 10 
      : 0
    const weeklyProgress = Math.round((improvement / trainingWeeks) * 10) / 10

    let recommendation = ''
    if (improvementPercent >= 50) {
      recommendation = '훈련 효과가 매우 뛰어납니다! 현재 방법을 계속 유지하세요.'
    } else if (improvementPercent >= 25) {
      recommendation = '훈련 효과가 좋습니다. 현재 방법을 계속하되, 더 개선할 부분을 찾아보세요.'
    } else if (improvementPercent >= 10) {
      recommendation = '훈련 효과가 있습니다. 훈련 방법을 조정하거나 시간을 늘려보세요.'
    } else if (improvementPercent > 0) {
      recommendation = '약간의 개선이 있습니다. 훈련 방법을 재검토하고 전문가와 상담하세요.'
    } else {
      recommendation = '개선이 없거나 악화되었습니다. 훈련 방법을 변경하거나 전문가와 상담하세요.'
    }

    setResult({
      improvement,
      improvementPercent,
      weeklyProgress,
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
            훈련 효과 계산기
          </h1>
          <p className="text-xl text-gray-600">
            훈련의 효과와 개선도를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  훈련 전 점수 (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={beforeScore || ''}
                  onChange={(e) => setBeforeScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  훈련 후 점수 (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={afterScore || ''}
                  onChange={(e) => setAfterScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  훈련 기간 (주)
                </label>
                <input
                  type="number"
                  min="1"
                  value={trainingWeeks || ''}
                  onChange={(e) => setTrainingWeeks(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
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
                  <p className="text-sm text-gray-600 mb-1">개선도</p>
                  <p className={`text-4xl font-bold ${
                    result.improvement >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.improvement >= 0 ? '+' : ''}{result.improvement}점
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ({result.improvementPercent >= 0 ? '+' : ''}{result.improvementPercent}%)
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">주간 평균 개선도</p>
                  <p className="text-2xl font-bold text-green-700">
                    {result.weeklyProgress >= 0 ? '+' : ''}{result.weeklyProgress}점/주
                  </p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 훈련 효과 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 훈련 효과는 점수로 측정하여 객관적으로 평가하세요</li>
            <li>• 정기적으로 점수를 측정하여 훈련 효과를 모니터링하세요</li>
            <li>• 개선이 없으면 훈련 방법을 변경하거나 전문가와 상담하세요</li>
            <li>• 긍정적 강화와 일관된 훈련이 효과적입니다</li>
            <li>• 훈련 효과는 시간이 걸리므로 인내심을 가지세요</li>
            <li>• 강아지의 개별 차이를 고려하여 평가하세요</li>
            <li>• 작은 개선도 축하하고 격려하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

