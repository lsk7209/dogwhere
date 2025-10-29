'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus, AlertTriangle } from 'lucide-react'

interface SymptomRecord {
  id: string
  date: string
  time: string
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  duration: string
  triggers: string[]
  notes: string
}

export default function HealthSymptomTrackerPage() {
  const [records, setRecords] = useState<SymptomRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    time: '',
    symptoms: [] as string[],
    severity: 'mild' as const,
    duration: '',
    triggers: [] as string[],
    notes: ''
  })

  const commonSymptoms = [
    '구토', '설사', '변비', '식욕부진', '과도한 식욕', '체중감소', '체중증가',
    '기침', '재채기', '콧물', '눈물', '귀 분비물', '과도한 침', '구취',
    '가려움증', '털 빠짐', '피부 발진', '과도한 핥기', '긁기',
    '무기력', '과도한 활동', '불안', '공격성', '우울',
    '절뚝거림', '보행 이상', '관절 부종', '통증', '기타'
  ]

  const triggerOptions = [
    '식사 후', '운동 후', '스트레스', '날씨 변화', '새로운 환경',
    '다른 동물과의 만남', '약물 복용', '예방접종 후', '기타'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('healthSymptomRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('healthSymptomRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.time || newRecord.symptoms.length === 0) return

    const record: SymptomRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      time: '',
      symptoms: [],
      severity: 'mild',
      duration: '',
      triggers: [],
      notes: ''
    })
  }

  const toggleSymptom = (symptom: string) => {
    setNewRecord({
      ...newRecord,
      symptoms: newRecord.symptoms.includes(symptom)
        ? newRecord.symptoms.filter(s => s !== symptom)
        : [...newRecord.symptoms, symptom]
    })
  }

  const toggleTrigger = (trigger: string) => {
    setNewRecord({
      ...newRecord,
      triggers: newRecord.triggers.includes(trigger)
        ? newRecord.triggers.filter(t => t !== trigger)
        : [...newRecord.triggers, trigger]
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild': return '경미'
      case 'moderate': return '보통'
      case 'severe': return '심각'
      default: return severity
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return '🟢'
      case 'moderate': return '🟡'
      case 'severe': return '🔴'
      default: return '⚪'
    }
  }

  const recentRecords = records.slice(0, 7)
  const severeRecords = records.filter(r => r.severity === 'severe')
  const symptomFrequency = records.reduce((acc, record) => {
    record.symptoms.forEach(symptom => {
      acc[symptom] = (acc[symptom] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const topSymptoms = Object.entries(symptomFrequency)
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
            <Activity className="w-10 h-10 text-red-600 mr-3" />
            건강 증상 추적기
          </h1>
          <p className="text-xl text-gray-600">건강 관련 증상과 변화를 상세히 기록합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{records.length}회</p>
            <p className="text-sm text-gray-600">기록된 증상</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{severeRecords.length}회</p>
            <p className="text-sm text-gray-600">심각한 증상</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">{topSymptoms.length}개</p>
            <p className="text-sm text-gray-600">주요 증상</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 증상 기록</h2>
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
                  placeholder="예: 30분, 2시간"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">증상</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newRecord.symptoms.includes(symptom)
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
              <div className="flex space-x-4">
                {['mild', 'moderate', 'severe'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setNewRecord({...newRecord, severity: severity as any})}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      newRecord.severity === severity
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {getSeverityIcon(severity)} {getSeverityText(severity)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">유발 요인</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {triggerOptions.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newRecord.triggers.includes(trigger)
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상세 메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                placeholder="증상의 세부사항이나 특이점을 기록하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={addRecord}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              증상 기록
            </button>
          </div>
        </div>

        {topSymptoms.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 증상 분석</h2>
            <div className="space-y-3">
              {topSymptoms.map(([symptom, count]) => (
                <div key={symptom} className="flex items-center justify-between">
                  <span className="text-gray-900">{symptom}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(symptomFrequency))) * 100}%` }}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">증상 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getSeverityIcon(record.severity)}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{record.date}</h3>
                        <p className="text-sm text-gray-600">{record.time} | {record.duration}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                      {getSeverityText(record.severity)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">증상:</p>
                    <div className="flex flex-wrap gap-1">
                      {record.symptoms.map((symptom, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  {record.triggers.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">유발 요인:</p>
                      <div className="flex flex-wrap gap-1">
                        {record.triggers.map((trigger, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-sm text-gray-500">메모: {record.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 건강 증상 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 증상이 발생한 정확한 시간과 상황을 기록하세요</li>
            <li>• 증상의 심각도와 지속시간을 객관적으로 평가하세요</li>
            <li>• 유발 요인을 파악하여 예방에 도움이 되도록 하세요</li>
            <li>• 지속적이거나 심각한 증상은 즉시 수의사와 상담하세요</li>
            <li>• 정기적으로 기록을 검토하여 패턴을 파악하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
