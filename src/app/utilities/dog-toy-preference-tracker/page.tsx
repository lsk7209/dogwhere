'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Gamepad2, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react'

interface ToyRecord {
  id: string
  date: string
  toyName: string
  category: string
  playDuration: number
  engagement: number
  preference: number
  notes: string
}

interface ToyPreference {
  id: string
  toyName: string
  category: string
  averageEngagement: number
  averagePreference: number
  totalPlayTime: number
  playCount: number
  lastPlayed: string
  rating: number
}

export default function DogToyPreferenceTrackerPage() {
  const [records, setRecords] = useState<ToyRecord[]>([])
  const [preferences, setPreferences] = useState<ToyPreference[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    toyName: '',
    category: '',
    playDuration: 15,
    engagement: 5,
    preference: 5,
    notes: ''
  })
  const [newPreference, setNewPreference] = useState({
    toyName: '',
    category: '',
    rating: 5
  })

  const toyCategories = [
    '공',
    '로프',
    '뼈',
    '인형',
    '퍼즐',
    '치킨',
    '끈',
    '터그',
    '기타'
  ]

  const engagementLevels = [
    { value: 1, label: '전혀 관심 없음', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '거의 관심 없음', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 관심 있음', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '보통 관심', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '관심 있음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '많이 관심', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '매우 관심', color: 'text-green-600 bg-green-100' },
    { value: 8, label: '열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '매우 열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 10, label: '최고 열정', color: 'text-purple-600 bg-purple-100' }
  ]

  const preferenceLevels = [
    { value: 1, label: '전혀 좋아하지 않음', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '거의 좋아하지 않음', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 좋아함', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '보통 좋아함', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '좋아함', color: 'text-yellow-600 bg-yellow-100' },
    { value: 6, label: '많이 좋아함', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '매우 좋아함', color: 'text-green-600 bg-green-100' },
    { value: 8, label: '열정적으로 좋아함', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '매우 열정적으로 좋아함', color: 'text-blue-600 bg-blue-100' },
    { value: 10, label: '최고로 좋아함', color: 'text-purple-600 bg-purple-100' }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('toyRecords')
    const savedPreferences = localStorage.getItem('toyPreferences')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('toyRecords', JSON.stringify(records))
      updatePreferences()
    }
  }, [records])

  useEffect(() => {
    if (preferences.length > 0) {
      localStorage.setItem('toyPreferences', JSON.stringify(preferences))
    }
  }, [preferences])

  const addRecord = () => {
    if (!newRecord.toyName || !newRecord.category) return

    const record: ToyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      toyName: '',
      category: '',
      playDuration: 15,
      engagement: 5,
      preference: 5,
      notes: ''
    })
  }

  const addPreference = () => {
    if (!newPreference.toyName || !newPreference.category) return

    const preference: ToyPreference = {
      id: Date.now().toString(),
      ...newPreference,
      averageEngagement: 0,
      averagePreference: 0,
      totalPlayTime: 0,
      playCount: 0,
      lastPlayed: new Date().toISOString().split('T')[0]
    }
    setPreferences([preference, ...preferences])
    setNewPreference({
      toyName: '',
      category: '',
      rating: 5
    })
  }

  const updatePreferences = () => {
    const toyStats = new Map<string, {
      totalEngagement: number,
      totalPreference: number,
      totalPlayTime: number,
      playCount: number,
      lastPlayed: string,
      category: string
    }>()

    records.forEach(record => {
      const key = record.toyName
      if (!toyStats.has(key)) {
        toyStats.set(key, {
          totalEngagement: 0,
          totalPreference: 0,
          totalPlayTime: 0,
          playCount: 0,
          lastPlayed: record.date,
          category: record.category
        })
      }
      
      const stats = toyStats.get(key)!
      stats.totalEngagement += record.engagement
      stats.totalPreference += record.preference
      stats.totalPlayTime += record.playDuration
      stats.playCount += 1
      if (record.date > stats.lastPlayed) {
        stats.lastPlayed = record.date
      }
    })

    const newPreferences: ToyPreference[] = Array.from(toyStats.entries()).map(([toyName, stats]) => ({
      id: toyName,
      toyName,
      category: stats.category,
      averageEngagement: stats.totalEngagement / stats.playCount,
      averagePreference: stats.totalPreference / stats.playCount,
      totalPlayTime: stats.totalPlayTime,
      playCount: stats.playCount,
      lastPlayed: stats.lastPlayed,
      rating: Math.round(stats.totalPreference / stats.playCount)
    }))

    setPreferences(newPreferences)
  }

  const getEngagementColor = (engagement: number) => {
    const level = engagementLevels.find(l => l.value === engagement)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getEngagementLabel = (engagement: number) => {
    const level = engagementLevels.find(l => l.value === engagement)
    return level ? level.label : '알 수 없음'
  }

  const getPreferenceColor = (preference: number) => {
    const level = preferenceLevels.find(l => l.value === preference)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getPreferenceLabel = (preference: number) => {
    const level = preferenceLevels.find(l => l.value === preference)
    return level ? level.label : '알 수 없음'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공': return 'text-blue-600 bg-blue-100'
      case '로프': return 'text-green-600 bg-green-100'
      case '뼈': return 'text-yellow-600 bg-yellow-100'
      case '인형': return 'text-pink-600 bg-pink-100'
      case '퍼즐': return 'text-purple-600 bg-purple-100'
      case '치킨': return 'text-orange-600 bg-orange-100'
      case '끈': return 'text-red-600 bg-red-100'
      case '터그': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalRecords = records.length
  const totalPlayTime = records.reduce((sum, record) => sum + record.playDuration, 0)
  const averageEngagement = records.length > 0 ? records.reduce((sum, record) => sum + record.engagement, 0) / records.length : 0
  const averagePreference = records.length > 0 ? records.reduce((sum, record) => sum + record.preference, 0) / records.length : 0
  const uniqueToys = new Set(records.map(record => record.toyName)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Gamepad2 className="w-10 h-10 text-blue-600 mr-3" />
            장난감 선호도 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지가 선호하는 장난감과 놀이 방식을 분석</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Gamepad2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">놀이 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalPlayTime}분</p>
            <p className="text-sm text-gray-600">총 놀이 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averagePreference.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 선호도</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{uniqueToys}개</p>
            <p className="text-sm text-gray-600">다양한 장난감</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">장난감 선호도 분석</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">장난감명</label>
                    <input
                      type="text"
                      value={newPreference.toyName}
                      onChange={(e) => setNewPreference({...newPreference, toyName: e.target.value})}
                      placeholder="예: 빨간 공"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newPreference.category}
                      onChange={(e) => setNewPreference({...newPreference, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">카테고리 선택</option>
                      {toyCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">평점 (1-10)</label>
                  <input
                    type="number"
                    value={newPreference.rating}
                    onChange={(e) => setNewPreference({...newPreference, rating: parseInt(e.target.value) || 1})}
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addPreference}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  장난감 선호도 추가
                </button>
              </div>

              <div className="space-y-4">
                {preferences.map((preference) => (
                  <div key={preference.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{preference.toyName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(preference.category)}`}>
                            {preference.category}
                          </span>
                          <span className="text-gray-500">
                            {preference.playCount}회 놀이, {preference.totalPlayTime}분
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getPreferenceColor(preference.rating)}`}>
                          {preference.rating}점
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">참여도</span>
                          <span className="text-sm text-gray-600">{preference.averageEngagement.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${preference.averageEngagement * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">선호도</span>
                          <span className="text-sm text-gray-600">{preference.averagePreference.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${preference.averagePreference * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mt-2">
                      마지막 놀이: {preference.lastPlayed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">놀이 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">놀이 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">장난감명</label>
                    <input
                      type="text"
                      value={newRecord.toyName}
                      onChange={(e) => setNewRecord({...newRecord, toyName: e.target.value})}
                      placeholder="예: 빨간 공"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newRecord.category}
                      onChange={(e) => setNewRecord({...newRecord, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">카테고리 선택</option>
                      {toyCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">놀이 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.playDuration}
                      onChange={(e) => setNewRecord({...newRecord, playDuration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="180"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">참여도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.engagement}
                      onChange={(e) => setNewRecord({...newRecord, engagement: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">선호도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.preference}
                      onChange={(e) => setNewRecord({...newRecord, preference: parseInt(e.target.value) || 1})}
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
                    placeholder="놀이 과정, 강아지 반응, 특이사항 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  놀이 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 놀이 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.toyName}</p>
                          <p className="text-sm text-gray-600">
                            {record.date} - {record.playDuration}분
                          </p>
                          <p className="text-sm text-gray-600">카테고리: {record.category}</p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs rounded ${getEngagementColor(record.engagement)}`}>
                              참여도 {record.engagement}
                            </span>
                            <br />
                            <span className={`px-2 py-1 text-xs rounded ${getPreferenceColor(record.preference)}`}>
                              선호도 {record.preference}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎮 장난감 선호도 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 다양한 장난감을 제공하세요</li>
                <li>• 강아지의 반응을 주의 깊게 관찰하세요</li>
                <li>• 선호하는 장난감을 더 자주 사용하세요</li>
                <li>• 새로운 장난감을 점진적으로 소개하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 안전한 장난감만 사용하세요</li>
                <li>• 부서진 장난감은 즉시 제거하세요</li>
                <li>• 강아지가 관심을 잃으면 다른 장난감을 시도하세요</li>
                <li>• 과도한 자극을 피하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
