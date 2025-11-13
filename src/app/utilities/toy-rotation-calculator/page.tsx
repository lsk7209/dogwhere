'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ToyBrick, Calculator } from 'lucide-react'

export default function ToyRotationCalculatorPage() {
  const [totalToys, setTotalToys] = useState<number>(0)
  const [rotationFrequency, setRotationFrequency] = useState<string>('weekly')
  const [result, setResult] = useState<{
    toysPerRotation: number
    rotationsPerPeriod: number
    schedule: Array<{ week: number; toys: number }>
    recommendation: string
  } | null>(null)

  const calculate = () => {
    if (totalToys <= 0) return

    let toysPerRotation = Math.ceil(totalToys / 2) // 기본값 (절반씩)
    let rotationsPerPeriod = 0
    let period = '주'

    if (rotationFrequency === 'daily') {
      toysPerRotation = Math.ceil(totalToys / 3)
      rotationsPerPeriod = 7
      period = '일'
    } else if (rotationFrequency === 'weekly') {
      toysPerRotation = Math.ceil(totalToys / 2)
      rotationsPerPeriod = 4
      period = '주'
    } else if (rotationFrequency === 'biweekly') {
      toysPerRotation = Math.ceil(totalToys / 2)
      rotationsPerPeriod = 2
      period = '주'
    }

    // 4주 일정 생성
    const schedule = []
    for (let i = 1; i <= 4; i++) {
      schedule.push({
        week: i,
        toys: toysPerRotation
      })
    }

    let recommendation = ''
    if (rotationFrequency === 'daily') {
      recommendation = '매일 장난감을 교체하면 강아지의 관심을 유지할 수 있습니다.'
    } else if (rotationFrequency === 'weekly') {
      recommendation = '주간 교체는 적절한 빈도입니다. 강아지가 장난감에 지루해지지 않도록 관리하세요.'
    } else {
      recommendation = '2주마다 교체하는 것도 좋은 방법입니다. 장난감을 깨끗하게 관리하세요.'
    }

    setResult({
      toysPerRotation,
      rotationsPerPeriod,
      schedule,
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
            <ToyBrick className="w-10 h-10 text-purple-600 mr-3" />
            장난감 교체 주기 계산기
          </h1>
          <p className="text-xl text-gray-600">
            장난감 교체 주기와 일정을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전체 장난감 수
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalToys || ''}
                  onChange={(e) => setTotalToys(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  교체 빈도
                </label>
                <select
                  value={rotationFrequency}
                  onChange={(e) => setRotationFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="daily">매일</option>
                  <option value="weekly">주간</option>
                  <option value="biweekly">2주마다</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">교체당 장난감 수</p>
                  <p className="text-3xl font-bold text-purple-700">{result.toysPerRotation}개</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">4주 일정표</p>
                  <div className="space-y-2">
                    {result.schedule.map((item) => (
                      <div key={item.week} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{item.week}주차</span>
                        <span className="font-semibold text-purple-700">{item.toys}개 장난감</span>
                      </div>
                    ))}
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

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 장난감 교체 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 장난감을 교체하면 강아지의 관심을 유지할 수 있습니다</li>
            <li>• 매일 교체하면 강아지가 새로운 장난감을 기대합니다</li>
            <li>• 주간 교체는 적절한 빈도입니다</li>
            <li>• 장난감을 교체할 때는 깨끗하게 세척하세요</li>
            <li>• 손상된 장난감은 즉시 제거하세요</li>
            <li>• 다양한 종류의 장난감을 제공하세요</li>
            <li>• 강아지의 선호도를 관찰하여 장난감을 선택하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

