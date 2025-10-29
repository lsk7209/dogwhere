'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Plus, Calendar } from 'lucide-react'

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
      } catch (e) {}
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

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getIntensityText = (intensity: string) => {
    switch (intensity) {
      case 'low': return '낮음'
      case 'medium': return '보통'
      case 'high': return '높음'
      default: return intensity
    }
  }

  const behaviorStats = records.reduce((acc, record) => {
    acc[record.behavior] = (acc[record.behavior] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBehaviors = Object.entries(behaviorStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
            행동 일지 작성기
          </h1>
          <p className="text-xl text-gray-600">강아지의 일상 행동을 기록하고 패턴을 분석합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 행동 기록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <input
                  type="time"
                  value={newRecord.time}
                  onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간</label>
                <input
                  type="text"
                  value={newRecord.duration}
                  onChange={(e) => setNewRecord({...newRecord, duration: e.target.value})}
                  placeholder="예: 5분, 30초"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">행동 유형</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonBehaviors.map((behavior) => (
                  <button
                    key={behavior}
                    onClick={() => setNewRecord({...newRecord, behavior})}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newRecord.behavior === behavior
                        ? 'bg-purple-100 border-purple-400 text-purple-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {behavior}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={newRecord.behavior}
                onChange={(e) => setNewRecord({...newRecord, behavior: e.target.value})}
                placeholder="또는 직접 입력"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상황/맥락</label>
              <input
                type="text"
                value={newRecord.context}
                onChange={(e) => setNewRecord({...newRecord, context: e.target.value})}
                placeholder="예: 산책 후, 식사 전, 혼자 있을 때"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">강도</label>
              <select
                value={newRecord.intensity}
                onChange={(e) => setNewRecord({...newRecord, intensity: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                placeholder="행동의 세부사항이나 특이점"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={addRecord}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              기록 추가
            </button>
          </div>
        </div>

        {topBehaviors.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 패턴 분석</h2>
            <div className="space-y-3">
              {topBehaviors.map(([behavior, count]) => (
                <div key={behavior} className="flex items-center justify-between">
                  <span className="text-gray-900">{behavior}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(behaviorStats))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}회</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-bold text-gray-900">{record.date}</span>
                      <span className="text-sm text-gray-600">{record.time}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getIntensityColor(record.intensity)}`}>
                      {getIntensityText(record.intensity)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">행동:</span> {record.behavior}</p>
                    {record.context && <p><span className="font-medium">상황:</span> {record.context}</p>}
                    {record.duration && <p><span className="font-medium">지속시간:</span> {record.duration}</p>}
                    {record.notes && <p><span className="font-medium">메모:</span> {record.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 행동 기록 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 행동이 발생한 정확한 시간과 상황을 기록하세요</li>
            <li>• 행동의 강도와 지속시간을 객관적으로 평가하세요</li>
            <li>• 패턴을 파악하여 문제 행동의 원인을 찾아보세요</li>
            <li>• 지속적인 문제 행동은 전문가와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
