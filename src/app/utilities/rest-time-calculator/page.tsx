'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Moon, Calculator, ArrowLeft, Sun, Clock, Coffee, Battery, Zap } from 'lucide-react'

export default function RestTimeCalculatorPage() {
  const [age, setAge] = useState<string>('adult')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailySleep: number
    daySleep: number
    nightSleep: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let dailySleep = 13 // 성견 기본

    if (age === 'puppy') dailySleep = 19 // 퍼피는 많이 잠
    else if (age === 'senior') dailySleep = 16 // 시니어도 많이 잠

    if (activityLevel === 'high') dailySleep += 1 // 활동 많으면 더 잠
    else if (activityLevel === 'low') dailySleep -= 1 // 활동 적으면 덜 잠

    // 낮잠/밤잠 비율 (대략적)
    const nightSleep = Math.min(dailySleep, 9) // 밤에는 최대 9시간
    const daySleep = dailySleep - nightSleep

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '성장 호르몬이 나오는 시기입니다. 깨우지 말고 푹 자게 해주세요.'
    } else if (age === 'senior') {
      recommendation = '체력 회복이 더딥니다. 조용하고 따뜻한 잠자리를 마련해주세요.'
    } else {
      recommendation = '규칙적인 산책으로 꿀잠을 유도해주세요. 수면 부족은 스트레스의 원인입니다.'
    }

    setResult({
      dailySleep,
      daySleep,
      nightSleep,
      recommendation
    })
  }

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
              <Moon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">수면 시간 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            강아지의 하루 중 절반 이상은 잠입니다. 적정 수면 시간을 확인하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-indigo-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'puppy', label: '퍼피', desc: '성장기' },
                      { id: 'adult', label: '성견', desc: '활동기' },
                      { id: 'senior', label: '시니어', desc: '노령기' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAge(item.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${age === item.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold text-lg mb-1">{item.label}</div>
                        <div className="text-xs opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">평소 활동량</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'low', label: '적음', icon: Battery },
                      { id: 'normal', label: '보통', icon: Zap },
                      { id: 'high', label: '많음', icon: Coffee }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActivityLevel(item.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${activityLevel === item.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200 text-gray-600'
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="font-bold text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold text-lg flex items-center justify-center"
                >
                  <Moon className="w-5 h-5 mr-2" />
                  수면 시간 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">일일 권장 수면</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailySleep}
                      <span className="text-xl ml-1 font-medium text-indigo-200 mb-2">시간</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                        <Sun className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">낮잠</div>
                        <div className="font-bold text-gray-900 text-lg">{result.daySleep}시간</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                        <Moon className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">밤잠</div>
                        <div className="font-bold text-gray-900 text-lg">{result.nightSleep}시간</div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-gray-900">수면 가이드</span>
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
                    <Moon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    나이와 활동량을 입력하면<br />적정 수면 시간을 알려드립니다.
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
