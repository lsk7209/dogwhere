'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserPlus, CheckCircle, Clock, AlertTriangle, Award } from 'lucide-react'

interface Milestone {
  id: string
  name: string
  description: string
  category: 'basic' | 'advanced' | 'behavior' | 'environment'
  priority: 'high' | 'medium' | 'low'
  targetDate: string
  completed: boolean
  progress: number
  completedDate?: string
}

interface SocializationRecord {
  id: string
  date: string
  milestoneId: string
  activity: string
  success: boolean
  notes: string
}

export default function DogSocializationMilestoneTrackerPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [records, setRecords] = useState<SocializationRecord[]>([])
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    category: 'basic' as 'basic' | 'advanced' | 'behavior' | 'environment',
    priority: 'medium' as 'high' | 'medium' | 'low',
    targetDate: ''
  })
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    milestoneId: '',
    activity: '',
    success: false,
    notes: ''
  })

  const initialMilestones: Milestone[] = [
    {
      id: '1',
      name: '낯선 사람과의 첫 만남',
      description: '낯선 사람과 안전하게 상호작용하기',
      category: 'basic',
      priority: 'high',
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '2',
      name: '다른 강아지와의 놀이',
      description: '다른 강아지와 안전하게 놀기',
      category: 'basic',
      priority: 'high',
      targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '3',
      name: '새로운 환경 적응',
      description: '새로운 장소에 적응하기',
      category: 'environment',
      priority: 'medium',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '4',
      name: '소음에 대한 적응',
      description: '일상적인 소음에 적응하기',
      category: 'behavior',
      priority: 'medium',
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    },
    {
      id: '5',
      name: '대중교통 이용',
      description: '버스, 지하철 등 대중교통 이용하기',
      category: 'advanced',
      priority: 'low',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      progress: 0
    }
  ]

  useEffect(() => {
    const savedMilestones = localStorage.getItem('socializationMilestones')
    const savedRecords = localStorage.getItem('socializationRecords')
    
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
      localStorage.setItem('socializationMilestones', JSON.stringify(milestones))
    }
  }, [milestones])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('socializationRecords', JSON.stringify(records))
    }
  }, [records])

  const addMilestone = () => {
    if (!newMilestone.name || !newMilestone.targetDate) return

    const milestone: Milestone = {
      id: Date.now().toString(),
      ...newMilestone,
      completed: false,
      progress: 0
    }
    setMilestones([milestone, ...milestones])
    setNewMilestone({
      name: '',
      description: '',
      category: 'basic',
      priority: 'medium',
      targetDate: ''
    })
  }

  const addRecord = () => {
    if (!newRecord.milestoneId || !newRecord.activity) return

    const record: SocializationRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      milestoneId: '',
      activity: '',
      success: false,
      notes: ''
    })
  }

  const updateMilestoneProgress = (milestoneId: string, progress: number) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { 
            ...milestone, 
            progress: Math.max(0, Math.min(100, progress)),
            completed: progress >= 100,
            completedDate: progress >= 100 ? new Date().toISOString().split('T')[0] : undefined
          } 
        : milestone
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-blue-600 bg-blue-100'
      case 'advanced': return 'text-purple-600 bg-purple-100'
      case 'behavior': return 'text-green-600 bg-green-100'
      case 'environment': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'basic': return '기본'
      case 'advanced': return '고급'
      case 'behavior': return '행동'
      case 'environment': return '환경'
      default: return category
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return priority
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const isOverdue = (targetDate: string) => {
    return new Date(targetDate) < new Date()
  }

  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter(milestone => milestone.completed).length
  const overdueMilestones = milestones.filter(milestone => !milestone.completed && isOverdue(milestone.targetDate)).length
  const averageProgress = milestones.length > 0 ? milestones.reduce((sum, milestone) => sum + milestone.progress, 0) / milestones.length : 0
  const totalRecords = records.length
  const successfulRecords = records.filter(record => record.success).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <UserPlus className="w-10 h-10 text-blue-600 mr-3" />
            사회화 마일스톤 추적기
          </h1>
          <p className="text-xl text-gray-600">사회화 훈련의 단계별 성취도를 기록하고 관리</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMilestones}개</p>
            <p className="text-sm text-gray-600">마일스톤</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedMilestones}개</p>
            <p className="text-sm text-gray-600">완료된 마일스톤</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{averageProgress.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">평균 진행률</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{totalRecords}회</p>
            <p className="text-sm text-gray-600">훈련 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{overdueMilestones}개</p>
            <p className="text-sm text-gray-600">연체된 마일스톤</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 마일스톤 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">마일스톤명</label>
                    <input
                      type="text"
                      value={newMilestone.name}
                      onChange={(e) => setNewMilestone({...newMilestone, name: e.target.value})}
                      placeholder="예: 낯선 사람과의 첫 만남"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newMilestone.category}
                      onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="basic">기본</option>
                      <option value="advanced">고급</option>
                      <option value="behavior">행동</option>
                      <option value="environment">환경</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                    <select
                      value={newMilestone.priority}
                      onChange={(e) => setNewMilestone({...newMilestone, priority: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="high">높음</option>
                      <option value="medium">보통</option>
                      <option value="low">낮음</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">목표 날짜</label>
                    <input
                      type="date"
                      value={newMilestone.targetDate}
                      onChange={(e) => setNewMilestone({...newMilestone, targetDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    rows={2}
                    placeholder="마일스톤에 대한 상세 설명"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addMilestone}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  마일스톤 추가
                </button>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className={`border-2 rounded-lg p-6 ${
                    isOverdue(milestone.targetDate) && !milestone.completed 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{milestone.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(milestone.category)}`}>
                            {getCategoryText(milestone.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(milestone.priority)}`}>
                            {getPriorityText(milestone.priority)}
                          </span>
                          <span className="text-gray-500">목표: {milestone.targetDate}</span>
                          {milestone.completedDate && (
                            <span className="text-green-600">완료: {milestone.completedDate}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getProgressColor(milestone.progress)}`}>
                          {milestone.progress}%
                        </span>
                        {milestone.completed && (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">진행률</span>
                        <span className="text-sm text-gray-600">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={milestone.progress}
                        onChange={(e) => updateMilestoneProgress(milestone.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">{milestone.progress}%</span>
                    </div>
                    
                    {isOverdue(milestone.targetDate) && !milestone.completed && (
                      <p className="text-red-600 font-semibold mt-2">⚠️ 마일스톤 연체됨</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 훈련 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">마일스톤 선택</label>
                    <select
                      value={newRecord.milestoneId}
                      onChange={(e) => setNewRecord({...newRecord, milestoneId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">마일스톤 선택</option>
                      {milestones.map((milestone) => (
                        <option key={milestone.id} value={milestone.id}>
                          {milestone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">훈련 활동</label>
                  <input
                    type="text"
                    value={newRecord.activity}
                    onChange={(e) => setNewRecord({...newRecord, activity: e.target.value})}
                    placeholder="예: 공원에서 낯선 사람과 만남"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="success"
                    checked={newRecord.success}
                    onChange={(e) => setNewRecord({...newRecord, success: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="success" className="text-sm text-gray-700">훈련 성공</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="훈련 과정, 강아지 반응, 개선점 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  훈련 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 훈련 기록</h3>
                  {records.slice(0, 5).map((record) => {
                    const milestone = milestones.find(m => m.id === record.milestoneId)
                    return (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {milestone?.name || '알 수 없는 마일스톤'}
                            </p>
                            <p className="text-sm text-gray-600">{record.date}</p>
                            <p className="text-sm text-gray-600">활동: {record.activity}</p>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded ${
                              record.success 
                                ? 'text-green-600 bg-green-100' 
                                : 'text-red-600 bg-red-100'
                            }`}>
                              {record.success ? '성공' : '실패'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">👥 사회화 마일스톤 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 단계별로 천천히 진행하세요</li>
                <li>• 긍정적인 강화를 사용하세요</li>
                <li>• 강아지의 페이스에 맞추세요</li>
                <li>• 일관성 있게 훈련하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 무리한 훈련은 역효과를 낼 수 있습니다</li>
                <li>• 전문가의 도움을 받으세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
