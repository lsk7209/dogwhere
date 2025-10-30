'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react'

interface StressReliefMethod {
  id: string
  name: string
  description: string
  category: 'physical' | 'mental' | 'social' | 'environmental' | 'medical'
  duration: 'short' | 'medium' | 'long'
  difficulty: 'easy' | 'medium' | 'hard'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface StressRecord {
  id: string
  date: string
  method: string
  duration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogStressReliefPage() {
  const [methods, setMethods] = useState<StressReliefMethod[]>([])
  const [records, setRecords] = useState<StressRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    method: '',
    duration: 15,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialMethods: StressReliefMethod[] = [
    {
      id: '1',
      name: '마사지',
      description: '강아지에게 마사지를 해주어 스트레스를 해소하는 방법',
      category: 'physical',
      duration: 'short',
      difficulty: 'easy',
      steps: [
        '강아지가 편안한 자세로 앉거나 눕게 하기',
        '부드럽게 마사지하기',
        '마사지 후 정리하기',
        '마사지 효과 확인하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 마사지하세요',
        '과도한 자극을 피하세요',
        '정기적으로 마사지를 해주세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '산책',
      description: '강아지와 함께 산책을 하여 스트레스를 해소하는 방법',
      category: 'physical',
      duration: 'medium',
      difficulty: 'easy',
      steps: [
        '산책 준비하기',
        '안전한 산책로 선택하기',
        '산책하기',
        '산책 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 산책하세요',
        '과도한 자극을 피하세요',
        '정기적으로 산책을 하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '놀이',
      description: '강아지와 함께 놀이를 하여 스트레스를 해소하는 방법',
      category: 'mental',
      duration: 'short',
      difficulty: 'easy',
      steps: [
        '놀이 준비하기',
        '안전한 놀이 환경 조성하기',
        '놀이하기',
        '놀이 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 놀이하세요',
        '과도한 자극을 피하세요',
        '정기적으로 놀이를 하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '음악 감상',
      description: '강아지와 함께 음악을 감상하여 스트레스를 해소하는 방법',
      category: 'mental',
      duration: 'medium',
      difficulty: 'easy',
      steps: [
        '음악 준비하기',
        '편안한 환경 조성하기',
        '음악 감상하기',
        '음악 감상 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 음악을 감상하세요',
        '과도한 자극을 피하세요',
        '정기적으로 음악을 감상하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '명상',
      description: '강아지와 함께 명상을 하여 스트레스를 해소하는 방법',
      category: 'mental',
      duration: 'long',
      difficulty: 'hard',
      steps: [
        '명상 준비하기',
        '편안한 환경 조성하기',
        '명상하기',
        '명상 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 명상하세요',
        '과도한 자극을 피하세요',
        '정기적으로 명상을 하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '환경 개선',
      description: '강아지의 환경을 개선하여 스트레스를 해소하는 방법',
      category: 'environmental',
      duration: 'long',
      difficulty: 'medium',
      steps: [
        '환경 파악하기',
        '환경 개선 계획 세우기',
        '환경 개선하기',
        '환경 개선 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 환경을 개선하세요',
        '과도한 자극을 피하세요',
        '정기적으로 환경을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '사회적 상호작용',
      description: '강아지와 사회적 상호작용을 하여 스트레스를 해소하는 방법',
      category: 'social',
      duration: 'medium',
      difficulty: 'medium',
      steps: [
        '사회적 상호작용 준비하기',
        '안전한 환경 조성하기',
        '사회적 상호작용하기',
        '사회적 상호작용 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 상호작용하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상호작용을 하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '의료적 도움',
      description: '의료적 도움을 받아 스트레스를 해소하는 방법',
      category: 'medical',
      duration: 'long',
      difficulty: 'hard',
      steps: [
        '의료적 도움 준비하기',
        '안전한 환경 조성하기',
        '의료적 도움 받기',
        '의료적 도움 후 정리하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 도움을 받으세요',
        '과도한 자극을 피하세요',
        '정기적으로 도움을 받으세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMethods = localStorage.getItem('stressReliefMethods')
    const savedRecords = localStorage.getItem('stressRecords')
    
    if (savedMethods) {
      try {
        setMethods(JSON.parse(savedMethods))
      } catch (e) {
        setMethods(initialMethods)
      }
    } else {
      setMethods(initialMethods)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (methods.length > 0) {
      localStorage.setItem('stressReliefMethods', JSON.stringify(methods))
    }
  }, [methods])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('stressRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleMethod = (methodId: string) => {
    setMethods(methods.map(method => 
      method.id === methodId 
        ? { 
            ...method, 
            completed: !method.completed,
            date: !method.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : method
    ))
  }

  const addRecord = () => {
    if (!newRecord.method) return

    const record: StressRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      method: '',
      duration: 15,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-red-600 bg-red-100'
      case 'mental': return 'text-blue-600 bg-blue-100'
      case 'social': return 'text-green-600 bg-green-100'
      case 'environmental': return 'text-purple-600 bg-purple-100'
      case 'medical': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'physical': return '신체적'
      case 'mental': return '정신적'
      case 'social': return '사회적'
      case 'environmental': return '환경적'
      case 'medical': return '의료적'
      default: return category
    }
  }

  const getDurationColor = (duration: string) => {
    switch (duration) {
      case 'short': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'long': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'short': return '짧음'
      case 'medium': return '보통'
      case 'long': return '김'
      default: return duration
    }
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

  const getResultColor = (result: string) => {
    switch (result) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return result
    }
  }

  const completedMethods = methods.filter(method => method.completed).length
  const totalMethods = methods.length
  const easyMethods = methods.filter(method => method.difficulty === 'easy').length
  const excellentRecords = records.filter(record => record.result === 'excellent').length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-pink-600 mr-3" />
            스트레스 해소 방법
          </h1>
          <p className="text-xl text-gray-600">반려견 스트레스 완화와 휴식 방법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMethods}개</p>
            <p className="text-sm text-gray-600">해소 방법</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedMethods}개</p>
            <p className="text-sm text-gray-600">완료된 방법</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{easyMethods}개</p>
            <p className="text-sm text-gray-600">쉬운 방법</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">스트레스 해소 방법</h2>
              <div className="space-y-4">
                {methods.map((method) => (
                  <div key={method.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(method.category)}`}>
                            {getCategoryText(method.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getDurationColor(method.duration)}`}>
                            {getDurationText(method.duration)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(method.difficulty)}`}>
                            {getDifficultyText(method.difficulty)}
                          </span>
                          {method.date && (
                            <span className="text-green-600">완료: {method.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMethod(method.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          method.completed
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
                          {method.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {method.tips.map((tip, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">스트레스 해소 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">해소 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">해소 방법</label>
                    <select
                      value={newRecord.method}
                      onChange={(e) => setNewRecord({...newRecord, method: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">방법 선택</option>
                      {methods.map((method) => (
                        <option key={method.id} value={method.name}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">해소 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">해소 결과</label>
                    <select
                      value={newRecord.result}
                      onChange={(e) => setNewRecord({...newRecord, result: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="excellent">매우 좋음</option>
                      <option value="good">좋음</option>
                      <option value="fair">보통</option>
                      <option value="poor">나쁨</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="해소 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  스트레스 해소 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 스트레스 해소 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.method}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}분
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getResultColor(record.result)}`}>
                          {getResultText(record.result)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💖 스트레스 해소 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 해소하세요</li>
                <li>• 일관성 있게 해소하세요</li>
                <li>• 정기적으로 해소하세요</li>
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