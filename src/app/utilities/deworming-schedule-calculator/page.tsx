'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pill, Calendar } from 'lucide-react'

export default function DewormingScheduleCalculatorPage() {
  const [lastDeworming, setLastDeworming] = useState<string>('')
  const [dewormingType, setDewormingType] = useState<string>('monthly')
  const [result, setResult] = useState<{
    nextDate: string
    daysLeft: number
    schedule: Array<{ date: string; type: string }>
  } | null>(null)

  const calculate = () => {
    if (!lastDeworming) return

    const lastDate = new Date(lastDeworming)
    const today = new Date()
    
    let nextDate = new Date(lastDate)
    let intervalDays = 30 // 기본값 (월간)

    if (dewormingType === 'monthly') {
      intervalDays = 30
      nextDate.setDate(nextDate.getDate() + 30)
    } else if (dewormingType === 'quarterly') {
      intervalDays = 90
      nextDate.setDate(nextDate.getDate() + 90)
    } else if (dewormingType === 'puppy') {
      intervalDays = 14
      nextDate.setDate(nextDate.getDate() + 14)
    }

    const daysLeft = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // 향후 6개월 일정 생성
    const schedule = []
    let currentDate = new Date(lastDate)
    for (let i = 0; i < 6; i++) {
      currentDate.setDate(currentDate.getDate() + intervalDays)
      schedule.push({
        date: currentDate.toISOString().split('T')[0],
        type: dewormingType === 'puppy' ? '강아지 구충제' : dewormingType === 'monthly' ? '월간 구충제' : '분기별 구충제'
      })
    }

    setResult({
      nextDate: nextDate.toISOString().split('T')[0],
      daysLeft,
      schedule
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
            <Pill className="w-10 h-10 text-purple-600 mr-3" />
            구충제 투여 주기 계산기
          </h1>
          <p className="text-xl text-gray-600">
            구충제 투여 주기와 다음 투여일을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마지막 구충제 투여일
                </label>
                <input
                  type="date"
                  value={lastDeworming}
                  onChange={(e) => setLastDeworming(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  구충제 종류
                </label>
                <select
                  value={dewormingType}
                  onChange={(e) => setDewormingType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="puppy">강아지 구충제 (2주마다)</option>
                  <option value="monthly">월간 구충제 (1개월마다)</option>
                  <option value="quarterly">분기별 구충제 (3개월마다)</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">다음 구충제 투여일</p>
                      <p className="text-2xl font-bold text-purple-700">{result.nextDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">남은 일수</p>
                      <p className="text-2xl font-bold text-purple-700">{result.daysLeft}일</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">향후 6개월 일정</h3>
                  <div className="space-y-2">
                    {result.schedule.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">{item.type}</span>
                        <span className="text-purple-700 font-semibold">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 구충제 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 생후 2주부터 2주마다 구충제를 투여합니다</li>
            <li>• 성견은 일반적으로 1개월마다 구충제를 투여합니다</li>
            <li>• 실외 활동이 많은 강아지는 더 자주 구충제가 필요할 수 있습니다</li>
            <li>• 내부 기생충과 외부 기생충(벼룩, 진드기) 모두 예방하세요</li>
            <li>• 구충제는 수의사와 상담하여 적절한 제품을 선택하세요</li>
            <li>• 구충제 투여 후 이상 반응이 있으면 즉시 수의사에게 연락하세요</li>
            <li>• 정기적인 구충제 투여로 기생충 감염을 예방하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

