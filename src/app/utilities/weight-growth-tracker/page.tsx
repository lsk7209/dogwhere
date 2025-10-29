'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Plus } from 'lucide-react'

interface WeightRecord {
  id: string
  date: string
  weight: number
  age: number
  notes: string
}

export default function WeightGrowthTrackerPage() {
  const [records, setRecords] = useState<WeightRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    weight: 0,
    age: 0,
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('weightRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('weightRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    const record: WeightRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({ weight: 0, age: 0, notes: '' })
  }

  const getGrowthTrend = () => {
    if (records.length < 2) return '데이터 부족'
    
    const recent = records.slice(0, 3)
    const weights = recent.map(r => r.weight)
    const avgGrowth = (weights[0] - weights[weights.length - 1]) / (weights.length - 1)
    
    if (avgGrowth > 0.1) return '성장 중'
    if (avgGrowth < -0.1) return '체중 감소'
    return '안정적'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-green-600 mr-3" />
            체중 성장 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지 성장 과정의 체중 변화를 추적하고 그래프로 표시합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {records.length > 0 ? records[0].weight : 0}kg
            </p>
            <p className="text-sm text-gray-600">현재 체중</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {records.length > 0 ? records[0].age : 0}주
            </p>
            <p className="text-sm text-gray-600">현재 나이</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">{getGrowthTrend()}</p>
            <p className="text-sm text-gray-600">성장 추세</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 체중 기록</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={newRecord.weight || ''}
                onChange={(e) => setNewRecord({...newRecord, weight: parseFloat(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">나이 (주)</label>
              <input
                type="number"
                min="0"
                value={newRecord.age || ''}
                onChange={(e) => setNewRecord({...newRecord, age: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                placeholder="특이사항"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">체중 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{record.date}</h3>
                      <p className="text-sm text-gray-600">{record.age}주</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{record.weight}kg</p>
                      {record.notes && (
                        <p className="text-sm text-gray-500">{record.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 성장 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지 성장기에는 주 1-2회 체중을 측정하세요</li>
            <li>• 성장 곡선을 참고하여 정상적인 성장인지 확인하세요</li>
            <li>• 급격한 체중 변화가 있다면 수의사와 상담하세요</li>
            <li>• 견종별로 성장 패턴이 다르므로 참고하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
