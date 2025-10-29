'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Plus, BarChart3 } from 'lucide-react'

interface SleepRecord {
  id: string
  date: string
  bedTime: string
  wakeTime: string
  totalHours: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function SleepPatternTrackerPage() {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    bedTime: '',
    wakeTime: '',
    quality: 'good' as const,
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('sleepRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('sleepRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.bedTime || !newRecord.wakeTime) return

    const bedTime = new Date(`2000-01-01T${newRecord.bedTime}`)
    const wakeTime = new Date(`2000-01-01T${newRecord.wakeTime}`)
    
    let totalHours = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60 * 60)
    if (totalHours < 0) totalHours += 24 // 다음날 일어난 경우

    const record: SleepRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord,
      totalHours: Math.round(totalHours * 10) / 10
    }
    setRecords([record, ...records])
    setNewRecord({ bedTime: '', wakeTime: '', quality: 'good', notes: '' })
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return quality
    }
  }

  const weeklyStats = records.slice(0, 7).reduce((acc, record) => ({
    totalHours: acc.totalHours + record.totalHours,
    count: acc.count + 1
  }), { totalHours: 0, count: 0 })

  const avgHours = weeklyStats.count > 0 ? Math.round((weeklyStats.totalHours / weeklyStats.count) * 10) / 10 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Moon className="w-10 h-10 text-indigo-600 mr-3" />
            수면 패턴 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 수면 시간과 패턴을 기록하고 분석합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Moon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{avgHours}시간</p>
            <p className="text-sm text-gray-600">주간 평균 수면</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{records.length}일</p>
            <p className="text-sm text-gray-600">기록된 일수</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {records.length > 0 ? records[0].totalHours : 0}시간
            </p>
            <p className="text-sm text-gray-600">최근 수면 시간</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 수면 기록</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">잠자리에 든 시간</label>
              <input
                type="time"
                value={newRecord.bedTime}
                onChange={(e) => setNewRecord({...newRecord, bedTime: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">일어난 시간</label>
              <input
                type="time"
                value={newRecord.wakeTime}
                onChange={(e) => setNewRecord({...newRecord, wakeTime: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">수면 품질</label>
              <select
                value={newRecord.quality}
                onChange={(e) => setNewRecord({...newRecord, quality: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="excellent">매우 좋음</option>
                <option value="good">좋음</option>
                <option value="fair">보통</option>
                <option value="poor">나쁨</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                placeholder="특이사항이나 환경 요인"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={addRecord}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            기록 추가
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{record.date}</h3>
                      <p className="text-sm text-gray-600">
                        {record.bedTime} - {record.wakeTime} ({record.totalHours}시간)
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-500 mt-1">메모: {record.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(record.quality)}`}>
                        {getQualityText(record.quality)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 수면 패턴 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 성견은 하루 12-14시간, 강아지는 18-20시간의 수면이 필요합니다</li>
            <li>• 규칙적인 수면 패턴을 유지하는 것이 중요합니다</li>
            <li>• 수면 환경을 조용하고 편안하게 만들어주세요</li>
            <li>• 수면 품질이 지속적으로 나쁘다면 수의사와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
