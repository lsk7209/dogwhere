'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock, Users, Heart } from 'lucide-react'

interface SocializationTask {
  id: string
  week: number
  title: string
  description: string
  category: string
  completed: boolean
  tips: string[]
  importance: 'high' | 'medium' | 'low'
}

interface SocializationRecord {
  id: string
  taskId: string
  date: string
  success: boolean
  notes: string
  duration: number
}

export default function PuppySocializationSchedulePage() {
  const [tasks, setTasks] = useState<SocializationTask[]>([])
  const [records, setRecords] = useState<SocializationRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    success: true,
    notes: '',
    duration: 0
  })

  const socializationTasks: SocializationTask[] = [
    // 8-12주 (2-3개월)
    {
      id: '1',
      week: 8,
      title: '가족과의 첫 만남',
      description: '가족 구성원들과의 첫 접촉과 신뢰 관계 형성',
      category: '사람',
      completed: false,
      tips: [
        '조용하고 안전한 환경에서 만나기',
        '강아지가 먼저 다가오도록 기다리기',
        '부드럽고 낮은 목소리로 말하기'
      ],
      importance: 'high'
    },
    {
      id: '2',
      week: 9,
      title: '집안 환경 탐험',
      description: '새로운 집의 다양한 공간과 소리에 익숙해지기',
      category: '환경',
      completed: false,
      tips: [
        '한 번에 하나씩 방을 소개하기',
        '강아지가 불안해하면 즉시 중단',
        '긍정적인 경험으로 마무리하기'
      ],
      importance: 'high'
    },
    {
      id: '3',
      week: 10,
      title: '다양한 소리 경험',
      description: '일상적인 소리들에 익숙해지기',
      category: '소리',
      completed: false,
      tips: [
        'TV, 전화벨, 진공청소기 소리',
        '점진적으로 소리 크기 늘리기',
        '불안해하면 즉시 중단하기'
      ],
      importance: 'medium'
    },
    {
      id: '4',
      week: 11,
      title: '다양한 표면 경험',
      description: '다양한 바닥 재질에 익숙해지기',
      category: '환경',
      completed: false,
      tips: [
        '카펫, 타일, 나무 바닥 등',
        '강아지가 자유롭게 탐험하도록 하기',
        '긍정적인 보상 제공하기'
      ],
      importance: 'medium'
    },
    {
      id: '5',
      week: 12,
      title: '다양한 사람들과 만나기',
      description: '가족 외 다른 사람들과의 접촉',
      category: '사람',
      completed: false,
      tips: [
        '한 번에 한 명씩 소개하기',
        '강아지가 편안해하는 사람부터',
        '무리하게 만나지 않기'
      ],
      importance: 'high'
    },
    // 13-16주 (3-4개월)
    {
      id: '6',
      week: 13,
      title: '다른 강아지와 만나기',
      description: '안전한 환경에서 다른 강아지와의 첫 만남',
      category: '동물',
      completed: false,
      tips: [
        '예방접종 완료 후 진행',
        '차분하고 친화적인 강아지와 만나기',
        '짧은 시간부터 시작하기'
      ],
      importance: 'high'
    },
    {
      id: '7',
      week: 14,
      title: '외출 경험',
      description: '집 밖 환경에 대한 첫 경험',
      category: '환경',
      completed: false,
      tips: [
        '조용한 곳부터 시작하기',
        '안전한 목줄과 하네스 사용',
        '짧은 시간부터 시작하기'
      ],
      importance: 'medium'
    },
    {
      id: '8',
      week: 15,
      title: '다양한 나이대 사람들과 만나기',
      description: '어린이, 노인 등 다양한 연령대와의 접촉',
      category: '사람',
      completed: false,
      tips: [
        '조용하고 차분한 어린이부터',
        '강아지가 편안해하는 거리 유지',
        '긍정적인 경험으로 마무리'
      ],
      importance: 'high'
    },
    {
      id: '9',
      week: 16,
      title: '다양한 환경에서 산책',
      description: '공원, 거리 등 다양한 환경에서의 산책',
      category: '환경',
      completed: false,
      tips: [
        '점진적으로 새로운 장소 탐험',
        '강아지의 반응을 주의 깊게 관찰',
        '불안해하면 즉시 안전한 곳으로'
      ],
      importance: 'medium'
    },
    // 17-20주 (4-5개월)
    {
      id: '10',
      week: 17,
      title: '다양한 동물들과 만나기',
      description: '고양이, 새 등 다른 동물들과의 접촉',
      category: '동물',
      completed: false,
      tips: [
        '안전한 환경에서 진행',
        '강아지가 흥분하지 않도록 주의',
        '짧은 시간부터 시작하기'
      ],
      importance: 'medium'
    },
    {
      id: '11',
      week: 18,
      title: '다양한 소리와 상황 경험',
      description: '자동차, 비행기, 공사장 소리 등',
      category: '소리',
      completed: false,
      tips: [
        '거리를 두고 점진적으로 접근',
        '강아지가 불안해하면 즉시 중단',
        '긍정적인 보상으로 마무리'
      ],
      importance: 'medium'
    },
    {
      id: '12',
      week: 19,
      title: '다양한 사람들과의 상호작용',
      description: '낯선 사람들과의 자연스러운 만남',
      category: '사람',
      completed: false,
      tips: [
        '강아지가 먼저 다가오도록 기다리기',
        '무리하게 만나지 않기',
        '긍정적인 경험으로 마무리'
      ],
      importance: 'high'
    },
    {
      id: '13',
      week: 20,
      title: '다양한 환경에서의 활동',
      description: '카페, 쇼핑몰 등 다양한 공간에서의 활동',
      category: '환경',
      completed: false,
      tips: [
        '강아지 친화적인 장소부터',
        '짧은 시간부터 시작하기',
        '강아지의 스트레스 신호 주의'
      ],
      importance: 'medium'
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('socializationTasks')
    const savedRecords = localStorage.getItem('socializationRecords')
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        setTasks(socializationTasks)
      }
    } else {
      setTasks(socializationTasks)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('socializationTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('socializationRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const addRecord = () => {
    if (!newRecord.taskId || !newRecord.date) return

    const record: SocializationRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      taskId: '',
      date: new Date().toISOString().split('T')[0],
      success: true,
      notes: '',
      duration: 0
    })
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '사람': return '👥'
      case '환경': return '🏠'
      case '소리': return '🔊'
      case '동물': return '🐕'
      default: return '📝'
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-10 h-10 text-blue-600 mr-3" />
            강아지 사회화 일정표
          </h1>
          <p className="text-xl text-gray-600">강아지 사회화 단계별 일정과 체크리스트를 제공합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">총 과제</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 과제</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{progressPercentage}%</p>
            <p className="text-sm text-gray-600">진행률</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{records.length}회</p>
            <p className="text-sm text-gray-600">훈련 기록</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 과제</h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.week}주차 • {task.category}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{task.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800">팁:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {task.tips.map((tip, index) => (
                              <li key={index} className="text-sm text-gray-600">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(task.importance)}`}>
                          {getImportanceText(task.importance)}
                        </span>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 기록</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">과제 선택</label>
                  <select
                    value={newRecord.taskId}
                    onChange={(e) => setNewRecord({...newRecord, taskId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">과제 선택</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.week}주차 - {task.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 시간 (분)</label>
                    <input
                      type="number"
                      min="0"
                      value={newRecord.duration || ''}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성공 여부</label>
                  <select
                    value={newRecord.success.toString()}
                    onChange={(e) => setNewRecord({...newRecord, success: e.target.value === 'true'})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="true">성공</option>
                    <option value="false">실패</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="훈련 과정이나 결과에 대한 기록"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 기록</h3>
                  {records.slice(0, 5).map((record) => {
                    const task = tasks.find(t => t.id === record.taskId)
                    return (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {task ? `${task.week}주차 - ${task.title}` : '알 수 없는 과제'}
                            </p>
                            <p className="text-sm text-gray-600">{record.date} • {record.duration}분</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            record.success 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.success ? '성공' : '실패'}
                          </span>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 사회화 성공 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지가 불안해하면 즉시 중단하고 안전한 곳으로 이동하세요</li>
            <li>• 긍정적인 경험으로 마무리하는 것이 중요합니다</li>
            <li>• 강아지의 페이스에 맞춰 천천히 진행하세요</li>
            <li>• 일관성 있는 훈련이 성공의 열쇠입니다</li>
            <li>• 전문가와 상담하여 맞춤형 사회화 계획을 세우세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
