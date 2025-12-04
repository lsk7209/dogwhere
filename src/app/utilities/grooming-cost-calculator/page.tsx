'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Calculator, ArrowLeft, Calendar, DollarSign, Info, Sparkles } from 'lucide-react'

export default function GroomingCostCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [groomingFrequency, setGroomingFrequency] = useState<string>('monthly')
  const [groomingType, setGroomingType] = useState<string>('full')
  const [customCost, setCustomCost] = useState<number>(0)
  const [useCustomCost, setUseCustomCost] = useState<boolean>(false)

  const [result, setResult] = useState<{
    perVisit: number
    monthlyCost: number
    yearlyCost: number
    visitsPerYear: number
  } | null>(null)

  const breedSizes = [
    { id: 'small', label: '소형견', desc: '5kg 미만', baseCost: 35000 },
    { id: 'medium', label: '중형견', desc: '5-15kg', baseCost: 50000 },
    { id: 'large', label: '대형견', desc: '15kg 이상', baseCost: 80000 }
  ]

  const frequencies = [
    { id: 'biweekly', label: '2주마다', visits: 24 },
    { id: 'monthly', label: '1개월마다', visits: 12 },
    { id: 'quarterly', label: '3개월마다', visits: 4 },
    { id: 'biannual', label: '6개월마다', visits: 2 }
  ]

  const types = [
    { id: 'full', label: '전체 미용', desc: '목욕 + 컷', multiplier: 1.0 },
    { id: 'bath', label: '목욕 관리', desc: '목욕 + 위생', multiplier: 0.5 },
    { id: 'trim', label: '부분 미용', desc: '얼굴/발 정리', multiplier: 0.7 }
  ]

  const calculate = () => {
    let perVisit = 0

    if (useCustomCost) {
      perVisit = customCost
    } else {
      const sizeData = breedSizes.find(s => s.id === breedSize)
      const typeData = types.find(t => t.id === groomingType)
      if (sizeData && typeData) {
        perVisit = sizeData.baseCost * typeData.multiplier
      }
    }

    const freqData = frequencies.find(f => f.id === groomingFrequency)
    const visitsPerYear = freqData ? freqData.visits : 12

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
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Scissors className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">미용비 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            정기적인 미용 관리, 연간 비용을 미리 계획해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-pink-500" />
                비용 설정
              </h2>

              <div className="space-y-8">
                {/* Custom Cost Toggle */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <span className="text-gray-700 font-medium">직접 비용 입력하기</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={useCustomCost}
                      onChange={(e) => setUseCustomCost(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>

                {!useCustomCost ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                      <div className="grid grid-cols-3 gap-3">
                        {breedSizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setBreedSize(size.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${breedSize === size.id
                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                : 'border-gray-100 hover:border-pink-200 text-gray-600'
                              }`}
                          >
                            <div className="font-bold mb-1">{size.label}</div>
                            <div className="text-xs opacity-70">{size.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">미용 종류</label>
                      <div className="grid grid-cols-3 gap-3">
                        {types.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setGroomingType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${groomingType === type.id
                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                : 'border-gray-100 hover:border-pink-200 text-gray-600'
                              }`}
                          >
                            <div className="font-bold mb-1">{type.label}</div>
                            <div className="text-xs opacity-70">{type.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">1회 미용 비용 (원)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={customCost || ''}
                        onChange={(e) => setCustomCost(parseInt(e.target.value) || 0)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">원</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">방문 주기</label>
                  <select
                    value={groomingFrequency}
                    onChange={(e) => setGroomingFrequency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.id} value={freq.id}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={calculate}
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-bold text-lg flex items-center justify-center"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  비용 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-pink-100 uppercase tracking-wider">월 평균 예상 비용</span>
                    <div className="text-4xl font-black my-4 flex items-end justify-center leading-none">
                      {result.monthlyCost.toLocaleString()}
                      <span className="text-xl ml-2 font-medium text-pink-200 mb-1">원</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      연 {result.visitsPerYear}회 방문 기준
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-pink-500" />
                        1회 비용
                      </div>
                      <span className="font-bold text-gray-900">{result.perVisit.toLocaleString()} 원</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        연간 총 비용
                      </div>
                      <span className="font-bold text-gray-900">{result.yearlyCost.toLocaleString()} 원</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    견종과 미용 주기를 선택하면<br />예상 비용을 계산해드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-rose-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-rose-400" />
                  비용 절약 팁
                </h3>
                <ul className="space-y-3 text-rose-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    정기 회원권을 이용하면 10-20% 할인이 가능합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    간단한 위생 미용(발바닥, 항문 등)은 집에서 관리해보세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    털 엉킴이 심하면 추가 요금이 발생하니 빗질을 자주 해주세요.
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
