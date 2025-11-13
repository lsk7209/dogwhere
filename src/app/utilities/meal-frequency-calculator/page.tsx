'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Calculator } from 'lucide-react'

export default function MealFrequencyCalculatorPage() {
  const [age, setAge] = useState<string>('adult')
  const [healthCondition, setHealthCondition] = useState<string>('healthy')
  const [result, setResult] = useState<{
    frequency: number
    schedule: string[]
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let frequency = 2 // 기본값 (성견)
    let schedule: string[] = []
    let recommendation = ''

    if (age === 'puppy') {
      if (parseInt(age.split('-')[0] || '2') < 4) {
        frequency = 4 // 2-4개월: 하루 4회
        schedule = ['07:00', '12:00', '17:00', '22:00']
      } else if (parseInt(age.split('-')[0] || '4') < 6) {
        frequency = 3 // 4-6개월: 하루 3회
        schedule = ['08:00', '14:00', '20:00']
      } else {
        frequency = 3 // 6-12개월: 하루 3회
        schedule = ['08:00', '14:00', '20:00']
      }
      recommendation = '강아지는 성장을 위해 하루 3-4회 식사를 해야 합니다. 소화 능력이 약하므로 자주 조금씩 급여하세요.'
    } else if (age === 'young') {
      frequency = 2
      schedule = ['08:00', '20:00']
      recommendation = '청견은 하루 2회 식사가 적절합니다. 규칙적인 식사 시간을 유지하세요.'
    } else if (age === 'adult') {
      frequency = 2
      schedule = ['08:00', '20:00']
      recommendation = '성견은 하루 2회 식사가 적절합니다. 일정한 시간에 급여하여 생활 리듬을 유지하세요.'
    } else if (age === 'senior') {
      frequency = 3
      schedule = ['08:00', '14:00', '20:00']
      recommendation = '노령견은 소화 능력이 약해질 수 있으므로 하루 3회로 나누어 급여하는 것이 좋습니다.'
    }

    if (healthCondition === 'diabetes') {
      frequency = 3
      schedule = ['08:00', '14:00', '20:00']
      recommendation = '당뇨 강아지는 혈당 조절을 위해 하루 3회 식사가 필요합니다. 수의사와 상담하여 식사 시간을 조절하세요.'
    } else if (healthCondition === 'digestive') {
      frequency = 3
      schedule = ['08:00', '14:00', '20:00']
      recommendation = '소화 문제가 있는 강아지는 하루 3회로 나누어 급여하여 소화 부담을 줄이세요.'
    } else if (healthCondition === 'underweight') {
      frequency = 3
      schedule = ['08:00', '14:00', '20:00']
      recommendation = '저체중 강아지는 하루 3회로 나누어 급여하여 식욕을 자극하고 영양 흡수를 돕습니다.'
    }

    setResult({
      frequency,
      schedule,
      recommendation
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-10 h-10 text-blue-600 mr-3" />
            식사 횟수 계산기
          </h1>
          <p className="text-xl text-gray-600">
            연령과 건강 상태에 따른 적정 식사 횟수를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연령
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="puppy">강아지 (2-12개월)</option>
                  <option value="young">청견 (1-2세)</option>
                  <option value="adult">성견 (2-7세)</option>
                  <option value="senior">노령견 (7세 이상)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  건강 상태
                </label>
                <select
                  value={healthCondition}
                  onChange={(e) => setHealthCondition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="healthy">건강</option>
                  <option value="diabetes">당뇨</option>
                  <option value="digestive">소화 문제</option>
                  <option value="underweight">저체중</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">일일 식사 횟수</p>
                  <p className="text-4xl font-bold text-blue-700">{result.frequency}회</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">권장 식사 시간표</p>
                  <div className="space-y-2">
                    {result.schedule.map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">식사 {index + 1}</span>
                        <span className="text-blue-700 font-semibold">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 식사 횟수 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지(2-4개월): 하루 4회 - 소화 능력이 약하므로 자주 조금씩 급여</li>
            <li>• 강아지(4-12개월): 하루 3회 - 성장을 위한 충분한 영양 공급</li>
            <li>• 성견: 하루 2회 - 규칙적인 식사 시간 유지</li>
            <li>• 노령견: 하루 3회 - 소화 능력 저하로 인한 분할 급여</li>
            <li>• 당뇨 강아지: 하루 3회 - 혈당 조절을 위한 분할 급여</li>
            <li>• 소화 문제: 하루 3회 - 소화 부담 감소</li>
            <li>• 규칙적인 식사 시간을 유지하여 생활 리듬을 만들어주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

