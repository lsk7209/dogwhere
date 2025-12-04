'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Smile, Plus, ArrowLeft, Zap, Activity, Calendar, Trash2, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react'

interface MoodRecord {
  id: string
  date: string
  time: string
  mood: 'happy' | 'excited' | 'calm' | 'neutral' | 'anxious' | 'sad'
  energy: 'high' | 'medium' | 'low'
  activity: string
  notes: string
}

export default function MoodTrackerPage() {
  const [records, setRecords] = useState<MoodRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    time: '',
    mood: 'happy' as const,
    energy: 'medium' as const,
    activity: '',
    notes: ''
  })

  const moodOptions = [
    { value: 'happy', label: '행복함', icon: '😊', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { value: 'excited', label: '신남', icon: '🤩', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { value: 'calm', label: '평온함', icon: '😌', color: 'bg-green-100 text-green-600 border-green-200' },
    { value: 'neutral', label: '보통', icon: '😐', color: 'bg-gray-100 text-gray-600 border-gray-200' },
    { value: 'anxious', label: '불안함', icon: '😰', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { value: 'sad', label: '우울함', icon: '😢', color: 'bg-blue-100 text-blue-600 border-blue-200' }
  ]

  const energyOptions = [
    { value: 'high', label: '높음', icon: <Zap className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
    { value: 'medium', label: '보통', icon: <Activity className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-600' },
    { value: 'low', label: '낮음', icon: <Cloud className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('moodRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('moodRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.time || !newRecord.activity) return

    const record: MoodRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      time: '',
      mood: 'happy',
      energy: 'medium',
      activity: '',
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('moodRecords', JSON.stringify(updated))
  }

  const getMoodOption = (mood: string) => moodOptions.find(m => m.value === mood)
  const getEnergyOption = (energy: string) => energyOptions.find(e => e.value === energy)

  // Stats
  const moodCounts = records.reduce((acc, r) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-yellow-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
              <Smile className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">기분 다이어리</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            오늘 우리 아이의 기분은 어땠나요? 매일의 감정을 기록해보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-yellow-500" />
                오늘의 기분 기록
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">현재 기분</label>
                  <div className="grid grid-cols-3 gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setNewRecord({ ...newRecord, mood: mood.value as any })}
                        className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center aspect-square ${newRecord.mood === mood.value
                            ? mood.color
                            : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-2xl mb-1">{mood.icon}</span>
                        <span className="text-xs font-bold">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                    <input
                      type="time"
                      value={newRecord.time}
                      onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">에너지</label>
                    <div className="flex rounded-xl bg-gray-100 p-1">
                      {energyOptions.map((energy) => (
                        <button
                          key={energy.value}
                          onClick={() => setNewRecord({ ...newRecord, energy: energy.value as any })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${newRecord.energy === energy.value
                              ? 'bg-white shadow-sm text-gray-900'
                              : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                          {energy.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">활동 내용</label>
                  <input
                    type="text"
                    value={newRecord.activity}
                    onChange={(e) => setNewRecord({ ...newRecord, activity: e.target.value })}
                    placeholder="예: 공원 산책, 터그 놀이"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={2}
                    placeholder="특이사항을 적어주세요"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.time || !newRecord.activity}
                  className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: History & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-black text-gray-900 mb-1">{records.length}</div>
                <div className="text-xs text-gray-500 font-medium">총 기록</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-black text-yellow-500 mb-1">
                  {topMood ? getMoodOption(topMood)?.icon : '-'}
                </div>
                <div className="text-xs text-gray-500 font-medium">주요 기분</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center sm:col-span-1 col-span-2">
                <div className="text-2xl font-black text-gray-900 mb-1">
                  {records.filter(r => r.energy === 'high').length}
                </div>
                <div className="text-xs text-gray-500 font-medium">에너지 넘침</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                기분 흐름
              </h2>

              <div className="space-y-4">
                {records.length > 0 ? (
                  records.map((record) => {
                    const moodOpt = getMoodOption(record.mood)
                    const energyOpt = getEnergyOption(record.energy)

                    return (
                      <div key={record.id} className="group relative flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-white shadow-sm`}>
                          {moodOpt?.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-bold text-gray-900 mr-2">{record.activity}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${energyOpt?.color} bg-opacity-10`}>
                                에너지 {energyOpt?.label}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                              {record.date} {record.time}
                            </span>
                          </div>

                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                    아직 기록된 기분이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-yellow-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-200" />
                행복한 강아지를 위한 팁
              </h3>
              <ul className="space-y-3 text-yellow-50 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-200">•</span>
                  규칙적인 산책은 스트레스 해소에 가장 좋습니다.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-200">•</span>
                  새로운 장난감이나 놀이로 호기심을 자극해주세요.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-200">•</span>
                  보호자의 기분이 강아지에게도 전달됩니다. 함께 웃어주세요!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
