'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, AlertCircle, CheckCircle } from 'lucide-react'

interface StressFactor {
  id: string
  question: string
  options: { label: string; score: number }[]
  selected: number | null
}

const stressFactors: StressFactor[] = [
  {
    id: 'environment',
    question: '주거 환경이 어때요?',
    options: [
      { label: '조용하고 안정적', score: 1 },
      { label: '보통', score: 3 },
      { label: '시끄럽고 불안정', score: 5 }
    ],
    selected: null
  },
  {
    id: 'routine',
    question: '일상 생활 패턴이 규칙적인가요?',
    options: [
      { label: '매우 규칙적', score: 1 },
      { label: '대체로 규칙적', score: 2 },
      { label: '불규칙함', score: 5 }
    ],
    selected: null
  },
  {
    id: 'exercise',
    question: '운동량이 충분한가요?',
    options: [
      { label: '충분함', score: 1 },
      { label: '보통', score: 3 },
      { label: '부족함', score: 5 }
    ],
    selected: null
  },
  {
    id: 'social',
    question: '사회화 기회가 있나요?',
    options: [
      { label: '자주 있음', score: 1 },
      { label: '가끔 있음', score: 3 },
      { label: '거의 없음', score: 5 }
    ],
    selected: null
  },
  {
    id: 'behavior',
    question: '최근 행동 변화가 있나요?',
    options: [
      { label: '변화 없음', score: 1 },
      { label: '약간의 변화', score: 3 },
      { label: '큰 변화 (공격성, 무기력 등)', score: 5 }
    ],
    selected: null
  },
  {
    id: 'sleep',
    question: '수면 패턴은 어떤가요?',
    options: [
      { label: '정상적', score: 1 },
      { label: '약간 불안정', score: 3 },
      { label: '매우 불안정', score: 5 }
    ],
    selected: null
  },
  {
    id: 'appetite',
    question: '식욕 상태는 어떤가요?',
    options: [
      { label: '정상', score: 1 },
      { label: '약간 변화', score: 3 },
      { label: '큰 변화 (식욕 감퇴/증가)', score: 5 }
    ],
    selected: null
  }
]

export default function StressIndicatorPage() {
  const [factors, setFactors] = useState<StressFactor[]>(stressFactors)
  const [result, setResult] = useState<{
    score: number
    level: 'low' | 'medium' | 'high'
    advice: string[]
  } | null>(null)

  const selectOption = (factorId: string, score: number) => {
    setFactors(factors.map(f => 
      f.id === factorId ? { ...f, selected: score } : f
    ))
  }

  const calculate = () => {
    const totalScore = factors.reduce((sum, f) => sum + (f.selected || 0), 0)
    const avgScore = totalScore / factors.length
    
    let level: 'low' | 'medium' | 'high'
    let advice: string[]

    if (avgScore <= 2) {
      level = 'low'
      advice = [
        '현재 스트레스 수준이 낮습니다',
        '현재 생활 패턴을 유지하세요',
        '정기적인 건강 체크를 계속하세요'
      ]
    } else if (avgScore <= 3.5) {
      level = 'medium'
      advice = [
        '일부 스트레스 요인이 있습니다',
        '운동량과 사회화 기회를 늘려보세요',
        '일상 패턴의 안정성을 높이는 것을 권장합니다',
        '환경 개선을 고려해보세요'
      ]
    } else {
      level = 'high'
      advice = [
        '높은 스트레스 수준입니다. 즉시 조치가 필요합니다',
        '수의사와 상담하여 전문적인 도움을 받으세요',
        '환경을 급격히 바꾸거나 스트레스 요인을 제거하세요',
        '충분한 휴식과 안정이 필요합니다',
        '행동 전문가와 상담을 고려하세요'
      ]
    }

    setResult({
      score: Math.round(avgScore * 10) / 10,
      level,
      advice
    })
  }

  const allSelected = factors.every(f => f.selected !== null)

  const getLevelColor = () => {
    if (!result) return ''
    switch (result.level) {
      case 'low': return 'bg-green-50 border-green-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      case 'high': return 'bg-red-50 border-red-200'
    }
  }

  const getLevelIcon = () => {
    if (!result) return null
    switch (result.level) {
      case 'low': return <CheckCircle className="w-12 h-12 text-green-600" />
      case 'medium': return <AlertCircle className="w-12 h-12 text-yellow-600" />
      case 'high': return <AlertCircle className="w-12 h-12 text-red-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Brain className="w-10 h-10 text-purple-600 mr-3" />
            스트레스 지수 계산기
          </h1>
          <p className="text-xl text-gray-600">
            행동 패턴과 환경을 분석하여 스트레스 정도를 측정합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6 mb-6">
            {factors.map((factor) => (
              <div key={factor.id} className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{factor.question}</h3>
                <div className="space-y-2">
                  {factor.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        factor.selected === option.score
                          ? 'bg-purple-100 border-2 border-purple-400'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={factor.id}
                        checked={factor.selected === option.score}
                        onChange={() => selectOption(factor.id, option.score)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="flex-1">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={calculate}
            disabled={!allSelected}
            className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
              allSelected
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allSelected ? '스트레스 지수 계산하기' : '모든 질문에 답해주세요'}
          </button>

          {result && (
            <div className={`mt-6 border-2 rounded-lg p-6 ${getLevelColor()}`}>
              <div className="flex items-center space-x-4 mb-4">
                {getLevelIcon()}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    스트레스 지수: {result.score} / 5.0
                  </h3>
                  <p className="text-lg text-gray-700">
                    {result.level === 'low' ? '낮음' : result.level === 'medium' ? '보통' : '높음'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">💡 권장 사항</h4>
                <ul className="space-y-2">
                  {result.advice.map((advice, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-purple-600">•</span>
                      <span className="text-gray-700">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 스트레스 신호</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 과도한 짖기, 하울링</li>
            <li>• 파괴적 행동 (집착, 물기)</li>
            <li>• 식욕 변화</li>
            <li>• 수면 패턴 변화</li>
            <li>• 공격성 증가</li>
            <li>• 무기력, 우울 증상</li>
            <li>• 과도한 핥기, 자해 행동</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            * 만성 스트레스는 건강 문제를 유발할 수 있으므로 전문가 상담이 필요할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

