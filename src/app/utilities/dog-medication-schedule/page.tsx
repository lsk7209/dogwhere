'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pill, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  instructions: string
  active: boolean
}

interface MedicationRecord {
  id: string
  medicationId: string
  date: string
  time: string
  given: boolean
  notes: string
}

export default function DogMedicationSchedulePage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [records, setRecords] = useState<MedicationRecord[]>([])
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    active: true
  })
  const [newRecord, setNewRecord] = useState({
    medicationId: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    given: false,
    notes: ''
  })

  const frequencyOptions = [
    '매일 1회',
    '매일 2회',
    '매일 3회',
    '매일 4회',
    '격일 1회',
    '주 1회',
    '주 2회',
    '월 1회',
    '필요시',
    '기타'
  ]

  useEffect(() => {
    const savedMedications = localStorage.getItem('medications')
    const savedRecords = localStorage.getItem('medicationRecords')
    
    if (savedMedications) {
      try {
        setMedications(JSON.parse(savedMedications))
      } catch (e) {}
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem('medications', JSON.stringify(medications))
    }
  }, [medications])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('medicationRecords', JSON.stringify(records))
    }
  }, [records])

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return

    const medication: Medication = {
      id: Date.now().toString(),
      ...newMedication
    }
    setMedications([medication, ...medications])
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: '',
      active: true
    })
  }

  const addRecord = () => {
    if (!newRecord.medicationId) return

    const record: MedicationRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      medicationId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      given: false,
      notes: ''
    })
  }

  const toggleMedication = (medicationId: string) => {
    setMedications(medications.map(medication => 
      medication.id === medicationId 
        ? { ...medication, active: !medication.active } 
        : medication
    ))
  }

  const toggleRecord = (recordId: string) => {
    setRecords(records.map(record => 
      record.id === recordId 
        ? { ...record, given: !record.given } 
        : record
    ))
  }

  const getMedicationById = (id: string) => {
    return medications.find(medication => medication.id === id)
  }

  const getTodaysRecords = () => {
    const today = new Date().toISOString().split('T')[0]
    return records.filter(record => record.date === today)
  }

  const getUpcomingMedications = () => {
    const today = new Date().toISOString().split('T')[0]
    return medications.filter(medication => 
      medication.active && 
      medication.startDate <= today && 
      (medication.endDate === '' || medication.endDate >= today)
    )
  }

  const getMissedMedications = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaysRecords = getTodaysRecords()
    const activeMedications = getUpcomingMedications()
    
    return activeMedications.filter(medication => {
      const hasRecord = todaysRecords.some(record => 
        record.medicationId === medication.id && record.given
      )
      return !hasRecord
    })
  }

  const getFrequencyColor = (frequency: string) => {
    if (frequency.includes('매일')) return 'text-red-600 bg-red-100'
    if (frequency.includes('격일')) return 'text-yellow-600 bg-yellow-100'
    if (frequency.includes('주')) return 'text-green-600 bg-green-100'
    if (frequency.includes('월')) return 'text-blue-600 bg-blue-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
  }

  const getStatusText = (active: boolean) => {
    return active ? '활성' : '비활성'
  }

  const totalMedications = medications.length
  const activeMedications = medications.filter(medication => medication.active).length
  const todaysRecords = getTodaysRecords()
  const givenToday = todaysRecords.filter(record => record.given).length
  const missedToday = getMissedMedications().length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Pill className="w-10 h-10 text-blue-600 mr-3" />
            투약 일정 관리
          </h1>
          <p className="text-xl text-gray-600">약물 투여 일정과 복용 기록을 체계적으로 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Pill className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMedications}개</p>
            <p className="text-sm text-gray-600">등록된 약물</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{activeMedications}개</p>
            <p className="text-sm text-gray-600">활성 약물</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{givenToday}회</p>
            <p className="text-sm text-gray-600">오늘 복용</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{missedToday}개</p>
            <p className="text-sm text-gray-600">놓친 약물</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">약물 등록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">약물명</label>
                    <input
                      type="text"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                      placeholder="예: 항생제"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">용량</label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                      placeholder="예: 250mg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">복용 빈도</label>
                    <select
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">빈도 선택</option>
                      {frequencyOptions.map((frequency) => (
                        <option key={frequency} value={frequency}>{frequency}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                    <input
                      type="date"
                      value={newMedication.startDate}
                      onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">종료일 (선택사항)</label>
                  <input
                    type="date"
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">복용 지침</label>
                  <textarea
                    value={newMedication.instructions}
                    onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                    rows={3}
                    placeholder="복용 방법, 주의사항 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addMedication}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  약물 등록
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">등록된 약물</h3>
                {medications.map((medication) => (
                  <div key={medication.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{medication.dosage}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getFrequencyColor(medication.frequency)}`}>
                            {medication.frequency}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(medication.active)}`}>
                            {getStatusText(medication.active)}
                          </span>
                          <span className="text-gray-500">
                            {medication.startDate} ~ {medication.endDate || '무제한'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMedication(medication.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          medication.active
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {medication.instructions && (
                      <div className="text-sm text-gray-600">
                        <p><strong>복용 지침:</strong> {medication.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">투약 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">약물 선택</label>
                    <select
                      value={newRecord.medicationId}
                      onChange={(e) => setNewRecord({...newRecord, medicationId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">약물 선택</option>
                      {medications.filter(medication => medication.active).map((medication) => (
                        <option key={medication.id} value={medication.id}>
                          {medication.name} ({medication.dosage})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">투약 날짜</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">투약 시간</label>
                    <input
                      type="time"
                      value={newRecord.time}
                      onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="given"
                      checked={newRecord.given}
                      onChange={(e) => setNewRecord({...newRecord, given: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="given" className="text-sm text-gray-700">투약 완료</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={2}
                    placeholder="투약 관련 메모"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  투약 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">투약 기록</h3>
                  {records.slice(0, 10).map((record) => {
                    const medication = getMedicationById(record.medicationId)
                    return (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {medication?.name || '알 수 없는 약물'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {record.date} {record.time}
                            </p>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => toggleRecord(record.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                record.given
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {missedToday > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              오늘 놓친 약물
            </h2>
            <div className="space-y-2">
              {getMissedMedications().map((medication) => (
                <p key={medication.id} className="text-gray-700">
                  • {medication.name} ({medication.dosage}) - {medication.frequency}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💊 투약 일정 관리 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 정확한 시간에 투약하세요</li>
                <li>• 투약 기록을 꼼꼼히 관리하세요</li>
                <li>• 수의사의 지시를 정확히 따르세요</li>
                <li>• 부작용을 주의 깊게 관찰하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 투약을 놓쳤을 때는 수의사에게 문의하세요</li>
                <li>• 약물을 안전한 곳에 보관하세요</li>
                <li>• 복용량을 임의로 변경하지 마세요</li>
                <li>• 이상 증상이 있으면 즉시 중단하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
