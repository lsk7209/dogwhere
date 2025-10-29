'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Plus, Calendar } from 'lucide-react'

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

  useEffect(() => {
    const saved = localStorage.getItem('medicalRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('medicalRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup': return '정기검진'
      case 'vaccination': return '예방접종'
      case 'treatment': return '치료'
      case 'emergency': return '응급실'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-blue-100 text-blue-700'
      case 'vaccination': return 'bg-green-100 text-green-700'
      case 'treatment': return 'bg-yellow-100 text-yellow-700'
      case 'emergency': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-10 h-10 text-indigo-600 mr-3" />
            건강 기록부
          </h1>
          <p className="text-xl text-gray-600">진단 기록, 처방전, 건강 검진 결과를 디지털로 관리합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 기록 추가</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">진료 유형</label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({...newRecord, type: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="checkup">정기검진</option>
                <option value="vaccination">예방접종</option>
                <option value="treatment">치료</option>
                <option value="emergency">응급실</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">병원명</label>
              <input
                type="text"
                value={newRecord.hospital}
                onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">진단명</label>
              <input
                type="text"
                value={newRecord.diagnosis}
                onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">치료 내용</label>
              <input
                type="text"
                value={newRecord.treatment}
                onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addRecord}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              기록 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">의료 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="font-bold text-gray-900">{record.date}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(record.type)}`}>
                        {getTypeLabel(record.type)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">병원:</span> {record.hospital}</p>
                    <p><span className="font-medium">진단:</span> {record.diagnosis}</p>
                    <p><span className="font-medium">치료:</span> {record.treatment}</p>
                    {record.notes && (
                      <p><span className="font-medium">메모:</span> {record.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 건강 기록 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 정기적으로 건강 기록을 업데이트하세요</li>
            <li>• 처방전과 검사 결과를 함께 보관하세요</li>
            <li>• 새로운 병원 방문 시 이전 기록을 가져가세요</li>
            <li>• 응급 상황 시 중요한 의료 정보를 빠르게 확인할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
