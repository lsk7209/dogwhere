'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Calendar, Users, MapPin, Star, Heart, ChevronRight, Filter } from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDates, setSelectedDates] = useState('11.11 - 11.12 (1박)')
  const [guestCount, setGuestCount] = useState('2인 1마리')

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30"></div>
        
        {/* 오버레이 텍스트 */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            반려동물과 함께하는 여행
          </h1>
          <p className="text-xl mb-8">
            강아지 동반 장소는 어서오개에서
          </p>
          
          {/* 검색바 */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="여행지나 장소를 검색해보세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{selectedDates}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{guestCount}</span>
              </div>
              
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 인기 여행지 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 여행지</h2>
              <p className="text-gray-600">고객분들이 가장 많이 찾는 강아지 동반 여행지를 알아보세요</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: '강남구', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/seoul/cluster/gangnam-cluster' },
              { name: '마포구', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/seoul/cluster/hongdae-cluster' },
              { name: '제주도', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/jeju' },
              { name: '가평군', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/gyeonggi/cluster/gapyeong-cluster' },
              { name: '강릉시', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/gangwon' },
              { name: '부산시', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', href: '/busan' }
            ].map((destination) => (
              <Link key={destination.name} href={destination.href} className="group">
                <div className="aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center mt-3 font-medium text-gray-900">{destination.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 어서오개 추천 장소 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">어서오개 추천 장소</h2>
              <p className="text-gray-600">어서오개에서 엄선한 프리미엄 강아지 동반 장소</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: '멍멍카페', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '펫파크', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '강아지호텔', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '펫샵', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '강아지식당', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '펜션', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '글램핑', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: '공원', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
            ].map((place) => (
              <div key={place.name} className="group cursor-pointer">
                <div className="aspect-square rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center mt-3 font-medium text-gray-900">{place.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 갓성비 장소 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">✨ 갓성비 강아지 동반 장소</h2>
              <p className="text-gray-600">합리적인 가격에 강아지와 함께 즐길 수 있는 곳들</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: '홍천 강아지놀이터',
                location: '강원 홍천',
                rating: 4.8,
                reviews: 127,
                price: '30,000원',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                amenities: ['Wi-Fi', '주차장', '강아지 놀이터']
              },
              {
                name: '태안 바다펜션',
                location: '충남 태안',
                rating: 4.6,
                reviews: 89,
                price: '50,000원',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                amenities: ['바다전망', '바베큐', '강아지 동반']
              },
              {
                name: '제주 힐링하우스',
                location: '제주 서귀포',
                rating: 4.9,
                reviews: 203,
                price: '40,000원',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                amenities: ['전용 마당', '주방', '펫샤워']
              },
              {
                name: '양평 글램핑장',
                location: '경기 양평',
                rating: 4.7,
                reviews: 156,
                price: '80,000원',
                image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                amenities: ['글램핑', '캠프파이어', '강아지 동반']
              }
            ].map((place) => (
              <div key={place.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{place.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{place.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{place.rating}</span>
                    <span className="text-gray-400 text-sm">({place.reviews})</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {place.amenities.map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">{place.price}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주말엔 뭐하지? */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">주말엔 뭐하지?</h2>
              <p className="text-gray-600">강아지와 함께하는 특별한 주말 활동</p>
            </div>
            <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium">
              더보기 →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '숲속에서의 힐링',
                description: '힐링과 견생샷을 한 번에! 홍천 신상 감성숙소',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: '홍천 숲온스테이'
              },
              {
                title: '신규 특채 풀빌라',
                description: '댕댕이랑 힐링 여행 양평 스테이라라온',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: '양평 스테이라라온'
              },
              {
                title: '반짝반짝 아름답게',
                description: '댕댕이와 함께 할 수 있는 야경 명소 TOP5',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                location: '전국 야경 명소'
              }
            ].map((activity) => (
              <div key={activity.title} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{activity.location}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}