'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Smile, Frown, Meh, Plus } from 'lucide-react'

interface MoodRecord {
  id: string
  date: string
  time: string
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited' | 'calm'
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
    { value: 'happy', label: '행복함', icon: '😊', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'excited', label: '흥분함', icon: '🤩', color: 'text-orange-600 bg-orange-100' },
    { value: 'calm', label: '평온함', icon: '😌', color: 'text-blue-600 bg-blue-100' },
    { value: 'neutral', label: '보통', icon: '😐', color: 'text-gray-600 bg-gray-100' },
    { value: 'anxious', label: '불안함', icon: '😰', color: 'text-purple-600 bg-purple-100' },
    { value: 'sad', label: '우울함', icon: '😢', color: 'text-indigo-600 bg-indigo-100' }
  ]

  const energyOptions = [
    { value: 'high', label: '높음', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'low', label: '낮음', color: 'text-red-600 bg-red-100' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('moodRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
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

  const getMoodIcon = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood)
    return moodOption?.icon || '😐'
  }

  const getMoodColor = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood)
    return moodOption?.color || 'text-gray-600 bg-gray-100'
  }

  const getMoodLabel = (mood: string) => {
    const moodOption = moodOptions.find(m => m.value === mood)
    return moodOption?.label || mood
  }

  const getEnergyColor = (energy: string) => {
    const energyOption = energyOptions.find(e => e.value === energy)
    return energyOption?.color || 'text-gray-600 bg-gray-100'
  }

  const getEnergyLabel = (energy: string) => {
    const energyOption = energyOptions.find(e => e.value === energy)
    return energyOption?.label || energy
  }

  const moodStats = records.reduce((acc, record) => {
    acc[record.mood] = (acc[record.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topMoods = Object.entries(moodStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Smile className="w-10 h-10 text-yellow-600 mr-3" />
            기분 상태 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 기분과 감정 상태를 일일 기록합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 기분 기록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <input
                  type="time"
                  value={newRecord.time}
                  onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">활동</label>
                <input
                  type="text"
                  value={newRecord.activity}
                  onChange={(e) => setNewRecord({...newRecord, activity: e.target.value})}
                  placeholder="예: 산책, 식사, 놀이"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">기분 상태</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setNewRecord({...newRecord, mood: mood.value as any})}
                    className={`p-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                      newRecord.mood === mood.value
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{mood.icon}</span>
                    <span className="text-sm">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">에너지 레벨</label>
              <div className="flex space-x-2">
                {energyOptions.map((energy) => (
                  <button
                    key={energy.value}
                    onClick={() => setNewRecord({...newRecord, energy: energy.value as any})}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      newRecord.energy === energy.value
                        ? 'border-gray-400 bg-gray-100'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {energy.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                placeholder="특별한 행동이나 상황"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={addRecord}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              기록 추가
            </button>
          </div>
        </div>

        {topMoods.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">기분 패턴 분석</h2>
            <div className="space-y-3">
              {topMoods.map(([mood, count]) => (
                <div key={mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getMoodIcon(mood)}</span>
                    <span className="text-gray-900">{getMoodLabel(mood)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(moodStats))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}회</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">기분 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodIcon(record.mood)}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{record.date}</h3>
                        <p className="text-sm text-gray-600">{record.time} - {record.activity}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMoodColor(record.mood)}`}>
                        {getMoodLabel(record.mood)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEnergyColor(record.energy)}`}>
                        {getEnergyLabel(record.energy)}
                      </span>
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-600 mt-2">메모: {record.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 기분 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 몸짓, 표정, 행동을 관찰하여 기분을 파악하세요</li>
            <li>• 하루에 여러 번 기록하여 패턴을 파악하세요</li>
            <li>• 기분 변화의 원인을 찾아보세요</li>
            <li>• 지속적인 우울이나 불안 증상은 전문가와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
