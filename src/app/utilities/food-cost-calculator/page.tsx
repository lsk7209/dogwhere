'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Calculator, ArrowLeft, ShoppingBag, Calendar, TrendingUp, PiggyBank } from 'lucide-react'

export default function FoodCostCalculatorPage() {
  const [dailyAmount, setDailyAmount] = useState<number>(0)
  const [bagSize, setBagSize] = useState<number>(0)
  const [bagPrice, setBagPrice] = useState<number>(0)
  const [result, setResult] = useState<{
    dailyCost: number
    monthlyCost: number
    yearlyCost: number
    costPerKg: number
  } | null>(null)

  const calculate = () => {
    if (dailyAmount <= 0 || bagSize <= 0 || bagPrice <= 0) return

    // g당 가격 계산
    const costPerGram = bagPrice / (bagSize * 1000)

    const dailyCost = Math.round(dailyAmount * costPerGram)
    const monthlyCost = dailyCost * 30
    const yearlyCost = monthlyCost * 12
    const costPerKg = Math.round(bagPrice / bagSize)

    setResult({
      dailyCost,
      monthlyCost,
      yearlyCost,
      costPerKg
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
              <DollarSign className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">사료 비용 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            매일 먹는 사료, 한 달에 얼마나 들까요? 합리적인 소비를 도와드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-500" />
                정보 입력
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">일일 급여량 (g)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={dailyAmount || ''}
                      onChange={(e) => setDailyAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">g</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 포장 단위 (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={bagSize || ''}
                        onChange={(e) => setBagSize(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="0.0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 가격 (원)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={bagPrice || ''}
                        onChange={(e) => setBagPrice(parseInt(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">원</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={dailyAmount <= 0 || bagSize <= 0 || bagPrice <= 0}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-green-100 uppercase tracking-wider">월 예상 비용</span>
                    <div className="text-4xl font-black my-4 flex items-end justify-center leading-none">
                      {result.monthlyCost.toLocaleString()}
                      <span className="text-xl ml-2 font-medium text-green-200 mb-1">원</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      하루 약 {result.dailyCost.toLocaleString()}원
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        연간 예상 비용
                      </div>
                      <span className="font-bold text-gray-900">{result.yearlyCost.toLocaleString()} 원</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <ShoppingBag className="w-4 h-4 mr-2 text-gray-400" />
                        kg당 단가
                      </div>
                      <span className="font-bold text-gray-900">{result.costPerKg.toLocaleString()} 원</span>
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
                    정보를 입력하고 계산하기 버튼을<br />눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <PiggyBank className="w-5 h-5 mr-2 text-emerald-400" />
                  절약 팁
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    대용량 포장이 kg당 단가가 훨씬 저렴합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    정기 배송을 이용하면 추가 할인을 받을 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    소분하여 밀폐 보관하면 신선도를 오래 유지할 수 있습니다.
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
