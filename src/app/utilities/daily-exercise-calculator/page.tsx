'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Calculator, ArrowLeft, Info, Timer, Dog, HeartPulse } from 'lucide-react'

export default function DailyExerciseCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [weight, setWeight] = useState<number>(0)
  const [result, setResult] = useState<{
    dailyMinutes: number
    weeklyMinutes: number
    exerciseTypes: string[]
    recommendation: string
  } | null>(null)

  const breedSizes = [
    { id: 'small', label: '소형견', desc: '10kg 미만' },
    { id: 'medium', label: '중형견', desc: '10-25kg' },
    { id: 'large', label: '대형견', desc: '25kg 이상' }
  ]

  const ages = [
    { id: 'puppy', label: '퍼피', desc: '1세 미만' },
    { id: 'young', label: '청년기', desc: '1-2세' },
    { id: 'adult', label: '성견', desc: '3-7세' },
    { id: 'senior', label: '노령견', desc: '7세 이상' }
  ]

  const calculate = () => {
    if (weight <= 0) return

    let dailyMinutes = 30 // 기본값

    // 견종 크기별 조정
    if (breedSize === 'small') {
      dailyMinutes = 30
    } else if (breedSize === 'large') {
      dailyMinutes = 60
    } else {
      dailyMinutes = 45
    }

    // 연령별 조정
    if (age === 'puppy') {
      // 퍼피는 5분 규칙 (개월수 x 5분)이 있지만, 여기서는 단순화
      dailyMinutes = Math.min(dailyMinutes, 30)
    } else if (age === 'young') {
      dailyMinutes = Math.round(dailyMinutes * 1.2) // 에너지가 넘치는 시기
    } else if (age === 'senior') {
      dailyMinutes = Math.round(dailyMinutes * 0.7) // 관절 보호
    }

    const weeklyMinutes = dailyMinutes * 7

    const exerciseTypes: string[] = []
    if (breedSize === 'small') {
      exerciseTypes.push('실내 터그놀이', '가벼운 산책', '노즈워크')
    } else if (breedSize === 'large') {
      exerciseTypes.push('조깅/러닝', '등산', '프리스비', '수영')
    } else {
      exerciseTypes.push('빠른 걸음 산책', '공놀이', '어질리티')
    }

    if (age === 'senior') {
      exerciseTypes.length = 0; // 초기화 후 노령견 전용 추가
      exerciseTypes.push('천천히 걷기', '수영(관절보호)', '간단한 노즈워크')
    }

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '성장판이 닫히지 않은 시기이므로 과격한 운동은 피하고, 짧게 여러 번 나누어 놀아주는 것이 좋습니다.'
    } else if (age === 'senior') {
      recommendation = '관절에 무리가 가지 않도록 평지 위주의 산책을 권장하며, 컨디션을 수시로 체크해주세요.'
    } else {
      recommendation = '규칙적인 운동은 스트레스 해소와 문제 행동 예방에 필수적입니다. 다양한 활동으로 지루함을 덜어주세요.'
    }

    setResult({
      dailyMinutes,
      weeklyMinutes,
      exerciseTypes,
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
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">일일 운동량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 나이와 크기에 딱 맞는 하루 운동량을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Dog className="w-5 h-5 mr-2 text-green-500" />
                반려견 정보 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                  <div className="grid grid-cols-3 gap-3">
                    {breedSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setBreedSize(size.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${breedSize === size.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 hover:border-green-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{size.label}</div>
                        <div className="text-xs opacity-70">{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ages.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setAge(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${age === item.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 hover:border-green-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{item.label}</div>
                        <div className="text-xs opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={!weight}
                className="w-full mt-8 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calculator className="w-5 h-5 mr-2" />
                운동량 계산하기
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-green-100 uppercase tracking-wider">일일 권장 운동량</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyMinutes}
                      <span className="text-2xl ml-2 font-medium text-green-200 mb-1">분</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      매일 꾸준히!
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center">
                        <HeartPulse className="w-4 h-4 mr-2 text-green-500" />
                        추천 활동
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.exerciseTypes.map((type, index) => (
                          <span key={index} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">전문가 조언</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Timer className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    반려견 정보를 입력하고<br />계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-400" />
                  운동 팁
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    산책은 냄새 맡기(노즈워크)를 포함하는 것이 좋습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    여름철에는 시원한 아침/저녁 시간을 이용하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    운동 전후로 충분한 수분 섭취가 필요합니다.
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
