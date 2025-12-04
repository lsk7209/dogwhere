'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gamepad2, Calculator, ArrowLeft, Clock, Repeat, Zap, Heart, Activity, Info } from 'lucide-react'

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
      dailyPlaytime = 45 // 강아지는 총량은 적지만 자주
    } else if (age === 'senior') {
      dailyPlaytime = 30 // 노령견은 적게
    } else {
      dailyPlaytime = 60 // 성견
    }

    // 견종 크기별 조정
    if (breedSize === 'small') {
      dailyPlaytime = Math.round(dailyPlaytime * 0.8)
    } else if (breedSize === 'large') {
      dailyPlaytime = Math.round(dailyPlaytime * 1.2)
    }

    const sessionDuration = age === 'puppy' ? 10 : age === 'senior' ? 10 : 20
    const sessionsPerDay = Math.ceil(dailyPlaytime / sessionDuration)

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '성장기 강아지는 집중력이 짧고 쉽게 지칩니다. 짧고 굵게, 자주 놀아주는 것이 핵심입니다.'
    } else if (age === 'senior') {
      recommendation = '관절에 무리가 가지 않도록 짧게 끊어서 진행하세요. 격한 움직임보다는 두뇌 활동 위주가 좋습니다.'
    } else {
      recommendation = '에너지를 충분히 발산할 수 있도록 규칙적인 시간을 정해두고 놀아주세요.'
    }

    setResult({
      dailyPlaytime,
      sessionDuration,
      sessionsPerDay,
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
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">놀이 스케줄 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            하루 몇 번, 얼마나 놀아줘야 할까요? 최적의 놀이 스케줄을 제안합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-pink-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'puppy', label: '퍼피', desc: '1세 미만', icon: Zap },
                      { id: 'adult', label: '성견', desc: '1-7세', icon: Activity },
                      { id: 'senior', label: '시니어', desc: '7세 이상', icon: Heart }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAge(item.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${age === item.id
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-100 hover:border-pink-200 text-gray-600'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <item.icon className="w-5 h-5" />
                          <span className="font-bold">{item.label}</span>
                        </div>
                        <div className="text-xs opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'small', label: '소형견' },
                      { id: 'medium', label: '중형견' },
                      { id: 'large', label: '대형견' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setBreedSize(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${breedSize === item.id
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-100 hover:border-pink-200 text-gray-600'
                          }`}
                      >
                        <span className="font-bold text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-bold text-lg flex items-center justify-center"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  스케줄 확인하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-pink-100 uppercase tracking-wider">일일 총 놀이 시간</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyPlaytime}
                      <span className="text-xl ml-1 font-medium text-pink-200 mb-2">분</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-pink-50 rounded-xl p-4 text-center border border-pink-100">
                        <Clock className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">1회 권장 시간</div>
                        <div className="text-xl font-bold text-gray-900">{result.sessionDuration}분</div>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4 text-center border border-pink-100">
                        <Repeat className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">하루 권장 횟수</div>
                        <div className="text-xl font-bold text-gray-900">{result.sessionsPerDay}회</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-sm text-gray-900">스케줄 제안</span>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: result.sessionsPerDay }).map((_, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-600">
                            <span className="w-16 font-medium text-pink-600">{i + 1}회차</span>
                            <span className="flex-1 border-b border-dashed border-gray-200 mx-2"></span>
                            <span>{result.sessionDuration}분</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed text-center bg-gray-50 p-4 rounded-xl">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    정보를 입력하면<br />최적의 스케줄을 알려드립니다.
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
