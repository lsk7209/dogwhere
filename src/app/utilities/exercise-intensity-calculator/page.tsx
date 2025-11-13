'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gauge, Calculator } from 'lucide-react'

export default function ExerciseIntensityCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [currentIntensity, setCurrentIntensity] = useState<string>('moderate')
  const [result, setResult] = useState<{
    recommendedIntensity: string
    intensityLevel: number
    activities: string[]
    warning: string
  } | null>(null)

  const calculate = () => {
    let intensityLevel = 5 // 기본값 (중간 강도)
    let recommendedIntensity = '중간 강도'
    let activities: string[] = []
    let warning = ''

    // 견종 크기별 조정
    if (breedSize === 'small') {
      intensityLevel = 4
      recommendedIntensity = '낮은-중간 강도'
      activities = ['실내 놀이', '짧은 산책', '공놀이']
    } else if (breedSize === 'large') {
      intensityLevel = 6
      recommendedIntensity = '중간-높은 강도'
      activities = ['장거리 산책', '달리기', '수영', '장난감 놀이']
    } else {
      intensityLevel = 5
      recommendedIntensity = '중간 강도'
      activities = ['산책', '공놀이', '자유 놀이']
    }

    // 연령별 조정
    if (age === 'puppy') {
      intensityLevel = 3
      recommendedIntensity = '낮은 강도'
      activities = ['짧은 산책', '실내 놀이', '기본 훈련']
      warning = '강아지는 성장 중이므로 과도한 운동은 관절에 부담을 줄 수 있습니다.'
    } else if (age === 'senior') {
      intensityLevel = 3
      recommendedIntensity = '낮은 강도'
      activities = ['천천히 걷기', '가벼운 놀이', '스트레칭']
      warning = '노령견은 관절 건강을 고려하여 저강도 운동을 권장합니다.'
    }

    // 현재 강도와 비교
    const currentLevel = currentIntensity === 'low' ? 3 : currentIntensity === 'moderate' ? 5 : 7
    if (currentLevel > intensityLevel + 1) {
      warning += ' 현재 운동 강도가 권장보다 높습니다. 강도를 낮추는 것을 권장합니다.'
    } else if (currentLevel < intensityLevel - 1) {
      warning += ' 현재 운동 강도가 권장보다 낮습니다. 점진적으로 강도를 높이세요.'
    }

    setResult({
      recommendedIntensity,
      intensityLevel,
      activities,
      warning: warning || '현재 운동 강도가 적절합니다.'
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
            <Gauge className="w-10 h-10 text-indigo-600 mr-3" />
            운동 강도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            현재 운동 강도와 적정 강도를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 운동 강도
              </label>
              <select
                value={currentIntensity}
                onChange={(e) => setCurrentIntensity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="low">낮은 강도 (가벼운 산책)</option>
                <option value="moderate">중간 강도 (일반 산책, 놀이)</option>
                <option value="high">높은 강도 (달리기, 격렬한 놀이)</option>
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
                  <p className="text-sm text-gray-600 mb-1">권장 운동 강도</p>
                  <p className="text-3xl font-bold text-indigo-700">{result.recommendedIntensity}</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full"
                      style={{ width: `${(result.intensityLevel / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">강도 레벨: {result.intensityLevel}/10</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">추천 활동</p>
                  <div className="flex flex-wrap gap-2">
                    {result.activities.map((activity, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">주의사항</p>
                  <p className="text-gray-700">{result.warning}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 운동 강도 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 낮은 강도 (1-3): 가벼운 산책, 실내 놀이</li>
            <li>• 중간 강도 (4-6): 일반 산책, 공놀이, 자유 놀이</li>
            <li>• 높은 강도 (7-10): 달리기, 격렬한 놀이, 수영</li>
            <li>• 강아지는 낮은 강도 운동을 권장합니다</li>
            <li>• 노령견은 낮은 강도 운동을 권장합니다</li>
            <li>• 대형견은 중간-높은 강도 운동이 필요합니다</li>
            <li>• 강아지의 상태를 관찰하며 운동 강도를 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

