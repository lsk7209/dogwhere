'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, MapPin, Phone, Search } from 'lucide-react'

export default function PetFriendlyAccommodationPage() {
  const [region, setRegion] = useState<string>('seoul')
  const [accommodationType, setAccommodationType] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const searchAccommodation = async () => {
    setLoading(true)
    // TODO: 한국관광공사 반려동물 여행 API 연동
    // 현재는 샘플 데이터 표시
    setTimeout(() => {
      const sampleData = [
        {
          name: '펫 호텔 그랜드',
          address: '서울 강남구 테헤란로 123',
          phone: '02-1234-5678',
          type: 'hotel',
          description: '강아지 동반 가능한 프리미엄 호텔'
        },
        {
          name: '반려견 펜션',
          address: '경기 가평군 가평읍 가평로 456',
          phone: '031-9876-5432',
          type: 'pension',
          description: '넓은 마당과 실내 수영장이 있는 펜션'
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
            <Home className="w-10 h-10 text-green-600 mr-3" />
            반려견 동반 숙소 찾기
          </h1>
          <p className="text-xl text-gray-600">
            한국관광공사 반려동물 여행 API를 활용해 지역별 숙소를 검색합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="seoul">서울</option>
                <option value="busan">부산</option>
                <option value="jeju">제주</option>
                <option value="gangwon">강원</option>
                <option value="gyeonggi">경기</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                숙소 유형
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="all">전체</option>
                <option value="hotel">호텔</option>
                <option value="pension">펜션</option>
                <option value="resort">리조트</option>
                <option value="guesthouse">게스트하우스</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={searchAccommodation}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? '검색 중...' : '검색하기'}
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">숙소를 검색하는 중...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-400 transition-colors">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{item.phone}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 안내사항</h2>
          <p className="text-gray-700 mb-2">
            실제 운영 시 한국관광공사 반려동물 여행 API를 연동하여 실시간 숙소 정보를 제공합니다.
          </p>
        </div>
      </div>
    </div>
  )
}

