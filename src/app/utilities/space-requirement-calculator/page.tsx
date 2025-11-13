'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Calculator } from 'lucide-react'

export default function SpaceRequirementCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    minimumSpace: number
    recommendedSpace: number
    areas: Array<{ name: string; size: string }>
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let minimumSpace = 5 // 기본값 (제곱미터)
    let recommendedSpace = 10

    // 견종 크기별 조정
    if (breedSize === 'small') {
      minimumSpace = 3
      recommendedSpace = 6
    } else if (breedSize === 'large') {
      minimumSpace = 10
      recommendedSpace = 20
    }

    // 활동량 조정
    if (activityLevel === 'high') {
      recommendedSpace = Math.round(recommendedSpace * 1.5)
    } else if (activityLevel === 'low') {
      recommendedSpace = Math.round(recommendedSpace * 0.8)
    }

    const areas = [
      { name: '수면 공간', size: `${Math.round(minimumSpace * 0.3 * 10) / 10}㎡` },
      { name: '식사 공간', size: `${Math.round(minimumSpace * 0.2 * 10) / 10}㎡` },
      { name: '놀이 공간', size: `${Math.round(minimumSpace * 0.3 * 10) / 10}㎡` },
      { name: '배변 공간', size: `${Math.round(minimumSpace * 0.2 * 10) / 10}㎡` }
    ]

    let recommendation = ''
    if (breedSize === 'large' && activityLevel === 'high') {
      recommendation = '대형견과 고활동 강아지는 넓은 공간이 필요합니다. 야외 활동 공간도 확보하세요.'
    } else if (breedSize === 'small') {
      recommendation = '소형견은 작은 공간에서도 생활할 수 있지만, 충분한 운동 공간을 제공하세요.'
    } else {
      recommendation = '충분한 공간을 제공하여 강아지가 편안하게 생활할 수 있도록 하세요.'
    }

    setResult({
      minimumSpace,
      recommendedSpace,
      areas,
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
            <Home className="w-10 h-10 text-green-600 mr-3" />
            생활 공간 계산기
          </h1>
          <p className="text-xl text-gray-600">
            필요한 생활 공간을 계산합니다
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
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">최소 공간</p>
                    <p className="text-3xl font-bold text-green-700">{result.minimumSpace}㎡</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">권장 공간</p>
                    <p className="text-3xl font-bold text-green-700">{result.recommendedSpace}㎡</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">공간 구성</p>
                  <div className="space-y-2">
                    {result.areas.map((area, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{area.name}</span>
                        <span className="font-semibold text-green-700">{area.size}</span>
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

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 생활 공간 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 소형견: 최소 3㎡, 권장 6㎡</li>
            <li>• 중형견: 최소 5㎡, 권장 10㎡</li>
            <li>• 대형견: 최소 10㎡, 권장 20㎡</li>
            <li>• 고활동 강아지는 더 넓은 공간이 필요합니다</li>
            <li>• 수면, 식사, 놀이, 배변 공간을 구분하세요</li>
            <li>• 안전하고 편안한 환경을 제공하세요</li>
            <li>• 야외 활동 공간도 확보하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

