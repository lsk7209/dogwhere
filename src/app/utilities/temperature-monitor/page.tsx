'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Thermometer, Plus, AlertTriangle } from 'lucide-react'

interface TemperatureRecord {
  id: string
  date: string
  time: string
  temperature: number
  condition: 'normal' | 'fever' | 'hypothermia'
  notes: string
}

export default function TemperatureMonitorPage() {
  const [records, setRecords] = useState<TemperatureRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    time: '',
    temperature: 0,
    notes: ''
  })

  const normalRange = { min: 37.5, max: 39.2 } // 강아지 정상 체온 범위

  useEffect(() => {
    const saved = localStorage.getItem('temperatureRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('temperatureRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.time || newRecord.temperature <= 0) return

    const condition = getTemperatureCondition(newRecord.temperature)
    const record: TemperatureRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord,
      condition
    }
    setRecords([record, ...records])
    setNewRecord({ time: '', temperature: 0, notes: '' })
  }

  const getTemperatureCondition = (temp: number) => {
    if (temp < normalRange.min) return 'hypothermia'
    if (temp > normalRange.max) return 'fever'
    return 'normal'
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'fever': return 'text-red-600 bg-red-100'
      case 'hypothermia': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'normal': return '정상'
      case 'fever': return '발열'
      case 'hypothermia': return '저체온'
      default: return condition
    }
  }

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'normal': return '✅'
      case 'fever': return '🔥'
      case 'hypothermia': return '❄️'
      default: return '📊'
    }
  }

  const recentRecords = records.slice(0, 7)
  const averageTemp = recentRecords.length > 0 
    ? Math.round((recentRecords.reduce((sum, record) => sum + record.temperature, 0) / recentRecords.length) * 10) / 10
    : 0

  const abnormalRecords = records.filter(record => record.condition !== 'normal')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Thermometer className="w-10 h-10 text-red-600 mr-3" />
            체온 모니터링기
          </h1>
          <p className="text-xl text-gray-600">강아지의 체온을 정기적으로 측정하고 기록합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Thermometer className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{averageTemp}°C</p>
            <p className="text-sm text-gray-600">최근 평균 체온</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">{records.length}회</p>
            <p className="text-sm text-gray-600">측정 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-red-600">{abnormalRecords.length}회</p>
            <p className="text-sm text-gray-600">이상 체온</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 체온 기록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">측정 시간</label>
                <input
                  type="time"
                  value={newRecord.time}
                  onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">체온 (°C)</label>
                <input
                  type="number"
                  min="30"
                  max="45"
                  step="0.1"
                  value={newRecord.temperature || ''}
                  onChange={(e) => setNewRecord({...newRecord, temperature: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                placeholder="측정 상황이나 특이사항"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addRecord}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              기록 추가
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-800">정상 체온 범위</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">정상 범위</p>
              <p className="text-2xl font-bold text-green-600">{normalRange.min}°C - {normalRange.max}°C</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">발열</p>
              <p className="text-2xl font-bold text-red-600">{normalRange.max}°C 이상</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">저체온</p>
              <p className="text-2xl font-bold text-blue-600">{normalRange.min}°C 미만</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">체온 기록</h2>
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
                      <p className="text-sm text-gray-600">{record.time}</p>
                      {record.notes && (
                        <p className="text-sm text-gray-500 mt-1">메모: {record.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getConditionIcon(record.condition)}</span>
                        <span className="text-3xl font-bold text-gray-900">{record.temperature}°C</span>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium ${getConditionColor(record.condition)}`}>
                        {getConditionText(record.condition)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 체온 측정 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 정상 체온은 37.5°C - 39.2°C입니다</li>
            <li>• 체온은 직장 온도계로 측정하는 것이 가장 정확합니다</li>
            <li>• 측정 전에 온도계에 윤활제를 발라주세요</li>
            <li>• 발열이나 저체온 증상이 지속되면 수의사와 상담하세요</li>
            <li>• 운동 후나 스트레스 상황에서는 체온이 일시적으로 올라갈 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
