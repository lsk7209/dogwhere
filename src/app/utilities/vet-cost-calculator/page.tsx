'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Calculator } from 'lucide-react'

interface VetService {
  name: string
  frequency: string
  cost: number
}

const vetServices: VetService[] = [
  { name: '종합 건강검진', frequency: '연 1회', cost: 100000 },
  { name: '예방접종 (종합백신)', frequency: '연 1회', cost: 50000 },
  { name: '예방접종 (켄넬코프)', frequency: '연 1회', cost: 30000 },
  { name: '광견병 예방접종', frequency: '1-3년마다', cost: 20000 },
  { name: '구충제', frequency: '월 1회', cost: 15000 },
  { name: '치과 검진 및 스케일링', frequency: '연 1-2회', cost: 150000 },
  { name: '혈액 검사', frequency: '연 1회', cost: 80000 },
  { name: 'X-ray 촬영', frequency: '필요시', cost: 100000 },
]

export default function VetCostCalculatorPage() {
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<{
    annualCost: number
    monthlyCost: number
    services: Array<{ name: string; cost: number; frequency: string }>
  } | null>(null)

  const toggleService = (index: number) => {
    setSelectedServices(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const calculate = () => {
    const selected = vetServices
      .map((service, index) => selectedServices[index] ? service : null)
      .filter(Boolean) as VetService[]

    if (selected.length === 0) return

    let annualCost = 0
    const services = selected.map(service => {
      let cost = service.cost
      if (service.frequency.includes('월')) {
        cost = service.cost * 12
      } else if (service.frequency.includes('연')) {
        cost = service.cost
      } else if (service.frequency.includes('1-3년')) {
        cost = service.cost / 2 // 평균 2년마다
      }
      annualCost += cost
      return {
        name: service.name,
        cost: Math.round(cost),
        frequency: service.frequency
      }
    })

    const monthlyCost = Math.round(annualCost / 12)

    setResult({
      annualCost: Math.round(annualCost),
      monthlyCost,
      services
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
            <Stethoscope className="w-10 h-10 text-red-600 mr-3" />
            병원비 계산기
          </h1>
          <p className="text-xl text-gray-600">
            예방접종, 검진 등 병원비 예상을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                받을 서비스 선택
              </label>
              <div className="space-y-2">
                {vetServices.map((service, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedServices[index] || false}
                        onChange={() => toggleService(index)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.frequency}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{service.cost.toLocaleString()}원</p>
                  </label>
                ))}
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">연간 예상 비용</p>
                    <p className="text-3xl font-bold text-red-700">{result.annualCost.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">월간 예상 비용</p>
                    <p className="text-3xl font-bold text-red-700">{result.monthlyCost.toLocaleString()}원</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">선택한 서비스</p>
                  <div className="space-y-2">
                    {result.services.map((service, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{service.name}</span>
                        <span className="font-semibold text-red-700">{service.cost.toLocaleString()}원/년</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 병원비 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 예방접종은 필수이며 정기적으로 받아야 합니다</li>
            <li>• 종합 건강검진은 연 1회 권장됩니다</li>
            <li>• 구충제는 월 1회 정기적으로 투여해야 합니다</li>
            <li>• 치과 관리도 중요하므로 정기 검진을 받으세요</li>
            <li>• 응급 상황 시 추가 비용이 발생할 수 있습니다</li>
            <li>• 반려동물 보험 가입을 고려하세요</li>
            <li>• 지역별, 병원별 가격 차이가 있을 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

