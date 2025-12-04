'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Calculator, ArrowLeft, Zap, Clock, Smile, Heart, Battery, Activity, Info } from 'lucide-react'

export default function PlaytimeCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [breed, setBreed] = useState<string>('medium')
  const [health, setHealth] = useState<string>('good')
  const [result, setResult] = useState<{
    dailyPlaytime: number
    sessionLength: number
    activities: { name: string; icon: string; desc: string }[]
    intensity: 'low' | 'medium' | 'high'
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    let basePlaytime = 30
    let intensity: 'low' | 'medium' | 'high' = 'medium'

    // 연령별 조정
    if (age === 'puppy') {
      basePlaytime *= 1.5
      intensity = 'high'
    } else if (age === 'senior') {
      basePlaytime *= 0.7
      intensity = 'low'
    }

    // 견종별 조정
    if (breed === 'working') {
      basePlaytime *= 1.5
      intensity = 'high'
    } else if (breed === 'small') {
      basePlaytime *= 0.8
    }

    // 건강 상태 조정
    if (health === 'poor') {
      basePlaytime *= 0.5
      intensity = 'low'
    } else if (health === 'excellent') {
      basePlaytime *= 1.2
    }

    const dailyPlaytime = Math.round(basePlaytime)
    const sessionLength = Math.min(Math.round(dailyPlaytime / 3), 30)

    const activities = []
    if (intensity === 'high') {
      activities.push(
        { name: '터그 놀이', icon: '🦴', desc: '에너지 발산에 최고' },
        { name: '공 던지기', icon: '🎾', desc: '전력 질주 운동' },
        { name: '어질리티', icon: '🏃', desc: '민첩성 향상' }
      )
    } else if (intensity === 'medium') {
      activities.push(
        { name: '노즈워크', icon: '👃', desc: '스트레스 해소' },
        { name: '숨바꼭질', icon: '🙈', desc: '두뇌 자극' },
        { name: '산책', icon: '🐕', desc: '기분 전환' }
      )
    } else {
      activities.push(
        { name: '가벼운 산책', icon: '🚶', desc: '관절 무리 없이' },
        { name: '퍼즐 장난감', icon: '🧩', desc: '앉아서 하는 놀이' },
        { name: '마사지', icon: '💆', desc: '교감과 이완' }
      )
    }

    setResult({
      dailyPlaytime,
      sessionLength,
      activities,
      intensity
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-yellow-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
              <Smile className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">놀이 시간 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이의 나이와 체력에 딱 맞는 놀이 시간을 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-yellow-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'puppy', label: '퍼피 (1세 미만)', icon: Zap },
                        { id: 'adult', label: '성견 (1-7세)', icon: Activity },
                        { id: 'senior', label: '시니어 (7세 이상)', icon: Heart }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAge(item.id)}
                          className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${age === item.id
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-gray-100 hover:border-yellow-200 text-gray-600'
                            }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-bold text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">견종 타입</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'small', label: '소형견' },
                        { id: 'medium', label: '중형견' },
                        { id: 'large', label: '대형견' },
                        { id: 'working', label: '활동견/사역견' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setBreed(item.id)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${breed === item.id
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-gray-100 hover:border-yellow-200 text-gray-600'
                            }`}
                        >
                          <span className="font-bold text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">건강 상태</label>
                  <div className="flex gap-2">
                    {['excellent', 'good', 'fair', 'poor'].map((h) => (
                      <button
                        key={h}
                        onClick={() => setHealth(h)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all text-center ${health === h
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-100 hover:border-yellow-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold text-sm capitalize">
                          {h === 'excellent' ? '매우 좋음' : h === 'good' ? '좋음' : h === 'fair' ? '보통' : '나쁨'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={weight <= 0}
                  className="w-full bg-yellow-500 text-white py-4 px-6 rounded-xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  놀이 시간 확인하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-yellow-50 uppercase tracking-wider">일일 권장 놀이 시간</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyPlaytime}
                      <span className="text-xl ml-1 font-medium text-yellow-100 mb-2">분</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      1회 {result.sessionLength}분씩 나누어 진행
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
                        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                        추천 활동 ({result.intensity === 'high' ? '고강도' : result.intensity === 'medium' ? '중강도' : '저강도'})
                      </h4>
                      <div className="space-y-3">
                        {result.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-2xl mr-3">{activity.icon}</span>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{activity.name}</div>
                              <div className="text-xs text-gray-500">{activity.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-gray-900">놀이 팁</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.intensity === 'high'
                          ? '에너지가 넘치는 시기입니다. 충분한 신체 활동으로 스트레스를 해소해주세요.'
                          : result.intensity === 'low'
                            ? '관절에 무리가 가지 않도록 주의하며, 두뇌를 사용하는 노즈워크 위주로 진행하세요.'
                            : '규칙적인 놀이로 유대감을 형성하고 비만을 예방하세요.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Battery className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    정보를 입력하면<br />적절한 놀이 시간을 알려드립니다.
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
