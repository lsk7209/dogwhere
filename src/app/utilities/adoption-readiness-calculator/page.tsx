'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Calculator } from 'lucide-react'

interface ReadinessItem {
  id: string
  name: string
  checked: boolean
}

const readinessItems: ReadinessItem[] = [
  { id: 'time', name: '충분한 시간 확보', checked: false },
  { id: 'space', name: '적절한 생활 공간', checked: false },
  { id: 'budget', name: '충분한 예산 준비', checked: false },
  { id: 'knowledge', name: '반려견 지식 습득', checked: false },
  { id: 'family', name: '가족 동의', checked: false },
  { id: 'lifestyle', name: '라이프스타일 조정 가능', checked: false },
  { id: 'emergency', name: '응급 상황 대비', checked: false },
  { id: 'commitment', name: '장기적 책임 수용', checked: false }
]

export default function AdoptionReadinessCalculatorPage() {
  const [items, setItems] = useState<ReadinessItem[]>(readinessItems)
  const [result, setResult] = useState<{
    readiness: number
    level: string
    missingItems: string[]
    recommendation: string
  } | null>(null)

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const calculate = () => {
    const checked = items.filter(item => item.checked).length
    const total = items.length
    const readiness = Math.round((checked / total) * 100)
    const missingItems = items.filter(item => !item.checked).map(item => item.name)

    let level = ''
    let recommendation = ''

    if (readiness >= 90) {
      level = '매우 준비됨'
      recommendation = '반려견 입양 준비가 매우 잘 되어 있습니다! 입양을 진행해도 좋습니다.'
    } else if (readiness >= 75) {
      level = '준비됨'
      recommendation = '반려견 입양 준비가 잘 되어 있습니다. 부족한 부분을 보완하면 입양할 수 있습니다.'
    } else if (readiness >= 50) {
      level = '부분 준비됨'
      recommendation = '일부 준비가 되어 있지만, 더 준비가 필요합니다. 부족한 항목을 완료하세요.'
    } else {
      level = '준비 부족'
      recommendation = '반려견 입양 준비가 부족합니다. 충분히 준비한 후 입양을 고려하세요.'
    }

    setResult({
      readiness,
      level,
      missingItems,
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
            <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
            입양 준비도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            반려견 입양 준비 상태를 평가합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                준비된 항목을 체크하세요
              </label>
              <div className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <span className={item.checked ? 'text-gray-900 font-medium' : 'text-gray-700'}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              평가하기
            </button>

            {result && (
              <div className={`border-2 rounded-lg p-6 space-y-4 ${
                result.readiness >= 75 ? 'bg-green-50 border-green-300' :
                result.readiness >= 50 ? 'bg-yellow-50 border-yellow-300' :
                'bg-red-50 border-red-300'
              }`}>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">준비도</p>
                  <p className={`text-4xl font-bold ${
                    result.readiness >= 75 ? 'text-green-700' :
                    result.readiness >= 50 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {result.readiness}%
                  </p>
                  <p className="text-lg font-semibold mt-2">{result.level}</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        result.readiness >= 75 ? 'bg-green-600' :
                        result.readiness >= 50 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${result.readiness}%` }}
                    />
                  </div>
                </div>
                {result.missingItems.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">부족한 항목</p>
                    <ul className="space-y-2">
                      {result.missingItems.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-600">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 입양 준비 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 충분한 시간과 에너지를 확보하세요</li>
            <li>• 적절한 생활 공간을 준비하세요</li>
            <li>• 반려견 비용(사료, 병원, 미용 등)을 예산에 포함하세요</li>
            <li>• 반려견에 대한 지식을 충분히 습득하세요</li>
            <li>• 가족 구성원 모두의 동의를 받으세요</li>
            <li>• 라이프스타일을 조정할 준비를 하세요</li>
            <li>• 응급 상황에 대비하세요</li>
            <li>• 장기적인 책임을 수용할 준비를 하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

