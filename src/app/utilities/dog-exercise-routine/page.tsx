'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface ExerciseEntry {
  id: string
  date: string
  type: string
  duration: number
  intensity: 'low' | 'medium' | 'high'
  notes: string
}

interface ExercisePlan {
  id: string
  name: string
  description: string
  category: 'cardio' | 'strength' | 'flexibility' | 'mental' | 'social'
  duration: number
  intensity: 'low' | 'medium' | 'high'
  frequency: 'daily' | 'weekly' | 'monthly'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
}

export default function DogExerciseRoutinePage() {
  const [entries, setEntries] = useState<ExerciseEntry[]>([])
  const [plans, setPlans] = useState<ExercisePlan[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 30,
    intensity: 'medium' as 'low' | 'medium' | 'high',
    notes: ''
  })

  const initialPlans: ExercisePlan[] = [
    {
      id: '1',
      name: '산책',
      description: '기본적인 산책으로 심폐 기능 향상',
      category: 'cardio',
      duration: 30,
      intensity: 'medium',
      frequency: 'daily',
      steps: [
        '적절한 산책 코스 선택',
        '산책 전 준비 운동',
        '일정한 속도로 걷기',
        '산책 후 정리 운동'
      ],
      tips: [
        '강아지가 편안해하는 속도로 걷기',
        '과도한 운동을 피하기',
        '정기적으로 산책하기',
        '필요시 전문가의 도움 받기'
      ],
      completed: false
    },
    {
      id: '2',
      name: '공놀이',
      description: '공을 이용한 놀이로 순발력 향상',
      category: 'cardio',
      duration: 20,
      intensity: 'high',
      frequency: 'daily',
      steps: [
        '안전한 공 선택하기',
        '적절한 공간 확보하기',
        '공 던지기와 가져오기',
        '놀이 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 공을 선택하세요',
        '과도한 놀이를 피하세요',
        '정기적으로 놀이하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '수영',
      description: '수영으로 전신 근력과 심폐 기능 향상',
      category: 'cardio',
      duration: 15,
      intensity: 'high',
      frequency: 'weekly',
      steps: [
        '안전한 수영장 선택',
        '수영 전 준비 운동',
        '점진적으로 수영하기',
        '수영 후 정리 운동'
      ],
      tips: [
        '강아지가 편안해하는 수영장을 선택하세요',
        '과도한 수영을 피하세요',
        '정기적으로 수영하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '훈련 놀이',
      description: '기본 명령어 훈련으로 정신적 자극',
      category: 'mental',
      duration: 15,
      intensity: 'medium',
      frequency: 'daily',
      steps: [
        '기본 명령어 선택',
        '일관된 명령어 사용',
        '보상 시스템 구축',
        '정기적인 훈련'
      ],
      tips: [
        '강아지가 편안해하는 명령어를 선택하세요',
        '과도한 훈련을 피하세요',
        '정기적으로 훈련하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '스트레칭',
      description: '근육 이완과 유연성 향상',
      category: 'flexibility',
      duration: 10,
      intensity: 'low',
      frequency: 'daily',
      steps: [
        '안전한 스트레칭 자세',
        '점진적으로 스트레칭',
        '호흡 조절하기',
        '스트레칭 후 정리'
      ],
      tips: [
        '강아지가 편안해하는 스트레칭을 선택하세요',
        '과도한 스트레칭을 피하세요',
        '정기적으로 스트레칭하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '사회화 활동',
      description: '다른 강아지와의 만남으로 사회성 향상',
      category: 'social',
      duration: 30,
      intensity: 'medium',
      frequency: 'weekly',
      steps: [
        '안전한 만남 장소 선택',
        '다른 강아지와 만나기',
        '적절한 상호작용하기',
        '만남 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 만남을 선택하세요',
        '과도한 사회화를 피하세요',
        '정기적으로 사회화하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '장애물 훈련',
      description: '장애물을 이용한 균형과 조화 능력 향상',
      category: 'strength',
      duration: 20,
      intensity: 'medium',
      frequency: 'weekly',
      steps: [
        '안전한 장애물 선택',
        '점진적으로 장애물 통과',
        '균형과 조화 연습',
        '훈련 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 장애물을 선택하세요',
        '과도한 훈련을 피하세요',
        '정기적으로 훈련하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '냄새 찾기 놀이',
      description: '냄새를 이용한 정신적 자극과 탐색 능력 향상',
      category: 'mental',
      duration: 15,
      intensity: 'low',
      frequency: 'daily',
      steps: [
        '안전한 냄새 선택',
        '냄새 숨기기',
        '강아지가 냄새 찾기',
        '찾기 후 보상하기'
      ],
      tips: [
        '강아지가 편안해하는 냄새를 선택하세요',
        '과도한 놀이를 피하세요',
        '정기적으로 놀이하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedEntries = localStorage.getItem('exerciseEntries')
    const savedPlans = localStorage.getItem('exercisePlans')
    
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries))
      } catch (e) {}
    }
    
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans))
      } catch (e) {
        setPlans(initialPlans)
      }
    } else {
      setPlans(initialPlans)
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('exerciseEntries', JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('exercisePlans', JSON.stringify(plans))
    }
  }, [plans])

  const addEntry = () => {
    if (!newEntry.type) return

    const entry: ExerciseEntry = {
      id: Date.now().toString(),
      ...newEntry
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: 30,
      intensity: 'medium',
      notes: ''
    })
  }

  const togglePlan = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { 
            ...plan, 
            completed: !plan.completed,
            date: !plan.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : plan
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardio': return 'text-red-600 bg-red-100'
      case 'strength': return 'text-blue-600 bg-blue-100'
      case 'flexibility': return 'text-green-600 bg-green-100'
      case 'mental': return 'text-purple-600 bg-purple-100'
      case 'social': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'cardio': return '유산소'
      case 'strength': return '근력'
      case 'flexibility': return '유연성'
      case 'mental': return '정신'
      case 'social': return '사회성'
      default: return category
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getIntensityText = (intensity: string) => {
    switch (intensity) {
      case 'low': return '낮음'
      case 'medium': return '보통'
      case 'high': return '높음'
      default: return intensity
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

  const completedPlans = plans.filter(plan => plan.completed).length
  const totalPlans = plans.length
  const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0)
  const highIntensityEntries = entries.filter(entry => entry.intensity === 'high').length
  const totalEntries = entries.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-10 h-10 text-green-600 mr-3" />
            운동 루틴 플래너
          </h1>
          <p className="text-xl text-gray-600">견종별 맞춤 운동 루틴 계획</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalPlans}개</p>
            <p className="text-sm text-gray-600">운동 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedPlans}개</p>
            <p className="text-sm text-gray-600">완료된 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{totalDuration}분</p>
            <p className="text-sm text-gray-600">총 운동 시간</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highIntensityEntries}회</p>
            <p className="text-sm text-gray-600">고강도 운동</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 계획</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(plan.category)}`}>
                            {getCategoryText(plan.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getIntensityColor(plan.intensity)}`}>
                            {getIntensityText(plan.intensity)}
                          </span>
                          <span className="text-blue-600">{plan.duration}분</span>
                          <span className="text-purple-600">{getFrequencyText(plan.frequency)}</span>
                          {plan.date && (
                            <span className="text-green-600">완료: {plan.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => togglePlan(plan.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          plan.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">단계</h4>
                        <ol className="text-sm text-gray-600 space-y-1">
                          {plan.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plan.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">운동 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 날짜</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 종류</label>
                    <input
                      type="text"
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                      placeholder="운동 종류 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 시간 (분)</label>
                    <input
                      type="number"
                      value={newEntry.duration}
                      onChange={(e) => setNewEntry({...newEntry, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="180"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">운동 강도</label>
                    <select
                      value={newEntry.intensity}
                      onChange={(e) => setNewEntry({...newEntry, intensity: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    rows={3}
                    placeholder="운동 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addEntry}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  운동 기록 추가
                </button>
              </div>

              {entries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 운동 기록</h3>
                  {entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.type}</p>
                          <p className="text-sm text-gray-600">{entry.date}</p>
                          <p className="text-sm text-gray-600">
                            {entry.duration}분 • {getIntensityText(entry.intensity)} 강도
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getIntensityColor(entry.intensity)}`}>
                          {getIntensityText(entry.intensity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏃‍♂️ 운동 루틴 플래너 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 운동을 선택하세요</li>
                <li>• 일관성 있게 운동하세요</li>
                <li>• 정기적으로 운동하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 운동을 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 이상 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}