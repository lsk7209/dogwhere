'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, Lightbulb, ArrowLeft, Shield, Target, BookOpen, X, Plus, Trash2 } from 'lucide-react'

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
      causes: ['외로움과 불안감', '경계심과 보호 본능', '주의를 끌려는 시도', '스트레스와 좌절감', '훈련 부족'],
      solutions: ['원인 파악 후 해결', '무시하기 (관심을 주지 않음)', '대안 행동 가르치기 (앉기, 기다리기)', '환경 개선 (소음 차단)', '전문가 상담'],
      prevention: ['충분한 운동과 정신적 자극', '사회화 훈련', '일관된 규칙과 경계 설정', '긍정적 강화 훈련'],
      severity: 'high'
    },
    {
      id: 'biting',
      name: '물기 (입질)',
      description: '사람이나 다른 동물을 물거나 공격하는 행동',
      causes: ['놀이 중 과도한 흥분', '공포와 방어 반응', '영역 보호 본능', '훈련 부족', '과거 트라우마'],
      solutions: ['즉시 중단 신호 가르치기', '대안 놀이 방법 제공', '사회화 훈련 강화', '전문 행동 전문가 상담', '안전한 환경 조성'],
      prevention: ['적절한 사회화', '일관된 훈련', '스트레스 관리', '안전한 놀이 환경'],
      severity: 'high'
    },
    {
      id: 'destruction',
      name: '파괴 행동',
      description: '가구, 신발, 물건을 물어뜯거나 파괴하는 행동',
      causes: ['외로움과 불안감', '지루함과 에너지 과다', '치아 문제', '주의를 끌려는 시도', '분리 불안'],
      solutions: ['충분한 운동과 놀이', '적절한 장난감 제공', '치아 관리', '환경 개선 (안전한 공간)', '점진적 혼자 있기 훈련'],
      prevention: ['규칙적인 운동', '정신적 자극 활동', '적절한 장난감 로테이션', '안전한 환경 조성'],
      severity: 'medium'
    },
    {
      id: 'jumping',
      name: '점프하기',
      description: '사람에게 뛰어오르거나 높은 곳으로 올라가는 행동',
      causes: ['인사하려는 시도', '주의를 끌려는 시도', '흥분과 과도한 에너지', '훈련 부족', '습관화된 행동'],
      solutions: ['앉기 명령으로 대체', '무시하기 (관심을 주지 않음)', '일관된 규칙 적용', '긍정적 강화 훈련', '대안 행동 가르치기'],
      prevention: ['일관된 훈련', '적절한 운동', '규칙과 경계 설정', '긍정적 강화'],
      severity: 'low'
    },
    {
      id: 'pulling',
      name: '산책 시 당기기',
      description: '산책할 때 목줄을 당기거나 앞서 가려는 행동',
      causes: ['흥분과 과도한 에너지', '훈련 부족', '목줄에 대한 불편감', '환경에 대한 호기심', '리더십 부족'],
      solutions: ['기본 훈련 강화', '적절한 목줄과 하네스 사용', '일관된 훈련 방법', '보상 기반 훈련', '전문 훈련사 상담'],
      prevention: ['기본 명령 훈련', '일관된 산책 규칙', '적절한 운동', '긍정적 강화'],
      severity: 'medium'
    },
    {
      id: 'anxiety',
      name: '불안과 공포',
      description: '특정 상황이나 소리에 대해 과도하게 불안해하는 행동',
      causes: ['과거 트라우마', '사회화 부족', '유전적 요인', '환경 변화', '스트레스'],
      solutions: ['점진적 노출 훈련', '안전한 환경 조성', '전문가 상담', '진정제나 보조제 사용', '긍정적 연관성 형성'],
      prevention: ['충분한 사회화', '안정적인 환경', '스트레스 관리', '일관된 일상'],
      severity: 'high'
    }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('behaviorTrainingRecords')
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) { }
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

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('behaviorTrainingRecords', JSON.stringify(updated))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return '심각'
      case 'medium': return '주의'
      case 'low': return '경미'
      default: return severity
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
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
            <h1 className="text-3xl font-bold text-gray-900">문제 행동 해결 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 문제 행동 원인을 파악하고 해결책을 찾아보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Problem List & Training Log */}
          <div className="lg:col-span-5 space-y-8">
            {/* Problem List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-500" />
                문제 행동 유형
              </h2>
              <div className="space-y-3">
                {problemBehaviors.map((behavior) => (
                  <button
                    key={behavior.id}
                    onClick={() => setSelectedBehavior(behavior)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${selectedBehavior?.id === behavior.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-100 hover:border-red-200 hover:bg-white'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold ${selectedBehavior?.id === behavior.id ? 'text-red-900' : 'text-gray-900'}`}>
                        {behavior.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(behavior.severity)}`}>
                        {getSeverityLabel(behavior.severity)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{behavior.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Training Log Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                훈련 기록 추가
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문제 행동</label>
                  <select
                    value={newRecord.behavior}
                    onChange={(e) => setNewRecord({ ...newRecord, behavior: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">행동 선택</option>
                    {problemBehaviors.map((behavior) => (
                      <option key={behavior.id} value={behavior.name}>{behavior.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시간 (분)</label>
                    <input
                      type="number"
                      min="0"
                      value={newRecord.duration || ''}
                      onChange={(e) => setNewRecord({ ...newRecord, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">훈련 방법</label>
                  <input
                    type="text"
                    value={newRecord.method}
                    onChange={(e) => setNewRecord({ ...newRecord, method: e.target.value })}
                    placeholder="예: 무시하기, 앉아 훈련"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">결과</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={newRecord.success}
                        onChange={() => setNewRecord({ ...newRecord, success: true })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">성공 (개선됨)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={!newRecord.success}
                        onChange={() => setNewRecord({ ...newRecord, success: false })}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">실패 (변화 없음)</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.behavior || !newRecord.method}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detail View & Records List */}
          <div className="lg:col-span-7 space-y-8">
            {/* Detail View */}
            {selectedBehavior ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedBehavior.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getSeverityColor(selectedBehavior.severity)}`}>
                        {getSeverityLabel(selectedBehavior.severity)}
                      </span>
                    </div>
                    <p className="text-gray-600">{selectedBehavior.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBehavior(null)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      주요 원인
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedBehavior.causes.map((cause, idx) => (
                        <div key={idx} className="flex items-start p-3 bg-orange-50 rounded-xl text-sm text-gray-700">
                          <span className="text-orange-500 mr-2 font-bold">•</span>
                          {cause}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      해결 솔루션
                    </h3>
                    <ul className="space-y-3">
                      {selectedBehavior.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start p-4 bg-green-50 rounded-xl border border-green-100">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-gray-800 font-medium">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-blue-500" />
                      예방 가이드
                    </h3>
                    <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-900 space-y-2">
                      {selectedBehavior.prevention.map((item, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 flex items-start">
                    <Lightbulb className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-1">전문가 조언</h4>
                      <p className="text-sm text-yellow-700 leading-relaxed">
                        심각한 문제 행동의 경우 반드시 수의사나 동물 행동 전문가와 상담하세요.
                        잘못된 훈련 방식은 행동을 악화시킬 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">문제 행동을 선택하세요</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  왼쪽 목록에서 고민되는 행동을 선택하면<br />
                  상세한 원인 분석과 해결 방법을 확인할 수 있습니다.
                </p>
              </div>
            )}

            {/* Recent Records List */}
            {records.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                  <span>최근 훈련 기록</span>
                  <span className="text-sm font-normal text-gray-500">{records.length}건</span>
                </h2>
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${record.success ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {record.success ? '성공' : '진행중'}
                          </span>
                          <h4 className="font-bold text-gray-900">{record.behavior}</h4>
                        </div>
                        <p className="text-sm text-gray-500">
                          {record.date} • {record.duration}분 훈련 • {record.method}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="mt-3 sm:mt-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
