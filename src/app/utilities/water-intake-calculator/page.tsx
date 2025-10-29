'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplets, Calculator } from 'lucide-react'

export default function WaterIntakeCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activity, setActivity] = useState<string>('normal')
  const [weather, setWeather] = useState<string>('moderate')
  const [age, setAge] = useState<string>('adult')
  const [result, setResult] = useState<{
    dailyAmount: number
    hourlyAmount: number
    tips: string[]
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 수분 필요량 (체중 1kg당 50-60ml)
    let baseAmount = weight * 55 // 평균 55ml/kg

    // 연령별 조정
    const ageFactors: Record<string, number> = {
      puppy: 1.2,    // 강아지는 더 많은 수분 필요
      adult: 1.0,    // 성견
      senior: 0.9    // 노령견은 조금 덜 필요
    }
    baseAmount *= (ageFactors[age] || 1.0)

    // 활동량 조정
    const activityFactors: Record<string, number> = {
      low: 0.8,      // 저활동
      normal: 1.0,   // 일반 활동
      high: 1.3      // 고활동
    }
    baseAmount *= (activityFactors[activity] || 1.0)

    // 날씨 조정
    const weatherFactors: Record<string, number> = {
      cold: 0.9,     // 추운 날씨
      moderate: 1.0, // 보통 날씨
      hot: 1.2,      // 더운 날씨
      very_hot: 1.4  // 매우 더운 날씨
    }
    baseAmount *= (weatherFactors[weather] || 1.0)

    const dailyAmount = Math.round(baseAmount)
    const hourlyAmount = Math.round(dailyAmount / 24 * 10) / 10

    const tips: string[] = []
    if (dailyAmount < weight * 40) {
      tips.push('수분 섭취량이 부족할 수 있습니다. 더 자주 물을 제공하세요.')
    }
    if (weather === 'hot' || weather === 'very_hot') {
      tips.push('더운 날씨에는 수분 섭취를 늘리고 그늘진 곳에서 휴식을 취하세요.')
    }
    if (activity === 'high') {
      tips.push('고활동 강아지는 운동 후 충분한 수분 보충이 필요합니다.')
    }
    if (age === 'puppy') {
      tips.push('강아지는 성장을 위해 더 많은 수분이 필요합니다.')
    }
    if (age === 'senior') {
      tips.push('노령견은 신장 기능이 약해질 수 있으니 수의사와 상담하세요.')
    }

    setResult({
      dailyAmount,
      hourlyAmount,
      tips
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
            <Droplets className="w-10 h-10 text-blue-600 mr-3" />
            수분 섭취량 계산기
          </h1>
          <p className="text-xl text-gray-600">체중과 활동량에 따른 적정 수분 섭취량을 계산합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연령</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="puppy">강아지 (2-12개월)</option>
                <option value="adult">성견 (1-7세)</option>
                <option value="senior">노령견 (7세 이상)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">활동량</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="low">저활동</option>
                <option value="normal">일반 활동</option>
                <option value="high">고활동</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="cold">추운 날씨</option>
                <option value="moderate">보통 날씨</option>
                <option value="hot">더운 날씨</option>
                <option value="very_hot">매우 더운 날씨</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              수분 섭취량 계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">하루 권장 수분량</p>
                    <p className="text-4xl font-bold text-blue-700 mb-2">{result.dailyAmount}ml</p>
                    <p className="text-sm text-gray-500">약 {Math.round(result.dailyAmount / 1000 * 10) / 10}L</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center">
                    <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">시간당 평균</p>
                    <p className="text-4xl font-bold text-blue-700 mb-2">{result.hourlyAmount}ml</p>
                    <p className="text-sm text-gray-500">24시간 기준</p>
                  </div>
                </div>

                {result.tips.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">💡 수분 관리 팁</h4>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-blue-600">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 수분 섭취 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 성견은 체중 1kg당 50-60ml의 수분이 필요합니다</li>
            <li>• 강아지는 성장을 위해 더 많은 수분이 필요합니다</li>
            <li>• 더운 날씨나 고활동 시에는 수분 섭취를 늘려야 합니다</li>
            <li>• 물은 항상 깨끗하고 신선하게 제공하세요</li>
            <li>• 수분 부족 시 탈수 증상이 나타날 수 있으니 주의하세요</li>
            <li>• 과도한 수분 섭취도 문제가 될 수 있으니 적정량을 유지하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
