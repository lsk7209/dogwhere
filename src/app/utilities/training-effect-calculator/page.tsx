'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Target, Award, Zap, BarChart, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react'

export default function TrainingEffectCalculatorPage() {
  const [skill, setSkill] = useState('sit')
  const [attempts, setAttempts] = useState(10)
  const [successes, setSuccesses] = useState(5)
  const [prevRate, setPrevRate] = useState(30) // Previous success rate %

  const currentRate = Math.round((successes / attempts) * 100)
  const improvement = currentRate - prevRate

  const getFeedback = () => {
    if (currentRate >= 90) return { msg: '마스터 단계입니다! 다음 단계로 넘어가세요.', color: 'text-indigo-600', bg: 'bg-indigo-50' }
    if (currentRate >= 70) return { msg: '아주 잘하고 있어요. 조금만 더 연습하면 완벽해질 거예요.', color: 'text-green-600', bg: 'bg-green-50' }
    if (currentRate >= 40) return { msg: '감은 잡았지만 아직 실수가 많아요. 간식 보상을 늘려보세요.', color: 'text-orange-600', bg: 'bg-orange-50' }
    return { msg: '아직 익숙하지 않아요. 더 쉬운 단계로 낮춰서 연습해보세요.', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const feedback = getFeedback()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">훈련 성과 분석기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            감으로만 알던 훈련 성과, 이제 데이터로 확인하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-500" />
                훈련 데이터 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">훈련 항목</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sit', label: '앉아' },
                      { id: 'stay', label: '기다려' },
                      { id: 'come', label: '이리와' },
                      { id: 'hand', label: '손' },
                      { id: 'house', label: '하우스' },
                      { id: 'other', label: '기타' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSkill(item.id)}
                        className={`py-2 rounded-lg border transition-all text-sm font-bold ${skill === item.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200 text-gray-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">총 시도 횟수 ({attempts}회)</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={attempts}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      setAttempts(val)
                      if (successes > val) setSuccesses(val)
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">성공 횟수 ({successes}회)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSuccesses(Math.max(0, successes - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                    >-</button>
                    <div className="flex-1 text-center font-black text-2xl text-indigo-600">
                      {successes}
                    </div>
                    <button
                      onClick={() => setSuccesses(Math.min(attempts, successes + 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-indigo-500" />
                분석 결과
              </h2>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                {/* Success Rate Circle */}
                <div className="relative flex items-center justify-center aspect-square max-w-[200px] mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#f3f4f6" strokeWidth="10%" />
                    <circle
                      cx="50%" cy="50%" r="45%"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="10%"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentRate / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-indigo-900">{currentRate}%</span>
                    <span className="text-sm text-gray-500 font-medium">성공률</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 flex flex-col justify-center">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">지난주 성공률</span>
                    <span className="font-bold text-gray-400">{prevRate}%</span>
                  </div>
                  <div className={`rounded-xl p-4 flex items-center justify-between ${improvement > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    <span className="font-medium">성장률</span>
                    <span className="font-bold flex items-center gap-1">
                      {improvement > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 transform rotate-180" />}
                      {improvement > 0 ? '+' : ''}{improvement}%
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl border border-dashed text-sm font-medium ${feedback.bg} ${feedback.color} border-current`}>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {feedback.msg}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  성공률을 높이는 팁
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm text-indigo-100">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <strong className="block text-white mb-2">짧고 굵게</strong>
                    훈련 시간은 5-10분을 넘기지 마세요. 집중력이 떨어지면 역효과가 납니다.
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <strong className="block text-white mb-2">확실한 보상</strong>
                    성공 즉시 칭찬과 간식을 주세요. 0.5초의 타이밍이 중요합니다.
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <strong className="block text-white mb-2">긍정적 마무리</strong>
                    항상 성공했을 때 훈련을 마치세요. 좋은 기억으로 끝내야 합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
