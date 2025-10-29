'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scale, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

// 견종별 표준 체중 범위 (kg)
const breedWeights: Record<string, { min: number; max: number; name: string }> = {
  'chihuahua': { min: 1.5, max: 3, name: '치와와' },
  'yorkie': { min: 1.8, max: 3.2, name: '요크셔테리어' },
  'pomeranian': { min: 1.5, max: 3.5, name: '포메라니안' },
  'poodle-small': { min: 3, max: 6, name: '소형 푸들' },
  'poodle-medium': { min: 7, max: 12, name: '중형 푸들' },
  'beagle': { min: 8, max: 14, name: '비글' },
  'cocker': { min: 9, max: 13, name: '코커스패니얼' },
  'shiba': { min: 8, max: 11, name: '시바견' },
  'golden': { min: 25, max: 34, name: '골든리트리버' },
  'labrador': { min: 25, max: 36, name: '라布拉도르' },
  'husky': { min: 16, max: 27, name: '시베리안 허스키' },
  'samoyed': { min: 20, max: 30, name: '사모예드' },
  'custom': { min: 0, max: 100, name: '직접 입력' }
}

export default function DogObesityCalculatorPage() {
  const [selectedBreed, setSelectedBreed] = useState<string>('beagle')
  const [weight, setWeight] = useState<number>(0)
  const [customMin, setCustomMin] = useState<number>(0)
  const [customMax, setCustomMax] = useState<number>(0)
  const [result, setResult] = useState<{
    status: 'underweight' | 'normal' | 'overweight' | 'obese' | null
    percentage: number
    idealRange: { min: number; max: number }
    advice: string
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    let idealMin: number
    let idealMax: number

    if (selectedBreed === 'custom') {
      idealMin = customMin
      idealMax = customMax
    } else {
      const breed = breedWeights[selectedBreed]
      idealMin = breed.min
      idealMax = breed.max
    }

    if (idealMin <= 0 || idealMax <= 0) return

    const idealAvg = (idealMin + idealMax) / 2
    const percentage = ((weight / idealAvg) - 1) * 100

    let status: 'underweight' | 'normal' | 'overweight' | 'obese'
    let advice: string

    if (percentage < -15) {
      status = 'underweight'
      advice = '저체중 상태입니다. 수의사와 상담하여 영양 관리가 필요할 수 있습니다.'
    } else if (percentage < 10) {
      status = 'normal'
      advice = '정상 체중 범위입니다. 현재 상태를 유지하며 규칙적인 운동과 식사 관리를 계속하세요.'
    } else if (percentage < 20) {
      status = 'overweight'
      advice = '과체중 상태입니다. 식사량 조절과 운동량 증가를 통해 체중 관리를 시작하세요.'
    } else {
      status = 'obese'
      advice = '비만 상태입니다. 즉시 수의사와 상담하여 체중 감량 계획을 수립하는 것이 좋습니다.'
    }

    setResult({
      status,
      percentage: Math.round(percentage * 10) / 10,
      idealRange: { min: idealMin, max: idealMax },
      advice
    })
  }

  const getStatusColor = () => {
    if (!result) return ''
    switch (result.status) {
      case 'underweight': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'normal': return 'text-green-600 bg-green-50 border-green-200'
      case 'overweight': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'obese': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getStatusIcon = () => {
    if (!result) return null
    switch (result.status) {
      case 'underweight':
      case 'obese':
        return <AlertTriangle className="w-8 h-8" />
      case 'normal':
        return <CheckCircle className="w-8 h-8" />
      case 'overweight':
        return <TrendingUp className="w-8 h-8" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/utilities"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Scale className="w-10 h-10 text-green-600 mr-3" />
            반려견 비만도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            체중과 견종을 입력하면 비만 여부를 판단하고, 권장 체중 범위를 안내합니다
          </p>
        </div>

        {/* 계산기 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                견종 선택
              </label>
              <select
                value={selectedBreed}
                onChange={(e) => {
                  setSelectedBreed(e.target.value)
                  setResult(null)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <optgroup label="소형견">
                  <option value="chihuahua">치와와</option>
                  <option value="yorkie">요크셔테리어</option>
                  <option value="pomeranian">포메라니안</option>
                  <option value="poodle-small">소형 푸들</option>
                </optgroup>
                <optgroup label="중형견">
                  <option value="beagle">비글</option>
                  <option value="cocker">코커스패니얼</option>
                  <option value="shiba">시바견</option>
                  <option value="poodle-medium">중형 푸들</option>
                </optgroup>
                <optgroup label="대형견">
                  <option value="golden">골든리트리버</option>
                  <option value="labrador">라布拉도르</option>
                  <option value="husky">시베리안 허스키</option>
                  <option value="samoyed">사모예드</option>
                </optgroup>
                <option value="custom">직접 입력</option>
              </select>
            </div>

            {selectedBreed === 'custom' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    적정 최소 체중 (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customMin || ''}
                    onChange={(e) => setCustomMin(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    적정 최대 체중 (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customMax || ''}
                    onChange={(e) => setCustomMax(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                placeholder="예: 10.5"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
            >
              비만도 계산하기
            </button>

            {/* 결과 표시 */}
            {result && (
              <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
                <div className="flex items-center space-x-4 mb-4">
                  {getStatusIcon()}
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {result.status === 'underweight' ? '저체중' :
                       result.status === 'normal' ? '정상 체중' :
                       result.status === 'overweight' ? '과체중' : '비만'}
                    </h3>
                    <p className="text-lg">
                      적정 체중 대비 {result.percentage > 0 ? '+' : ''}{result.percentage}%
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">권장 체중 범위</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.idealRange.min}kg ~ {result.idealRange.max}kg
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">💡 조언</p>
                  <p className="text-gray-700">{result.advice}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 비만도 판정 기준</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>저체중:</strong> 적정 체중보다 15% 이상 낮음</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>정상:</strong> 적정 체중의 ±10% 범위 내</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>과체중:</strong> 적정 체중보다 10-20% 높음</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>비만:</strong> 적정 체중보다 20% 이상 높음</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            * 정확한 진단을 위해서는 수의사와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  )
}

