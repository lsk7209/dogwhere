'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus, ArrowLeft, Clock, Utensils, Moon, Footprints, Calendar, Trash2, CheckCircle } from 'lucide-react'

interface Routine {
  id: string
  date: string
  time: string
  type: 'walk' | 'food' | 'sleep' | 'play' | 'other'
  duration: string
  notes: string
}

export default function DailyRoutineTrackerPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [newRoutine, setNewRoutine] = useState({
    time: '',
    type: 'walk' as const,
    duration: '',
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('dailyRoutines')
    if (saved) {
      try {
        setRoutines(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (routines.length > 0) {
      localStorage.setItem('dailyRoutines', JSON.stringify(routines))
    }
  }, [routines])

  const addRoutine = () => {
    if (!newRoutine.time) return

    const routine: Routine = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRoutine
    }
    setRoutines([routine, ...routines])
    setNewRoutine({
      time: '',
      type: 'walk',
      duration: '',
      notes: ''
    })
  }

  const deleteRoutine = (id: string) => {
    const updated = routines.filter(r => r.id !== id)
    setRoutines(updated)
    localStorage.setItem('dailyRoutines', JSON.stringify(updated))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'walk': return <Footprints className="w-5 h-5" />
      case 'food': return <Utensils className="w-5 h-5" />
      case 'sleep': return <Moon className="w-5 h-5" />
      case 'play': return <Activity className="w-5 h-5" />
      default: return <CheckCircle className="w-5 h-5" />
    }
  }

  const getLabel = (type: string) => {
    switch (type) {
      case 'walk': return '산책'
      case 'food': return '식사'
      case 'sleep': return '수면'
      case 'play': return '놀이'
      default: return '기타'
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'walk': return 'bg-green-100 text-green-600 border-green-200'
      case 'food': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'sleep': return 'bg-indigo-100 text-indigo-600 border-indigo-200'
      case 'play': return 'bg-pink-100 text-pink-600 border-pink-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // Group routines by date
  const groupedRoutines = routines.reduce((acc, routine) => {
    if (!acc[routine.date]) acc[routine.date] = []
    acc[routine.date].push(routine)
    return acc
  }, {} as Record<string, Routine[]>)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
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
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">데일리 루틴 트래커</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 하루 일과를 기록하고 규칙적인 생활 패턴을 만들어주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-500" />
                새 활동 기록
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">활동 종류</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['walk', 'food', 'sleep', 'play', 'other'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewRoutine({ ...newRoutine, type: type as any })}
                        className={`p-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${newRoutine.type === type
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                          }`}
                      >
                        {getIcon(type)}
                        {getLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간 / 양</label>
                  <input
                    type="text"
                    value={newRoutine.duration}
                    onChange={(e) => setNewRoutine({ ...newRoutine, duration: e.target.value })}
                    placeholder="예: 30분, 사료 50g"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRoutine.notes}
                    onChange={(e) => setNewRoutine({ ...newRoutine, notes: e.target.value })}
                    rows={3}
                    placeholder="특이사항 기록"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={addRoutine}
                  disabled={!newRoutine.time}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          <div className="lg:col-span-2 space-y-8">
            {Object.keys(groupedRoutines).length > 0 ? (
              Object.entries(groupedRoutines).sort((a, b) => b[0].localeCompare(a[0])).map(([date, dayRoutines]) => (
                <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    {date}
                  </h3>

                  <div className="relative pl-8 border-l-2 border-gray-100 space-y-8">
                    {dayRoutines.sort((a, b) => a.time.localeCompare(b.time)).map((routine) => (
                      <div key={routine.id} className="relative group">
                        <div className={`absolute -left-[41px] p-2 rounded-full border-2 border-white shadow-sm ${getColor(routine.type)}`}>
                          {getIcon(routine.type)}
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-sm font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                {routine.time}
                              </span>
                              <h4 className="font-bold text-gray-900">{getLabel(routine.type)}</h4>
                            </div>

                            {routine.duration && (
                              <p className="text-sm text-indigo-600 font-medium mb-1">
                                {routine.duration}
                              </p>
                            )}

                            {routine.notes && (
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg inline-block mt-1">
                                {routine.notes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => deleteRoutine(routine.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">기록이 없습니다</h3>
                <p className="text-gray-500">
                  왼쪽 양식을 통해<br />오늘의 활동을 기록해보세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
