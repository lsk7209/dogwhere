'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface StressRecord {
  id: string
  date: string
  time: string
  stressLevel: number
  trigger: string
  behavior: string
  duration: number
  notes: string
}

interface StressPattern {
  id: string
  trigger: string
  averageLevel: number
  frequency: number
  lastOccurred: string
  severity: 'low' | 'medium' | 'high'
}

export default function DogStressLevelTrackerPage() {
  const [records, setRecords] = useState<StressRecord[]>([])
  const [patterns, setPatterns] = useState<StressPattern[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    stressLevel: 5,
    trigger: '',
    behavior: '',
    duration: 30,
    notes: ''
  })
  const [newPattern, setNewPattern] = useState({
    trigger: '',
    severity: 'medium' as 'low' | 'medium' | 'high'
  })

  const stressTriggers = [
    '낯선 사람',
    '다른 강아지',
    '큰 소리',
    '번개/천둥',
    '불꽃놀이',
    '진공청소기',
    '차량 소음',
    '분리 불안',
    '병원 방문',
    '기타'
  ]

  const stressBehaviors = [
    '꼬리 내림',
    '몸 떨림',
    '숨기기',
    '짖기',
    '울기',
    '침 흘리기',
    '호흡 빠름',
    '식욕 부진',
    '기타'
  ]

  const stressLevels = [
    { value: 1, label: '매우 낮음', color: 'text-green-600 bg-green-100' },
    { value: 2, label: '낮음', color: 'text-green-600 bg-green-100' },
    { value: 3, label: '약간 낮음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '약간 높음', color: 'text-orange-600 bg-orange-100' },
    { value: 6, label: '높음', color: 'text-orange-600 bg-orange-100' },
    { value: 7, label: '매우 높음', color: 'text-red-600 bg-red-100' },
    { value: 8, label: '극도로 높음', color: 'text-red-600 bg-red-100' },
    { value: 9, label: '최고', color: 'text-red-600 bg-red-100' },
    { value: 10, label: '극한', color: 'text-red-600 bg-red-100' }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('stressRecords')
    const savedPatterns = localStorage.getItem('stressPatterns')
    
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
      localStorage.setItem('stressRecords', JSON.stringify(records))
      updatePatterns()
    }
  }, [records])

  useEffect(() => {
    if (patterns.length > 0) {
      localStorage.setItem('stressPatterns', JSON.stringify(patterns))
    }
  }, [patterns])

  const addRecord = () => {
    if (!newRecord.trigger || !newRecord.behavior) return

    const record: StressRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      stressLevel: 5,
      trigger: '',
      behavior: '',
      duration: 30,
      notes: ''
    })
  }

  const addPattern = () => {
    if (!newPattern.trigger) return

    const pattern: StressPattern = {
      id: Date.now().toString(),
      ...newPattern,
      averageLevel: 0,
      frequency: 0,
      lastOccurred: new Date().toISOString().split('T')[0]
    }
    setPatterns([pattern, ...patterns])
    setNewPattern({
      trigger: '',
      severity: 'medium'
    })
  }

  const updatePatterns = () => {
    const patternStats = new Map<string, {
      totalLevel: number,
      count: number,
      lastOccurred: string
    }>()

    records.forEach(record => {
      const key = record.trigger
      if (!patternStats.has(key)) {
        patternStats.set(key, {
          totalLevel: 0,
          count: 0,
          lastOccurred: record.date
        })
      }
      
      const stats = patternStats.get(key)!
      stats.totalLevel += record.stressLevel
      stats.count += 1
      if (record.date > stats.lastOccurred) {
        stats.lastOccurred = record.date
      }
    })

    const newPatterns: StressPattern[] = Array.from(patternStats.entries()).map(([trigger, stats]) => {
      const averageLevel = stats.totalLevel / stats.count
      let severity: 'low' | 'medium' | 'high' = 'low'
      if (averageLevel >= 7) severity = 'high'
      else if (averageLevel >= 4) severity = 'medium'

      return {
        id: trigger,
        trigger,
        averageLevel,
        frequency: stats.count,
        lastOccurred: stats.lastOccurred,
        severity
      }
    })

    setPatterns(newPatterns)
  }

  const getStressColor = (level: number) => {
    const stressLevel = stressLevels.find(l => l.value === level)
    return stressLevel ? stressLevel.color : 'text-gray-600 bg-gray-100'
  }

  const getStressLabel = (level: number) => {
    const stressLevel = stressLevels.find(l => l.value === level)
    return stressLevel ? stressLevel.label : '알 수 없음'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return '낮음'
      case 'medium': return '보통'
      case 'high': return '높음'
      default: return severity
    }
  }

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case '꼬리 내림': return 'text-blue-600 bg-blue-100'
      case '몸 떨림': return 'text-orange-600 bg-orange-100'
      case '숨기기': return 'text-purple-600 bg-purple-100'
      case '짖기': return 'text-red-600 bg-red-100'
      case '울기': return 'text-pink-600 bg-pink-100'
      case '침 흘리기': return 'text-yellow-600 bg-yellow-100'
      case '호흡 빠름': return 'text-indigo-600 bg-indigo-100'
      case '식욕 부진': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalRecords = records.length
  const averageStress = records.length > 0 ? records.reduce((sum, record) => sum + record.stressLevel, 0) / records.length : 0
  const highStressRecords = records.filter(record => record.stressLevel >= 7).length
  const uniqueTriggers = new Set(records.map(record => record.trigger)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-blue-600 mr-3" />
            스트레스 레벨 추적기
          </h1>
          <p className="text-xl text-gray-600">일일 스트레스 지수와 원인을 기록하여 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">스트레스 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageStress.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 스트레스</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highStressRecords}회</p>
            <p className="text-sm text-gray-600">고스트레스</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{uniqueTriggers}개</p>
            <p className="text-sm text-gray-600">다양한 원인</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">스트레스 패턴 분석</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">스트레스 원인</label>
                    <input
                      type="text"
                      value={newPattern.trigger}
                      onChange={(e) => setNewPattern({...newPattern, trigger: e.target.value})}
                      placeholder="예: 낯선 사람"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
                    <select
                      value={newPattern.severity}
                      onChange={(e) => setNewPattern({...newPattern, severity: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={addPattern}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  스트레스 패턴 추가
                </button>
              </div>

              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{pattern.trigger}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(pattern.severity)}`}>
                            {getSeverityText(pattern.severity)}
                          </span>
                          <span className="text-gray-500">
                            {pattern.frequency}회 발생, 마지막: {pattern.lastOccurred}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getStressColor(Math.round(pattern.averageLevel))}`}>
                          {pattern.averageLevel.toFixed(1)}점
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">평균 스트레스 레벨</span>
                        <span className="text-sm text-gray-600">{pattern.averageLevel.toFixed(1)}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pattern.averageLevel * 10}%` }}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">스트레스 레벨 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">스트레스 원인</label>
                    <select
                      value={newRecord.trigger}
                      onChange={(e) => setNewRecord({...newRecord, trigger: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">원인 선택</option>
                      {stressTriggers.map((trigger) => (
                        <option key={trigger} value={trigger}>{trigger}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">스트레스 레벨 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.stressLevel}
                      onChange={(e) => setNewRecord({...newRecord, stressLevel: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">스트레스 행동</label>
                    <select
                      value={newRecord.behavior}
                      onChange={(e) => setNewRecord({...newRecord, behavior: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">행동 선택</option>
                      {stressBehaviors.map((behavior) => (
                        <option key={behavior} value={behavior}>{behavior}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="300"
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
                    placeholder="스트레스 상황, 강아지 반응, 대처 방법 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  스트레스 레벨 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 스트레스 레벨 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.trigger}</p>
                          <p className="text-sm text-gray-600">
                            {record.date} {record.time} - {record.duration}분
                          </p>
                          <p className="text-sm text-gray-600">행동: {record.behavior}</p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${getStressColor(record.stressLevel)}`}>
                            {record.stressLevel}점 ({getStressLabel(record.stressLevel)})
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">💔 스트레스 레벨 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 스트레스 원인을 파악하세요</li>
                <li>• 강아지의 행동 변화를 관찰하세요</li>
                <li>• 스트레스 완화 방법을 시도하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 고스트레스가 지속되면 수의사에게 문의하세요</li>
                <li>• 강아지가 불안해하면 즉시 안정시키세요</li>
                <li>• 스트레스 원인을 제거하거나 최소화하세요</li>
                <li>• 강아지의 페이스에 맞춰 접근하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
