'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Calculator, ArrowLeft, Check, X, Umbrella, HeartPulse, Stethoscope, AlertCircle, DollarSign } from 'lucide-react'

export default function PetInsuranceCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [coverageType, setCoverageType] = useState<string>('standard')
  const [result, setResult] = useState<{
    monthlyPremium: number
    yearlyPremium: number
    coverage: string
    benefits: { name: string; included: boolean }[]
  } | null>(null)

  const calculate = () => {
    let basePremium = 20000 // 기본값 (월간)

    // 견종 크기별 조정
    if (breedSize === 'small') basePremium = 15000
    else if (breedSize === 'large') basePremium = 30000

    // 연령별 조정
    if (age === 'puppy') basePremium = Math.round(basePremium * 0.8)
    else if (age === 'senior') basePremium = Math.round(basePremium * 1.5)

    // 보장 종류별 조정
    let coverage = ''
    let multiplier = 1

    if (coverageType === 'basic') {
      multiplier = 1
      coverage = '실속형'
    } else if (coverageType === 'standard') {
      multiplier = 1.6
      coverage = '표준형'
    } else if (coverageType === 'premium') {
      multiplier = 2.5
      coverage = '고급형'
    }

    const monthlyPremium = Math.round(basePremium * multiplier / 100) * 100 // 100원 단위 반올림
    const yearlyPremium = monthlyPremium * 12

    const allBenefits = [
      { name: '통원 의료비 (일 15만원 한도)', type: ['basic', 'standard', 'premium'] },
      { name: '입원 의료비 (일 15만원 한도)', type: ['basic', 'standard', 'premium'] },
      { name: '수술비 (회당 200만원 한도)', type: ['standard', 'premium'] },
      { name: '피부병/슬개골 탈구', type: ['standard', 'premium'] },
      { name: 'MRI/CT 촬영', type: ['premium'] },
      { name: '치과 치료', type: ['premium'] },
      { name: '배상책임 (최대 1천만원)', type: ['premium'] }
    ]

    const benefits = allBenefits.map(b => ({
      name: b.name,
      included: b.type.includes(coverageType)
    }))

    setResult({
      monthlyPremium,
      yearlyPremium,
      coverage,
      benefits
    })
  }

  const plans = [
    { id: 'basic', label: '실속형', desc: '필수 의료비 보장', icon: Shield },
    { id: 'standard', label: '표준형', desc: '가장 많이 선택', icon: Umbrella },
    { id: 'premium', label: '고급형', desc: '모든 질병 완벽 대비', icon: HeartPulse }
  ]

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
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">펫보험료 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이에게 맞는 최적의 보험 플랜과 예상 보험료를 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setBreedSize(size)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${breedSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-100 hover:border-blue-200 text-gray-600'
                            }`}
                        >
                          <div className="font-bold text-sm">
                            {size === 'small' ? '소형견' : size === 'medium' ? '중형견' : '대형견'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">나이</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['puppy', 'adult', 'senior'].map((a) => (
                        <button
                          key={a}
                          onClick={() => setAge(a)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${age === a
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-100 hover:border-blue-200 text-gray-600'
                            }`}
                        >
                          <div className="font-bold text-sm">
                            {a === 'puppy' ? '1세 미만' : a === 'adult' ? '1-7세' : '7세 이상'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">보장 플랜 선택</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setCoverageType(plan.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${coverageType === plan.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <plan.icon className={`w-6 h-6 ${coverageType === plan.id ? 'text-blue-600' : 'text-gray-400'}`} />
                          {coverageType === plan.id && <Check className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div className="font-bold mb-1">{plan.label}</div>
                        <div className="text-xs opacity-70">{plan.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-lg flex items-center justify-center"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  예상 보험료 확인
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">{result.coverage} 예상 보험료</span>
                    <div className="text-3xl font-black my-4 flex items-end justify-center leading-none">
                      {result.monthlyPremium.toLocaleString()}
                      <span className="text-xl ml-1 font-medium text-blue-200 mb-1">원/월</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      연간 {result.yearlyPremium.toLocaleString()}원
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
                      <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
                      보장 내용 상세
                    </h4>
                    <div className="space-y-3">
                      {result.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className={benefit.included ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-300'}>
                            {benefit.name}
                          </span>
                          {benefit.included ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    정보를 입력하면<br />예상 보험료를 계산해드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-indigo-400" />
                  가입 전 체크포인트
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    슬개골 탈구 보장 여부를 꼭 확인하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    자기부담금 비율에 따라 보험료가 달라집니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    만 8세 이상은 가입이 제한될 수 있습니다.
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
