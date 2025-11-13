'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Flame } from 'lucide-react'

export default function DailyCalorieBurnCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [activityLevel, setActivityLevel] = useState<string>('moderate')
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(0)
  const [result, setResult] = useState<{
    bmr: number
    dailyBurn: number
    exerciseBurn: number
    totalBurn: number
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기초대사량(BMR) 계산: 70 * 체중(kg)^0.75
    const bmr = Math.round(70 * Math.pow(weight, 0.75))

    // 활동량별 계수
    const activityFactors: Record<string, number> = {
      sedentary: 1.2,    // 거의 활동 없음
      light: 1.375,      // 가벼운 활동 (주 1-3일)
      moderate: 1.55,    // 보통 활동 (주 3-5일)
      active: 1.725,     // 활발한 활동 (주 6-7일)
      veryActive: 1.9    // 매우 활발한 활동
    }

    const dailyBurn = Math.round(bmr * (activityFactors[activityLevel] || 1.55))

    // 운동 칼로리 소모량 (체중 1kg당 분당 약 0.1kcal)
    const exerciseBurn = Math.round(weight * exerciseMinutes * 0.1)

    const totalBurn = dailyBurn + exerciseBurn

    setResult({
      bmr,
      dailyBurn,
      exerciseBurn,
      totalBurn
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
            <Flame className="w-10 h-10 text-orange-600 mr-3" />
            일일 칼로리 소모량 계산기
          </h1>
          <p className="text-xl text-gray-600">
            활동량과 체중을 기반으로 강아지의 일일 칼로리 소모량을 계산합니다
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
                placeholder="예: 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동 수준
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="sedentary">거의 활동 없음 (실내 위주)</option>
                <option value="light">가벼운 활동 (주 1-3일 산책)</option>
                <option value="moderate">보통 활동 (주 3-5일 산책)</option>
                <option value="active">활발한 활동 (주 6-7일 산책)</option>
                <option value="veryActive">매우 활발한 활동 (매일 장시간 운동)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일일 운동 시간 (분)
              </label>
              <input
                type="number"
                min="0"
                value={exerciseMinutes || ''}
                onChange={(e) => setExerciseMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                placeholder="예: 60"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">기초대사량 (BMR)</p>
                  <p className="text-3xl font-bold text-orange-700">{result.bmr} kcal</p>
                  <p className="text-xs text-gray-500 mt-1">안정 상태에서 소모하는 칼로리</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일상 활동 소모량</p>
                  <p className="text-3xl font-bold text-orange-700">{result.dailyBurn} kcal</p>
                  <p className="text-xs text-gray-500 mt-1">일상 활동을 포함한 칼로리</p>
                </div>
                {result.exerciseBurn > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">운동 소모량</p>
                    <p className="text-3xl font-bold text-orange-700">{result.exerciseBurn} kcal</p>
                    <p className="text-xs text-gray-500 mt-1">추가 운동으로 소모한 칼로리</p>
                  </div>
                )}
                <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 border-2 border-orange-300">
                  <p className="text-sm text-gray-600 mb-1">총 일일 칼로리 소모량</p>
                  <p className="text-4xl font-bold text-orange-800">{result.totalBurn} kcal</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 칼로리 소모 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 기초대사량(BMR)은 생명 유지를 위해 필요한 최소 칼로리입니다</li>
            <li>• 일일 칼로리 소모량은 활동 수준에 따라 달라집니다</li>
            <li>• 체중 감량을 위해서는 소모량보다 적게 섭취해야 합니다</li>
            <li>• 체중 유지를 위해서는 소모량과 섭취량을 균형 맞춰야 합니다</li>
            <li>• 정기적으로 체중을 측정하여 칼로리 섭취량을 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

