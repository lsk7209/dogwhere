'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, MapPin, Phone, AlertCircle, Navigation } from 'lucide-react'

export default function FindVeterinaryPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = () => {
    setLoading(true)
    if (!navigator.geolocation) {
      alert('위치 서비스를 지원하지 않습니다.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
        await searchVeterinary(latitude, longitude)
      },
      (err) => {
        alert('위치 정보를 가져올 수 없습니다.')
        setLoading(false)
      }
    )
  }

  const searchVeterinary = async (lat: number, lon: number) => {
    // TODO: Kakao Map API 또는 Google Places API 연동
    // 현재는 샘플 데이터
    setTimeout(() => {
      const sampleData = [
        {
          name: '24시 동물병원',
          address: '서울 강남구 테헤란로 123',
          phone: '02-1234-5678',
          distance: 0.5,
          emergency: true
        },
        {
          name: '반려동물 메디컬 센터',
          address: '서울 서초구 서초대로 456',
          phone: '02-2345-6789',
          distance: 1.2,
          emergency: false
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
            <Stethoscope className="w-10 h-10 text-red-600 mr-3" />
            근처 동물병원 찾기
          </h1>
          <p className="text-xl text-gray-600">
            현재 위치를 기준으로 가까운 동물병원과 24시 응급실을 찾습니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {!location && !loading && (
            <div className="text-center py-12">
              <button
                onClick={getLocation}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
              >
                현재 위치에서 병원 찾기
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">병원을 검색하는 중...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:border-red-400 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        {item.name}
                        {item.emergency && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            24시 응급
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">약 {item.distance}km</p>
                    </div>
                    {item.emergency && (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${item.phone}`} className="hover:text-red-600">
                        {item.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 안내사항</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 실제 운영 시 Kakao Map API 또는 Google Places API를 연동합니다.</li>
            <li>• 응급 상황 시 가까운 병원에 직접 전화하여 수용 가능 여부를 확인하세요.</li>
            <li>• 병원 영업 시간 및 응급 진료 가능 여부는 변동될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

