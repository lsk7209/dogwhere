"use client"

import Link from 'next/link'
import { ReactNode } from 'react'

export default function GuideLayout({ children }: { children: ReactNode }) {
  const share = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      if ((navigator as any).share) {
        ;(navigator as any).share({ title: '어서오개 가이드', url })
        return
      }
      navigator.clipboard?.writeText(url)
      alert('링크가 복사되었습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {children}
      <div className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">가이드가 도움이 되었나요?</h3>
              <p className="text-sm text-gray-600">공유하고, 부족한 주제를 제보해주세요. 빠르게 보강하겠습니다.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={share} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">공유하기</button>
              <Link href="/report" className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50">제보하기</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


