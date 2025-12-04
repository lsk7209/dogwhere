'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart2, TrendingUp, Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react'

interface Session {
  id: string
  date: string
  command: string
  duration: number
  successCount: number
  totalAttempts: number
  mood: 'happy' | 'neutral' | 'frustrated'
}

export default function TrainingProgressTrackerPage() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', date: '2023-10-20', command: '앉아', duration: 10, successCount: 8, totalAttempts: 10, mood: 'happy' },
    { id: '2', date: '2023-10-21', command: '엎드려', duration: 15, successCount: 5, totalAttempts: 10, mood: 'neutral' },
    { id: '3', date: '2023-10-22', command: '기다려', duration: 12, successCount: 9, totalAttempts: 10, mood: 'happy' },
  ])

  const [newSession, setNewSession] = useState({
    command: '',
    duration: 10,
    successCount: 0,
    totalAttempts: 10,
    mood: 'happy' as const
  })

  const addSession = () => {
    if (!newSession.command) return
    const session: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newSession
    }
    setSessions([session, ...sessions])
    setNewSession({ command: '', duration: 10, successCount: 0, totalAttempts: 10, mood: 'happy' })
  }

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id))
  }

  const getSuccessRate = (s: Session) => Math.round((s.successCount / s.totalAttempts) * 100)

  // Stats
  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0)
  const avgSuccessRate = Math.round(sessions.reduce((acc, s) => acc + getSuccessRate(s), 0) / (sessions.length || 1))
  const recentSessions = sessions.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">훈련 성과 분석</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            데이터로 보는 우리 아이의 성장 기록. 꾸준함이 변화를 만듭니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
                종합 통계
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">총 훈련 시간</div>
                  <div className="text-2xl font-black text-blue-600">{totalDuration}분</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">평균 성공률</div>
                  <div className="text-2xl font-black text-green-600">{avgSuccessRate}%</div>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                새 기록 추가
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">훈련 명령어</label>
                  <input
                    type="text"
                    value={newSession.command}
                    onChange={(e) => setNewSession({ ...newSession, command: e.target.value })}
                    placeholder="예: 앉아, 기다려"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시간 (분)</label>
                    <input
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">기분</label>
                    <select
                      value={newSession.mood}
                      onChange={(e) => setNewSession({ ...newSession, mood: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    >
                      <option value="happy">즐거움 😄</option>
                      <option value="neutral">보통 😐</option>
                      <option value="frustrated">힘듦 😫</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">성공 횟수</label>
                    <input
                      type="number"
                      value={newSession.successCount}
                      onChange={(e) => setNewSession({ ...newSession, successCount: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">총 시도</label>
                    <input
                      type="number"
                      value={newSession.totalAttempts}
                      onChange={(e) => setNewSession({ ...newSession, totalAttempts: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={addSession}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  기록 저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                최근 훈련 기록
              </h2>

              <div className="space-y-4">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => {
                    const rate = getSuccessRate(session)
                    return (
                      <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all bg-white group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${session.mood === 'happy' ? 'bg-yellow-100' : session.mood === 'neutral' ? 'bg-gray-100' : 'bg-red-100'
                          }`}>
                          {session.mood === 'happy' ? '😄' : session.mood === 'neutral' ? '😐' : '😫'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{session.command}</h3>
                            <span className="text-xs text-gray-400">{session.date}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {session.duration}분
                            </span>
                            <span>
                              {session.successCount}/{session.totalAttempts} 성공
                            </span>
                          </div>
                        </div>

                        <div className="text-right mr-4">
                          <div className={`text-xl font-black ${rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {rate}%
                          </div>
                          <div className="text-xs text-gray-400">성공률</div>
                        </div>

                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    기록된 훈련이 없습니다. 첫 기록을 남겨보세요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
