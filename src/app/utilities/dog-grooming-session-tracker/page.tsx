'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react'

interface GroomingSession {
  id: string
  date: string
  type: string
  duration: number
  quality: number
  notes: string
  completed: boolean
}

interface GroomingTask {
  id: string
  name: string
  description: string
  category: 'bath' | 'brush' | 'nail' | 'ear' | 'dental' | 'other'
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed'
  lastDone: string
  nextDue: string
  completed: boolean
}

export default function DogGroomingSessionTrackerPage() {
  const [sessions, setSessions] = useState<GroomingSession[]>([])
  const [tasks, setTasks] = useState<GroomingTask[]>([])
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 30,
    quality: 5,
    notes: '',
    completed: false
  })
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    category: 'bath' as 'bath' | 'brush' | 'nail' | 'ear' | 'dental' | 'other',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'as_needed'
  })

  const groomingTypes = [
    '목욕',
    '빗질',
    '발톱 관리',
    '귀 청소',
    '치아 관리',
    '털 정리',
    '발가락 털 정리',
    '항문낭 짜기',
    '눈 주변 정리',
    '기타'
  ]

  const initialTasks: GroomingTask[] = [
    {
      id: '1',
      name: '목욕',
      description: '강아지 목욕 및 샴푸',
      category: 'bath',
      frequency: 'monthly',
      lastDone: '',
      nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '2',
      name: '빗질',
      description: '털 빗질 및 매트 제거',
      category: 'brush',
      frequency: 'weekly',
      lastDone: '',
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '3',
      name: '발톱 관리',
      description: '발톱 자르기 및 다듬기',
      category: 'nail',
      frequency: 'monthly',
      lastDone: '',
      nextDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '4',
      name: '귀 청소',
      description: '귀 안쪽 청소 및 검사',
      category: 'ear',
      frequency: 'weekly',
      lastDone: '',
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    },
    {
      id: '5',
      name: '치아 관리',
      description: '치아 브러싱 및 구강 관리',
      category: 'dental',
      frequency: 'daily',
      lastDone: '',
      nextDue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    }
  ]

  useEffect(() => {
    const savedSessions = localStorage.getItem('groomingSessions')
    const savedTasks = localStorage.getItem('groomingTasks')
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (e) {}
    }
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        setTasks(initialTasks)
      }
    } else {
      setTasks(initialTasks)
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('groomingSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('groomingTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const addSession = () => {
    if (!newSession.type) return

    const session: GroomingSession = {
      id: Date.now().toString(),
      ...newSession
    }
    setSessions([session, ...sessions])
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: 30,
      quality: 5,
      notes: '',
      completed: false
    })
  }

  const addTask = () => {
    if (!newTask.name) return

    const task: GroomingTask = {
      id: Date.now().toString(),
      ...newTask,
      lastDone: '',
      nextDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    }
    setTasks([task, ...tasks])
    setNewTask({
      name: '',
      description: '',
      category: 'bath',
      frequency: 'weekly'
    })
  }

  const completeTask = (taskId: string) => {
    const today = new Date().toISOString().split('T')[0]
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: true,
            lastDone: today,
            nextDue: getNextDueDate(task.frequency, today)
          } 
        : task
    ))
  }

  const getNextDueDate = (frequency: string, lastDone: string) => {
    const lastDate = new Date(lastDone)
    switch (frequency) {
      case 'daily':
        return new Date(lastDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      case 'weekly':
        return new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      case 'monthly':
        return new Date(lastDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      default:
        return lastDone
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bath': return 'text-blue-600 bg-blue-100'
      case 'brush': return 'text-green-600 bg-green-100'
      case 'nail': return 'text-purple-600 bg-purple-100'
      case 'ear': return 'text-yellow-600 bg-yellow-100'
      case 'dental': return 'text-pink-600 bg-pink-100'
      case 'other': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'bath': return '목욕'
      case 'brush': return '빗질'
      case 'nail': return '발톱'
      case 'ear': return '귀'
      case 'dental': return '치아'
      case 'other': return '기타'
      default: return category
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-red-600 bg-red-100'
      case 'weekly': return 'text-yellow-600 bg-yellow-100'
      case 'monthly': return 'text-green-600 bg-green-100'
      case 'as_needed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'as_needed': return '필요시'
      default: return frequency
    }
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600 bg-green-100'
    if (quality >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getQualityText = (quality: number) => {
    if (quality >= 8) return '매우 좋음'
    if (quality >= 6) return '좋음'
    if (quality >= 4) return '보통'
    return '나쁨'
  }

  const isOverdue = (nextDue: string) => {
    return new Date(nextDue) < new Date()
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(session => session.completed).length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const overdueTasks = tasks.filter(task => !task.completed && isOverdue(task.nextDue)).length
  const averageQuality = sessions.length > 0 ? sessions.reduce((sum, session) => sum + session.quality, 0) / sessions.length : 0
  const totalGroomingTime = sessions.reduce((sum, session) => sum + session.duration, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Scissors className="w-10 h-10 text-blue-600 mr-3" />
            미용 세션 추적기
          </h1>
          <p className="text-xl text-gray-600">목욕, 빗질, 발톱 관리 등 미용 세션을 기록하고 관리</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Scissors className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSessions}회</p>
            <p className="text-sm text-gray-600">미용 세션</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedSessions}회</p>
            <p className="text-sm text-gray-600">완료된 세션</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 작업</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{totalGroomingTime}분</p>
            <p className="text-sm text-gray-600">총 미용 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{overdueTasks}개</p>
            <p className="text-sm text-gray-600">연체된 작업</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">미용 작업 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">작업명</label>
                    <input
                      type="text"
                      value={newTask.name}
                      onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                      placeholder="예: 목욕"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="bath">목욕</option>
                      <option value="brush">빗질</option>
                      <option value="nail">발톱</option>
                      <option value="ear">귀</option>
                      <option value="dental">치아</option>
                      <option value="other">기타</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">빈도</label>
                    <select
                      value={newTask.frequency}
                      onChange={(e) => setNewTask({...newTask, frequency: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="daily">매일</option>
                      <option value="weekly">주간</option>
                      <option value="monthly">월간</option>
                      <option value="as_needed">필요시</option>
                    </select>
                  </div>
                  <div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows={2}
                    placeholder="작업에 대한 상세 설명"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addTask}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  미용 작업 추가
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`border-2 rounded-lg p-6 ${
                    isOverdue(task.nextDue) && !task.completed 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(task.category)}`}>
                            {getCategoryText(task.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getFrequencyColor(task.frequency)}`}>
                            {getFrequencyText(task.frequency)}
                          </span>
                          {task.lastDone && (
                            <span className="text-green-600">마지막: {task.lastDone}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {task.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <button
                            onClick={() => completeTask(task.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            완료
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>다음 예정: {task.nextDue}</p>
                      {isOverdue(task.nextDue) && !task.completed && (
                        <p className="text-red-600 font-semibold">⚠️ 연체됨</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">미용 세션 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 날짜</label>
                    <input
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 유형</label>
                    <select
                      value={newSession.type}
                      onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">미용 유형 선택</option>
                      {groomingTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 시간 (분)</label>
                    <input
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="180"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">품질 (1-10)</label>
                    <input
                      type="number"
                      value={newSession.quality}
                      onChange={(e) => setNewSession({...newSession, quality: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newSession.notes}
                    onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                    rows={3}
                    placeholder="미용 과정, 강아지 반응, 개선점 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={newSession.completed}
                    onChange={(e) => setNewSession({...newSession, completed: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="completed" className="text-sm text-gray-700">미용 완료</label>
                </div>
                <button
                  onClick={addSession}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  미용 세션 기록 추가
                </button>
              </div>

              {sessions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 미용 세션 기록</h3>
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{session.type}</p>
                          <p className="text-sm text-gray-600">{session.date} - {session.duration}분</p>
                          {session.notes && (
                            <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded ${getQualityColor(session.quality)}`}>
                            {session.quality}점 ({getQualityText(session.quality)})
                          </span>
                          {session.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                          )}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">✂️ 미용 세션 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 정기적으로 미용을 진행하세요</li>
                <li>• 강아지가 편안한 환경에서 하세요</li>
                <li>• 긍정적인 강화를 사용하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 미용 도구를 안전하게 사용하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 피부 문제가 있으면 수의사에게 문의하세요</li>
                <li>• 과도한 미용은 피부에 해로울 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
