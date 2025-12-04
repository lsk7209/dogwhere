'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Volume2, Play, Pause, CheckCircle, ArrowLeft, Volume1, VolumeX, Activity, BarChart2, Headphones, AlertTriangle } from 'lucide-react'

interface TrainingSession {
  id: string
  date: string
  sound: string
  volume: number
  duration: number
  reaction: 'calm' | 'slightly_anxious' | 'anxious' | 'very_anxious'
  notes: string
}

export default function NoiseDesensitizationPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [currentSession, setCurrentSession] = useState({
    sound: '',
    volume: 1,
    duration: 0,
    reaction: 'calm' as const,
    notes: ''
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)

  const soundTypes = [
    { id: 'thunder', label: '천둥소리', icon: '⚡' },
    { id: 'fireworks', label: '불꽃놀이', icon: '🎆' },
    { id: 'vacuum', label: '진공청소기', icon: '🧹' },
    { id: 'dryer', label: '드라이어', icon: '💨' },
    { id: 'car', label: '자동차 경적', icon: '🚗' },
    { id: 'siren', label: '사이렌', icon: '🚨' },
    { id: 'door', label: '문 닫는 소리', icon: '🚪' },
    { id: 'dog', label: '다른 개 짖음', icon: '🐕' },
    { id: 'construction', label: '공사 소음', icon: '🏗️' },
    { id: 'other', label: '기타', icon: '📝' }
  ]

  const trainingSteps = [
    { step: 1, title: '1단계: 미세 소음', description: '거의 들리지 않는 수준', volume: 1 },
    { step: 2, title: '2단계: 작은 소음', description: '백색 소음 정도', volume: 3 },
    { step: 3, title: '3단계: 생활 소음', description: '일상적인 대화 크기', volume: 5 },
    { step: 4, title: '4단계: 큰 소음', description: 'TV 크게 튼 정도', volume: 7 },
    { step: 5, title: '5단계: 실제 소음', description: '실제 상황과 동일', volume: 10 }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('noiseTrainingSessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('noiseTrainingSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const startTraining = () => {
    if (!currentSession.sound) return
    setIsPlaying(true)
    setTimer(0)
  }

  const stopTraining = () => {
    setIsPlaying(false)
    if (timer > 0) {
      const session: TrainingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...currentSession,
        duration: timer
      }
      setSessions([session, ...sessions])
      setCurrentSession({
        sound: '',
        volume: 1,
        duration: 0,
        reaction: 'calm',
        notes: ''
      })
      setTimer(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getReactionConfig = (reaction: string) => {
    switch (reaction) {
      case 'calm': return { label: '평온함', color: 'text-green-600 bg-green-100 border-green-200', icon: '😌' }
      case 'slightly_anxious': return { label: '약간 불안', color: 'text-yellow-600 bg-yellow-100 border-yellow-200', icon: '👀' }
      case 'anxious': return { label: '불안함', color: 'text-orange-600 bg-orange-100 border-orange-200', icon: '😰' }
      case 'very_anxious': return { label: '매우 불안', color: 'text-red-600 bg-red-100 border-red-200', icon: '😱' }
      default: return { label: reaction, color: 'text-gray-600 bg-gray-100', icon: '❓' }
    }
  }

  const getProgressPercentage = () => {
    // Calculate progress based on highest volume achieved with 'calm' reaction
    const calmSessions = sessions.filter(s => s.reaction === 'calm')
    if (calmSessions.length === 0) return 0
    const maxVolume = Math.max(...calmSessions.map(s => s.volume))
    return Math.min((maxVolume / 10) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Headphones className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">소음 둔감화 훈련</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            체계적인 둔감화 훈련으로 우리 아이의 소음 공포증을 극복해주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Training Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <BarChart2 className="w-5 h-5 mr-2 text-purple-500" />
                  적응 훈련 진행도
                </h2>
                <span className="text-2xl font-black text-purple-600">{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {trainingSteps.map((step) => {
                  const isCompleted = sessions.some(s => s.volume >= step.volume && s.reaction === 'calm')
                  return (
                    <div key={step.step} className="text-center group relative">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold transition-all ${isCompleted
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                          : 'bg-gray-100 text-gray-400'
                        }`}>
                        {step.step}
                      </div>
                      <p className="text-xs font-medium text-gray-600">{step.title}</p>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {step.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Training Session Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-purple-500" />
                훈련 세션
              </h2>

              <div className="space-y-8">
                {/* Sound Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">소음 종류 선택</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {soundTypes.map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => setCurrentSession({ ...currentSession, sound: sound.label })}
                        disabled={isPlaying}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${currentSession.sound === sound.label
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-100 hover:border-purple-200 text-gray-600'
                          } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="text-xs font-bold">{sound.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Control */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Volume1 className="w-4 h-4 mr-2" />
                      볼륨 조절
                    </label>
                    <span className="text-lg font-bold text-purple-600">{currentSession.volume} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentSession.volume}
                    onChange={(e) => setCurrentSession({ ...currentSession, volume: parseInt(e.target.value) })}
                    disabled={isPlaying}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1단계 (미세)</span>
                    <span>5단계 (보통)</span>
                    <span>10단계 (실제)</span>
                  </div>
                </div>

                {/* Controls */}
                {!isPlaying ? (
                  <button
                    onClick={startTraining}
                    disabled={!currentSession.sound}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    훈련 시작하기
                  </button>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col items-center justify-center py-8 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="text-4xl font-black text-purple-600 mb-2 font-mono">
                        {formatTime(timer)}
                      </div>
                      <div className="flex items-center gap-2 text-purple-700 font-medium animate-pulse">
                        <Activity className="w-4 h-4" />
                        훈련 진행 중...
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">아이의 반응은 어떤가요?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['calm', 'slightly_anxious', 'anxious', 'very_anxious'].map((reaction) => {
                          const config = getReactionConfig(reaction)
                          return (
                            <button
                              key={reaction}
                              onClick={() => setCurrentSession({ ...currentSession, reaction: reaction as any })}
                              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${currentSession.reaction === reaction
                                  ? config.color + ' border-current'
                                  : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'
                                }`}
                            >
                              <span className="text-xl">{config.icon}</span>
                              <span className="text-xs font-bold">{config.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={currentSession.notes}
                        onChange={(e) => setCurrentSession({ ...currentSession, notes: e.target.value })}
                        placeholder="특이사항 메모 (선택)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      onClick={stopTraining}
                      className="w-full bg-white text-red-500 border-2 border-red-100 py-4 rounded-xl hover:bg-red-50 transition-all font-bold text-lg flex items-center justify-center"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      훈련 종료 및 저장
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: History & Guide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Guide Box */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                훈련 핵심 가이드
              </h3>
              <ul className="space-y-4 text-indigo-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400 font-bold">1.</span>
                  <span>
                    <strong className="text-white">아주 작게 시작하세요</strong><br />
                    아이가 전혀 반응하지 않는 크기부터 시작해야 합니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400 font-bold">2.</span>
                  <span>
                    <strong className="text-white">좋은 기억 심어주기</strong><br />
                    소리를 들려주며 간식을 주거나 놀아주세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-yellow-400 font-bold">3.</span>
                  <span>
                    <strong className="text-white">반응하면 즉시 중단</strong><br />
                    불안해하면 볼륨을 낮추고 쉬었다가 다시 시작하세요.
                  </span>
                </li>
              </ul>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">최근 기록</h2>
              <div className="space-y-4">
                {sessions.length > 0 ? (
                  sessions.slice(0, 5).map((session) => {
                    const config = getReactionConfig(session.reaction)
                    return (
                      <div key={session.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-gray-900 block">{session.sound}</span>
                            <span className="text-xs text-gray-500">{session.date}</span>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${config.color}`}>
                            {config.label}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>🔊 볼륨 {session.volume}</span>
                          <span>⏱️ {formatTime(session.duration)}</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    아직 기록이 없습니다.
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
