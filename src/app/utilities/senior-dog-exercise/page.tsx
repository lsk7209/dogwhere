'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface ExerciseTask {
  id: string
  name: string
  description: string
  category: 'cardio' | 'strength' | 'flexibility' | 'mental' | 'social'
  intensity: 'low' | 'medium' | 'high'
  duration: number
  frequency: 'daily' | 'weekly' | 'monthly'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface ExerciseRecord {
  id: string
  date: string
  task: string
  duration: number
  intensity: 'low' | 'medium' | 'high'
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function SeniorDogExercisePage() {
  const [tasks, setTasks] = useState<ExerciseTask[]>([])
  const [records, setRecords] = useState<ExerciseRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    duration: 15,
    intensity: 'low' as 'low' | 'medium' | 'high',
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: ExerciseTask[] = [
    {
      id: '1',
      name: '부드러운 산책',
      description: '노령견을 위한 부드러운 산책',
      category: 'cardio',
      intensity: 'low',
      duration: 15,
      frequency: 'daily',
      steps: [
        '적절한 산책 코스 선택',
        '산책 전 준비 운동',
        '부드럽게 걷기',
        '산책 후 정리 운동'
      ],
      tips: [
        '강아지가 편안해하는 속도로 걷기',
        '과도한 운동을 피하기',
        '정기적으로 산책하기',
        '필요시 전문가의 도움 받기'
      ],
      completed: false
    },
    {
      id: '2',
      name: '수영',
      description: '관절에 부담이 적은 수영',
      category: 'cardio',
      intensity: 'low',
      duration: 10,
      frequency: 'weekly',
      steps: [
        '안전한 수영장 선택',
        '수영 전 준비 운동',
        '부드럽게 수영하기',
        '수영 후 정리 운동'
      ],
      tips: [
        '강아지가 편안해하는 수영장을 선택하세요',
        '과도한 수영을 피하세요',
        '정기적으로 수영하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '스트레칭',
      description: '근육 이완과 유연성 향상',
      category: 'flexibility',
      intensity: 'low',
      duration: 10,
      frequency: 'daily',
      steps: [
        '안전한 스트레칭 자세',
        '점진적으로 스트레칭',
        '호흡 조절하기',
        '스트레칭 후 정리'
      ],
      tips: [
        '강아지가 편안해하는 스트레칭을 선택하세요',
        '과도한 스트레칭을 피하세요',
        '정기적으로 스트레칭하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '정신 자극 놀이',
      description: '정신적 자극을 위한 놀이',
      category: 'mental',
      intensity: 'low',
      duration: 15,
      frequency: 'daily',
      steps: [
        '적절한 놀이 도구 선택',
        '놀이 방법 설명하기',
        '점진적으로 놀이하기',
        '놀이 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 놀이를 선택하세요',
        '과도한 놀이를 피하세요',
        '정기적으로 놀이하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '사회화 활동',
      description: '다른 강아지와의 부드러운 만남',
      category: 'social',
      intensity: 'low',
      duration: 20,
      frequency: 'weekly',
      steps: [
        '안전한 만남 장소 선택',
        '다른 강아지와 만나기',
        '부드러운 상호작용하기',
                        '만남 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 만남을 선택하세요',
        '과도한 사회화를 피하세요',
        '정기적으로 사회화하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '근력 운동',
      description: '근력 유지를 위한 부드러운 운동',
      category: 'strength',
      intensity: 'low',
      duration: 10,
      frequency: 'daily',
      steps: [
        '안전한 근력 운동 선택',
        '점진적으로 운동하기',
        '근력 운동하기',
        '운동 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 근력 운동을 선택하세요',
        '과도한 근력 운동을 피하세요',
        '정기적으로 근력 운동하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '균형 운동',
      description: '균형 감각 유지를 위한 운동',
      category: 'flexibility',
      intensity: 'low',
      duration: 10,
      frequency: 'daily',
      steps: [
        '안전한 균형 운동 선택',
        '점진적으로 운동하기',
        '균형 운동하기',
        '운동 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 균형 운동을 선택하세요',
        '과도한 균형 운동을 피하세요',
        '정기적으로 균형 운동하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '호흡 운동',
      description: '호흡 기능 향상을 위한 운동',
      category: 'cardio',
      intensity: 'low',
      duration: 10,
      frequency: 'daily',
      steps: [
        '안전한 호흡 운동 선택',
        '점진적으로 운동하기',
        '호흡 운동하기',
        '운동 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 호흡 운동을 선택하세요',
        '과도한 호흡 운동을 피하세요',
        '정기적으로 호흡 운동하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('seniorExerciseTasks')
    const savedRecords = localStorage.getItem('seniorExerciseRecords')
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        setTasks(initialTasks)
      }
    } else {
      setTasks(initialTasks)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('seniorExerciseTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('seniorExerciseRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            date: !task.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : task
    ))
  }

  const addRecord = () => {
    if (!newRecord.task) return

    const record: ExerciseRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      duration: 15,
      intensity: 'low',
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardio': return 'text-red-600 bg-red-100'
      case 'strength': return 'text-blue-600 bg-blue-100'
      case 'flexibility': return 'text-green-600 bg-green-100'
      case 'mental': return 'text-purple-600 bg-purple-100'
      case 'social': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'cardio': return '유산소'
      case 'strength': return '근력'
      case 'flexibility': return '유연성'
      case 'mental': return '정신'
      case 'social': return '사회성'
      default: return category
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getIntensityText = (intensity: string) => {
    switch (intensity) {
      case 'low': return '낮음'
      case 'medium': return '보통'
      case 'high': return '높음'
      default: return intensity
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

  const getResultColor = (result: string) => {
    switch (result) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return result
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const lowIntensityTasks = tasks.filter(task => task.intensity === 'low').length
  const excellentRecords = records.filter(record => record.result === 'excellent').length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-10 h-10 text-green-600 mr-3" />
            노령견 운동 가이드
          </h1>
          <p className="text-xl text-gray-600">노령견을 위한 안전한 운동 방법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">운동 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{lowIntensityTasks}개</p>
            <p className="text-sm text-gray-600">저강도 운동</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 계획</h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(task.category)}`}>
                            {getCategoryText(task.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getIntensityColor(task.intensity)}`}>
                            {getIntensityText(task.intensity)}
                          </span>
                          <span className="text-blue-600">{task.duration}분</span>
                          <span className="text-purple-600">{getFrequencyText(task.frequency)}</span>
                          {task.date && (
                            <span className="text-green-600">완료: {task.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">단계</h4>
                        <ol className="text-sm text-gray-600 space-y-1">
                          {task.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {task.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 종류</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">운동 선택</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.name}>
                          {task.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="60"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 강도</label>
                    <select
                      value={newRecord.intensity}
                      onChange={(e) => setNewRecord({...newRecord, intensity: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 결과</label>
                    <select
                      value={newRecord.result}
                      onChange={(e) => setNewRecord({...newRecord, result: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="excellent">매우 좋음</option>
                      <option value="good">좋음</option>
                      <option value="fair">보통</option>
                      <option value="poor">나쁨</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                    <input
                      type="text"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                      placeholder="추가 메모"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
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
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}분 • {getIntensityText(record.intensity)} 강도
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getResultColor(record.result)}`}>
                          {getResultText(record.result)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏃‍♂️ 노령견 운동 가이드 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 운동을 선택하세요</li>
                <li>• 일관성 있게 운동하세요</li>
                <li>• 정기적으로 운동하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 운동을 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 이상 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}