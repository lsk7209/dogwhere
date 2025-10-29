'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Plus } from 'lucide-react'

export default function AppointmentManagerPage() {
  const [appointments, setAppointments] = useState<{id: string, type: string, date: string, time: string, place: string}[]>([])
  const [form, setForm] = useState({type: 'hospital', date: '', time: '', place: ''})

  const addAppointment = () => {
    setAppointments([...appointments, {...form, id: Date.now().toString()}])
    setForm({type: 'hospital', date: '', time: '', place: ''})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-10 h-10 text-purple-600 mr-3" />
            병원/미용 예약 관리
          </h1>
          <p className="text-xl text-gray-600">동물병원, 미용실 예약 일정을 한곳에서 관리합니다</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-4 mb-6">
            <select value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
              <option value="hospital">동물병원</option>
              <option value="grooming">미용실</option>
            </select>
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input type="time" value={form.time} onChange={(e)=>setForm({...form, time: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="장소명" value={form.place} onChange={(e)=>setForm({...form, place: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <button onClick={addAppointment} className="w-full bg-purple-600 text-white py-2 rounded-lg">예약 추가</button>
          </div>
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="border rounded-lg p-4">
                <p className="font-bold">{a.type === 'hospital' ? '🏥 동물병원' : '✂️ 미용실'}</p>
                <p>{a.date} {a.time} - {a.place}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

