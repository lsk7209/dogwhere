'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface CommunicationTask {
  id: string
  name: string
  description: string
  category: 'body' | 'vocal' | 'behavior' | 'emotion' | 'training'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface CommunicationRecord {
  id: string
  date: string
  task: string
  dogBehavior: string
  humanResponse: string
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogCommunicationGuidePage() {
  const [tasks, setTasks] = useState<CommunicationTask[]>([])
  const [records, setRecords] = useState<CommunicationRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    dogBehavior: '',
    humanResponse: '',
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: CommunicationTask[] = [
    {
      id: '1',
      name: '몸짓 언어 이해하기',
      description: '강아지의 몸짓과 자세로 의사소통하는 방법',
      category: 'body',
      importance: 'high',
      steps: [
        '꼬리 움직임 관찰하기',
        '귀 위치 확인하기',
        '눈빛과 표정 읽기',
        '몸 전체 자세 파악하기'
      ],
      tips: [
        '강아지가 편안해하는 신호를 찾으세요',
        '과도한 자극을 피하세요',
        '정기적으로 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '소리로 소통하기',
      description: '강아지의 소리와 울음소리로 의사소통하는 방법',
      category: 'vocal',
      importance: 'high',
      steps: [
        '다양한 소리 구분하기',
        '소리의 의미 파악하기',
        '적절한 반응하기',
        '소통 패턴 만들기'
      ],
      tips: [
        '강아지가 편안해하는 소리를 찾으세요',
        '과도한 소음을 피하세요',
        '정기적으로 소통하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '행동 패턴 이해하기',
      description: '강아지의 행동 패턴으로 의사소통하는 방법',
      category: 'behavior',
      importance: 'high',
      steps: [
        '일상 행동 관찰하기',
        '행동 변화 감지하기',
        '행동의 의미 파악하기',
        '적절한 대응하기'
      ],
      tips: [
        '강아지가 편안해하는 행동을 찾으세요',
        '과도한 간섭을 피하세요',
        '정기적으로 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '감정 상태 파악하기',
      description: '강아지의 감정 상태를 파악하고 소통하는 방법',
      category: 'emotion',
      importance: 'high',
      steps: [
        '감정 표현 관찰하기',
        '감정 변화 감지하기',
        '감정에 맞는 대응하기',
        '감정 안정시키기'
      ],
      tips: [
        '강아지가 편안해하는 감정을 찾으세요',
        '과도한 감정 자극을 피하세요',
        '정기적으로 감정을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '기본 명령어 훈련',
      description: '강아지와 기본 명령어로 소통하는 방법',
      category: 'training',
      importance: 'high',
      steps: [
        '기본 명령어 선택하기',
        '일관된 명령어 사용하기',
        '보상 시스템 구축하기',
        '정기적인 훈련하기'
      ],
      tips: [
        '강아지가 편안해하는 명령어를 찾으세요',
        '과도한 훈련을 피하세요',
        '정기적으로 훈련하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '눈빛으로 소통하기',
      description: '강아지와 눈빛으로 의사소통하는 방법',
      category: 'body',
      importance: 'medium',
      steps: [
        '적절한 눈 접촉하기',
        '눈빛의 의미 파악하기',
        '눈빛으로 반응하기',
        '눈빛 소통 패턴 만들기'
      ],
      tips: [
        '강아지가 편안해하는 눈 접촉을 찾으세요',
        '과도한 눈 접촉을 피하세요',
        '정기적으로 눈빛을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '터치로 소통하기',
      description: '강아지와 터치로 의사소통하는 방법',
      category: 'body',
      importance: 'medium',
      steps: [
        '적절한 터치 방법 찾기',
        '터치의 의미 전달하기',
        '터치로 반응하기',
        '터치 소통 패턴 만들기'
      ],
      tips: [
        '강아지가 편안해하는 터치를 찾으세요',
        '과도한 터치를 피하세요',
        '정기적으로 터치하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '놀이로 소통하기',
      description: '강아지와 놀이를 통해 의사소통하는 방법',
      category: 'behavior',
      importance: 'medium',
      steps: [
        '적절한 놀이 방법 찾기',
        '놀이의 의미 전달하기',
        '놀이로 반응하기',
        '놀이 소통 패턴 만들기'
      ],
      tips: [
        '강아지가 편안해하는 놀이를 찾으세요',
        '과도한 놀이를 피하세요',
        '정기적으로 놀이하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('communicationTasks')
    const savedRecords = localStorage.getItem('communicationRecords')
    
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
      localStorage.setItem('communicationTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('communicationRecords', JSON.stringify(records))
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

    const record: CommunicationRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      dogBehavior: '',
      humanResponse: '',
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'body': return 'text-blue-600 bg-blue-100'
      case 'vocal': return 'text-green-600 bg-green-100'
      case 'behavior': return 'text-purple-600 bg-purple-100'
      case 'emotion': return 'text-pink-600 bg-pink-100'
      case 'training': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'body': return '몸짓'
      case 'vocal': return '소리'
      case 'behavior': return '행동'
      case 'emotion': return '감정'
      case 'training': return '훈련'
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
            <MessageCircle className="w-10 h-10 text-blue-600 mr-3" />
            반려견 소통 가이드
          </h1>
          <p className="text-xl text-gray-600">강아지의 몸짓과 소리로 의사소통하는 방법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">소통 방법</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 방법</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceTasks}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 소통</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">소통 방법</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">소통 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관찰 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소통 방법</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">방법 선택</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.name}>
                          {task.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">강아지 행동</label>
                  <textarea
                    value={newRecord.dogBehavior}
                    onChange={(e) => setNewRecord({...newRecord, dogBehavior: e.target.value})}
                    rows={2}
                    placeholder="강아지가 보인 행동이나 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사람의 반응</label>
                  <textarea
                    value={newRecord.humanResponse}
                    onChange={(e) => setNewRecord({...newRecord, humanResponse: e.target.value})}
                    rows={2}
                    placeholder="사람이 한 반응이나 행동"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소통 결과</label>
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  소통 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 소통 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            강아지: {record.dogBehavior} • 사람: {record.humanResponse}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">💬 반려견 소통 가이드 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 소통 방법을 찾으세요</li>
                <li>• 일관성 있게 소통하세요</li>
                <li>• 정기적으로 소통하세요</li>
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