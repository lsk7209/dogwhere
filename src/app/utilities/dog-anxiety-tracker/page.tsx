'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Heart, ArrowLeft, Brain, Volume2, Home, Activity, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

interface AnxietySymptom {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  category: 'physical' | 'behavioral' | 'emotional' | 'environmental'
  triggers: string[]
  solutions: string[]
  completed: boolean
  date?: string
}

interface AnxietyRecord {
  id: string
  date: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  duration: number
  trigger: string
  notes: string
}

export default function DogAnxietyTrackerPage() {
  const [symptoms, setSymptoms] = useState<AnxietySymptom[]>([])
  const [records, setRecords] = useState<AnxietyRecord[]>([])
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null)
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    duration: 15,
    trigger: '',
    notes: ''
  })

  const initialSymptoms: AnxietySymptom[] = [
    {
      id: '1',
      name: '분리 불안',
      description: '보호자와 떨어져 있을 때 보이는 불안 증세',
      severity: 'moderate',
      category: 'emotional',
      triggers: ['보호자의 외출 준비', '혼자 남겨짐'],
      solutions: ['점진적 분리 훈련', '노즈워크 장난감 제공', '외출 전후 무관심하기'],
      completed: false
    },
    {
      id: '2',
      name: '소음 공포증',
      description: '천둥, 불꽃놀이 등 큰 소리에 대한 공포',
      severity: 'severe',
      category: 'environmental',
      triggers: ['천둥번개', '공사 소음', '폭죽'],
      solutions: ['백색소음 틀어주기', '안전한 은신처 제공', '둔감화 교육'],
      completed: false
    },
    {
      id: '3',
      name: '강박 행동',
      description: '꼬리 쫓기, 발 핥기 등 반복적인 행동',
      severity: 'moderate',
      category: 'behavioral',
      triggers: ['스트레스', '지루함', '운동 부족'],
      solutions: ['충분한 산책과 운동', '지적 자극 제공', '관심 돌리기'],
      completed: false
    }
  ]

  useEffect(() => {
    const savedSymptoms = localStorage.getItem('anxietySymptoms')
    const savedRecords = localStorage.getItem('anxietyRecords')

    if (savedSymptoms) {
      try {
        setSymptoms(JSON.parse(savedSymptoms))
      } catch (e) {
        setSymptoms(initialSymptoms)
      }
    } else {
      setSymptoms(initialSymptoms)
    }

    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (symptoms.length > 0) {
      localStorage.setItem('anxietySymptoms', JSON.stringify(symptoms))
    }
  }, [symptoms])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('anxietyRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.symptom) return

    const record: AnxietyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      severity: 'mild',
      duration: 15,
      trigger: '',
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('anxietyRecords', JSON.stringify(updated))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-teal-600 bg-teal-50 border-teal-100'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional': return <Heart className="w-4 h-4" />
      case 'environmental': return <Volume2 className="w-4 h-4" />
      case 'behavioral': return <Activity className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">불안 행동 트래커</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 불안 신호를 이해하고 편안한 일상을 찾아주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Symptom Guide */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-teal-500" />
                주요 불안 증상 정보
              </h2>
              <div className="space-y-4">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="border-2 border-gray-100 rounded-xl bg-white overflow-hidden transition-all hover:border-teal-200"
                  >
                    <div
                      className="p-4 cursor-pointer flex items-start justify-between"
                      onClick={() => setExpandedSymptom(expandedSymptom === symptom.id ? null : symptom.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{symptom.name}</h3>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {getCategoryIcon(symptom.category)}
                            {symptom.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{symptom.description}</p>
                      </div>
                      {expandedSymptom === symptom.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {expandedSymptom === symptom.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50/50">
                        <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
                          <div>
                            <span className="font-bold text-gray-900 block mb-1">주요 원인 (Triggers)</span>
                            <p className="text-gray-600">{symptom.triggers.join(', ')}</p>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block mb-1">대처 방법</span>
                            <p className="text-gray-600">{symptom.solutions.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="font-bold text-teal-800 mb-3 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                안정을 위한 팁
              </h3>
              <ul className="space-y-2 text-sm text-teal-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  보호자의 차분한 태도가 강아지에게 안정감을 줍니다.
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  '썬더셔츠'나 안정감을 주는 음악이 도움이 될 수 있습니다.
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  증상이 심할 경우 행동 교정 전문가나 수의사와 상담하세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Record Form & History */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-teal-500" />
                증상 기록하기
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">증상 유형</label>
                    <select
                      value={newRecord.symptom}
                      onChange={(e) => setNewRecord({ ...newRecord, symptom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">선택하세요</option>
                      {symptoms.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
                    <select
                      value={newRecord.severity}
                      onChange={(e) => setNewRecord({ ...newRecord, severity: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="mild">경미함 (약간 불안)</option>
                      <option value="moderate">보통 (떨림/짖음)</option>
                      <option value="severe">심각함 (패닉/파괴)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({ ...newRecord, duration: parseInt(e.target.value) || 0 })}
                      min="1"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">유발 상황 (Trigger)</label>
                  <input
                    type="text"
                    value={newRecord.trigger}
                    onChange={(e) => setNewRecord({ ...newRecord, trigger: e.target.value })}
                    placeholder="예: 천둥 소리가 들렸을 때"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={2}
                    placeholder="구체적인 행동이나 대처 방법을 기록해주세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.symptom}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장
                </button>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">최근 기록</h3>
                <div className="space-y-3">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(record.severity)}`}>
                            {getSeverityText(record.severity)}
                          </span>
                          <span className="text-xs text-gray-400">{record.date}</span>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all absolute top-4 right-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-gray-900 mb-1">{record.symptom}</h4>
                      {record.trigger && (
                        <p className="text-sm text-teal-600 mb-1">상황: {record.trigger}</p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">{record.notes}</p>
                      )}
                    </div>
                  ))}
                  {records.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">아직 기록된 내용이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
