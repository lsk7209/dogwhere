'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BlogPost } from '@/lib/blog-data'
import { Search, Filter, Calendar, ArrowRight } from 'lucide-react'

interface BlogListContainerProps {
    initialPosts: BlogPost[]
}

export default function BlogListContainer({ initialPosts }: BlogListContainerProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<'recent' | 'alpha'>('recent')
    const [category, setCategory] = useState<'all' | string>('all')
    const postsPerPage = 9

    const allPosts = initialPosts

    const categories = useMemo(() => {
        const counts = new Map<string, number>()
        for (const p of allPosts) {
            counts.set(p.category, (counts.get(p.category) || 0) + 1)
        }
        const top = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name]) => name)
        return ['all', ...top]
    }, [allPosts])

    const filtered = useMemo(() => {
        let base = allPosts
        if (category !== 'all') base = base.filter(p => p.category === category)
        const q = query.trim().toLowerCase()
        if (q) base = base.filter(p => (
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q)
        ))
        const sorted = [...base]
        if (sort === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title))
        else sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        return sorted
    }, [allPosts, category, query, sort])

    const totalPages = Math.ceil(filtered.length / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const currentPosts = filtered.slice(startIndex, endIndex)

    return (
        <div className="container mx-auto px-4 py-12">
            {/* 검색/정렬/카테고리 */}
            <div className="max-w-5xl mx-auto mb-12 space-y-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setCurrentPage(1) }}
                        placeholder="관심있는 키워드를 검색해보세요 (예: 제주도, 카페, 훈련)"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg transition-all"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                        {categories.map((c) => (
                            <button key={c}
                                onClick={() => { setCategory(c); setCurrentPage(1) }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${category === c
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >{c === 'all' ? '전체' : c}</button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value as any); setCurrentPage(1) }}
                                className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
                            >
                                <option value="recent">최신순</option>
                                <option value="alpha">가나다순</option>
                            </select>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">
                            총 <span className="text-emerald-600">{filtered.length}</span>개의 글
                        </span>
                    </div>
                </div>
            </div>

            {/* 포스트 그리드 */}
            {currentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((post, index) => (
                        <Link key={index} href={`/blog/${post.slug}`} className="group block h-full">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-gray-400 text-xs mb-3 space-x-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center text-emerald-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        자세히 보기 <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
                    <button
                        onClick={() => { setQuery(''); setCategory('all'); }}
                        className="mt-4 text-emerald-600 font-medium hover:underline"
                    >
                        전체 목록 보기
                    </button>
                </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-16">
                    <nav className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${currentPage === page
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                        >
                            다음
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}
