'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface SocialInteractionMetric {
  id: string
  name: string
  description: string
  category: 'dogs' | 'humans' | 'environment' | 'behavior'
  importance: 'high' | 'medium' | 'low'
  factors: string[]
  improvements: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface SocialRecord {
  id: string
  date: string
  metric: string
  score: number
  duration: number
  participants: string
  notes: string
}

export default function DogSocialInteractionTrackerPage() {
  const [metrics, setMetrics] = useState<SocialInteractionMetric[]>([])
  const [records, setRecords] = useState<SocialRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    metric: '',
    score: 5,
    duration: 30,
    participants: '',
    notes: ''
  })

  const initialMetrics: SocialInteractionMetric[] = [
    {
      id: '1',
      name: '강아지와의 상호작용',
      description: '다른 강아지와의 상호작용 능력과 반응을 측정하는 지표',
      category: 'dogs',
      importance: 'high',
      factors: [
        '다른 강아지에 대한 관심도',
        '강아지와의 놀이 능력',
        '강아지와의 의사소통',
        '강아지와의 갈등 해결'
      ],
      improvements: [
        '다양한 강아지와의 만남 기회 제공',
        '강아지와의 놀이 활동 증가',
        '강아지와의 의사소통 훈련',
        '갈등 해결 방법 교육'
      ],
      completed: false
    },
    {
      id: '2',
      name: '사람과의 상호작용',
      description: '사람과의 상호작용 능력과 반응을 측정하는 지표',
      category: 'humans',
      importance: 'high',
      factors: [
        '사람에 대한 관심도',
        '사람과의 놀이 능력',
        '사람과의 의사소통',
        '사람에 대한 신뢰도'
      ],
      improvements: [
        '다양한 사람과의 만남 기회 제공',
        '사람과의 놀이 활동 증가',
        '사람과의 의사소통 훈련',
        '사람에 대한 신뢰도 향상'
      ],
      completed: false
    },
    {
      id: '3',
      name: '환경 적응',
      description: '새로운 환경에 대한 적응 능력을 측정하는 지표',
      category: 'environment',
      importance: 'medium',
      factors: [
        '새로운 환경에 대한 관심도',
        '환경 변화에 대한 적응',
        '환경적 자극에 대한 반응',
        '환경적 스트레스 관리'
      ],
      improvements: [
        '다양한 환경 경험 제공',
        '환경 변화 적응 훈련',
        '환경적 자극 조절',
        '환경적 스트레스 관리'
      ],
      completed: false
    },
    {
      id: '4',
      name: '사회적 행동',
      description: '사회적 상황에서의 행동과 반응을 측정하는 지표',
      category: 'behavior',
      importance: 'medium',
      factors: [
        '사회적 상황에 대한 반응',
        '사회적 규칙 준수',
        '사회적 갈등 해결',
        '사회적 협력 능력'
      ],
      improvements: [
        '사회적 상황 경험 제공',
        '사회적 규칙 교육',
        '사회적 갈등 해결 훈련',
        '사회적 협력 능력 향상'
      ],
      completed: false
    },
    {
      id: '5',
      name: '사회적 불안',
      description: '사회적 상황에서의 불안감과 두려움을 측정하는 지표',
      category: 'behavior',
      importance: 'low',
      factors: [
        '사회적 상황에 대한 불안감',
        '낯선 사람에 대한 두려움',
        '낯선 강아지에 대한 두려움',
        '사회적 상황 회피'
      ],
      improvements: [
        '사회적 불안감 완화',
        '낯선 사람에 대한 적응',
        '낯선 강아지에 대한 적응',
        '사회적 상황 적응 훈련'
      ],
      completed: false
    },
    {
      id: '6',
      name: '사회적 기술',
      description: '사회적 기술과 능력을 측정하는 지표',
      category: 'behavior',
      importance: 'low',
      factors: [
        '사회적 기술의 발달',
        '사회적 기술의 활용',
        '사회적 기술의 개선',
        '사회적 기술의 유지'
      ],
      improvements: [
        '사회적 기술 발달 촉진',
        '사회적 기술 활용 기회 제공',
        '사회적 기술 개선 훈련',
        '사회적 기술 유지 관리'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMetrics = localStorage.getItem('socialInteractionMetrics')
    const savedRecords = localStorage.getItem('socialRecords')
    
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
      localStorage.setItem('socialInteractionMetrics', JSON.stringify(metrics))
    }
  }, [metrics])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('socialRecords', JSON.stringify(records))
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

    const record: SocialRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      metric: '',
      score: 5,
      duration: 30,
      participants: '',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dogs': return 'text-blue-600 bg-blue-100'
      case 'humans': return 'text-green-600 bg-green-100'
      case 'environment': return 'text-yellow-600 bg-yellow-100'
      case 'behavior': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'dogs': return '강아지'
      case 'humans': return '사람'
      case 'environment': return '환경'
      case 'behavior': return '행동'
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
            <Users className="w-10 h-10 text-blue-600 mr-3" />
            사회적 상호작용 추적기
          </h1>
          <p className="text-xl text-gray-600">다른 강아지, 사람과의 상호작용을 기록하고 분석</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMetrics}개</p>
            <p className="text-sm text-gray-600">상호작용 지표</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사회적 상호작용 지표</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사회적 상호작용 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">상호작용 지표</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">상호작용 점수 (1-10)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">상호작용 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">참여자</label>
                    <input
                      type="text"
                      value={newRecord.participants}
                      onChange={(e) => setNewRecord({...newRecord, participants: e.target.value})}
                      placeholder="강아지, 사람 등"
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
                    placeholder="상호작용 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  사회적 상호작용 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 사회적 상호작용 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.metric}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.participants} - {record.duration}분
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">👥 사회적 상호작용 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 상호작용을 관찰하세요</li>
                <li>• 다양한 상호작용 기회를 제공하세요</li>
                <li>• 긍정적인 상호작용을 격려하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 상호작용 문제가 지속되면 수의사에게 연락하세요</li>
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
