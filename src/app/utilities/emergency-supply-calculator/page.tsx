'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Calculator } from 'lucide-react'

export default function EmergencySupplyCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [duration, setDuration] = useState<number>(3)
  const [result, setResult] = useState<{
    foodAmount: number
    waterAmount: number
    supplies: Array<{ item: string; quantity: string }>
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (duration <= 0) return

    // 기본 일일 급여량 (견종 크기별)
    let dailyFood = 200 // 기본값 (g)
    if (breedSize === 'small') {
      dailyFood = 150
    } else if (breedSize === 'large') {
      dailyFood = 300
    }

    const foodAmount = dailyFood * duration
    const waterAmount = duration * 1000 // 1L per day

    const supplies = [
      { item: '사료', quantity: `${foodAmount}g (${Math.ceil(foodAmount / 1000)}kg)` },
      { item: '물', quantity: `${waterAmount}ml (${waterAmount / 1000}L)` },
      { item: '응급 의료 키트', quantity: '1세트' },
      { item: '구충제', quantity: '1개월분' },
      { item: '간식', quantity: `${Math.ceil(dailyFood * 0.1 * duration)}g` },
      { item: '장난감', quantity: '2-3개' },
      { item: '목줄/하네스', quantity: '1세트' },
      { item: '배변봉투', quantity: `${duration * 3}개` },
      { item: '수건/타월', quantity: '2-3개' },
      { item: '응급 연락처 목록', quantity: '1부' }
    ]

    let recommendation = ''
    if (duration <= 3) {
      recommendation = '3일 이하의 비상용품은 기본적인 것만 준비하면 됩니다.'
    } else if (duration <= 7) {
      recommendation = '1주일 비상용품은 충분히 준비하세요. 사료와 물을 여유있게 준비하세요.'
    } else {
      recommendation = '장기 비상용품은 정기적으로 확인하고 교체하세요. 유통기한을 확인하세요.'
    }

    setResult({
      foodAmount,
      waterAmount,
      supplies,
      recommendation
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
            <AlertCircle className="w-10 h-10 text-red-600 mr-3" />
            비상용품 계산기
          </h1>
          <p className="text-xl text-gray-600">
            비상 상황 대비 용품을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 크기
                </label>
                <select
                  value={breedSize}
                  onChange={(e) => setBreedSize(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="small">소형견</option>
                  <option value="medium">중형견</option>
                  <option value="large">대형견</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비상 기간 (일)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration || ''}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">비상용품 목록</p>
                  <div className="space-y-2">
                    {result.supplies.map((supply, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{supply.item}</span>
                        <span className="font-semibold text-red-700">{supply.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 비상용품 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 비상용품은 정기적으로 확인하고 교체하세요</li>
            <li>• 사료와 물은 여유있게 준비하세요</li>
            <li>• 응급 의료 키트는 수의사와 상담하여 준비하세요</li>
            <li>• 구충제와 필수 약품을 준비하세요</li>
            <li>• 응급 연락처 목록을 준비하세요</li>
            <li>• 비상용품은 접근하기 쉬운 곳에 보관하세요</li>
            <li>• 유통기한을 확인하고 정기적으로 교체하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

