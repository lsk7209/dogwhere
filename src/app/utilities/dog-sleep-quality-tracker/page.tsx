'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface SleepQualityMetric {
  id: string
  name: string
  description: string
  category: 'duration' | 'depth' | 'interruption' | 'environment'
  importance: 'high' | 'medium' | 'low'
  factors: string[]
  improvements: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface SleepRecord {
  id: string
  date: string
  metric: string
  score: number
  duration: number
  interruptions: number
  notes: string
}

export default function DogSleepQualityTrackerPage() {
  const [metrics, setMetrics] = useState<SleepQualityMetric[]>([])
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    metric: '',
    score: 5,
    duration: 8,
    interruptions: 0,
    notes: ''
  })

  const initialMetrics: SleepQualityMetric[] = [
    {
      id: '1',
      name: '수면 시간',
      description: '강아지의 하루 평균 수면 시간을 측정하는 지표',
      category: 'duration',
      importance: 'high',
      factors: [
        '연령에 따른 적정 수면 시간',
        '활동량에 따른 수면 필요량',
        '건강 상태에 따른 수면 패턴',
        '환경 요인에 따른 수면 영향'
      ],
      improvements: [
        '규칙적인 수면 시간 설정',
        '적절한 운동량 확보',
        '편안한 수면 환경 조성',
        '스트레스 요인 제거'
      ],
      completed: false
    },
    {
      id: '2',
      name: '수면 깊이',
      description: '강아지의 수면 깊이와 질을 평가하는 지표',
      category: 'depth',
      importance: 'high',
      factors: [
        '수면 중 움직임 정도',
        '깊은 잠의 비율',
        '잠들기까지의 시간',
        '수면 중 반응성'
      ],
      improvements: [
        '편안한 침구 제공',
        '조용한 환경 조성',
        '적절한 온도 유지',
        '안전한 공간 제공'
      ],
      completed: false
    },
    {
      id: '3',
      name: '수면 중단',
      description: '수면 중 깨어나는 횟수와 원인을 분석하는 지표',
      category: 'interruption',
      importance: 'medium',
      factors: [
        '야간 소음',
        '배변 욕구',
        '불안감',
        '건강 문제'
      ],
      improvements: [
        '소음 차단',
        '배변 시간 조절',
        '불안 요인 제거',
        '건강 상태 점검'
      ],
      completed: false
    },
    {
      id: '4',
      name: '수면 환경',
      description: '수면 환경의 적절성을 평가하는 지표',
      category: 'environment',
      importance: 'medium',
      factors: [
        '온도와 습도',
        '조명 상태',
        '소음 수준',
        '침구의 편안함'
      ],
      improvements: [
        '적절한 온도 유지',
        '어두운 환경 조성',
        '조용한 공간 제공',
        '편안한 침구 사용'
      ],
      completed: false
    },
    {
      id: '5',
      name: '수면 패턴',
      description: '강아지의 수면 패턴과 일정을 분석하는 지표',
      category: 'duration',
      importance: 'low',
      factors: [
        '낮잠과 밤잠의 비율',
        '수면 시간의 일관성',
        '계절별 수면 변화',
        '활동에 따른 수면 조절'
      ],
      improvements: [
        '일관된 수면 일정 유지',
        '계절별 환경 조절',
        '활동량 조절',
        '규칙적인 생활 패턴'
      ],
      completed: false
    },
    {
      id: '6',
      name: '수면 중 행동',
      description: '수면 중 강아지의 행동과 반응을 관찰하는 지표',
      category: 'depth',
      importance: 'low',
      factors: [
        '꿈을 꾸는 행동',
        '수면 중 소리',
        '자세 변화',
        '수면 중 반응'
      ],
      improvements: [
        '편안한 자세 유지',
        '안전한 수면 공간 제공',
        '스트레스 완화',
        '건강 상태 점검'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMetrics = localStorage.getItem('sleepQualityMetrics')
    const savedRecords = localStorage.getItem('sleepRecords')
    
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
      localStorage.setItem('sleepQualityMetrics', JSON.stringify(metrics))
    }
  }, [metrics])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('sleepRecords', JSON.stringify(records))
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

    const record: SleepRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      metric: '',
      score: 5,
      duration: 8,
      interruptions: 0,
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'duration': return 'text-blue-600 bg-blue-100'
      case 'depth': return 'text-green-600 bg-green-100'
      case 'interruption': return 'text-yellow-600 bg-yellow-100'
      case 'environment': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'duration': return '수면 시간'
      case 'depth': return '수면 깊이'
      case 'interruption': return '수면 중단'
      case 'environment': return '수면 환경'
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
            <Moon className="w-10 h-10 text-indigo-600 mr-3" />
            수면 품질 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 수면 품질과 패턴을 분석하여 건강 상태 파악</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Moon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMetrics}개</p>
            <p className="text-sm text-gray-600">수면 지표</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 품질 지표</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 품질 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 지표</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 점수 (1-10)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 시간 (시간)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="24"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">중단 횟수</label>
                    <input
                      type="number"
                      value={newRecord.interruptions}
                      onChange={(e) => setNewRecord({...newRecord, interruptions: parseInt(e.target.value) || 0})}
                      min="0"
                      max="20"
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
                    placeholder="수면 품질에 영향을 준 요인이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  수면 품질 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 수면 품질 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.metric}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}시간, 중단 {record.interruptions}회
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌙 수면 품질 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 수면을 관찰하세요</li>
                <li>• 편안한 수면 환경을 제공하세요</li>
                <li>• 규칙적인 수면 일정을 유지하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 수면 문제가 지속되면 수의사에게 연락하세요</li>
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
