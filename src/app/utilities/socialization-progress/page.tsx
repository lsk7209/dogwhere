'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserPlus, Plus, CheckCircle, Users } from 'lucide-react'

interface SocializationGoal {
  id: string
  name: string
  category: string
  targetAge: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  notes: string
}

interface SocializationSession {
  id: string
  goalId: string
  date: string
  duration: number
  participants: string[]
  environment: string
  success: boolean
  notes: string
}

export default function SocializationProgressPage() {
  const [goals, setGoals] = useState<SocializationGoal[]>([])
  const [sessions, setSessions] = useState<SocializationSession[]>([])
  const [newGoal, setNewGoal] = useState({
    name: '',
    category: 'people',
    targetAge: '',
    notes: ''
  })
  const [newSession, setNewSession] = useState({
    goalId: '',
    duration: 0,
    participants: [] as string[],
    environment: '',
    success: true,
    notes: ''
  })

  const socializationCategories = {
    people: { name: '사람들과의 상호작용', icon: '👥' },
    dogs: { name: '다른 강아지와의 만남', icon: '🐕' },
    environments: { name: '새로운 환경 경험', icon: '🏞️' },
    sounds: { name: '다양한 소리 경험', icon: '🔊' },
    objects: { name: '다양한 물건 탐험', icon: '🧸' },
    handling: { name: '만지기와 터치', icon: '✋' },
    other: { name: '기타', icon: '📝' }
  }

  const participantOptions = [
    '어른', '아이', '노인', '남성', '여성', '다른 강아지', '고양이', '기타 동물'
  ]

  const environmentOptions = [
    '집 안', '마당', '공원', '거리', '카페', '쇼핑몰', '동물병원', '미용실', '기타'
  ]

  useEffect(() => {
    const savedGoals = localStorage.getItem('socializationGoals')
    const savedSessions = localStorage.getItem('socializationSessions')
    
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
      localStorage.setItem('socializationGoals', JSON.stringify(goals))
    }
  }, [goals])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('socializationSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const addGoal = () => {
    if (!newGoal.name || !newGoal.targetAge) return

    const goal: SocializationGoal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'not_started',
      progress: 0
    }
    setGoals([...goals, goal])
    setNewGoal({ name: '', category: 'people', targetAge: '', notes: '' })
  }

  const addSession = () => {
    if (!newSession.goalId || newSession.duration <= 0) return

    const session: SocializationSession = {
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

    setNewSession({ goalId: '', duration: 0, participants: [], environment: '', success: true, notes: '' })
  }

  const toggleParticipant = (participant: string) => {
    setNewSession({
      ...newSession,
      participants: newSession.participants.includes(participant)
        ? newSession.participants.filter(p => p !== participant)
        : [...newSession.participants, participant]
    })
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
    return socializationCategories[category as keyof typeof socializationCategories]?.name || category
  }

  const getCategoryIcon = (category: string) => {
    return socializationCategories[category as keyof typeof socializationCategories]?.icon || '📝'
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
            <UserPlus className="w-10 h-10 text-green-600 mr-3" />
            사회화 진도 추적기
          </h1>
          <p className="text-xl text-gray-600">사회화 훈련의 단계별 진도와 성과를 추적합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{goals.length}개</p>
            <p className="text-sm text-gray-600">사회화 목표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedGoals.length}개</p>
            <p className="text-sm text-gray-600">완료된 목표</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{inProgressGoals.length}개</p>
            <p className="text-sm text-gray-600">진행 중</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            <p className="text-sm text-gray-600">성공률</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 사회화 목표 추가</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">목표명</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="예: 어른들과 편안하게 상호작용하기"
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
                  {Object.entries(socializationCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.icon} {category.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">목표 연령</label>
              <input
                type="text"
                value={newGoal.targetAge}
                onChange={(e) => setNewGoal({...newGoal, targetAge: e.target.value})}
                placeholder="예: 12주, 4개월"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newGoal.notes}
                onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                rows={3}
                placeholder="사회화 목표에 대한 추가 정보나 주의사항"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addGoal}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              목표 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 세션 기록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사회화 목표</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">세션 시간 (분)</label>
                <input
                  type="number"
                  min="1"
                  value={newSession.duration || ''}
                  onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">참여자</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {participantOptions.map((participant) => (
                  <button
                    key={participant}
                    onClick={() => toggleParticipant(participant)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newSession.participants.includes(participant)
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {participant}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">환경</label>
                <select
                  value={newSession.environment}
                  onChange={(e) => setNewSession({...newSession, environment: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">환경 선택</option>
                  {environmentOptions.map((env) => (
                    <option key={env} value={env}>{env}</option>
                  ))}
                </select>
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
                placeholder="사회화 세션에 대한 상세한 기록"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addSession}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              세션 기록
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 목표 현황</h2>
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 사회화 목표가 없습니다
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
                          <span className="text-sm text-gray-600">목표: {goal.targetAge}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {getStatusText(goal.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{Math.round(goal.progress)}%</p>
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
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.notes && (
                      <p className="text-sm text-gray-600 mb-4">메모: {goal.notes}</p>
                    )}

                    {recentSessions.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">최근 사회화 세션</h4>
                        <div className="space-y-2">
                          {recentSessions.map((session) => (
                            <div key={session.id} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="text-gray-600">{session.date}</span>
                                <span className="ml-2 text-gray-500">({session.duration}분)</span>
                                <span className="ml-2 text-gray-500">{session.environment}</span>
                              </div>
                              <div className="flex items-center space-x-2">
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

        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 사회화 진도 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 연령에 맞는 사회화 목표를 설정하세요</li>
            <li>• 긍정적인 경험을 만들어주는 것이 중요합니다</li>
            <li>• 점진적으로 난이도를 높여가세요</li>
            <li>• 강아지가 불안해하면 즉시 중단하세요</li>
            <li>• 다양한 사람, 동물, 환경과의 경험을 제공하세요</li>
            <li>• 사회화는 평생에 걸쳐 지속되어야 합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
