'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Home, MapPin, Phone, Search, ArrowLeft, Star, Wifi, Dog, Trees, Waves, Coffee, Car, Check } from 'lucide-react'

interface Accommodation {
  id: number
  name: string
  address: string
  price: number
  rating: number
  reviews: number
  type: string
  image: string
  tags: string[]
  amenities: string[]
}

export default function PetFriendlyAccommodationPage() {
  const [region, setRegion] = useState<string>('seoul')
  const [accommodationType, setAccommodationType] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Accommodation[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const searchAccommodation = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const sampleData: Accommodation[] = [
      {
        id: 1,
        name: '멍멍 힐링 리조트',
        address: '경기도 가평군 청평면',
        price: 180000,
        rating: 4.8,
        reviews: 124,
        type: 'resort',
        image: 'bg-green-100',
        tags: ['대형견 가능', '수영장'],
        amenities: ['pool', 'playground', 'wifi', 'parking']
      },
      {
        id: 2,
        name: '포레스트 펫 펜션',
        address: '강원도 홍천군 서면',
        price: 120000,
        rating: 4.5,
        reviews: 89,
        type: 'pension',
        image: 'bg-emerald-100',
        tags: ['독채', '바베큐'],
        amenities: ['playground', 'wifi', 'parking', 'bbq']
      },
      {
        id: 3,
        name: '어반 펫 호텔',
        address: '서울시 강남구 역삼동',
        price: 250000,
        rating: 4.9,
        reviews: 215,
        type: 'hotel',
        image: 'bg-blue-100',
        tags: ['럭셔리', '스파'],
        amenities: ['spa', 'wifi', 'parking', 'cafe']
      },
      {
        id: 4,
        name: '제주 멍스테이',
        address: '제주시 애월읍',
        price: 150000,
        rating: 4.7,
        reviews: 156,
        type: 'guesthouse',
        image: 'bg-orange-100',
        tags: ['오션뷰', '조식'],
        amenities: ['wifi', 'parking', 'cafe']
      }
    ]

    // Filter logic (mock)
    let filtered = sampleData
    if (region !== 'all') {
      // Mock filtering by region (just randomizing for demo)
      filtered = sampleData.filter(() => Math.random() > 0.3)
    }
    if (accommodationType !== 'all') {
      filtered = filtered.filter(item => item.type === accommodationType)
    }

    setResults(filtered.length > 0 ? filtered : sampleData.slice(0, 2))
    setLoading(false)
  }, [region, accommodationType])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'pool': return <Waves className="w-4 h-4" />
      case 'playground': return <Trees className="w-4 h-4" />
      case 'wifi': return <Wifi className="w-4 h-4" />
      case 'parking': return <Car className="w-4 h-4" />
      case 'cafe': return <Coffee className="w-4 h-4" />
      default: return <Check className="w-4 h-4" />
    }
  }

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case 'pool': return '수영장'
      case 'playground': return '운동장'
      case 'wifi': return '와이파이'
      case 'parking': return '주차장'
      case 'cafe': return '카페'
      case 'spa': return '스파'
      case 'bbq': return '바베큐'
      default: return amenity
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">반려견 동반 숙소</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            사랑하는 반려견과 함께 떠나는 여행, 편안한 휴식처를 찾아보세요.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">여행지</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="all">전국</option>
                  <option value="seoul">서울/경기</option>
                  <option value="gangwon">강원도</option>
                  <option value="jeju">제주도</option>
                  <option value="busan">부산/경상</option>
                  <option value="jeonla">전라도</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">숙소 유형</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                >
                  <option value="all">전체</option>
                  <option value="hotel">호텔/리조트</option>
                  <option value="pension">펜션/풀빌라</option>
                  <option value="guesthouse">게스트하우스</option>
                  <option value="camping">캠핑/글램핑</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={searchAccommodation}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold flex items-center justify-center disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    검색하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                검색 결과 <span className="text-green-600">{results.length}</span>개
              </h2>
              <div className="flex gap-2">
                <select className="text-sm border-none bg-transparent font-medium text-gray-500 focus:ring-0 cursor-pointer">
                  <option>추천순</option>
                  <option>가격 낮은순</option>
                  <option>평점 높은순</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {results.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer">
                  <div className={`h-48 ${item.image} relative`}>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                      {item.rating} ({item.reviews})
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {item.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {item.price.toLocaleString()}원~
                        </div>
                        <div className="text-xs text-gray-400">1박 기준</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-4 pt-4">
                      <div className="flex gap-4 text-gray-500 text-sm">
                        {item.amenities.slice(0, 4).map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-1" title={getAmenityLabel(amenity)}>
                            {getAmenityIcon(amenity)}
                            <span className="text-xs">{getAmenityLabel(amenity)}</span>
                          </div>
                        ))}
                        {item.amenities.length > 4 && (
                          <span className="text-xs flex items-center">+{item.amenities.length - 4}</span>
                        )}
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-xl border border-green-600 text-green-600 font-bold hover:bg-green-50 transition-colors text-sm">
                      상세보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Initial State */}
        {!hasSearched && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-200">
              <Dog className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">어디로 떠나시나요?</h3>
            <p className="text-gray-500">
              지역과 숙소 유형을 선택하여<br />반려견과 함께할 수 있는 최고의 숙소를 찾아보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
