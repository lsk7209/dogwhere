'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Battery, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface EnergyLevelMetric {
  id: string
  name: string
  description: string
  category: 'physical' | 'mental' | 'social' | 'environmental'
  importance: 'high' | 'medium' | 'low'
  factors: string[]
  improvements: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface EnergyRecord {
  id: string
  date: string
  metric: string
  level: number
  activity: string
  duration: number
  notes: string
}

export default function DogEnergyLevelTrackerPage() {
  const [metrics, setMetrics] = useState<EnergyLevelMetric[]>([])
  const [records, setRecords] = useState<EnergyRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    metric: '',
    level: 5,
    activity: '',
    duration: 30,
    notes: ''
  })

  const initialMetrics: EnergyLevelMetric[] = [
    {
      id: '1',
      name: '신체적 활력',
      description: '강아지의 신체적 활력과 에너지 수준을 측정하는 지표',
      category: 'physical',
      importance: 'high',
      factors: [
        '연령에 따른 적정 에너지 수준',
        '체중에 따른 에너지 소비',
        '활동량에 따른 에너지 필요량',
        '건강 상태에 따른 에너지 변화'
      ],
      improvements: [
        '적절한 운동량 확보',
        '규칙적인 활동 패턴',
        '건강 상태 점검',
        '영양 상태 개선'
      ],
      completed: false
    },
    {
      id: '2',
      name: '정신적 활력',
      description: '강아지의 정신적 활력과 집중력을 측정하는 지표',
      category: 'mental',
      importance: 'high',
      factors: [
        '정신적 자극의 정도',
        '집중력과 주의력',
        '학습 능력과 기억력',
        '정신적 피로도'
      ],
      improvements: [
        '정신적 자극 활동 제공',
        '집중력 향상 훈련',
        '학습 활동 증가',
        '정신적 피로 완화'
      ],
      completed: false
    },
    {
      id: '3',
      name: '사회적 활력',
      description: '강아지의 사회적 활력과 상호작용 능력을 측정하는 지표',
      category: 'social',
      importance: 'medium',
      factors: [
        '다른 강아지와의 상호작용',
        '사람과의 상호작용',
        '사회적 상황에 대한 반응',
        '사회적 불안감'
      ],
      improvements: [
        '사회적 상호작용 기회 제공',
        '사회적 상황 적응 훈련',
        '사회적 불안감 완화',
        '사회적 기술 향상'
      ],
      completed: false
    },
    {
      id: '4',
      name: '환경적 활력',
      description: '강아지의 환경에 대한 적응력과 반응을 측정하는 지표',
      category: 'environmental',
      importance: 'medium',
      factors: [
        '새로운 환경에 대한 적응',
        '환경 변화에 대한 반응',
        '환경적 자극에 대한 반응',
        '환경적 스트레스'
      ],
      improvements: [
        '다양한 환경 경험 제공',
        '환경 변화 적응 훈련',
        '환경적 자극 조절',
        '환경적 스트레스 완화'
      ],
      completed: false
    },
    {
      id: '5',
      name: '활동 수준',
      description: '강아지의 일상 활동 수준과 패턴을 측정하는 지표',
      category: 'physical',
      importance: 'low',
      factors: [
        '일상 활동의 강도',
        '활동 시간의 분포',
        '활동의 다양성',
        '활동 후 회복 시간'
      ],
      improvements: [
        '활동 강도 조절',
        '활동 시간 분산',
        '활동 다양성 증가',
        '회복 시간 확보'
      ],
      completed: false
    },
    {
      id: '6',
      name: '에너지 회복',
      description: '강아지의 에너지 회복 능력과 패턴을 측정하는 지표',
      category: 'physical',
      importance: 'low',
      factors: [
        '활동 후 에너지 회복 시간',
        '수면의 질과 양',
        '휴식의 효과',
        '스트레스 회복 능력'
      ],
      improvements: [
        '충분한 휴식 시간 확보',
        '수면의 질 개선',
        '효과적인 휴식 방법',
        '스트레스 관리'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMetrics = localStorage.getItem('energyLevelMetrics')
    const savedRecords = localStorage.getItem('energyRecords')
    
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
      localStorage.setItem('energyLevelMetrics', JSON.stringify(metrics))
    }
  }, [metrics])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('energyRecords', JSON.stringify(records))
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

    const record: EnergyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      metric: '',
      level: 5,
      activity: '',
      duration: 30,
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-blue-600 bg-blue-100'
      case 'mental': return 'text-green-600 bg-green-100'
      case 'social': return 'text-yellow-600 bg-yellow-100'
      case 'environmental': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'physical': return '신체적'
      case 'mental': return '정신적'
      case 'social': return '사회적'
      case 'environmental': return '환경적'
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

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-100'
    if (level >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getLevelText = (level: number) => {
    if (level >= 8) return '매우 높음'
    if (level >= 6) return '높음'
    if (level >= 4) return '보통'
    return '낮음'
  }

  const completedMetrics = metrics.filter(metric => metric.completed).length
  const totalMetrics = metrics.length
  const highImportanceMetrics = metrics.filter(metric => metric.importance === 'high').length
  const averageLevel = records.length > 0 ? records.reduce((sum, record) => sum + record.level, 0) / records.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Battery className="w-10 h-10 text-green-600 mr-3" />
            활력 수준 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 에너지 레벨과 활동량을 일일 기록</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Battery className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMetrics}개</p>
            <p className="text-sm text-gray-600">활력 지표</p>
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
            <p className="text-2xl font-bold text-pink-600">{averageLevel.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 활력</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">활력 지표</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">활력 수준 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">활력 지표</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">활력 수준 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.level}
                      onChange={(e) => setNewRecord({...newRecord, level: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 종류</label>
                    <input
                      type="text"
                      value={newRecord.activity}
                      onChange={(e) => setNewRecord({...newRecord, activity: e.target.value})}
                      placeholder="산책, 놀이, 훈련 등"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 시간 (분)</label>
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
                    placeholder="활력 수준에 영향을 준 요인이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  활력 수준 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 활력 수준 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.metric}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.activity} - {record.duration}분
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getLevelColor(record.level)}`}>
                          {record.level}점 ({getLevelText(record.level)})
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ 활력 수준 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 활력을 관찰하세요</li>
                <li>• 적절한 활동량을 제공하세요</li>
                <li>• 규칙적인 활동 패턴을 유지하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 활력 저하가 지속되면 수의사에게 연락하세요</li>
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
