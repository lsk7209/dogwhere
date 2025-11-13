'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Calculator } from 'lucide-react'

export default function RecoveryTimeCalculatorPage() {
  const [exerciseDuration, setExerciseDuration] = useState<number>(0)
  const [exerciseIntensity, setExerciseIntensity] = useState<string>('moderate')
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    recoveryHours: number
    recoveryDays: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (exerciseDuration <= 0) return

    let recoveryHours = exerciseDuration * 0.5 // 기본값 (운동 시간의 0.5배)
    
    // 운동 강도별 조정
    if (exerciseIntensity === 'low') {
      recoveryHours = exerciseDuration * 0.3
    } else if (exerciseIntensity === 'high') {
      recoveryHours = exerciseDuration * 1.0
    } else if (exerciseIntensity === 'veryHigh') {
      recoveryHours = exerciseDuration * 1.5
    }

    // 연령별 조정
    if (age === 'puppy') {
      recoveryHours *= 1.5 // 강아지는 더 긴 회복 시간 필요
    } else if (age === 'senior') {
      recoveryHours *= 2.0 // 노령견은 더 긴 회복 시간 필요
    }

    const recoveryDays = Math.ceil(recoveryHours / 24)

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 성장 중이므로 충분한 휴식이 필요합니다. 회복 시간 동안은 가벼운 활동만 하세요.'
    } else if (age === 'senior') {
      recommendation = '노령견은 회복 시간이 더 필요합니다. 충분한 휴식과 수분 섭취를 권장합니다.'
    } else {
      recommendation = '운동 후 충분한 휴식을 취하세요. 수분 섭취와 영양 보충이 중요합니다.'
    }

    setResult({
      recoveryHours: Math.round(recoveryHours * 10) / 10,
      recoveryDays,
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
            <Clock className="w-10 h-10 text-teal-600 mr-3" />
            회복 시간 계산기
          </h1>
          <p className="text-xl text-gray-600">
            운동 후 필요한 회복 시간을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  운동 시간 (분)
                </label>
                <input
                  type="number"
                  min="0"
                  value={exerciseDuration || ''}
                  onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  운동 강도
                </label>
                <select
                  value={exerciseIntensity}
                  onChange={(e) => setExerciseIntensity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">낮은 강도</option>
                  <option value="moderate">중간 강도</option>
                  <option value="high">높은 강도</option>
                  <option value="veryHigh">매우 높은 강도</option>
                </select>
              </div>
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

            <button
              onClick={calculate}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">권장 회복 시간</p>
                  <p className="text-4xl font-bold text-teal-700">{result.recoveryHours}시간</p>
                  <p className="text-sm text-gray-500 mt-1">약 {result.recoveryDays}일</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 회복 시간 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 낮은 강도 운동: 운동 시간의 0.3배 정도 회복 시간 필요</li>
            <li>• 중간 강도 운동: 운동 시간의 0.5배 정도 회복 시간 필요</li>
            <li>• 높은 강도 운동: 운동 시간의 1.0배 정도 회복 시간 필요</li>
            <li>• 매우 높은 강도 운동: 운동 시간의 1.5배 정도 회복 시간 필요</li>
            <li>• 강아지는 성장 중이므로 더 긴 회복 시간이 필요합니다</li>
            <li>• 노령견은 관절 건강을 위해 더 긴 회복 시간이 필요합니다</li>
            <li>• 회복 시간 동안은 가벼운 활동만 하고 충분한 휴식을 취하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

