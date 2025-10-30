'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cloud, CheckCircle, Clock, AlertTriangle, Sun } from 'lucide-react'

interface WeatherRecord {
  id: string
  date: string
  weather: string
  temperature: number
  humidity: number
  behavior: string
  comfort: number
  notes: string
}

interface WeatherAdaptation {
  id: string
  weatherType: string
  adaptationLevel: number
  lastUpdated: string
  improvements: string[]
}

export default function DogWeatherAdaptationTrackerPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([])
  const [adaptations, setAdaptations] = useState<WeatherAdaptation[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    weather: '',
    temperature: 20,
    humidity: 50,
    behavior: '',
    comfort: 5,
    notes: ''
  })
  const [newAdaptation, setNewAdaptation] = useState({
    weatherType: '',
    adaptationLevel: 5,
    improvements: ''
  })

  const weatherTypes = [
    '맑음',
    '흐림',
    '비',
    '눈',
    '바람',
    '폭염',
    '한파',
    '습도 높음',
    '습도 낮음',
    '기타'
  ]

  const behaviorTypes = [
    '활발함',
    '평상시와 동일',
    '조금 위축됨',
    '명확히 위축됨',
    '불안함',
    '스트레스 받음',
    '피로함',
    '기타'
  ]

  const initialAdaptations: WeatherAdaptation[] = [
    {
      id: '1',
      weatherType: '맑음',
      adaptationLevel: 8,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: ['충분한 그늘 제공', '물 자주 제공', '산책 시간 조절']
    },
    {
      id: '2',
      weatherType: '비',
      adaptationLevel: 6,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: ['방수 옷 착용', '실내 활동 증가', '습도 관리']
    },
    {
      id: '3',
      weatherType: '눈',
      adaptationLevel: 4,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: ['보온 옷 착용', '짧은 산책', '발 관리']
    },
    {
      id: '4',
      weatherType: '폭염',
      adaptationLevel: 3,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: ['새벽/저녁 산책', '에어컨 사용', '물 자주 제공']
    },
    {
      id: '5',
      weatherType: '한파',
      adaptationLevel: 5,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: ['보온 옷 착용', '실내 활동', '따뜻한 침구']
    }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('weatherRecords')
    const savedAdaptations = localStorage.getItem('weatherAdaptations')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedAdaptations) {
      try {
        setAdaptations(JSON.parse(savedAdaptations))
      } catch (e) {
        setAdaptations(initialAdaptations)
      }
    } else {
      setAdaptations(initialAdaptations)
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('weatherRecords', JSON.stringify(records))
    }
  }, [records])

  useEffect(() => {
    if (adaptations.length > 0) {
      localStorage.setItem('weatherAdaptations', JSON.stringify(adaptations))
    }
  }, [adaptations])

  const addRecord = () => {
    if (!newRecord.weather || !newRecord.behavior) return

    const record: WeatherRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      weather: '',
      temperature: 20,
      humidity: 50,
      behavior: '',
      comfort: 5,
      notes: ''
    })
  }

  const addAdaptation = () => {
    if (!newAdaptation.weatherType) return

    const adaptation: WeatherAdaptation = {
      id: Date.now().toString(),
      ...newAdaptation,
      lastUpdated: new Date().toISOString().split('T')[0],
      improvements: newAdaptation.improvements.split(',').map(item => item.trim()).filter(item => item)
    }
    setAdaptations([adaptation, ...adaptations])
    setNewAdaptation({
      weatherType: '',
      adaptationLevel: 5,
      improvements: ''
    })
  }

  const updateAdaptationLevel = (adaptationId: string, level: number) => {
    setAdaptations(adaptations.map(adaptation => 
      adaptation.id === adaptationId 
        ? { 
            ...adaptation, 
            adaptationLevel: Math.max(1, Math.min(10, level)),
            lastUpdated: new Date().toISOString().split('T')[0]
          } 
        : adaptation
    ))
  }

  const getComfortColor = (comfort: number) => {
    if (comfort >= 8) return 'text-green-600 bg-green-100'
    if (comfort >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getComfortText = (comfort: number) => {
    if (comfort >= 8) return '매우 편안'
    if (comfort >= 6) return '편안'
    if (comfort >= 4) return '보통'
    return '불편'
  }

  const getAdaptationColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-100'
    if (level >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getAdaptationText = (level: number) => {
    if (level >= 8) return '매우 잘 적응'
    if (level >= 6) return '잘 적응'
    if (level >= 4) return '보통'
    return '적응 어려움'
  }

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case '맑음': return '☀️'
      case '흐림': return '☁️'
      case '비': return '🌧️'
      case '눈': return '❄️'
      case '바람': return '💨'
      case '폭염': return '🔥'
      case '한파': return '🧊'
      case '습도 높음': return '💧'
      case '습도 낮음': return '🏜️'
      default: return '🌤️'
    }
  }

  const totalRecords = records.length
  const averageComfort = records.length > 0 ? records.reduce((sum, record) => sum + record.comfort, 0) / records.length : 0
  const averageAdaptation = adaptations.length > 0 ? adaptations.reduce((sum, adaptation) => sum + adaptation.adaptationLevel, 0) / adaptations.length : 0
  const lowComfortRecords = records.filter(record => record.comfort < 5).length
  const highAdaptationCount = adaptations.filter(adaptation => adaptation.adaptationLevel >= 7).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Cloud className="w-10 h-10 text-blue-600 mr-3" />
            날씨 적응 추적기
          </h1>
          <p className="text-xl text-gray-600">다양한 날씨 조건에서의 강아지 반응과 적응도를 기록</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Cloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">날씨 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageComfort.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 편안함</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{highAdaptationCount}개</p>
            <p className="text-sm text-gray-600">잘 적응한 날씨</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{lowComfortRecords}회</p>
            <p className="text-sm text-gray-600">불편한 날씨</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">날씨 적응도 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날씨 유형</label>
                    <select
                      value={newAdaptation.weatherType}
                      onChange={(e) => setNewAdaptation({...newAdaptation, weatherType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">날씨 선택</option>
                      {weatherTypes.map((weather) => (
                        <option key={weather} value={weather}>{weather}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">적응도 (1-10)</label>
                    <input
                      type="number"
                      value={newAdaptation.adaptationLevel}
                      onChange={(e) => setNewAdaptation({...newAdaptation, adaptationLevel: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">개선 방법 (쉼표로 구분)</label>
                  <textarea
                    value={newAdaptation.improvements}
                    onChange={(e) => setNewAdaptation({...newAdaptation, improvements: e.target.value})}
                    rows={3}
                    placeholder="예: 충분한 그늘 제공, 물 자주 제공, 산책 시간 조절"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addAdaptation}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  날씨 적응도 추가
                </button>
              </div>

              <div className="space-y-4">
                {adaptations.map((adaptation) => (
                  <div key={adaptation.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                          <span className="text-2xl mr-2">{getWeatherIcon(adaptation.weatherType)}</span>
                          {adaptation.weatherType}
                        </h3>
                        <p className="text-sm text-gray-600">마지막 업데이트: {adaptation.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getAdaptationColor(adaptation.adaptationLevel)}`}>
                          {adaptation.adaptationLevel}점 ({getAdaptationText(adaptation.adaptationLevel)})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">적응도</span>
                        <span className="text-sm text-gray-600">{adaptation.adaptationLevel}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${adaptation.adaptationLevel * 10}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={adaptation.adaptationLevel}
                        onChange={(e) => updateAdaptationLevel(adaptation.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">{adaptation.adaptationLevel}</span>
                    </div>
                    
                    {adaptation.improvements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">개선 방법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {adaptation.improvements.map((improvement, index) => (
                            <li key={index}>• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">날씨 반응 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
                    <select
                      value={newRecord.weather}
                      onChange={(e) => setNewRecord({...newRecord, weather: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">날씨 선택</option>
                      {weatherTypes.map((weather) => (
                        <option key={weather} value={weather}>{weather}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">온도 (°C)</label>
                    <input
                      type="number"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseInt(e.target.value) || 0})}
                      min="-30"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">습도 (%)</label>
                    <input
                      type="number"
                      value={newRecord.humidity}
                      onChange={(e) => setNewRecord({...newRecord, humidity: parseInt(e.target.value) || 0})}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">강아지 행동</label>
                    <select
                      value={newRecord.behavior}
                      onChange={(e) => setNewRecord({...newRecord, behavior: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">행동 선택</option>
                      {behaviorTypes.map((behavior) => (
                        <option key={behavior} value={behavior}>{behavior}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">편안함 정도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.comfort}
                      onChange={(e) => setNewRecord({...newRecord, comfort: parseInt(e.target.value) || 1})}
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
                    placeholder="강아지의 반응, 특이사항 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  날씨 반응 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 날씨 반응 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 flex items-center">
                            <span className="text-xl mr-2">{getWeatherIcon(record.weather)}</span>
                            {record.weather}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.date} - {record.temperature}°C, 습도 {record.humidity}%
                          </p>
                          <p className="text-sm text-gray-600">행동: {record.behavior}</p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${getComfortColor(record.comfort)}`}>
                            {record.comfort}점 ({getComfortText(record.comfort)})
                          </span>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌤️ 날씨 적응 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지의 반응을 주의 깊게 관찰하세요</li>
                <li>• 날씨에 맞는 적절한 환경을 제공하세요</li>
                <li>• 점진적으로 적응시켜 나가세요</li>
                <li>• 전문가의 조언을 구하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 극한 날씨에서는 실내 활동을 우선하세요</li>
                <li>• 강아지가 불편해하면 즉시 환경을 개선하세요</li>
                <li>• 건강 상태를 고려하여 활동량을 조절하세요</li>
                <li>• 수의사와 상담하여 적절한 대처법을 찾으세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
