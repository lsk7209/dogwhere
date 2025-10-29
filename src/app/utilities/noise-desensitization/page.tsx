'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Volume2, Play, Pause, CheckCircle } from 'lucide-react'

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
  const [currentStep, setCurrentStep] = useState(1)

  const soundTypes = [
    '천둥소리', '불꽃놀이', '진공청소기', '드라이어', '자동차 경적',
    '사이렌', '문 닫는 소리', '계단 소리', '다른 강아지 짖는 소리', '기타'
  ]

  const trainingSteps = [
    { step: 1, title: '1단계: 매우 낮은 볼륨', description: '거의 들리지 않는 수준에서 시작', volume: 1 },
    { step: 2, title: '2단계: 낮은 볼륨', description: '조용한 수준으로 증가', volume: 3 },
    { step: 3, title: '3단계: 중간 볼륨', description: '일반적인 수준으로 증가', volume: 5 },
    { step: 4, title: '4단계: 높은 볼륨', description: '실제 상황과 유사한 수준', volume: 7 },
    { step: 5, title: '5단계: 최대 볼륨', description: '실제 상황과 동일한 수준', volume: 10 }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('noiseTrainingSessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('noiseTrainingSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const startTraining = () => {
    if (!currentSession.sound) return
    setIsPlaying(true)
    setCurrentSession({...currentSession, duration: 0})
  }

  const stopTraining = () => {
    setIsPlaying(false)
    if (currentSession.duration > 0) {
      const session: TrainingSession = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...currentSession
      }
      setSessions([session, ...sessions])
      setCurrentSession({
        sound: '',
        volume: 1,
        duration: 0,
        reaction: 'calm',
        notes: ''
      })
    }
  }

  const getReactionColor = (reaction: string) => {
    switch (reaction) {
      case 'calm': return 'text-green-600 bg-green-100'
      case 'slightly_anxious': return 'text-yellow-600 bg-yellow-100'
      case 'anxious': return 'text-orange-600 bg-orange-100'
      case 'very_anxious': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getReactionText = (reaction: string) => {
    switch (reaction) {
      case 'calm': return '평온함'
      case 'slightly_anxious': return '약간 불안'
      case 'anxious': return '불안함'
      case 'very_anxious': return '매우 불안'
      default: return reaction
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = sessions.filter(s => s.volume >= 7).length
    return Math.min((completedSteps / 5) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Volume2 className="w-10 h-10 text-purple-600 mr-3" />
            소음 적응 훈련 가이드
          </h1>
          <p className="text-xl text-gray-600">소음 공포증 극복을 위한 단계별 훈련 방법</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 진행도</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">전체 진행률</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {trainingSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                  sessions.some(s => s.volume >= step.volume)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.step}
                </div>
                <p className="text-xs text-gray-600">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 훈련 세션</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">소음 유형</label>
              <select
                value={currentSession.sound}
                onChange={(e) => setCurrentSession({...currentSession, sound: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">소음 유형 선택</option>
                {soundTypes.map((sound) => (
                  <option key={sound} value={sound}>{sound}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                볼륨 레벨: {currentSession.volume}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentSession.volume}
                onChange={(e) => setCurrentSession({...currentSession, volume: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>매우 낮음</span>
                <span>매우 높음</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">강아지 반응</label>
              <select
                value={currentSession.reaction}
                onChange={(e) => setCurrentSession({...currentSession, reaction: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="calm">평온함</option>
                <option value="slightly_anxious">약간 불안</option>
                <option value="anxious">불안함</option>
                <option value="very_anxious">매우 불안</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={currentSession.notes}
                onChange={(e) => setCurrentSession({...currentSession, notes: e.target.value})}
                rows={3}
                placeholder="강아지의 반응이나 특이사항을 기록하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={startTraining}
                disabled={!currentSession.sound || isPlaying}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>훈련 시작</span>
              </button>
              <button
                onClick={stopTraining}
                disabled={!isPlaying}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>훈련 종료</span>
              </button>
            </div>

            {isPlaying && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-800">훈련 진행 중</span>
                </div>
                <p className="text-sm text-purple-700">
                  {currentSession.sound} - 볼륨 {currentSession.volume}/10
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  강아지의 반응을 관찰하고 안정적이면 다음 단계로 진행하세요
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 기록</h2>
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 훈련 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{session.sound}</h3>
                      <p className="text-sm text-gray-600">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">볼륨: {session.volume}/10</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getReactionColor(session.reaction)}`}>
                        {getReactionText(session.reaction)}
                      </span>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="text-sm text-gray-500 mt-2">메모: {session.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 소음 적응 훈련 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 천천히 단계적으로 진행하세요. 급하게 하면 오히려 악화될 수 있습니다</li>
            <li>• 강아지가 불안해하면 즉시 중단하고 이전 단계로 돌아가세요</li>
            <li>• 긍정적인 강화(간식, 칭찬)를 활용하세요</li>
            <li>• 훈련은 짧고 자주 하는 것이 효과적입니다</li>
            <li>• 강아지의 페이스에 맞춰 진행하세요</li>
            <li>• 문제가 지속되면 전문가와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
