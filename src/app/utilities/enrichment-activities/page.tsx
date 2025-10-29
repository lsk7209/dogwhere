'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Puzzle, Star, Clock } from 'lucide-react'

interface Activity {
  id: string
  name: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  materials: string[]
  instructions: string[]
  completed: boolean
  completedDate?: string
  rating?: number
}

export default function EnrichmentActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const activityCategories = {
    mental: {
      name: '정신 자극',
      activities: [
        {
          name: '숨겨진 간식 찾기',
          difficulty: 'easy' as const,
          duration: 15,
          materials: ['간식', '장난감', '담요'],
          instructions: [
            '간식을 장난감 안에 숨깁니다',
            '담요로 장난감을 덮습니다',
            '강아지가 간식을 찾도록 격려합니다',
            '찾으면 칭찬하고 간식을 줍니다'
          ]
        },
        {
          name: '퍼즐 피더 만들기',
          difficulty: 'medium' as const,
          duration: 30,
          materials: ['플라스틱 병', '간식', '가위'],
          instructions: [
            '플라스틱 병에 구멍을 뚫습니다',
            '간식을 병 안에 넣습니다',
            '강아지가 굴려서 간식을 꺼내도록 합니다',
            '점진적으로 어려운 퍼즐로 업그레이드합니다'
          ]
        },
        {
          name: '향상된 훈련 게임',
          difficulty: 'hard' as const,
          duration: 45,
          materials: ['다양한 장난감', '간식', '훈련용 클릭어'],
          instructions: [
            '새로운 명령어를 가르칩니다',
            '장난감을 이용한 복잡한 훈련을 합니다',
            '강아지의 반응에 따라 난이도를 조절합니다',
            '성공 시 충분한 보상을 제공합니다'
          ]
        }
      ]
    },
    physical: {
      name: '신체 활동',
      activities: [
        {
          name: '실내 장애물 코스',
          difficulty: 'easy' as const,
          duration: 20,
          materials: ['쿠션', '의자', '장난감'],
          instructions: [
            '쿠션과 의자로 간단한 장애물을 만듭니다',
            '강아지가 장애물을 통과하도록 안내합니다',
            '성공하면 칭찬과 간식을 줍니다',
            '점진적으로 복잡한 코스로 만듭니다'
          ]
        },
        {
          name: '공놀이 변형',
          difficulty: 'medium' as const,
          duration: 25,
          materials: ['공', '간식', '장난감'],
          instructions: [
            '공을 던지기 전에 간식을 숨깁니다',
            '강아지가 공을 가져오면 간식을 줍니다',
            '다양한 방향으로 공을 던집니다',
            '강아지의 체력에 맞춰 조절합니다'
          ]
        },
        {
          name: '춤추기 훈련',
          difficulty: 'hard' as const,
          duration: 40,
          materials: ['간식', '음악', '인내심'],
          instructions: [
            '간단한 동작부터 시작합니다',
            '음악에 맞춰 리듬을 가르칩니다',
            '복잡한 동작을 조합합니다',
            '강아지의 페이스에 맞춰 진행합니다'
          ]
        }
      ]
    },
    sensory: {
      name: '감각 자극',
      activities: [
        {
          name: '다양한 질감 탐험',
          difficulty: 'easy' as const,
          duration: 15,
          materials: ['다양한 직물', '장난감', '간식'],
          instructions: [
            '다양한 질감의 직물을 준비합니다',
            '강아지가 각 직물을 탐험하도록 합니다',
            '좋아하는 질감을 찾아보게 합니다',
            '새로운 질감을 점진적으로 소개합니다'
          ]
        },
        {
          name: '향기 탐지 게임',
          difficulty: 'medium' as const,
          duration: 30,
          materials: ['다양한 향기', '간식', '숨길 수 있는 용기'],
          instructions: [
            '강아지가 좋아하는 향기를 준비합니다',
            '향기를 숨길 수 있는 곳에 놓습니다',
            '강아지가 향기를 찾도록 격려합니다',
            '찾으면 보상을 제공합니다'
          ]
        },
        {
          name: '소리 탐지 훈련',
          difficulty: 'hard' as const,
          duration: 35,
          materials: ['다양한 소리', '간식', '인내심'],
          instructions: [
            '다양한 소리를 준비합니다',
            '강아지가 소리를 구분하도록 훈련합니다',
            '특정 소리에 반응하도록 가르칩니다',
            '복잡한 소리 조합을 만들어 냅니다'
          ]
        }
      ]
    },
    social: {
      name: '사회적 활동',
      activities: [
        {
          name: '다른 강아지와의 만남',
          difficulty: 'easy' as const,
          duration: 30,
          materials: ['간식', '장난감', '안전한 장소'],
          instructions: [
            '안전한 장소에서 다른 강아지와 만나게 합니다',
            '처음에는 짧은 시간부터 시작합니다',
            '긍정적인 경험을 만들어줍니다',
            '점진적으로 시간을 늘려갑니다'
          ]
        },
        {
          name: '사람들과의 상호작용',
          difficulty: 'medium' as const,
          duration: 25,
          materials: ['간식', '장난감', '다양한 사람들'],
          instructions: [
            '다양한 연령대의 사람들과 만나게 합니다',
            '긍정적인 상호작용을 격려합니다',
            '새로운 사람들에게 익숙해지도록 합니다',
            '과도한 자극은 피합니다'
          ]
        },
        {
          name: '그룹 활동 참여',
          difficulty: 'hard' as const,
          duration: 60,
          materials: ['그룹 활동 장소', '간식', '인내심'],
          instructions: [
            '강아지 그룹 활동에 참여합니다',
            '다른 강아지들과 함께 활동합니다',
            '사회적 기술을 발달시킵니다',
            '안전을 최우선으로 고려합니다'
          ]
        }
      ]
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('enrichmentActivities')
    if (saved) {
      try {
        setActivities(JSON.parse(saved))
      } catch (e) {
        initializeActivities()
      }
    } else {
      initializeActivities()
    }
  }, [])

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('enrichmentActivities', JSON.stringify(activities))
    }
  }, [activities])

  const initializeActivities = () => {
    const allActivities: Activity[] = []
    Object.entries(activityCategories).forEach(([categoryKey, category]) => {
      category.activities.forEach((activity, index) => {
        allActivities.push({
          id: `${categoryKey}-${index}`,
          name: activity.name,
          category: categoryKey,
          difficulty: activity.difficulty,
          duration: activity.duration,
          materials: activity.materials,
          instructions: activity.instructions,
          completed: false
        })
      })
    })
    setActivities(allActivities)
  }

  const completeActivity = (activityId: string) => {
    const rating = prompt('활동 만족도를 1-5점으로 평가해주세요:')
    const ratingNum = rating ? parseInt(rating) : undefined

    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            completed: true, 
            completedDate: new Date().toISOString().split('T')[0],
            rating: ratingNum
          }
        : activity
    ))
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

  const getCategoryName = (category: string) => {
    return activityCategories[category as keyof typeof activityCategories]?.name || category
  }

  const filteredActivities = activities.filter(activity => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || activity.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const completedCount = activities.filter(a => a.completed).length
  const totalCount = activities.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Puzzle className="w-10 h-10 text-purple-600 mr-3" />
            환경 풍부화 활동 가이드
          </h1>
          <p className="text-xl text-gray-600">강아지의 정신적 자극을 위한 다양한 활동을 제안합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Puzzle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalCount}개</p>
            <p className="text-sm text-gray-600">총 활동</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedCount}개</p>
            <p className="text-sm text-gray-600">완료된 활동</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / activities.length)}분
            </p>
            <p className="text-sm text-gray-600">평균 소요시간</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">필터</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">전체</option>
                {Object.entries(activityCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">전체</option>
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(activityCategories).map(([categoryKey, category]) => {
            const categoryActivities = filteredActivities.filter(a => a.category === categoryKey)
            if (categoryActivities.length === 0) return null

            return (
              <div key={categoryKey} className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
                <div className="space-y-4">
                  {categoryActivities.map((activity) => (
                    <div key={activity.id} className="border-2 border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                              {getDifficultyText(activity.difficulty)}
                            </span>
                            <span className="text-sm text-gray-600">{activity.duration}분</span>
                            {activity.completed && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                완료
                              </span>
                            )}
                            {activity.rating && (
                              <span className="text-sm text-yellow-600">
                                ⭐ {activity.rating}/5
                              </span>
                            )}
                          </div>
                        </div>
                        {!activity.completed && (
                          <button
                            onClick={() => completeActivity(activity.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            완료
                          </button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">필요한 준비물</h4>
                          <ul className="space-y-1">
                            {activity.materials.map((material, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="mr-2 text-purple-600">•</span>
                                <span className="text-sm text-gray-700">{material}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">진행 방법</h4>
                          <ol className="space-y-1">
                            {activity.instructions.map((instruction, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2 text-purple-600 font-bold">{idx + 1}.</span>
                                <span className="text-sm text-gray-700">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {activity.completed && activity.completedDate && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            완료일: {activity.completedDate}
                            {activity.rating && ` | 만족도: ${activity.rating}/5점`}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 환경 풍부화 활동 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 연령과 능력에 맞는 활동을 선택하세요</li>
            <li>• 새로운 활동은 점진적으로 도입하세요</li>
            <li>• 강아지가 즐거워하는 활동을 우선적으로 하세요</li>
            <li>• 정기적으로 활동을 바꿔가며 제공하세요</li>
            <li>• 활동 중 강아지의 반응을 주의 깊게 관찰하세요</li>
            <li>• 과도한 자극은 피하고 적절한 휴식을 제공하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
