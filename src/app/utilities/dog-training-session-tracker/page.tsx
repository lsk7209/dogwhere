'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Target, CheckCircle, Clock, AlertTriangle, Award } from 'lucide-react'

interface TrainingSession {
  id: string
  date: string
  type: string
  duration: number
  progress: number
  notes: string
  completed: boolean
}

interface TrainingGoal {
  id: string
  name: string
  description: string
  category: 'basic' | 'advanced' | 'behavior' | 'trick'
  priority: 'high' | 'medium' | 'low'
  targetDate: string
  completed: boolean
  progress: number
}

export default function DogTrainingSessionTrackerPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [goals, setGoals] = useState<TrainingGoal[]>([])
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 15,
    progress: 0,
    notes: '',
    completed: false
  })
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    category: 'basic' as 'basic' | 'advanced' | 'behavior' | 'trick',
    priority: 'medium' as 'high' | 'medium' | 'low',
    targetDate: ''
  })

  const trainingTypes = [
    '기본 명령어 (앉아, 기다려, 와)',
    '산책 훈련 (리드 매너)',
    '화장실 훈련',
    '사회화 훈련',
    '분리 불안 훈련',
    '공격성 훈련',
    '트릭 훈련',
    '애지훈련',
    '집중력 훈련',
    '기타'
  ]

  const initialGoals: TrainingGoal[] = [
    {
      id: '1',
      name: '기본 명령어 완성',
      description: '앉아, 기다려, 와 명령어를 90% 이상 성공',
      category: 'basic',
      priority: 'high',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '2',
      name: '산책 매너 개선',
      description: '리드 당기지 않고 산책하기',
      category: 'basic',
      priority: 'high',
      targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '3',
      name: '화장실 훈련 완성',
      description: '실내에서 실수 없이 화장실 사용',
      category: 'basic',
      priority: 'high',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '4',
      name: '사회화 훈련',
      description: '다른 강아지와 사람과 안전하게 상호작용',
      category: 'behavior',
      priority: 'medium',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '5',
      name: '트릭 훈련',
      description: '손바닥, 돌아, 죽은 척 등 재미있는 트릭 배우기',
      category: 'trick',
      priority: 'low',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    }
  ]

  useEffect(() => {
    const savedSessions = localStorage.getItem('trainingSessions')
    const savedGoals = localStorage.getItem('trainingGoals')
    
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (e) {}
    }
    
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (e) {
        setGoals(initialGoals)
      }
    } else {
      setGoals(initialGoals)
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('trainingSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('trainingGoals', JSON.stringify(goals))
    }
  }, [goals])

  const addSession = () => {
    if (!newSession.type) return

    const session: TrainingSession = {
      id: Date.now().toString(),
      ...newSession
    }
    setSessions([session, ...sessions])
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: 15,
      progress: 0,
      notes: '',
      completed: false
    })
  }

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetDate) return

    const goal: TrainingGoal = {
      id: Date.now().toString(),
      ...newGoal,
      completed: false,
      progress: 0
    }
    setGoals([goal, ...goals])
    setNewGoal({
      name: '',
      description: '',
      category: 'basic',
      priority: 'medium',
      targetDate: ''
    })
  }

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            progress: Math.max(0, Math.min(100, progress)),
            completed: progress >= 100
          } 
        : goal
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-blue-600 bg-blue-100'
      case 'advanced': return 'text-purple-600 bg-purple-100'
      case 'behavior': return 'text-green-600 bg-green-100'
      case 'trick': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'basic': return '기본'
      case 'advanced': return '고급'
      case 'behavior': return '행동'
      case 'trick': return '트릭'
      default: return category
    }
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const totalSessions = sessions.length
  const completedSessions = sessions.filter(session => session.completed).length
  const totalGoals = goals.length
  const completedGoals = goals.filter(goal => goal.completed).length
  const averageProgress = goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0
  const totalTrainingTime = sessions.reduce((sum, session) => sum + session.duration, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-10 h-10 text-blue-600 mr-3" />
            훈련 세션 추적기
          </h1>
          <p className="text-xl text-gray-600">각종 훈련 세션의 진행 상황과 성과를 상세히 기록</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSessions}회</p>
            <p className="text-sm text-gray-600">훈련 세션</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedSessions}회</p>
            <p className="text-sm text-gray-600">완료된 세션</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{completedGoals}개</p>
            <p className="text-sm text-gray-600">완료된 목표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{totalTrainingTime}분</p>
            <p className="text-sm text-gray-600">총 훈련 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{averageProgress.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">평균 진행률</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 목표 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표명</label>
                    <input
                      type="text"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      placeholder="예: 기본 명령어 완성"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="basic">기본</option>
                      <option value="advanced">고급</option>
                      <option value="behavior">행동</option>
                      <option value="trick">트릭</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="high">높음</option>
                      <option value="medium">보통</option>
                      <option value="low">낮음</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표 날짜</label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    rows={2}
                    placeholder="목표에 대한 상세 설명"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addGoal}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  훈련 목표 추가
                </button>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{goal.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(goal.category)}`}>
                            {getCategoryText(goal.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(goal.priority)}`}>
                            {getPriorityText(goal.priority)}
                          </span>
                          <span className="text-gray-500">목표: {goal.targetDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getProgressColor(goal.progress)}`}>
                          {goal.progress}%
                        </span>
                        {goal.completed && (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">진행률</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 세션 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 날짜</label>
                    <input
                      type="date"
                      value={newSession.date}
                      onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 유형</label>
                    <select
                      value={newSession.type}
                      onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">훈련 유형 선택</option>
                      {trainingTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 시간 (분)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">진행률 (%)</label>
                    <input
                      type="number"
                      value={newSession.progress}
                      onChange={(e) => setNewSession({...newSession, progress: parseInt(e.target.value) || 0})}
                      min="0"
                      max="100"
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
                    placeholder="훈련 과정, 강아지 반응, 개선점 등"
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
                  <label htmlFor="completed" className="text-sm text-gray-700">훈련 완료</label>
                </div>
                <button
                  onClick={addSession}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  훈련 세션 기록 추가
                </button>
              </div>

              {sessions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 훈련 세션 기록</h3>
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
                          <span className={`px-2 py-1 text-xs rounded ${getProgressColor(session.progress)}`}>
                            {session.progress}%
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 훈련 세션 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 짧고 자주 훈련하세요 (15-30분)</li>
                <li>• 긍정적인 강화를 사용하세요</li>
                <li>• 일관성 있게 훈련하세요</li>
                <li>• 강아지의 페이스에 맞추세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 훈련이 잘 안 되면 전문가에게 문의하세요</li>
                <li>• 강아지가 스트레스를 받으면 즉시 중단하세요</li>
                <li>• 무리한 훈련은 역효과를 낼 수 있습니다</li>
                <li>• 훈련 실패를 강아지 탓으로 돌리지 마세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
