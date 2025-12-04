'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sun, CloudRain, Wind, Snowflake, ArrowLeft, Thermometer, Droplets, Umbrella, Heart, Scissors, Activity } from 'lucide-react'

interface SeasonData {
  id: string
  name: string
  icon: any
  color: string
  bg: string
  desc: string
  tips: {
    health: string[]
    grooming: string[]
    activity: string[]
  }
}

export default function SeasonalCareGuidePage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('spring')
  const [temperature, setTemperature] = useState<number>(20)

  const seasons: SeasonData[] = [
    {
      id: 'spring',
      name: '봄',
      icon: Wind,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      desc: '따뜻한 바람과 함께 찾아오는 털갈이와 알레르기의 계절',
      tips: {
        health: ['심장사상충 예방 시작하기', '꽃가루 알레르기 체크', '진드기 방지 목걸이 착용'],
        grooming: ['죽은 털 빗질해주기 (털갈이)', '산책 후 발 닦기', '눈물 자국 관리'],
        activity: ['산책 시간 점차 늘리기', '새로운 산책 코스 탐험', '노즈워크로 스트레스 해소']
      }
    },
    {
      id: 'summer',
      name: '여름',
      icon: Sun,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      desc: '뜨거운 태양 아래 열사병과 탈수를 조심해야 하는 계절',
      tips: {
        health: ['열사병 증상 미리 알기', '충분한 수분 섭취', '자외선 차단제 바르기'],
        grooming: ['발바닥 털 짧게 정리', '잦은 목욕보다는 물수건', '쿨링 조끼 착용'],
        activity: ['이른 아침/늦은 밤 산책', '수영이나 물놀이', '실내 에어컨 놀이']
      }
    },
    {
      id: 'autumn',
      name: '가을',
      icon: CloudRain,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      desc: '선선한 날씨에 살찌기 쉽고 피부가 건조해지는 계절',
      tips: {
        health: ['체중 관리 신경 쓰기', '환절기 감기 조심', '종합 백신 접종 확인'],
        grooming: ['보습제 발라주기', '겨울 털 준비 빗질', '발톱 관리'],
        activity: ['등산이나 긴 산책', '어질리티 도전', '낙엽 밟기 놀이']
      }
    },
    {
      id: 'winter',
      name: '겨울',
      icon: Snowflake,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      desc: '추위와 염화칼슘으로부터 발바닥을 지켜야 하는 계절',
      tips: {
        health: ['실내 온도/습도 유지', '관절염 주의 (미끄럼)', '저체온증 예방'],
        grooming: ['발바닥 보습 밤 바르기', '정전기 방지 스프레이', '따뜻한 옷 입히기'],
        activity: ['짧고 굵은 산책', '실내 터그 놀이', '염화칼슘 피해서 걷기']
      }
    }
  ]

  const currentSeason = seasons.find(s => s.id === selectedSeason)!

  const getTempAdvice = (temp: number) => {
    if (temp >= 30) return { text: '위험! 야외 활동을 자제하세요.', color: 'text-red-600', bg: 'bg-red-100' }
    if (temp >= 25) return { text: '주의! 그늘 위주로 짧게 산책하세요.', color: 'text-orange-600', bg: 'bg-orange-100' }
    if (temp <= -5) return { text: '위험! 방한복 필수, 짧게 산책하세요.', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (temp <= 5) return { text: '주의! 옷을 입히고 체온 유지에 신경 쓰세요.', color: 'text-sky-600', bg: 'bg-sky-100' }
    return { text: '산책하기 딱 좋은 날씨입니다!', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const advice = getTempAdvice(temperature)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-2xl ${currentSeason.bg} ${currentSeason.color}`}>
              <currentSeason.icon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">계절별 케어 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            사계절 내내 건강하고 행복하게, 시기별 맞춤 관리법을 확인하세요.
          </p>
        </div>

        {/* Season Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedSeason === season.id
                  ? `${season.bg} ${season.color} border-current`
                  : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                }`}
            >
              <season.icon className="w-8 h-8" />
              <span className="font-bold">{season.name}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Care Tips */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className={`text-xl font-bold mb-2 ${currentSeason.color}`}>
                {currentSeason.name}철 건강 관리
              </h2>
              <p className="text-gray-600 mb-8">{currentSeason.desc}</p>

              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                    <Heart className="w-5 h-5 text-red-500" />
                    건강 체크포인트
                  </h3>
                  <ul className="space-y-3">
                    {currentSeason.tips.health.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentSeason.bg.replace('bg-', 'bg-slate-400')}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                    <Scissors className="w-5 h-5 text-blue-500" />
                    미용 및 위생
                  </h3>
                  <ul className="space-y-3">
                    {currentSeason.tips.grooming.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentSeason.bg.replace('bg-', 'bg-slate-400')}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                    <Activity className="w-5 h-5 text-green-500" />
                    활동 및 산책
                  </h3>
                  <ul className="space-y-3">
                    {currentSeason.tips.activity.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentSeason.bg.replace('bg-', 'bg-slate-400')}`} />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Weather Simulator */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-gray-500" />
                오늘의 산책 지수
              </h2>

              <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {temperature}°C
                </div>
                <div className="text-sm text-gray-500">현재 기온</div>
              </div>

              <div className="mb-6">
                <input
                  type="range"
                  min="-20"
                  max="40"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>-20°C</span>
                  <span>0°C</span>
                  <span>20°C</span>
                  <span>40°C</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-sm font-bold text-center leading-relaxed ${advice.bg} ${advice.color}`}>
                {advice.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
