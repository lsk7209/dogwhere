'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, DollarSign } from 'lucide-react'

export default function LifetimeCostCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [currentAge, setCurrentAge] = useState<number>(0)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(15)
  const [result, setResult] = useState<{
    remainingYears: number
    annualCost: number
    lifetimeCost: number
    breakdown: Array<{ category: string; cost: number; percentage: number }>
  } | null>(null)

  const calculate = () => {
    if (currentAge < 0 || lifeExpectancy <= currentAge) return

    const remainingYears = lifeExpectancy - currentAge

    // 연간 비용 계산 (견종 크기별)
    let baseAnnualCost = 2000000 // 기본값 (200만원)
    
    if (breedSize === 'small') {
      baseAnnualCost = 1500000 // 소형견: 150만원
    } else if (breedSize === 'large') {
      baseAnnualCost = 3000000 // 대형견: 300만원
    }

    // 연령별 조정 (노령견은 의료비 증가)
    if (currentAge >= 7) {
      baseAnnualCost = Math.round(baseAnnualCost * 1.5) // 노령견은 1.5배
    }

    const annualCost = baseAnnualCost
    const lifetimeCost = annualCost * remainingYears

    // 비용 내역
    const breakdown = [
      { category: '사료비', cost: Math.round(annualCost * 0.3), percentage: 30 },
      { category: '병원비', cost: Math.round(annualCost * 0.25), percentage: 25 },
      { category: '미용비', cost: Math.round(annualCost * 0.15), percentage: 15 },
      { category: '장난감/용품', cost: Math.round(annualCost * 0.1), percentage: 10 },
      { category: '보험료', cost: Math.round(annualCost * 0.1), percentage: 10 },
      { category: '기타', cost: Math.round(annualCost * 0.1), percentage: 10 }
    ]

    setResult({
      remainingYears,
      annualCost,
      lifetimeCost,
      breakdown
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
            <DollarSign className="w-10 h-10 text-emerald-600 mr-3" />
            생애 총 비용 계산기
          </h1>
          <p className="text-xl text-gray-600">
            강아지 생애 전체 예상 비용을 계산합니다
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
                  현재 나이 (세)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={currentAge || ''}
                  onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예상 수명 (세)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={lifeExpectancy || ''}
                onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 15)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">소형견: 12-15세, 중형견: 10-13세, 대형견: 8-12세</p>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">생애 총 예상 비용</p>
                  <p className="text-4xl font-bold text-emerald-700">{result.lifetimeCost.toLocaleString()}원</p>
                  <p className="text-sm text-gray-500 mt-2">
                    남은 {result.remainingYears}년간 연간 평균 {result.annualCost.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">연간 비용 내역</p>
                  <div className="space-y-2">
                    {result.breakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700">{item.category}</span>
                          <span className="font-semibold text-emerald-700">{item.cost.toLocaleString()}원 ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 생애 비용 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견: 생애 총 약 1,500만원 ~ 2,000만원</li>
            <li>• 중형견: 생애 총 약 2,000만원 ~ 3,000만원</li>
            <li>• 대형견: 생애 총 약 3,000만원 ~ 4,500만원</li>
            <li>• 노령견은 의료비가 증가하여 연간 비용이 높아집니다</li>
            <li>• 응급 상황 시 추가 비용이 발생할 수 있습니다</li>
            <li>• 반려동물 보험 가입으로 예상치 못한 비용을 대비하세요</li>
            <li>• 정기 검진과 예방으로 장기 비용을 절감할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

