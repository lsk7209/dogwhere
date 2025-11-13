'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Calculator } from 'lucide-react'

export default function FoodCostCalculatorPage() {
  const [foodType, setFoodType] = useState<string>('premium')
  const [dailyAmount, setDailyAmount] = useState<number>(0)
  const [bagSize, setBagSize] = useState<number>(0)
  const [bagPrice, setBagPrice] = useState<number>(0)
  const [result, setResult] = useState<{
    dailyCost: number
    monthlyCost: number
    yearlyCost: number
    bagsPerMonth: number
  } | null>(null)

  const calculate = () => {
    if (dailyAmount <= 0 || bagSize <= 0 || bagPrice <= 0) return

    // 일일 비용 계산
    const costPerGram = bagPrice / bagSize
    const dailyCost = Math.round(dailyAmount * costPerGram)
    
    // 월간/연간 비용 계산
    const monthlyCost = dailyCost * 30
    const yearlyCost = monthlyCost * 12

    // 월간 필요한 사료 봉지 수
    const monthlyAmount = dailyAmount * 30
    const bagsPerMonth = Math.ceil(monthlyAmount / bagSize)

    setResult({
      dailyCost,
      monthlyCost,
      yearlyCost,
      bagsPerMonth
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-10 h-10 text-green-600 mr-3" />
            사료 비용 계산기
          </h1>
          <p className="text-xl text-gray-600">
            사료 종류별 월간 비용을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사료 종류
              </label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="economy">경제형 사료</option>
                <option value="standard">일반 사료</option>
                <option value="premium">프리미엄 사료</option>
                <option value="superPremium">슈퍼 프리미엄 사료</option>
                <option value="prescription">처방식 사료</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일일 급여량 (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={dailyAmount || ''}
                  onChange={(e) => setDailyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사료 봉지 크기 (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={bagSize || ''}
                  onChange={(e) => setBagSize(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사료 봉지 가격 (원)
              </label>
              <input
                type="number"
                min="0"
                value={bagPrice || ''}
                onChange={(e) => setBagPrice(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">일일 비용</p>
                    <p className="text-2xl font-bold text-green-700">{result.dailyCost.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">월간 비용</p>
                    <p className="text-2xl font-bold text-green-700">{result.monthlyCost.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">연간 비용</p>
                    <p className="text-2xl font-bold text-green-700">{result.yearlyCost.toLocaleString()}원</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">월간 필요한 봉지 수</p>
                  <p className="text-xl font-bold text-green-700">{result.bagsPerMonth}봉지</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 사료 비용 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 경제형 사료: 저렴하지만 영양 가치가 낮을 수 있습니다</li>
            <li>• 일반 사료: 적당한 가격과 영양 가치의 균형</li>
            <li>• 프리미엄 사료: 높은 영양 가치와 품질</li>
            <li>• 슈퍼 프리미엄 사료: 최고 품질의 원재료 사용</li>
            <li>• 처방식 사료: 특정 건강 문제 해결을 위한 전문 사료</li>
            <li>• 대량 구매 시 할인을 받을 수 있습니다</li>
            <li>• 사료 품질과 비용의 균형을 고려하여 선택하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

