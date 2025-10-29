'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react'

export default function WalkingCourseRecommenderPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [radius, setRadius] = useState<number>(5)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('위치 서비스를 지원하지 않습니다.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
        searchCourses(latitude, longitude)
      },
      (err) => {
        alert('위치 정보를 가져올 수 없습니다.')
      }
    )
  }

  const searchCourses = async (lat: number, lon: number) => {
    setLoading(true)
    // TODO: 한국관광공사 반려동물 서비스 API 연동
    setTimeout(() => {
      const sampleData = [
        {
          name: '한강공원 강아지 운동장',
          address: '서울 영등포구 여의도로',
          distance: 0.8,
          features: ['넓은 운동장', '물그릇', '그늘'],
          mapLink: `https://map.kakao.com/link/map/${lat},${lon}`
        },
        {
          name: '반려견 친화 산책로',
          address: '서울 마포구 상암동',
          distance: 1.5,
          features: ['전용 산책로', '휴게시설'],
          mapLink: `https://map.kakao.com/link/map/${lat},${lon}`
        }
      ]
      setResults(sampleData)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-10 h-10 text-blue-600 mr-3" />
            산책 코스 추천기
          </h1>
          <p className="text-xl text-gray-600">
            현재 위치를 기준으로 반려견 친화 산책로와 공원을 추천합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색 반경
            </label>
            <select
              value={radius}
              onChange={(e) => {
                setRadius(parseInt(e.target.value))
                if (location) {
                  searchCourses(location.lat, location.lon)
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value={5}>5km</option>
              <option value={10}>10km</option>
              <option value={15}>15km</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">코스를 검색하는 중...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">약 {item.distance}km</p>
                    </div>
                    <a
                      href={item.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <MapIcon className="w-5 h-5" />
                      <span className="text-sm">지도 보기</span>
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{item.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature: string, fIdx: number) => (
                      <span key={fIdx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 안내사항</h2>
          <p className="text-gray-700">
            실제 운영 시 한국관광공사 반려동물 서비스의 산책로/공원 데이터를 연동합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

