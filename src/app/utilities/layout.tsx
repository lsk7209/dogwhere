import Link from 'next/link'
import { ReactNode } from 'react'
import { getCompletedUtilities } from '@/lib/utilities/utilities-data'

export default function UtilitiesLayout({ children }: { children: ReactNode }) {
  const related = getCompletedUtilities().slice(0, 6)

  const share = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      if ((navigator as any).share) {
        ;(navigator as any).share({ title: '어서오개 유틸리티', url })
        return
      }
      navigator.clipboard?.writeText(url)
      alert('링크가 복사되었습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}

      {/* 공통: 공유/제보/관련 유틸리티 */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">이 유틸리티가 도움이 되었나요?</h2>
            <p className="text-sm text-gray-600">친구에게 공유하거나, 개선 아이디어를 제보해주세요.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={share} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">공유하기</button>
            <Link href="/report" className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50">제보하기</Link>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-[22px] font-bold text-gray-900 mb-4">관련 유틸리티</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((u) => (
              <Link key={u.id} href={`/utilities/${u.slug}`} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500 mb-1">#{u.category}</div>
                <div className="text-gray-900 font-semibold">{u.title}</div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">{u.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


