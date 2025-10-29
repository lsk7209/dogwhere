'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Calculator } from 'lucide-react'

export default function PlaytimeCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [breed, setBreed] = useState<string>('medium')
  const [health, setHealth] = useState<string>('good')
  const [result, setResult] = useState<{
    dailyPlaytime: number
    sessionLength: number
    activities: string[]
    tips: string[]
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 놀이 시간 (분)
    let basePlaytime = 30

    // 연령별 조정
    const ageFactors: Record<string, number> = {
      puppy: 1.5,    // 강아지는 더 많은 놀이 필요
      adult: 1.0,    // 성견
      senior: 0.7    // 노령견은 조금 덜 필요
    }
    basePlaytime *= (ageFactors[age] || 1.0)

    // 견종별 조정
    const breedFactors: Record<string, number> = {
      small: 0.8,    // 소형견
      medium: 1.0,   // 중형견
      large: 1.2,    // 대형견
      working: 1.5   // 작업견
    }
    basePlaytime *= (breedFactors[breed] || 1.0)

    // 건강 상태 조정
    const healthFactors: Record<string, number> = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.5
    }
    basePlaytime *= (healthFactors[health] || 1.0)

    const dailyPlaytime = Math.round(basePlaytime)
    const sessionLength = Math.min(Math.round(dailyPlaytime / 3), 30) // 최대 30분 세션

    const activities = getRecommendedActivities(age, breed, health)
    const tips = getPlaytimeTips(age, breed, health, dailyPlaytime)

    setResult({
      dailyPlaytime,
      sessionLength,
      activities,
      tips
    })
  }

  const getRecommendedActivities = (age: string, breed: string, health: string) => {
    const activities: string[] = []

    // 연령별 활동
    if (age === 'puppy') {
      activities.push('기본 놀이', '사회화 놀이', '간단한 훈련 게임')
    } else if (age === 'adult') {
      activities.push('공놀이', '산책', '퍼즐 장난감')
    } else if (age === 'senior') {
      activities.push('가벼운 산책', '부드러운 놀이', '정신 자극 게임')
    }

    // 견종별 활동
    if (breed === 'working') {
      activities.push('훈련 게임', '정신 자극 활동', '체력 활동')
    } else if (breed === 'small') {
      activities.push('실내 놀이', '부드러운 장난감', '간단한 퍼즐')
    }

    // 건강 상태별 활동
    if (health === 'excellent' || health === 'good') {
      activities.push('활발한 놀이', '운동 게임')
    } else if (health === 'fair' || health === 'poor') {
      activities.push('부드러운 놀이', '정신 자극 활동')
    }

    return [...new Set(activities)] // 중복 제거
  }

  const getPlaytimeTips = (age: string, breed: string, health: string, playtime: number) => {
    const tips: string[] = []

    if (age === 'puppy') {
      tips.push('강아지는 성장을 위해 충분한 휴식도 필요합니다')
      tips.push('짧은 세션으로 나누어 놀아주세요')
    }

    if (breed === 'working') {
      tips.push('작업견은 정신적 자극이 중요합니다')
      tips.push('훈련과 놀이를 결합해보세요')
    }

    if (health === 'fair' || health === 'poor') {
      tips.push('건강 상태를 고려하여 무리하지 마세요')
      tips.push('수의사와 상담 후 활동량을 조절하세요')
    }

    if (playtime > 120) {
      tips.push('놀이 시간이 많으니 충분한 휴식을 제공하세요')
    }

    return tips
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Play className="w-10 h-10 text-green-600 mr-3" />
            놀이 시간 계산기
          </h1>
          <p className="text-xl text-gray-600">연령과 견종에 따른 적정 놀이 시간을 계산합니다</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">견종 크기</label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="small">소형견 (5kg 이하)</option>
                <option value="medium">중형견 (5-25kg)</option>
                <option value="large">대형견 (25kg 이상)</option>
                <option value="working">작업견/헌팅견</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">건강 상태</label>
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="excellent">매우 좋음</option>
                <option value="good">좋음</option>
                <option value="fair">보통</option>
                <option value="poor">나쁨</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              놀이 시간 계산하기
            </button>

            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <Play className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">하루 권장 놀이 시간</p>
                    <p className="text-4xl font-bold text-green-700 mb-2">{result.dailyPlaytime}분</p>
                    <p className="text-sm text-gray-500">약 {Math.round(result.dailyPlaytime / 60 * 10) / 10}시간</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 text-center">
                    <Calculator className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">권장 세션 길이</p>
                    <p className="text-4xl font-bold text-green-700 mb-2">{result.sessionLength}분</p>
                    <p className="text-sm text-gray-500">세션당</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">🎾 추천 활동</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.activities.map((activity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {result.tips.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">💡 놀이 시간 팁</h4>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-green-600">•</span>
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

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 놀이 시간 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 성장을 위해 더 많은 놀이가 필요합니다</li>
            <li>• 노령견은 무리한 놀이보다는 가벼운 활동이 좋습니다</li>
            <li>• 작업견은 정신적 자극이 포함된 놀이가 필요합니다</li>
            <li>• 놀이 시간을 여러 세션으로 나누어 제공하세요</li>
            <li>• 강아지의 상태를 관찰하며 적절히 조절하세요</li>
            <li>• 과도한 놀이는 오히려 스트레스를 줄 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
