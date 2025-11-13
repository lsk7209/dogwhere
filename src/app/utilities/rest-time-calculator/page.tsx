'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Moon, Calculator } from 'lucide-react'

export default function RestTimeCalculatorPage() {
  const [age, setAge] = useState<string>('adult')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailySleep: number
    napTimes: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let dailySleep = 12 // 기본값 (시간)
    
    // 연령별 조정
    if (age === 'puppy') {
      dailySleep = 18 // 강아지는 더 많이 잠
    } else if (age === 'senior') {
      dailySleep = 14 // 노령견도 더 많이 잠
    } else {
      dailySleep = 12 // 성견
    }

    // 활동량 조정
    if (activityLevel === 'high') {
      dailySleep += 2 // 고활동 강아지는 더 많이 잠
    } else if (activityLevel === 'low') {
      dailySleep -= 1 // 저활동 강아지는 조금 덜 잠
    }

    const napTimes = Math.ceil(dailySleep / 3) // 대략 3시간마다 낮잠

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 성장을 위해 하루 18-20시간을 자야 합니다. 충분한 휴식 공간을 제공하세요.'
    } else if (age === 'senior') {
      recommendation = '노령견은 하루 14-16시간의 수면이 필요합니다. 편안한 휴식 공간을 제공하세요.'
    } else {
      recommendation = '성견은 하루 12-14시간의 수면이 필요합니다. 규칙적인 수면 패턴을 유지하세요.'
    }

    setResult({
      dailySleep,
      napTimes,
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
            <Moon className="w-10 h-10 text-indigo-600 mr-3" />
            수면 시간 계산기
          </h1>
          <p className="text-xl text-gray-600">
            적정 수면 시간을 계산합니다
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
                  활동량
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">저활동</option>
                  <option value="normal">일반 활동</option>
                  <option value="high">고활동</option>
                </select>
              </div>
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
                  <p className="text-sm text-gray-600 mb-1">일일 수면 시간</p>
                  <p className="text-4xl font-bold text-indigo-700">{result.dailySleep}시간</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">예상 낮잠 횟수</p>
                  <p className="text-2xl font-bold text-indigo-700">{result.napTimes}회</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 수면 시간 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지: 하루 18-20시간 수면 필요</li>
            <li>• 성견: 하루 12-14시간 수면 필요</li>
            <li>• 노령견: 하루 14-16시간 수면 필요</li>
            <li>• 활발한 활동을 하는 강아지는 더 많은 수면이 필요합니다</li>
            <li>• 편안하고 조용한 휴식 공간을 제공하세요</li>
            <li>• 규칙적인 수면 패턴을 유지하세요</li>
            <li>• 수면 부족은 건강 문제를 일으킬 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

