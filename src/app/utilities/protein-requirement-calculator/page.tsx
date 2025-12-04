'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Beef, Calculator, ArrowLeft, Dumbbell, Activity, Utensils, Fish, Egg, Info, AlertCircle } from 'lucide-react'

export default function ProteinRequirementCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [activityLevel, setActivityLevel] = useState<string>('normal')
  const [result, setResult] = useState<{
    dailyProtein: number
    dailyCalories: number
    proteinPercentage: number
    recommendation: string
    sources: { name: string; amount: string; icon: any }[]
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    // 기본 칼로리 필요량 계산
    let baseCalories = 70 * Math.pow(weight, 0.75)

    // 연령별 조정
    if (age === 'puppy') baseCalories *= 2.0
    else if (age === 'senior') baseCalories *= 1.2
    else baseCalories *= 1.6

    // 활동량 조정
    if (activityLevel === 'low') baseCalories *= 0.8
    else if (activityLevel === 'high') baseCalories *= 1.3

    const dailyCalories = Math.round(baseCalories)

    // 단백질 필요량 계산 (견종별, 연령별)
    let proteinPerKg = 2.5 // 기본값 (g/kg)

    if (age === 'puppy') proteinPerKg = 4.0
    else if (age === 'senior') proteinPerKg = 2.0

    if (breedSize === 'large') proteinPerKg *= 0.9
    else if (breedSize === 'small') proteinPerKg *= 1.1

    if (activityLevel === 'high') proteinPerKg *= 1.2

    const dailyProtein = Math.round(weight * proteinPerKg)
    const proteinPercentage = Math.round((dailyProtein * 4 / dailyCalories) * 100)

    let recommendation = ''
    if (proteinPercentage < 18) {
      recommendation = '단백질 섭취가 부족할 수 있습니다. 근육량 유지와 면역력을 위해 고단백 식단을 고려해보세요.'
    } else if (proteinPercentage > 30) {
      recommendation = '단백질 비중이 높습니다. 신장 건강에 유의하며 충분한 수분 섭취가 필요합니다.'
    } else {
      recommendation = '이상적인 단백질 섭취량입니다. 현재의 균형 잡힌 식단을 유지해주세요.'
    }

    const sources = [
      { name: '닭가슴살', amount: `${Math.round(dailyProtein / 0.23)}g`, icon: Utensils },
      { name: '소고기(살코기)', amount: `${Math.round(dailyProtein / 0.26)}g`, icon: Beef },
      { name: '삶은 계란', amount: `${Math.round(dailyProtein / 6)}개`, icon: Egg },
      { name: '흰살 생선', amount: `${Math.round(dailyProtein / 0.2)}g`, icon: Fish }
    ]

    setResult({
      dailyProtein,
      dailyCalories,
      proteinPercentage,
      recommendation,
      sources
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <Beef className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">단백질 필요량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            근육 발달과 건강 유지를 위한 최적의 단백질 섭취량을 알려드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-red-500" />
                정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weight || ''}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">연령대</label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      <option value="puppy">퍼피 (1세 미만)</option>
                      <option value="young">청견 (1-2세)</option>
                      <option value="adult">성견 (2-7세)</option>
                      <option value="senior">시니어 (7세 이상)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                    <select
                      value={breedSize}
                      onChange={(e) => setBreedSize(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                      <option value="small">소형견</option>
                      <option value="medium">중형견</option>
                      <option value="large">대형견</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">활동량</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'low', label: '적음', desc: '실내 위주' },
                      { id: 'normal', label: '보통', desc: '일일 산책' },
                      { id: 'high', label: '많음', desc: '운동/훈련' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActivityLevel(item.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${activityLevel === item.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-100 hover:border-red-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold text-sm">{item.label}</div>
                        <div className="text-xs opacity-70">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={weight <= 0}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Beef className="w-5 h-5 mr-2" />
                  필요량 계산하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-red-100 uppercase tracking-wider">일일 단백질 필요량</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {result.dailyProtein}
                      <span className="text-xl ml-1 font-medium text-red-200 mb-2">g</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      총 칼로리의 {result.proteinPercentage}%
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-gray-900">영양 가이드</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                        <Utensils className="w-4 h-4 mr-2 text-red-500" />
                        급여 예시 (단일 급여 시)
                      </h4>
                      <div className="space-y-2">
                        {result.sources.map((source, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <source.icon className="w-5 h-5 text-gray-400" />
                              <span className="font-medium text-gray-700 text-sm">{source.name}</span>
                            </div>
                            <span className="font-bold text-red-600 text-sm">{source.amount}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        * 위 양은 해당 식품으로만 단백질을 채울 때의 예시입니다.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Dumbbell className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    체중과 활동량을 입력하면<br />필요한 단백질 양을 알려드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-rose-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-rose-400" />
                  단백질 섭취 팁
                </h3>
                <ul className="space-y-3 text-rose-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    성장기 퍼피는 성견보다 2배 많은 단백질이 필요합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    신장 질환이 있다면 단백질 제한이 필요할 수 있습니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-rose-400">•</span>
                    동물성 단백질이 식물성보다 흡수율이 높습니다.
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
