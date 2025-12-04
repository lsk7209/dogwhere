'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Thermometer, Sun, CloudRain, Wind, Hand, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Cloud } from 'lucide-react'

export default function WalkingTemperatureCheckPage() {
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<{
    temp: number
    condition: 'sunny' | 'cloudy' | 'rainy'
    humidity: number
    wind: number
  } | null>(null)

  const checkWeather = () => {
    setLoading(true)
    // Mock API call
    setTimeout(() => {
      setWeather({
        temp: 24,
        condition: 'sunny',
        humidity: 45,
        wind: 3
      })
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    checkWeather()
  }, [])

  const getStatus = (temp: number) => {
    if (temp > 28) return { status: 'danger', msg: '산책 금지! 너무 더워요.', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (temp > 24) return { status: 'warning', msg: '주의! 짧게 산책하세요.', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
    if (temp < -5) return { status: 'danger', msg: '산책 금지! 너무 추워요.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
    if (temp < 5) return { status: 'warning', msg: '옷을 입히고 산책하세요.', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' }
    return { status: 'safe', msg: '산책하기 딱 좋은 날씨!', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Thermometer className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">산책 날씨 체크</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            지금 나가도 될까요? 강아지의 눈높이에서 날씨를 확인해드려요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Weather Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
              ) : weather ? (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-gray-500 font-medium mb-1">현재 날씨</h2>
                      <div className="text-5xl font-black text-gray-900 flex items-start">
                        {weather.temp}°
                        <span className="text-2xl mt-2 text-gray-400">C</span>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl text-orange-500">
                      {weather.condition === 'sunny' ? <Sun className="w-12 h-12" /> :
                        weather.condition === 'rainy' ? <CloudRain className="w-12 h-12" /> :
                          <Cloud className="w-12 h-12" />}
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border-2 mb-8 text-center ${getStatus(weather.temp).bg} ${getStatus(weather.temp).border}`}>
                    <div className={`text-xl font-bold mb-1 ${getStatus(weather.temp).color}`}>
                      {getStatus(weather.temp).msg}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                      <Wind className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">풍속</div>
                        <div className="font-bold text-gray-900">{weather.wind}m/s</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                      <CloudRain className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">습도</div>
                        <div className="font-bold text-gray-900">{weather.humidity}%</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={checkWeather}
                    className="mt-8 w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    새로고침
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* Right Column: Pavement Test */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-orange-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Hand className="w-32 h-32" />
              </div>

              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Hand className="w-6 h-6 text-orange-400" />
                아스팔트 온도 체크
              </h3>

              <p className="text-orange-100 mb-6 leading-relaxed">
                여름철 아스팔트는 기온보다 훨씬 뜨거워져 화상을 입힐 수 있습니다.
                산책 전 반드시 손등 테스트를 해보세요.
              </p>

              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                <h4 className="font-bold text-lg mb-4">5초 룰 (5-Second Rule)</h4>
                <ol className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                    <span>손등을 아스팔트 바닥에 대보세요.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                    <span>5초 동안 버틸 수 없다면, 강아지도 걸을 수 없습니다.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                    <span>이럴 땐 해가 진 후나 이른 아침에 산책하세요.</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                계절별 주의사항
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Sun className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <strong className="text-gray-900">여름:</strong> 열사병 주의. 물을 꼭 챙기고 그늘로 다니세요.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CloudRain className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <strong className="text-gray-900">장마:</strong> 산책 후 발을 잘 말려 습진을 예방하세요.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
