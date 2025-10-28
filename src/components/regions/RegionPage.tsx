'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Star, Users, TrendingUp, Filter, Search, ChevronRight } from 'lucide-react'
import { RegionClusterUtils, RegionKey, RegionCluster } from '@/lib/regions/clusters'

interface RegionPageProps {
  region: RegionKey
  regionName: string
}

export function RegionPage({ region, regionName }: RegionPageProps) {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'dog-friendly' | 'accessibility'>('popularity')

  const clusters = RegionClusterUtils.getClustersSortedByPopularity(region)
  const filteredClusters = selectedType === 'all' 
    ? clusters 
    : clusters.filter(c => c.type === selectedType)

  const typeOptions = [
    { value: 'all', label: '전체' },
    { value: 'hotspot', label: '핫스팟' },
    { value: 'cluster', label: '클러스터' },
    { value: 'special', label: '특별지역' },
    { value: 'district', label: '일반지역' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative h-[400px] bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">
            {regionName} 강아지 동반 가이드 🐕
          </h1>
          <p className="text-xl mb-8">
            {regionName}의 지역별 강아지 동반 장소를 효율적으로 탐색해보세요
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 필터 및 정렬 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">지역 타입:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">인기도</option>
                <option value="dog-friendly">강아지 친화도</option>
                <option value="accessibility">접근성</option>
              </select>
            </div>
          </div>
        </div>

        {/* 추천 클러스터 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">추천 지역 클러스터</h2>
              <p className="text-gray-600">인기도가 높은 지역별 클러스터를 확인해보세요</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RegionClusterUtils.getRecommendedClusters(region, 3).map((cluster) => {
              const stats = RegionClusterUtils.getClusterStats(region, cluster.id)
              return (
                <Link key={cluster.id} href={`/${region}/cluster/${cluster.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{cluster.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cluster.color}`}>
                        {cluster.type === 'hotspot' ? '핫스팟' : 
                         cluster.type === 'cluster' ? '클러스터' :
                         cluster.type === 'special' ? '특별지역' : '일반지역'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{cluster.description}</p>
                    
                    {stats && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{stats.avgDogFriendlyScore}</div>
                          <div className="text-xs text-gray-500">강아지 친화도</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{stats.regionCount}</div>
                          <div className="text-xs text-gray-500">포함 지역</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {cluster.sigList.length}개 지역
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 모든 클러스터 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">모든 지역 클러스터</h2>
              <p className="text-gray-600">전체 지역 클러스터를 확인해보세요</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClusters.map((cluster) => {
              const stats = RegionClusterUtils.getClusterStats(region, cluster.id)
              return (
                <Link key={cluster.id} href={`/${region}/cluster/${cluster.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{cluster.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                          <p className="text-sm text-gray-500">{cluster.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cluster.color}`}>
                        우선순위 {cluster.priority}
                      </span>
                    </div>
                    
                    {stats && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{stats.avgDogFriendlyScore}</div>
                          <div className="text-xs text-gray-500">강아지 친화도</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{stats.avgPopularityScore}</div>
                          <div className="text-xs text-gray-500">인기도</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{stats.regionCount}</div>
                          <div className="text-xs text-gray-500">포함 지역</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">포함 지역:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cluster.sigList.map((sig) => (
                          <span
                            key={sig}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {sig.replace('-gu', '구').replace('-gun', '군').replace('-si', '시')}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        총 {cluster.sigList.length}개 지역
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 통계 정보 */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 text-green-500 mr-2" />
              {regionName} 지역 통계
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{clusters.length}</div>
                <div className="text-sm text-gray-500">총 클러스터</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {clusters.reduce((sum, c) => sum + c.sigList.length, 0)}
                </div>
                <div className="text-sm text-gray-500">총 지역</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {clusters.filter(c => c.type === 'hotspot').length}
                </div>
                <div className="text-sm text-gray-500">핫스팟</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {clusters.filter(c => c.type === 'special').length}
                </div>
                <div className="text-sm text-gray-500">특별지역</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}