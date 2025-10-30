'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Utensils, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface FeedingRecord {
  id: string
  date: string
  time: string
  foodType: string
  amount: number
  behavior: string
  duration: number
  appetite: number
  notes: string
}

interface FeedingPattern {
  id: string
  foodType: string
  averageAmount: number
  averageAppetite: number
  averageDuration: number
  recordCount: number
  lastFed: string
  rating: number
}

export default function DogFeedingBehaviorTrackerPage() {
  const [records, setRecords] = useState<FeedingRecord[]>([])
  const [patterns, setPatterns] = useState<FeedingPattern[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    foodType: '',
    amount: 100,
    behavior: '',
    duration: 10,
    appetite: 5,
    notes: ''
  })
  const [newPattern, setNewPattern] = useState({
    foodType: '',
    rating: 5
  })

  const foodTypes = [
    '건식 사료',
    '습식 사료',
    '생식',
    '간식',
    '과일',
    '야채',
    '고기',
    '생선',
    '기타'
  ]

  const behaviorTypes = [
    '즉시 먹음',
    '천천히 먹음',
    '조금씩 먹음',
    '흥미 없음',
    '거부함',
    '과식함',
    '급하게 먹음',
    '기타'
  ]

  const appetiteLevels = [
    { value: 1, label: '전혀 먹지 않음', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '거의 먹지 않음', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 먹음', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '좋음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '매우 좋음', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '완전히 좋음', color: 'text-green-600 bg-green-100' },
    { value: 8, label: '열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '매우 열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 10, label: '최고', color: 'text-purple-600 bg-purple-100' }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('feedingRecords')
    const savedPatterns = localStorage.getItem('feedingPatterns')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedPatterns) {
      try {
        setPatterns(JSON.parse(savedPatterns))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('feedingRecords', JSON.stringify(records))
      updatePatterns()
    }
  }, [records])

  useEffect(() => {
    if (patterns.length > 0) {
      localStorage.setItem('feedingPatterns', JSON.stringify(patterns))
    }
  }, [patterns])

  const addRecord = () => {
    if (!newRecord.foodType || !newRecord.behavior) return

    const record: FeedingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      foodType: '',
      amount: 100,
      behavior: '',
      duration: 10,
      appetite: 5,
      notes: ''
    })
  }

  const addPattern = () => {
    if (!newPattern.foodType) return

    const pattern: FeedingPattern = {
      id: Date.now().toString(),
      ...newPattern,
      averageAmount: 0,
      averageAppetite: 0,
      averageDuration: 0,
      recordCount: 0,
      lastFed: new Date().toISOString().split('T')[0]
    }
    setPatterns([pattern, ...patterns])
    setNewPattern({
      foodType: '',
      rating: 5
    })
  }

  const updatePatterns = () => {
    const patternStats = new Map<string, {
      totalAmount: number,
      totalAppetite: number,
      totalDuration: number,
      recordCount: number,
      lastFed: string
    }>()

    records.forEach(record => {
      const key = record.foodType
      if (!patternStats.has(key)) {
        patternStats.set(key, {
          totalAmount: 0,
          totalAppetite: 0,
          totalDuration: 0,
          recordCount: 0,
          lastFed: record.date
        })
      }
      
      const stats = patternStats.get(key)!
      stats.totalAmount += record.amount
      stats.totalAppetite += record.appetite
      stats.totalDuration += record.duration
      stats.recordCount += 1
      if (record.date > stats.lastFed) {
        stats.lastFed = record.date
      }
    })

    const newPatterns: FeedingPattern[] = Array.from(patternStats.entries()).map(([foodType, stats]) => ({
      id: foodType,
      foodType,
      averageAmount: stats.totalAmount / stats.recordCount,
      averageAppetite: stats.totalAppetite / stats.recordCount,
      averageDuration: stats.totalDuration / stats.recordCount,
      recordCount: stats.recordCount,
      lastFed: stats.lastFed,
      rating: Math.round(stats.totalAppetite / stats.recordCount)
    }))

    setPatterns(newPatterns)
  }

  const getAppetiteColor = (appetite: number) => {
    const level = appetiteLevels.find(l => l.value === appetite)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getAppetiteLabel = (appetite: number) => {
    const level = appetiteLevels.find(l => l.value === appetite)
    return level ? level.label : '알 수 없음'
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case '즉시 먹음': return 'text-green-600 bg-green-100'
      case '천천히 먹음': return 'text-blue-600 bg-blue-100'
      case '조금씩 먹음': return 'text-yellow-600 bg-yellow-100'
      case '흥미 없음': return 'text-orange-600 bg-orange-100'
      case '거부함': return 'text-red-600 bg-red-100'
      case '과식함': return 'text-purple-600 bg-purple-100'
      case '급하게 먹음': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getFoodTypeColor = (foodType: string) => {
    switch (foodType) {
      case '건식 사료': return 'text-blue-600 bg-blue-100'
      case '습식 사료': return 'text-green-600 bg-green-100'
      case '생식': return 'text-red-600 bg-red-100'
      case '간식': return 'text-yellow-600 bg-yellow-100'
      case '과일': return 'text-orange-600 bg-orange-100'
      case '야채': return 'text-green-600 bg-green-100'
      case '고기': return 'text-red-600 bg-red-100'
      case '생선': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalRecords = records.length
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0)
  const averageAppetite = records.length > 0 ? records.reduce((sum, record) => sum + record.appetite, 0) / records.length : 0
  const averageDuration = records.length > 0 ? records.reduce((sum, record) => sum + record.duration, 0) / records.length : 0
  const uniqueFoodTypes = new Set(records.map(record => record.foodType)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="w-10 h-10 text-blue-600 mr-3" />
            급식 행동 추적기
          </h1>
          <p className="text-xl text-gray-600">급식 시간, 양, 행동 패턴을 기록하여 건강 상태 파악</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Utensils className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">급식 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalAmount}g</p>
            <p className="text-sm text-gray-600">총 급식량</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageAppetite.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 식욕</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{averageDuration.toFixed(0)}분</p>
            <p className="text-sm text-gray-600">평균 급식 시간</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">급식 패턴 분석</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 유형</label>
                    <input
                      type="text"
                      value={newPattern.foodType}
                      onChange={(e) => setNewPattern({...newPattern, foodType: e.target.value})}
                      placeholder="예: 건식 사료"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">평점 (1-10)</label>
                    <input
                      type="number"
                      value={newPattern.rating}
                      onChange={(e) => setNewPattern({...newPattern, rating: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={addPattern}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  급식 패턴 추가
                </button>
              </div>

              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{pattern.foodType}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getFoodTypeColor(pattern.foodType)}`}>
                            {pattern.foodType}
                          </span>
                          <span className="text-gray-500">
                            {pattern.recordCount}회 급식, 마지막: {pattern.lastFed}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getAppetiteColor(pattern.rating)}`}>
                          {pattern.rating}점
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">평균 급식량</span>
                          <span className="text-sm text-gray-600">{pattern.averageAmount.toFixed(0)}g</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(pattern.averageAmount / 200 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">평균 식욕</span>
                          <span className="text-sm text-gray-600">{pattern.averageAppetite.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pattern.averageAppetite * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">평균 급식 시간</span>
                          <span className="text-sm text-gray-600">{pattern.averageDuration.toFixed(0)}분</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(pattern.averageDuration / 30 * 100, 100)}%` }}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">급식 행동 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식 시간</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 유형</label>
                    <select
                      value={newRecord.foodType}
                      onChange={(e) => setNewRecord({...newRecord, foodType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">사료 유형 선택</option>
                      {foodTypes.map((foodType) => (
                        <option key={foodType} value={foodType}>{foodType}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식량 (g)</label>
                    <input
                      type="number"
                      value={newRecord.amount}
                      onChange={(e) => setNewRecord({...newRecord, amount: parseInt(e.target.value) || 0})}
                      min="1"
                      max="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식 행동</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">식욕 (1-10)</label>
                  <input
                    type="number"
                    value={newRecord.appetite}
                    onChange={(e) => setNewRecord({...newRecord, appetite: parseInt(e.target.value) || 1})}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="급식 과정, 강아지 반응, 특이사항 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  급식 행동 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 급식 행동 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.foodType}</p>
                          <p className="text-sm text-gray-600">
                            {record.date} {record.time} - {record.amount}g
                          </p>
                          <p className="text-sm text-gray-600">
                            행동: {record.behavior}, 시간: {record.duration}분
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs rounded ${getBehaviorColor(record.behavior)}`}>
                              {record.behavior}
                            </span>
                            <br />
                            <span className={`px-2 py-1 text-xs rounded ${getAppetiteColor(record.appetite)}`}>
                              식욕 {record.appetite}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ 급식 행동 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일정한 시간에 급식하세요</li>
                <li>• 적절한 양의 사료를 제공하세요</li>
                <li>• 강아지의 식욕 변화를 관찰하세요</li>
                <li>• 급식 행동을 주의 깊게 기록하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 식욕 부진이 지속되면 수의사에게 문의하세요</li>
                <li>• 급식량을 임의로 변경하지 마세요</li>
                <li>• 강아지가 거부하는 사료는 즉시 확인하세요</li>
                <li>• 급식 시간을 너무 자주 변경하지 마세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
