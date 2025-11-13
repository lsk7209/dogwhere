'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gamepad2, Calculator } from 'lucide-react'

export default function PlaytimeDurationCalculatorPage() {
  const [age, setAge] = useState<string>('adult')
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [result, setResult] = useState<{
    dailyPlaytime: number
    sessionDuration: number
    sessionsPerDay: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let dailyPlaytime = 60 // 기본값 (분)
    
    // 연령별 조정
    if (age === 'puppy') {
      dailyPlaytime = 30 // 강아지는 짧게 여러 번
    } else if (age === 'senior') {
      dailyPlaytime = 30 // 노령견도 짧게
    } else {
      dailyPlaytime = 60 // 성견
    }

    // 견종 크기별 조정
    if (breedSize === 'small') {
      dailyPlaytime = Math.round(dailyPlaytime * 0.7) // 소형견은 덜 필요
    } else if (breedSize === 'large') {
      dailyPlaytime = Math.round(dailyPlaytime * 1.3) // 대형견은 더 필요
    }

    const sessionDuration = age === 'puppy' ? 10 : age === 'senior' ? 15 : 20
    const sessionsPerDay = Math.ceil(dailyPlaytime / sessionDuration)

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 짧게 여러 번 놀이하는 것이 좋습니다. 피로를 주지 않도록 주의하세요.'
    } else if (age === 'senior') {
      recommendation = '노령견은 가벼운 놀이를 짧게 즐기는 것이 좋습니다.'
    } else {
      recommendation = '규칙적인 놀이 시간을 유지하여 정신적, 신체적 건강을 유지하세요.'
    }

    setResult({
      dailyPlaytime,
      sessionDuration,
      sessionsPerDay,
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
            <Gamepad2 className="w-10 h-10 text-pink-600 mr-3" />
            놀이 시간 계산기
          </h1>
          <p className="text-xl text-gray-600">
            적정 놀이 시간을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>

            <button
              onClick={calculate}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 놀이 시간</p>
                  <p className="text-4xl font-bold text-pink-700">{result.dailyPlaytime}분</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">세션당 시간</p>
                    <p className="text-2xl font-bold text-pink-700">{result.sessionDuration}분</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">일일 세션 수</p>
                    <p className="text-2xl font-bold text-pink-700">{result.sessionsPerDay}회</p>
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

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 놀이 시간 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 짧게 여러 번 놀이하는 것이 좋습니다</li>
            <li>• 성견은 하루 60분 정도의 놀이가 적절합니다</li>
            <li>• 노령견은 가벼운 놀이를 짧게 즐기는 것이 좋습니다</li>
            <li>• 대형견은 더 많은 놀이 시간이 필요합니다</li>
            <li>• 정신 자극 놀이와 신체 활동을 균형있게 제공하세요</li>
            <li>• 강아지의 상태를 관찰하며 놀이 시간을 조절하세요</li>
            <li>• 규칙적인 놀이 시간을 유지하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

