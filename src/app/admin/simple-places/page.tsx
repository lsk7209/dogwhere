'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Star,
  Calendar,
  ArrowLeft,
  Database,
  RefreshCw
} from 'lucide-react'

interface SimplePlace {
  id: string
  name: string
  category: string
  address: string
  sido: string
  sigungu: string
  rating: number
  reviewCount: number
  source: string
  isVerified: boolean
  createdAt: string
}

export default function SimplePlacesManagement() {
  const [places, setPlaces] = useState<SimplePlace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionStatus, setCollectionStatus] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const router = useRouter()

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'cafe', label: '카페' },
    { value: 'restaurant', label: '식당' },
    { value: 'accommodation', label: '숙박' },
    { value: 'outdoor', label: '야외' },
    { value: 'shopping', label: '쇼핑' },
    { value: 'entertainment', label: '엔터테인먼트' },
    { value: 'medical', label: '의료' },
    { value: 'other', label: '기타' }
  ]

  const sources = [
    { value: 'all', label: '전체' },
    { value: 'Google Places', label: 'Google Places' },
    { value: 'Kakao Map', label: '카카오맵' },
    { value: 'sample', label: '샘플' },
    { value: 'Mock', label: '목업' }
  ]

  useEffect(() => {
    fetchPlaces()
    fetchCollectionStatus()
  }, [searchQuery, filterCategory, filterSource])

  const fetchPlaces = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/simple-places')
      const data = await response.json()
      
      if (data.success) {
        let filteredPlaces = data.data.places
        
        // 검색 필터링
        if (searchQuery) {
          filteredPlaces = filteredPlaces.filter((place: SimplePlace) => 
            place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.address.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        // 카테고리 필터링
        if (filterCategory !== 'all') {
          filteredPlaces = filteredPlaces.filter((place: SimplePlace) => 
            place.category === filterCategory
          )
        }

        // 소스 필터링
        if (filterSource !== 'all') {
          filteredPlaces = filteredPlaces.filter((place: SimplePlace) => 
            place.source === filterSource
          )
        }

        setPlaces(filteredPlaces)
      }
    } catch (error) {
      console.error('Failed to fetch places:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCollectionStatus = async () => {
    try {
      const response = await fetch('/api/jobs/simple-collect')
      const data = await response.json()
      
      if (data.success) {
        setCollectionStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch collection status:', error)
    }
  }

  const collectData = async (region?: { sido: string; sigungu?: string }) => {
    setIsCollecting(true)
    try {
      const response = await fetch('/api/jobs/simple-collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_TOKEN || 'test-token'}`
        },
        body: JSON.stringify({
          region,
          sources: ['google', 'kakao']
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`데이터 수집 완료!\n추가: ${result.data.summary.added}개\n업데이트: ${result.data.summary.updated}개\n건너뜀: ${result.data.summary.skipped}개`)
        fetchPlaces()
        fetchCollectionStatus()
      } else {
        alert(`데이터 수집 실패: ${result.error.message}`)
      }
    } catch (error) {
      console.error('Data collection error:', error)
      alert('데이터 수집 중 오류가 발생했습니다.')
    } finally {
      setIsCollecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>대시보드</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">간단한 장소 관리</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => collectData()}
                disabled={isCollecting}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isCollecting ? '수집 중...' : '전체 수집'}</span>
              </button>
              <button
                onClick={() => collectData({ sido: '서울특별시', sigungu: '강남구' })}
                disabled={isCollecting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>강남구 수집</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 데이터 수집 상태 */}
        {collectionStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">데이터 수집 현황</h2>
              <button
                onClick={fetchCollectionStatus}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className="w-4 h-4" />
                <span>새로고침</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">전체 장소</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-2">{collectionStatus.stats?.total || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">검증된 장소</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-2">{collectionStatus.stats?.verified || 0}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">검토 대기</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 mt-2">{collectionStatus.stats?.pending || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Google Places</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-2">{collectionStatus.sources?.google || 0}</p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>API 키 상태:</span>
                <span className={`px-2 py-1 rounded text-xs ${collectionStatus.apiKeysStatus?.google ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Google {collectionStatus.apiKeysStatus?.google ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${collectionStatus.apiKeysStatus?.kakao ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Kakao {collectionStatus.apiKeysStatus?.kakao ? '✓' : '✗'}
                </span>
              </div>
              {collectionStatus.lastCollection && (
                <div className="mt-2">
                  마지막 수집: {new Date(collectionStatus.lastCollection).toLocaleString('ko-KR')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="장소명 또는 주소 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">데이터 소스</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sources.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 장소 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              장소 목록 ({places.length}개)
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : places.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>장소가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">장소명</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주소</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소스</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {places.map((place) => (
                    <tr key={place.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{place.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {place.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{place.address}</div>
                        <div className="text-sm text-gray-500">{place.sido} {place.sigungu}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{place.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500 ml-1">({place.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          place.source === 'Google Places' ? 'bg-green-100 text-green-800' :
                          place.source === 'Kakao Map' ? 'bg-yellow-100 text-yellow-800' :
                          place.source === 'sample' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {place.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          place.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {place.isVerified ? '검증됨' : '검토 대기'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
