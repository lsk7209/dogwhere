'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, CheckCircle, Clock, AlertTriangle, Moon } from 'lucide-react'

interface SleepEnvironmentRecord {
  id: string
  date: string
  location: string
  temperature: number
  noiseLevel: number
  lightLevel: number
  comfort: number
  sleepQuality: number
  notes: string
}

interface SleepEnvironment {
  id: string
  location: string
  averageComfort: number
  averageSleepQuality: number
  recordCount: number
  lastUsed: string
  rating: number
}

export default function DogSleepEnvironmentTrackerPage() {
  const [records, setRecords] = useState<SleepEnvironmentRecord[]>([])
  const [environments, setEnvironments] = useState<SleepEnvironment[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    temperature: 22,
    noiseLevel: 3,
    lightLevel: 3,
    comfort: 5,
    sleepQuality: 5,
    notes: ''
  })
  const [newEnvironment, setNewEnvironment] = useState({
    location: '',
    rating: 5
  })

  const locations = [
    '침실',
    '거실',
    '다용도실',
    '발코니',
    '마당',
    '차고',
    '기타'
  ]

  const comfortLevels = [
    { value: 1, label: '매우 불편', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '불편', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 불편', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '편안', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '매우 편안', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '완전히 편안', color: 'text-green-600 bg-green-100' },
    { value: 8, label: '최고 편안', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '완벽', color: 'text-blue-600 bg-blue-100' },
    { value: 10, label: '이상적', color: 'text-purple-600 bg-purple-100' }
  ]

  const sleepQualityLevels = [
    { value: 1, label: '매우 나쁨', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '나쁨', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 나쁨', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '좋음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '매우 좋음', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '완전히 좋음', color: 'text-green-600 bg-green-100' },
    { value: 8, label: '최고', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '완벽', color: 'text-blue-600 bg-blue-100' },
    { value: 10, label: '이상적', color: 'text-purple-600 bg-purple-100' }
  ]

  const noiseLevels = [
    { value: 1, label: '매우 조용', color: 'text-green-600 bg-green-100' },
    { value: 2, label: '조용', color: 'text-green-600 bg-green-100' },
    { value: 3, label: '약간 조용', color: 'text-yellow-600 bg-yellow-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '약간 시끄러움', color: 'text-orange-600 bg-orange-100' },
    { value: 6, label: '시끄러움', color: 'text-orange-600 bg-orange-100' },
    { value: 7, label: '매우 시끄러움', color: 'text-red-600 bg-red-100' },
    { value: 8, label: '극도로 시끄러움', color: 'text-red-600 bg-red-100' },
    { value: 9, label: '최고 시끄러움', color: 'text-red-600 bg-red-100' },
    { value: 10, label: '극한 시끄러움', color: 'text-red-600 bg-red-100' }
  ]

  const lightLevels = [
    { value: 1, label: '매우 어둠', color: 'text-gray-600 bg-gray-100' },
    { value: 2, label: '어둠', color: 'text-gray-600 bg-gray-100' },
    { value: 3, label: '약간 어둠', color: 'text-gray-600 bg-gray-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '약간 밝음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '밝음', color: 'text-orange-600 bg-orange-100' },
    { value: 7, label: '매우 밝음', color: 'text-orange-600 bg-orange-100' },
    { value: 8, label: '극도로 밝음', color: 'text-red-600 bg-red-100' },
    { value: 9, label: '최고 밝음', color: 'text-red-600 bg-red-100' },
    { value: 10, label: '극한 밝음', color: 'text-red-600 bg-red-100' }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('sleepEnvironmentRecords')
    const savedEnvironments = localStorage.getItem('sleepEnvironments')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedEnvironments) {
      try {
        setEnvironments(JSON.parse(savedEnvironments))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('sleepEnvironmentRecords', JSON.stringify(records))
      updateEnvironments()
    }
  }, [records])

  useEffect(() => {
    if (environments.length > 0) {
      localStorage.setItem('sleepEnvironments', JSON.stringify(environments))
    }
  }, [environments])

  const addRecord = () => {
    if (!newRecord.location) return

    const record: SleepEnvironmentRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      location: '',
      temperature: 22,
      noiseLevel: 3,
      lightLevel: 3,
      comfort: 5,
      sleepQuality: 5,
      notes: ''
    })
  }

  const addEnvironment = () => {
    if (!newEnvironment.location) return

    const environment: SleepEnvironment = {
      id: Date.now().toString(),
      ...newEnvironment,
      averageComfort: 0,
      averageSleepQuality: 0,
      recordCount: 0,
      lastUsed: new Date().toISOString().split('T')[0]
    }
    setEnvironments([environment, ...environments])
    setNewEnvironment({
      location: '',
      rating: 5
    })
  }

  const updateEnvironments = () => {
    const environmentStats = new Map<string, {
      totalComfort: number,
      totalSleepQuality: number,
      recordCount: number,
      lastUsed: string
    }>()

    records.forEach(record => {
      const key = record.location
      if (!environmentStats.has(key)) {
        environmentStats.set(key, {
          totalComfort: 0,
          totalSleepQuality: 0,
          recordCount: 0,
          lastUsed: record.date
        })
      }
      
      const stats = environmentStats.get(key)!
      stats.totalComfort += record.comfort
      stats.totalSleepQuality += record.sleepQuality
      stats.recordCount += 1
      if (record.date > stats.lastUsed) {
        stats.lastUsed = record.date
      }
    })

    const newEnvironments: SleepEnvironment[] = Array.from(environmentStats.entries()).map(([location, stats]) => ({
      id: location,
      location,
      averageComfort: stats.totalComfort / stats.recordCount,
      averageSleepQuality: stats.totalSleepQuality / stats.recordCount,
      recordCount: stats.recordCount,
      lastUsed: stats.lastUsed,
      rating: Math.round(stats.totalSleepQuality / stats.recordCount)
    }))

    setEnvironments(newEnvironments)
  }

  const getComfortColor = (comfort: number) => {
    const level = comfortLevels.find(l => l.value === comfort)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getComfortLabel = (comfort: number) => {
    const level = comfortLevels.find(l => l.value === comfort)
    return level ? level.label : '알 수 없음'
  }

  const getSleepQualityColor = (quality: number) => {
    const level = sleepQualityLevels.find(l => l.value === quality)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getSleepQualityLabel = (quality: number) => {
    const level = sleepQualityLevels.find(l => l.value === quality)
    return level ? level.label : '알 수 없음'
  }

  const getNoiseColor = (noise: number) => {
    const level = noiseLevels.find(l => l.value === noise)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getNoiseLabel = (noise: number) => {
    const level = noiseLevels.find(l => l.value === noise)
    return level ? level.label : '알 수 없음'
  }

  const getLightColor = (light: number) => {
    const level = lightLevels.find(l => l.value === light)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getLightLabel = (light: number) => {
    const level = lightLevels.find(l => l.value === light)
    return level ? level.label : '알 수 없음'
  }

  const totalRecords = records.length
  const averageComfort = records.length > 0 ? records.reduce((sum, record) => sum + record.comfort, 0) / records.length : 0
  const averageSleepQuality = records.length > 0 ? records.reduce((sum, record) => sum + record.sleepQuality, 0) / records.length : 0
  const averageTemperature = records.length > 0 ? records.reduce((sum, record) => sum + record.temperature, 0) / records.length : 0
  const uniqueLocations = new Set(records.map(record => record.location)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Home className="w-10 h-10 text-blue-600 mr-3" />
            수면 환경 추적기
          </h1>
          <p className="text-xl text-gray-600">수면 환경의 변화와 강아지 반응을 기록하고 분석</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">환경 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{averageSleepQuality.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 수면 품질</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{averageComfort.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 편안함</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{uniqueLocations}개</p>
            <p className="text-sm text-gray-600">다양한 장소</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 환경 분석</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 장소</label>
                    <input
                      type="text"
                      value={newEnvironment.location}
                      onChange={(e) => setNewEnvironment({...newEnvironment, location: e.target.value})}
                      placeholder="예: 침실"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">평점 (1-10)</label>
                    <input
                      type="number"
                      value={newEnvironment.rating}
                      onChange={(e) => setNewEnvironment({...newEnvironment, rating: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={addEnvironment}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  수면 환경 추가
                </button>
              </div>

              <div className="space-y-4">
                {environments.map((environment) => (
                  <div key={environment.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{environment.location}</h3>
                        <div className="text-sm text-gray-600">
                          {environment.recordCount}회 기록, 마지막 사용: {environment.lastUsed}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getSleepQualityColor(environment.rating)}`}>
                          {environment.rating}점
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">편안함</span>
                          <span className="text-sm text-gray-600">{environment.averageComfort.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${environment.averageComfort * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">수면 품질</span>
                          <span className="text-sm text-gray-600">{environment.averageSleepQuality.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${environment.averageSleepQuality * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 환경 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 장소</label>
                    <select
                      value={newRecord.location}
                      onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">장소 선택</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">온도 (°C)</label>
                    <input
                      type="number"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseInt(e.target.value) || 0})}
                      min="0"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소음 수준 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.noiseLevel}
                      onChange={(e) => setNewRecord({...newRecord, noiseLevel: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조명 수준 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.lightLevel}
                      onChange={(e) => setNewRecord({...newRecord, lightLevel: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">편안함 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.comfort}
                      onChange={(e) => setNewRecord({...newRecord, comfort: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 품질 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.sleepQuality}
                      onChange={(e) => setNewRecord({...newRecord, sleepQuality: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
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
                    placeholder="수면 환경, 강아지 반응, 특이사항 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  수면 환경 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 수면 환경 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.location}</p>
                          <p className="text-sm text-gray-600">
                            {record.date} - {record.temperature}°C
                          </p>
                          <p className="text-sm text-gray-600">
                            소음: {getNoiseLabel(record.noiseLevel)}, 조명: {getLightLabel(record.lightLevel)}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs rounded ${getComfortColor(record.comfort)}`}>
                              편안함 {record.comfort}
                            </span>
                            <br />
                            <span className={`px-2 py-1 text-xs rounded ${getSleepQualityColor(record.sleepQuality)}`}>
                              수면 품질 {record.sleepQuality}
                            </span>
                          </div>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏠 수면 환경 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일정한 수면 환경을 유지하세요</li>
                <li>• 적절한 온도와 습도를 유지하세요</li>
                <li>• 조용하고 어두운 환경을 제공하세요</li>
                <li>• 강아지가 편안해하는 장소를 찾으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 갑작스러운 환경 변화를 피하세요</li>
                <li>• 강아지가 불편해하면 환경을 개선하세요</li>
                <li>• 수면 장애가 지속되면 수의사에게 문의하세요</li>
                <li>• 안전한 수면 환경을 제공하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
