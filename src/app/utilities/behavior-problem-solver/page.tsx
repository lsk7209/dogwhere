'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, Lightbulb } from 'lucide-react'

interface ProblemBehavior {
  id: string
  name: string
  description: string
  causes: string[]
  solutions: string[]
  prevention: string[]
  severity: 'low' | 'medium' | 'high'
}

interface TrainingRecord {
  id: string
  behavior: string
  date: string
  duration: number
  method: string
  success: boolean
  notes: string
}

export default function BehaviorProblemSolverPage() {
  const [selectedBehavior, setSelectedBehavior] = useState<ProblemBehavior | null>(null)
  const [records, setRecords] = useState<TrainingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    behavior: '',
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    method: '',
    success: true,
    notes: ''
  })

  const problemBehaviors: ProblemBehavior[] = [
    {
      id: 'barking',
      name: '과도한 짖음',
      description: '지나치게 많이 짖거나 부적절한 상황에서 짖는 행동',
      causes: [
        '외로움과 불안감',
        '경계심과 보호 본능',
        '주의를 끌려는 시도',
        '스트레스와 좌절감',
        '훈련 부족'
      ],
      solutions: [
        '원인 파악 후 해결',
        '무시하기 (관심을 주지 않음)',
        '대안 행동 가르치기 (앉기, 기다리기)',
        '환경 개선 (소음 차단, 안전한 공간 제공)',
        '전문가 상담'
      ],
      prevention: [
        '충분한 운동과 정신적 자극',
        '사회화 훈련',
        '일관된 규칙과 경계 설정',
        '긍정적 강화 훈련'
      ],
      severity: 'high'
    },
    {
      id: 'biting',
      name: '물기',
      description: '사람이나 다른 동물을 물거나 공격하는 행동',
      causes: [
        '놀이 중 과도한 흥분',
        '공포와 방어 반응',
        '영역 보호 본능',
        '훈련 부족',
        '과거 트라우마'
      ],
      solutions: [
        '즉시 중단 신호 가르치기',
        '대안 놀이 방법 제공',
        '사회화 훈련 강화',
        '전문 행동 전문가 상담',
        '안전한 환경 조성'
      ],
      prevention: [
        '적절한 사회화',
        '일관된 훈련',
        '스트레스 관리',
        '안전한 놀이 환경'
      ],
      severity: 'high'
    },
    {
      id: 'destruction',
      name: '파괴 행동',
      description: '가구, 신발, 물건을 물어뜯거나 파괴하는 행동',
      causes: [
        '외로움과 불안감',
        '지루함과 에너지 과다',
        '치아 문제',
        '주의를 끌려는 시도',
        '분리 불안'
      ],
      solutions: [
        '충분한 운동과 놀이',
        '적절한 장난감 제공',
        '치아 관리',
        '환경 개선 (안전한 공간)',
        '점진적 혼자 있기 훈련'
      ],
      prevention: [
        '규칙적인 운동',
        '정신적 자극 활동',
        '적절한 장난감 로테이션',
        '안전한 환경 조성'
      ],
      severity: 'medium'
    },
    {
      id: 'jumping',
      name: '점프하기',
      description: '사람에게 뛰어오르거나 높은 곳으로 올라가는 행동',
      causes: [
        '인사하려는 시도',
        '주의를 끌려는 시도',
        '흥분과 과도한 에너지',
        '훈련 부족',
        '습관화된 행동'
      ],
      solutions: [
        '앉기 명령으로 대체',
        '무시하기 (관심을 주지 않음)',
        '일관된 규칙 적용',
        '긍정적 강화 훈련',
        '대안 행동 가르치기'
      ],
      prevention: [
        '일관된 훈련',
        '적절한 운동',
        '규칙과 경계 설정',
        '긍정적 강화'
      ],
      severity: 'low'
    },
    {
      id: 'pulling',
      name: '산책 시 당기기',
      description: '산책할 때 목줄을 당기거나 앞서 가려는 행동',
      causes: [
        '흥분과 과도한 에너지',
        '훈련 부족',
        '목줄에 대한 불편감',
        '환경에 대한 호기심',
        '리더십 부족'
      ],
      solutions: [
        '기본 훈련 강화',
        '적절한 목줄과 하네스 사용',
        '일관된 훈련 방법',
        '보상 기반 훈련',
        '전문 훈련사 상담'
      ],
      prevention: [
        '기본 명령 훈련',
        '일관된 산책 규칙',
        '적절한 운동',
        '긍정적 강화'
      ],
      severity: 'medium'
    },
    {
      id: 'anxiety',
      name: '불안과 공포',
      description: '특정 상황이나 소리에 대해 과도하게 불안해하는 행동',
      causes: [
        '과거 트라우마',
        '사회화 부족',
        '유전적 요인',
        '환경 변화',
        '스트레스'
      ],
      solutions: [
        '점진적 노출 훈련',
        '안전한 환경 조성',
        '전문가 상담',
        '진정제나 보조제 사용',
        '긍정적 연관성 형성'
      ],
      prevention: [
        '충분한 사회화',
        '안정적인 환경',
        '스트레스 관리',
        '일관된 일상'
      ],
      severity: 'high'
    }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('behaviorTrainingRecords')
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('behaviorTrainingRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.behavior || !newRecord.method) return

    const record: TrainingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      behavior: '',
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      method: '',
      success: true,
      notes: ''
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return severity
    }
  }

  const successRate = records.length > 0 
    ? Math.round((records.filter(r => r.success).length / records.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-10 h-10 text-red-600 mr-3" />
            문제 행동 해결 가이드
          </h1>
          <p className="text-xl text-gray-600">짖음, 물기, 파괴 행동 등 문제 행동 해결 방법을 제공합니다</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">문제 행동 선택</h2>
              <div className="space-y-4">
                {problemBehaviors.map((behavior) => (
                  <div key={behavior.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{behavior.name}</h3>
                        <p className="text-sm text-gray-600">{behavior.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(behavior.severity)}`}>
                        {getSeverityText(behavior.severity)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedBehavior(behavior)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      해결 방법 보기
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">문제 행동</label>
                    <select
                      value={newRecord.behavior}
                      onChange={(e) => setNewRecord({...newRecord, behavior: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">행동 선택</option>
                      {problemBehaviors.map((behavior) => (
                        <option key={behavior.id} value={behavior.name}>{behavior.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 시간 (분)</label>
                    <input
                      type="number"
                      min="0"
                      value={newRecord.duration || ''}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">성공 여부</label>
                    <select
                      value={newRecord.success.toString()}
                      onChange={(e) => setNewRecord({...newRecord, success: e.target.value === 'true'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="true">성공</option>
                      <option value="false">실패</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용한 방법</label>
                  <input
                    type="text"
                    value={newRecord.method}
                    onChange={(e) => setNewRecord({...newRecord, method: e.target.value})}
                    placeholder="예: 무시하기, 대안 행동 훈련"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="훈련 과정이나 결과에 대한 기록"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.behavior}</p>
                          <p className="text-sm text-gray-600">{record.date} • {record.duration}분 • {record.method}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          record.success 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.success ? '성공' : '실패'}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedBehavior && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedBehavior.name}</h2>
                <button
                  onClick={() => setSelectedBehavior(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">원인</h3>
                  <ul className="space-y-2">
                    {selectedBehavior.causes.map((cause, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">해결 방법</h3>
                  <ul className="space-y-2">
                    {selectedBehavior.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">예방 방법</h3>
                  <ul className="space-y-2">
                    {selectedBehavior.prevention.map((prevention, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">🛡️</span>
                        <span className="text-gray-700">{prevention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                  전문가 상담 권장
                </h3>
                <p className="text-sm text-gray-700">
                  심각한 문제 행동의 경우 반드시 수의사나 동물 행동 전문가와 상담하세요. 
                  안전한 해결을 위해 전문적인 도움이 필요할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ 중요 안전 수칙</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 물기나 공격 행동이 있는 경우 즉시 전문가와 상담하세요</li>
            <li>• 강아지의 안전과 사람의 안전을 최우선으로 고려하세요</li>
            <li>• 훈련 중에는 항상 긍정적이고 인내심을 갖으세요</li>
            <li>• 문제가 지속되거나 악화되면 즉시 중단하고 전문가에게 도움을 요청하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
