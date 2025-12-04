'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ruler, Footprints, Activity, CloudSun, Thermometer, ArrowLeft, Clock, Flame, Info } from 'lucide-react'

export default function WalkingDistanceCalculatorPage() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [age, setAge] = useState<number>(3)
  const [energy, setEnergy] = useState<number>(5) // 1-10
  const [temp, setTemp] = useState<number>(20)

  const calculate = () => {
    let baseDistance = 2 // km
    let baseTime = 30 // min

    // Size factor
    if (size === 'small') { baseDistance = 1.5; baseTime = 25 }
    if (size === 'large') { baseDistance = 3.5; baseTime = 45 }

    // Age factor
    if (age < 1) { baseDistance *= 0.5; baseTime *= 0.5 } // Puppy
    else if (age > 9) { baseDistance *= 0.6; baseTime *= 0.7 } // Senior

    // Energy factor
    const energyFactor = 0.5 + (energy / 10)
    baseDistance *= energyFactor
    baseTime *= energyFactor

    // Temp factor (reduce if too hot or cold)
    if (temp > 28 || temp < 0) {
      baseDistance *= 0.5
      baseTime *= 0.5
    } else if (temp > 24 || temp < 5) {
      baseDistance *= 0.8
      baseTime *= 0.8
    }

    return {
      distance: Math.round(baseDistance * 10) / 10,
      time: Math.round(baseTime),
      calories: Math.round(baseTime * (size === 'large' ? 5 : size === 'medium' ? 3.5 : 2.5))
    }
  }

  const result = calculate()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Ruler className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">적정 산책량 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            오늘 날씨와 컨디션에 딱 맞는 산책 코스를 제안해드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                상태 체크
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">크기</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'small', label: '소형견' },
                      { id: 'medium', label: '중형견' },
                      { id: 'large', label: '대형견' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSize(item.id as any)}
                        className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${size === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">나이 ({age}살)</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">에너지 레벨 ({energy})</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>차분함</span>
                    <span>활발함</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">현재 기온 ({temp}°C)</label>
                  <div className="flex items-center gap-4">
                    <Thermometer className="w-5 h-5 text-gray-400" />
                    <input
                      type="range"
                      min="-10"
                      max="40"
                      value={temp}
                      onChange={(e) => setTemp(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                <Footprints className="w-5 h-5 mr-2 text-blue-500" />
                추천 산책 플랜
              </h2>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 shadow-sm">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">추천 거리</div>
                  <div className="text-3xl font-black text-blue-900">{result.distance}km</div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">소요 시간</div>
                  <div className="text-3xl font-black text-green-900">{result.time}분</div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 shadow-sm">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">소모 칼로리</div>
                  <div className="text-3xl font-black text-orange-900">{result.calories}kcal</div>
                </div>
              </div>

              {/* Weather Warning */}
              {(temp > 28 || temp < 0) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                  <CloudSun className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 text-sm">날씨 주의</h4>
                    <p className="text-sm text-red-700 mt-1">
                      기온이 너무 {temp > 28 ? '높습니다' : '낮습니다'}.
                      산책 시간을 줄이고 실내 활동을 병행하는 것을 추천합니다.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-gray-400" />
                  산책 팁
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 산책 전후로 충분한 수분을 섭취하게 해주세요.</li>
                  <li>• 아스팔트 바닥 온도를 손등으로 확인하세요.</li>
                  <li>• 노령견이나 관절이 약한 경우 평지 위주로 산책하세요.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
