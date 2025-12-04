'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Plus, Calendar, ArrowLeft, Stethoscope, Syringe, Ambulance, Activity, Trash2, Search, MapPin } from 'lucide-react'

interface MedicalRecord {
  id: string
  date: string
  type: 'checkup' | 'vaccination' | 'treatment' | 'emergency'
  hospital: string
  diagnosis: string
  treatment: string
  notes: string
}

export default function MedicalRecordPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    type: 'checkup' as const,
    hospital: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('medicalRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('medicalRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.hospital || !newRecord.diagnosis) return

    const record: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      type: 'checkup',
      hospital: '',
      diagnosis: '',
      treatment: '',
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('medicalRecords', JSON.stringify(updated))
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup': return '정기검진'
      case 'vaccination': return '예방접종'
      case 'treatment': return '일반치료'
      case 'emergency': return '응급진료'
      default: return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Activity className="w-5 h-5" />
      case 'vaccination': return <Syringe className="w-5 h-5" />
      case 'treatment': return <Stethoscope className="w-5 h-5" />
      case 'emergency': return <Ambulance className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'vaccination': return 'bg-green-100 text-green-600 border-green-200'
      case 'treatment': return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'emergency': return 'bg-red-100 text-red-600 border-red-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const filteredRecords = records.filter(r =>
    r.diagnosis.includes(searchTerm) ||
    r.hospital.includes(searchTerm) ||
    r.treatment.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
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
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">진료 기록부</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            병원 방문 기록을 체계적으로 관리하여 아이의 건강 히스토리를 만드세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-500" />
                새 기록 추가
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">진료 유형</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['checkup', 'vaccination', 'treatment', 'emergency'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewRecord({ ...newRecord, type: type as any })}
                        className={`p-2 rounded-lg border text-sm transition-all ${newRecord.type === type
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {getTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">병원명</label>
                  <input
                    type="text"
                    value={newRecord.hospital}
                    onChange={(e) => setNewRecord({ ...newRecord, hospital: e.target.value })}
                    placeholder="예: 튼튼동물병원"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">진단명</label>
                  <input
                    type="text"
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                    placeholder="예: 슬개골 탈구 1기"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">처방/치료 내용</label>
                  <input
                    type="text"
                    value={newRecord.treatment}
                    onChange={(e) => setNewRecord({ ...newRecord, treatment: e.target.value })}
                    placeholder="예: 소염제 3일분 처방"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={3}
                    placeholder="특이사항이나 다음 내원일 등을 기록하세요."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.hospital || !newRecord.diagnosis}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Record List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="진단명, 병원, 치료내용 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center min-w-[80px]">
                  <span className="text-xs text-gray-500">총 기록</span>
                  <span className="font-bold text-indigo-600">{records.length}</span>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center min-w-[80px]">
                  <span className="text-xs text-gray-500">올해</span>
                  <span className="font-bold text-gray-900">
                    {records.filter(r => r.date.startsWith(new Date().getFullYear().toString())).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline List */}
            <div className="space-y-6 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div key={record.id} className="relative pl-20 group">
                    {/* Date Bubble */}
                    <div className="absolute left-0 top-0 w-16 text-center">
                      <div className="text-xs font-bold text-gray-500">{record.date.split('-')[0]}</div>
                      <div className="text-sm font-bold text-gray-900">{record.date.split('-').slice(1).join('/')}</div>
                    </div>

                    {/* Timeline Dot */}
                    <div className={`absolute left-8 top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm -translate-x-1.5 z-10 ${record.type === 'emergency' ? 'bg-red-500' :
                        record.type === 'vaccination' ? 'bg-green-500' :
                          record.type === 'treatment' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getTypeColor(record.type)}`}>
                            {getTypeIcon(record.type)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{record.diagnosis}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {record.hospital}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2 pl-12">
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <span className="font-bold mr-2 text-gray-900">처방:</span>
                          {record.treatment}
                        </div>
                        {record.notes && (
                          <div className="text-sm text-gray-500 italic">
                            "{record.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pl-20 py-12">
                  <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
                    기록이 없습니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
