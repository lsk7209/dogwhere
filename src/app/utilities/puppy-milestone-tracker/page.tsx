'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Calendar, CheckCircle } from 'lucide-react'

interface Milestone {
  id: string
  category: string
  milestone: string
  expectedAge: string
  achievedAge: string
  achieved: boolean
  notes: string
}

export default function PuppyMilestoneTrackerPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [newMilestone, setNewMilestone] = useState({
    category: 'physical',
    milestone: '',
    expectedAge: '',
    notes: ''
  })

  const milestoneCategories = {
    physical: {
      name: '신체 발달',
      milestones: [
        { milestone: '눈 뜨기', expectedAge: '2주' },
        { milestone: '걷기 시작', expectedAge: '3주' },
        { milestone: '유치 나기', expectedAge: '3-4주' },
        { milestone: '고체 사료 시작', expectedAge: '4-5주' },
        { milestone: '완전히 걷기', expectedAge: '5-6주' },
        { milestone: '유치 빠지기 시작', expectedAge: '3-4개월' }
      ]
    },
    social: {
      name: '사회화',
      milestones: [
        { milestone: '형제자매와 놀기', expectedAge: '3-4주' },
        { milestone: '사람과 상호작용', expectedAge: '4-5주' },
        { milestone: '다른 강아지와 만나기', expectedAge: '6-8주' },
        { milestone: '새로운 환경 경험', expectedAge: '8-12주' },
        { milestone: '다양한 소리 경험', expectedAge: '8-12주' },
        { milestone: '외출 시작', expectedAge: '12-16주' }
      ]
    },
    training: {
      name: '훈련',
      milestones: [
        { milestone: '이름 알기', expectedAge: '8-10주' },
        { milestone: '기본 명령어 (앉아)', expectedAge: '10-12주' },
        { milestone: '배변 훈련 시작', expectedAge: '8-10주' },
        { milestone: '목줄 적응', expectedAge: '10-12주' },
        { milestone: '기본 예절', expectedAge: '12-16주' },
        { milestone: '고급 명령어', expectedAge: '16-20주' }
      ]
    },
    health: {
      name: '건강 관리',
      milestones: [
        { milestone: '첫 예방접종', expectedAge: '6-8주' },
        { milestone: '2차 예방접종', expectedAge: '10-12주' },
        { milestone: '3차 예방접종', expectedAge: '14-16주' },
        { milestone: '광견병 접종', expectedAge: '16-20주' },
        { milestone: '중성화 수술', expectedAge: '6-12개월' },
        { milestone: '성장 완료', expectedAge: '12-18개월' }
      ]
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('puppyMilestones')
    if (saved) {
      try {
        setMilestones(JSON.parse(saved))
      } catch (e) {
        initializeMilestones()
      }
    } else {
      initializeMilestones()
    }
  }, [])

  useEffect(() => {
    if (milestones.length > 0) {
      localStorage.setItem('puppyMilestones', JSON.stringify(milestones))
    }
  }, [milestones])

  const initializeMilestones = () => {
    const allMilestones: Milestone[] = []
    Object.entries(milestoneCategories).forEach(([categoryKey, category]) => {
      category.milestones.forEach((milestone, index) => {
        allMilestones.push({
          id: `${categoryKey}-${index}`,
          category: categoryKey,
          milestone: milestone.milestone,
          expectedAge: milestone.expectedAge,
          achievedAge: '',
          achieved: false,
          notes: ''
        })
      })
    })
    setMilestones(allMilestones)
  }

  const addCustomMilestone = () => {
    if (!newMilestone.milestone || !newMilestone.expectedAge) return

    const milestone: Milestone = {
      id: Date.now().toString(),
      ...newMilestone,
      achievedAge: '',
      achieved: false
    }
    setMilestones([...milestones, milestone])
    setNewMilestone({
      category: 'physical',
      milestone: '',
      expectedAge: '',
      notes: ''
    })
  }

  const achieveMilestone = (milestoneId: string) => {
    const achievedAge = prompt('달성한 나이를 입력하세요 (예: 8주, 3개월):')
    if (!achievedAge) return

    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, achieved: true, achievedAge }
        : milestone
    ))
  }

  const updateNotes = (milestoneId: string, notes: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, notes }
        : milestone
    ))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-blue-600 bg-blue-100'
      case 'social': return 'text-green-600 bg-green-100'
      case 'training': return 'text-purple-600 bg-purple-100'
      case 'health': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryName = (category: string) => {
    return milestoneCategories[category as keyof typeof milestoneCategories]?.name || category
  }

  const achievedCount = milestones.filter(m => m.achieved).length
  const totalCount = milestones.length
  const progressPercentage = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-blue-600 mr-3" />
            강아지 성장 단계 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 성장 단계별 발달 상황을 추적합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{achievedCount}/{totalCount}</p>
            <p className="text-sm text-gray-600">달성된 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
            <p className="text-sm text-gray-600">전체 진행률</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalCount - achievedCount}</p>
            <p className="text-sm text-gray-600">남은 단계</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 성장 단계 추가</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={newMilestone.category}
                onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(milestoneCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성장 단계</label>
              <input
                type="text"
                value={newMilestone.milestone}
                onChange={(e) => setNewMilestone({...newMilestone, milestone: e.target.value})}
                placeholder="예: 첫 산책"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">예상 나이</label>
              <input
                type="text"
                value={newMilestone.expectedAge}
                onChange={(e) => setNewMilestone({...newMilestone, expectedAge: e.target.value})}
                placeholder="예: 8주, 3개월"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
            <input
              type="text"
              value={newMilestone.notes}
              onChange={(e) => setNewMilestone({...newMilestone, notes: e.target.value})}
              placeholder="특이사항이나 주의사항"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={addCustomMilestone}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            단계 추가
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(milestoneCategories).map(([categoryKey, category]) => {
            const categoryMilestones = milestones.filter(m => m.category === categoryKey)
            const achievedInCategory = categoryMilestones.filter(m => m.achieved).length
            
            return (
              <div key={categoryKey} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {achievedInCategory}/{categoryMilestones.length} 완료
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(achievedInCategory / categoryMilestones.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {categoryMilestones.map((milestone) => (
                    <div key={milestone.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-gray-900">{milestone.milestone}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(milestone.category)}`}>
                              {getCategoryName(milestone.category)}
                            </span>
                            {milestone.achieved && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                달성
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            예상: {milestone.expectedAge} | 
                            {milestone.achieved ? ` 달성: ${milestone.achievedAge}` : ' 미달성'}
                          </p>
                          {milestone.notes && (
                            <p className="text-sm text-gray-500">메모: {milestone.notes}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!milestone.achieved && (
                            <button
                              onClick={() => achieveMilestone(milestone.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              달성
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 성장 단계 추적 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지마다 성장 속도가 다를 수 있으니 참고용으로만 사용하세요</li>
            <li>• 각 단계의 달성 시기를 기록하여 개별 성장 패턴을 파악하세요</li>
            <li>• 예상보다 늦어도 걱정하지 마세요. 개별 차이가 있을 수 있습니다</li>
            <li>• 특이사항이나 주의사항은 메모로 기록해두세요</li>
            <li>• 정기적으로 수의사와 상담하여 건강한 성장을 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
