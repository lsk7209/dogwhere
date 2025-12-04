"use client"

import Link from 'next/link'
import { ReactNode } from 'react'
import { getCompletedUtilities } from '@/lib/utilities/utilities-data'

export default function UtilitiesLayout({ children }: { children: ReactNode }) {
  const related = getCompletedUtilities().slice(0, 6)

  const share = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      if ((navigator as any).share) {
        ; (navigator as any).share({ title: '어서오개 유틸리티', url })
        return
      }
      navigator.clipboard?.writeText(url)
      // Toast notification would be better here, but alert for now is safe
      alert('링크가 복사되었습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {children}

      {/* 공통: 공유/제보/관련 유틸리티 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">이 유틸리티가 도움이 되었나요?</h2>
            <p className="text-gray-600">친구에게 공유하거나, 더 좋은 아이디어가 있다면 제보해주세요.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={share}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
            >
              공유하기
            </button>
            <Link
              href="/report"
              className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              제보하기
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">관련 유틸리티</h3>
            <Link href="/utilities" className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((u) => (
              <Link
                key={u.id}
                href={`/utilities/${u.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.category === 'calculator' ? 'bg-blue-50 text-blue-600' :
                      u.category === 'finder' ? 'bg-emerald-50 text-emerald-600' :
                        u.category === 'guide' ? 'bg-purple-50 text-purple-600' :
                          'bg-orange-50 text-orange-600'
                    }`}>
                    {u.category === 'calculator' ? '계산기' :
                      u.category === 'finder' ? '찾기' :
                        u.category === 'guide' ? '가이드' : '플래너'}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {u.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {u.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


