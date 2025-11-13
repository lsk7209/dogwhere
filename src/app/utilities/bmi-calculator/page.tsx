'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, Calculator } from 'lucide-react'

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [result, setResult] = useState<{
    bmi: number
    status: string
    idealWeight: { min: number; max: number }
    recommendation: string
  } | null>(null)

  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) return

    // 강아지 BMI 계산 (체중(kg) / 신장(m)²)
    const heightInMeters = height / 100
    const bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10

    // BMI 상태 판단
    let status = ''
    let recommendation = ''
    let idealWeight = { min: 0, max: 0 }

    if (bmi < 18.5) {
      status = '저체중'
      recommendation = '체중이 부족합니다. 수의사와 상담하여 적절한 식단을 계획하세요.'
      idealWeight = {
        min: Math.round((18.5 * heightInMeters * heightInMeters) * 10) / 10,
        max: Math.round((24.9 * heightInMeters * heightInMeters) * 10) / 10
      }
    } else if (bmi >= 18.5 && bmi < 25) {
      status = '정상'
      recommendation = '건강한 체중입니다. 현재 식단과 운동을 유지하세요.'
      idealWeight = {
        min: Math.round((18.5 * heightInMeters * heightInMeters) * 10) / 10,
        max: Math.round((24.9 * heightInMeters * heightInMeters) * 10) / 10
      }
    } else if (bmi >= 25 && bmi < 30) {
      status = '과체중'
      recommendation = '체중이 약간 많습니다. 식단 조절과 운동을 통해 체중을 관리하세요.'
      idealWeight = {
        min: Math.round((18.5 * heightInMeters * heightInMeters) * 10) / 10,
        max: Math.round((24.9 * heightInMeters * heightInMeters) * 10) / 10
      }
    } else {
      status = '비만'
      recommendation = '비만 상태입니다. 수의사와 상담하여 체중 감량 계획을 수립하세요.'
      idealWeight = {
        min: Math.round((18.5 * heightInMeters * heightInMeters) * 10) / 10,
        max: Math.round((24.9 * heightInMeters * heightInMeters) * 10) / 10
      }
    }

    setResult({
      bmi,
      status,
      idealWeight,
      recommendation
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '정상':
        return 'text-green-600 bg-green-50 border-green-200'
      case '저체중':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case '과체중':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case '비만':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Scale className="w-10 h-10 text-blue-600 mr-3" />
            반려견 체질량지수(BMI) 계산기
          </h1>
          <p className="text-xl text-gray-600">
            체중과 신장을 입력하여 강아지의 BMI를 계산하고 건강 상태를 확인합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 체중 (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 10.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신장 (cm)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={height || ''}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 45"
                />
              </div>
            </div>

            <button
              onClick={calculateBMI}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              BMI 계산하기
            </button>

            {result && (
              <div className={`border-2 rounded-lg p-6 space-y-4 ${getStatusColor(result.status)}`}>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">체질량지수</p>
                  <p className="text-5xl font-bold mb-2">{result.bmi}</p>
                  <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
                    result.status === '정상' ? 'bg-green-200 text-green-800' :
                    result.status === '저체중' ? 'bg-blue-200 text-blue-800' :
                    result.status === '과체중' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {result.status}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장 체중 범위</p>
                  <p className="text-lg text-gray-900">
                    {result.idealWeight.min}kg ~ {result.idealWeight.max}kg
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 BMI 기준</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-semibold text-green-700">정상</span>
              <span className="text-gray-600">18.5 ~ 24.9</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-semibold text-blue-700">저체중</span>
              <span className="text-gray-600">18.5 미만</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-semibold text-yellow-700">과체중</span>
              <span className="text-gray-600">25.0 ~ 29.9</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-semibold text-red-700">비만</span>
              <span className="text-gray-600">30.0 이상</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 BMI 계산 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• BMI는 체중과 신장의 비율을 나타내는 지표입니다</li>
            <li>• 정확한 측정을 위해 수의사에게 체중과 신장을 측정받는 것을 권장합니다</li>
            <li>• BMI는 참고용이며, 개별 강아지의 건강 상태는 수의사와 상담해야 합니다</li>
            <li>• 근육량이 많은 강아지는 BMI가 높을 수 있으므로 전문가 상담이 필요합니다</li>
            <li>• 정기적으로 BMI를 측정하여 체중 변화를 모니터링하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

