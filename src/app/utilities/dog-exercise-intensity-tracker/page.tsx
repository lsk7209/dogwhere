'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react'

interface ExerciseRecord {
  id: string
  date: string
  type: string
  duration: number
  intensity: number
  heartRate: number
  distance: number
  notes: string
}

interface ExerciseGoal {
  id: string
  name: string
  targetDuration: number
  targetIntensity: number
  frequency: string
  completed: boolean
  progress: number
}

export default function DogExerciseIntensityTrackerPage() {
  const [records, setRecords] = useState<ExerciseRecord[]>([])
  const [goals, setGoals] = useState<ExerciseGoal[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 30,
    intensity: 5,
    heartRate: 0,
    distance: 0,
    notes: ''
  })
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetDuration: 30,
    targetIntensity: 5,
    frequency: 'daily'
  })

  const exerciseTypes = [
    '산책',
    '달리기',
    '놀이',
    '수영',
    '애지훈련',
    '장애물 훈련',
    '공놀이',
    '줄다리기',
    '기타'
  ]

  const intensityLevels = [
    { value: 1, label: '매우 낮음', color: 'text-green-600 bg-green-100' },
    { value: 2, label: '낮음', color: 'text-green-600 bg-green-100' },
    { value: 3, label: '약간 낮음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 4, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '약간 높음', color: 'text-orange-600 bg-orange-100' },
    { value: 6, label: '높음', color: 'text-orange-600 bg-orange-100' },
    { value: 7, label: '매우 높음', color: 'text-red-600 bg-red-100' },
    { value: 8, label: '극도로 높음', color: 'text-red-600 bg-red-100' },
    { value: 9, label: '최대', color: 'text-red-600 bg-red-100' },
    { value: 10, label: '극한', color: 'text-red-600 bg-red-100' }
  ]

  const initialGoals: ExerciseGoal[] = [
    {
      id: '1',
      name: '일일 산책 목표',
      targetDuration: 60,
      targetIntensity: 3,
      frequency: 'daily',
      completed: false,
      progress: 0
    },
    {
      id: '2',
      name: '주간 고강도 운동',
      targetDuration: 30,
      targetIntensity: 7,
      frequency: 'weekly',
      completed: false,
      progress: 0
    },
    {
      id: '3',
      name: '월간 수영 목표',
      targetDuration: 45,
      targetIntensity: 5,
      frequency: 'monthly',
      completed: false,
      progress: 0
    }
  ]

  useEffect(() => {
    const savedRecords = localStorage.getItem('exerciseRecords')
    const savedGoals = localStorage.getItem('exerciseGoals')
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
    
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (e) {
        setGoals(initialGoals)
      }
    } else {
      setGoals(initialGoals)
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('exerciseRecords', JSON.stringify(records))
    }
  }, [records])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('exerciseGoals', JSON.stringify(goals))
    }
  }, [goals])

  const addRecord = () => {
    if (!newRecord.type) return

    const record: ExerciseRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: 30,
      intensity: 5,
      heartRate: 0,
      distance: 0,
      notes: ''
    })
  }

  const addGoal = () => {
    if (!newGoal.name) return

    const goal: ExerciseGoal = {
      id: Date.now().toString(),
      ...newGoal,
      completed: false,
      progress: 0
    }
    setGoals([goal, ...goals])
    setNewGoal({
      name: '',
      targetDuration: 30,
      targetIntensity: 5,
      frequency: 'daily'
    })
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            progress: Math.max(0, Math.min(100, progress)),
            completed: progress >= 100
          } 
        : goal
    ))
  }

  const getIntensityColor = (intensity: number) => {
    const level = intensityLevels.find(l => l.value === intensity)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getIntensityLabel = (intensity: number) => {
    const level = intensityLevels.find(l => l.value === intensity)
    return level ? level.label : '알 수 없음'
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-red-600 bg-red-100'
      case 'weekly': return 'text-yellow-600 bg-yellow-100'
      case 'monthly': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      default: return frequency
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const totalRecords = records.length
  const totalDuration = records.reduce((sum, record) => sum + record.duration, 0)
  const averageIntensity = records.length > 0 ? records.reduce((sum, record) => sum + record.intensity, 0) / records.length : 0
  const totalDistance = records.reduce((sum, record) => sum + record.distance, 0)
  const completedGoals = goals.filter(goal => goal.completed).length
  const totalGoals = goals.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-10 h-10 text-blue-600 mr-3" />
            운동 강도 추적기
          </h1>
          <p className="text-xl text-gray-600">산책, 놀이 등 운동의 강도와 지속 시간을 기록</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalRecords}회</p>
            <p className="text-sm text-gray-600">운동 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalDuration}분</p>
            <p className="text-sm text-gray-600">총 운동 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageIntensity.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 강도</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{completedGoals}개</p>
            <p className="text-sm text-gray-600">완료된 목표</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 목표 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표명</label>
                    <input
                      type="text"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      placeholder="예: 일일 산책 목표"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">빈도</label>
                    <select
                      value={newGoal.frequency}
                      onChange={(e) => setNewGoal({...newGoal, frequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="daily">매일</option>
                      <option value="weekly">주간</option>
                      <option value="monthly">월간</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표 시간 (분)</label>
                    <input
                      type="number"
                      value={newGoal.targetDuration}
                      onChange={(e) => setNewGoal({...newGoal, targetDuration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표 강도 (1-10)</label>
                    <input
                      type="number"
                      value={newGoal.targetIntensity}
                      onChange={(e) => setNewGoal({...newGoal, targetIntensity: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={addGoal}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  운동 목표 추가
                </button>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{goal.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getFrequencyColor(goal.frequency)}`}>
                            {getFrequencyText(goal.frequency)}
                          </span>
                          <span className="text-gray-500">
                            {goal.targetDuration}분, 강도 {goal.targetIntensity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getProgressColor(goal.progress)}`}>
                          {goal.progress}%
                        </span>
                        {goal.completed && (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">진행률</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 유형</label>
                    <select
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">운동 유형 선택</option>
                      {exerciseTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 강도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.intensity}
                      onChange={(e) => setNewRecord({...newRecord, intensity: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심박수 (BPM)</label>
                    <input
                      type="number"
                      value={newRecord.heartRate}
                      onChange={(e) => setNewRecord({...newRecord, heartRate: parseInt(e.target.value) || 0})}
                      min="0"
                      max="300"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">거리 (km)</label>
                    <input
                      type="number"
                      value={newRecord.distance}
                      onChange={(e) => setNewRecord({...newRecord, distance: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="운동 과정, 강아지 반응, 개선점 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  운동 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 운동 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.type}</p>
                          <p className="text-sm text-gray-600">
                            {record.date} - {record.duration}분
                          </p>
                          {record.heartRate > 0 && (
                            <p className="text-sm text-gray-600">심박수: {record.heartRate} BPM</p>
                          )}
                          {record.distance > 0 && (
                            <p className="text-sm text-gray-600">거리: {record.distance} km</p>
                          )}
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${getIntensityColor(record.intensity)}`}>
                            강도 {record.intensity} ({getIntensityLabel(record.intensity)})
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏃‍♂️ 운동 강도 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지의 체력에 맞는 강도로 운동하세요</li>
                <li>• 점진적으로 강도를 높이세요</li>
                <li>• 충분한 휴식을 제공하세요</li>
                <li>• 강아지의 반응을 주의 깊게 관찰하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 운동은 건강에 해로울 수 있습니다</li>
                <li>• 강아지가 힘들어하면 즉시 중단하세요</li>
                <li>• 날씨와 환경을 고려하세요</li>
                <li>• 수의사와 상담하여 적절한 운동량을 결정하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
