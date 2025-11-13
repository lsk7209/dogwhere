'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Calendar } from 'lucide-react'

export default function NailTrimmingScheduleCalculatorPage() {
  const [lastTrimming, setLastTrimming] = useState<string>('')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    nextDate: string
    daysLeft: number
    interval: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (!lastTrimming) return

    const lastDate = new Date(lastTrimming)
    const today = new Date()
    
    let interval = 21 // 기본값 (3주)
    
    if (activityLevel === 'high') {
      interval = 28 // 활발한 활동: 4주
    } else if (activityLevel === 'low') {
      interval = 14 // 저활동: 2주
    } else {
      interval = 21 // 일반 활동: 3주
    }

    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + interval)
    
    const daysLeft = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let recommendation = ''
    if (activityLevel === 'high') {
      recommendation = '활발한 활동으로 발톱이 자연스럽게 마모되므로 4주마다 자르면 됩니다.'
    } else if (activityLevel === 'low') {
      recommendation = '저활동으로 발톱이 빨리 자라므로 2주마다 자르는 것이 좋습니다.'
    } else {
      recommendation = '일반 활동 수준이므로 3주마다 발톱을 자르는 것이 적절합니다.'
    }

    setResult({
      nextDate: nextDate.toISOString().split('T')[0],
      daysLeft,
      interval,
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
            <Scissors className="w-10 h-10 text-pink-600 mr-3" />
            발톱 자르기 주기 계산기
          </h1>
          <p className="text-xl text-gray-600">
            발톱 자르기 주기와 다음 시기를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마지막 발톱 자르기 날짜
                </label>
                <input
                  type="date"
                  value={lastTrimming}
                  onChange={(e) => setLastTrimming(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  활동 수준
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">저활동 (실내 위주)</option>
                  <option value="normal">일반 활동 (일반적인 산책)</option>
                  <option value="high">고활동 (매일 장시간 운동)</option>
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
                  <p className="text-sm text-gray-600 mb-1">다음 발톱 자르기 날짜</p>
                  <p className="text-3xl font-bold text-pink-700">{result.nextDate}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">남은 일수</p>
                  <p className="text-2xl font-bold text-pink-700">{result.daysLeft}일</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">권장 주기</p>
                  <p className="text-2xl font-bold text-pink-700">{result.interval}일마다</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 발톱 관리 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 발톱이 너무 길면 걸을 때 불편하고 관절에 부담을 줍니다</li>
            <li>• 발톱이 바닥에 닿으면 자를 시기입니다</li>
            <li>• 활발한 활동을 하는 강아지는 발톱이 자연스럽게 마모됩니다</li>
            <li>• 실내 위주 강아지는 발톱이 빨리 자라므로 더 자주 자르세요</li>
            <li>• 발톱을 자를 때는 혈관(퀵)을 피해야 합니다</li>
            <li>• 검은 발톱은 혈관 위치를 확인하기 어려우므로 조심하세요</li>
            <li>• 발톱 자르기가 어렵다면 전문가에게 맡기세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

