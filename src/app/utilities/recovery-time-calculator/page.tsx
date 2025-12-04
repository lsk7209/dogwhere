'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Calculator, ArrowLeft, BatteryCharging, Zap, Activity, Thermometer, Moon, Coffee } from 'lucide-react'

export default function RecoveryTimeCalculatorPage() {
  const [exerciseDuration, setExerciseDuration] = useState<number>(30)
  const [exerciseIntensity, setExerciseIntensity] = useState<string>('moderate')
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    recoveryHours: number
    recommendation: string
    activities: string[]
  } | null>(null)

  const calculate = () => {
    if (exerciseDuration <= 0) return

    let factor = 0.5 // moderate
    if (exerciseIntensity === 'low') factor = 0.2
    else if (exerciseIntensity === 'high') factor = 1.0
    else if (exerciseIntensity === 'veryHigh') factor = 1.5

    let recoveryHours = exerciseDuration * factor / 60 // minutes to hours base

    // Minimum recovery base
    if (exerciseIntensity === 'high') recoveryHours = Math.max(recoveryHours, 12)
    if (exerciseIntensity === 'veryHigh') recoveryHours = Math.max(recoveryHours, 24)

    // Age adjustment
    if (age === 'puppy') recoveryHours *= 1.5
    else if (age === 'senior') recoveryHours *= 2.0

    recoveryHours = Math.round(recoveryHours * 10) / 10

    let recommendation = ''
    let activities: string[] = []

    if (recoveryHours < 6) {
      recommendation = '가벼운 피로가 예상됩니다. 충분한 수분 섭취 후 평소처럼 활동해도 좋습니다.'
      activities = ['가벼운 산책', '노즈워크', '터그 놀이']
    } else if (recoveryHours < 24) {
      recommendation = '근육의 휴식이 필요합니다. 격한 운동은 피하고 편안하게 쉬게 해주세요.'
      activities = ['마사지', '낮잠', '가벼운 실내 놀이']
    } else {
      recommendation = '완전한 회복이 필요합니다. 오늘은 푹 쉬게 하고 내일 상태를 체크해주세요.'
      activities = ['온찜질', '충분한 수면', '영양식 급여']
    }

    setResult({
      recoveryHours,
      recommendation,
      activities
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <BatteryCharging className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">회복 시간 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            신나게 뛰어논 우리 아이, 얼마나 쉬어야 다시 충전될까요?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                활동 정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">운동 시간</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="10"
                      max="180"
                      step="10"
                      value={exerciseDuration}
                      onChange={(e) => setExerciseDuration(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="font-bold text-blue-600 w-20 text-right">{exerciseDuration}분</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">운동 강도</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'low', label: '낮음', icon: Coffee },
                      { id: 'moderate', label: '보통', icon: Activity },
                      { id: 'high', label: '높음', icon: Zap },
                      { id: 'veryHigh', label: '매우 높음', icon: Thermometer }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setExerciseIntensity(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${exerciseIntensity === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="font-bold text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'puppy', label: '퍼피' },
                      { id: 'adult', label: '성견' },
                      { id: 'senior', label: '시니어' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAge(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${age === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        <span className="font-bold text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-lg flex items-center justify-center"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  회복 시간 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">권장 휴식 시간</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.recoveryHours}
                      <span className="text-xl ml-1 font-medium text-blue-200 mb-2">시간</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-gray-900">회복 가이드</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                        <Coffee className="w-4 h-4 mr-2 text-blue-500" />
                        추천 휴식 활동
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.activities.map((activity, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <BatteryCharging className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    운동량과 강도를 입력하면<br />필요한 휴식 시간을 알려드립니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
