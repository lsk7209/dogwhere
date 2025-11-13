'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cookie, Calculator } from 'lucide-react'

interface Treat {
  name: string
  caloriesPerGram: number
}

const commonTreats: Treat[] = [
  { name: '일반 강아지 간식', caloriesPerGram: 3.5 },
  { name: '닭가슴살', caloriesPerGram: 1.65 },
  { name: '사과', caloriesPerGram: 0.52 },
  { name: '당근', caloriesPerGram: 0.41 },
  { name: '치즈', caloriesPerGram: 4.0 },
  { name: '땅콩버터', caloriesPerGram: 5.9 },
  { name: '강아지 쿠키', caloriesPerGram: 4.2 },
  { name: '소고기 간식', caloriesPerGram: 2.5 },
]

export default function TreatCalorieCalculatorPage() {
  const [selectedTreat, setSelectedTreat] = useState<string>('일반 강아지 간식')
  const [treatAmount, setTreatAmount] = useState<number>(0)
  const [dailyCalories, setDailyCalories] = useState<number>(0)
  const [result, setResult] = useState<{
    treatCalories: number
    percentage: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (treatAmount <= 0 || dailyCalories <= 0) return

    const treat = commonTreats.find(t => t.name === selectedTreat) || commonTreats[0]
    const treatCalories = Math.round(treatAmount * treat.caloriesPerGram)
    const percentage = Math.round((treatCalories / dailyCalories) * 100 * 10) / 10

    let recommendation = ''
    if (percentage < 5) {
      recommendation = '간식 칼로리가 적정합니다. 일일 칼로리의 10% 이하로 유지하세요.'
    } else if (percentage >= 5 && percentage <= 10) {
      recommendation = '간식 칼로리가 적정 범위입니다. 현재 양을 유지하세요.'
    } else if (percentage > 10 && percentage <= 20) {
      recommendation = '간식 칼로리가 약간 많습니다. 간식 양을 줄이거나 저칼로리 간식으로 바꾸세요.'
    } else {
      recommendation = '간식 칼로리가 과다합니다. 간식 양을 크게 줄이거나 사료량을 조절해야 합니다.'
    }

    setResult({
      treatCalories,
      percentage,
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
            <Cookie className="w-10 h-10 text-pink-600 mr-3" />
            간식 칼로리 계산기
          </h1>
          <p className="text-xl text-gray-600">
            간식의 칼로리를 계산하여 일일 칼로리에 포함합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                간식 종류
              </label>
              <select
                value={selectedTreat}
                onChange={(e) => setSelectedTreat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                {commonTreats.map(treat => (
                  <option key={treat.name} value={treat.name}>
                    {treat.name} ({treat.caloriesPerGram}kcal/g)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  간식 양 (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={treatAmount || ''}
                  onChange={(e) => setTreatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일일 칼로리 필요량 (kcal)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dailyCalories || ''}
                  onChange={(e) => setDailyCalories(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">간식 칼로리</p>
                  <p className="text-3xl font-bold text-pink-700">{result.treatCalories} kcal</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 칼로리 대비 비율</p>
                  <p className="text-3xl font-bold text-pink-700">{result.percentage}%</p>
                  <p className="text-xs text-gray-500 mt-1">권장: 10% 이하</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 간식 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 간식은 일일 칼로리의 10% 이하로 제한하세요</li>
            <li>• 저칼로리 간식(사과, 당근 등)을 선택하세요</li>
            <li>• 고칼로리 간식(치즈, 땅콩버터 등)은 양을 조절하세요</li>
            <li>• 간식 칼로리를 계산하여 사료량을 조절하세요</li>
            <li>• 간식은 훈련 보상이나 특별한 경우에만 사용하세요</li>
            <li>• 비만 강아지는 간식 양을 줄이거나 저칼로리 간식만 사용하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

