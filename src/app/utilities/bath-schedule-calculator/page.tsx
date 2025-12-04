'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Droplet, Calendar, ArrowLeft, Info, Dog, Home, Activity, Scissors } from 'lucide-react'

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

  const SelectionCard = ({
    icon: Icon,
    label,
    options,
    value,
    onChange
  }: {
    icon: any,
    label: string,
    options: { value: string, label: string }[],
    value: string,
    onChange: (val: string) => void
  }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
        <Icon className="w-4 h-4 mr-2 text-blue-500" />
        {label}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-all ${value === opt.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-100 text-gray-500 hover:border-blue-200'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Droplet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">목욕 주기 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 강아지에게 딱 맞는 목욕 주기를 계산해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectionCard
                icon={Dog}
                label="견종 크기"
                value={breedSize}
                onChange={setBreedSize}
                options={[
                  { value: 'small', label: '소형견' },
                  { value: 'medium', label: '중형견' },
                  { value: 'large', label: '대형견' }
                ]}
              />
              <SelectionCard
                icon={Home}
                label="생활 환경"
                value={environment}
                onChange={setEnvironment}
                options={[
                  { value: 'indoor', label: '실내' },
                  { value: 'mixed', label: '실내외' },
                  { value: 'outdoor', label: '실외' }
                ]}
              />
              <SelectionCard
                icon={Activity}
                label="활동량"
                value={activity}
                onChange={setActivity}
                options={[
                  { value: 'low', label: '적음' },
                  { value: 'normal', label: '보통' },
                  { value: 'high', label: '많음' }
                ]}
              />
              <SelectionCard
                icon={Scissors}
                label="털 길이"
                value={coatType}
                onChange={setCoatType}
                options={[
                  { value: 'short', label: '단모' },
                  { value: 'medium', label: '중모' },
                  { value: 'long', label: '장모' }
                ]}
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-lg flex items-center justify-center"
            >
              <Calendar className="w-6 h-6 mr-2" />
              목욕 주기 계산하기
            </button>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden">
                  <div className="p-8 text-center bg-blue-50">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">권장 목욕 주기</span>
                    <div className="text-4xl font-black text-blue-600 my-4">
                      {result.frequency}
                    </div>
                    <div className="inline-block px-4 py-1.5 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">
                      약 {result.days}일 간격
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-500" />
                      관리 조언
                    </h4>
                    <ul className="space-y-3">
                      {result.advice.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="mr-2 text-blue-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Droplet className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    왼쪽의 정보를 선택하고<br />계산하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-400" />
                  알아두세요
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    너무 잦은 목욕은 피부를 건조하게 만들 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    목욕 후에는 털을 완전히 말려주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    피부병이 있다면 수의사와 상담하세요.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
