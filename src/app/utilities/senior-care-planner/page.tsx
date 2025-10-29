'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Heart, Activity, CheckCircle } from 'lucide-react'

interface CareTask {
  id: string
  task: string
  frequency: string
  lastDone: string
  nextDue: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export default function SeniorCarePlannerPage() {
  const [tasks, setTasks] = useState<CareTask[]>([])
  const [newTask, setNewTask] = useState({
    task: '',
    frequency: 'daily',
    priority: 'medium' as const
  })

  const defaultTasks = [
    { task: '관절 건강 체크', frequency: 'daily', priority: 'high' },
    { task: '치아 상태 확인', frequency: 'daily', priority: 'high' },
    { task: '체중 측정', frequency: 'weekly', priority: 'high' },
    { task: '눈과 귀 청결', frequency: 'daily', priority: 'medium' },
    { task: '털 관리', frequency: 'daily', priority: 'medium' },
    { task: '수면 패턴 관찰', frequency: 'daily', priority: 'medium' },
    { task: '식욕 상태 확인', frequency: 'daily', priority: 'high' },
    { task: '배변 상태 확인', frequency: 'daily', priority: 'high' },
    { task: '운동량 조절', frequency: 'daily', priority: 'medium' },
    { task: '정기 검진', frequency: 'monthly', priority: 'high' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('seniorCareTasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        initializeTasks()
      }
    } else {
      initializeTasks()
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('seniorCareTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const initializeTasks = () => {
    const initialTasks = defaultTasks.map((task, index) => ({
      id: index.toString(),
      ...task,
      priority: task.priority as 'high' | 'medium' | 'low',
      lastDone: '',
      nextDue: '',
      completed: false
    }))
    setTasks(initialTasks)
  }

  const addTask = () => {
    if (!newTask.task) return

    const task: CareTask = {
      id: Date.now().toString(),
      ...newTask,
      lastDone: '',
      nextDue: '',
      completed: false
    }
    setTasks([...tasks, task])
    setNewTask({ task: '', frequency: 'daily', priority: 'medium' })
  }

  const completeTask = (taskId: string) => {
    const today = new Date().toISOString().split('T')[0]
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            lastDone: today, 
            nextDue: calculateNextDue(today, task.frequency),
            completed: true 
          }
        : task
    ))
  }

  const calculateNextDue = (lastDone: string, frequency: string) => {
    const lastDate = new Date(lastDone)
    const nextDate = new Date(lastDate)
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      default:
        nextDate.setDate(nextDate.getDate() + 1)
    }
    
    return nextDate.toISOString().split('T')[0]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return priority
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

  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed)
  const completedToday = tasks.filter(task => 
    task.completed && task.lastDone === new Date().toISOString().split('T')[0]
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-10 h-10 text-orange-600 mr-3" />
            노령견 케어 플래너
          </h1>
          <p className="text-xl text-gray-600">노령견을 위한 특별한 케어 계획을 수립합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{highPriorityTasks.length}개</p>
            <p className="text-sm text-gray-600">높은 우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedToday}개</p>
            <p className="text-sm text-gray-600">오늘 완료</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{tasks.length}개</p>
            <p className="text-sm text-gray-600">전체 작업</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 케어 작업 추가</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">작업명</label>
              <input
                type="text"
                value={newTask.task}
                onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                placeholder="예: 관절 마사지, 치아 청결"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">빈도</label>
              <select
                value={newTask.frequency}
                onChange={(e) => setNewTask({...newTask, frequency: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="daily">매일</option>
                <option value="weekly">주간</option>
                <option value="monthly">월간</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="high">높음</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </select>
            </div>
          </div>
          <button
            onClick={addTask}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            작업 추가
          </button>
        </div>

        {highPriorityTasks.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ 높은 우선순위 작업</h2>
            <div className="space-y-3">
              {highPriorityTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{task.task}</h3>
                      <p className="text-sm text-gray-600">
                        {getFrequencyText(task.frequency)} | 마지막: {task.lastDone || '미완료'}
                      </p>
                    </div>
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      완료
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">노령견 케어 체크리스트</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-gray-900">{task.task}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getFrequencyText(task.frequency)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      마지막: {task.lastDone || '미완료'} | 다음 예정: {task.nextDue || '미설정'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.completed && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        완료
                      </span>
                    )}
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                    >
                      완료
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 노령견 케어 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 노령견은 더 자주 건강 상태를 확인해야 합니다</li>
            <li>• 관절 건강과 치아 관리에 특히 주의하세요</li>
            <li>• 수면과 식욕 변화를 주의 깊게 관찰하세요</li>
            <li>• 운동량을 조절하되 정신적 자극은 유지하세요</li>
            <li>• 정기적인 수의사 검진을 받으세요</li>
            <li>• 편안한 환경을 만들어주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
