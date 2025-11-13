'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Calculator } from 'lucide-react'

export default function WalkingDistanceCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [walkingSpeed, setWalkingSpeed] = useState<string>('normal')
  const [result, setResult] = useState<{
    distance: number
    time: number
    calories: number
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let distance = 2 // 기본값 (km)
    let speed = 4 // 기본 속도 (km/h)
    
    // 견종 크기별 조정
    if (breedSize === 'small') {
      distance = 1.5
      speed = 3.5
    } else if (breedSize === 'large') {
      distance = 3
      speed = 5
    }

    // 연령별 조정
    if (age === 'puppy') {
      distance *= 0.5
      speed = 3
    } else if (age === 'senior') {
      distance *= 0.7
      speed = 3.5
    }

    // 속도 조정
    if (walkingSpeed === 'slow') {
      speed = 3
    } else if (walkingSpeed === 'fast') {
      speed = 5.5
    }

    const time = Math.round((distance / speed) * 60) // 분 단위
    const calories = Math.round(distance * 20) // 대략적인 칼로리 소모량

    let recommendation = ''
    if (age === 'puppy') {
      recommendation = '강아지는 짧은 거리를 천천히 걷는 것이 좋습니다. 여러 번 나누어 산책하세요.'
    } else if (age === 'senior') {
      recommendation = '노령견은 무리하지 않는 거리를 천천히 걷는 것이 좋습니다.'
    } else {
      recommendation = '규칙적인 산책으로 건강을 유지하세요. 날씨와 건강 상태를 고려하세요.'
    }

    setResult({
      distance: Math.round(distance * 10) / 10,
      time,
      calories,
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
            <MapPin className="w-10 h-10 text-blue-600 mr-3" />
            산책 거리 계산기
          </h1>
          <p className="text-xl text-gray-600">
            적정 산책 거리와 시간을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 크기
                </label>
                <select
                  value={breedSize}
                  onChange={(e) => setBreedSize(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="small">소형견</option>
                  <option value="medium">중형견</option>
                  <option value="large">대형견</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연령
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="puppy">강아지 (2-12개월)</option>
                  <option value="young">청견 (1-2세)</option>
                  <option value="adult">성견 (2-7세)</option>
                  <option value="senior">노령견 (7세 이상)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                산책 속도
                </label>
              <select
                value={walkingSpeed}
                onChange={(e) => setWalkingSpeed(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="slow">느리게</option>
                <option value="normal">보통</option>
                <option value="fast">빠르게</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">산책 거리</p>
                    <p className="text-2xl font-bold text-blue-700">{result.distance}km</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">소요 시간</p>
                    <p className="text-2xl font-bold text-blue-700">{result.time}분</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">예상 칼로리</p>
                    <p className="text-2xl font-bold text-blue-700">{result.calories}kcal</p>
                  </div>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 산책 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견: 1-2km 정도의 산책이 적절합니다</li>
            <li>• 중형견: 2-3km 정도의 산책이 적절합니다</li>
            <li>• 대형견: 3-5km 이상의 산책이 필요합니다</li>
            <li>• 강아지는 짧은 거리를 여러 번 나누어 산책하세요</li>
            <li>• 노령견은 무리하지 않는 거리를 천천히 걷는 것이 좋습니다</li>
            <li>• 날씨가 더우면 거리를 줄이고 시간을 조절하세요</li>
            <li>• 강아지의 상태를 관찰하며 산책하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

