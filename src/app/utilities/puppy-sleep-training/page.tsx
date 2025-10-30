'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface SleepTrainingTask {
  id: string
  name: string
  description: string
  category: 'routine' | 'environment' | 'comfort' | 'independence' | 'problem_solving'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface SleepTrainingRecord {
  id: string
  date: string
  task: string
  sleepDuration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function PuppySleepTrainingPage() {
  const [tasks, setTasks] = useState<SleepTrainingTask[]>([])
  const [records, setRecords] = useState<SleepTrainingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    sleepDuration: 8,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: SleepTrainingTask[] = [
    {
      id: '1',
      name: '수면 루틴 만들기',
      description: '강아지가 규칙적으로 잠들 수 있는 루틴 만들기',
      category: 'routine',
      importance: 'high',
      steps: [
        '수면 시간 정하기',
        '수면 전 활동 정하기',
        '수면 루틴 만들기',
        '수면 루틴 유지하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 루틴을 만드세요',
        '과도한 자극을 피하세요',
        '정기적으로 루틴을 유지하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '수면 환경 조성',
      description: '강아지가 편안하게 잠들 수 있는 환경 만들기',
      category: 'environment',
      importance: 'high',
      steps: [
        '수면 공간 만들기',
        '수면 환경 조성하기',
        '수면 환경 유지하기',
        '수면 환경 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 환경을 조성하세요',
        '과도한 자극을 피하세요',
        '정기적으로 환경을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '편안한 침구 준비',
      description: '강아지가 편안하게 잠들 수 있는 침구 준비하기',
      category: 'comfort',
      importance: 'high',
      steps: [
        '적절한 침구 선택하기',
        '침구 배치하기',
        '침구 관리하기',
        '침구 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 침구를 준비하세요',
        '과도한 자극을 피하세요',
        '정기적으로 침구를 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '혼자 잠들기 훈련',
      description: '강아지가 혼자서도 편안하게 잠들 수 있도록 훈련하기',
      category: 'independence',
      importance: 'high',
      steps: [
        '혼자 잠들기 훈련 시작하기',
        '점진적으로 혼자 잠들기 연습하기',
        '혼자 잠들기 훈련 강화하기',
        '혼자 잠들기 훈련 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 훈련하세요',
        '과도한 자극을 피하세요',
        '정기적으로 훈련하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '수면 문제 해결',
      description: '강아지의 수면 문제를 해결하는 방법',
      category: 'problem_solving',
      importance: 'medium',
      steps: [
        '수면 문제 파악하기',
        '수면 문제 원인 찾기',
        '수면 문제 해결하기',
        '수면 문제 해결 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 문제를 해결하세요',
        '과도한 자극을 피하세요',
        '정기적으로 문제를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '수면 시간 조절',
      description: '강아지의 수면 시간을 적절히 조절하는 방법',
      category: 'routine',
      importance: 'medium',
      steps: [
        '수면 시간 파악하기',
        '수면 시간 조절하기',
        '수면 시간 유지하기',
        '수면 시간 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 시간을 조절하세요',
        '과도한 자극을 피하세요',
        '정기적으로 시간을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '수면 중 깨우기 방지',
      description: '강아지가 수면 중 깨지 않도록 하는 방법',
      category: 'environment',
      importance: 'medium',
      steps: [
        '수면 방해 요소 제거하기',
        '수면 환경 조성하기',
        '수면 중 깨우기 방지하기',
        '수면 환경 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 방지하세요',
        '과도한 자극을 피하세요',
        '정기적으로 환경을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '수면 품질 향상',
      description: '강아지의 수면 품질을 향상시키는 방법',
      category: 'comfort',
      importance: 'low',
      steps: [
        '수면 품질 파악하기',
        '수면 품질 향상 방법 찾기',
        '수면 품질 향상 적용하기',
        '수면 품질 향상 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 품질을 향상시키세요',
        '과도한 자극을 피하세요',
        '정기적으로 품질을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('sleepTrainingTasks')
    const savedRecords = localStorage.getItem('sleepTrainingRecords')
    
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
      localStorage.setItem('sleepTrainingTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('sleepTrainingRecords', JSON.stringify(records))
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

    const record: SleepTrainingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      sleepDuration: 8,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'routine': return 'text-blue-600 bg-blue-100'
      case 'environment': return 'text-green-600 bg-green-100'
      case 'comfort': return 'text-purple-600 bg-purple-100'
      case 'independence': return 'text-orange-600 bg-orange-100'
      case 'problem_solving': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'routine': return '루틴'
      case 'environment': return '환경'
      case 'comfort': return '편안함'
      case 'independence': return '독립성'
      case 'problem_solving': return '문제해결'
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
  const highImportanceTasks = tasks.filter(task => task.importance === 'high').length
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
            <Moon className="w-10 h-10 text-purple-600 mr-3" />
            강아지 수면 훈련
          </h1>
          <p className="text-xl text-gray-600">강아지의 규칙적인 수면 패턴 형성</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">훈련 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceTasks}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 훈련 단계</h2>
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
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(task.importance)}`}>
                            {getImportanceText(task.importance)}
                          </span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 훈련 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 단계</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">단계 선택</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 시간 (시간)</label>
                    <input
                      type="number"
                      value={newRecord.sleepDuration}
                      onChange={(e) => setNewRecord({...newRecord, sleepDuration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="24"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 결과</label>
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="수면 훈련 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  훈련 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 수면 훈련 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            수면 시간: {record.sleepDuration}시간
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

        <div className="bg-purple-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌙 강아지 수면 훈련 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 훈련하세요</li>
                <li>• 일관성 있게 훈련하세요</li>
                <li>• 정기적으로 훈련하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 자극을 피하세요</li>
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