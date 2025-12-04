'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Bell, Plus, Trash2, ArrowLeft, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'vaccine' | 'checkup' | 'grooming'
  notes: string
}

export default function VaccinationSchedulerPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', title: '종합백신 추가 접종', date: '2023-11-15', time: '14:00', location: '행복한 동물병원', type: 'vaccine', notes: '컨디션 체크 필수' },
    { id: '2', title: '정기 건강검진', date: '2023-12-01', time: '10:00', location: '서울 동물메디컬센터', type: 'checkup', notes: '금식 8시간' }
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({
    type: 'vaccine',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  })

  const addAppointment = () => {
    if (!newAppt.title || !newAppt.date) return
    const appt: Appointment = {
      id: Date.now().toString(),
      title: newAppt.title,
      date: newAppt.date,
      time: newAppt.time || '09:00',
      location: newAppt.location || '',
      type: newAppt.type as any,
      notes: newAppt.notes || ''
    }
    setAppointments([...appointments, appt].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setIsFormOpen(false)
    setNewAppt({ type: 'vaccine', date: new Date().toISOString().split('T')[0], time: '09:00' })
  }

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-700'
      case 'checkup': return 'bg-blue-100 text-blue-700'
      case 'grooming': return 'bg-pink-100 text-pink-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine': return '예방접종'
      case 'checkup': return '검진'
      case 'grooming': return '미용'
      default: return '기타'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">병원 일정 관리</h1>
                <p className="text-gray-600 mt-1">중요한 건강 일정을 놓치지 마세요.</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              일정 추가
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Upcoming & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-green-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-green-400" />
                  다음 일정
                </h3>
              </div>
              {appointments.length > 0 ? (
                <div>
                  <div className="text-3xl font-black mb-1">
                    {appointments[0].title}
                  </div>
                  <div className="text-green-200 mb-4">
                    {appointments[0].date} {appointments[0].time}
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {appointments[0].location || '장소 미정'}
                  </div>
                </div>
              ) : (
                <div className="text-green-200 py-4">
                  예정된 일정이 없습니다.
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">일정 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">예방접종</span>
                  <span className="font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                    {appointments.filter(a => a.type === 'vaccine').length}건
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">건강검진</span>
                  <span className="font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                    {appointments.filter(a => a.type === 'checkup').length}건
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2 space-y-6">
            {isFormOpen && (
              <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-6 animate-in slide-in-from-top-4">
                <h3 className="font-bold text-lg mb-4">새 일정 추가</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">일정 제목</label>
                    <input
                      type="text"
                      value={newAppt.title || ''}
                      onChange={(e) => setNewAppt({ ...newAppt, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                      placeholder="예: 심장사상충 예방"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                    <input
                      type="date"
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                    <input
                      type="time"
                      value={newAppt.time}
                      onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                    <input
                      type="text"
                      value={newAppt.location || ''}
                      onChange={(e) => setNewAppt({ ...newAppt, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                      placeholder="병원 이름"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                    <select
                      value={newAppt.type}
                      onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                    >
                      <option value="vaccine">예방접종</option>
                      <option value="checkup">건강검진</option>
                      <option value="grooming">미용/관리</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    onClick={addAppointment}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-xs font-bold text-gray-500">{appt.date.split('-')[1]}월</span>
                        <span className="text-2xl font-black text-gray-900">{appt.date.split('-')[2]}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getTypeColor(appt.type)}`}>
                            {getTypeLabel(appt.type)}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {appt.time}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{appt.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 gap-4">
                          {appt.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {appt.location}
                            </span>
                          )}
                          {appt.notes && (
                            <span className="flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {appt.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteAppointment(appt.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
