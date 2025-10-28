'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 관리자 페이지가 아닌 경우 인증 체크 스킵
    if (pathname === '/admin/login') return

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

    checkAuth()
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
