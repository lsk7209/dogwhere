'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Plus, Trash2, MapPin, Clock, ArrowLeft, Scissors, Stethoscope } from 'lucide-react'

interface Appointment {
  id: string
  type: 'hospital' | 'grooming' | 'other'
  date: string
  time: string
  place: string
  memo?: string
}

export default function AppointmentManagerPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [form, setForm] = useState<Omit<Appointment, 'id'>>({
    type: 'hospital',
    date: '',
    time: '',
    place: '',
    memo: ''
  })

  const addAppointment = () => {
    if (!form.date || !form.time || !form.place) return
    setAppointments([...appointments, { ...form, id: Date.now().toString() }].sort((a, b) =>
      new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    ))
    setForm({ type: 'hospital', date: '', time: '', place: '', memo: '' })
  }

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Stethoscope className="w-5 h-5" />
      case 'grooming': return <Scissors className="w-5 h-5" />
      default: return <Calendar className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital': return '동물병원'
      case 'grooming': return '미용실'
      default: return '기타 일정'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-50 text-red-600 border-red-200'
      case 'grooming': return 'bg-purple-50 text-purple-600 border-purple-200'
      default: return 'bg-blue-50 text-blue-600 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">일정 관리</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            병원 방문, 미용 등 중요한 일정을 잊지 않도록 관리하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-purple-500" />
                새 일정 추가
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">일정 종류</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['hospital', 'grooming', 'other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setForm({ ...form, type: type as any })}
                        className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-all ${form.type === type
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-100 text-gray-500 hover:border-purple-200'
                          }`}
                      >
                        {type === 'hospital' ? '병원' : type === 'grooming' ? '미용' : '기타'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                  <input
                    type="text"
                    placeholder="예: 튼튼동물병원"
                    value={form.place}
                    onChange={(e) => setForm({ ...form, place: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">메모 (선택)</label>
                  <input
                    type="text"
                    placeholder="예: 예방접종 3차"
                    value={form.memo}
                    onChange={(e) => setForm({ ...form, memo: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  onClick={addAppointment}
                  disabled={!form.date || !form.time || !form.place}
                  className="w-full mt-4 bg-purple-600 text-white py-3.5 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  일정 추가하기
                </button>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                  예정된 일정
                </span>
                <span className="text-sm font-normal text-gray-500">
                  총 {appointments.length}개
                </span>
              </h2>

              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border ${getTypeColor(appointment.type)}`}>
                          {getTypeIcon(appointment.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${getTypeColor(appointment.type)} bg-opacity-10 border-none`}>
                              {getTypeLabel(appointment.type)}
                            </span>
                            <h3 className="font-bold text-gray-900">{appointment.place}</h3>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {appointment.time}
                            </span>
                          </div>
                          {appointment.memo && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                              {appointment.memo}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="mt-4 md:mt-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end md:self-center opacity-0 group-hover:opacity-100"
                        title="삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">예정된 일정이 없습니다</p>
                  <p className="text-sm">새로운 일정을 추가해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
