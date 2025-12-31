'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Users, Clock, Car, Train, Filter, ChevronRight } from 'lucide-react'
import { RegionClusterUtils, RegionKey } from '@/lib/regions/clusters'
import { logger } from "@/lib/logger"
import type { SimplePlace } from '@/types/simple-place'

interface ClusterDetailPageProps {
  region: RegionKey
  regionName: string
  clusterId: string
  initialPlaces?: SimplePlace[]
}

export function ClusterDetailPage({ region, regionName, clusterId, initialPlaces = [] }: ClusterDetailPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'distance'>('popularity')
  const [places, setPlaces] = useState<SimplePlace[]>(initialPlaces)
  const [loading, setLoading] = useState(!initialPlaces.length)

  const clusters = RegionClusterUtils.getClustersByRegion(region)
  const cluster = clusters.find(c => c.id === clusterId)
  const regions = RegionClusterUtils.getRegionsByCluster(region, clusterId)
  const stats = RegionClusterUtils.getClusterStats(region, clusterId)

  // 클러스터에 포함된 지역 목록에서 시군구 추출
  const clusterSigunguList = regions.map(r => {
    // '강남구' -> '강남구', 'gangnam-gu' -> '강남구'
    const sig = r.sig || r.name
    return sig.replace('-gu', '구').replace('-gun', '군').replace('-si', '시')
  })

  // 장소 데이터 가져오기
  useEffect(() => {
    if (initialPlaces.length > 0) {
      setPlaces(initialPlaces)
      setLoading(false)
      return
    }

    async function fetchPlaces() {
      try {
        const response = await fetch('/api/simple-places')
        if (!response.ok) throw new Error('Failed to fetch places')

        const data = await response.json()
        if (data.success && data.data.places) {
          // 클러스터에 포함된 지역의 장소만 필터링
          const filteredPlaces = data.data.places.filter((place: SimplePlace) => {
            if (!place.sigungu) return false
            return clusterSigunguList.some(sig => place.sigungu?.includes(sig) || place.address?.includes(sig))
          })
          setPlaces(filteredPlaces)
        }
      } catch (error) {
        logger.error('Error fetching places', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [clusterId, initialPlaces, clusterSigunguList])

  // 필터링 및 정렬
  const filteredPlaces = places
    .filter(place => {
      if (selectedCategory === 'all') return true
      // 카테고리 매핑
      const categoryMap: Record<string, string[]> = {
        'dog-cafe': ['cafe'],
        'dog-park': ['outdoor'],
        'dog-hotel': ['hotel'],
        'restaurant': ['restaurant', 'cafe']
      }
      const categories = categoryMap[selectedCategory] || [selectedCategory]
      return categories.includes(place.category)
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      } else if (sortBy === 'popularity') {
        return (b.reviewCount || 0) - (a.reviewCount || 0)
      }
      return 0
    })
    .slice(0, 12) // 최대 12개

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
              <p className="text-gray-600">
                클러스터 내 인기 강아지 동반 장소들 ({filteredPlaces.length}개)
              </p>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">장소 정보를 불러오는 중...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">이 클러스터에는 등록된 장소가 없습니다.</p>
              <p className="text-gray-400 text-sm">곧 추가될 예정입니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => {
                const oDogScore = Math.min(100, Math.max(80, Math.floor((place.rating || 0) * 20 + (place.reviewCount || 0) / 10)))

                return (
                  <Link
                    key={place.id}
                    href={`/place/${place.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                          <span className="text-6xl">🐕</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {place.name}
                      </h3>
                      {place.address && (
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}
                      {place.description && (
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                          {place.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          {place.rating && (
                            <span className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              {place.rating.toFixed(1)}
                            </span>
                          )}
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            O-Dog {oDogScore}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {cluster.type === 'hotspot' ? '핫스팟' : '추천'}
                          </span>
                        </div>
                        <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          자세히 보기 →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
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