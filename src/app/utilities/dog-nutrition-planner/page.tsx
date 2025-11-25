'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Apple, Calculator, Clock, TrendingUp } from 'lucide-react'

interface NutritionPlan {
  id: string
  name: string
  breed: string
  age: string
  weight: number
  activityLevel: string
  dailyCalories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  meals: Meal[]
}

interface Meal {
  id: string
  time: string
  food: string
  amount: number
  calories: number
}

export default function DogNutritionPlannerPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([])
  const [newPlan, setNewPlan] = useState({
    name: '',
    breed: '',
    age: '',
    weight: 0,
    activityLevel: 'medium'
  })
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null)

  const breedNutritionData = {
    '소형견': { protein: 25, fat: 15, carbs: 50, fiber: 5 },
    '중형견': { protein: 22, fat: 12, carbs: 55, fiber: 6 },
    '대형견': { protein: 20, fat: 10, carbs: 60, fiber: 7 }
  }

  const activityMultipliers = {
    'low': 1.2,
    'medium': 1.4,
    'high': 1.6
  }

  useEffect(() => {
    const savedPlans = localStorage.getItem('nutritionPlans')
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('nutritionPlans', JSON.stringify(plans))
    }
  }, [plans])

  const calculateNutrition = (weight: number, breed: string, activityLevel: string) => {
    const baseCalories = weight * 30 // 기본 칼로리 (체중 1kg당 30kcal)
    const activityMultiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers]
    const dailyCalories = Math.round(baseCalories * activityMultiplier)
    
    const breedData = breedNutritionData[breed as keyof typeof breedNutritionData] || breedNutritionData['중형견']
    
    return {
      dailyCalories,
      protein: Math.round(dailyCalories * breedData.protein / 100 / 4), // 1g당 4kcal
      fat: Math.round(dailyCalories * breedData.fat / 100 / 9), // 1g당 9kcal
      carbs: Math.round(dailyCalories * breedData.carbs / 100 / 4), // 1g당 4kcal
      fiber: Math.round(dailyCalories * breedData.fiber / 100 / 4) // 1g당 4kcal
    }
  }

  const createNutritionPlan = () => {
    if (!newPlan.name || !newPlan.breed || !newPlan.age || newPlan.weight <= 0) return

    const nutrition = calculateNutrition(newPlan.weight, newPlan.breed, newPlan.activityLevel)
    
    const plan: NutritionPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      breed: newPlan.breed,
      age: newPlan.age,
      weight: newPlan.weight,
      activityLevel: newPlan.activityLevel,
      ...nutrition,
      meals: [
        { id: '1', time: '08:00', food: '아침 사료', amount: 0, calories: 0 },
        { id: '2', time: '14:00', food: '점심 사료', amount: 0, calories: 0 },
        { id: '3', time: '20:00', food: '저녁 사료', amount: 0, calories: 0 }
      ]
    }
    
    setPlans([plan, ...plans])
    setNewPlan({ name: '', breed: '', age: '', weight: 0, activityLevel: 'medium' })
  }

  const updateMeal = (planId: string, mealId: string, field: string, value: string | number) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? {
            ...plan,
            meals: plan.meals.map(meal => 
              meal.id === mealId ? { ...meal, [field]: value } : meal
            )
          }
        : plan
    ))
  }

  const getBreedSize = (breed: string) => {
    if (breed.includes('소형') || breed.includes('치와와') || breed.includes('요크셔')) return '소형견'
    if (breed.includes('대형') || breed.includes('골든') || breed.includes('래브라도')) return '대형견'
    return '중형견'
  }

  const getActivityLevelText = (level: string) => {
    switch (level) {
      case 'low': return '낮음 (실내 위주)'
      case 'medium': return '보통 (일반적인 활동)'
      case 'high': return '높음 (활발한 활동)'
      default: return level
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Apple className="w-10 h-10 text-green-600 mr-3" />
            영양 관리 플래너
          </h1>
          <p className="text-xl text-gray-600">견종과 연령에 맞는 영양 균형 식단을 계획합니다</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">새 영양 계획 만들기</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반려견 이름</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="예: 멍멍이"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">견종</label>
                    <select
                      value={newPlan.breed}
                      onChange={(e) => setNewPlan({...newPlan, breed: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">견종 선택</option>
                      <option value="소형견">소형견 (치와와, 요크셔테리어 등)</option>
                      <option value="중형견">중형견 (비글, 코기, 시바견 등)</option>
                      <option value="대형견">대형견 (골든리트리버, 래브라도 등)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">연령</label>
                    <input
                      type="text"
                      value={newPlan.age}
                      onChange={(e) => setNewPlan({...newPlan, age: e.target.value})}
                      placeholder="예: 2세, 6개월"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newPlan.weight || ''}
                      onChange={(e) => setNewPlan({...newPlan, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 수준</label>
                    <select
                      value={newPlan.activityLevel}
                      onChange={(e) => setNewPlan({...newPlan, activityLevel: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">낮음 (실내 위주)</option>
                      <option value="medium">보통 (일반적인 활동)</option>
                      <option value="high">높음 (활발한 활동)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={createNutritionPlan}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  영양 계획 생성
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">영양 계획 목록</h2>
              {plans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">등록된 영양 계획이 없습니다</p>
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.breed} • {plan.age} • {plan.weight}kg</p>
                          <p className="text-sm text-gray-600">활동 수준: {getActivityLevelText(plan.activityLevel)}</p>
                        </div>
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          상세 보기
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{plan.dailyCalories}</p>
                          <p className="text-gray-600">칼로리</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{plan.protein}g</p>
                          <p className="text-gray-600">단백질</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{plan.fat}g</p>
                          <p className="text-gray-600">지방</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{plan.carbs}g</p>
                          <p className="text-gray-600">탄수화물</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedPlan && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name} 영양 계획</h2>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">영양소 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">일일 칼로리</span>
                      <span className="font-semibold">{selectedPlan.dailyCalories} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">단백질</span>
                      <span className="font-semibold">{selectedPlan.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">지방</span>
                      <span className="font-semibold">{selectedPlan.fat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">탄수화물</span>
                      <span className="font-semibold">{selectedPlan.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">식이섬유</span>
                      <span className="font-semibold">{selectedPlan.fiber}g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">식사 일정</h3>
                  <div className="space-y-3">
                    {selectedPlan.meals.map((meal) => (
                      <div key={meal.id} className="flex items-center space-x-3">
                        <input
                          type="time"
                          value={meal.time}
                          onChange={(e) => updateMeal(selectedPlan.id, meal.id, 'time', e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={meal.food}
                          onChange={(e) => updateMeal(selectedPlan.id, meal.id, 'food', e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={meal.amount || ''}
                          onChange={(e) => updateMeal(selectedPlan.id, meal.id, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="양"
                          className="w-20 px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-600">g</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 영양 관리 팁</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 규칙적인 식사 시간을 유지하세요</li>
                  <li>• 신선한 물을 항상 제공하세요</li>
                  <li>• 사료 변경 시 점진적으로 진행하세요</li>
                  <li>• 과도한 간식은 피하고 영양 균형을 고려하세요</li>
                  <li>• 정기적으로 체중을 측정하여 조정하세요</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
