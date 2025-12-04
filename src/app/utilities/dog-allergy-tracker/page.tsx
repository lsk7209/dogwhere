'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, CheckCircle, AlertTriangle, Clock, Heart, ArrowLeft, Shield, Search, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface AllergySymptom {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  category: 'food' | 'environmental' | 'contact' | 'inhalant'
  triggers: string[]
  symptoms: string[]
  treatments: string[]
  completed: boolean
  date?: string
}

interface AllergyRecord {
  id: string
  date: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  trigger: string
  duration: number
  notes: string
}

export default function DogAllergyTrackerPage() {
  const [symptoms, setSymptoms] = useState<AllergySymptom[]>([])
  const [records, setRecords] = useState<AllergyRecord[]>([])
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null)
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    trigger: '',
    duration: 15,
    notes: ''
  })

  const initialSymptoms: AllergySymptom[] = [
    {
      id: '1',
      name: '음식 알레르기',
      description: '특정 단백질원(닭고기, 소고기 등)에 대한 과민 반응',
      severity: 'moderate',
      category: 'food',
      triggers: ['닭고기', '소고기', '유제품', '밀가루'],
      symptoms: ['피부 발진', '눈물 자국', '귀 염증', '설사/구토'],
      treatments: ['가수분해 사료 급여', '단일 단백질 식단', '간식 중단'],
      completed: false
    },
    {
      id: '2',
      name: '환경 알레르기 (아토피)',
      description: '집먼지 진드기, 꽃가루 등 환경 요인에 의한 반응',
      severity: 'moderate',
      category: 'environmental',
      triggers: ['꽃가루', '먼지 진드기', '곰팡이'],
      symptoms: ['발 핥기', '전신 가려움', '재채기', '결막염'],
      treatments: ['산책 후 발 씻기', '공기청정기 사용', '약용 샴푸'],
      completed: false
    },
    {
      id: '3',
      name: '접촉성 알레르기',
      description: '특정 물질이 피부에 닿았을 때 발생하는 반응',
      severity: 'mild',
      category: 'contact',
      triggers: ['플라스틱 식기', '합성 섬유', '세제/샴푸'],
      symptoms: ['접촉 부위 발적', '부종', '탈모'],
      treatments: ['원인 물질 제거', '스테인리스 식기 교체', '저자극 세제'],
      completed: false
    }
  ]

  useEffect(() => {
    const savedSymptoms = localStorage.getItem('allergySymptoms')
    const savedRecords = localStorage.getItem('allergyRecords')

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
      localStorage.setItem('allergySymptoms', JSON.stringify(symptoms))
    }
  }, [symptoms])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('allergyRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.symptom) return

    const record: AllergyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      severity: 'mild',
      trigger: '',
      duration: 15,
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('allergyRecords', JSON.stringify(updated))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-100'
      case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-100'
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

  const getCategoryBadge = (category: string) => {
    const styles = {
      food: 'bg-orange-100 text-orange-700',
      environmental: 'bg-blue-100 text-blue-700',
      contact: 'bg-purple-100 text-purple-700',
      inhalant: 'bg-cyan-100 text-cyan-700'
    }
    const labels = {
      food: '음식',
      environmental: '환경',
      contact: '접촉',
      inhalant: '흡입'
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[category as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {labels[category as keyof typeof labels] || category}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">알레르기 트래커</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 알레르기 반응을 기록하고 원인을 찾아보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Symptom Guide */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Search className="w-5 h-5 mr-2 text-amber-500" />
                주요 알레르기 정보
              </h2>
              <div className="space-y-4">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="border-2 border-gray-100 rounded-xl bg-white overflow-hidden transition-all hover:border-amber-200"
                  >
                    <div
                      className="p-4 cursor-pointer flex items-start justify-between"
                      onClick={() => setExpandedSymptom(expandedSymptom === symptom.id ? null : symptom.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{symptom.name}</h3>
                          {getCategoryBadge(symptom.category)}
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
                            <span className="font-bold text-gray-900 block mb-1">주요 증상</span>
                            <p className="text-gray-600">{symptom.symptoms.join(', ')}</p>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block mb-1">흔한 원인</span>
                            <p className="text-gray-600">{symptom.triggers.join(', ')}</p>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block mb-1">관리 방법</span>
                            <p className="text-gray-600">{symptom.treatments.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                알레르기 관리 팁
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  새로운 간식은 한 번에 한 종류씩만 급여하며 반응을 살피세요.
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  산책 후에는 발을 깨끗이 닦아 외부 알레르겐을 제거해주세요.
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  증상이 심하거나 호흡 곤란이 오면 즉시 병원에 가야 합니다.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Record Form & History */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-amber-500" />
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">의심 유형</label>
                    <select
                      value={newRecord.symptom}
                      onChange={(e) => setNewRecord({ ...newRecord, symptom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">선택하세요</option>
                      {symptoms.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      <option value="기타">기타 / 불확실</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
                    <select
                      value={newRecord.severity}
                      onChange={(e) => setNewRecord({ ...newRecord, severity: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="mild">경미함 (약간 긁음)</option>
                      <option value="moderate">보통 (피부 발적)</option>
                      <option value="severe">심각함 (상처/탈모)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">추정 원인</label>
                    <input
                      type="text"
                      value={newRecord.trigger}
                      onChange={(e) => setNewRecord({ ...newRecord, trigger: e.target.value })}
                      placeholder="예: 닭가슴살 간식"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상세 증상 메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={2}
                    placeholder="구체적인 증상이나 특이사항을 기록해주세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.symptom}
                  className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <p className="text-sm text-amber-600 mb-1">원인: {record.trigger}</p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">{record.notes}</p>
                      )}
                    </div>
                  ))}
                  {records.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm">아직 기록된 증상이 없습니다.</p>
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
