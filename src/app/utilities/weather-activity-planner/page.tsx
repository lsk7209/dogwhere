'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react'

interface WeatherActivity {
  id: string
  date: string
  weather: string
  temperature: number
  activities: string[]
  notes: string
}

export default function WeatherActivityPlannerPage() {
  const [activities, setActivities] = useState<WeatherActivity[]>([])
  const [newActivity, setNewActivity] = useState({
    weather: 'sunny',
    temperature: 20,
    activities: [] as string[],
    notes: ''
  })

  const weatherTypes = {
    sunny: { name: '맑음', icon: '☀️', color: 'text-yellow-600 bg-yellow-100' },
    cloudy: { name: '흐림', icon: '☁️', color: 'text-gray-600 bg-gray-100' },
    rainy: { name: '비', icon: '🌧️', color: 'text-blue-600 bg-blue-100' },
    snowy: { name: '눈', icon: '❄️', color: 'text-blue-400 bg-blue-50' },
    windy: { name: '바람', icon: '💨', color: 'text-green-600 bg-green-100' }
  }

  const activityOptions = {
    sunny: [
      '공원 산책', '해변 방문', '야외 카페', '놀이터', '자전거 타기',
      '피크닉', '수영', '야외 훈련', '다른 강아지와 만나기'
    ],
    cloudy: [
      '실내 놀이', '퍼즐 장난감', '기본 훈련', '간단한 산책',
      '실내 카페', '쇼핑몰', '실내 운동', '정신 자극 게임'
    ],
    rainy: [
      '실내 놀이', '퍼즐 장난감', '기본 훈련', '실내 운동',
      '간식 만들기', '그루밍', '실내 카페', '정신 자극 게임'
    ],
    snowy: [
      '짧은 산책', '눈 놀이', '실내 놀이', '따뜻한 곳에서 휴식',
      '실내 운동', '그루밍', '실내 카페', '정신 자극 게임'
    ],
    windy: [
      '보호된 곳 산책', '실내 놀이', '기본 훈련', '실내 운동',
      '실내 카페', '퍼즐 장난감', '정신 자극 게임', '그루밍'
    ]
  }

  useEffect(() => {
    const saved = localStorage.getItem('weatherActivities')
    if (saved) {
      try {
        setActivities(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('weatherActivities', JSON.stringify(activities))
    }
  }, [activities])

  const addActivity = () => {
    if (newActivity.activities.length === 0) return

    const activity: WeatherActivity = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newActivity
    }
    setActivities([activity, ...activities])
    setNewActivity({
      weather: 'sunny',
      temperature: 20,
      activities: [],
      notes: ''
    })
  }

  const toggleActivity = (activity: string) => {
    setNewActivity({
      ...newActivity,
      activities: newActivity.activities.includes(activity)
        ? newActivity.activities.filter(a => a !== activity)
        : [...newActivity.activities, activity]
    })
  }

  const getWeatherIcon = (weather: string) => {
    return weatherTypes[weather as keyof typeof weatherTypes]?.icon || '☀️'
  }

  const getWeatherName = (weather: string) => {
    return weatherTypes[weather as keyof typeof weatherTypes]?.name || weather
  }

  const getWeatherColor = (weather: string) => {
    return weatherTypes[weather as keyof typeof weatherTypes]?.color || 'text-gray-600 bg-gray-100'
  }

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-600 bg-red-100'
    if (temp >= 20) return 'text-orange-600 bg-orange-100'
    if (temp >= 10) return 'text-yellow-600 bg-yellow-100'
    if (temp >= 0) return 'text-blue-600 bg-blue-100'
    return 'text-blue-400 bg-blue-50'
  }

  const getTemperatureAdvice = (temp: number) => {
    if (temp >= 30) return '매우 더운 날씨입니다. 실내 활동을 권장합니다.'
    if (temp >= 25) return '더운 날씨입니다. 그늘진 곳에서 활동하세요.'
    if (temp >= 15) return '적당한 날씨입니다. 야외 활동에 좋습니다.'
    if (temp >= 5) return '쌀쌀한 날씨입니다. 보온에 주의하세요.'
    return '추운 날씨입니다. 실내 활동을 권장합니다.'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Cloud className="w-10 h-10 text-blue-600 mr-3" />
            날씨별 활동 플래너
          </h1>
          <p className="text-xl text-gray-600">날씨에 따른 적절한 활동 계획을 수립합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 활동 계획</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(weatherTypes).map(([key, weather]) => (
                    <button
                      key={key}
                      onClick={() => setNewActivity({...newActivity, weather: key})}
                      className={`p-3 rounded-lg border transition-colors ${
                        newActivity.weather === key
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{weather.icon}</div>
                      <div className="text-xs">{weather.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기온: {newActivity.temperature}°C
                </label>
                <input
                  type="range"
                  min="-10"
                  max="40"
                  value={newActivity.temperature}
                  onChange={(e) => setNewActivity({...newActivity, temperature: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-10°C</span>
                  <span>40°C</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {getTemperatureAdvice(newActivity.temperature)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">추천 활동</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {activityOptions[newActivity.weather as keyof typeof activityOptions]?.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newActivity.activities.includes(activity)
                        ? 'bg-blue-100 border-blue-400 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newActivity.notes}
                onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                rows={3}
                placeholder="특별한 주의사항이나 추가 계획"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={addActivity}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              활동 계획 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">활동 계획 기록</h2>
          {activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 계획이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getWeatherIcon(activity.weather)}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{activity.date}</h3>
                        <p className="text-sm text-gray-600">
                          {getWeatherName(activity.weather)} | {activity.temperature}°C
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTemperatureColor(activity.temperature)}`}>
                      {activity.temperature}°C
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">계획된 활동:</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.activities.map((act, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-gray-500">메모: {activity.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 날씨별 활동 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>맑은 날:</strong> 야외 활동에 최적입니다. 충분한 수분 공급을 잊지 마세요</li>
            <li>• <strong>흐린 날:</strong> 실내외 활동을 적절히 조합하세요</li>
            <li>• <strong>비 오는 날:</strong> 실내 활동에 집중하고, 짧은 산책만 고려하세요</li>
            <li>• <strong>눈 오는 날:</strong> 보온에 주의하고, 짧은 시간만 야외 활동하세요</li>
            <li>• <strong>바람 부는 날:</strong> 보호된 곳에서 활동하고, 먼지나 이물질에 주의하세요</li>
            <li>• <strong>극한 날씨:</strong> 강아지의 안전을 최우선으로 고려하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
