'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, Calculator } from 'lucide-react'

export default function LearningAbilityCalculatorPage() {
  const [breedType, setBreedType] = useState<string>('average')
  const [age, setAge] = useState<string>('puppy')
  const [trainingSessions, setTrainingSessions] = useState<number>(0)
  const [successfulCommands, setSuccessfulCommands] = useState<number>(0)
  const [result, setResult] = useState<{
    learningSpeed: number
    abilityLevel: string
    estimatedTime: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (trainingSessions <= 0 || successfulCommands < 0) return

    // 견종별 학습 능력 계수
    let breedFactor = 1.0
    if (breedType === 'high') {
      breedFactor = 1.5 // 높은 학습 능력 (보더콜리, 푸들 등)
    } else if (breedType === 'low') {
      breedFactor = 0.7 // 낮은 학습 능력 (일부 하운드 등)
    }

    // 연령별 학습 능력 계수
    let ageFactor = 1.0
    if (age === 'puppy') {
      ageFactor = 1.3 // 강아지는 학습 능력이 높음
    } else if (age === 'senior') {
      ageFactor = 0.8 // 노령견은 학습 능력이 낮아짐
    }

    const successRate = (successfulCommands / trainingSessions) * 100
    const learningSpeed = Math.round(successRate * breedFactor * ageFactor * 10) / 10

    let abilityLevel = ''
    let estimatedTime = 0
    let recommendation = ''

    if (learningSpeed >= 80) {
      abilityLevel = '매우 높음'
      estimatedTime = 1
      recommendation = '학습 능력이 매우 뛰어납니다! 복잡한 명령어도 빠르게 배울 수 있습니다.'
    } else if (learningSpeed >= 60) {
      abilityLevel = '높음'
      estimatedTime = 2
      recommendation = '학습 능력이 높습니다. 새로운 명령어를 빠르게 배울 수 있습니다.'
    } else if (learningSpeed >= 40) {
      abilityLevel = '보통'
      estimatedTime = 3
      recommendation = '학습 능력이 보통입니다. 꾸준한 훈련으로 개선할 수 있습니다.'
    } else if (learningSpeed >= 20) {
      abilityLevel = '낮음'
      estimatedTime = 5
      recommendation = '학습 능력이 낮습니다. 인내심을 가지고 반복 훈련하세요.'
    } else {
      abilityLevel = '매우 낮음'
      estimatedTime = 7
      recommendation = '학습 능력이 매우 낮습니다. 전문가와 상담하여 훈련 방법을 조정하세요.'
    }

    setResult({
      learningSpeed,
      abilityLevel,
      estimatedTime,
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
            <Brain className="w-10 h-10 text-purple-600 mr-3" />
            학습 능력 계산기
          </h1>
          <p className="text-xl text-gray-600">
            강아지의 학습 능력과 속도를 평가합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 학습 능력
                </label>
                <select
                  value={breedType}
                  onChange={(e) => setBreedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="high">높음 (보더콜리, 푸들 등)</option>
                  <option value="average">보통 (대부분의 견종)</option>
                  <option value="low">낮음 (일부 하운드 등)</option>
                </select>
              </div>

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
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  훈련 세션 수
                </label>
                <input
                  type="number"
                  min="0"
                  value={trainingSessions || ''}
                  onChange={(e) => setTrainingSessions(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성공한 명령어 수
                </label>
                <input
                  type="number"
                  min="0"
                  value={successfulCommands || ''}
                  onChange={(e) => setSuccessfulCommands(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              평가하기
            </button>

            {result && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">학습 속도 점수</p>
                  <p className="text-4xl font-bold text-purple-700">{result.learningSpeed}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">학습 능력 수준</p>
                  <p className="text-2xl font-bold text-purple-700">{result.abilityLevel}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예상 학습 시간</p>
                  <p className="text-2xl font-bold text-purple-700">{result.estimatedTime}주</p>
                  <p className="text-xs text-gray-500 mt-1">새 명령어 하나를 배우는 데 걸리는 시간</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 학습 능력 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 성장기이므로 학습 능력이 높습니다</li>
            <li>• 견종별로 학습 능력에 차이가 있습니다</li>
            <li>• 개별 강아지의 학습 속도는 다를 수 있습니다</li>
            <li>• 짧고 자주 훈련하는 것이 효과적입니다</li>
            <li>• 긍정적 강화를 사용하여 학습 동기를 높이세요</li>
            <li>• 학습 능력이 낮아도 인내심을 가지고 훈련하세요</li>
            <li>• 강아지의 페이스에 맞춰 훈련하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

