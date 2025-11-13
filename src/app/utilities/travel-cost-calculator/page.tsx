'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plane, Calculator } from 'lucide-react'

export default function TravelCostCalculatorPage() {
  const [travelType, setTravelType] = useState<string>('domestic')
  const [duration, setDuration] = useState<number>(2)
  const [accommodationType, setAccommodationType] = useState<string>('petFriendly')
  const [result, setResult] = useState<{
    totalCost: number
    breakdown: Array<{ item: string; cost: number }>
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (duration <= 0) return

    const breakdown: Array<{ item: string; cost: number }> = []
    let totalCost = 0

    // 교통비
    if (travelType === 'domestic') {
      const transportCost = 50000 // 국내 여행 교통비 (렌터카 등)
      breakdown.push({ item: '교통비', cost: transportCost })
      totalCost += transportCost
    } else {
      const transportCost = 200000 // 해외 여행 교통비 (항공료 등)
      breakdown.push({ item: '교통비 (항공료)', cost: transportCost })
      totalCost += transportCost
    }

    // 숙소비
    let accommodationCost = 0
    if (accommodationType === 'petFriendly') {
      accommodationCost = 100000 * duration // 펫프렌들리 숙소
    } else if (accommodationType === 'hotel') {
      accommodationCost = 150000 * duration // 펫 동반 호텔
    } else {
      accommodationCost = 80000 * duration // 펜션
    }
    breakdown.push({ item: `숙소비 (${duration}박)`, cost: accommodationCost })
    totalCost += accommodationCost

    // 식비
    const foodCost = 50000 * duration
    breakdown.push({ item: '식비', cost: foodCost })
    totalCost += foodCost

    // 기타 비용 (입장료, 간식 등)
    const otherCost = 30000 * duration
    breakdown.push({ item: '기타 비용', cost: otherCost })
    totalCost += otherCost

    let recommendation = ''
    if (travelType === 'domestic') {
      recommendation = '국내 여행은 비교적 저렴하게 즐길 수 있습니다. 펫프렌들리 숙소를 미리 예약하세요.'
    } else {
      recommendation = '해외 여행은 추가 서류와 검역 비용이 필요합니다. 충분한 준비와 예산을 확보하세요.'
    }

    setResult({
      totalCost,
      breakdown,
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
            <Plane className="w-10 h-10 text-indigo-600 mr-3" />
            여행 비용 계산기
          </h1>
          <p className="text-xl text-gray-600">
            강아지 동반 여행 비용을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행 종류
                </label>
                <select
                  value={travelType}
                  onChange={(e) => setTravelType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="domestic">국내 여행</option>
                  <option value="international">해외 여행</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행 기간 (박)
                </label>
                <input
                  type="number"
                  min="1"
                  value={duration || ''}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                숙소 종류
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="petFriendly">펫프렌들리 숙소</option>
                <option value="hotel">펫 동반 호텔</option>
                <option value="pension">펜션</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">총 예상 비용</p>
                  <p className="text-4xl font-bold text-indigo-700">{result.totalCost.toLocaleString()}원</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">비용 내역</p>
                  <div className="space-y-2">
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{item.item}</span>
                        <span className="font-semibold text-indigo-700">{item.cost.toLocaleString()}원</span>
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

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 여행 비용 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 국내 여행은 해외 여행보다 저렴합니다</li>
            <li>• 펫프렌들리 숙소는 일반 숙소보다 비쌀 수 있습니다</li>
            <li>• 해외 여행은 항공료와 검역 비용이 추가됩니다</li>
            <li>• 여행 기간이 길수록 비용이 증가합니다</li>
            <li>• 시즌별로 숙소 가격이 달라질 수 있습니다</li>
            <li>• 여행 보험 가입을 고려하세요</li>
            <li>• 응급 상황을 대비한 예비 비용을 준비하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

