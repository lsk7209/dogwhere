'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface DevelopmentMilestone {
  id: string
  name: string
  description: string
  age: '0-2weeks' | '2-4weeks' | '4-8weeks' | '8-12weeks' | '3-6months' | '6-12months' | '1-2years' | '2+years'
  category: 'physical' | 'mental' | 'social' | 'behavioral' | 'health'
  importance: 'high' | 'medium' | 'low'
  characteristics: string[]
  care_tips: string[]
  warning_signs: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface DevelopmentRecord {
  id: string
  date: string
  milestone: string
  age: string
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function PuppyDevelopmentMilestonesPage() {
  const [milestones, setMilestones] = useState<DevelopmentMilestone[]>([])
  const [records, setRecords] = useState<DevelopmentRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    milestone: '',
    age: '',
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialMilestones: DevelopmentMilestone[] = [
    {
      id: '1',
      name: '신생아기 (0-2주)',
      description: '강아지가 태어나서 2주까지의 발달 단계',
      age: '0-2weeks',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '눈을 뜨지 못함',
        '청각이 발달하지 않음',
        '기본적인 반사만 있음',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '2',
      name: '유아기 (2-4주)',
      description: '강아지가 2주에서 4주까지의 발달 단계',
      age: '2-4weeks',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '눈을 뜨기 시작함',
        '청각이 발달하기 시작함',
        '기본적인 움직임 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '3',
      name: '유치기 (4-8주)',
      description: '강아지가 4주에서 8주까지의 발달 단계',
      age: '4-8weeks',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '눈과 청각이 완전히 발달',
        '걷기 시작',
        '이빨이 나기 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '4',
      name: '유아기 (8-12주)',
      description: '강아지가 8주에서 12주까지의 발달 단계',
      age: '8-12weeks',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '걷기와 뛰기 가능',
        '이빨이 완전히 나기 시작',
        '기본적인 놀이 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '5',
      name: '유년기 (3-6개월)',
      description: '강아지가 3개월에서 6개월까지의 발달 단계',
      age: '3-6months',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '걷기와 뛰기 가능',
        '이빨이 완전히 나기 시작',
        '기본적인 놀이 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '6',
      name: '청소년기 (6-12개월)',
      description: '강아지가 6개월에서 12개월까지의 발달 단계',
      age: '6-12months',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '걷기와 뛰기 가능',
        '이빨이 완전히 나기 시작',
        '기본적인 놀이 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '7',
      name: '성년기 (1-2세)',
      description: '강아지가 1세에서 2세까지의 발달 단계',
      age: '1-2years',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '걷기와 뛰기 가능',
        '이빨이 완전히 나기 시작',
        '기본적인 놀이 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    },
    {
      id: '8',
      name: '성숙기 (2세 이상)',
      description: '강아지가 2세 이상의 발달 단계',
      age: '2+years',
      category: 'physical',
      importance: 'high',
      characteristics: [
        '걷기와 뛰기 가능',
        '이빨이 완전히 나기 시작',
        '기본적인 놀이 시작',
        '어미에게 의존적'
      ],
      care_tips: [
        '따뜻한 환경 유지하기',
        '정기적인 수유하기',
        '청결한 환경 유지하기',
        '어미와의 접촉 유지하기'
      ],
      warning_signs: [
        '체중이 감소하는 경우',
        '수유를 거부하는 경우',
        '비정상적인 소리나 움직임',
        '어미와의 접촉을 거부하는 경우'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedMilestones = localStorage.getItem('developmentMilestones')
    const savedRecords = localStorage.getItem('developmentRecords')
    
    if (savedMilestones) {
      try {
        setMilestones(JSON.parse(savedMilestones))
      } catch (e) {
        setMilestones(initialMilestones)
      }
    } else {
      setMilestones(initialMilestones)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('developmentMilestones', JSON.stringify(milestones))
    }
  }, [milestones])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('developmentRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleMilestone = (milestoneId: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { 
            ...milestone, 
            completed: !milestone.completed,
            date: !milestone.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : milestone
    ))
  }

  const addRecord = () => {
    if (!newRecord.milestone) return

    const record: DevelopmentRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      milestone: '',
      age: '',
      result: 'good',
      notes: ''
    })
  }

  const getAgeText = (age: string) => {
    switch (age) {
      case '0-2weeks': return '0-2주'
      case '2-4weeks': return '2-4주'
      case '4-8weeks': return '4-8주'
      case '8-12weeks': return '8-12주'
      case '3-6months': return '3-6개월'
      case '6-12months': return '6-12개월'
      case '1-2years': return '1-2세'
      case '2+years': return '2세 이상'
      default: return age
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-red-600 bg-red-100'
      case 'mental': return 'text-blue-600 bg-blue-100'
      case 'social': return 'text-green-600 bg-green-100'
      case 'behavioral': return 'text-purple-600 bg-purple-100'
      case 'health': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'physical': return '신체적'
      case 'mental': return '정신적'
      case 'social': return '사회적'
      case 'behavioral': return '행동적'
      case 'health': return '건강'
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

  const completedMilestones = milestones.filter(milestone => milestone.completed).length
  const totalMilestones = milestones.length
  const highImportanceMilestones = milestones.filter(milestone => milestone.importance === 'high').length
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
            <TrendingUp className="w-10 h-10 text-green-600 mr-3" />
            강아지 발달 단계
          </h1>
          <p className="text-xl text-gray-600">강아지 성장 단계별 발달 특징과 주의사항</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMilestones}개</p>
            <p className="text-sm text-gray-600">발달 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedMilestones}개</p>
            <p className="text-sm text-gray-600">완료된 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceMilestones}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">발달 단계</h2>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="text-blue-600">{getAgeText(milestone.age)}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(milestone.category)}`}>
                            {getCategoryText(milestone.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(milestone.importance)}`}>
                            {getImportanceText(milestone.importance)}
                          </span>
                          {milestone.date && (
                            <span className="text-green-600">완료: {milestone.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          milestone.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">특징</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {milestone.characteristics.map((characteristic, index) => (
                            <li key={index}>• {characteristic}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">케어 팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {milestone.care_tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">주의사항</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {milestone.warning_signs.map((sign, index) => (
                            <li key={index}>• {sign}</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">발달 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기록 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">발달 단계</label>
                    <select
                      value={newRecord.milestone}
                      onChange={(e) => setNewRecord({...newRecord, milestone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">단계 선택</option>
                      {milestones.map((milestone) => (
                        <option key={milestone.id} value={milestone.name}>
                          {milestone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연령</label>
                    <select
                      value={newRecord.age}
                      onChange={(e) => setNewRecord({...newRecord, age: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">연령 선택</option>
                      <option value="0-2주">0-2주</option>
                      <option value="2-4주">2-4주</option>
                      <option value="4-8주">4-8주</option>
                      <option value="8-12주">8-12주</option>
                      <option value="3-6개월">3-6개월</option>
                      <option value="6-12개월">6-12개월</option>
                      <option value="1-2세">1-2세</option>
                      <option value="2세 이상">2세 이상</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">발달 결과</label>
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
                    placeholder="발달 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  발달 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 발달 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.milestone}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.age}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 강아지 발달 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 관리하세요</li>
                <li>• 일관성 있게 관리하세요</li>
                <li>• 정기적으로 발달을 확인하세요</li>
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