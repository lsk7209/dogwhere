'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Settings,
    Save,
    Clock,
    ToggleLeft,
    ToggleRight,
    ArrowLeft,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    FileText
} from 'lucide-react'

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({
        auto_posting_enabled: 'true',
        auto_posting_interval_hours: '6',
        max_posts_per_session: '1',
        last_auto_post_at: '',
        auto_blog_enabled: 'true',
        auto_blog_interval_hours: '12',
        last_auto_blog_at: ''
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [internalToken, setInternalToken] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/settings', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`
                }
            })
            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    setSettings(prev => ({ ...prev, ...result.data }))
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${internalToken || localStorage.getItem('admin_token') || ''}`
                },
                body: JSON.stringify(settings)
            })

            if (response.ok) {
                setMessage({ type: 'success', text: '설정이 저장되었습니다.' })
                if (internalToken) localStorage.setItem('admin_token', internalToken)
            } else {
                const err = await response.json()
                setMessage({ type: 'error', text: err.error?.message || '저장에 실패했습니다.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' })
        } finally {
            setIsSaving(false)
        }
    }

    const toggleAutoPosting = () => {
        setSettings(prev => ({
            ...prev,
            auto_posting_enabled: prev.auto_posting_enabled === 'true' ? 'false' : 'true'
        }))
    }

    const toggleAutoBlog = () => {
        setSettings(prev => ({
            ...prev,
            auto_blog_enabled: prev.auto_blog_enabled === 'true' ? 'false' : 'true'
        }))
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2" />
                                시스템 설정
                            </h1>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSaving ? '저장 중...' : '설정 저장'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* 장소 정보 자동 보강 설정 */}
                    <section className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                            1. 장소 정보 자동 보강 (공공데이터)
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-900">자동 보강 활성화</p>
                                    <p className="text-sm text-gray-500">수집된 공공데이터 장소 정보를 AI가 풍성하게 보강하여 발행합니다.</p>
                                </div>
                                <button
                                    onClick={toggleAutoPosting}
                                    className="transition-colors focus:outline-none"
                                >
                                    {settings.auto_posting_enabled === 'true' ? (
                                        <ToggleRight className="w-12 h-12 text-blue-600" />
                                    ) : (
                                        <ToggleLeft className="w-12 h-12 text-gray-300" />
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">실행 간격 (시간)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={settings.auto_posting_interval_hours}
                                            onChange={(e) => setSettings(prev => ({ ...prev, auto_posting_interval_hours: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">회당 보강 개수</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={settings.max_posts_per_session}
                                            onChange={(e) => setSettings(prev => ({ ...prev, max_posts_per_session: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>마지막 실행:</span>
                                    <span>{settings.last_auto_post_at ? new Date(settings.last_auto_post_at).toLocaleString() : '기록 없음'}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI 자유 주제 블로그 생성 설정 */}
                    <section className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-orange-600" />
                            2. AI 블로그 자동 포스팅 (자유 주제)
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-gray-900">블로그 자동 생성 활성화</p>
                                    <p className="text-sm text-gray-500">강아지 관련 새로운 주제(건강, 훈련 등)로 AI가 직접 포스팅합니다.</p>
                                </div>
                                <button
                                    onClick={toggleAutoBlog}
                                    className="transition-colors focus:outline-none"
                                >
                                    {settings.auto_blog_enabled === 'true' ? (
                                        <ToggleRight className="w-12 h-12 text-orange-600" />
                                    ) : (
                                        <ToggleLeft className="w-12 h-12 text-gray-300" />
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">포스팅 간격 (시간)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={settings.auto_blog_interval_hours}
                                            onChange={(e) => setSettings(prev => ({ ...prev, auto_blog_interval_hours: e.target.value }))}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    <span>마지막 실행:</span>
                                    <span className="ml-2">{settings.last_auto_blog_at ? new Date(settings.last_auto_blog_at).toLocaleString() : '기록 없음'}</span>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (!internalToken) {
                                            alert('보안 설정을 위해 Internal Auth Token을 입력해주세요.')
                                            return
                                        }
                                        if (!confirm('지금 즉시 새로운 블로그 포스트를 생성하시겠습니까? (AI 호출 비용이 발생할 수 있습니다)')) return

                                        try {
                                            const res = await fetch('/api/admin/blog/generate', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${internalToken}`
                                                },
                                                body: JSON.stringify({ force: true })
                                            })
                                            const data = await res.json()
                                            if (data.success) {
                                                alert(`새 블로그가 생성되었습니다: ${data.data.title}`)
                                                window.location.reload()
                                            } else {
                                                alert(`생성 실패: ${data.error?.message || '알 수 없는 오류'}`)
                                            }
                                        } catch (e) {
                                            alert('블로그 생성 중 네트워크 오류가 발생했습니다.')
                                        }
                                    }}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors flex items-center"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    지금 즉시 생성하기
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 인증 설정 */}
                    <section className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">보안 설정</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Internal Auth Token</label>
                            <input
                                type="password"
                                value={internalToken}
                                onChange={(e) => setInternalToken(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="환경 변수(INTERNAL_TOKEN)와 일치해야 합니다"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
