'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Calculator, ArrowLeft, Scale, Activity, Info, Baby } from 'lucide-react'

export default function GrowthRateCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<number>(0)
  const [currentWeight, setCurrentWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [result, setResult] = useState<{
    growthRate: number
    expectedAdultWeight: number
    growthStage: string
    recommendation: string
    progress: number
  } | null>(null)

  const breedSizes = [
    { id: 'small', label: '소형견', desc: '성견 시 10kg 미만' },
    { id: 'medium', label: '중형견', desc: '성견 시 10-25kg' },
    { id: 'large', label: '대형견', desc: '성견 시 25kg 이상' }
  ]

  const calculate = () => {
    if (currentAge <= 0 || currentWeight <= 0) return

    // 견종별 성체 체중 추정 (현재 체중 기반)
    let adultWeightMultiplier = 2.0 // 기본값
    let progress = 0

    if (breedSize === 'small') {
      // 소형견: 10-12개월에 성체 도달
      adultWeightMultiplier = currentAge >= 12 ? 1 : (1 + (12 - currentAge) * 0.1)
      progress = Math.min((currentAge / 12) * 100, 100)
    } else if (breedSize === 'medium') {
      // 중형견: 12-15개월에 성체 도달
      adultWeightMultiplier = currentAge >= 14 ? 1 : (1 + (14 - currentAge) * 0.12)
      progress = Math.min((currentAge / 14) * 100, 100)
    } else {
      // 대형견: 18-24개월에 성체 도달
      adultWeightMultiplier = currentAge >= 20 ? 1 : (1 + (20 - currentAge) * 0.15)
      progress = Math.min((currentAge / 20) * 100, 100)
    }

    // 단순화된 추정 로직 (실제로는 더 복잡한 곡선을 따름)
    // 여기서는 사용자가 입력한 현재 체중이 해당 월령의 평균이라고 가정하고 역산하는 방식보다는
    // 현재 체중을 바탕으로 성체 체중을 예측하는 간단한 배수 로직을 사용 (예: 3개월령 체중 * 2 = 성체 체중 등)
    // 기존 로직을 조금 더 정교하게 수정:
    // 소형견: 3개월 체중 * 2~2.5, 6개월 체중 * 1.2~1.5
    // 여기서는 간단히 기존 로직의 틀을 유지하되 multiplier를 나이에 따라 동적으로 조정

    // 나이에 따른 대략적인 성체 도달 비율
    let weightRatio = 0.5
    if (currentAge <= 2) weightRatio = 0.2
    else if (currentAge <= 4) weightRatio = 0.4
    else if (currentAge <= 6) weightRatio = 0.6
    else if (currentAge <= 9) weightRatio = 0.8
    else if (currentAge <= 12) weightRatio = 0.9
    else weightRatio = 1.0

    // 보정된 예상 성체 체중
    const expectedAdultWeight = Math.round((currentWeight / weightRatio) * 10) / 10

    let growthStage = ''
    let recommendation = ''

    if (progress < 30) {
      growthStage = '급속 성장기 (퍼피)'
      recommendation = '뼈와 근육이 빠르게 자라는 시기입니다. 고단백 퍼피 사료를 급여하고 무리한 운동은 피해주세요.'
    } else if (progress < 70) {
      growthStage = '성장기 (주니어)'
      recommendation = '신체가 길어지고 체형이 잡히는 시기입니다. 균형 잡힌 식단과 사회화 교육이 중요합니다.'
    } else if (progress < 100) {
      growthStage = '성장 마무리 단계'
      recommendation = '성장이 거의 멈추고 근육량이 늘어나는 시기입니다. 성견 사료로의 교체를 준비하세요.'
    } else {
      growthStage = '성체 (어덜트)'
      recommendation = '성장이 완료되었습니다. 적정 체중 유지를 위해 칼로리 조절과 규칙적인 운동이 필요합니다.'
    }

    setResult({
      growthRate: Math.round(weightRatio * 100), // 현재 성체 대비 달성률
      expectedAdultWeight,
      growthStage,
      recommendation,
      progress
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
              <TrendingUp className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">성장 예측 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 강아지는 얼마나 더 클까요? 현재 성장 단계와 예상 크기를 확인해보세요.
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {breedSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setBreedSize(size.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${breedSize === size.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{size.label}</div>
                        <div className="text-xs opacity-70">{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">현재 나이 (개월)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="36"
                        value={currentAge || ''}
                        onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">개월</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={currentWeight || ''}
                        onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="0.0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={currentAge <= 0 || currentWeight <= 0}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  성장 예측하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-indigo-100 uppercase tracking-wider">예상 성체 체중</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.expectedAdultWeight}
                      <span className="text-2xl ml-2 font-medium text-indigo-200 mb-1">kg</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      현재 성장의 약 {result.growthRate}% 도달
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>성장 진행률</span>
                        <span className="font-bold text-indigo-600">{Math.round(result.progress)}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Baby className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-gray-900">{result.growthStage}</span>
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
                    <Scale className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    나이와 체중을 입력하면<br />성장 예측 결과를 보여드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-slate-400" />
                  성장 상식
                </h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-slate-500">•</span>
                    소형견은 10-12개월이면 성장이 멈춥니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-slate-500">•</span>
                    대형견은 18-24개월까지 천천히 자랍니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-slate-500">•</span>
                    급격한 체중 증가는 관절에 무리를 줄 수 있습니다.
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
