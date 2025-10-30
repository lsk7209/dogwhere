'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Puzzle, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react'

interface EnrichmentActivity {
  id: string
  name: string
  description: string
  category: string
  duration: number
  difficulty: number
  engagement: number
  notes: string
}

interface EnrichmentRecord {
  id: string
  date: string
  activityId: string
  duration: number
  success: boolean
  engagement: number
  notes: string
}

export default function DogEnvironmentalEnrichmentTrackerPage() {
  const [activities, setActivities] = useState<EnrichmentActivity[]>([])
  const [records, setRecords] = useState<EnrichmentRecord[]>([])
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category: '',
    duration: 15,
    difficulty: 3,
    engagement: 5,
    notes: ''
  })
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    activityId: '',
    duration: 15,
    success: false,
    engagement: 5,
    notes: ''
  })

  const enrichmentCategories = [
    '퍼즐 장난감',
    '냄새 탐지',
    '음식 퍼즐',
    '신체 활동',
    '정신 자극',
    '사회적 상호작용',
    '새로운 환경',
    '훈련 활동',
    '기타'
  ]

  const difficultyLevels = [
    { value: 1, label: '매우 쉬움', color: 'text-green-600 bg-green-100' },
    { value: 2, label: '쉬움', color: 'text-green-600 bg-green-100' },
    { value: 3, label: '보통', color: 'text-yellow-600 bg-yellow-100' },
    { value: 4, label: '어려움', color: 'text-orange-600 bg-orange-100' },
    { value: 5, label: '매우 어려움', color: 'text-red-600 bg-red-100' }
  ]

  const engagementLevels = [
    { value: 1, label: '전혀 관심 없음', color: 'text-red-600 bg-red-100' },
    { value: 2, label: '거의 관심 없음', color: 'text-red-600 bg-red-100' },
    { value: 3, label: '약간 관심', color: 'text-orange-600 bg-orange-100' },
    { value: 4, label: '관심 있음', color: 'text-yellow-600 bg-yellow-100' },
    { value: 5, label: '많이 관심', color: 'text-green-600 bg-green-100' },
    { value: 6, label: '매우 관심', color: 'text-green-600 bg-green-100' },
    { value: 7, label: '열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 8, label: '매우 열정적', color: 'text-blue-600 bg-blue-100' },
    { value: 9, label: '최고', color: 'text-purple-600 bg-purple-100' },
    { value: 10, label: '극한', color: 'text-purple-600 bg-purple-100' }
  ]

  const initialActivities: EnrichmentActivity[] = [
    {
      id: '1',
      name: '음식 퍼즐',
      description: '음식을 숨긴 퍼즐 장난감으로 놀기',
      category: '음식 퍼즐',
      duration: 20,
      difficulty: 3,
      engagement: 7,
      notes: '강아지가 좋아하는 간식을 사용'
    },
    {
      id: '2',
      name: '냄새 탐지 게임',
      description: '숨겨진 간식을 찾는 냄새 탐지 게임',
      category: '냄새 탐지',
      duration: 15,
      difficulty: 2,
      engagement: 8,
      notes: '다양한 냄새로 난이도 조절'
    },
    {
      id: '3',
      name: '공놀이',
      description: '공을 이용한 다양한 놀이 활동',
      category: '신체 활동',
      duration: 30,
      difficulty: 1,
      engagement: 9,
      notes: '안전한 공 사용, 적절한 휴식 제공'
    },
    {
      id: '4',
      name: '새로운 장소 탐험',
      description: '새로운 환경에서의 탐험 활동',
      category: '새로운 환경',
      duration: 45,
      difficulty: 4,
      engagement: 6,
      notes: '안전한 장소에서 진행, 강아지 페이스에 맞춤'
    }
  ]

  useEffect(() => {
    const savedActivities = localStorage.getItem('enrichmentActivities')
    const savedRecords = localStorage.getItem('enrichmentRecords')
    
    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities))
      } catch (e) {
        setActivities(initialActivities)
      }
    } else {
      setActivities(initialActivities)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('enrichmentActivities', JSON.stringify(activities))
    }
  }, [activities])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('enrichmentRecords', JSON.stringify(records))
    }
  }, [records])

  const addActivity = () => {
    if (!newActivity.name || !newActivity.category) return

    const activity: EnrichmentActivity = {
      id: Date.now().toString(),
      ...newActivity
    }
    setActivities([activity, ...activities])
    setNewActivity({
      name: '',
      description: '',
      category: '',
      duration: 15,
      difficulty: 3,
      engagement: 5,
      notes: ''
    })
  }

  const addRecord = () => {
    if (!newRecord.activityId) return

    const record: EnrichmentRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      activityId: '',
      duration: 15,
      success: false,
      engagement: 5,
      notes: ''
    })
  }

  const getDifficultyColor = (difficulty: number) => {
    const level = difficultyLevels.find(l => l.value === difficulty)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getDifficultyLabel = (difficulty: number) => {
    const level = difficultyLevels.find(l => l.value === difficulty)
    return level ? level.label : '알 수 없음'
  }

  const getEngagementColor = (engagement: number) => {
    const level = engagementLevels.find(l => l.value === engagement)
    return level ? level.color : 'text-gray-600 bg-gray-100'
  }

  const getEngagementLabel = (engagement: number) => {
    const level = engagementLevels.find(l => l.value === engagement)
    return level ? level.label : '알 수 없음'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '퍼즐 장난감': return 'text-blue-600 bg-blue-100'
      case '냄새 탐지': return 'text-green-600 bg-green-100'
      case '음식 퍼즐': return 'text-yellow-600 bg-yellow-100'
      case '신체 활동': return 'text-red-600 bg-red-100'
      case '정신 자극': return 'text-purple-600 bg-purple-100'
      case '사회적 상호작용': return 'text-pink-600 bg-pink-100'
      case '새로운 환경': return 'text-indigo-600 bg-indigo-100'
      case '훈련 활동': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityById = (id: string) => {
    return activities.find(activity => activity.id === id)
  }

  const totalActivities = activities.length
  const totalRecords = records.length
  const successfulRecords = records.filter(record => record.success).length
  const averageEngagement = records.length > 0 ? records.reduce((sum, record) => sum + record.engagement, 0) / records.length : 0
  const totalDuration = records.reduce((sum, record) => sum + record.duration, 0)
  const uniqueActivities = new Set(records.map(record => record.activityId)).size

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Puzzle className="w-10 h-10 text-blue-600 mr-3" />
            환경 풍부화 추적기
          </h1>
          <p className="text-xl text-gray-600">환경 풍부화 활동의 효과와 강아지 반응을 기록</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Puzzle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalActivities}개</p>
            <p className="text-sm text-gray-600">풍부화 활동</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalRecords}회</p>
            <p className="text-sm text-gray-600">활동 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageEngagement.toFixed(1)}점</p>
            <p className="text-sm text-gray-600">평균 참여도</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{totalDuration}분</p>
            <p className="text-sm text-gray-600">총 활동 시간</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">풍부화 활동 관리</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동명</label>
                    <input
                      type="text"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                      placeholder="예: 음식 퍼즐"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">카테고리 선택</option>
                      {enrichmentCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">예상 시간 (분)</label>
                    <input
                      type="number"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">난이도 (1-5)</label>
                    <input
                      type="number"
                      value={newActivity.difficulty}
                      onChange={(e) => setNewActivity({...newActivity, difficulty: parseInt(e.target.value) || 1})}
                      min="1"
                      max="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    rows={2}
                    placeholder="활동에 대한 상세 설명"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                    rows={2}
                    placeholder="활동 시 주의사항, 팁 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addActivity}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  풍부화 활동 추가
                </button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{activity.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(activity.category)}`}>
                            {activity.category}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(activity.difficulty)}`}>
                            {getDifficultyLabel(activity.difficulty)}
                          </span>
                          <span className="text-gray-500">{activity.duration}분</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded ${getEngagementColor(activity.engagement)}`}>
                          {activity.engagement}점
                        </span>
                      </div>
                    </div>
                    
                    {activity.notes && (
                      <div className="text-sm text-gray-600">
                        <p><strong>메모:</strong> {activity.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">풍부화 활동 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 선택</label>
                    <select
                      value={newRecord.activityId}
                      onChange={(e) => setNewRecord({...newRecord, activityId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">활동 선택</option>
                      {activities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">실제 시간 (분)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">참여도 (1-10)</label>
                    <input
                      type="number"
                      value={newRecord.engagement}
                      onChange={(e) => setNewRecord({...newRecord, engagement: parseInt(e.target.value) || 1})}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="success"
                    checked={newRecord.success}
                    onChange={(e) => setNewRecord({...newRecord, success: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="success" className="text-sm text-gray-700">활동 성공</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="활동 과정, 강아지 반응, 개선점 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  풍부화 활동 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 풍부화 활동 기록</h3>
                  {records.slice(0, 5).map((record) => {
                    const activity = getActivityById(record.activityId)
                    return (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {activity?.name || '알 수 없는 활동'}
                            </p>
                            <p className="text-sm text-gray-600">{record.date} - {record.duration}분</p>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              <span className={`px-2 py-1 text-xs rounded ${getEngagementColor(record.engagement)}`}>
                                참여도 {record.engagement}
                              </span>
                              <br />
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
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧩 환경 풍부화 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 다양한 활동을 제공하세요</li>
                <li>• 강아지의 관심도에 맞춰 조절하세요</li>
                <li>• 점진적으로 난이도를 높이세요</li>
                <li>• 정기적으로 새로운 활동을 추가하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 안전한 활동만 선택하세요</li>
                <li>• 강아지가 지치면 즉시 중단하세요</li>
                <li>• 활동 후 충분한 휴식을 제공하세요</li>
                <li>• 전문가의 조언을 구하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
