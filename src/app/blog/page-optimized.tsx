/**
 * 최적화된 블로그 페이지
 * 서버 사이드 페이지네이션 및 검색
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PostRepository } from '@/lib/database/d1-repository'

export const metadata: Metadata = {
  title: '블로그 | 어서오개',
  description: '강아지와 함께하는 특별한 여행 이야기와 유용한 정보',
}

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
    sortBy?: string
  }
}

async function BlogPostsList({ 
  page, 
  category, 
  search, 
  sortBy 
}: { 
  page: number
  category?: string
  search?: string
  sortBy?: string
}) {
  const repository = new PostRepository()
  
  const result = await repository.findAll(
    {
      category: category !== 'all' ? category : undefined,
      search
    },
    { field: sortBy || 'date', order: 'DESC' },
    { page, limit: 12 }
  )

  if (result.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">포스트를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {result.data.map((post: any) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`} 
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image || `https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      {result.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            {result.pagination.page > 1 && (
              <Link
                href={`/blog?page=${result.pagination.page - 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                이전
              </Link>
            )}
            
            {Array.from({ length: Math.min(result.pagination.totalPages, 10) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                  className={`px-3 py-2 rounded-md ${
                    result.pagination.page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </Link>
              )
            })}
            
            {result.pagination.hasMore && (
              <Link
                href={`/blog?page=${result.pagination.page + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                다음
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const category = searchParams.category || 'all'
  const search = searchParams.search
  const sortBy = searchParams.sortBy || 'date'

  // 카테고리 목록 가져오기
  const repository = new PostRepository()
  const categoryCounts = await repository.countByCategory()
  const categories = ['all', ...Object.keys(categoryCounts).slice(0, 6)]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            블로그 📝
          </h1>
          <p className="text-xl text-gray-600">
            강아지와 함께하는 특별한 여행 이야기와 유용한 정보
          </p>
        </div>

        {/* 검색/정렬/카테고리 */}
        <div className="max-w-4xl mx-auto mb-8">
          <form method="GET" action="/blog" className="mb-4">
            <input
              name="search"
              defaultValue={search}
              placeholder="검색 (예: 겨울, 사회화, 여행, 케어)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {category !== 'all' && (
              <input type="hidden" name="category" value={category} />
            )}
          </form>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">정렬:</label>
              <select
                defaultValue={sortBy}
                onChange={(e) => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('sortBy', e.target.value)
                  window.location.href = url.toString()
                }}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
              >
                <option value="date">최신순</option>
                <option value="title">가나다순</option>
              </select>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/blog?category=${c}${search ? `&search=${search}` : ''}`}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    category === c
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {c} {c !== 'all' && `(${categoryCounts[c] || 0})`}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 포스트 목록 */}
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        }>
          <BlogPostsList 
            page={page}
            category={category !== 'all' ? category : undefined}
            search={search}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  )
}

