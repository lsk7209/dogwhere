'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Calculator } from 'lucide-react'

export default function GroomingCostCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [groomingFrequency, setGroomingFrequency] = useState<string>('monthly')
  const [groomingType, setGroomingType] = useState<string>('full')
  const [result, setResult] = useState<{
    perVisit: number
    monthlyCost: number
    yearlyCost: number
    visitsPerYear: number
  } | null>(null)

  const calculate = () => {
    let baseCost = 30000 // 기본값
    
    // 견종 크기별 조정
    if (breedSize === 'small') {
      baseCost = 25000
    } else if (breedSize === 'large') {
      baseCost = 50000
    }

    // 미용 종류별 조정
    if (groomingType === 'full') {
      baseCost = baseCost // 전체 미용
    } else if (groomingType === 'bath') {
      baseCost = Math.round(baseCost * 0.5) // 목욕만
    } else if (groomingType === 'trim') {
      baseCost = Math.round(baseCost * 0.7) // 털 정리만
    }

    const perVisit = baseCost

    // 빈도별 계산
    let visitsPerYear = 12
    if (groomingFrequency === 'biweekly') {
      visitsPerYear = 24
    } else if (groomingFrequency === 'monthly') {
      visitsPerYear = 12
    } else if (groomingFrequency === 'quarterly') {
      visitsPerYear = 4
    } else if (groomingFrequency === 'biannual') {
      visitsPerYear = 2
    }

    const yearlyCost = perVisit * visitsPerYear
    const monthlyCost = Math.round(yearlyCost / 12)

    setResult({
      perVisit,
      monthlyCost,
      yearlyCost,
      visitsPerYear
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
            <Scissors className="w-10 h-10 text-pink-600 mr-3" />
            미용비 계산기
          </h1>
          <p className="text-xl text-gray-600">
            미용 주기별 연간 비용을 계산합니다
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
                  미용 빈도
                </label>
                <select
                  value={groomingFrequency}
                  onChange={(e) => setGroomingFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="biweekly">2주마다</option>
                  <option value="monthly">1개월마다</option>
                  <option value="quarterly">3개월마다</option>
                  <option value="biannual">6개월마다</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                미용 종류
              </label>
              <select
                value={groomingType}
                onChange={(e) => setGroomingType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="full">전체 미용 (털 정리 + 목욕)</option>
                <option value="bath">목욕만</option>
                <option value="trim">털 정리만</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">1회 미용비</p>
                    <p className="text-2xl font-bold text-pink-700">{result.perVisit.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">월간 비용</p>
                    <p className="text-2xl font-bold text-pink-700">{result.monthlyCost.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">연간 비용</p>
                    <p className="text-2xl font-bold text-pink-700">{result.yearlyCost.toLocaleString()}원</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">연간 방문 횟수</p>
                  <p className="text-xl font-bold text-pink-700">{result.visitsPerYear}회</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 미용비 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견: 25,000원 ~ 30,000원</li>
            <li>• 중형견: 30,000원 ~ 40,000원</li>
            <li>• 대형견: 40,000원 ~ 60,000원</li>
            <li>• 털이 긴 견종은 더 자주 미용이 필요합니다</li>
            <li>• 정기적인 미용은 피부 건강과 털 관리에 중요합니다</li>
            <li>• 지역별, 미용실별 가격 차이가 있을 수 있습니다</li>
            <li>• 정기 고객 할인을 받을 수 있는 곳을 찾아보세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

