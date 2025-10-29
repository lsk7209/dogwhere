'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Target, Plus, CheckCircle, TrendingUp } from 'lucide-react'

interface TrainingGoal {
  id: string
  name: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  targetDate: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  notes: string
}

interface TrainingSession {
  id: string
  goalId: string
  date: string
  duration: number
  success: boolean
  notes: string
}

export default function TrainingProgressTrackerPage() {
  const [goals, setGoals] = useState<TrainingGoal[]>([])
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'basic',
    difficulty: 'easy' as const,
    targetDate: '',
    notes: ''
  })
  const [newSession, setNewSession] = useState({
    goalId: '',
    duration: 0,
    success: true,
    notes: ''
  })

  const trainingCategories = {
    basic: { name: '기본 예절', icon: '🐕' },
    commands: { name: '명령어', icon: '🎯' },
    social: { name: '사회화', icon: '👥' },
    behavior: { name: '행동 교정', icon: '🔧' },
    advanced: { name: '고급 훈련', icon: '⭐' },
    other: { name: '기타', icon: '📝' }
  }

  useEffect(() => {
    const savedGoals = localStorage.getItem('trainingGoals')
    const savedSessions = localStorage.getItem('trainingSessions')
    
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (e) {}
    }
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('trainingGoals', JSON.stringify(goals))
    }
  }, [goals])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('trainingSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetDate) return

    const goal: TrainingGoal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'not_started',
      progress: 0
    }
    setGoals([...goals, goal])
    setNewGoal({ name: '', category: 'basic', difficulty: 'easy', targetDate: '', notes: '' })
  }

  const addSession = () => {
    if (!newSession.goalId || newSession.duration <= 0) return

    const session: TrainingSession = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newSession
    }
    setSessions([session, ...sessions])

    // 목표 진행률 업데이트
    const goalSessions = sessions.filter(s => s.goalId === newSession.goalId)
    const successRate = goalSessions.length > 0 
      ? (goalSessions.filter(s => s.success).length / goalSessions.length) * 100
      : newSession.success ? 100 : 0

    setGoals(goals.map(goal => 
      goal.id === newSession.goalId 
        ? { 
            ...goal, 
            status: successRate >= 80 ? 'completed' : 'in_progress',
            progress: Math.min(successRate, 100)
          }
        : goal
    ))

    setNewSession({ goalId: '', duration: 0, success: true, notes: '' })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움'
      case 'medium': return '보통'
      case 'hard': return '어려움'
      default: return difficulty
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'text-gray-600 bg-gray-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_started': return '시작 전'
      case 'in_progress': return '진행 중'
      case 'completed': return '완료'
      default: return status
    }
  }

  const getCategoryName = (category: string) => {
    return trainingCategories[category as keyof typeof trainingCategories]?.name || category
  }

  const getCategoryIcon = (category: string) => {
    return trainingCategories[category as keyof typeof trainingCategories]?.icon || '📝'
  }

  const completedGoals = goals.filter(g => g.status === 'completed')
  const inProgressGoals = goals.filter(g => g.status === 'in_progress')
  const totalSessions = sessions.length
  const successRate = totalSessions > 0 
    ? Math.round((sessions.filter(s => s.success).length / totalSessions) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-10 h-10 text-blue-600 mr-3" />
            훈련 진도 추적기
          </h1>
          <p className="text-xl text-gray-600">각종 훈련의 진도와 성과를 체계적으로 추적합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{goals.length}개</p>
            <p className="text-sm text-gray-600">훈련 목표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedGoals.length}개</p>
            <p className="text-sm text-gray-600">완료된 목표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{inProgressGoals.length}개</p>
            <p className="text-sm text-gray-600">진행 중</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            <p className="text-sm text-gray-600">성공률</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 훈련 목표 추가</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">목표명</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="예: 앉아 명령어 완벽히 익히기"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(trainingCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                <select
                  value={newGoal.difficulty}
                  onChange={(e) => setNewGoal({...newGoal, difficulty: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="easy">쉬움</option>
                  <option value="medium">보통</option>
                  <option value="hard">어려움</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newGoal.notes}
                onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                rows={3}
                placeholder="훈련 목표에 대한 추가 정보나 주의사항"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addGoal}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              목표 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 세션 기록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">훈련 목표</label>
                <select
                  value={newSession.goalId}
                  onChange={(e) => setNewSession({...newSession, goalId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">목표 선택</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>{goal.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">훈련 시간 (분)</label>
                <input
                  type="number"
                  min="1"
                  value={newSession.duration || ''}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성공 여부</label>
                <select
                  value={newSession.success.toString()}
                  onChange={(e) => setNewSession({...newSession, success: e.target.value === 'true'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">성공</option>
                  <option value="false">실패</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">세션 메모</label>
              <textarea
                value={newSession.notes}
                onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                rows={3}
                placeholder="훈련 세션에 대한 상세한 기록"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addSession}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              세션 기록
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 목표 현황</h2>
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 훈련 목표가 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const goalSessions = sessions.filter(s => s.goalId === goal.id)
                const recentSessions = goalSessions.slice(0, 3)
                
                return (
                  <div key={goal.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.name}</h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                          <span className="text-sm text-gray-600">{getCategoryName(goal.category)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(goal.difficulty)}`}>
                            {getDifficultyText(goal.difficulty)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {getStatusText(goal.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{Math.round(goal.progress)}%</p>
                        <p className="text-sm text-gray-600">진행률</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">진행률</span>
                        <span className="text-sm text-gray-600">{Math.round(goal.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.notes && (
                      <p className="text-sm text-gray-600 mb-4">메모: {goal.notes}</p>
                    )}

                    {recentSessions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">최근 훈련 세션</h4>
                        <div className="space-y-2">
                          {recentSessions.map((session) => (
                            <div key={session.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{session.date}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">{session.duration}분</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  session.success 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {session.success ? '성공' : '실패'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 훈련 진도 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 명확하고 구체적인 훈련 목표를 설정하세요</li>
            <li>• 정기적으로 훈련 세션을 기록하세요</li>
            <li>• 강아지의 페이스에 맞춰 목표를 조정하세요</li>
            <li>• 성공과 실패를 모두 기록하여 패턴을 파악하세요</li>
            <li>• 훈련 세션은 짧고 자주 하는 것이 효과적입니다</li>
            <li>• 긍정적인 강화를 통해 동기를 유지하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
