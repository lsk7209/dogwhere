'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  MapPin, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  Code
} from 'lucide-react'

interface DashboardStats {
  totalPlaces: number
  totalEvents: number
  totalPosts: number
  totalUsers: number
  recentActivity: Array<{
    id: string
    type: 'place' | 'event' | 'post'
    action: 'created' | 'updated' | 'deleted'
    title: string
    timestamp: string
  }>
  systemStatus: {
    api: 'healthy' | 'warning' | 'error'
    database: 'healthy' | 'warning' | 'error'
    storage: 'healthy' | 'warning' | 'error'
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchDashboardData()
  }, [])

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

  const fetchDashboardData = async () => {
    try {
      // 실제 운영에서는 실제 데이터를 가져옴
      const mockStats: DashboardStats = {
        totalPlaces: 1247,
        totalEvents: 89,
        totalPosts: 156,
        totalUsers: 3421,
        recentActivity: [
          {
            id: '1',
            type: 'place',
            action: 'created',
            title: '카페 포우즈 마포점',
            timestamp: '2025-10-28T10:30:00Z'
          },
          {
            id: '2',
            type: 'event',
            action: 'updated',
            title: '반려동물 박람회 2025',
            timestamp: '2025-10-28T09:15:00Z'
          },
          {
            id: '3',
            type: 'post',
            action: 'created',
            title: '강아지와 함께하는 가을 여행',
            timestamp: '2025-10-28T08:45:00Z'
          }
        ],
        systemStatus: {
          api: 'healthy',
          database: 'healthy',
          storage: 'warning'
        }
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">어서오개 관리자</h1>
              <span className="text-sm text-gray-500">대시보드</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/settings')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <Settings className="w-4 h-4" />
                <span>설정</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* === 통계 카드를 한 행에 강조 표시 === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 장소</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalPlaces.toLocaleString()}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% 이번 주</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 행사</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5% 이번 주</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 포스트</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalPosts}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% 이번 주</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15% 이번 주</span>
            </div>
          </div>
        </div>

        {/* === 상세 통계/리스트/차트 등 분리 === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 최근 활동 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">최근 활동</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {activity.type} {activity.action} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 시스템 상태 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">시스템 상태</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">API 서버</span>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stats?.systemStatus.api || 'healthy')}`}>
                    {getStatusIcon(stats?.systemStatus.api || 'healthy')}
                    <span className="capitalize">{stats?.systemStatus.api || 'healthy'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">데이터베이스</span>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stats?.systemStatus.database || 'healthy')}`}>
                    {getStatusIcon(stats?.systemStatus.database || 'healthy')}
                    <span className="capitalize">{stats?.systemStatus.database || 'healthy'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">스토리지</span>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stats?.systemStatus.storage || 'warning')}`}>
                    {getStatusIcon(stats?.systemStatus.storage || 'warning')}
                    <span className="capitalize">{stats?.systemStatus.storage || 'warning'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== [NEW] Custom Script inset: HEAD, BODY, FOOTER ===== */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">커스텀 스크립트 삽입</h2>
          <p className="text-sm text-gray-600 mb-2">(웹사이트 head, body, footer 등에 삽입할 코드를 입력하세요. 예: GA, 애드센스, GTM 등)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">HEAD</label>
              <textarea className="w-full min-h-[100px] border rounded-lg p-2 font-mono text-xs mb-2" placeholder="<script>...</script>" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">BODY</label>
              <textarea className="w-full min-h-[100px] border rounded-lg p-2 font-mono text-xs mb-2" placeholder="<script>...</script>" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">FOOTER</label>
              <textarea className="w-full min-h-[100px] border rounded-lg p-2 font-mono text-xs mb-2" placeholder="<script>...</script>" />
            </div>
          </div>
          <div className="text-right mt-3">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700">저장</button>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/places')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">장소 관리</span>
            </button>
            <button
              onClick={() => router.push('/admin/events')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">행사 관리</span>
            </button>
            <button
              onClick={() => router.push('/admin/posts')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">포스트 관리</span>
            </button>
            <button
              onClick={() => router.push('/admin/templates')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Code className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">템플릿 관리</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
