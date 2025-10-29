'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplet, Calendar } from 'lucide-react'

export default function BathScheduleCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [environment, setEnvironment] = useState<string>('indoor')
  const [activity, setActivity] = useState<string>('normal')
  const [coatType, setCoatType] = useState<string>('medium')
  const [result, setResult] = useState<{
    frequency: string
    days: number
    advice: string[]
  } | null>(null)

  const calculate = () => {
    let baseDays = 30 // 기본 1개월

    // 견종 크기별 조정
    const sizeFactors: Record<string, number> = {
      small: -5,   // 소형견은 더 자주
      medium: 0,
      large: 5     // 대형견은 덜 자주
    }
    baseDays += (sizeFactors[breedSize] || 0)

    // 생활 환경별 조정
    const envFactors: Record<string, number> = {
      indoor: 10,      // 실내 생활
      mixed: 0,        // 실내외 혼합
      outdoor: -10     // 주로 실외
    }
    baseDays += (envFactors[environment] || 0)

    // 활동량별 조정
    const actFactors: Record<string, number> = {
      low: 5,      // 저활동
      normal: 0,   // 일반
      high: -5     // 고활동
    }
    baseDays += (actFactors[activity] || 0)

    // 털 종류별 조정
    const coatFactors: Record<string, number> = {
      short: 5,    // 단모
      medium: 0,   // 중모
      long: -5     // 장모
    }
    baseDays += (coatFactors[coatType] || 0)

    // 최소/최대 제한
    const days = Math.max(14, Math.min(90, baseDays))
    
    let frequency: string
    if (days <= 21) frequency = '2-3주마다'
    else if (days <= 35) frequency = '3-4주마다'
    else if (days <= 50) frequency = '1-2개월마다'
    else frequency = '2-3개월마다'

    const advice: string[] = []
    if (days <= 21) {
      advice.push('자주 목욕이 필요한 타입입니다. 피부 보호를 위해 전문 강아지 샴푸 사용을 권장합니다.')
      advice.push('목욕 후 완전 건조가 필수입니다.')
    } else if (days <= 35) {
      advice.push('정기적인 목욕이 필요합니다.')
      advice.push('빗질과 함께 관리하면 피부 건강을 유지할 수 있습니다.')
    } else {
      advice.push('과도한 목욕은 피부 건조를 유발할 수 있으니 주의하세요.')
      advice.push('평소 빗질로 털 관리를 철저히 하면 목욕 주기를 늦출 수 있습니다.')
    }

    setResult({
      frequency,
      days,
      advice
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
            <Droplet className="w-10 h-10 text-blue-600 mr-3" />
            목욕 주기 계산기
          </h1>
          <p className="text-xl text-gray-600">
            견종, 생활 환경, 활동량에 따른 적정 목욕 주기를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                견종 크기
              </label>
              <select
                value={breedSize}
                onChange={(e) => setBreedSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="small">소형견</option>
                <option value="medium">중형견</option>
                <option value="large">대형견</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생활 환경
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="indoor">실내 주로 생활</option>
                <option value="mixed">실내외 혼합</option>
                <option value="outdoor">실외 주로 생활</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활동량
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="low">저활동</option>
                <option value="normal">일반 활동</option>
                <option value="high">고활동</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                털 길이
              </label>
              <select
                value={coatType}
                onChange={(e) => setCoatType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="short">단모</option>
                <option value="medium">중모</option>
                <option value="long">장모</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              목욕 주기 계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-6 text-center">
                  <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">권장 목욕 주기</p>
                  <p className="text-4xl font-bold text-blue-700 mb-2">{result.frequency}</p>
                  <p className="text-sm text-gray-500">약 {result.days}일마다</p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">💡 관리 조언</h4>
                  <ul className="space-y-2">
                    {result.advice.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2 text-blue-600">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 목욕 주기 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 실외 활동이 많은 강아지는 더 자주 목욕이 필요할 수 있습니다</li>
            <li>• 과도한 목욕은 피부의 자연 오일을 제거해 건조를 유발합니다</li>
            <li>• 목욕 후에는 반드시 완전히 건조시켜 피부 질환을 예방하세요</li>
            <li>• 평소 빗질로 털 관리를 잘하면 목욕 주기를 늦출 수 있습니다</li>
            <li>• 피부 질환이나 특별한 상황은 수의사와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

