'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, Calculator, ArrowLeft, Info, Activity, Ruler } from 'lucide-react'

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [result, setResult] = useState<{
    bmi: number
    status: string
    idealWeight: { min: number; max: number }
    recommendation: string
    color: string
    bg: string
    border: string
  } | null>(null)

  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) return

    // 강아지 BMI 계산 (체중(kg) / 신장(m)²)
    // 참고: 강아지 BMI는 사람과 기준이 다를 수 있으나, 여기서는 일반적인 공식을 사용하고
    // 결과 해석을 강아지에 맞춰 조정합니다. (실제로는 BCS가 더 정확하지만 BMI도 참고용으로 사용)
    const heightInMeters = height / 100
    const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10

    let status = ''
    let recommendation = ''
    let color = ''
    let bg = ''
    let border = ''

    // 이상적인 체중 범위 역산
    const minIdealWeight = Math.round((18.5 * heightInMeters * heightInMeters) * 10) / 10
    const maxIdealWeight = Math.round((24.9 * heightInMeters * heightInMeters) * 10) / 10

    if (bmi < 18.5) {
      status = '저체중'
      recommendation = '체중이 부족합니다. 영양가 있는 식단으로 체중 증량이 필요할 수 있습니다.'
      color = 'text-blue-600'
      bg = 'bg-blue-50'
      border = 'border-blue-200'
    } else if (bmi >= 18.5 && bmi < 25) {
      status = '정상'
      recommendation = '아주 건강한 상태입니다! 현재의 식단과 운동량을 유지해주세요.'
      color = 'text-green-600'
      bg = 'bg-green-50'
      border = 'border-green-200'
    } else if (bmi >= 25 && bmi < 30) {
      status = '과체중'
      recommendation = '체중 관리가 필요합니다. 간식을 줄이고 산책 시간을 조금 더 늘려보세요.'
      color = 'text-yellow-600'
      bg = 'bg-yellow-50'
      border = 'border-yellow-200'
    } else {
      status = '비만'
      recommendation = '건강을 위해 체중 감량이 시급합니다. 수의사와 상담하여 다이어트 계획을 세워주세요.'
      color = 'text-red-600'
      bg = 'bg-red-50'
      border = 'border-red-200'
    }

    setResult({
      bmi,
      status,
      idealWeight: { min: minIdealWeight, max: maxIdealWeight },
      recommendation,
      color,
      bg,
      border
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BMI 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 신체 지수를 확인하고 건강한 체중을 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                신체 정보 입력
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Scale className="w-4 h-4 mr-1.5 text-gray-400" />
                    체중 (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Ruler className="w-4 h-4 mr-1.5 text-gray-400" />
                    신장 (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={height || ''}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">* 어깨 높이(체고) 기준</p>
                </div>
              </div>

              <button
                onClick={calculateBMI}
                disabled={!weight || !height}
                className="w-full mt-8 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BMI 계산하기
              </button>
            </div>

            {/* BMI Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">BMI 기준표</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="font-bold text-green-700">정상</span>
                  <span className="text-green-600 font-medium">18.5 ~ 24.9</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="font-bold text-blue-700">저체중</span>
                  <span className="text-blue-600 font-medium">18.5 미만</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <span className="font-bold text-yellow-700">과체중</span>
                  <span className="text-yellow-600 font-medium">25.0 ~ 29.9</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="font-bold text-red-700">비만</span>
                  <span className="text-red-600 font-medium">30.0 이상</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${result.border}`}>
                  <div className={`p-8 text-center ${result.bg}`}>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">BMI 지수</span>
                    <div className={`text-5xl font-black my-4 ${result.color}`}>
                      {result.bmi}
                    </div>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/50 backdrop-blur-sm ${result.color}`}>
                      {result.status}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm">권장 체중 범위</h4>
                      <div className="bg-gray-50 rounded-xl p-3 text-center font-medium text-gray-700">
                        {result.idealWeight.min}kg ~ {result.idealWeight.max}kg
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-3 text-sm">건강 조언</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 신장을 입력하고<br />계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-400" />
                  참고하세요
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    BMI는 참고용 지표이며, 근육량에 따라 다를 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    정확한 비만도 측정은 수의사의 BCS(신체충실지수) 평가를 권장합니다.
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
