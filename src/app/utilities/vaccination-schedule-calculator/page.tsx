'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Syringe, Calendar } from 'lucide-react'

interface Vaccination {
  name: string
  age: string
  nextAge?: string
  description: string
}

const vaccinationSchedule: Record<string, Vaccination[]> = {
  puppy: [
    { name: '종합백신 1차', age: '6주', nextAge: '9주', description: '기본 예방접종 시작' },
    { name: '종합백신 2차', age: '9주', nextAge: '12주', description: '면역력 강화' },
    { name: '종합백신 3차', age: '12주', nextAge: '16주', description: '면역력 강화' },
    { name: '종합백신 4차', age: '16주', description: '기본 접종 완료' },
    { name: '켄넬코프', age: '6주', nextAge: '9주', description: '기침 예방' },
    { name: '광견병', age: '3개월', description: '법정 접종' }
  ],
  adult: [
    { name: '종합백신', age: '1년마다', description: '연간 접종' },
    { name: '켄넬코프', age: '1년마다', description: '연간 접종' },
    { name: '광견병', age: '1-3년마다', description: '법정 접종 (지역별 상이)' }
  ]
}

export default function VaccinationScheduleCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>('')
  const [ageType, setAgeType] = useState<string>('puppy')
  const [result, setResult] = useState<{
    schedule: Array<{ name: string; date: string; age: string; description: string }>
    nextVaccination: { name: string; date: string; daysLeft: number } | null
  } | null>(null)

  const calculate = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const today = new Date()
    const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    const ageInWeeks = Math.floor(ageInDays / 7)
    const ageInMonths = Math.floor(ageInDays / 30)

    const schedule = vaccinationSchedule[ageType] || []
    const calculatedSchedule = schedule.map(vacc => {
      let vaccDate = new Date(birth)
      
      if (vacc.age.includes('주')) {
        const weeks = parseInt(vacc.age)
        vaccDate.setDate(vaccDate.getDate() + (weeks * 7))
      } else if (vacc.age.includes('개월')) {
        const months = parseInt(vacc.age)
        vaccDate.setDate(vaccDate.getDate() + (months * 30))
      } else if (vacc.age.includes('년')) {
        vaccDate.setFullYear(vaccDate.getFullYear() + 1)
      }

      return {
        name: vacc.name,
        date: vaccDate.toISOString().split('T')[0],
        age: vacc.age,
        description: vacc.description
      }
    })

    // 다음 접종일 찾기
    const upcoming = calculatedSchedule
      .filter(v => new Date(v.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

    let nextVaccination = null
    if (upcoming) {
      const daysLeft = Math.ceil((new Date(upcoming.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      nextVaccination = {
        name: upcoming.name,
        date: upcoming.date,
        daysLeft
      }
    }

    setResult({
      schedule: calculatedSchedule,
      nextVaccination
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
            <Syringe className="w-10 h-10 text-red-600 mr-3" />
            예방접종 일정 계산기
          </h1>
          <p className="text-xl text-gray-600">
            다음 예방접종일과 일정을 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생애 단계
                </label>
                <select
                  value={ageType}
                  onChange={(e) => setAgeType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="puppy">강아지 (1세 미만)</option>
                  <option value="adult">성견 (1세 이상)</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              일정 계산하기
            </button>

            {result && (
              <div className="space-y-4">
                {result.nextVaccination && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">다음 예방접종</p>
                        <p className="text-2xl font-bold text-red-700">{result.nextVaccination.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">접종일</p>
                        <p className="text-xl font-bold text-red-700">{result.nextVaccination.date}</p>
                        <p className="text-sm text-gray-600 mt-1">{result.nextVaccination.daysLeft}일 후</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">전체 예방접종 일정</h3>
                  <div className="space-y-3">
                    {result.schedule.map((vacc, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{vacc.name}</p>
                            <p className="text-sm text-gray-600">{vacc.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">{vacc.date}</p>
                            <p className="text-xs text-gray-500">{vacc.age}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 예방접종 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지는 생후 6주부터 예방접종을 시작합니다</li>
            <li>• 종합백신은 3-4주 간격으로 3-4회 접종합니다</li>
            <li>• 광견병 예방접종은 법정 접종으로 필수입니다</li>
            <li>• 성견은 매년 종합백신과 켄넬코프 접종을 받아야 합니다</li>
            <li>• 예방접종 전후 1주일은 목욕과 과도한 운동을 피하세요</li>
            <li>• 예방접종 후 이상 반응이 있으면 즉시 수의사에게 연락하세요</li>
            <li>• 예방접종 기록을 보관하여 다음 접종일을 놓치지 마세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

