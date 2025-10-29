'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus } from 'lucide-react'

export default function DailyRoutineTrackerPage() {
  const [routines, setRoutines] = useState<{date: string, walk: string, food: string, sleep: string}[]>([])
  const [today, setToday] = useState({walk: '', food: '', sleep: ''})

  const addRoutine = () => {
    setRoutines([{date: new Date().toISOString().split('T')[0], ...today}, ...routines])
    setToday({walk: '', food: '', sleep: ''})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-10 h-10 text-blue-600 mr-3" />
            일상 생활 패턴 추적
          </h1>
          <p className="text-xl text-gray-600">산책, 식사, 수면 등 일상 패턴을 기록하고 분석합니다</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="산책 시간" value={today.walk} onChange={(e)=>setToday({...today, walk: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="식사 시간" value={today.food} onChange={(e)=>setToday({...today, food: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="수면 패턴" value={today.sleep} onChange={(e)=>setToday({...today, sleep: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <button onClick={addRoutine} className="w-full bg-blue-600 text-white py-2 rounded-lg">기록 추가</button>
          </div>
          <div className="space-y-2">
            {routines.slice(0, 10).map((r, i) => (
              <div key={i} className="border rounded-lg p-4">
                <p className="font-bold">{r.date}</p>
                <p>산책: {r.walk} | 식사: {r.food} | 수면: {r.sleep}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

