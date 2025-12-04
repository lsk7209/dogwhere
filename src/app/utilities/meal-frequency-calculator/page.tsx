'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Calculator, ArrowLeft, Utensils, AlertCircle, Sun, Moon, Coffee } from 'lucide-react'

export default function MealFrequencyCalculatorPage() {
  const [age, setAge] = useState<string>('adult')
  const [healthCondition, setHealthCondition] = useState<string>('healthy')
  const [result, setResult] = useState<{
    frequency: number
    schedule: { time: string; label: string; icon: any }[]
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let frequency = 2 // 기본값 (성견)
    let schedule: { time: string; label: string; icon: any }[] = []
    let recommendation = ''

    if (age === 'puppy') {
      // 2-4개월: 4회, 4-6개월: 3회, 6-12개월: 3회
      // 여기서는 단순화를 위해 puppy를 4-12개월로 가정하고 3회로 통일하거나 세분화
      // 기존 로직 참고하여 세분화된 입력이 없으므로 puppy는 3회로 설정하되, 
      // 안내 문구에 2-4개월은 4회 권장 추가
      frequency = 3
      schedule = [
        { time: '08:00', label: '아침', icon: Sun },
        { time: '13:00', label: '점심', icon: Coffee },
        { time: '19:00', label: '저녁', icon: Moon }
      ]
      recommendation = '성장기 강아지는 소화 기관이 작아 조금씩 자주 먹어야 합니다. 4개월 미만이라면 하루 4회 급여를 권장합니다.'
    } else if (age === 'young' || age === 'adult') {
      frequency = 2
      schedule = [
        { time: '08:00', label: '아침', icon: Sun },
        { time: '19:00', label: '저녁', icon: Moon }
      ]
      recommendation = '규칙적인 식사 시간은 배변 훈련과 생활 리듬 유지에 도움이 됩니다. 간식은 하루 섭취량의 10%를 넘지 않게 주의하세요.'
    } else if (age === 'senior') {
      frequency = 2 // 노령견도 보통 2회지만 소화력에 따라 3회 권장
      // 여기서는 선택에 따라 3회로 변경 가능하도록 로직 수정
      // 기존 로직은 senior 3회였음. 유지.
      frequency = 3
      schedule = [
        { time: '08:00', label: '아침', icon: Sun },
        { time: '13:00', label: '점심 (가볍게)', icon: Coffee },
        { time: '19:00', label: '저녁', icon: Moon }
      ]
      recommendation = '노령견은 소화 기능이 떨어질 수 있어 소량씩 자주 급여하는 것이 위장 부담을 줄이는 데 좋습니다.'
    }

    // 건강 상태에 따른 오버라이드
    if (healthCondition === 'diabetes') {
      frequency = 3 // 당뇨는 혈당 유지를 위해 자주
      schedule = [
        { time: '07:00', label: '아침 (인슐린 전)', icon: Sun },
        { time: '15:00', label: '간식/점심', icon: Coffee },
        { time: '23:00', label: '저녁 (인슐린 전)', icon: Moon }
      ]
      recommendation = '당뇨 관리는 규칙적인 식사와 인슐린 투여 간격이 핵심입니다. 수의사와 상담한 스케줄을 철저히 지켜주세요.'
    } else if (healthCondition === 'digestive') {
      frequency = 4
      schedule = [
        { time: '08:00', label: '아침', icon: Sun },
        { time: '12:00', label: '점심', icon: Coffee },
        { time: '16:00', label: '오후', icon: Coffee },
        { time: '20:00', label: '저녁', icon: Moon }
      ]
      recommendation = '소화기 문제가 있다면 위장에 부담을 주지 않도록 1회 급여량을 줄이고 횟수를 늘려주세요.'
    }

    setResult({
      frequency,
      schedule,
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
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">식사 스케줄 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이에게 딱 맞는 최적의 식사 횟수와 시간을 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-orange-500" />
                정보 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">나이 단계</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'puppy', label: '퍼피', desc: '1년 미만' },
                      { id: 'young', label: '청년기', desc: '1-2세' },
                      { id: 'adult', label: '성견', desc: '2-7세' },
                      { id: 'senior', label: '노령견', desc: '7세 이상' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAge(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${age === item.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 hover:border-orange-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold text-sm">{item.label}</div>
                        <div className="text-xs opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">건강 상태</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'healthy', label: '건강함', icon: '💪' },
                      { id: 'diabetes', label: '당뇨', icon: '🩸' },
                      { id: 'digestive', label: '소화기 민감', icon: '🤢' },
                      { id: 'underweight', label: '저체중', icon: '📉' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setHealthCondition(item.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-center ${healthCondition === item.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 hover:border-orange-200 text-gray-600'
                          }`}
                      >
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <span className="font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-bold text-lg flex items-center justify-center"
                >
                  <Utensils className="w-5 h-5 mr-2" />
                  스케줄 확인하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-orange-100 uppercase tracking-wider">권장 식사 횟수</span>
                    <div className="text-4xl font-black my-4">하루 {result.frequency}회</div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      맞춤형 스케줄
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        추천 시간표
                      </h4>
                      <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {result.schedule.map((item, index) => (
                          <div key={index} className="relative flex items-center pl-10">
                            <div className="absolute left-2 w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500 z-10"></div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{item.label}</span>
                              </div>
                              <span className="font-bold text-orange-600">{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="font-bold text-gray-900">전문가 조언</span>
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
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    정보를 입력하면<br />최적의 식사 스케줄을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-amber-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Utensils className="w-5 h-5 mr-2 text-amber-400" />
                  급여 원칙
                </h3>
                <ul className="space-y-3 text-amber-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-400">•</span>
                    식사 시간은 매일 일정하게 유지해주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-400">•</span>
                    식사 후 30분-1시간은 격한 운동을 피하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-amber-400">•</span>
                    물은 항상 신선하게 준비해주세요.
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
