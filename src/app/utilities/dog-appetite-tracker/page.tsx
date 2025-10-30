'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Utensils, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface AppetiteMetric {
  id: string
  name: string
  description: string
  category: 'amount' | 'frequency' | 'preference' | 'behavior'
  importance: 'high' | 'medium' | 'low'
  factors: string[]
  improvements: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface AppetiteRecord {
  id: string
  date: string
  metric: string
  score: number
  amount: number
  frequency: number
  notes: string
}

export default function DogAppetiteTrackerPage() {
  const [metrics, setMetrics] = useState<AppetiteMetric[]>([])
  const [records, setRecords] = useState<AppetiteRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    metric: '',
    score: 5,
    amount: 100,
    frequency: 3,
    notes: ''
  })

  const initialMetrics: AppetiteMetric[] = [
    {
      id: '1',
      name: '식욕 양',
      description: '강아지의 식욕 양과 섭취량을 측정하는 지표',
      category: 'amount',
      importance: 'high',
      factors: [
        '연령에 따른 적정 섭취량',
        '체중에 따른 필요 칼로리',
        '활동량에 따른 에너지 소비',
        '건강 상태에 따른 식욕 변화'
      ],
      improvements: [
        '적절한 사료량 제공',
        '규칙적인 급식 시간',
        '건강 상태 점검',
        '사료 종류 조절'
      ],
      completed: false
    },
    {
      id: '2',
      name: '식욕 빈도',
      description: '강아지의 식욕 빈도와 급식 횟수를 측정하는 지표',
      category: 'frequency',
      importance: 'high',
      factors: [
        '연령에 따른 급식 횟수',
        '체중에 따른 급식 간격',
        '활동량에 따른 급식 패턴',
        '건강 상태에 따른 급식 변화'
      ],
      improvements: [
        '규칙적인 급식 시간 설정',
        '연령에 맞는 급식 횟수',
        '체중에 맞는 급식 간격',
        '건강 상태 점검'
      ],
      completed: false
    },
    {
      id: '3',
      name: '식욕 선호도',
      description: '강아지의 사료 선호도와 기호를 측정하는 지표',
      category: 'preference',
      importance: 'medium',
      factors: [
        '사료 종류에 대한 선호도',
        '사료 맛에 대한 반응',
        '사료 질감에 대한 선호',
        '사료 온도에 대한 선호'
      ],
      improvements: [
        '다양한 사료 종류 시도',
        '사료 맛과 질감 조절',
        '사료 온도 조절',
        '사료 급여 방법 개선'
      ],
      completed: false
    },
    {
      id: '4',
      name: '식욕 행동',
      description: '강아지의 식욕 관련 행동과 반응을 측정하는 지표',
      category: 'behavior',
      importance: 'medium',
      factors: [
        '급식 시간에 대한 반응',
        '사료에 대한 관심도',
        '급식 중 행동 패턴',
        '급식 후 행동 변화'
      ],
      improvements: [
        '급식 시간 일정화',
        '사료에 대한 관심 유도',
        '급식 중 행동 개선',
        '급식 후 행동 관찰'
      ],
      completed: false
    },
    {
      id: '5',
      name: '식욕 변화',
      description: '강아지의 식욕 변화와 패턴을 측정하는 지표',
      category: 'amount',
      importance: 'low',
      factors: [
        '일일 식욕 변화',
        '주간 식욕 패턴',
        '계절별 식욕 변화',
        '건강 상태에 따른 식욕 변화'
      ],
      improvements: [
        '일일 식욕 관찰',
        '주간 식욕 패턴 분석',
        '계절별 식욕 조절',
        '건강 상태 점검'
      ],
      completed: false
    },
    {
      id: '6',
      name: '식욕 문제',
      description: '강아지의 식욕 관련 문제와 해결 방법을 측정하는 지표',
      category: 'behavior',
      importance: 'low',
      factors: [
        '식욕 부진',
        '과식',
        '급식 거부',
        '급식 중 문제 행동'
      ],
      improvements: [
        '식욕 부진 원인 파악',
        '과식 방지 방법',
        '급식 거부 해결',
        '급식 중 문제 행동 개선'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMetrics = localStorage.getItem('appetiteMetrics')
    const savedRecords = localStorage.getItem('appetiteRecords')
    
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics))
      } catch (e) {
        setMetrics(initialMetrics)
      }
    } else {
      setMetrics(initialMetrics)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (metrics.length > 0) {
      localStorage.setItem('appetiteMetrics', JSON.stringify(metrics))
    }
  }, [metrics])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('appetiteRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleMetric = (metricId: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === metricId 
        ? { 
            ...metric, 
            completed: !metric.completed,
            date: !metric.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : metric
    ))
  }

  const addRecord = () => {
    if (!newRecord.metric) return

    const record: AppetiteRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      metric: '',
      score: 5,
      amount: 100,
      frequency: 3,
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'amount': return 'text-blue-600 bg-blue-100'
      case 'frequency': return 'text-green-600 bg-green-100'
      case 'preference': return 'text-yellow-600 bg-yellow-100'
      case 'behavior': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'amount': return '식욕 양'
      case 'frequency': return '식욕 빈도'
      case 'preference': return '식욕 선호도'
      case 'behavior': return '식욕 행동'
      default: return category
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return importance
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreText = (score: number) => {
    if (score >= 8) return '매우 좋음'
    if (score >= 6) return '좋음'
    if (score >= 4) return '보통'
    return '나쁨'
  }

  const completedMetrics = metrics.filter(metric => metric.completed).length
  const totalMetrics = metrics.length
  const highImportanceMetrics = metrics.filter(metric => metric.importance === 'high').length
  const averageScore = records.length > 0 ? records.reduce((sum, record) => sum + record.score, 0) / records.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="w-10 h-10 text-orange-600 mr-3" />
            식욕 변화 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 식욕 변화를 기록하여 건강 상태 모니터링</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Utensils className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMetrics}개</p>
            <p className="text-sm text-gray-600">식욕 지표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedMetrics}개</p>
            <p className="text-sm text-gray-600">완료된 지표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceMetrics}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{averageScore.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 점수</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">식욕 지표</h2>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{metric.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(metric.category)}`}>
                            {getCategoryText(metric.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(metric.importance)}`}>
                            {getImportanceText(metric.importance)}
                          </span>
                          {metric.date && (
                            <span className="text-green-600">완료: {metric.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMetric(metric.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          metric.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">영향 요인</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {metric.factors.map((factor, index) => (
                            <li key={index}>• {factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">개선 방법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {metric.improvements.map((improvement, index) => (
                            <li key={index}>• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">식욕 변화 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">식욕 지표</label>
                    <select
                      value={newRecord.metric}
                      onChange={(e) => setNewRecord({...newRecord, metric: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">지표 선택</option>
                      {metrics.map((metric) => (
                        <option key={metric.id} value={metric.name}>
                          {metric.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">식욕 점수 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.score}
                      onChange={(e) => setNewRecord({...newRecord, score: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">섭취량 (%)</label>
                    <input
                      type="number"
                      value={newRecord.amount}
                      onChange={(e) => setNewRecord({...newRecord, amount: parseInt(e.target.value) || 0})}
                      min="0"
                      max="200"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">급식 횟수</label>
                    <input
                      type="number"
                      value={newRecord.frequency}
                      onChange={(e) => setNewRecord({...newRecord, frequency: parseInt(e.target.value) || 0})}
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
                    placeholder="식욕 변화에 영향을 준 요인이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  식욕 변화 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 식욕 변화 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.metric}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.amount}% 섭취, {record.frequency}회 급식
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getScoreColor(record.score)}`}>
                          {record.score}점 ({getScoreText(record.score)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ 식욕 변화 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 식욕을 관찰하세요</li>
                <li>• 규칙적인 급식 시간을 유지하세요</li>
                <li>• 적절한 사료량을 제공하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 식욕 부진이 지속되면 수의사에게 연락하세요</li>
                <li>• 과도한 자극을 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
