'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Calculator } from 'lucide-react'

export default function CostCalculatorPage() {
  const [inputs, setInputs] = useState({
    food: 0,
    treats: 0,
    vet: 0,
    grooming: 0,
    toys: 0,
    insurance: 0,
    etc: 0
  })

  const [result, setResult] = useState<{
    monthly: number
    yearly: number
    breakdown: Record<string, number>
  } | null>(null)

  const calculate = () => {
    const monthly = Object.values(inputs).reduce((sum, val) => sum + val, 0)
    const yearly = monthly * 12
    
    const breakdown: Record<string, number> = {}
    Object.entries(inputs).forEach(([key, value]) => {
      if (value > 0) {
        breakdown[key] = value
      }
    })

    setResult({
      monthly: Math.round(monthly),
      yearly: Math.round(yearly),
      breakdown
    })
  }

  const categories = [
    { key: 'food', label: '사료', placeholder: '월간 사료 비용 (원)' },
    { key: 'treats', label: '간식', placeholder: '월간 간식 비용 (원)' },
    { key: 'vet', label: '병원비', placeholder: '월간 평균 병원비 (원)' },
    { key: 'grooming', label: '미용', placeholder: '월간 미용비 (원)' },
    { key: 'toys', label: '장난감/용품', placeholder: '월간 장난감 비용 (원)' },
    { key: 'insurance', label: '보험료', placeholder: '월간 보험료 (원)' },
    { key: 'etc', label: '기타', placeholder: '기타 비용 (원)' }
  ]

  const getCategoryLabel = (key: string) => {
    const cat = categories.find(c => c.key === key)
    return cat?.label || key
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
            반려견 비용 계산기
          </h1>
          <p className="text-xl text-gray-600">
            사료, 병원비, 미용 등 월간/연간 예상 비용을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-4 mb-6">
            {categories.map((category) => (
              <div key={category.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {category.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs[category.key as keyof typeof inputs] || ''}
                  onChange={(e) => setInputs({
                    ...inputs,
                    [category.key]: parseFloat(e.target.value) || 0
                  })}
                  placeholder={category.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
          </div>

          <button
            onClick={calculate}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
          >
            비용 계산하기
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">월간 비용</p>
                  <p className="text-4xl font-bold text-green-700">
                    {result.monthly.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">연간 비용</p>
                  <p className="text-4xl font-bold text-green-700">
                    {result.yearly.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">비용 내역</h4>
                <div className="space-y-2">
                  {Object.entries(result.breakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, value]) => {
                      const percentage = Math.round((value / result.monthly) * 100)
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700">{getCategoryLabel(key)}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-24 text-right font-medium text-gray-900">
                              {value.toLocaleString()}원 ({percentage}%)
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 비용 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 비용은 견종, 크기, 건강 상태에 따라 크게 달라질 수 있습니다</li>
            <li>• 예비비를 포함하여 계산하는 것이 좋습니다</li>
            <li>• 보험 가입 시 의료비 부담을 줄일 수 있습니다</li>
            <li>• 대량 구매로 사료 비용을 절감할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

