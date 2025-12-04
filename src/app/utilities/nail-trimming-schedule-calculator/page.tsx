'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Calendar, ArrowLeft, Activity, Info, CheckCircle, AlertCircle } from 'lucide-react'

export default function NailTrimmingScheduleCalculatorPage() {
  const [lastTrimming, setLastTrimming] = useState<string>('')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    nextDate: string
    daysLeft: number
    interval: number
    recommendation: string
    progress: number
    status: 'good' | 'warning' | 'overdue'
  } | null>(null)

  const calculate = () => {
    if (!lastTrimming) return

    const lastDate = new Date(lastTrimming)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let interval = 21 // 기본값 (3주)

    if (activityLevel === 'high') {
      interval = 28 // 활발한 활동: 4주 (자연 마모)
    } else if (activityLevel === 'low') {
      interval = 14 // 저활동: 2주 (빨리 자람)
    }

    const nextDate = new Date(lastDate)
    nextDate.setDate(nextDate.getDate() + interval)

    const diffTime = nextDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Progress calculation (0 to 100%)
    const totalDuration = interval * 24 * 60 * 60 * 1000
    const elapsed = today.getTime() - lastDate.getTime()
    let progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)

    let status: 'good' | 'warning' | 'overdue' = 'good'
    if (daysLeft < 0) {
      status = 'overdue'
      progress = 100
    } else if (daysLeft <= 3) {
      status = 'warning'
    }

    let recommendation = ''
    if (activityLevel === 'high') {
      recommendation = '산책량이 많아 발톱이 자연 마모되고 있습니다. 4주 간격으로 날카로운 부분만 다듬어주세요.'
    } else if (activityLevel === 'low') {
      recommendation = '실내 활동이 주를 이루어 발톱이 빨리 길어집니다. 2주마다 꼼꼼히 확인하고 잘라주세요.'
    } else {
      recommendation = '적당한 활동량을 보이고 있습니다. 3주 간격으로 발톱 상태를 확인하고 정리해주세요.'
    }

    setResult({
      nextDate: nextDate.toISOString().split('T')[0],
      daysLeft,
      interval,
      recommendation,
      progress,
      status
    })
  }

  const activityOptions = [
    { value: 'low', label: '적음', desc: '실내 생활 위주', icon: '🏠' },
    { value: 'normal', label: '보통', desc: '하루 1회 산책', icon: '🐕' },
    { value: 'high', label: '많음', desc: '매일 야외 활동', icon: '🏃' }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Scissors className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">발톱 관리 주기 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이의 활동량에 딱 맞는 발톱 관리 시기를 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-pink-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마지막 관리일</label>
                  <input
                    type="date"
                    value={lastTrimming}
                    onChange={(e) => setLastTrimming(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">평소 활동량</label>
                  <div className="grid grid-cols-3 gap-3">
                    {activityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setActivityLevel(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${activityLevel === option.value
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-100 hover:border-pink-200 text-gray-600'
                          }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-bold mb-1">{option.label}</div>
                        <div className="text-xs opacity-70">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={!lastTrimming}
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  다음 관리일 확인하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
                  <div className={`p-8 text-center text-white bg-gradient-to-br ${result.status === 'overdue' ? 'from-red-500 to-red-600' :
                      result.status === 'warning' ? 'from-orange-500 to-orange-600' :
                        'from-pink-500 to-rose-500'
                    }`}>
                    <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">다음 관리 예정일</span>
                    <div className="text-3xl font-black my-4">{result.nextDate}</div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      {result.status === 'overdue' ? `예정일 ${Math.abs(result.daysLeft)}일 지남` :
                        result.daysLeft === 0 ? '오늘입니다!' :
                          `${result.daysLeft}일 남음`}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>관리 주기 진행률</span>
                        <span className="font-bold text-pink-600">{Math.round(result.progress)}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${result.status === 'overdue' ? 'bg-red-500' :
                              result.status === 'warning' ? 'bg-orange-500' :
                                'bg-pink-500'
                            }`}
                          style={{ width: `${result.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-pink-600" />
                        <span className="font-bold text-gray-900">맞춤 조언</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Scissors className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    마지막 관리일을 입력하면<br />다음 일정을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-rose-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
                  발톱 관리 상식
                </h3>
                <ul className="space-y-3 text-rose-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    발톱이 바닥에 닿아 '탁탁' 소리가 나면 잘라주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    혈관(퀵)을 건드리지 않도록 조금씩 잘라주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    산책을 자주 하면 자연스럽게 갈려 관리가 편해집니다.
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
