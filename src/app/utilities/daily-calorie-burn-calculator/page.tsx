'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Flame, ArrowLeft, Dumbbell, Info, Battery, Zap } from 'lucide-react'

export default function DailyCalorieBurnCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activityLevel, setActivityLevel] = useState<string>('moderate')
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(0)
  const [result, setResult] = useState<{
    bmr: number
    dailyBurn: number
    exerciseBurn: number
    totalBurn: number
  } | null>(null)

  const activityLevels = [
    { id: 'sedentary', label: '활동 적음', desc: '실내 생활 위주, 짧은 산책', factor: 1.2 },
    { id: 'light', label: '가벼운 활동', desc: '주 1-3일 가벼운 산책', factor: 1.375 },
    { id: 'moderate', label: '보통 활동', desc: '주 3-5일 규칙적인 산책', factor: 1.55 },
    { id: 'active', label: '활동적', desc: '주 6-7일 활발한 운동', factor: 1.725 },
    { id: 'veryActive', label: '매우 활동적', desc: '매일 장시간 고강도 운동', factor: 1.9 }
  ]

  const calculate = () => {
    if (weight <= 0) return

    // 기초대사량(BMR) 계산: 70 * 체중(kg)^0.75
    const bmr = Math.round(70 * Math.pow(weight, 0.75))

    const selectedActivity = activityLevels.find(a => a.id === activityLevel)
    const factor = selectedActivity ? selectedActivity.factor : 1.55

    const dailyBurn = Math.round(bmr * factor)

    // 운동 칼로리 소모량 (체중 1kg당 분당 약 0.1kcal - 대략적인 추정치)
    const exerciseBurn = Math.round(weight * exerciseMinutes * 0.1)

    const totalBurn = dailyBurn + exerciseBurn

    setResult({
      bmr,
      dailyBurn,
      exerciseBurn,
      totalBurn
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Flame className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">일일 칼로리 소모량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 활동량에 따른 에너지 소비량을 정확하게 계산해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-500" />
                활동 정보 입력
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={weight || ''}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="0.0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">추가 운동 시간 (분)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={exerciseMinutes || ''}
                        onChange={(e) => setExerciseMinutes(parseInt(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">분</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">평소 활동 수준</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activityLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setActivityLevel(level.id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${activityLevel === level.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-100 hover:border-orange-200 bg-white'
                          }`}
                      >
                        <div className={`font-bold mb-1 ${activityLevel === level.id ? 'text-orange-700' : 'text-gray-900'}`}>
                          {level.label}
                        </div>
                        <div className="text-xs text-gray-500">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={!weight}
                className="w-full mt-8 bg-orange-600 text-white py-4 px-6 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 mr-2" />
                소모량 계산하기
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-orange-100 uppercase tracking-wider">총 일일 소모량</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.totalBurn}
                      <span className="text-2xl ml-2 font-medium text-orange-200 mb-1">kcal</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      하루 에너지 소비
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Battery className="w-4 h-4 mr-2 text-gray-400" />
                        기초대사량 (BMR)
                      </div>
                      <span className="font-bold text-gray-900">{result.bmr} kcal</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                      <div className="flex items-center text-orange-700 text-sm">
                        <Activity className="w-4 h-4 mr-2" />
                        활동 대사량
                      </div>
                      <span className="font-bold text-orange-700">{result.dailyBurn - result.bmr} kcal</span>
                    </div>

                    {result.exerciseBurn > 0 && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                        <div className="flex items-center text-red-700 text-sm">
                          <Dumbbell className="w-4 h-4 mr-2" />
                          추가 운동 소모
                        </div>
                        <span className="font-bold text-red-700">{result.exerciseBurn} kcal</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Flame className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 활동량을 입력하고<br />계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-gray-400" />
                  알아두세요
                </h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span>
                    기초대사량은 숨만 쉬어도 소모되는 최소한의 에너지입니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span>
                    체중 감량을 원한다면 총 소모량보다 적게 급여하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span>
                    정확한 급여량은 사료의 칼로리 밀도에 따라 달라집니다.
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
