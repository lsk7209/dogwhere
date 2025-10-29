'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap, CheckCircle, Circle, ChevronRight } from 'lucide-react'

interface TrainingTask {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: string
  completed: boolean
}

const trainingPrograms = {
  basic: [
    { id: 'sit', title: '앉아', description: '기본 명령어 훈련', difficulty: 'easy' as const, duration: '1-2주', completed: false },
    { id: 'stay', title: '기다려', description: '자리 지키기 훈련', difficulty: 'easy' as const, duration: '1-2주', completed: false },
    { id: 'come', title: '불러오기', description: '호출 명령어 훈련', difficulty: 'medium' as const, duration: '2-3주', completed: false },
    { id: 'heel', title: '발 옆 훈련', description: '산책 시 발 옆에서 걷기', difficulty: 'medium' as const, duration: '2-4주', completed: false },
    { id: 'no', title: '금지 명령어', description: '하지 말라는 명령어', difficulty: 'medium' as const, duration: '2-3주', completed: false },
  ],
  advanced: [
    { id: 'roll', title: '구르기', description: '뒤집기 동작', difficulty: 'medium' as const, duration: '2-3주', completed: false },
    { id: 'shake', title: '손', description: '앞발 내밀기', difficulty: 'easy' as const, duration: '1주', completed: false },
    { id: 'fetch', title: '물어오기', description: '공이나 장난감 가져오기', difficulty: 'hard' as const, duration: '3-4주', completed: false },
    { id: 'wait', title: '대기', description: '문 앞이나 식사 전 대기', difficulty: 'hard' as const, duration: '3-4주', completed: false },
  ]
}

export default function TrainingPlannerPage() {
  const [selectedProgram, setSelectedProgram] = useState<'basic' | 'advanced'>('basic')
  const [tasks, setTasks] = useState<TrainingTask[]>(trainingPrograms.basic)

  useEffect(() => {
    const saved = localStorage.getItem(`trainingProgress_${selectedProgram}`)
    if (saved) {
      try {
        const savedTasks = JSON.parse(saved)
        const programTasks = trainingPrograms[selectedProgram]
        const merged = programTasks.map(t => {
          const savedTask = savedTasks.find((s: TrainingTask) => s.id === t.id)
          return savedTask || t
        })
        setTasks(merged)
      } catch (e) {}
    } else {
      setTasks(trainingPrograms[selectedProgram])
    }
  }, [selectedProgram])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(`trainingProgress_${selectedProgram}`, JSON.stringify(tasks))
    }
  }, [tasks, selectedProgram])

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-10 h-10 text-indigo-600 mr-3" />
            훈련 일정 플래너
          </h1>
          <p className="text-xl text-gray-600">
            기본 예절부터 특수 기술까지 단계별 훈련 일정을 관리합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setSelectedProgram('basic')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedProgram === 'basic'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              기본 훈련
            </button>
            <button
              onClick={() => setSelectedProgram('advanced')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedProgram === 'advanced'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              고급 훈련
            </button>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">훈련 진행률</span>
              <span className="text-lg font-bold text-indigo-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              완료: {completedCount} / {tasks.length}
            </p>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border-2 rounded-lg p-6 ${
                  task.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-xl font-bold ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty === 'easy' ? '쉬움' : task.difficulty === 'medium' ? '보통' : '어려움'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ChevronRight className="w-4 h-4" />
                      <span>예상 소요 시간: {task.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 훈련 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 짧고 집중적인 훈련 세션이 효과적입니다 (10-15분)</li>
            <li>• 긍정적 강화(간식, 칭찬)를 활용하세요</li>
            <li>• 훈련은 일관성 있게, 매일 같은 시간에 진행하는 것이 좋습니다</li>
            <li>• 강아지가 스트레스를 받으면 휴식을 취하세요</li>
            <li>• 어려운 훈련은 단계별로 나눠서 진행하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

