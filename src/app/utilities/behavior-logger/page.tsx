'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Calendar, Clock, Activity, ArrowLeft, Trash2, Info, BarChart2 } from 'lucide-react'

interface BehaviorRecord {
  id: string
  date: string
  time: string
  behavior: string
  context: string
  duration: string
  intensity: 'low' | 'medium' | 'high'
  notes: string
}

export default function BehaviorLoggerPage() {
  const [records, setRecords] = useState<BehaviorRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    time: '',
    behavior: '',
    context: '',
    duration: '',
    intensity: 'medium' as const,
    notes: ''
  })

  const commonBehaviors = [
    '짖기', '하울링', '물기', '파괴 행동', '과도한 핥기', '꼬리 쫓기',
    '구르기', '뒹굴기', '숨기', '도망가기', '공격성', '불안 행동',
    '과도한 활동', '무기력', '식욕 변화', '배변 실수'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('behaviorRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('behaviorRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.behavior || !newRecord.time) return

    const record: BehaviorRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      time: '',
      behavior: '',
      context: '',
      duration: '',
      intensity: 'medium',
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('behaviorRecords', JSON.stringify(updated))
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'low': return '약함'
      case 'medium': return '보통'
      case 'high': return '강함'
      default: return intensity
    }
  }

  const behaviorStats = records.reduce((acc, record) => {
    acc[record.behavior] = (acc[record.behavior] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBehaviors = Object.entries(behaviorStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">행동 일지</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 행동 패턴을 기록하고 분석하여 더 깊이 이해해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-500" />
                새 기록 추가
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={newRecord.time}
                    onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">행동 선택</label>
                  <div className="flex flex-wrap gap-2 mb-3 max-h-40 overflow-y-auto custom-scrollbar">
                    {commonBehaviors.map((behavior) => (
                      <button
                        key={behavior}
                        onClick={() => setNewRecord({ ...newRecord, behavior })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${newRecord.behavior === behavior
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                          }`}
                      >
                        {behavior}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newRecord.behavior}
                    onChange={(e) => setNewRecord({ ...newRecord, behavior: e.target.value })}
                    placeholder="직접 입력"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">지속 시간</label>
                    <input
                      type="text"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({ ...newRecord, duration: e.target.value })}
                      placeholder="예: 5분"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">강도</label>
                    <select
                      value={newRecord.intensity}
                      onChange={(e) => setNewRecord({ ...newRecord, intensity: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="low">약함</option>
                      <option value="medium">보통</option>
                      <option value="high">강함</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상황/맥락</label>
                  <input
                    type="text"
                    value={newRecord.context}
                    onChange={(e) => setNewRecord({ ...newRecord, context: e.target.value })}
                    placeholder="예: 산책 후, 식사 전"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={2}
                    placeholder="특이사항 기록"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.behavior || !newRecord.time}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Records & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Card */}
            {topBehaviors.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2 text-indigo-500" />
                  자주 보이는 행동 TOP 5
                </h2>
                <div className="space-y-4">
                  {topBehaviors.map(([behavior, count]) => (
                    <div key={behavior} className="relative">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{behavior}</span>
                        <span className="text-gray-500">{count}회</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${(count / Math.max(...Object.values(behaviorStats))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Records List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                  최근 기록
                </span>
                <span className="text-sm font-normal text-gray-500">
                  총 {records.length}건
                </span>
              </h2>

              {records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="group relative bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getIntensityColor(record.intensity)}`}>
                              {getIntensityLabel(record.intensity)}
                            </span>
                            <h3 className="font-bold text-gray-900 text-lg">{record.behavior}</h3>
                          </div>

                          <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {record.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              {record.time}
                            </span>
                            {record.duration && (
                              <span className="flex items-center text-indigo-600 font-medium">
                                ⏱ {record.duration}
                              </span>
                            )}
                          </div>

                          {(record.context || record.notes) && (
                            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                              {record.context && (
                                <p className="text-gray-700">
                                  <span className="font-semibold text-gray-500 mr-2">상황:</span>
                                  {record.context}
                                </p>
                              )}
                              {record.notes && (
                                <p className="text-gray-700">
                                  <span className="font-semibold text-gray-500 mr-2">메모:</span>
                                  {record.notes}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">기록된 행동이 없습니다</p>
                  <p className="text-sm">반려견의 행동을 관찰하고 기록해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
