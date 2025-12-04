import { Metadata } from 'next'
import { Calendar, User, Tag, ArrowLeft, Share2, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getAllPosts } from '@/lib/blog-data'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/blog/TableOfContents'
import AdsenseSlot from '@/components/ads/AdsenseSlot'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
    }
  }

  const url = `https://dogwhere.kr/blog/${slug}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      authors: [post.author || 'DogsWhere'],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    keywords: post.seoKeywords,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Related posts (simple implementation: same category or random)
  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    author: [{
      '@type': 'Person',
      name: post.author || 'DogsWhere',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'DogsWhere',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dogwhere.kr/logo.png' // Replace with actual logo URL
      }
    },
    description: post.excerpt,
    articleBody: post.content,
    keywords: post.seoKeywords?.join(', '),
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            블로그 목록으로
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-sm font-semibold">
              {post.category}
            </span>
            {post.readTime && (
              <span className="flex items-center text-gray-200 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm md:text-base">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {post.date}
            </div>
            {post.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {post.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-8 bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-emerald prose-headings:font-bold prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content || ''}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Table of Contents */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">목차</h3>
            <TableOfContents content={post.content || ''} />
          </div>

          {/* Share Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-emerald-600" />
              공유하기
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              이 유용한 정보를 친구들과 공유해보세요!
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center"
              // onClick logic would be client-side, but this is a server component. 
              // We might need a client component wrapper for the share button if we want interactivity.
              // For now, let's keep it simple or make it a link if possible.
              >
                링크 복사하기
              </button>
            </div>
          </div>

          {/* Adsense */}
          <div className="bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
            <AdsenseSlot />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">관련 포스트</h3>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                      {relatedPost.title}
                    </h4>
                    <span className="text-xs text-gray-500">{relatedPost.date}</span>
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