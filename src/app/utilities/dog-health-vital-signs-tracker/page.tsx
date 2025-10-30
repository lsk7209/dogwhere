'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HeartPulse, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface VitalSignsRecord {
  id: string
  date: string
  time: string
  temperature: number
  heartRate: number
  respiratoryRate: number
  weight: number
  notes: string
}

interface VitalSignsRange {
  id: string
  parameter: string
  normalMin: number
  normalMax: number
  unit: string
  description: string
}

export default function DogHealthVitalSignsTrackerPage() {
  const [records, setRecords] = useState<VitalSignsRecord[]>([])
  const [ranges, setRanges] = useState<VitalSignsRange[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    temperature: 38.5,
    heartRate: 80,
    respiratoryRate: 20,
    weight: 0,
    notes: ''
  })

  const initialRanges: VitalSignsRange[] = [
    {
      id: '1',
      parameter: '체온',
      normalMin: 37.5,
      normalMax: 39.5,
      unit: '°C',
      description: '강아지의 정상 체온 범위'
    },
    {
      id: '2',
      parameter: '심박수',
      normalMin: 60,
      normalMax: 140,
      unit: 'BPM',
      description: '강아지의 정상 심박수 범위'
    },
    {
      id: '3',
      parameter: '호흡수',
      normalMin: 10,
      normalMax: 30,
      unit: '회/분',
      description: '강아지의 정상 호흡수 범위'
    },
    {
      id: '4',
      parameter: '체중',
      normalMin: 0,
      normalMax: 100,
      unit: 'kg',
      description: '강아지의 체중 (품종별 상이)'
    }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('vitalSignsRecords')
    const savedRanges = localStorage.getItem('vitalSignsRanges')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedRanges) {
      try {
        setRanges(JSON.parse(savedRanges))
      } catch (e) {
        setRanges(initialRanges)
      }
    } else {
      setRanges(initialRanges)
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('vitalSignsRecords', JSON.stringify(records))
    }
  }, [records])

  useEffect(() => {
    if (ranges.length > 0) {
      localStorage.setItem('vitalSignsRanges', JSON.stringify(ranges))
    }
  }, [ranges])

  const addRecord = () => {
    if (!newRecord.date) return

    const record: VitalSignsRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      temperature: 38.5,
      heartRate: 80,
      respiratoryRate: 20,
      weight: 0,
      notes: ''
    })
  }

  const getVitalSignStatus = (parameter: string, value: number) => {
    const range = ranges.find(r => r.parameter === parameter)
    if (!range) return { status: 'unknown', color: 'text-gray-600 bg-gray-100' }
    
    if (value >= range.normalMin && value <= range.normalMax) {
      return { status: 'normal', color: 'text-green-600 bg-green-100' }
    } else if (value < range.normalMin) {
      return { status: 'low', color: 'text-blue-600 bg-blue-100' }
    } else {
      return { status: 'high', color: 'text-red-600 bg-red-100' }
    }
  }

  const getVitalSignLabel = (parameter: string, value: number) => {
    const { status } = getVitalSignStatus(parameter, value)
    switch (status) {
      case 'normal': return '정상'
      case 'low': return '낮음'
      case 'high': return '높음'
      default: return '알 수 없음'
    }
  }

  const getTemperatureColor = (temperature: number) => {
    if (temperature >= 37.5 && temperature <= 39.5) return 'text-green-600 bg-green-100'
    if (temperature < 37.5) return 'text-blue-600 bg-blue-100'
    return 'text-red-600 bg-red-100'
  }

  const getHeartRateColor = (heartRate: number) => {
    if (heartRate >= 60 && heartRate <= 140) return 'text-green-600 bg-green-100'
    if (heartRate < 60) return 'text-blue-600 bg-blue-100'
    return 'text-red-600 bg-red-100'
  }

  const getRespiratoryRateColor = (respiratoryRate: number) => {
    if (respiratoryRate >= 10 && respiratoryRate <= 30) return 'text-green-600 bg-green-100'
    if (respiratoryRate < 10) return 'text-blue-600 bg-blue-100'
    return 'text-red-600 bg-red-100'
  }

  const totalRecords = records.length
  const averageTemperature = records.length > 0 ? records.reduce((sum, record) => sum + record.temperature, 0) / records.length : 0
  const averageHeartRate = records.length > 0 ? records.reduce((sum, record) => sum + record.heartRate, 0) / records.length : 0
  const averageRespiratoryRate = records.length > 0 ? records.reduce((sum, record) => sum + record.respiratoryRate, 0) / records.length : 0
  const latestWeight = records.length > 0 ? records[0].weight : 0
  const abnormalRecords = records.filter(record => {
    const tempStatus = getVitalSignStatus('체온', record.temperature).status
    const heartStatus = getVitalSignStatus('심박수', record.heartRate).status
    const respStatus = getVitalSignStatus('호흡수', record.respiratoryRate).status
    return tempStatus !== 'normal' || heartStatus !== 'normal' || respStatus !== 'normal'
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <HeartPulse className="w-10 h-10 text-blue-600 mr-3" />
            건강 바이탈 사인 추적기
          </h1>
          <p className="text-xl text-gray-600">체온, 심박수, 호흡수 등 기본 생체 신호를 기록</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <HeartPulse className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">바이탈 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{averageTemperature.toFixed(1)}°C</p>
            <p className="text-sm text-gray-600">평균 체온</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <HeartPulse className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{averageHeartRate.toFixed(0)}</p>
            <p className="text-sm text-gray-600">평균 심박수</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{abnormalRecords}회</p>
            <p className="text-sm text-gray-600">이상 기록</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">정상 범위 가이드</h2>
              <div className="space-y-4">
                {ranges.map((range) => (
                  <div key={range.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{range.parameter}</h3>
                    <p className="text-sm text-gray-600 mb-4">{range.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        정상 범위: {range.normalMin} - {range.normalMax} {range.unit}
                      </span>
                      <span className="px-2 py-1 text-xs rounded text-green-600 bg-green-100">
                        정상
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">바이탈 사인 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기록 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기록 시간</label>
                    <input
                      type="time"
                      value={newRecord.time}
                      onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체온 (°C)</label>
                    <input
                      type="number"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseFloat(e.target.value) || 0})}
                      min="30"
                      max="45"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심박수 (BPM)</label>
                    <input
                      type="number"
                      value={newRecord.heartRate}
                      onChange={(e) => setNewRecord({...newRecord, heartRate: parseInt(e.target.value) || 0})}
                      min="20"
                      max="300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">호흡수 (회/분)</label>
                    <input
                      type="number"
                      value={newRecord.respiratoryRate}
                      onChange={(e) => setNewRecord({...newRecord, respiratoryRate: parseInt(e.target.value) || 0})}
                      min="5"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                    <input
                      type="number"
                      value={newRecord.weight}
                      onChange={(e) => setNewRecord({...newRecord, weight: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="200"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="바이탈 사인 측정 시 특이사항, 강아지 상태 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  바이탈 사인 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 바이탈 사인 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {record.date} {record.time}
                          </p>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="text-sm">
                              <span className="text-gray-600">체온: </span>
                              <span className={`px-2 py-1 text-xs rounded ${getTemperatureColor(record.temperature)}`}>
                                {record.temperature}°C ({getVitalSignLabel('체온', record.temperature)})
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">심박수: </span>
                              <span className={`px-2 py-1 text-xs rounded ${getHeartRateColor(record.heartRate)}`}>
                                {record.heartRate} BPM ({getVitalSignLabel('심박수', record.heartRate)})
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">호흡수: </span>
                              <span className={`px-2 py-1 text-xs rounded ${getRespiratoryRateColor(record.respiratoryRate)}`}>
                                {record.respiratoryRate} 회/분 ({getVitalSignLabel('호흡수', record.respiratoryRate)})
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">체중: </span>
                              <span className="text-gray-900">{record.weight} kg</span>
                            </div>
                          </div>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💓 건강 바이탈 사인 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 정기적으로 바이탈 사인을 측정하세요</li>
                <li>• 정확한 측정 도구를 사용하세요</li>
                <li>• 강아지가 편안할 때 측정하세요</li>
                <li>• 이상 징후를 즉시 기록하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 이상 수치가 지속되면 수의사에게 문의하세요</li>
                <li>• 강아지가 불안해하면 측정을 중단하세요</li>
                <li>• 측정 전후의 상황을 기록하세요</li>
                <li>• 정확한 측정을 위해 전문가의 도움을 받으세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
