'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Users, Clock, Car, Train, Filter, ChevronRight } from 'lucide-react'
import { RegionClusterUtils, RegionKey } from '@/lib/regions/clusters'

interface ClusterDetailPageProps {
  region: RegionKey
  regionName: string
  clusterId: string
}

export function ClusterDetailPage({ region, regionName, clusterId }: ClusterDetailPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'distance'>('popularity')

  const clusters = RegionClusterUtils.getClustersByRegion(region)
  const cluster = clusters.find(c => c.id === clusterId)
  const regions = RegionClusterUtils.getRegionsByCluster(region, clusterId)
  const stats = RegionClusterUtils.getClusterStats(region, clusterId)

  if (!cluster) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">클러스터를 찾을 수 없습니다</h1>
          <Link href={`/${region}`} className="text-blue-600 hover:text-blue-800">
            ← {regionName}으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'dog-cafe', label: '강아지 카페' },
    { value: 'dog-park', label: '강아지 공원' },
    { value: 'dog-hotel', label: '강아지 호텔' },
    { value: 'restaurant', label: '강아지 식당' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl">{cluster.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{cluster.name}</h1>
              <p className="text-xl">{cluster.description}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${cluster.color}`}>
            {cluster.type === 'hotspot' ? '핫스팟' : 
             cluster.type === 'cluster' ? '클러스터' :
             cluster.type === 'special' ? '특별지역' : '일반지역'}
          </span>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 네비게이션 */}
        <div className="mb-8">
          <Link 
            href={`/${region}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{regionName}으로 돌아가기</span>
          </Link>
        </div>

        {/* 통계 정보 */}
        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">클러스터 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.avgDogFriendlyScore}</div>
                <div className="text-sm text-gray-500">평균 강아지 친화도</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.avgPopularityScore}</div>
                <div className="text-sm text-gray-500">평균 인기도</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.regionCount}</div>
                <div className="text-sm text-gray-500">포함 지역 수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(stats.totalPopulation / 10000)}만
                </div>
                <div className="text-sm text-gray-500">총 인구</div>
              </div>
            </div>
          </div>
        )}

        {/* 필터 및 정렬 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">카테고리:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">인기도</option>
                <option value="rating">평점</option>
                <option value="distance">거리</option>
              </select>
            </div>
          </div>
        </div>

        {/* 포함 지역 목록 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">포함 지역 ({regions.length}개)</h2>
              <p className="text-gray-600">클러스터에 포함된 지역들을 확인해보세요</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((regionData) => (
              <div key={regionData.sig} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{regionData.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">{regionData.dogFriendlyScore}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{regionData.dogFriendlyScore}</div>
                    <div className="text-xs text-gray-500">강아지 친화도</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{regionData.popularityScore}</div>
                    <div className="text-xs text-gray-500">인기도</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>인구: {Math.round(regionData.population / 10000)}만명</span>
                    <span>접근성: {regionData.accessibilityScore}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      href={`/${region}/${regionData.sig}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      지역 보기
                    </Link>
                    <Link
                      href={`/${region}/${regionData.sig}/dog-cafe`}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                    >
                      카페
                    </Link>
                  </div>
                  <span className="text-xs text-gray-500">
                    우선순위 {cluster.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 추천 장소 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{cluster.name} 추천 장소</h2>
              <p className="text-gray-600">클러스터 내 인기 강아지 동반 장소들</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1601758228041 + item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                    alt={`${cluster.name} 추천 장소 ${item}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {cluster.name} 추천 장소 {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {cluster.description}에 위치한 강아지 동반 장소입니다.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        O-Dog {85 + item * 2}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {cluster.type === 'hotspot' ? '핫스팟' : '추천'}
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 접근성 정보 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Train className="w-5 h-5 text-blue-500 mr-2" />
              접근성 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Train className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">지하철</p>
                  <p className="text-sm text-gray-600">주요 역에서 도보 5-10분</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">주차</p>
                  <p className="text-sm text-gray-600">건물 지하 주차장 이용 가능</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">이용 시간</p>
                  <p className="text-sm text-gray-600">평일 10:00-20:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}