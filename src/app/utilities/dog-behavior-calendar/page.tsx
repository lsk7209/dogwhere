'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface BehaviorEntry {
  id: string
  date: string
  behavior: string
  notes: string
}

interface BehaviorPattern {
  id: string
  name: string
  description: string
  category: 'positive' | 'negative' | 'neutral' | 'training' | 'health'
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasional'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
}

export default function DogBehaviorCalendarPage() {
  const [entries, setEntries] = useState<BehaviorEntry[]>([])
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    behavior: '',
    notes: ''
  })

  const initialPatterns: BehaviorPattern[] = [
    {
      id: '1',
      name: '긍정적 행동',
      description: '강아지의 긍정적인 행동 패턴',
      category: 'positive',
      frequency: 'daily',
      steps: [
        '긍정적 행동 관찰하기',
        '행동의 원인 파악하기',
        '행동을 강화하기',
        '일관성 있게 대응하기'
      ],
      tips: [
        '강아지가 편안해하는 행동을 찾으세요',
        '과도한 자극을 피하세요',
        '정기적으로 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '부정적 행동',
      description: '강아지의 부정적인 행동 패턴',
      category: 'negative',
      frequency: 'daily',
      steps: [
        '부정적 행동 관찰하기',
        '행동의 원인 파악하기',
        '행동을 교정하기',
        '일관성 있게 대응하기'
      ],
      tips: [
        '강아지가 불안해하는 행동을 찾으세요',
        '과도한 처벌을 피하세요',
        '정기적으로 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '훈련 행동',
      description: '강아지의 훈련 관련 행동 패턴',
      category: 'training',
      frequency: 'daily',
      steps: [
        '훈련 행동 관찰하기',
        '훈련 효과 확인하기',
        '훈련 방법 조정하기',
        '일관성 있게 훈련하기'
      ],
      tips: [
        '강아지가 편안해하는 훈련을 찾으세요',
        '과도한 훈련을 피하세요',
        '정기적으로 훈련하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '건강 관련 행동',
      description: '강아지의 건강과 관련된 행동 패턴',
      category: 'health',
      frequency: 'daily',
      steps: [
        '건강 행동 관찰하기',
        '건강 상태 확인하기',
        '건강 관리하기',
        '정기적으로 점검하기'
      ],
      tips: [
        '강아지가 편안해하는 건강 관리를 찾으세요',
        '과도한 건강 관리를 피하세요',
        '정기적으로 건강을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '일상 행동',
      description: '강아지의 일상적인 행동 패턴',
      category: 'neutral',
      frequency: 'daily',
      steps: [
        '일상 행동 관찰하기',
        '행동 패턴 파악하기',
        '행동을 이해하기',
        '일관성 있게 대응하기'
      ],
      tips: [
        '강아지가 편안해하는 일상을 찾으세요',
        '과도한 간섭을 피하세요',
        '정기적으로 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '사회적 행동',
      description: '강아지의 사회적 행동 패턴',
      category: 'positive',
      frequency: 'weekly',
      steps: [
        '사회적 행동 관찰하기',
        '사회적 상호작용 확인하기',
        '사회적 행동 강화하기',
        '일관성 있게 대응하기'
      ],
      tips: [
        '강아지가 편안해하는 사회적 행동을 찾으세요',
        '과도한 사회화를 피하세요',
        '정기적으로 사회화하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '놀이 행동',
      description: '강아지의 놀이 관련 행동 패턴',
      category: 'positive',
      frequency: 'daily',
      steps: [
        '놀이 행동 관찰하기',
        '놀이 선호도 파악하기',
        '놀이 환경 조성하기',
        '일관성 있게 놀이하기'
      ],
      tips: [
        '강아지가 편안해하는 놀이를 찾으세요',
        '과도한 놀이를 피하세요',
        '정기적으로 놀이하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '스트레스 행동',
      description: '강아지의 스트레스 관련 행동 패턴',
      category: 'negative',
      frequency: 'daily',
      steps: [
        '스트레스 행동 관찰하기',
        '스트레스 원인 파악하기',
        '스트레스 해소하기',
        '일관성 있게 대응하기'
      ],
      tips: [
        '강아지가 불안해하는 행동을 찾으세요',
        '과도한 스트레스를 피하세요',
        '정기적으로 스트레스를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedEntries = localStorage.getItem('behaviorEntries')
    const savedPatterns = localStorage.getItem('behaviorPatterns')
    
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries))
      } catch (e) {}
    }
    
    if (savedPatterns) {
      try {
        setPatterns(JSON.parse(savedPatterns))
      } catch (e) {
        setPatterns(initialPatterns)
      }
    } else {
      setPatterns(initialPatterns)
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('behaviorEntries', JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    if (patterns.length > 0) {
      localStorage.setItem('behaviorPatterns', JSON.stringify(patterns))
    }
  }, [patterns])

  const addEntry = () => {
    if (!newEntry.behavior) return

    const entry: BehaviorEntry = {
      id: Date.now().toString(),
      ...newEntry
    }
    setEntries([entry, ...entries])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      behavior: '',
      notes: ''
    })
  }

  const togglePattern = (patternId: string) => {
    setPatterns(patterns.map(pattern => 
      pattern.id === patternId 
        ? { 
            ...pattern, 
            completed: !pattern.completed,
            date: !pattern.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : pattern
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      case 'training': return 'text-blue-600 bg-blue-100'
      case 'health': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'positive': return '긍정적'
      case 'negative': return '부정적'
      case 'neutral': return '중립적'
      case 'training': return '훈련'
      case 'health': return '건강'
      default: return category
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'occasional': return '가끔'
      default: return frequency
    }
  }

  const completedPatterns = patterns.filter(pattern => pattern.completed).length
  const totalPatterns = patterns.length
  const positivePatterns = patterns.filter(pattern => pattern.category === 'positive').length
  const totalEntries = entries.length
  const recentEntries = entries.filter(entry => 
    new Date(entry.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-10 h-10 text-blue-600 mr-3" />
            행동 패턴 캘린더
          </h1>
          <p className="text-xl text-gray-600">강아지 행동 패턴을 캘린더로 시각화</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalPatterns}개</p>
            <p className="text-sm text-gray-600">행동 패턴</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedPatterns}개</p>
            <p className="text-sm text-gray-600">완료된 패턴</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{positivePatterns}개</p>
            <p className="text-sm text-gray-600">긍정적 패턴</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{recentEntries}개</p>
            <p className="text-sm text-gray-600">최근 기록</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 패턴</h2>
              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{pattern.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(pattern.category)}`}>
                            {getCategoryText(pattern.category)}
                          </span>
                          <span className="text-blue-600">{getFrequencyText(pattern.frequency)}</span>
                          {pattern.date && (
                            <span className="text-green-600">완료: {pattern.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => togglePattern(pattern.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          pattern.completed
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
                          {pattern.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pattern.tips.map((tip, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">행동 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관찰 날짜</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">행동 종류</label>
                    <input
                      type="text"
                      value={newEntry.behavior}
                      onChange={(e) => setNewEntry({...newEntry, behavior: e.target.value})}
                      placeholder="행동 종류 입력"
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
                    placeholder="행동 관찰 내용이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addEntry}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  행동 기록 추가
                </button>
              </div>

              {entries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 행동 기록</h3>
                  {entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{entry.behavior}</p>
                          <p className="text-sm text-gray-600">{entry.date}</p>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <span className="text-blue-600 text-sm">기록됨</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 행동 패턴 캘린더 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 행동을 관찰하세요</li>
                <li>• 일관성 있게 관찰하세요</li>
                <li>• 정기적으로 행동을 확인하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 관찰을 피하세요</li>
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