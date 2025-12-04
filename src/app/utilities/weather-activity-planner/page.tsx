'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CloudSun, Umbrella, Gamepad2, Wind, Thermometer, ArrowLeft, Sun, CloudRain, Snowflake, Home, Tent } from 'lucide-react'

interface Activity {
  id: string
  name: string
  type: 'outdoor' | 'indoor'
  intensity: 'low' | 'medium' | 'high'
  desc: string
  icon: any
}

export default function WeatherActivityPlannerPage() {
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'snowy' | 'hot'>('sunny')
  const [temp, setTemp] = useState<number>(22)

  const getActivities = (): Activity[] => {
    if (weather === 'sunny' && temp < 28) {
      return [
        { id: '1', name: '공원 산책', type: 'outdoor', intensity: 'medium', desc: '맑은 공기를 마시며 여유롭게 걸어요.', icon: Tent },
        { id: '2', name: '프리스비', type: 'outdoor', intensity: 'high', desc: '넓은 잔디밭에서 신나게 뛰어요.', icon: Wind },
      ]
    }
    if (weather === 'rainy' || weather === 'snowy' || temp >= 28) {
      return [
        { id: '3', name: '노즈워크', type: 'indoor', intensity: 'low', desc: '간식을 숨겨 후각 활동을 도와요.', icon: Gamepad2 },
        { id: '4', name: '터그 놀이', type: 'indoor', intensity: 'high', desc: '스트레스를 날려버리는 터그 놀이!', icon: Home },
        { id: '5', name: '기본 예절 교육', type: 'indoor', intensity: 'medium', desc: '앉아, 엎드려 등 기본기를 다져요.', icon: Gamepad2 },
      ]
    }
    return []
  }

  const activities = getActivities()

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
              <CloudSun className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">날씨별 놀이 추천</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            비가 오나 눈이 오나, 우리 아이의 즐거움은 멈추지 않아요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Weather Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-blue-500" />
                날씨 설정
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">현재 날씨</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'sunny', label: '맑음', icon: Sun },
                      { id: 'rainy', label: '비', icon: CloudRain },
                      { id: 'snowy', label: '눈', icon: Snowflake },
                      { id: 'hot', label: '폭염', icon: Thermometer },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setWeather(item.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${weather === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="font-bold text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">기온 ({temp}°C)</label>
                  <input
                    type="range"
                    min="-10"
                    max="40"
                    value={temp}
                    onChange={(e) => setTemp(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 text-white shadow-lg transition-colors ${weather === 'sunny' && temp < 28 ? 'bg-blue-500' : 'bg-gray-700'
              }`}>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                {weather === 'sunny' && temp < 28 ? <Sun className="w-5 h-5 mr-2" /> : <Umbrella className="w-5 h-5 mr-2" />}
                오늘의 조언
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {weather === 'sunny' && temp < 28
                  ? '산책하기 완벽한 날씨예요! 평소보다 조금 더 멀리 나가보는 건 어떨까요?'
                  : '야외 활동이 어려운 날씨네요. 집에서 할 수 있는 재미있는 놀이를 추천해드릴게요.'}
              </p>
            </div>
          </div>

          {/* Right Column: Activities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-blue-500" />
                추천 활동 리스트
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl transition-colors ${activity.type === 'outdoor' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                        <activity.icon className="w-6 h-6" />
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${activity.intensity === 'high' ? 'bg-red-100 text-red-600' :
                          activity.intensity === 'medium' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                        강도: {activity.intensity === 'high' ? '높음' : activity.intensity === 'medium' ? '보통' : '낮음'}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2">{activity.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {activity.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
