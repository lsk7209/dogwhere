'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface BehavioralChangeRecord {
  id: string
  date: string
  behavior: string
  category: string
  intensity: number
  frequency: string
  trigger: string
  notes: string
}

interface BehavioralPattern {
  id: string
  behavior: string
  category: string
  averageIntensity: number
  frequency: number
  lastObserved: string
  trend: 'increasing' | 'decreasing' | 'stable'
}

export default function DogBehavioralChangeTrackerPage() {
  const [records, setRecords] = useState<BehavioralChangeRecord[]>([])
  const [patterns, setPatterns] = useState<BehavioralPattern[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    behavior: '',
    category: '',
    intensity: 5,
    frequency: '',
    trigger: '',
    notes: ''
  })
  const [newPattern, setNewPattern] = useState({
    behavior: '',
    category: '',
    trend: 'stable' as 'increasing' | 'decreasing' | 'stable'
  })

  const behaviorCategories = [
    '공격성',
    '불안',
    '공포',
    '과도한 짖기',
    '파괴적 행동',
    '분리 불안',
    '식욕 변화',
    '수면 패턴 변화',
    '사회적 행동',
    '기타'
  ]

  const frequencyOptions = [
    '매우 드물게',
    '드물게',
    '가끔',
    '자주',
    '매우 자주',
    '지속적으로'
  ]

  const intensityLevels = [
    { value: 1, label: '매우 약함', color: 'text-green-600 bg-green-100' },
    { value: 2, label: '약함', color: 'text-green-600 bg-green-100' },
    { value: 3, label: '약간 약함', color: 'text-yellow-600 bg-yellow-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '약간 강함', color: 'text-orange-600 bg-orange-100' },
    { value: 6, label: '강함', color: 'text-orange-600 bg-orange-100' },
    { value: 7, label: '매우 강함', color: 'text-red-600 bg-red-100' },
    { value: 8, label: '극도로 강함', color: 'text-red-600 bg-red-100' },
    { value: 9, label: '최고', color: 'text-red-600 bg-red-100' },
    { value: 10, label: '극한', color: 'text-red-600 bg-red-100' }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('behavioralChangeRecords')
    const savedPatterns = localStorage.getItem('behavioralPatterns')
    
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
      localStorage.setItem('behavioralChangeRecords', JSON.stringify(records))
      updatePatterns()
    }
  }, [records])

  useEffect(() => {
    if (patterns.length > 0) {
      localStorage.setItem('behavioralPatterns', JSON.stringify(patterns))
    }
  }, [patterns])

  const addRecord = () => {
    if (!newRecord.behavior || !newRecord.category) return

    const record: BehavioralChangeRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      behavior: '',
      category: '',
      intensity: 5,
      frequency: '',
      trigger: '',
      notes: ''
    })
  }

  const addPattern = () => {
    if (!newPattern.behavior || !newPattern.category) return

    const pattern: BehavioralPattern = {
      id: Date.now().toString(),
      ...newPattern,
      averageIntensity: 0,
      frequency: 0,
      lastObserved: new Date().toISOString().split('T')[0]
    }
    setPatterns([pattern, ...patterns])
    setNewPattern({
      behavior: '',
      category: '',
      trend: 'stable'
    })
  }

  const updatePatterns = () => {
    const patternStats = new Map<string, {
      totalIntensity: number,
      count: number,
      lastObserved: string
    }>()

    records.forEach(record => {
      const key = record.behavior
      if (!patternStats.has(key)) {
        patternStats.set(key, {
          totalIntensity: 0,
          count: 0,
          lastObserved: record.date
        })
      }
      
      const stats = patternStats.get(key)!
      stats.totalIntensity += record.intensity
      stats.count += 1
      if (record.date > stats.lastObserved) {
        stats.lastObserved = record.date
      }
    })

    const newPatterns: BehavioralPattern[] = Array.from(patternStats.entries()).map(([behavior, stats]) => {
      const averageIntensity = stats.totalIntensity / stats.count
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
      
      // 간단한 트렌드 계산 (최근 3개 기록과 이전 3개 기록 비교)
      const recentRecords = records
        .filter(r => r.behavior === behavior)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
      
      const olderRecords = records
        .filter(r => r.behavior === behavior)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(3, 6)
      
      if (recentRecords.length >= 2 && olderRecords.length >= 2) {
        const recentAvg = recentRecords.reduce((sum, r) => sum + r.intensity, 0) / recentRecords.length
        const olderAvg = olderRecords.reduce((sum, r) => sum + r.intensity, 0) / olderRecords.length
        
        if (recentAvg > olderAvg + 1) trend = 'increasing'
        else if (recentAvg < olderAvg - 1) trend = 'decreasing'
      }

      return {
        id: behavior,
        behavior,
        category: records.find(r => r.behavior === behavior)?.category || '',
        averageIntensity,
        frequency: stats.count,
        lastObserved: stats.lastObserved,
        trend
      }
    })

    setPatterns(newPatterns)
  }

  const getIntensityColor = (intensity: number) => {
    const level = intensityLevels.find(l => l.value === intensity)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getIntensityLabel = (intensity: number) => {
    const level = intensityLevels.find(l => l.value === intensity)
    return level ? level.label : '알 수 없음'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '공격성': return 'text-red-600 bg-red-100'
      case '불안': return 'text-orange-600 bg-orange-100'
      case '공포': return 'text-purple-600 bg-purple-100'
      case '과도한 짖기': return 'text-yellow-600 bg-yellow-100'
      case '파괴적 행동': return 'text-red-600 bg-red-100'
      case '분리 불안': return 'text-pink-600 bg-pink-100'
      case '식욕 변화': return 'text-green-600 bg-green-100'
      case '수면 패턴 변화': return 'text-blue-600 bg-blue-100'
      case '사회적 행동': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600 bg-red-100'
      case 'decreasing': return 'text-green-600 bg-green-100'
      case 'stable': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'increasing': return '증가'
      case 'decreasing': return '감소'
      case 'stable': return '안정'
      default: return trend
    }
  }

  const totalRecords = records.length
  const averageIntensity = records.length > 0 ? records.reduce((sum, record) => sum + record.intensity, 0) / records.length : 0
  const highIntensityRecords = records.filter(record => record.intensity >= 7).length
  const uniqueBehaviors = new Set(records.map(record => record.behavior)).size
  const increasingTrends = patterns.filter(pattern => pattern.trend === 'increasing').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-blue-600 mr-3" />
            행동 변화 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 행동 변화와 패턴을 상세히 기록하고 분석</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">행동 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageIntensity.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 강도</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highIntensityRecords}회</p>
            <p className="text-sm text-gray-600">고강도 행동</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{uniqueBehaviors}개</p>
            <p className="text-sm text-gray-600">다양한 행동</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 패턴 분석</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">행동</label>
                    <input
                      type="text"
                      value={newPattern.behavior}
                      onChange={(e) => setNewPattern({...newPattern, behavior: e.target.value})}
                      placeholder="예: 과도한 짖기"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newPattern.category}
                      onChange={(e) => setNewPattern({...newPattern, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">카테고리 선택</option>
                      {behaviorCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">트렌드</label>
                  <select
                    value={newPattern.trend}
                    onChange={(e) => setNewPattern({...newPattern, trend: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="stable">안정</option>
                    <option value="increasing">증가</option>
                    <option value="decreasing">감소</option>
                  </select>
                </div>
                <button
                  onClick={addPattern}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  행동 패턴 추가
                </button>
              </div>

              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{pattern.behavior}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(pattern.category)}`}>
                            {pattern.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getTrendColor(pattern.trend)}`}>
                            {getTrendText(pattern.trend)}
                          </span>
                          <span className="text-gray-500">
                            {pattern.frequency}회 관찰, 마지막: {pattern.lastObserved}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getIntensityColor(Math.round(pattern.averageIntensity))}`}>
                          {pattern.averageIntensity.toFixed(1)}점
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">평균 강도</span>
                        <span className="text-sm text-gray-600">{pattern.averageIntensity.toFixed(1)}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pattern.averageIntensity * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 변화 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">행동</label>
                    <input
                      type="text"
                      value={newRecord.behavior}
                      onChange={(e) => setNewRecord({...newRecord, behavior: e.target.value})}
                      placeholder="예: 과도한 짖기"
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
                      {behaviorCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">강도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.intensity}
                      onChange={(e) => setNewRecord({...newRecord, intensity: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">빈도</label>
                    <select
                      value={newRecord.frequency}
                      onChange={(e) => setNewRecord({...newRecord, frequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">빈도 선택</option>
                      {frequencyOptions.map((frequency) => (
                        <option key={frequency} value={frequency}>{frequency}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">유발 요인</label>
                    <input
                      type="text"
                      value={newRecord.trigger}
                      onChange={(e) => setNewRecord({...newRecord, trigger: e.target.value})}
                      placeholder="예: 낯선 사람"
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
                    placeholder="행동 변화 상황, 강아지 반응, 대처 방법 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  행동 변화 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 행동 변화 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.behavior}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            카테고리: {record.category}, 빈도: {record.frequency}
                          </p>
                          <p className="text-sm text-gray-600">유발 요인: {record.trigger}</p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${getIntensityColor(record.intensity)}`}>
                            {record.intensity}점 ({getIntensityLabel(record.intensity)})
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 행동 변화 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 행동을 관찰하세요</li>
                <li>• 행동 변화의 패턴을 파악하세요</li>
                <li>• 유발 요인을 정확히 기록하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 문제 행동이 지속되면 수의사에게 문의하세요</li>
                <li>• 강아지가 불안해하면 즉시 안정시키세요</li>
                <li>• 행동 변화의 원인을 파악하세요</li>
                <li>• 긍정적인 변화를 격려하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
