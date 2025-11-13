'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Calculator } from 'lucide-react'

export default function EnrichmentActivityCalculatorPage() {
  const [breedType, setBreedType] = useState<string>('average')
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    dailyActivities: number
    activityTypes: string[]
    duration: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let dailyActivities = 3 // 기본값
    let duration = 20 // 기본값 (분)
    const activityTypes: string[] = []

    // 견종별 조정
    if (breedType === 'high') {
      dailyActivities = 5
      duration = 30
      activityTypes.push('퍼즐 장난감', '숨겨진 간식 찾기', '훈련 게임', '노즈워크', '인터랙티브 장난감')
    } else if (breedType === 'low') {
      dailyActivities = 2
      duration = 15
      activityTypes.push('간단한 훈련', '촉각 놀이')
    } else {
      dailyActivities = 3
      duration = 20
      activityTypes.push('퍼즐 장난감', '숨겨진 간식 찾기', '기본 훈련')
    }

    // 연령별 조정
    if (age === 'puppy') {
      dailyActivities = 4
      duration = 15
      activityTypes.push('사회화 놀이', '기본 훈련', '퍼즐 장난감', '탐색 놀이')
    } else if (age === 'senior') {
      dailyActivities = 2
      duration = 15
      activityTypes.push('가벼운 훈련', '촉각 놀이')
    }

    let recommendation = ''
    if (breedType === 'high') {
      recommendation = '높은 지능의 견종은 다양한 정신 자극 활동이 필요합니다. 복잡한 퍼즐과 훈련 게임을 제공하세요.'
    } else if (age === 'puppy') {
      recommendation = '강아지는 다양한 경험을 통해 학습합니다. 사회화와 탐색 활동을 포함하세요.'
    } else {
      recommendation = '정기적인 정신 자극 활동으로 강아지의 정신 건강을 유지하세요.'
    }

    setResult({
      dailyActivities,
      activityTypes,
      duration,
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
            <Sparkles className="w-10 h-10 text-yellow-600 mr-3" />
            환경 풍부화 활동 계산기
          </h1>
          <p className="text-xl text-gray-600">
            정신 자극 활동 계획을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 지능 수준
                </label>
                <select
                  value={breedType}
                  onChange={(e) => setBreedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="high">높음 (보더콜리, 푸들 등)</option>
                  <option value="average">보통 (대부분의 견종)</option>
                  <option value="low">낮음 (일부 견종)</option>
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

            <button
              onClick={calculate}
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 활동 수</p>
                  <p className="text-4xl font-bold text-yellow-700">{result.dailyActivities}개</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">활동당 시간</p>
                  <p className="text-2xl font-bold text-yellow-700">{result.duration}분</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">추천 활동 종류</p>
                  <div className="flex flex-wrap gap-2">
                    {result.activityTypes.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
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

        <div className="bg-yellow-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 환경 풍부화 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 정신 자극 활동은 강아지의 정신 건강에 중요합니다</li>
            <li>• 높은 지능의 견종은 더 복잡한 활동이 필요합니다</li>
            <li>• 퍼즐 장난감과 노즈워크는 좋은 정신 자극 활동입니다</li>
            <li>• 강아지는 탐색과 학습 활동을 즐깁니다</li>
            <li>• 노령견은 가벼운 활동을 제공하세요</li>
            <li>• 다양한 활동을 제공하여 지루함을 방지하세요</li>
            <li>• 강아지의 반응을 관찰하며 활동을 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

