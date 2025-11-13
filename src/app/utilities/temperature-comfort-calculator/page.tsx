'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Thermometer, Calculator } from 'lucide-react'

export default function TemperatureComfortCalculatorPage() {
  const [breedType, setBreedType] = useState<string>('average')
  const [currentTemp, setCurrentTemp] = useState<number>(20)
  const [result, setResult] = useState<{
    comfortLevel: string
    riskLevel: string
    recommendations: string[]
    idealTemp: { min: number; max: number }
  } | null>(null)

  const calculate = () => {
    let idealMin = 18
    let idealMax = 24

    // 견종별 조정
    if (breedType === 'cold') {
      idealMin = 20
      idealMax = 26 // 추위에 약한 견종 (치와와, 그레이하운드 등)
    } else if (breedType === 'hot') {
      idealMin = 15
      idealMax = 22 // 더위에 약한 견종 (허스키, 말라뮤트 등)
    }

    let comfortLevel = ''
    let riskLevel = ''
    const recommendations: string[] = []

    if (currentTemp >= idealMin && currentTemp <= idealMax) {
      comfortLevel = '적정 온도'
      riskLevel = '낮음'
      recommendations.push('현재 온도가 적정합니다', '충분한 물을 제공하세요', '정기적으로 상태를 확인하세요')
    } else if (currentTemp < idealMin - 5) {
      comfortLevel = '매우 추움'
      riskLevel = '높음'
      recommendations.push('보온 조치가 필요합니다', '따뜻한 침구를 제공하세요', '실내 온도를 높이세요', '야외 활동을 제한하세요')
    } else if (currentTemp < idealMin) {
      comfortLevel = '추움'
      riskLevel = '중간'
      recommendations.push('보온 조치를 취하세요', '따뜻한 공간을 제공하세요', '야외 활동 시간을 줄이세요')
    } else if (currentTemp > idealMax + 5) {
      comfortLevel = '매우 더움'
      riskLevel = '높음'
      recommendations.push('냉방 조치가 필요합니다', '충분한 물을 제공하세요', '야외 활동을 피하세요', '그늘진 곳을 제공하세요')
    } else {
      comfortLevel = '더움'
      riskLevel = '중간'
      recommendations.push('시원한 공간을 제공하세요', '충분한 물을 제공하세요', '야외 활동 시간을 조절하세요')
    }

    setResult({
      comfortLevel,
      riskLevel,
      recommendations,
      idealTemp: { min: idealMin, max: idealMax }
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
            <Thermometer className="w-10 h-10 text-orange-600 mr-3" />
            온도 적정성 계산기
          </h1>
          <p className="text-xl text-gray-600">
            현재 온도의 적정성을 평가합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 온도 특성
                </label>
                <select
                  value={breedType}
                  onChange={(e) => setBreedType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="cold">추위에 약함 (치와와, 그레이하운드 등)</option>
                  <option value="average">보통 (대부분의 견종)</option>
                  <option value="hot">더위에 약함 (허스키, 말라뮤트 등)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 온도 (°C)
                </label>
                <input
                  type="number"
                  min="-10"
                  max="40"
                  value={currentTemp || ''}
                  onChange={(e) => setCurrentTemp(parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
            >
              평가하기
            </button>

            {result && (
              <div className={`border-2 rounded-lg p-6 space-y-4 ${
                result.riskLevel === '높음' ? 'bg-red-50 border-red-300' :
                result.riskLevel === '중간' ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">쾌적도</p>
                  <p className={`text-3xl font-bold ${
                    result.riskLevel === '높음' ? 'text-red-700' :
                    result.riskLevel === '중간' ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    {result.comfortLevel}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">위험도: {result.riskLevel}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">적정 온도 범위</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {result.idealTemp.min}°C ~ {result.idealTemp.max}°C
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">권장 조치</p>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-orange-600">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 온도 관리 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 대부분의 강아지는 18-24°C가 적정 온도입니다</li>
            <li>• 추위에 약한 견종은 20-26°C가 적정합니다</li>
            <li>• 더위에 약한 견종은 15-22°C가 적정합니다</li>
            <li>• 더운 날씨에는 충분한 물과 그늘을 제공하세요</li>
            <li>• 추운 날씨에는 보온 조치를 취하세요</li>
            <li>• 강아지의 상태를 관찰하며 온도를 조절하세요</li>
            <li>• 극단적인 온도는 건강에 위험할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

