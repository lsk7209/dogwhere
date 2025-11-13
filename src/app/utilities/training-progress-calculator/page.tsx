'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, Calculator } from 'lucide-react'

export default function TrainingProgressCalculatorPage() {
  const [totalCommands, setTotalCommands] = useState<number>(0)
  const [masteredCommands, setMasteredCommands] = useState<number>(0)
  const [trainingDays, setTrainingDays] = useState<number>(0)
  const [result, setResult] = useState<{
    progress: number
    successRate: number
    dailyProgress: number
    estimatedCompletion: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (totalCommands <= 0 || masteredCommands < 0 || trainingDays < 0) return
    if (masteredCommands > totalCommands) return

    const progress = Math.round((masteredCommands / totalCommands) * 100)
    const successRate = trainingDays > 0 ? Math.round((masteredCommands / trainingDays) * 100 * 10) / 10 : 0
    const dailyProgress = trainingDays > 0 ? Math.round((masteredCommands / trainingDays) * 100) / 100 : 0
    const remainingCommands = totalCommands - masteredCommands
    const estimatedCompletion = dailyProgress > 0 ? Math.ceil(remainingCommands / dailyProgress) : 0

    let recommendation = ''
    if (progress >= 80) {
      recommendation = '훈련이 거의 완료되었습니다! 마지막 명령어들을 완성하세요.'
    } else if (progress >= 50) {
      recommendation = '훈련이 잘 진행되고 있습니다. 꾸준히 연습하세요.'
    } else if (progress >= 25) {
      recommendation = '훈련이 진행 중입니다. 인내심을 가지고 계속하세요.'
    } else {
      recommendation = '훈련 초기 단계입니다. 기본 명령어부터 차근차근 시작하세요.'
    }

    setResult({
      progress,
      successRate,
      dailyProgress,
      estimatedCompletion,
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
            <Target className="w-10 h-10 text-orange-600 mr-3" />
            훈련 진도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            훈련 진도와 다음 단계를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전체 명령어 수
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalCommands || ''}
                  onChange={(e) => setTotalCommands(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  완료한 명령어 수
                </label>
                <input
                  type="number"
                  min="0"
                  value={masteredCommands || ''}
                  onChange={(e) => setMasteredCommands(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  훈련 일수
                </label>
                <input
                  type="number"
                  min="0"
                  value={trainingDays || ''}
                  onChange={(e) => setTrainingDays(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
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
                  <p className="text-sm text-gray-600 mb-1">훈련 진도</p>
                  <p className="text-4xl font-bold text-orange-700">{result.progress}%</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-600 h-3 rounded-full transition-all"
                      style={{ width: `${result.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">성공률</p>
                    <p className="text-2xl font-bold text-orange-700">{result.successRate}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">일일 진도</p>
                    <p className="text-2xl font-bold text-orange-700">{result.dailyProgress}개/일</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">예상 완료일</p>
                    <p className="text-2xl font-bold text-orange-700">{result.estimatedCompletion}일 후</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 훈련 진도 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 기본 명령어(앉아, 기다려, 불러오기)부터 시작하세요</li>
            <li>• 하루에 1-2개 명령어씩 차근차근 훈련하세요</li>
            <li>• 각 명령어를 완전히 익힌 후 다음으로 넘어가세요</li>
            <li>• 짧고 자주 훈련하는 것이 효과적입니다</li>
            <li>• 긍정적 강화(보상)를 사용하세요</li>
            <li>• 훈련 진도를 기록하여 모니터링하세요</li>
            <li>• 인내심을 가지고 꾸준히 훈련하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

