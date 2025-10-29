'use client'

import { useState } from 'react'
import { 
  Calculator, 
  Calendar as CalendarIcon, 
  Scale, 
  Activity, 
  Stethoscope, 
  Clock,
  Heart as HeartIcon,
  Dog,
  MapPin,
  Droplet,
  Utensils,
  FileText
} from 'lucide-react'
import Link from 'next/link'

// 강아지 나이 계산기
function DogAgeCalculator() {
  const [humanAge, setHumanAge] = useState<number>(0)
  const [dogAge, setDogAge] = useState<number>(0)

  const calculateDogAge = (human: number) => {
    if (human <= 0) return 0
    if (human <= 1) return human * 15
    if (human <= 2) return 15 + (human - 1) * 9
    return 24 + (human - 2) * 5
  }

  const handleHumanAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseInt(e.target.value) || 0
    setHumanAge(age)
    setDogAge(calculateDogAge(age))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <CalendarIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">강아지 나이 계산기</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        사람 나이를 강아지 나이로 변환합니다. 소형견, 중형견, 대형견에 따라 약간의 차이가 있을 수 있습니다.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사람 나이 (년)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            value={humanAge || ''}
            onChange={handleHumanAgeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="강아지 나이를 입력하세요"
          />
        </div>
        {dogAge > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">강아지 나이 (인간 나이 기준)</p>
            <p className="text-2xl font-bold text-blue-700">{dogAge}세</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 체중 계산기
function WeightCalculator() {
  const [weight, setWeight] = useState<number>(0)
  const [bcs, setBcs] = useState<number>(5) // Body Condition Score (1-9)
  const [result, setResult] = useState<string>('')

  const calculate = () => {
    if (weight <= 0) return
    
    // BCS 기준 적정 체중 범위 계산
    const idealWeight = weight * (5 / bcs)
    const minWeight = idealWeight * 0.95
    const maxWeight = idealWeight * 1.05
    
    setResult(`적정 체중: ${minWeight.toFixed(1)}kg ~ ${maxWeight.toFixed(1)}kg`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Scale className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">체중 관리 계산기</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        현재 체중과 체형 점수(BCS)를 입력하면 적정 체중 범위를 계산합니다.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 체중 (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="예: 5.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            체형 점수 (BCS: 1-9점, 5점이 이상적)
          </label>
          <input
            type="number"
            min="1"
            max="9"
            value={bcs}
            onChange={(e) => setBcs(parseInt(e.target.value) || 5)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            1=심하게 마름, 5=정상, 9=심하게 비만
          </p>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          계산하기
        </button>
        {result && (
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-lg font-semibold text-green-700">{result}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// 사료 양 계산기
function FoodCalculator() {
  const [weight, setWeight] = useState<number>(0)
  const [activity, setActivity] = useState<string>('normal')
  const [dailyAmount, setDailyAmount] = useState<number>(0)

  const calculate = () => {
    if (weight <= 0) return
    
    // 기본 일일 필요 칼로리 (kcal/day) = 체중(kg) ^ 0.75 * 70 * 활동계수
    const activityFactor: Record<string, number> = {
      low: 1.2,      // 저활동
      normal: 1.6,  // 일반 활동
      high: 2.0     // 고활동
    }
    
    const factor = activityFactor[activity] || 1.6
    const calories = Math.pow(weight, 0.75) * 70 * factor
    
    // 사료 100g당 약 350kcal 가정 (일반 건사료 기준)
    const amount = (calories / 350) * 100
    
    setDailyAmount(Math.round(amount * 10) / 10)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Utensils className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-gray-900">사료 양 계산기</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        강아지 체중과 활동량에 맞는 적정 사료 양을 계산합니다. (일반 건사료 기준)
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            체중 (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="예: 5.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            활동량
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="low">저활동 (노령견, 실내 위주)</option>
            <option value="normal">일반 활동</option>
            <option value="high">고활동 (운동량 많음, 활동적인 견종)</option>
          </select>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          계산하기
        </button>
        {dailyAmount > 0 && (
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">일일 권장 사료 양</p>
            <p className="text-2xl font-bold text-orange-700">{dailyAmount}g</p>
            <p className="text-xs text-gray-500 mt-2">
              * 사료 종류에 따라 칼로리가 다를 수 있으니 참고용으로만 사용하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 물 섭취량 계산기
function WaterCalculator() {
  const [weight, setWeight] = useState<number>(0)
  const [dailyWater, setDailyWater] = useState<number>(0)

  const calculate = () => {
    if (weight <= 0) return
    
    // 일일 물 필요량: 체중 1kg당 약 50-70ml
    // 평균 60ml로 계산
    const amount = weight * 60
    
    setDailyWater(Math.round(amount))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Droplet className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">물 섭취량 계산기</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        강아지 체중에 맞는 일일 권장 물 섭취량을 계산합니다.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            체중 (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 5.5"
          />
        </div>
        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          계산하기
        </button>
        {dailyWater > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">일일 권장 물 섭취량</p>
            <p className="text-2xl font-bold text-blue-700">{dailyWater}ml</p>
            <p className="text-xs text-gray-500 mt-2">
              * 날씨, 활동량에 따라 더 필요할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 운동량 계산기
function ExerciseCalculator() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [exerciseTime, setExerciseTime] = useState<string>('')

  const calculate = () => {
    if (weight <= 0) return
    
    // 연령별 권장 운동 시간
    const recommendations: Record<string, { min: number; max: number }> = {
      puppy: { min: 5, max: 15 },      // 강아지 (2-12개월)
      adult: { min: 30, max: 120 },     // 성견 (1-7세)
      senior: { min: 15, max: 60 }     // 노령견 (7세 이상)
    }
    
    const rec = recommendations[age] || recommendations.adult
    setExerciseTime(`하루 ${rec.min}~${rec.max}분`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Activity className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">운동량 계산기</h3>
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        강아지 나이와 체중에 맞는 적절한 운동량을 계산합니다.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            체중 (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="예: 5.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연령
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="puppy">강아지 (2-12개월)</option>
            <option value="adult">성견 (1-7세)</option>
            <option value="senior">노령견 (7세 이상)</option>
          </select>
        </div>
        <button
          onClick={calculate}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          계산하기
        </button>
        {exerciseTime && (
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">권장 산책/운동 시간</p>
            <p className="text-2xl font-bold text-purple-700">{exerciseTime}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UtilitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            반려견 유틸리티 🐕
          </h1>
          <p className="text-xl text-gray-600">
            강아지와 함께하는 생활을 더욱 편리하게 만들어주는 다양한 도구들
          </p>
        </div>

        {/* 유틸리티 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DogAgeCalculator />
          <WeightCalculator />
          <FoodCalculator />
          <WaterCalculator />
          <ExerciseCalculator />
          
          {/* 추가 유틸리티 카드들 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Stethoscope className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">예방접종 일정</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              강아지 예방접종 일정을 관리하고 다음 접종일을 확인하세요.
            </p>
            <Link
              href="/utilities/vaccination"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              일정 관리하기 →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">병원 기록</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              병원 방문 기록과 진단 정보를 관리하세요.
            </p>
            <Link
              href="/utilities/medical-record"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              기록 보기 →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <HeartIcon className="w-6 h-6 text-pink-600" />
              <h3 className="text-xl font-bold text-gray-900">건강 체크리스트</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              강아지의 건강 상태를 정기적으로 체크하세요.
            </p>
            <Link
              href="/utilities/health-check"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              체크리스트 보기 →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">식사 시간표</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              규칙적인 식사 시간표를 만들고 관리하세요.
            </p>
            <Link
              href="/utilities/feeding-schedule"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              시간표 만들기 →
            </Link>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 참고사항</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>모든 계산 결과는 참고용이며, 개별 강아지의 상태에 따라 다를 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>건강 관련 중요한 결정은 반드시 수의사와 상담하세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>견종, 연령, 건강 상태에 따라 적정량이 달라질 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

