'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pill, Calendar, ArrowLeft, Shield, AlertCircle, Clock, Check } from 'lucide-react'

export default function DewormingScheduleCalculatorPage() {
  const [lastDeworming, setLastDeworming] = useState<string>('')
  const [dewormingType, setDewormingType] = useState<string>('monthly')
  const [result, setResult] = useState<{
    nextDate: string
    daysLeft: number
    schedule: Array<{ date: string; type: string }>
  } | null>(null)

  const dewormingTypes = [
    { id: 'puppy', label: '퍼피 (2주 간격)', desc: '생후 2주~2개월' },
    { id: 'monthly', label: '심장사상충 (월 1회)', desc: '매월 정기 예방' },
    { id: 'quarterly', label: '종합구충 (3개월)', desc: '내부 기생충' }
  ]

  const calculate = () => {
    if (!lastDeworming) return

    const lastDate = new Date(lastDeworming)
    const today = new Date()

    let nextDate = new Date(lastDate)
    let intervalDays = 30

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
        type: dewormingType === 'puppy' ? '강아지 구충제' : dewormingType === 'monthly' ? '심장사상충 예방' : '종합 구충제'
      })
    }

    setResult({
      nextDate: nextDate.toISOString().split('T')[0],
      daysLeft,
      schedule
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Pill className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">구충제 투여 주기 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            잊기 쉬운 구충제 투여일, 미리 계산하고 챙겨주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                투여 정보 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">구충제 종류</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dewormingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setDewormingType(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${dewormingType === type.id
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-100 hover:border-purple-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{type.label}</div>
                        <div className="text-xs opacity-70">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마지막 투여일</label>
                  <input
                    type="date"
                    value={lastDeworming}
                    onChange={(e) => setLastDeworming(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={!lastDeworming}
                className="w-full mt-8 bg-purple-600 text-white py-4 px-6 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-5 h-5 mr-2" />
                다음 투여일 확인하기
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-purple-100 uppercase tracking-wider">다음 투여 예정일</span>
                    <div className="text-3xl font-black my-4">
                      {result.nextDate}
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      {result.daysLeft > 0 ? `${result.daysLeft}일 남음` : result.daysLeft === 0 ? '오늘입니다!' : `${Math.abs(result.daysLeft)}일 지났습니다`}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      향후 일정 미리보기
                    </h4>
                    <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {result.schedule.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="relative flex items-center pl-8">
                          <div className="absolute left-4 w-2.5 h-2.5 rounded-full bg-purple-200 border-2 border-white shadow-sm transform -translate-x-1/2"></div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm">
                            <div className="font-bold text-gray-900">{item.date}</div>
                            <div className="text-gray-500 text-xs">{item.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    마지막 투여일을 입력하고<br />계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-indigo-400" />
                  주의사항
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    심장사상충 예방은 매달 꾸준히 하는 것이 가장 중요합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    체중 변화에 따라 약 용량이 달라질 수 있으니 확인하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    투여 후 구토나 이상 반응이 없는지 관찰해주세요.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
