'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, Calendar, CheckCircle, ArrowLeft, Plus, AlertTriangle, Clock, Trash2, RefreshCw } from 'lucide-react'

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
    { task: '양치질', frequency: 'daily' },
    { task: '귀 청소', frequency: 'weekly' },
    { task: '발톱 깎기', frequency: 'biweekly' },
    { task: '목욕', frequency: 'monthly' },
    { task: '전체 미용', frequency: 'monthly' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('groomingTasks')
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

  const initializeTasks = () => {
    const initialTasks = defaultTasks.map((task, index) => ({
      id: index.toString(),
      ...task,
      lastDone: '',
      nextDue: calculateNextDue(new Date().toISOString().split('T')[0], task.frequency), // Set initial due date to today for demo
      completed: false
    }))
    setTasks(initialTasks)
  }

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
      nextDue: new Date().toISOString().split('T')[0], // Due today
      completed: false
    }
    setTasks([...tasks, task])
    setNewTask({ task: '', frequency: 'weekly' })
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
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
      case 'daily': nextDate.setDate(nextDate.getDate() + 1); break
      case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break
      case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break
      case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break
      default: nextDate.setDate(nextDate.getDate() + 7)
    }

    return nextDate.toISOString().split('T')[0]
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'biweekly': return '2주'
      case 'monthly': return '월간'
      default: return frequency
    }
  }

  const isOverdue = (nextDue: string) => {
    if (!nextDue) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(nextDue)
    return dueDate < today
  }

  const isDueToday = (nextDue: string) => {
    if (!nextDue) return false
    const today = new Date().toISOString().split('T')[0]
    return nextDue === today
  }

  const overdueTasks = tasks.filter(task => task.nextDue && isOverdue(task.nextDue))
  const todayTasks = tasks.filter(task => task.nextDue && isDueToday(task.nextDue))
  const upcomingTasks = tasks.filter(task => task.nextDue && !isOverdue(task.nextDue) && !isDueToday(task.nextDue))

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Scissors className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">미용 스케줄러</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 위생 관리, 놓치지 말고 챙겨주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Task Lists */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">{overdueTasks.length}</div>
                <div className="text-xs text-gray-500 font-medium">지연됨</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-pink-500 mb-1">{todayTasks.length}</div>
                <div className="text-xs text-gray-500 font-medium">오늘 예정</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-gray-700 mb-1">{upcomingTasks.length}</div>
                <div className="text-xs text-gray-500 font-medium">대기중</div>
              </div>
            </div>

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  지연된 관리 ({overdueTasks.length})
                </h2>
                {overdueTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} status="overdue" />
                ))}
              </div>
            )}

            {/* Today's Tasks */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-pink-500" />
                오늘의 할 일 ({todayTasks.length})
              </h2>
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} status="today" />
                ))
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-200 text-gray-400">
                  오늘 예정된 관리가 없습니다.
                </div>
              )}
            </div>

            {/* Upcoming Tasks */}
            {upcomingTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  다가오는 일정
                </h2>
                {upcomingTasks.slice(0, 5).map(task => (
                  <TaskCard key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask} status="upcoming" />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Add Task & Tips */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-pink-500" />
                새 일정 추가
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">관리 항목</label>
                  <input
                    type="text"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    placeholder="예: 항문낭 짜기"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반복 주기</label>
                  <select
                    value={newTask.frequency}
                    onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  >
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="biweekly">2주마다</option>
                    <option value="monthly">매월</option>
                  </select>
                </div>
                <button
                  onClick={addTask}
                  disabled={!newTask.task}
                  className="w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  일정 등록하기
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">💡 관리 주기 팁</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-pink-500">•</span>
                    빗질: 매일 (단모종은 주 2-3회)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-pink-500">•</span>
                    양치질: 매일 (최소 주 3회)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-pink-500">•</span>
                    귀 청소: 주 1회 (목욕 후 추천)
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-pink-500">•</span>
                    발톱: 2주 1회 (소리 날 때)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task, onComplete, onDelete, status }: {
  task: GroomingTask,
  onComplete: (id: string) => void,
  onDelete: (id: string) => void,
  status: 'overdue' | 'today' | 'upcoming'
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'overdue': return 'border-red-200 bg-red-50'
      case 'today': return 'border-pink-200 bg-pink-50'
      default: return 'border-gray-100 bg-white'
    }
  }

  const getFrequencyBadge = () => {
    switch (task.frequency) {
      case 'daily': return 'bg-blue-100 text-blue-700'
      case 'weekly': return 'bg-green-100 text-green-700'
      case 'biweekly': return 'bg-purple-100 text-purple-700'
      case 'monthly': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getFrequencyText = (freq: string) => {
    switch (freq) {
      case 'daily': return '매일'
      case 'weekly': return '매주'
      case 'biweekly': return '2주'
      case 'monthly': return '매월'
      default: return freq
    }
  }

  return (
    <div className={`p-4 rounded-xl border ${getStatusColor()} flex items-center justify-between group transition-all hover:shadow-md`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onComplete(task.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${status === 'overdue' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
              status === 'today' ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' :
                'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
        >
          <CheckCircle className="w-6 h-6" />
        </button>
        <div>
          <h3 className="font-bold text-gray-900">{task.task}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFrequencyBadge()}`}>
              {getFrequencyText(task.frequency)}
            </span>
            <span className="text-xs text-gray-500">
              {status === 'overdue' ? `${task.nextDue} (지연됨)` :
                status === 'today' ? '오늘 예정' :
                  `${task.nextDue} 예정`}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
