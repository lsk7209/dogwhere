'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Calculator, ArrowLeft, Info, Activity, ShieldAlert } from 'lucide-react'

interface BehaviorSymptom {
  id: string
  name: string
  description: string
  severity: number
}

const behaviorSymptoms: BehaviorSymptom[] = [
  { id: 'aggression', name: '공격성', description: '물기, 으르렁거림, 위협적인 행동', severity: 0 },
  { id: 'barking', name: '과도한 짖음', description: '지속적인 짖음, 통제 불가능한 소음', severity: 0 },
  { id: 'destruction', name: '파괴 행동', description: '가구, 물건 훼손, 씹기', severity: 0 },
  { id: 'anxiety', name: '불안 증상', description: '떨림, 숨기, 과도한 침 흘림', severity: 0 },
  { id: 'separation', name: '분리불안', description: '혼자 있을 때의 불안, 하울링, 배변 실수', severity: 0 },
  { id: 'jumping', name: '점프하기', description: '사람에게 뛰어오르는 행동', severity: 0 },
  { id: 'pulling', name: '목줄 당기기', description: '산책 시 통제 불가능한 당김', severity: 0 },
  { id: 'chewing', name: '이식증/물어뜯기', description: '먹지 못하는 것을 먹거나 씹는 행동', severity: 0 }
]

export default function BehaviorSeverityCalculatorPage() {
  const [symptoms, setSymptoms] = useState<BehaviorSymptom[]>(behaviorSymptoms)
  const [result, setResult] = useState<{
    totalSeverity: number
    severityLevel: string
    recommendation: string
    urgentActions: string[]
    color: string
    bg: string
    border: string
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
    let color = ''
    let bg = ''
    let border = ''

    if (severityPercent >= 70) {
      severityLevel = '매우 심각 (위험)'
      recommendation = '즉각적인 전문가 개입이 필요한 상태입니다. 안전 사고의 위험이 높습니다.'
      urgentActions.push('즉시 수의사/훈련사 상담', '안전 관리 강화', '자극원 차단')
      color = 'text-red-600'
      bg = 'bg-red-50'
      border = 'border-red-200'
    } else if (severityPercent >= 50) {
      severityLevel = '심각 (주의)'
      recommendation = '전문적인 훈련 계획 수립이 필요합니다. 방치하면 더 악화될 수 있습니다.'
      urgentActions.push('전문가 상담 권장', '체계적인 훈련 시작', '환경 재구성')
      color = 'text-orange-600'
      bg = 'bg-orange-50'
      border = 'border-orange-200'
    } else if (severityPercent >= 30) {
      severityLevel = '보통 (관리 필요)'
      recommendation = '지속적인 관리가 필요합니다. 보호자의 노력으로 개선할 수 있는 단계입니다.'
      urgentActions.push('기본 복종 훈련 강화', '규칙적인 산책/운동', '스트레스 해소')
      color = 'text-yellow-600'
      bg = 'bg-yellow-50'
      border = 'border-yellow-200'
    } else if (severityPercent >= 10) {
      severityLevel = '경미 (양호)'
      recommendation = '가벼운 문제 행동이 있지만, 일상적인 훈련으로 충분히 교정 가능합니다.'
      urgentActions.push('일관된 규칙 적용', '긍정 강화 훈련')
      color = 'text-emerald-600'
      bg = 'bg-emerald-50'
      border = 'border-emerald-200'
    } else {
      severityLevel = '정상'
      recommendation = '문제 행동이 거의 없는 아주 모범적인 상태입니다.'
      urgentActions.push('현재 상태 유지', '정기적인 건강 검진')
      color = 'text-blue-600'
      bg = 'bg-blue-50'
      border = 'border-blue-200'
    }

    setResult({
      totalSeverity: severityPercent,
      severityLevel,
      recommendation,
      urgentActions,
      color,
      bg,
      border
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">문제 행동 심각도 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 행동 문제를 자가 진단하고 심각도를 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                증상별 심각도 평가 (0~5점)
              </h2>
              <div className="space-y-6">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="bg-gray-50 rounded-xl p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{symptom.name}</h3>
                        <p className="text-sm text-gray-500">{symptom.description}</p>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${symptom.severity >= 4 ? 'bg-red-100 text-red-700' :
                          symptom.severity >= 2 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {symptom.severity}점
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => updateSeverity(symptom.id, level)}
                          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${symptom.severity === level
                              ? level >= 4 ? 'bg-red-500 text-white shadow-md shadow-red-200' :
                                level >= 2 ? 'bg-yellow-500 text-white shadow-md shadow-yellow-200' :
                                  'bg-blue-500 text-white shadow-md shadow-blue-200'
                              : 'bg-white border border-gray-200 text-gray-400 hover:border-gray-300'
                            }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 px-1">
                      <span>없음</span>
                      <span>심각함</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculate}
                className="w-full mt-8 bg-red-600 text-white py-4 px-6 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-bold text-lg flex items-center justify-center"
              >
                <Calculator className="w-6 h-6 mr-2" />
                심각도 분석하기
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${result.border}`}>
                  <div className={`p-8 text-center ${result.bg}`}>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">종합 심각도</span>
                    <div className={`text-5xl font-black my-4 ${result.color}`}>
                      {result.totalSeverity}%
                    </div>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/50 backdrop-blur-sm ${result.color}`}>
                      {result.severityLevel}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-3">분석 결과</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {result.recommendation}
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" />
                        권장 조치사항
                      </h4>
                      <ul className="space-y-2">
                        {result.urgentActions.map((action, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <span className={`mr-2 ${result.color}`}>•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    왼쪽의 항목들을 평가하고<br />분석하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-400" />
                  알아두세요
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    이 결과는 참고용이며, 정확한 진단은 전문가와 상담하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    공격성이 있는 경우 안전을 최우선으로 해야 합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    조기 발견과 대처가 문제 해결의 핵심입니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
