import { Metadata } from 'next'
import { ArrowLeft, Share2, Clock, Calendar, User, Star, Tag, CheckCircle, AlertCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getGuideBySlug, getAllGuides } from '@/lib/guide-data'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/blog/TableOfContents'
import AdsenseSlot from '@/components/ads/AdsenseSlot'

interface GuideDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return {
      title: '가이드를 찾을 수 없습니다',
    }
  }

  const url = `https://dogwhere.kr/guide/${slug}`

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: url,
      type: 'article',
      publishedTime: guide.date,
      authors: [guide.author || 'DogsWhere'],
      // images: [guide.image], // Add image if available in data
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  }
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  // Related guides
  const allGuides = getAllGuides()
  const relatedGuides = allGuides
    .filter(g => g.slug !== slug && g.category === guide.category)
    .slice(0, 3)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.date,
    author: {
      '@type': 'Organization',
      name: guide.author || 'DogsWhere',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DogsWhere',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dogwhere.kr/logo.png'
      }
    },
    articleBody: guide.content,
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/guide"
            className="inline-flex items-center text-emerald-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            가이드 목록으로
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-100 text-sm font-semibold border border-emerald-700">
              {guide.category}
            </span>
            {guide.difficulty && (
              <span className="px-3 py-1 rounded-full bg-emerald-800/50 text-emerald-100 text-sm border border-emerald-700">
                난이도: {guide.difficulty}
              </span>
            )}
            {guide.readTime && (
              <span className="flex items-center text-emerald-200 text-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                {guide.readTime}
              </span>
            )}
          </div>

          <div className="flex items-start gap-6">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm hidden md:block">
              {guide.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {guide.title}
              </h1>
              <p className="text-xl text-emerald-100 max-w-3xl leading-relaxed">
                {guide.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                {guide.author}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {guide.date}
              </span>
            </div>
            {guide.rating && (
              <div className="flex items-center text-yellow-500 font-bold">
                <Star className="w-5 h-5 fill-current mr-1.5" />
                {guide.rating}
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none prose-emerald prose-headings:font-bold prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.content || ''}
            </ReactMarkdown>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
              목차
            </h3>
            <TableOfContents content={guide.content || ''} />
          </div>

          {/* Share Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-emerald-600" />
              공유하기
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              이 유용한 가이드를 다른 반려인들과 공유하세요!
            </p>
            <button
              className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center"
            >
              링크 복사하기
            </button>
          </div>

          {/* Adsense */}
          <div className="bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
            <AdsenseSlot />
          </div>

          {/* Related Guides */}
          {relatedGuides.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">관련 가이드</h3>
              <div className="space-y-4">
                {relatedGuides.map((relatedGuide) => (
                  <Link
                    key={relatedGuide.slug}
                    href={`/guide/${relatedGuide.slug}`}
                    className="block p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group"
                  >
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                      {relatedGuide.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {relatedGuide.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}