'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplet, Calculator } from 'lucide-react'

export default function WaterIntakeCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [weather, setWeather] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyWater: number
    hourlyWater: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 물 섭취량: 체중 1kg당 50-100ml
    let baseWater = weight * 70 // 기본값 (ml)
    
    // 활동량 조정
    if (activityLevel === 'low') {
      baseWater *= 0.9
    } else if (activityLevel === 'high') {
      baseWater *= 1.3
    } else if (activityLevel === 'veryHigh') {
      baseWater *= 1.5
    }

    // 날씨 조정
    if (weather === 'hot') {
      baseWater *= 1.5 // 더운 날씨
    } else if (weather === 'cold') {
      baseWater *= 0.9 // 추운 날씨
    }

    const dailyWater = Math.round(baseWater)
    const hourlyWater = Math.round(dailyWater / 24)

    let recommendation = ''
    if (dailyWater < weight * 50) {
      recommendation = '물 섭취량이 부족합니다. 충분한 물을 제공하세요.'
    } else if (dailyWater > weight * 150) {
      recommendation = '물 섭취량이 과다할 수 있습니다. 건강 상태를 확인하세요.'
    } else {
      recommendation = '적정한 물 섭취량입니다. 항상 깨끗한 물을 제공하세요.'
    }

    setResult({
      dailyWater,
      hourlyWater,
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
            <Droplet className="w-10 h-10 text-blue-600 mr-3" />
            물 섭취량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            일일 물 섭취량을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  활동량
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">저활동</option>
                  <option value="normal">일반 활동</option>
                  <option value="high">고활동</option>
                  <option value="veryHigh">매우 활발</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날씨
                </label>
                <select
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="normal">보통</option>
                  <option value="hot">더운 날씨</option>
                  <option value="cold">추운 날씨</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 물 섭취량</p>
                  <p className="text-4xl font-bold text-blue-700">{result.dailyWater}ml</p>
                  <p className="text-sm text-gray-500 mt-1">약 {Math.round(result.dailyWater / 1000 * 10) / 10}L</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">시간당 물 섭취량</p>
                  <p className="text-2xl font-bold text-blue-700">{result.hourlyWater}ml</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 물 섭취량 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 체중 1kg당 하루 50-100ml의 물이 필요합니다</li>
            <li>• 활발한 활동을 하는 강아지는 더 많은 물이 필요합니다</li>
            <li>• 더운 날씨에는 물 섭취량이 증가합니다</li>
            <li>• 항상 깨끗한 물을 제공하세요</li>
            <li>• 물 그릇을 여러 곳에 배치하세요</li>
            <li>• 물 섭취량이 급격히 증가하면 건강 문제일 수 있습니다</li>
            <li>• 물 섭취량이 부족하면 탈수 위험이 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
