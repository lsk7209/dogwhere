'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Atom, Calculator, ArrowLeft, Bone, Activity, Scale, AlertCircle, Info } from 'lucide-react'

export default function PhosphorusRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [kidneyIssue, setKidneyIssue] = useState<boolean>(false)
  const [result, setResult] = useState<{
    dailyPhosphorus: number
    calciumRatio: string
    recommendation: string
    status: 'good' | 'warning' | 'alert'
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 인 필요량 계산 (체중 1kg당 mg)
    let phosphorusPerKg = 100 // 기본값 (성견)

    if (age === 'puppy') {
      phosphorusPerKg = 250 // 성장기: 고인 필요
    } else if (age === 'senior') {
      phosphorusPerKg = 75 // 노령견: 인 제한 권장
    }

    // 신장 질환이 있는 경우 엄격한 제한 필요
    if (kidneyIssue) {
      phosphorusPerKg = 45 // 신부전 관리 수준 (매우 낮음)
    }

    const dailyPhosphorus = Math.round(weight * phosphorusPerKg)

    // 칼슘:인 비율 권장 범위
    let ratioText = '1.2:1 ~ 1.4:1'
    if (kidneyIssue) ratioText = '2:1 이상 (인 제한)'

    let recommendation = ''
    let status: 'good' | 'warning' | 'alert' = 'good'

    if (kidneyIssue) {
      recommendation = '신장 건강 관리를 위해 인 섭취를 엄격히 제한해야 합니다. 처방식 사료 급여를 권장하며, 육류 간식은 피해주세요.'
      status = 'alert'
    } else if (age === 'puppy') {
      recommendation = '뼈와 치아의 급격한 성장을 위해 충분한 인 섭취가 필요합니다. 칼슘과의 균형(1.2:1)을 꼭 맞춰주세요.'
      status = 'good'
    } else if (age === 'senior') {
      recommendation = '노령견은 신장 기능 저하 예방을 위해 인 섭취를 조금 줄이는 것이 좋습니다.'
      status = 'warning'
    } else {
      recommendation = '건강한 성견의 표준 권장량입니다. 칼슘과 인의 비율이 1:1에서 2:1 사이를 유지하도록 해주세요.'
      status = 'good'
    }

    setResult({
      dailyPhosphorus,
      calciumRatio: ratioText,
      recommendation,
      status
    })
  }

  const lifeStages = [
    { id: 'puppy', label: '자견 (1세 미만)', desc: '성장기 급여' },
    { id: 'adult', label: '성견 (1-7세)', desc: '유지 관리' },
    { id: 'senior', label: '노령견 (7세 이상)', desc: '신장 주의' }
  ]

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
              <Atom className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">인(Phosphorus) 섭취량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            뼈 건강과 신장 관리를 위한 최적의 인 섭취량을 계산해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-indigo-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">생애 단계</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {lifeStages.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => setAge(stage.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${age === stage.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{stage.label}</div>
                        <div className="text-xs opacity-70">{stage.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${kidneyIssue ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'}`} onClick={() => setKidneyIssue(!kidneyIssue)}>
                        {kidneyIssue && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <label onClick={() => setKidneyIssue(!kidneyIssue)} className="cursor-pointer">
                        <span className="font-bold text-gray-900 block">신장 질환이 있나요?</span>
                        <span className="text-xs text-red-600">체크 시 인 섭취량을 엄격하게 제한합니다.</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={weight <= 0}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Atom className="w-5 h-5 mr-2" />
                  필요량 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                  <div className={`p-8 text-center text-white bg-gradient-to-br ${result.status === 'alert' ? 'from-red-500 to-red-600' :
                      result.status === 'warning' ? 'from-orange-500 to-orange-600' :
                        'from-indigo-500 to-purple-600'
                    }`}>
                    <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">일일 권장 섭취량</span>
                    <div className="text-4xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyPhosphorus}
                      <span className="text-xl ml-1 font-medium text-white/80 mb-1">mg</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      권장 칼슘 비율 {result.calciumRatio}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-gray-900">영양 가이드</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                        <Scale className="w-4 h-4 mr-2 text-indigo-500" />
                        균형 잡힌 식단 팁
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="mr-2 text-indigo-500">•</span>
                          육류는 인 함량이 높으므로 주의하세요.
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 text-indigo-500">•</span>
                          달걀 껍질 파우더로 칼슘을 보충할 수 있습니다.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Bone className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 건강 상태를 입력하면<br />적정 인 섭취량을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-purple-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-purple-400" />
                  왜 인(P)이 중요한가요?
                </h3>
                <ul className="space-y-3 text-purple-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    인은 칼슘과 결합하여 뼈와 치아를 구성합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    신장 기능이 떨어지면 인 배출이 어려워져 위험합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    칼슘과의 비율이 깨지면 뼈가 약해질 수 있습니다.
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

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
