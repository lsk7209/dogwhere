'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Calculator } from 'lucide-react'

export default function DailyExerciseCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [weight, setWeight] = useState<number>(0)
  const [result, setResult] = useState<{
    dailyMinutes: number
    weeklyMinutes: number
    exerciseTypes: string[]
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    let dailyMinutes = 30 // 기본값
    
    // 견종 크기별 조정
    if (breedSize === 'small') {
      dailyMinutes = 20 // 소형견은 덜 필요
    } else if (breedSize === 'large') {
      dailyMinutes = 60 // 대형견은 더 필요
    } else {
      dailyMinutes = 30 // 중형견
    }

    // 연령별 조정
    if (age === 'puppy') {
      dailyMinutes = Math.round(dailyMinutes * 0.5) // 강아지는 짧게 여러 번
    } else if (age === 'senior') {
      dailyMinutes = Math.round(dailyMinutes * 0.7) // 노령견은 조금 줄임
    }

    const weeklyMinutes = dailyMinutes * 7

    const exerciseTypes: string[] = []
    if (breedSize === 'small') {
      exerciseTypes.push('실내 놀이', '짧은 산책', '공놀이')
    } else if (breedSize === 'large') {
      exerciseTypes.push('장거리 산책', '달리기', '수영', '장난감 놀이')
    } else {
      exerciseTypes.push('산책', '공놀이', '자유 놀이')
    }

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 성장 중이므로 짧게 여러 번 운동하는 것이 좋습니다. 과도한 운동은 관절에 부담을 줄 수 있습니다.'
    } else if (age === 'senior') {
      recommendation = '노령견은 관절 건강을 고려하여 저강도 운동을 권장합니다. 무리한 운동은 피하세요.'
    } else {
      recommendation = '규칙적인 운동으로 건강을 유지하세요. 견종에 맞는 운동을 선택하세요.'
    }

    setResult({
      dailyMinutes,
      weeklyMinutes,
      exerciseTypes,
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
            <Activity className="w-10 h-10 text-green-600 mr-3" />
            일일 운동량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            견종과 연령에 따른 일일 운동량을 계산합니다
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

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 운동 시간</p>
                  <p className="text-4xl font-bold text-green-700">{result.dailyMinutes}분</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">주간 운동 시간</p>
                  <p className="text-2xl font-bold text-green-700">{result.weeklyMinutes}분</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">추천 운동 종류</p>
                  <div className="flex flex-wrap gap-2">
                    {result.exerciseTypes.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
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

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 운동량 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견: 하루 20-30분 정도의 운동이 적절합니다</li>
            <li>• 중형견: 하루 30-45분 정도의 운동이 적절합니다</li>
            <li>• 대형견: 하루 60분 이상의 운동이 필요합니다</li>
            <li>• 강아지는 짧게 여러 번 운동하는 것이 좋습니다</li>
            <li>• 노령견은 저강도 운동을 권장합니다</li>
            <li>• 견종에 맞는 운동을 선택하세요 (사냥견, 목양견 등)</li>
            <li>• 날씨와 건강 상태를 고려하여 운동량을 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

