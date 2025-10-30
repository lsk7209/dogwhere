'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Syringe, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react'

interface VaccinationEntry {
  id: string
  date: string
  vaccine: string
  nextDate?: string
  notes: string
}

interface VaccinationPlan {
  id: string
  name: string
  description: string
  age: string
  importance: 'high' | 'medium' | 'low'
  frequency: 'once' | 'twice' | 'annually'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
}

export default function PuppyVaccinationTrackerPage() {
  const [entries, setEntries] = useState<VaccinationEntry[]>([])
  const [plans, setPlans] = useState<VaccinationPlan[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    vaccine: '',
    nextDate: '',
    notes: ''
  })

  const initialPlans: VaccinationPlan[] = [
    {
      id: '1',
      name: '1차 예방접종',
      description: '강아지 첫 번째 예방접종',
      age: '6-8주',
      importance: 'high',
      frequency: 'once',
      steps: [
        '수의사와 상담하기',
        '예방접종 일정 잡기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '2차 예방접종',
      description: '강아지 두 번째 예방접종',
      age: '10-12주',
      importance: 'high',
      frequency: 'once',
      steps: [
        '1차 접종 후 3-4주 후',
        '수의사와 상담하기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '3차 예방접종',
      description: '강아지 세 번째 예방접종',
      age: '14-16주',
      importance: 'high',
      frequency: 'once',
      steps: [
        '2차 접종 후 3-4주 후',
        '수의사와 상담하기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '광견병 예방접종',
      description: '광견병 예방을 위한 접종',
      age: '12-16주',
      importance: 'high',
      frequency: 'annually',
      steps: [
        '법정 접종 확인하기',
        '수의사와 상담하기',
        '예방접종 받기',
        '접종 증명서 받기'
      ],
      tips: [
        '법정 접종이므로 필수입니다',
        '접종 후 증명서를 보관하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '켄넬코프 예방접종',
      description: '켄넬코프 예방을 위한 접종',
      age: '6-8주',
      importance: 'medium',
      frequency: 'annually',
      steps: [
        '수의사와 상담하기',
        '예방접종 일정 잡기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '파보바이러스 예방접종',
      description: '파보바이러스 예방을 위한 접종',
      age: '6-8주',
      importance: 'high',
      frequency: 'annually',
      steps: [
        '수의사와 상담하기',
        '예방접종 일정 잡기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '디스템퍼 예방접종',
      description: '디스템퍼 예방을 위한 접종',
      age: '6-8주',
      importance: 'high',
      frequency: 'annually',
      steps: [
        '수의사와 상담하기',
        '예방접종 일정 잡기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '아데노바이러스 예방접종',
      description: '아데노바이러스 예방을 위한 접종',
      age: '6-8주',
      importance: 'medium',
      frequency: 'annually',
      steps: [
        '수의사와 상담하기',
        '예방접종 일정 잡기',
        '예방접종 받기',
        '접종 후 관찰하기'
      ],
      tips: [
        '강아지가 건강한 상태에서 접종하세요',
        '접종 후 부작용을 관찰하세요',
        '정기적으로 접종하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedEntries = localStorage.getItem('vaccinationEntries')
    const savedPlans = localStorage.getItem('vaccinationPlans')
    
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
      localStorage.setItem('vaccinationEntries', JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('vaccinationPlans', JSON.stringify(plans))
    }
  }, [plans])

  const addEntry = () => {
    if (!newEntry.vaccine) return

    const entry: VaccinationEntry = {
      id: Date.now().toString(),
      ...newEntry
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      vaccine: '',
      nextDate: '',
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

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return importance
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'once': return '1회'
      case 'twice': return '2회'
      case 'annually': return '연간'
      default: return frequency
    }
  }

  const completedPlans = plans.filter(plan => plan.completed).length
  const totalPlans = plans.length
  const highImportancePlans = plans.filter(plan => plan.importance === 'high').length
  const totalEntries = entries.length
  const upcomingEntries = entries.filter(entry => 
    entry.nextDate && new Date(entry.nextDate) > new Date()
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Syringe className="w-10 h-10 text-red-600 mr-3" />
            강아지 예방접종 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지 예방접종 일정과 기록 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Syringe className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalPlans}개</p>
            <p className="text-sm text-gray-600">예방접종 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedPlans}개</p>
            <p className="text-sm text-gray-600">완료된 접종</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportancePlans}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{upcomingEntries}개</p>
            <p className="text-sm text-gray-600">예정된 접종</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">예방접종 계획</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="text-blue-600">{plan.age}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(plan.importance)}`}>
                            {getImportanceText(plan.importance)}
                          </span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">예방접종 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">접종 날짜</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">백신 종류</label>
                    <input
                      type="text"
                      value={newEntry.vaccine}
                      onChange={(e) => setNewEntry({...newEntry, vaccine: e.target.value})}
                      placeholder="백신 종류 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">다음 접종 예정일</label>
                  <input
                    type="date"
                    value={newEntry.nextDate}
                    onChange={(e) => setNewEntry({...newEntry, nextDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    rows={3}
                    placeholder="접종 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addEntry}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  접종 기록 추가
                </button>
              </div>

              {entries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 접종 기록</h3>
                  {entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.vaccine}</p>
                          <p className="text-sm text-gray-600">{entry.date}</p>
                          {entry.nextDate && (
                            <p className="text-sm text-blue-600">다음 접종: {entry.nextDate}</p>
                          )}
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <span className="text-green-600 text-sm">완료</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💉 강아지 예방접종 추적기 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 건강한 상태에서 접종하세요</li>
                <li>• 일관성 있게 접종하세요</li>
                <li>• 정기적으로 접종하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 접종 후 부작용을 관찰하세요</li>
                <li>• 이상 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 접종 증명서를 보관하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}