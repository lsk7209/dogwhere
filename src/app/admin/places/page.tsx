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
  Download,
  Upload,
  RefreshCw,
  Database
} from 'lucide-react'
import { Place } from '@/types/place'

export default function PlacesManagement() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [collectionStatus, setCollectionStatus] = useState<any>(null)
  const router = useRouter()

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'cafe', label: '카페' },
    { value: 'restaurant', label: '식당' },
    { value: 'accommodation', label: '숙박' },
    { value: 'shopping', label: '쇼핑' },
    { value: 'entertainment', label: '놀이/엔터테인먼트' },
    { value: 'beauty', label: '미용/케어' },
    { value: 'medical', label: '의료' },
    { value: 'education', label: '교육/훈련' },
    { value: 'outdoor', label: '야외활동' },
    { value: 'transport', label: '교통' },
    { value: 'service', label: '서비스' },
    { value: 'other', label: '기타' }
  ]

  const statuses = [
    { value: 'all', label: '전체' },
    { value: 'verified', label: '검증됨' },
    { value: 'unverified', label: '미검증' },
    { value: 'featured', label: '추천' }
  ]

  // 데이터 수집 상태 조회
  const fetchCollectionStatus = async () => {
    try {
      const response = await fetch('/api/jobs/collect-places')
      const data = await response.json()
      if (data.success) {
        setCollectionStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch collection status:', error)
    }
  }

  // 데이터 수집 실행
  const runDataCollection = async (region?: { sido: string; sigungu?: string }) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/jobs/collect-places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ region })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('데이터 수집이 완료되었습니다!')
        fetchPlaces()
        fetchCollectionStatus()
      } else {
        alert('데이터 수집 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Data collection failed:', error)
      alert('데이터 수집 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    fetchPlaces()
    fetchCollectionStatus()
  }, [currentPage, searchQuery, filterCategory, filterStatus])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/login')
      if (!response.ok) {
        router.push('/admin/login')
        return
      }
    } catch {
      router.push('/admin/login')
    }
  }

  const fetchPlaces = async () => {
    setIsLoading(true)
    try {
      // 실제 운영에서는 실제 API를 호출
      const mockPlaces: Place[] = [
        {
          id: '1',
          name: '카페 포우즈 마포점',
          address: '서울 마포구 어쩌구 123',
          category: 'dog-cafe',
          region: 'seoul-mapo-gu',
          rating: 4.6,
          reviewCount: 213,
          oDogScore: 92,
          status: 'active',
          createdAt: '2025-10-01T00:00:00Z',
          updatedAt: '2025-10-28T10:30:00Z'
        },
        {
          id: '2',
          name: '도그 파크 한강',
          address: '서울 영등포구 한강대로 123',
          category: 'dog-park',
          region: 'seoul-yeongdeungpo-gu',
          rating: 4.8,
          reviewCount: 456,
          oDogScore: 95,
          status: 'active',
          createdAt: '2025-09-15T00:00:00Z',
          updatedAt: '2025-10-27T15:20:00Z'
        },
        {
          id: '3',
          name: '멍멍 호텔 강남',
          address: '서울 강남구 테헤란로 123',
          category: 'dog-hotel',
          region: 'seoul-gangnam-gu',
          rating: 4.4,
          reviewCount: 89,
          oDogScore: 88,
          status: 'pending',
          createdAt: '2025-10-25T00:00:00Z',
          updatedAt: '2025-10-25T00:00:00Z'
        }
      ]

      // 필터링 로직
      let filteredPlaces = mockPlaces
      
      if (searchQuery) {
        filteredPlaces = filteredPlaces.filter(place => 
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      if (filterCategory !== 'all') {
        filteredPlaces = filteredPlaces.filter(place => place.category === filterCategory)
      }

      if (filterStatus !== 'all') {
        filteredPlaces = filteredPlaces.filter(place => place.status === filterStatus)
      }

      setPlaces(filteredPlaces)
      setTotalPages(Math.ceil(filteredPlaces.length / 10))
    } catch (error) {
      console.error('Failed to fetch places:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 장소를 삭제하시겠습니까?')) return

    try {
      // 실제 운영에서는 DELETE API 호출
      console.log('Deleting place:', id)
      fetchPlaces() // 목록 새로고침
    } catch (error) {
      console.error('Failed to delete place:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성'
      case 'inactive':
        return '비활성'
      case 'pending':
        return '대기중'
      default:
        return status
    }
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>대시보드</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">장소 관리</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => runDataCollection()}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isLoading ? '수집 중...' : '데이터 수집'}</span>
              </button>
              <button
                onClick={() => router.push('/admin/places/new')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>새 장소 추가</span>
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
                <p className="text-2xl font-bold text-blue-900 mt-2">{collectionStatus.totalPlaces}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">검증된 장소</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-2">{collectionStatus.verifiedPlaces}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">검토 대기</span>
                </div>
                <p className="text-2xl font-bold text-yellow-900 mt-2">{collectionStatus.pendingReview}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">마지막 수집</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(collectionStatus.lastCollection).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="장소명, 주소로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 카테고리 필터 */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* 상태 필터 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* 새로고침 */}
            <button
              onClick={fetchPlaces}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>새로고침</span>
            </button>
          </div>
        </div>

        {/* 장소 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장소 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평점/O-Dog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업데이트
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : places.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      장소가 없습니다.
                    </td>
                  </tr>
                ) : (
                  places.map((place) => (
                    <tr key={place.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{place.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {place.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getCategoryLabel(place.category)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{place.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({place.reviewCount})</span>
                          </div>
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            O-Dog {place.oDogScore}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(place.status)}`}>
                          {getStatusLabel(place.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(place.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/places/${place.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/places/${place.id}/edit`)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(place.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  총 {places.length}개 장소
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
