'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Pill, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react'

interface MedicationEntry {
  id: string
  date: string
  time: string
  medication: string
  dosage: string
  notes: string
}

interface MedicationSchedule {
  id: string
  name: string
  description: string
  category: 'daily' | 'weekly' | 'monthly' | 'as_needed'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
}

export default function DogMedicationTrackerPage() {
  const [entries, setEntries] = useState<MedicationEntry[]>([])
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    medication: '',
    dosage: '',
    notes: ''
  })

  const initialSchedules: MedicationSchedule[] = [
    {
      id: '1',
      name: '일일 투약',
      description: '매일 투약해야 하는 약물 관리',
      category: 'daily',
      importance: 'high',
      steps: [
        '투약 시간 정하기',
        '투약 방법 확인하기',
        '투약하기',
        '투약 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 투약하세요',
        '과도한 자극을 피하세요',
        '정기적으로 투약하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '주간 투약',
      description: '주간에 투약해야 하는 약물 관리',
      category: 'weekly',
      importance: 'high',
      steps: [
        '투약 일정 정하기',
        '투약 방법 확인하기',
        '투약하기',
        '투약 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 투약하세요',
        '과도한 자극을 피하세요',
        '정기적으로 투약하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '월간 투약',
      description: '월간에 투약해야 하는 약물 관리',
      category: 'monthly',
      importance: 'medium',
      steps: [
        '투약 일정 정하기',
        '투약 방법 확인하기',
        '투약하기',
        '투약 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 투약하세요',
        '과도한 자극을 피하세요',
        '정기적으로 투약하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '필요시 투약',
      description: '필요할 때만 투약하는 약물 관리',
      category: 'as_needed',
      importance: 'medium',
      steps: [
        '투약 필요성 확인하기',
        '투약 방법 확인하기',
        '투약하기',
        '투약 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 투약하세요',
        '과도한 자극을 피하세요',
        '정기적으로 투약하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '투약 기록 관리',
      description: '투약 기록을 체계적으로 관리하는 방법',
      category: 'daily',
      importance: 'high',
      steps: [
        '투약 기록 방법 정하기',
        '투약 기록하기',
        '투약 기록 정리하기',
        '투약 기록 유지하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 기록하세요',
        '과도한 자극을 피하세요',
        '정기적으로 기록하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '투약 부작용 관리',
      description: '투약 후 부작용을 관리하는 방법',
      category: 'daily',
      importance: 'high',
      steps: [
        '부작용 관찰하기',
        '부작용 대응하기',
        '부작용 기록하기',
        '부작용 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 부작용을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '투약 도구 관리',
      description: '투약에 필요한 도구를 관리하는 방법',
      category: 'daily',
      importance: 'medium',
      steps: [
        '투약 도구 준비하기',
        '투약 도구 사용하기',
        '투약 도구 정리하기',
        '투약 도구 관리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 도구를 관리하세요',
        '과도한 자극을 피하세요',
        '정기적으로 도구를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '응급 투약 대비',
      description: '응급상황에서 투약할 수 있도록 대비하는 방법',
      category: 'as_needed',
      importance: 'high',
      steps: [
        '응급 투약 계획 세우기',
        '응급 투약 방법 숙지하기',
        '응급 투약 연습하기',
        '응급 투약 대비하기'
      ],
      tips: [
        '강아지가 안전한 방법으로 대비하세요',
        '과도한 대비를 피하세요',
        '정기적으로 응급 투약을 대비하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedEntries = localStorage.getItem('medicationEntries')
    const savedSchedules = localStorage.getItem('medicationSchedules')
    
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries))
      } catch (e) {}
    }
    
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules))
      } catch (e) {
        setSchedules(initialSchedules)
      }
    } else {
      setSchedules(initialSchedules)
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('medicationEntries', JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    if (schedules.length > 0) {
      localStorage.setItem('medicationSchedules', JSON.stringify(schedules))
    }
  }, [schedules])

  const addEntry = () => {
    if (!newEntry.medication) return

    const entry: MedicationEntry = {
      id: Date.now().toString(),
      ...newEntry
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      time: '',
      medication: '',
      dosage: '',
      notes: ''
    })
  }

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { 
            ...schedule, 
            completed: !schedule.completed,
            date: !schedule.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : schedule
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'text-red-600 bg-red-100'
      case 'weekly': return 'text-blue-600 bg-blue-100'
      case 'monthly': return 'text-green-600 bg-green-100'
      case 'as_needed': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'daily': return '일일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'as_needed': return '필요시'
      default: return category
    }
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

  const completedSchedules = schedules.filter(schedule => schedule.completed).length
  const totalSchedules = schedules.length
  const highImportanceSchedules = schedules.filter(schedule => schedule.importance === 'high').length
  const totalEntries = entries.length
  const todayEntries = entries.filter(entry => 
    new Date(entry.date).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Pill className="w-10 h-10 text-red-600 mr-3" />
            투약 관리 추적기
          </h1>
          <p className="text-xl text-gray-600">약물 투여 일정과 기록 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Pill className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSchedules}개</p>
            <p className="text-sm text-gray-600">투약 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedSchedules}개</p>
            <p className="text-sm text-gray-600">완료된 계획</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceSchedules}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{todayEntries}회</p>
            <p className="text-sm text-gray-600">오늘 투약</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">투약 계획</h2>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{schedule.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{schedule.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(schedule.category)}`}>
                            {getCategoryText(schedule.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(schedule.importance)}`}>
                            {getImportanceText(schedule.importance)}
                          </span>
                          {schedule.date && (
                            <span className="text-green-600">완료: {schedule.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSchedule(schedule.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          schedule.completed
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
                          {schedule.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {schedule.tips.map((tip, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">투약 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">투약 날짜</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">투약 시간</label>
                    <input
                      type="time"
                      value={newEntry.time}
                      onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">약물명</label>
                    <input
                      type="text"
                      value={newEntry.medication}
                      onChange={(e) => setNewEntry({...newEntry, medication: e.target.value})}
                      placeholder="약물명 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">투약량</label>
                    <input
                      type="text"
                      value={newEntry.dosage}
                      onChange={(e) => setNewEntry({...newEntry, dosage: e.target.value})}
                      placeholder="투약량 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    rows={3}
                    placeholder="투약 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addEntry}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  투약 기록 추가
                </button>
              </div>

              {entries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 투약 기록</h3>
                  {entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.medication}</p>
                          <p className="text-sm text-gray-600">{entry.date} {entry.time}</p>
                          <p className="text-sm text-gray-600">
                            투약량: {entry.dosage}
                          </p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">💊 투약 관리 추적기 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 투약하세요</li>
                <li>• 일관성 있게 투약하세요</li>
                <li>• 정기적으로 투약하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 자극을 피하세요</li>
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