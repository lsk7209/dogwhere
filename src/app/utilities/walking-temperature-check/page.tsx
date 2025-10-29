'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Thermometer, MapPin, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

export default function WalkingTemperatureCheckPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)
  const [humidity, setHumidity] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'safe' | 'caution' | 'danger' | null>(null)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('위치 서비스를 지원하지 않는 브라우저입니다.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
        await fetchWeather(latitude, longitude)
      },
      (err) => {
        setError('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.')
        setLoading(false)
      }
    )
  }

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      // Open-Meteo API 사용 (무료, API 키 불필요)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=Asia%2FSeoul`
      )
      
      if (!response.ok) throw new Error('날씨 정보를 가져올 수 없습니다.')
      
      const data = await response.json()
      const temp = data.current.temperature_2m
      const hum = data.current.relative_humidity_2m
      
      setTemperature(Math.round(temp))
      setHumidity(Math.round(hum))
      
      // 산책 적정 여부 판단
      let newStatus: 'safe' | 'caution' | 'danger'
      if (temp < -5 || temp > 30) {
        newStatus = 'danger'
      } else if (temp < 0 || temp > 25 || hum > 80) {
        newStatus = 'caution'
      } else {
        newStatus = 'safe'
      }
      setStatus(newStatus)
      setLoading(false)
    } catch (err) {
      setError('날씨 정보를 가져오는데 실패했습니다.')
      setLoading(false)
    }
  }

  const getStatusInfo = () => {
    if (!status || !temperature) return null
    
    switch (status) {
      case 'safe':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-600" />,
          message: '산책하기 좋은 날씨입니다!',
          advice: '물을 충분히 준비하고 그늘진 곳을 이용하세요.',
          color: 'bg-green-50 border-green-200'
        }
      case 'caution':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
          message: '산책 시 주의가 필요합니다.',
          advice: temperature < 0 
            ? '추위에 주의하고 짧은 시간만 산책하세요.'
            : '더운 시간대를 피하고 충분히 쉬어가며 산책하세요.',
          color: 'bg-yellow-50 border-yellow-200'
        }
      case 'danger':
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-600" />,
          message: '산책이 위험할 수 있습니다.',
          advice: temperature < -5
            ? '동상 위험이 있으니 실내에서 놀아주세요.'
            : '열사병 위험이 있으니 산책을 자제하세요.',
          color: 'bg-red-50 border-red-200'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Thermometer className="w-10 h-10 text-red-600 mr-3" />
            산책 온도 체크기
          </h1>
          <p className="text-xl text-gray-600">
            현재 위치의 온도와 습도를 확인하여 산책 적정 여부를 판단합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">날씨 정보를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={getLocation}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {!loading && !error && temperature !== null && statusInfo && (
            <div className="space-y-6">
              {location && (
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">현재 위치 기준</span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">현재 온도</p>
                  <p className="text-4xl font-bold text-blue-700">{temperature}°C</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">현재 습도</p>
                  <p className="text-4xl font-bold text-purple-700">{humidity}%</p>
                </div>
              </div>

              <div className={`border-2 rounded-lg p-6 ${statusInfo.color}`}>
                <div className="flex items-center space-x-4 mb-4">
                  {statusInfo.icon}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{statusInfo.message}</h3>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-700">{statusInfo.advice}</p>
                </div>
              </div>

              <button
                onClick={getLocation}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                날씨 정보 새로고침
              </button>
            </div>
          )}

          {!loading && !error && temperature === null && (
            <div className="text-center py-12">
              <button
                onClick={getLocation}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                현재 위치 날씨 확인하기
              </button>
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 산책 온도 기준</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>적정:</strong> 0°C ~ 25°C (습도 80% 이하)</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>주의:</strong> 0°C 미만 또는 25°C 초과, 습도 80% 초과</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>위험:</strong> -5°C 미만 또는 30°C 초과</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            * 견종, 체격, 건강 상태에 따라 개별 차이가 있을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

