'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, Calendar, CheckCircle } from 'lucide-react'

interface GroomingTask {
  id: string
  task: string
  frequency: string
  lastDone: string
  nextDue: string
  completed: boolean
}

export default function GroomingSchedulePage() {
  const [tasks, setTasks] = useState<GroomingTask[]>([])
  const [newTask, setNewTask] = useState({
    task: '',
    frequency: 'weekly'
  })

  const defaultTasks = [
    { task: '털 빗질', frequency: 'daily' },
    { task: '목욕', frequency: 'monthly' },
    { task: '발톱 깎기', frequency: 'monthly' },
    { task: '귀 청소', frequency: 'weekly' },
    { task: '치아 관리', frequency: 'daily' },
    { task: '털 정리', frequency: 'monthly' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('groomingTasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        // 기본 작업으로 초기화
        const initialTasks = defaultTasks.map((task, index) => ({
          id: index.toString(),
          ...task,
          lastDone: '',
          nextDue: '',
          completed: false
        }))
        setTasks(initialTasks)
      }
    } else {
      // 기본 작업으로 초기화
      const initialTasks = defaultTasks.map((task, index) => ({
        id: index.toString(),
        ...task,
        lastDone: '',
        nextDue: '',
        completed: false
      }))
      setTasks(initialTasks)
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('groomingTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = () => {
    if (!newTask.task) return

    const task: GroomingTask = {
      id: Date.now().toString(),
      ...newTask,
      lastDone: '',
      nextDue: '',
      completed: false
    }
    setTasks([...tasks, task])
    setNewTask({ task: '', frequency: 'weekly' })
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
        nextDate.setDate(nextDate.getDate() + 7)
    }
    
    return nextDate.toISOString().split('T')[0]
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      default: return frequency
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'text-red-600 bg-red-100'
      case 'weekly': return 'text-yellow-600 bg-yellow-100'
      case 'monthly': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isOverdue = (nextDue: string) => {
    if (!nextDue) return false
    const today = new Date()
    const dueDate = new Date(nextDue)
    return dueDate < today
  }

  const upcomingTasks = tasks.filter(task => 
    task.nextDue && !isOverdue(task.nextDue) && new Date(task.nextDue) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  )

  const overdueTasks = tasks.filter(task => task.nextDue && isOverdue(task.nextDue))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Scissors className="w-10 h-10 text-pink-600 mr-3" />
            미용 일정 관리자
          </h1>
          <p className="text-xl text-gray-600">털 관리, 목욕, 발톱 관리 일정을 체계적으로 관리합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{upcomingTasks.length}개</p>
            <p className="text-sm text-gray-600">이번 주 예정</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.completed).length}개</p>
            <p className="text-sm text-gray-600">완료된 작업</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-red-600">{overdueTasks.length}개</p>
            <p className="text-sm text-gray-600">지연된 작업</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 미용 작업 추가</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">작업명</label>
              <input
                type="text"
                value={newTask.task}
                onChange={(e) => setNewTask({...newTask, task: e.target.value})}
                placeholder="예: 털 정리, 발톱 깎기"
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
          </div>
          <button
            onClick={addTask}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
          >
            작업 추가
          </button>
        </div>

        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ 지연된 작업</h2>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{task.task}</h3>
                      <p className="text-sm text-gray-600">
                        마지막: {task.lastDone || '미완료'} | 다음 예정: {task.nextDue}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(task.frequency)}`}>
                        {getFrequencyText(task.frequency)}
                      </span>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">미용 일정</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{task.task}</h3>
                    <p className="text-sm text-gray-600">
                      마지막: {task.lastDone || '미완료'} | 다음 예정: {task.nextDue || '미설정'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(task.frequency)}`}>
                      {getFrequencyText(task.frequency)}
                    </span>
                    {task.completed && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        완료
                      </span>
                    )}
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-pink-600 text-white rounded text-sm hover:bg-pink-700 transition-colors"
                    >
                      완료
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 미용 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 털 빗질은 매일 해주는 것이 좋습니다</li>
            <li>• 목욕은 견종에 따라 1-2주에 한 번 정도가 적당합니다</li>
            <li>• 발톱은 월 1-2회 정도 깎아주세요</li>
            <li>• 귀 청소는 주 1-2회, 치아 관리는 매일 해주세요</li>
            <li>• 견종과 털 상태에 따라 빈도를 조절하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
