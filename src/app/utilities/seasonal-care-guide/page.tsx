'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sun, Snowflake, Leaf, Cloud, Thermometer, Droplets, Shield } from 'lucide-react'

interface SeasonalCare {
  season: string
  icon: string
  temperature: string
  careTips: {
    category: string
    tips: string[]
  }[]
  warnings: string[]
  activities: string[]
}

export default function SeasonalCareGuidePage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('spring')
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 20,
    humidity: 60,
    condition: 'sunny'
  })

  const seasonalCareData: { [key: string]: SeasonalCare } = {
    spring: {
      season: '봄',
      icon: '🌸',
      temperature: '10-20°C',
      careTips: [
        {
          category: '털 관리',
          tips: [
            '겨울털이 빠지므로 빗질을 자주 해주세요',
            '털갈이로 인한 피부 자극을 주의하세요',
            '정기적인 목욕으로 깨끗하게 유지하세요'
          ]
        },
        {
          category: '운동',
          tips: [
            '날씨가 좋아져 산책 시간을 늘려주세요',
            '알레르기 물질이 많으니 주의하세요',
            '점진적으로 활동량을 늘려가세요'
          ]
        },
        {
          category: '건강 관리',
          tips: [
            '기생충 예방약을 정기적으로 투여하세요',
            '알레르기 증상이 있으면 수의사와 상담하세요',
            '정기적인 건강 검진을 받으세요'
          ]
        }
      ],
      warnings: [
        '꽃가루 알레르기 주의',
        '기생충 활동 증가',
        '급격한 온도 변화'
      ],
      activities: [
        '공원 산책',
        '털갈이 관리',
        '알레르기 체크',
        '기생충 예방'
      ]
    },
    summer: {
      season: '여름',
      icon: '☀️',
      temperature: '25-35°C',
      careTips: [
        {
          category: '온도 관리',
          tips: [
            '실내 온도를 24-26°C로 유지하세요',
            '에어컨을 사용할 때는 직접적인 바람을 피하세요',
            '충분한 음수를 제공하세요'
          ]
        },
        {
          category: '산책 관리',
          tips: [
            '아침이나 저녁 시간대에 산책하세요',
            '뜨거운 아스팔트를 피하세요',
            '그늘에서 충분히 휴식을 취하세요'
          ]
        },
        {
          category: '피부 관리',
          tips: [
            '정기적인 목욕으로 시원하게 해주세요',
            '발가락 사이를 자주 확인하세요',
            '햇빛 화상에 주의하세요'
          ]
        }
      ],
      warnings: [
        '열사병 위험',
        '뜨거운 아스팔트 화상',
        '탈수 위험'
      ],
      activities: [
        '이른 아침 산책',
        '수영장 놀이',
        '시원한 곳에서 휴식',
        '충분한 수분 섭취'
      ]
    },
    autumn: {
      season: '가을',
      icon: '🍂',
      temperature: '10-20°C',
      careTips: [
        {
          category: '털 관리',
          tips: [
            '겨울털이 자라므로 영양 관리가 중요합니다',
            '정기적인 빗질로 털을 건강하게 유지하세요',
            '피부 건조를 방지하세요'
          ]
        },
        {
          category: '운동',
          tips: [
            '선선한 날씨에 충분한 운동을 시켜주세요',
            '활동량을 점진적으로 늘려가세요',
            '실내외 활동을 균형있게 하세요'
          ]
        },
        {
          category: '건강 관리',
          tips: [
            '면역력 강화를 위한 영양 관리',
            '정기적인 건강 검진',
            '추위에 대비한 준비'
          ]
        }
      ],
      warnings: [
        '급격한 온도 변화',
        '피부 건조',
        '활동량 감소'
      ],
      activities: [
        '가을 산책',
        '털 관리',
        '영양 보충',
        '실내 놀이'
      ]
    },
    winter: {
      season: '겨울',
      icon: '❄️',
      temperature: '-5-10°C',
      careTips: [
        {
          category: '보온 관리',
          tips: [
            '실내 온도를 20-22°C로 유지하세요',
            '따뜻한 침구를 제공하세요',
            '바닥에 매트를 깔아주세요'
          ]
        },
        {
          category: '산책 관리',
          tips: [
            '추운 날씨에는 짧은 산책을 하세요',
            '방한복을 입혀주세요',
            '눈이나 얼음을 피하세요'
          ]
        },
        {
          category: '피부 관리',
          tips: [
            '실내 습도를 적절히 유지하세요',
            '발가락 사이를 자주 확인하세요',
            '건조한 피부를 보습해주세요'
          ]
        }
      ],
      warnings: [
        '저체온증 위험',
        '눈과 얼음 화상',
        '활동량 감소로 인한 비만'
      ],
      activities: [
        '실내 놀이',
        '짧은 산책',
        '따뜻한 휴식',
        '영양 관리'
      ]
    }
  }

  const weatherIcons = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️'
  }

  const getWeatherIcon = (condition: string) => {
    return weatherIcons[condition as keyof typeof weatherIcons] || '☀️'
  }

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-600'
    if (temp < 10) return 'text-blue-500'
    if (temp < 20) return 'text-green-500'
    if (temp < 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getTemperatureAdvice = (temp: number) => {
    if (temp < 0) return '매우 추운 날씨입니다. 실내 활동을 권장합니다.'
    if (temp < 10) return '추운 날씨입니다. 짧은 산책을 권장합니다.'
    if (temp < 20) return '적당한 날씨입니다. 일반적인 활동이 가능합니다.'
    if (temp < 30) return '따뜻한 날씨입니다. 충분한 수분을 제공하세요.'
    return '매우 더운 날씨입니다. 실내 활동을 권장합니다.'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Sun className="w-10 h-10 text-orange-600 mr-3" />
            계절별 케어 가이드
          </h1>
          <p className="text-xl text-gray-600">봄, 여름, 가을, 겨울별 반려견 케어 방법을 제공합니다</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">계절 선택</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(seasonalCareData).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSeason(key)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedSeason === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{data.icon}</div>
                    <div className="font-semibold text-gray-900">{data.season}</div>
                    <div className="text-sm text-gray-600">{data.temperature}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedSeason && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{seasonalCareData[selectedSeason].icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{seasonalCareData[selectedSeason].season} 케어 가이드</h2>
                    <p className="text-gray-600">온도: {seasonalCareData[selectedSeason].temperature}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {seasonalCareData[selectedSeason].careTips.map((category, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h3>
                      <ul className="space-y-2">
                        {category.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      주의사항
                    </h3>
                    <ul className="space-y-2">
                      {seasonalCareData[selectedSeason].warnings.map((warning, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">⚠️</span>
                          <span className="text-red-700">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">추천 활동</h3>
                    <ul className="space-y-2">
                      {seasonalCareData[selectedSeason].activities.map((activity, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">🎯</span>
                          <span className="text-green-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">현재 날씨</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{getWeatherIcon(currentWeather.condition)}</div>
                  <div className={`text-3xl font-bold ${getTemperatureColor(currentWeather.temperature)}`}>
                    {currentWeather.temperature}°C
                  </div>
                  <div className="text-sm text-gray-600">습도: {currentWeather.humidity}%</div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">온도</label>
                    <input
                      type="range"
                      min="-10"
                      max="40"
                      value={currentWeather.temperature}
                      onChange={(e) => setCurrentWeather({...currentWeather, temperature: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>-10°C</span>
                      <span>40°C</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">습도</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentWeather.humidity}
                      onChange={(e) => setCurrentWeather({...currentWeather, humidity: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
                    <select
                      value={currentWeather.condition}
                      onChange={(e) => setCurrentWeather({...currentWeather, condition: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="sunny">맑음</option>
                      <option value="cloudy">흐림</option>
                      <option value="rainy">비</option>
                      <option value="snowy">눈</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    {getTemperatureAdvice(currentWeather.temperature)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">계절별 체크리스트</h2>
              <div className="space-y-4">
                {Object.entries(seasonalCareData).map(([key, data]) => (
                  <div key={key} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{data.icon}</span>
                      <h3 className="font-semibold text-gray-900">{data.season}</h3>
                    </div>
                    <div className="space-y-2">
                      {data.activities.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌡️ 계절별 케어 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">봄/가을</h3>
              <ul className="space-y-1 text-sm">
                <li>• 털갈이 관리와 정기적인 빗질</li>
                <li>• 알레르기 물질 주의</li>
                <li>• 기생충 예방 관리</li>
                <li>• 적절한 운동량 유지</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">여름/겨울</h3>
              <ul className="space-y-1 text-sm">
                <li>• 온도 관리와 실내 환경 조성</li>
                <li>• 충분한 수분 공급</li>
                <li>• 산책 시간 조절</li>
                <li>• 피부 건강 관리</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
