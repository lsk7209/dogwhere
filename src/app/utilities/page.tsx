'use client'

import { useState } from 'react'
import Link from 'next/link'
import { utilitiesData, getCompletedUtilities } from '@/lib/utilities/utilities-data'
import * as LucideIcons from 'lucide-react'

export default function UtilitiesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const utilitiesPerPage = 9

  const completedUtilities = getCompletedUtilities()
  
  const filteredUtilities = selectedCategory === 'all'
    ? completedUtilities
    : completedUtilities.filter(util => util.category === selectedCategory)

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredUtilities.length / utilitiesPerPage)
  const startIndex = (currentPage - 1) * utilitiesPerPage
  const endIndex = startIndex + utilitiesPerPage
  const currentUtilities = filteredUtilities.slice(startIndex, endIndex)

  // 카테고리 옵션
  const categories = [
    { value: 'all', label: '전체' },
    { value: 'calculator', label: '계산기' },
    { value: 'finder', label: '찾기' },
    { value: 'guide', label: '가이드' },
    { value: 'planner', label: '플래너' }
  ]

  // 아이콘 가져오기 함수
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Wrench
    return IconComponent
  }

  // 카테고리 색상 매핑
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      calculator: 'text-blue-600',
      finder: 'text-green-600',
      guide: 'text-purple-600',
      planner: 'text-orange-600'
    }
    return colors[category] || 'text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            반려견 유틸리티 🐕
          </h1>
          <p className="text-xl text-gray-600">
            강아지와 함께하는 생활을 더욱 편리하게 만들어주는 다양한 도구들
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setSelectedCategory(category.value)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 유틸리티 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentUtilities.map((utility) => {
            const IconComponent = getIcon(utility.icon)
            const categoryColor = getCategoryColor(utility.category)
            
            return (
              <Link
                key={utility.id}
                href={`/utilities/${utility.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 block group"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`flex-shrink-0 ${categoryColor}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {utility.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {utility.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    utility.category === 'calculator' ? 'bg-blue-100 text-blue-700' :
                    utility.category === 'finder' ? 'bg-green-100 text-green-700' :
                    utility.category === 'guide' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {categories.find(c => c.value === utility.category)?.label}
                  </span>
                  <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
                    사용하기 →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>
                }
                return null
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}

        {/* 정보 카드 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 참고사항</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>모든 계산 결과는 참고용이며, 개별 강아지의 상태에 따라 다를 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>건강 관련 중요한 결정은 반드시 수의사와 상담하세요.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>견종, 연령, 건강 상태에 따라 적정량이 달라질 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
