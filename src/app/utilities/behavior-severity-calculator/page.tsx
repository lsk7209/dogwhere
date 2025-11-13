'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Calculator } from 'lucide-react'

interface BehaviorSymptom {
  id: string
  name: string
  severity: number
}

const behaviorSymptoms: BehaviorSymptom[] = [
  { id: 'aggression', name: '공격성 (물기, 으르렁거림)', severity: 0 },
  { id: 'barking', name: '과도한 짖음', severity: 0 },
  { id: 'destruction', name: '파괴 행동', severity: 0 },
  { id: 'anxiety', name: '불안 증상', severity: 0 },
  { id: 'separation', name: '분리불안', severity: 0 },
  { id: 'jumping', name: '사람에게 뛰어오르기', severity: 0 },
  { id: 'pulling', name: '목줄 당기기', severity: 0 },
  { id: 'chewing', name: '부적절한 물어뜯기', severity: 0 }
]

export default function BehaviorSeverityCalculatorPage() {
  const [symptoms, setSymptoms] = useState<BehaviorSymptom[]>(behaviorSymptoms)
  const [result, setResult] = useState<{
    totalSeverity: number
    severityLevel: string
    recommendation: string
    urgentActions: string[]
  } | null>(null)

  const updateSeverity = (id: string, severity: number) => {
    setSymptoms(symptoms.map(symptom =>
      symptom.id === id ? { ...symptom, severity } : symptom
    ))
  }

  const calculate = () => {
    const totalSeverity = symptoms.reduce((sum, symptom) => sum + symptom.severity, 0)
    const maxSeverity = symptoms.length * 5
    const severityPercent = Math.round((totalSeverity / maxSeverity) * 100)

    let severityLevel = ''
    let recommendation = ''
    const urgentActions: string[] = []

    if (severityPercent >= 70) {
      severityLevel = '매우 심각'
      recommendation = '문제 행동이 매우 심각합니다. 즉시 전문가(수의사, 행동 전문가)와 상담하세요.'
      urgentActions.push('즉시 전문가 상담', '안전 조치 취하기', '응급 상황 대비')
    } else if (severityPercent >= 50) {
      severityLevel = '심각'
      recommendation = '문제 행동이 심각합니다. 전문가 상담을 받고 훈련 계획을 수립하세요.'
      urgentActions.push('전문가 상담', '훈련 계획 수립', '환경 개선')
    } else if (severityPercent >= 30) {
      severityLevel = '보통'
      recommendation = '문제 행동이 있습니다. 기본 훈련과 환경 개선으로 개선할 수 있습니다.'
      urgentActions.push('기본 훈련 시작', '환경 개선', '규칙적인 일상')
    } else if (severityPercent >= 10) {
      severityLevel = '경미'
      recommendation = '문제 행동이 경미합니다. 기본 훈련으로 개선할 수 있습니다.'
      urgentActions.push('기본 훈련', '일관된 규칙 적용')
    } else {
      severityLevel = '정상'
      recommendation = '행동이 정상 범위입니다. 현재 상태를 유지하세요.'
      urgentActions.push('정기적인 훈련 유지', '건강 관리')
    }

    setResult({
      totalSeverity: severityPercent,
      severityLevel,
      recommendation,
      urgentActions
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
            <AlertTriangle className="w-10 h-10 text-red-600 mr-3" />
            문제 행동 심각도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            문제 행동의 심각도를 평가합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                각 증상의 심각도를 선택하세요 (0: 없음, 5: 매우 심각)
              </label>
              <div className="space-y-4">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{symptom.name}</span>
                      <span className="text-sm font-semibold text-red-600">{symptom.severity}/5</span>
                    </div>
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => updateSeverity(symptom.id, level)}
                          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                            symptom.severity === level
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              심각도 평가하기
            </button>

            {result && (
              <div className={`border-2 rounded-lg p-6 space-y-4 ${
                result.totalSeverity >= 70 ? 'bg-red-50 border-red-300' :
                result.totalSeverity >= 50 ? 'bg-orange-50 border-orange-300' :
                result.totalSeverity >= 30 ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">전체 심각도</p>
                  <p className="text-4xl font-bold text-red-700">{result.totalSeverity}%</p>
                  <p className={`text-xl font-semibold mt-2 ${
                    result.totalSeverity >= 70 ? 'text-red-700' :
                    result.totalSeverity >= 50 ? 'text-orange-700' :
                    result.totalSeverity >= 30 ? 'text-yellow-700' :
                    'text-green-700'
                  }`}>
                    {result.severityLevel}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장 조치</p>
                  <p className="text-gray-700 mb-3">{result.recommendation}</p>
                  <div className="space-y-2">
                    {result.urgentActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-red-600">•</span>
                        <span className="text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 문제 행동 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 문제 행동은 조기에 발견하고 개선하는 것이 중요합니다</li>
            <li>• 심각한 문제 행동은 전문가의 도움이 필요합니다</li>
            <li>• 공격성이나 과도한 불안은 즉시 전문가와 상담하세요</li>
            <li>• 문제 행동의 원인을 파악하는 것이 중요합니다</li>
            <li>• 일관된 훈련과 긍정적 강화를 사용하세요</li>
            <li>• 환경 개선과 규칙적인 일상이 도움이 됩니다</li>
            <li>• 인내심을 가지고 꾸준히 개선하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

