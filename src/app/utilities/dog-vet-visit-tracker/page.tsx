'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react'

interface VetVisit {
  id: string
  date: string
  type: string
  vetName: string
  reason: string
  diagnosis: string
  treatment: string
  medication: string
  cost: number
  nextVisit: string
  notes: string
}

interface Vaccination {
  id: string
  name: string
  date: string
  nextDue: string
  completed: boolean
}

export default function DogVetVisitTrackerPage() {
  const [visits, setVisits] = useState<VetVisit[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [newVisit, setNewVisit] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    vetName: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    cost: 0,
    nextVisit: '',
    notes: ''
  })
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    nextDue: ''
  })

  const visitTypes = [
    '정기 검진',
    '예방접종',
    '질병 치료',
    '응급실',
    '수술',
    '치과',
    '안과',
    '피부과',
    '정형외과',
    '기타'
  ]

  const commonVaccinations = [
    '종합백신 (DHPPL)',
    '켄넬코프',
    '광견병',
    '인플루엔자',
    '레프토스피라',
    '기타'
  ]

  const initialVaccinations: Vaccination[] = [
    {
      id: '1',
      name: '종합백신 (DHPPL)',
      date: '',
      nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '2',
      name: '켄넬코프',
      date: '',
      nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '3',
      name: '광견병',
      date: '',
      nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    }
  ]

  useEffect(() => {
    const savedVisits = localStorage.getItem('vetVisits')
    const savedVaccinations = localStorage.getItem('vaccinations')
    
    if (savedVisits) {
      try {
        setVisits(JSON.parse(savedVisits))
      } catch (e) {}
    }
    
    if (savedVaccinations) {
      try {
        setVaccinations(JSON.parse(savedVaccinations))
      } catch (e) {
        setVaccinations(initialVaccinations)
      }
    } else {
      setVaccinations(initialVaccinations)
    }
  }, [])

  useEffect(() => {
    if (visits.length > 0) {
      localStorage.setItem('vetVisits', JSON.stringify(visits))
    }
  }, [visits])

  useEffect(() => {
    if (vaccinations.length > 0) {
      localStorage.setItem('vaccinations', JSON.stringify(vaccinations))
    }
  }, [vaccinations])

  const addVisit = () => {
    if (!newVisit.type || !newVisit.vetName) return

    const visit: VetVisit = {
      id: Date.now().toString(),
      ...newVisit
    }
    setVisits([visit, ...visits])
    setNewVisit({
      date: new Date().toISOString().split('T')[0],
      type: '',
      vetName: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      medication: '',
      cost: 0,
      nextVisit: '',
      notes: ''
    })
  }

  const addVaccination = () => {
    if (!newVaccination.name || !newVaccination.date) return

    const vaccination: Vaccination = {
      id: Date.now().toString(),
      ...newVaccination,
      completed: true
    }
    setVaccinations([vaccination, ...vaccinations])
    setNewVaccination({
      name: '',
      date: new Date().toISOString().split('T')[0],
      nextDue: ''
    })
  }

  const completeVaccination = (vaccinationId: string) => {
    const today = new Date().toISOString().split('T')[0]
    setVaccinations(vaccinations.map(vaccination => 
      vaccination.id === vaccinationId 
        ? { 
            ...vaccination, 
            completed: true,
            date: today,
            nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          } 
        : vaccination
    ))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '정기 검진': return 'text-blue-600 bg-blue-100'
      case '예방접종': return 'text-green-600 bg-green-100'
      case '질병 치료': return 'text-red-600 bg-red-100'
      case '응급실': return 'text-red-600 bg-red-100'
      case '수술': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isOverdue = (nextDue: string) => {
    return new Date(nextDue) < new Date()
  }

  const totalVisits = visits.length
  const totalCost = visits.reduce((sum, visit) => sum + visit.cost, 0)
  const completedVaccinations = vaccinations.filter(vaccination => vaccination.completed).length
  const overdueVaccinations = vaccinations.filter(vaccination => !vaccination.completed && isOverdue(vaccination.nextDue)).length
  const nextVisit = visits.find(visit => visit.nextVisit && new Date(visit.nextVisit) > new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Stethoscope className="w-10 h-10 text-blue-600 mr-3" />
            병원 방문 추적기
          </h1>
          <p className="text-xl text-gray-600">동물병원 방문 기록과 진료 내용을 체계적으로 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalVisits}회</p>
            <p className="text-sm text-gray-600">병원 방문</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedVaccinations}개</p>
            <p className="text-sm text-gray-600">완료된 접종</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{overdueVaccinations}개</p>
            <p className="text-sm text-gray-600">연체된 접종</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">₩{totalCost.toLocaleString()}</p>
            <p className="text-sm text-gray-600">총 진료비</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">예방접종 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">접종명</label>
                    <select
                      value={newVaccination.name}
                      onChange={(e) => setNewVaccination({...newVaccination, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">접종 선택</option>
                      {commonVaccinations.map((vaccination) => (
                        <option key={vaccination} value={vaccination}>{vaccination}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">접종 날짜</label>
                    <input
                      type="date"
                      value={newVaccination.date}
                      onChange={(e) => setNewVaccination({...newVaccination, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">다음 접종 예정일</label>
                  <input
                    type="date"
                    value={newVaccination.nextDue}
                    onChange={(e) => setNewVaccination({...newVaccination, nextDue: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addVaccination}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  예방접종 추가
                </button>
              </div>

              <div className="space-y-4">
                {vaccinations.map((vaccination) => (
                  <div key={vaccination.id} className={`border-2 rounded-lg p-6 ${
                    isOverdue(vaccination.nextDue) && !vaccination.completed 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{vaccination.name}</h3>
                        <div className="text-sm text-gray-600">
                          {vaccination.completed ? (
                            <p className="text-green-600">완료: {vaccination.date}</p>
                          ) : (
                            <p>다음 예정: {vaccination.nextDue}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {vaccination.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <button
                            onClick={() => completeVaccination(vaccination.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            완료
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {isOverdue(vaccination.nextDue) && !vaccination.completed && (
                      <p className="text-red-600 font-semibold">⚠️ 접종 연체됨</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">병원 방문 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">방문 날짜</label>
                    <input
                      type="date"
                      value={newVisit.date}
                      onChange={(e) => setNewVisit({...newVisit, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">진료 유형</label>
                    <select
                      value={newVisit.type}
                      onChange={(e) => setNewVisit({...newVisit, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">진료 유형 선택</option>
                      {visitTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수의사명</label>
                    <input
                      type="text"
                      value={newVisit.vetName}
                      onChange={(e) => setNewVisit({...newVisit, vetName: e.target.value})}
                      placeholder="수의사 이름"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">진료비 (원)</label>
                    <input
                      type="number"
                      value={newVisit.cost}
                      onChange={(e) => setNewVisit({...newVisit, cost: parseInt(e.target.value) || 0})}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">방문 사유</label>
                  <input
                    type="text"
                    value={newVisit.reason}
                    onChange={(e) => setNewVisit({...newVisit, reason: e.target.value})}
                    placeholder="방문한 이유"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">진단</label>
                  <input
                    type="text"
                    value={newVisit.diagnosis}
                    onChange={(e) => setNewVisit({...newVisit, diagnosis: e.target.value})}
                    placeholder="진단 결과"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">치료</label>
                  <input
                    type="text"
                    value={newVisit.treatment}
                    onChange={(e) => setNewVisit({...newVisit, treatment: e.target.value})}
                    placeholder="치료 내용"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">처방약</label>
                  <input
                    type="text"
                    value={newVisit.medication}
                    onChange={(e) => setNewVisit({...newVisit, medication: e.target.value})}
                    placeholder="처방받은 약물"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">다음 방문 예정일</label>
                  <input
                    type="date"
                    value={newVisit.nextVisit}
                    onChange={(e) => setNewVisit({...newVisit, nextVisit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newVisit.notes}
                    onChange={(e) => setNewVisit({...newVisit, notes: e.target.value})}
                    rows={3}
                    placeholder="추가 메모"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addVisit}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  병원 방문 기록 추가
                </button>
              </div>

              {visits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 병원 방문 기록</h3>
                  {visits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{visit.type}</p>
                          <p className="text-sm text-gray-600">{visit.date} - {visit.vetName}</p>
                          <p className="text-sm text-gray-600">사유: {visit.reason}</p>
                          {visit.diagnosis && (
                            <p className="text-sm text-gray-600">진단: {visit.diagnosis}</p>
                          )}
                          {visit.notes && (
                            <p className="text-sm text-gray-600 mt-1">{visit.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">₩{visit.cost.toLocaleString()}</span>
                          {visit.nextVisit && (
                            <p className="text-xs text-gray-600">다음: {visit.nextVisit}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {nextVisit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
              <Clock className="w-6 h-6 text-yellow-600 mr-2" />
              다음 병원 방문 예정
            </h2>
            <p className="text-gray-700">
              <strong>날짜:</strong> {nextVisit.nextVisit}<br />
              <strong>사유:</strong> {nextVisit.reason}<br />
              <strong>수의사:</strong> {nextVisit.vetName}
            </p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏥 병원 방문 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 정기적인 건강 검진을 받으세요</li>
                <li>• 예방접종을 정시에 맞춰 받으세요</li>
                <li>• 진료 기록을 꼼꼼히 관리하세요</li>
                <li>• 수의사와의 소통을 원활히 하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 응급상황 시 즉시 병원에 연락하세요</li>
                <li>• 처방약을 정확히 복용시키세요</li>
                <li>• 다음 방문일을 놓치지 마세요</li>
                <li>• 강아지의 이상 증상을 놓치지 마세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
