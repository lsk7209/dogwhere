'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, Calculator, ArrowLeft, DollarSign, Shield, PieChart, CheckCircle, Info } from 'lucide-react'

interface Service {
  id: string
  name: string
  cost: number
  category: 'prevention' | 'checkup' | 'treatment'
  frequency: string
}

export default function VetCostCalculatorPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hasInsurance, setHasInsurance] = useState(false)
  const [insuranceRate, setInsuranceRate] = useState(70) // 70% coverage

  const services: Service[] = [
    { id: 'vaccine', name: '종합백신 (연 1회)', cost: 50000, category: 'prevention', frequency: 'yearly' },
    { id: 'heartworm', name: '심장사상충 (연간)', cost: 180000, category: 'prevention', frequency: 'yearly' },
    { id: 'checkup', name: '종합 건강검진', cost: 300000, category: 'checkup', frequency: 'yearly' },
    { id: 'scaling', name: '스케일링', cost: 150000, category: 'treatment', frequency: 'yearly' },
    { id: 'blood', name: '혈액 검사', cost: 80000, category: 'checkup', frequency: 'yearly' },
    { id: 'xray', name: 'X-ray 촬영', cost: 50000, category: 'checkup', frequency: 'yearly' },
    { id: 'neutering', name: '중성화 수술', cost: 400000, category: 'treatment', frequency: 'once' },
  ]

  const toggleService = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const totalCost = services
    .filter(s => selectedIds.includes(s.id))
    .reduce((acc, s) => acc + s.cost, 0)

  const insuranceSavings = hasInsurance ? Math.round(totalCost * (insuranceRate / 100)) : 0
  const finalCost = totalCost - insuranceSavings

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">병원비 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            예상되는 의료비를 미리 계산하고 대비하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-blue-500" />
                진료 항목 선택
              </h2>

              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedIds.includes(service.id)
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-gray-100 hover:border-blue-200 bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.includes(service.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                        {selectedIds.includes(service.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{service.name}</div>
                        <div className="text-xs text-gray-500">
                          {service.category === 'prevention' ? '예방접종' :
                            service.category === 'checkup' ? '검진' : '치료/수술'}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      {service.cost.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                참고하세요
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• 위 비용은 평균적인 금액이며 병원마다 다를 수 있습니다.</li>
                <li>• 응급 진료나 야간 진료 시 추가 비용이 발생할 수 있습니다.</li>
                <li>• 몸무게에 따라 약값이나 검사비가 달라질 수 있습니다.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-gray-500" />
                예상 비용
              </h2>

              <div className="space-y-6">
                {/* Insurance Toggle */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      보험 적용
                    </span>
                    <button
                      onClick={() => setHasInsurance(!hasInsurance)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${hasInsurance ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${hasInsurance ? 'left-7' : 'left-1'
                        }`} />
                    </button>
                  </div>
                  {hasInsurance && (
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="30"
                        max="90"
                        step="10"
                        value={insuranceRate}
                        onChange={(e) => setInsuranceRate(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-sm font-bold text-blue-600 w-12 text-right">{insuranceRate}%</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>총 진료비</span>
                    <span>{totalCost.toLocaleString()}원</span>
                  </div>
                  {hasInsurance && (
                    <div className="flex justify-between text-blue-600">
                      <span>보험 혜택 ({insuranceRate}%)</span>
                      <span>-{insuranceSavings.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                    <span className="font-bold text-lg text-gray-900">예상 본인부담금</span>
                    <span className="font-black text-3xl text-blue-600">
                      {finalCost.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500 ml-1">원</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  * 실제 청구 금액과 차이가 있을 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
