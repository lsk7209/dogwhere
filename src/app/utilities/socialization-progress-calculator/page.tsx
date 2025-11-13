'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Calculator } from 'lucide-react'

interface SocializationItem {
  id: string
  name: string
  completed: boolean
}

const socializationItems: SocializationItem[] = [
  { id: 'people', name: '다양한 사람들과의 접촉', completed: false },
  { id: 'dogs', name: '다른 강아지들과의 접촉', completed: false },
  { id: 'sounds', name: '다양한 소음에 노출', completed: false },
  { id: 'surfaces', name: '다양한 바닥 재질 경험', completed: false },
  { id: 'vehicles', name: '차량에 타기', completed: false },
  { id: 'crowds', name: '사람이 많은 곳 경험', completed: false },
  { id: 'children', name: '아이들과의 접촉', completed: false },
  { id: 'veterinary', name: '동물병원 방문', completed: false },
  { id: 'grooming', name: '미용실 방문', completed: false },
  { id: 'outdoor', name: '야외 활동 경험', completed: false }
]

export default function SocializationProgressCalculatorPage() {
  const [items, setItems] = useState<SocializationItem[]>(socializationItems)
  const [result, setResult] = useState<{
    progress: number
    completed: number
    remaining: number
    recommendation: string
  } | null>(null)

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const calculate = () => {
    const completed = items.filter(item => item.completed).length
    const total = items.length
    const progress = Math.round((completed / total) * 100)
    const remaining = total - completed

    let recommendation = ''
    if (progress >= 80) {
      recommendation = '사회화가 거의 완료되었습니다! 다양한 환경에서 긍정적인 경험을 계속 제공하세요.'
    } else if (progress >= 50) {
      recommendation = '사회화가 잘 진행되고 있습니다. 남은 항목들을 완료하세요.'
    } else if (progress >= 25) {
      recommendation = '사회화 초기 단계입니다. 긍정적인 경험을 제공하며 점진적으로 노출시키세요.'
    } else {
      recommendation = '사회화를 시작하세요. 강아지가 편안해하는 환경부터 시작하여 점진적으로 확장하세요.'
    }

    setResult({
      progress,
      completed,
      remaining,
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
            <Users className="w-10 h-10 text-blue-600 mr-3" />
            사회화 진도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            사회화 훈련 진도를 평가합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                완료한 항목을 체크하세요
              </label>
              <div className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              진도 계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">사회화 진도</p>
                  <p className="text-4xl font-bold text-blue-700">{result.progress}%</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${result.progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">완료 항목</p>
                    <p className="text-2xl font-bold text-blue-700">{result.completed}개</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">남은 항목</p>
                    <p className="text-2xl font-bold text-blue-700">{result.remaining}개</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 사회화 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 사회화는 생후 3-16주가 황금기입니다</li>
            <li>• 긍정적인 경험을 제공하여 두려움을 예방하세요</li>
            <li>• 무리하게 강요하지 말고 강아지의 페이스에 맞추세요</li>
            <li>• 다양한 사람, 동물, 환경에 노출시키세요</li>
            <li>• 사회화 기간 동안 예방접종 상태를 확인하세요</li>
            <li>• 두려움을 보이면 즉시 중단하고 안전한 곳으로 이동하세요</li>
            <li>• 보상과 칭찬을 사용하여 긍정적인 연상을 만들어주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

