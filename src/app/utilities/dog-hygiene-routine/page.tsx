'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Droplets, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface HygieneTask {
  id: string
  name: string
  description: string
  category: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special'
  importance: 'high' | 'medium' | 'low'
  frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface HygieneRecord {
  id: string
  date: string
  task: string
  duration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogHygieneRoutinePage() {
  const [tasks, setTasks] = useState<HygieneTask[]>([])
  const [records, setRecords] = useState<HygieneRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    duration: 15,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: HygieneTask[] = [
    {
      id: '1',
      name: '일일 위생 관리',
      description: '매일 해야 하는 기본 위생 관리',
      category: 'daily',
      importance: 'high',
      frequency: 'daily',
      steps: [
        '강아지 몸 상태 확인하기',
        '기본 위생 관리하기',
        '위생 관리 후 정리하기',
        '위생 관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 위생을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '주간 위생 관리',
      description: '주간에 해야 하는 위생 관리',
      category: 'weekly',
      importance: 'high',
      frequency: 'weekly',
      steps: [
        '강아지 몸 상태 확인하기',
        '주간 위생 관리하기',
        '위생 관리 후 정리하기',
        '위생 관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 위생을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '월간 위생 관리',
      description: '월간에 해야 하는 위생 관리',
      category: 'monthly',
      importance: 'medium',
      frequency: 'monthly',
      steps: [
        '강아지 몸 상태 확인하기',
        '월간 위생 관리하기',
        '위생 관리 후 정리하기',
        '위생 관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 위생을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '계절별 위생 관리',
      description: '계절에 따라 해야 하는 위생 관리',
      category: 'seasonal',
      importance: 'medium',
      frequency: 'seasonal',
      steps: [
        '계절별 위생 관리 계획 세우기',
        '계절별 위생 관리하기',
        '위생 관리 후 정리하기',
        '위생 관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 위생을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '특별 위생 관리',
      description: '특별한 상황에서 해야 하는 위생 관리',
      category: 'special',
      importance: 'high',
      frequency: 'daily',
      steps: [
        '특별 상황 파악하기',
        '특별 위생 관리하기',
        '위생 관리 후 정리하기',
        '위생 관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 위생을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '위생 도구 관리',
      description: '위생 관리에 필요한 도구를 관리하는 방법',
      category: 'daily',
      importance: 'medium',
      frequency: 'daily',
      steps: [
        '위생 도구 준비하기',
        '위생 도구 사용하기',
        '위생 도구 정리하기',
        '위생 도구 관리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 도구를 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 도구를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '위생 환경 조성',
      description: '위생 관리에 적합한 환경을 조성하는 방법',
      category: 'daily',
      importance: 'medium',
      frequency: 'daily',
      steps: [
        '위생 환경 파악하기',
        '위생 환경 조성하기',
        '위생 환경 유지하기',
        '위생 환경 정리하기'
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
      id: '8',
      name: '위생 문제 해결',
      description: '위생 관련 문제를 해결하는 방법',
      category: 'special',
      importance: 'high',
      frequency: 'daily',
      steps: [
        '위생 문제 파악하기',
        '위생 문제 원인 찾기',
        '위생 문제 해결하기',
        '위생 문제 해결 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 문제를 해결하세요',
        '과도한 자극을 피하세요',
        '정기적으로 문제를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('hygieneTasks')
    const savedRecords = localStorage.getItem('hygieneRecords')
    
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
      localStorage.setItem('hygieneTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('hygieneRecords', JSON.stringify(records))
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

    const record: HygieneRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      duration: 15,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'text-red-600 bg-red-100'
      case 'weekly': return 'text-blue-600 bg-blue-100'
      case 'monthly': return 'text-green-600 bg-green-100'
      case 'seasonal': return 'text-purple-600 bg-purple-100'
      case 'special': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'daily': return '일일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'seasonal': return '계절별'
      case 'special': return '특별'
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'seasonal': return '계절별'
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
            <Droplets className="w-10 h-10 text-blue-600 mr-3" />
            위생 관리 루틴
          </h1>
          <p className="text-xl text-gray-600">일상적인 위생 관리 방법과 주기</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">위생 관리</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 관리</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">위생 관리</h2>
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
                          <span className="text-blue-600">{getFrequencyText(task.frequency)}</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">위생 관리 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 종류</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">관리 선택</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 결과</label>
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
                    placeholder="위생 관리 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  위생 관리 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 위생 관리 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}분
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

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💧 위생 관리 루틴 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 관리하세요</li>
                <li>• 일관성 있게 관리하세요</li>
                <li>• 정기적으로 위생을 관리하세요</li>
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