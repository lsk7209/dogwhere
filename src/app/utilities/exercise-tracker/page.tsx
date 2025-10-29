'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, Plus, TrendingUp } from 'lucide-react'

interface ExerciseRecord {
  id: string
  date: string
  walkDistance: number
  walkTime: number
  playTime: number
  notes: string
}

export default function ExerciseTrackerPage() {
  const [records, setRecords] = useState<ExerciseRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    walkDistance: 0,
    walkTime: 0,
    playTime: 0,
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('exerciseRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('exerciseRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    const record: ExerciseRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({ walkDistance: 0, walkTime: 0, playTime: 0, notes: '' })
  }

  const weeklyStats = records.slice(0, 7).reduce((acc, record) => ({
    totalDistance: acc.totalDistance + record.walkDistance,
    totalWalkTime: acc.totalWalkTime + record.walkTime,
    totalPlayTime: acc.totalPlayTime + record.playTime
  }), { totalDistance: 0, totalWalkTime: 0, totalPlayTime: 0 })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-10 h-10 text-green-600 mr-3" />
            운동량 추적기
          </h1>
          <p className="text-xl text-gray-600">산책 거리, 운동 시간, 활동량을 기록하고 분석합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{weeklyStats.totalDistance}km</p>
            <p className="text-sm text-gray-600">주간 산책 거리</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyStats.totalWalkTime / 60)}분</p>
            <p className="text-sm text-gray-600">주간 산책 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Plus className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyStats.totalPlayTime / 60)}분</p>
            <p className="text-sm text-gray-600">주간 놀이 시간</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 운동 기록</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">산책 거리 (km)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={newRecord.walkDistance || ''}
                onChange={(e) => setNewRecord({...newRecord, walkDistance: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">산책 시간 (분)</label>
              <input
                type="number"
                min="0"
                value={newRecord.walkTime || ''}
                onChange={(e) => setNewRecord({...newRecord, walkTime: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">놀이 시간 (분)</label>
              <input
                type="number"
                min="0"
                value={newRecord.playTime || ''}
                onChange={(e) => setNewRecord({...newRecord, playTime: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                placeholder="특이사항이나 날씨 등"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={addRecord}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            기록 추가
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.slice(0, 10).map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{record.date}</h3>
                    <div className="text-sm text-gray-600">
                      산책: {record.walkDistance}km ({record.walkTime}분) | 놀이: {record.playTime}분
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-600">메모: {record.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 운동 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 성견은 하루 30분-2시간의 운동이 필요합니다</li>
            <li>• 강아지는 성장 단계에 맞는 적절한 운동량이 중요합니다</li>
            <li>• 노령견은 무리한 운동보다는 가벼운 산책을 권장합니다</li>
            <li>• 날씨와 강아지 상태에 따라 운동량을 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
