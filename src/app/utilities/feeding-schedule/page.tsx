'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Plus, Trash2, Edit2 } from 'lucide-react'

interface FeedingSchedule {
  id: string
  time: string
  amount: number
  type: string
  notes: string
}

export default function FeedingSchedulePage() {
  const [schedule, setSchedule] = useState<FeedingSchedule[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    time: '',
    amount: 0,
    type: 'dry',
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('feedingSchedule')
    if (saved) {
      try {
        setSchedule(JSON.parse(saved))
      } catch (e) {}
    } else {
      // 기본 일정
      setSchedule([
        { id: '1', time: '08:00', amount: 100, type: 'dry', notes: '아침 식사' },
        { id: '2', time: '20:00', amount: 100, type: 'dry', notes: '저녁 식사' }
      ])
    }
  }, [])

  useEffect(() => {
    if (schedule.length > 0) {
      localStorage.setItem('feedingSchedule', JSON.stringify(schedule))
    }
  }, [schedule])

  const addSchedule = () => {
    if (!form.time || form.amount <= 0) return

    if (editingId) {
      setSchedule(schedule.map(s => 
        s.id === editingId ? { ...form, id: editingId } : s
      ))
      setEditingId(null)
    } else {
      setSchedule([...schedule, { ...form, id: Date.now().toString() }])
    }
    setForm({ time: '', amount: 0, type: 'dry', notes: '' })
  }

  const deleteSchedule = (id: string) => {
    setSchedule(schedule.filter(s => s.id !== id))
  }

  const startEdit = (item: FeedingSchedule) => {
    setForm(item)
    setEditingId(item.id)
  }

  const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-10 h-10 text-yellow-600 mr-3" />
            식사 시간표 관리
          </h1>
          <p className="text-xl text-gray-600">
            규칙적인 식사 시간표를 만들고 급여 기록을 관리합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? '시간표 수정' : '새 식사 시간 추가'}
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                급여량 (g)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사료 유형
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="dry">건사료</option>
                <option value="wet">습사료</option>
                <option value="mixed">혼합</option>
                <option value="raw">생식</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="예: 아침 식사, 저녁 식사"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={addSchedule}
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {editingId ? '수정 완료' : '추가하기'}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null)
                  setForm({ time: '', amount: 0, type: 'dry', notes: '' })
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">식사 시간표</h2>
          
          {sortedSchedule.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 식사 시간이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSchedule.map((item) => (
                <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-yellow-400 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-xl font-bold text-gray-900">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.amount}g</span>
                        <span className="text-gray-500 ml-2">({item.type === 'dry' ? '건사료' : item.type === 'wet' ? '습사료' : item.type === 'mixed' ? '혼합' : '생식'})</span>
                        {item.notes && (
                          <span className="text-sm text-gray-500 ml-2">- {item.notes}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteSchedule(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sortedSchedule.length > 0 && (
            <div className="mt-6 bg-yellow-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">하루 총 급여량</p>
              <p className="text-2xl font-bold text-yellow-700">
                {sortedSchedule.reduce((sum, item) => sum + item.amount, 0)}g
              </p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 식사 시간표 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 규칙적인 식사 시간은 소화기 건강에 도움이 됩니다</li>
            <li>• 성견은 보통 하루 2끼를 권장합니다</li>
            <li>• 강아지는 성장을 위해 하루 3-4끼가 필요할 수 있습니다</li>
            <li>• 식사 후 1-2시간 정도 휴식 시간을 가지는 것이 좋습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

