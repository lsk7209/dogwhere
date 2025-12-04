'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, DollarSign, ArrowLeft, PiggyBank, TrendingUp, Wallet, PieChart } from 'lucide-react'

export default function LifetimeCostCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [currentAge, setCurrentAge] = useState<number>(0)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(15)
  const [result, setResult] = useState<{
    remainingYears: number
    annualCost: number
    lifetimeCost: number
    breakdown: Array<{ category: string; cost: number; percentage: number; color: string }>
  } | null>(null)

  const calculate = () => {
    if (currentAge < 0 || lifeExpectancy <= currentAge) return

    const remainingYears = lifeExpectancy - currentAge

    // 연간 비용 계산 (견종 크기별)
    let baseAnnualCost = 2000000 // 기본값 (200만원)

    if (breedSize === 'small') baseAnnualCost = 1500000 // 소형견: 150만원
    else if (breedSize === 'large') baseAnnualCost = 3000000 // 대형견: 300만원

    // 연령별 조정 (노령견은 의료비 증가)
    if (currentAge >= 7) baseAnnualCost = Math.round(baseAnnualCost * 1.5)

    const annualCost = baseAnnualCost
    const lifetimeCost = annualCost * remainingYears

    // 비용 내역
    const breakdown = [
      { category: '사료/간식', cost: Math.round(annualCost * 0.3), percentage: 30, color: 'bg-emerald-500' },
      { category: '병원비', cost: Math.round(annualCost * 0.25), percentage: 25, color: 'bg-blue-500' },
      { category: '미용/위생', cost: Math.round(annualCost * 0.15), percentage: 15, color: 'bg-pink-500' },
      { category: '용품/장난감', cost: Math.round(annualCost * 0.1), percentage: 10, color: 'bg-yellow-500' },
      { category: '기타(보험 등)', cost: Math.round(annualCost * 0.2), percentage: 20, color: 'bg-gray-500' }
    ]

    setResult({
      remainingYears,
      annualCost,
      lifetimeCost,
      breakdown
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">평생 양육비 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견과 함께하는 평생, 경제적인 준비도 필요합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-emerald-500" />
                정보 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setBreedSize(size)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${breedSize === size
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-100 hover:border-emerald-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">
                          {size === 'small' ? '소형견' : size === 'medium' ? '중형견' : '대형견'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">현재 나이 (세)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={currentAge || ''}
                      onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">예상 수명 (세)</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={lifeExpectancy || ''}
                      onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 15)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">평균: 소형 15세, 중형 13세, 대형 10세</p>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 font-bold text-lg flex items-center justify-center"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  비용 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-emerald-100 uppercase tracking-wider">총 예상 비용</span>
                    <div className="text-3xl font-black my-4 flex items-end justify-center leading-none">
                      {result.lifetimeCost.toLocaleString()}
                      <span className="text-xl ml-2 font-medium text-emerald-200 mb-1">원</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      남은 {result.remainingYears}년 기준
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                        연간 평균 비용
                      </div>
                      <span className="font-bold text-gray-900">{result.annualCost.toLocaleString()} 원</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center text-sm">
                        <PieChart className="w-4 h-4 mr-2 text-gray-400" />
                        비용 구성 (연간)
                      </h4>
                      <div className="space-y-3">
                        {result.breakdown.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-600">{item.category}</span>
                              <span className="font-bold text-gray-900">{item.cost.toLocaleString()}원</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <PiggyBank className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    정보를 입력하면<br />예상 양육비를 계산해드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2 text-teal-400" />
                  비용 절약 팁
                </h3>
                <ul className="space-y-3 text-teal-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-teal-400">•</span>
                    정기 검진으로 큰 병원비를 예방하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-teal-400">•</span>
                    펫보험 가입으로 의료비 부담을 줄일 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-teal-400">•</span>
                    사료나 용품은 대량 구매가 경제적입니다.
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
