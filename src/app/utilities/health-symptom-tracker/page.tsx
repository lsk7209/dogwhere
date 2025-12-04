'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus, AlertTriangle, ArrowLeft, Clock, Calendar, FileText, Trash2, Search, Filter } from 'lucide-react'

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
  const [searchTerm, setSearchTerm] = useState('')

  const commonSymptoms = [
    '구토', '설사', '변비', '식욕부진', '과도한 식욕', '체중감소', '체중증가',
    '기침', '재채기', '콧물', '눈물', '귀 분비물', '과도한 침', '구취',
    '가려움증', '털 빠짐', '피부 발진', '과도한 핥기', '긁기',
    '무기력', '과도한 활동', '불안', '공격성', '우울',
    '절뚝거림', '보행 이상', '관절 부종', '통증'
  ]

  const triggerOptions = [
    '식사 후', '운동 후', '스트레스', '날씨 변화', '새로운 환경',
    '다른 동물과의 만남', '약물 복용', '예방접종 후'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('healthSymptomRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

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

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('healthSymptomRecords', JSON.stringify(updated))
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
      case 'mild': return 'text-green-600 bg-green-50 border-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-100'
      case 'severe': return 'text-red-600 bg-red-50 border-red-100'
      default: return 'text-gray-600 bg-gray-50 border-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild': return '경미함'
      case 'moderate': return '보통'
      case 'severe': return '심각함'
      default: return severity
    }
  }

  const filteredSymptoms = commonSymptoms.filter(s => s.includes(searchTerm))
  const severeCount = records.filter(r => r.severity === 'severe').length

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
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">증상 트래커</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            아픈 증상을 기록하여 수의사 상담 시 정확한 정보를 전달하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-red-500" />
                새로운 증상 기록
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">발생 시간</label>
                    <input
                      type="time"
                      value={newRecord.time}
                      onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간</label>
                    <input
                      type="text"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({ ...newRecord, duration: e.target.value })}
                      placeholder="예: 30분"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">증상 선택</label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="증상 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                    {filteredSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${newRecord.symptoms.includes(symptom)
                          ? 'bg-red-500 border-red-500 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50'
                          }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
                  <div className="flex gap-3">
                    {['mild', 'moderate', 'severe'].map((severity) => (
                      <button
                        key={severity}
                        onClick={() => setNewRecord({ ...newRecord, severity: severity as any })}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all text-sm font-bold ${newRecord.severity === severity
                          ? (severity as string) === 'severe'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : (severity as string) === 'moderate'
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                      >
                        {getSeverityText(severity)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">유발 요인 (추정)</label>
                  <div className="flex flex-wrap gap-2">
                    {triggerOptions.map((trigger) => (
                      <button
                        key={trigger}
                        onClick={() => toggleTrigger(trigger)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${newRecord.triggers.includes(trigger)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={3}
                    placeholder="특이사항을 자세히 기록해주세요."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.time || newRecord.symptoms.length === 0}
                  className="w-full bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: History & Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-black text-gray-900 mb-1">{records.length}</div>
                <div className="text-xs text-gray-500 font-medium">총 기록</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-black text-red-500 mb-1">{severeCount}</div>
                <div className="text-xs text-gray-500 font-medium">심각한 증상</div>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                최근 기록
              </h2>

              <div className="space-y-4">
                {records.length > 0 ? (
                  records.slice(0, 5).map((record) => (
                    <div key={record.id} className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{record.date}</span>
                          <span className="text-xs text-gray-500">{record.time}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(record.severity)}`}>
                          {getSeverityText(record.severity)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {record.symptoms.map((s, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>

                      {record.notes && (
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                          {record.notes}
                        </p>
                      )}

                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                    기록된 증상이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-red-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                응급 상황 체크
              </h3>
              <ul className="space-y-3 text-red-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  호흡 곤란이나 잇몸이 창백할 때
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  심한 구토나 설사가 반복될 때
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  의식이 없거나 발작을 일으킬 때
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-red-800 text-center">
                <span className="text-xs text-red-300">위 증상 시 즉시 동물병원에 내원하세요.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
