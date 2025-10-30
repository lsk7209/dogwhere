'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react'

interface NailTrimmingTask {
  id: string
  name: string
  description: string
  category: 'preparation' | 'trimming' | 'safety' | 'aftercare' | 'tools'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface NailTrimmingRecord {
  id: string
  date: string
  task: string
  nailsTrimmed: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogNailTrimmingPage() {
  const [tasks, setTasks] = useState<NailTrimmingTask[]>([])
  const [records, setRecords] = useState<NailTrimmingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    nailsTrimmed: 0,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: NailTrimmingTask[] = [
    {
      id: '1',
      name: '발톱 상태 확인',
      description: '강아지 발톱 상태를 확인하고 관리 계획 세우기',
      category: 'preparation',
      importance: 'high',
      steps: [
        '강아지 발톱 길이 확인하기',
        '발톱 상태 점검하기',
        '관리 계획 세우기',
        '필요한 도구 준비하기'
      ],
      tips: [
        '강아지가 편안해하는 상태에서 확인하세요',
        '과도한 자극을 피하세요',
        '정기적으로 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '발톱 깎기 도구 준비',
      description: '안전한 발톱 깎기 도구 준비하기',
      category: 'tools',
      importance: 'high',
      steps: [
        '적절한 발톱 깎기 도구 선택',
        '도구 상태 확인하기',
        '도구 소독하기',
        '도구 정리하기'
      ],
      tips: [
        '강아지 전용 발톱 깎이를 사용하세요',
        '과도한 도구를 사용하지 마세요',
        '정기적으로 도구를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '강아지 안정시키기',
      description: '발톱 깎기 전 강아지를 안정시키기',
      category: 'preparation',
      importance: 'high',
      steps: [
        '강아지가 편안한 자세로 앉히기',
        '강아지 진정시키기',
        '발톱 접근하기',
        '안정적인 자세 유지하기'
      ],
      tips: [
        '강아지가 편안해하는 자세를 찾으세요',
        '과도한 자극을 피하세요',
        '정기적으로 안정시키세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '발톱 깎기',
      description: '안전하게 발톱 깎기',
      category: 'trimming',
      importance: 'high',
      steps: [
        '발톱 끝부분 확인하기',
        '조심스럽게 발톱 깎기',
        '과도한 깎기 피하기',
        '깎은 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 깎으세요',
        '과도한 깎기를 피하세요',
        '정기적으로 발톱을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '발톱 다듬기',
      description: '깎은 발톱을 다듬고 정리하기',
      category: 'trimming',
      importance: 'medium',
      steps: [
        '깎은 발톱 확인하기',
        '발톱 다듬기',
        '부드럽게 정리하기',
        '다듬기 후 확인하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 다듬으세요',
        '과도한 다듬기를 피하세요',
        '정기적으로 발톱을 다듬으세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '안전 확인',
      description: '발톱 깎기 후 안전 상태 확인하기',
      category: 'safety',
      importance: 'high',
      steps: [
        '발톱 상태 확인하기',
        '상처 여부 확인하기',
        '강아지 반응 확인하기',
        '안전 상태 점검하기'
      ],
      tips: [
        '강아지가 편안해하는 상태에서 확인하세요',
        '과도한 확인을 피하세요',
        '정기적으로 안전을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '발톱 관리 후 정리',
      description: '발톱 관리 후 정리하고 마무리하기',
      category: 'aftercare',
      importance: 'medium',
      steps: [
        '사용한 도구 정리하기',
        '강아지 발톱 상태 확인하기',
        '강아지 칭찬하기',
        '관리 기록하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 정리하세요',
        '과도한 정리를 피하세요',
        '정기적으로 정리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '응급상황 대비',
      description: '발톱 깎기 중 응급상황 대비하기',
      category: 'safety',
      importance: 'high',
      steps: [
        '응급상황 대비 계획 세우기',
        '응급상황 대응 방법 숙지하기',
                        '응급상황 발생 시 대응하기',
                        '응급상황 후 정리하기'
      ],
      tips: [
        '강아지가 안전한 방법으로 대비하세요',
        '과도한 대비를 피하세요',
        '정기적으로 응급상황을 대비하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('nailTrimmingTasks')
    const savedRecords = localStorage.getItem('nailTrimmingRecords')
    
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
      localStorage.setItem('nailTrimmingTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('nailTrimmingRecords', JSON.stringify(records))
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

    const record: NailTrimmingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      nailsTrimmed: 0,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preparation': return 'text-blue-600 bg-blue-100'
      case 'trimming': return 'text-green-600 bg-green-100'
      case 'safety': return 'text-red-600 bg-red-100'
      case 'aftercare': return 'text-purple-600 bg-purple-100'
      case 'tools': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'preparation': return '준비'
      case 'trimming': return '깎기'
      case 'safety': return '안전'
      case 'aftercare': return '후처리'
      case 'tools': return '도구'
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
            <Scissors className="w-10 h-10 text-purple-600 mr-3" />
            발톱 관리 가이드
          </h1>
          <p className="text-xl text-gray-600">강아지 발톱 자르기 방법과 주기</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Scissors className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">관리 단계</p>
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
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">발톱 관리 단계</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">발톱 관리 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 단계</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">깎은 발톱 수</label>
                    <input
                      type="number"
                      value={newRecord.nailsTrimmed}
                      onChange={(e) => setNewRecord({...newRecord, nailsTrimmed: parseInt(e.target.value) || 0})}
                      min="0"
                      max="20"
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
                    placeholder="발톱 관리 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  관리 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 발톱 관리 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            깎은 발톱: {record.nailsTrimmed}개
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">✂️ 발톱 관리 가이드 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 관리하세요</li>
                <li>• 일관성 있게 관리하세요</li>
                <li>• 정기적으로 발톱을 관리하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 깎기를 피하세요</li>
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