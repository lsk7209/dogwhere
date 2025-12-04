import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getAllGuides } from '@/lib/guide-data'
import { Search, Filter, ArrowRight, BookOpen, CheckCircle, AlertCircle } from 'lucide-react'

export default function GuidePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'alpha' | 'default'>('default')
  const guidesPerPage = 9

  const allGuides = getAllGuides()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let base = allGuides
    if (q) {
      base = base.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        (g.items && g.items.some((it: string) => it.toLowerCase().includes(q)))
      )
    }
    const sorted = [...base]
    if (sort === 'alpha') sorted.sort((a, b) => a.title.localeCompare(b.title))
    return sorted
  }, [allGuides, query, sort])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / guidesPerPage)
  const startIndex = (currentPage - 1) * guidesPerPage
  const endIndex = startIndex + guidesPerPage
  const currentGuides = filtered.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            Expert Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            반려견과 함께하는 <span className="text-blue-600">완벽한 가이드</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            여행 준비부터 건강 관리까지, 전문가가 전하는 신뢰할 수 있는 정보를 확인하세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 검색/정렬 */}
        <div className="max-w-5xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1) }}
              placeholder="궁금한 내용을 검색해보세요 (예: 여행, 사회화, 응급, 영양)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value as any); setCurrentPage(1) }}
                className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="default">추천순</option>
                <option value="alpha">가나다순</option>
              </select>
            </div>
            <span className="text-sm text-gray-400 font-medium">
              총 <span className="text-blue-600">{filtered.length}</span>개의 가이드
            </span>
          </div>
        </div>

        {/* 가이드 그리드 */}
        {currentGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentGuides.map((guide, index) => (
              <Link key={index} href={`/guide/${guide.slug}`} className="group block h-full">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>

                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {guide.icon}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      {guide.category}
                    </span>
                  </div>

                  <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="relative z-10 text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                    {guide.description}
                  </p>

                  {guide.items && (
                    <ul className="relative z-10 space-y-2 mb-6 border-t border-gray-50 pt-4">
                      {guide.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                          {item}
                        </li>
                      ))}
                      {guide.items.length > 3 && (
                        <li className="text-xs text-gray-400 pl-3.5">
                          + {guide.items.length - 3}개 더보기
                        </li>
                      )}
                    </ul>
                  )}

                  <div className="relative z-10 flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform mt-auto">
                    가이드 보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <button
              onClick={() => { setQuery(''); }}
              className="mt-4 text-blue-600 font-medium hover:underline"
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
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

        {/* 추가 정보 섹션 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">상세한 가이드</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              각 상황별, 단계별로 필요한 정보를<br />상세하게 정리해두었습니다.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border border-emerald-100 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">검증된 정보</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              전문가의 조언과 실제 경험을 바탕으로<br />신뢰할 수 있는 정보를 제공합니다.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">지속적인 업데이트</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              최신 트렌드와 정보를 반영하여<br />지속적으로 가이드를 업데이트합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
