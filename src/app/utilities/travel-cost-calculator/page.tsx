'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plane, Calculator, ArrowLeft, Hotel, Car, Utensils, DollarSign, Wallet, AlertCircle } from 'lucide-react'

export default function TravelCostCalculatorPage() {
  const [days, setDays] = useState<number>(2)
  const [people, setPeople] = useState<number>(2)
  const [transport, setTransport] = useState<'car' | 'train' | 'flight'>('car')
  const [stay, setStay] = useState<'pension' | 'hotel' | 'camping'>('pension')

  const calculate = () => {
    let total = 0

    // Transport (Round trip)
    const transportCost = transport === 'car' ? 50000 : transport === 'train' ? 80000 * people : 200000 * people

    // Stay (Per night)
    const stayCost = (stay === 'pension' ? 150000 : stay === 'hotel' ? 250000 : 80000) * days

    // Pet Fee (Per night)
    const petFee = (stay === 'hotel' ? 30000 : 20000) * days

    // Food (Per person per day)
    const foodCost = 40000 * people * days

    total = transportCost + stayCost + petFee + foodCost

    return { total, transportCost, stayCost, petFee, foodCost }
  }

  const costs = calculate()

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
              <Plane className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">여행 예산 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            설레는 여행, 예산부터 꼼꼼하게 챙겨보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-500" />
                여행 정보
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">여행 기간 ({days}박 {days + 1}일)</label>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">인원 ({people}명)</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={people}
                    onChange={(e) => setPeople(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">이동 수단</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'car', label: '자차', icon: Car },
                      { id: 'train', label: '기차', icon: Calculator }, // Using Calculator as placeholder for Train
                      { id: 'flight', label: '비행기', icon: Plane },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setTransport(item.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${transport === item.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 hover:border-green-200 text-gray-600'
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="font-bold text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">숙소 유형</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'pension', label: '펜션' },
                      { id: 'hotel', label: '호텔' },
                      { id: 'camping', label: '캠핑' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setStay(item.id as any)}
                        className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${stay === item.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 hover:border-green-200 text-gray-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Receipt */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
              {/* Receipt Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-500" />

              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center justify-between">
                <span className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-green-500" />
                  예상 견적서
                </span>
                <span className="text-sm text-gray-400 font-normal">
                  {new Date().toLocaleDateString()} 기준
                </span>
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">교통비</span>
                  </div>
                  <span className="font-bold text-gray-900">{costs.transportCost.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Hotel className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">숙박비 ({days}박)</span>
                  </div>
                  <span className="font-bold text-gray-900">{costs.stayCost.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">반려견 추가 요금</span>
                  </div>
                  <span className="font-bold text-green-700">{costs.petFee.toLocaleString()}원</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">식비 및 기타</span>
                  </div>
                  <span className="font-bold text-gray-900">{costs.foodCost.toLocaleString()}원</span>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-6 flex justify-between items-end">
                <span className="text-gray-500 font-medium">총 예상 비용</span>
                <span className="text-4xl font-black text-green-600">
                  {costs.total.toLocaleString()}
                  <span className="text-lg text-gray-400 ml-1 font-normal">원</span>
                </span>
              </div>

              <div className="mt-6 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  성수기/비수기에 따라 숙박비와 항공권 가격이 크게 달라질 수 있습니다.
                  위 견적은 평균적인 비용을 기준으로 계산되었습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
