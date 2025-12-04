'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fish, Calculator, ArrowLeft, Droplet, Activity, Heart, Bone, AlertCircle, Info } from 'lucide-react'

export default function Omega3RequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [skinCondition, setSkinCondition] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyOmega3: number
    epaDha: number
    recommendation: string
    sources: { name: string; amount: string }[]
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 오메가-3 필요량 계산 (체중 1kg당 mg)
    let omega3PerKg = 50 // 기본값

    if (skinCondition === 'dry') omega3PerKg = 80
    else if (skinCondition === 'allergy') omega3PerKg = 100
    else if (skinCondition === 'inflammation') omega3PerKg = 120
    else if (skinCondition === 'arthritis') omega3PerKg = 150

    const dailyOmega3 = Math.round(weight * omega3PerKg)
    const epaDha = Math.round(dailyOmega3 * 0.3)

    let recommendation = ''
    let sources = [
      { name: '연어 오일', amount: '1펌프 (약 2ml)' },
      { name: '멸치/정어리', amount: '작은 것 2-3마리' }
    ]

    if (skinCondition === 'normal') {
      recommendation = '현재 건강 상태를 유지하기 위한 권장량입니다. 꾸준한 급여가 중요합니다.'
    } else if (skinCondition === 'dry') {
      recommendation = '피부 보습과 피모 개선을 위해 증량된 양입니다. 4주 이상 급여 후 변화를 관찰하세요.'
    } else if (skinCondition === 'allergy') {
      recommendation = '알레르기 반응 완화를 위한 치료 용량입니다. 수의사와 상담 후 급여하는 것이 좋습니다.'
      sources.push({ name: '크릴 오일', amount: '흡수율이 높음' })
    } else if (skinCondition === 'inflammation') {
      recommendation = '체내 염증 수치를 낮추기 위한 고용량입니다. 설사 등 부작용이 없는지 확인하세요.'
    } else {
      recommendation = '관절 통증 완화와 염증 억제를 위한 최대 권장량입니다. 반드시 수의사의 지도를 따르세요.'
      sources = [
        { name: '고농축 오메가3', amount: '수의사 처방 제품' },
        { name: '초록입홍합', amount: '관절 영양제 병행' }
      ]
    }

    setResult({
      dailyOmega3,
      epaDha,
      recommendation,
      sources
    })
  }

  const conditions = [
    { id: 'normal', label: '건강함', icon: Heart, desc: '일반적인 유지 관리' },
    { id: 'dry', label: '건조한 피부', icon: Droplet, desc: '각질, 푸석한 털' },
    { id: 'allergy', label: '알레르기', icon: AlertCircle, desc: '가려움, 붉은 피부' },
    { id: 'inflammation', label: '염증성 질환', icon: Activity, desc: '만성 염증 관리' },
    { id: 'arthritis', label: '관절염', icon: Bone, desc: '관절 통증, 노령견' }
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
              <Fish className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">오메가-3 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            피부, 관절, 심장 건강을 위한 최적의 오메가-3 섭취량을 계산해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-teal-500" />
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">건강 상태</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditions.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => setSkinCondition(condition.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${skinCondition === condition.id
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-100 hover:border-teal-200 text-gray-600'
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${skinCondition === condition.id ? 'bg-white' : 'bg-gray-100'}`}>
                          <condition.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold mb-0.5">{condition.label}</div>
                          <div className="text-xs opacity-70">{condition.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={weight <= 0}
                  className="w-full bg-teal-600 text-white py-4 px-6 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Fish className="w-5 h-5 mr-2" />
                  필요량 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-teal-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-teal-100 uppercase tracking-wider">일일 권장 섭취량</span>
                    <div className="text-4xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyOmega3}
                      <span className="text-xl ml-1 font-medium text-teal-200 mb-1">mg</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      EPA + DHA 합계: {result.epaDha}mg
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-teal-600" />
                        <span className="font-bold text-gray-900">급여 가이드</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                        <Fish className="w-4 h-4 mr-2 text-teal-500" />
                        추천 급여원
                      </h4>
                      <div className="space-y-2">
                        {result.sources.map((source, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                            <span className="font-medium text-gray-700">{source.name}</span>
                            <span className="text-teal-600">{source.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Droplet className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 건강 상태를 입력하면<br />필요한 오메가-3 양을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  주의사항
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    과다 섭취 시 설사나 구토를 유발할 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    수술 예정이라면 1주일 전부터 급여를 중단하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    개봉 후에는 냉장 보관하고 산패에 주의하세요.
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
