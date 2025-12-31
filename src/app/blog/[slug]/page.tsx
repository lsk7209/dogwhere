import { Metadata } from 'next'
import { Calendar, User, Tag, ArrowLeft, ArrowRight, Share2, MapPin, Clock, Quote } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug as getStaticPostBySlug, getAllPosts as getAllStaticPosts, BlogPost } from '@/lib/blog-data'
import { notFound } from 'next/navigation'
import TableOfContents from '@/components/blog/TableOfContents'
import AdsenseSlot from '@/components/ads/AdsenseSlot'
import { createPostRepository } from '@/lib/database/db-adapter'
import './../blog.css' // 전용 스타일 임포트

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getDBPost(slug: string): Promise<BlogPost | null> {
  try {
    const postRepo = createPostRepository()
    const post = await postRepo.findBySlug(slug)
    if (!post) return null

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      readTime: post.read_time || undefined,
      image: post.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : (Array.isArray(post.tags) ? post.tags : []),
      location: post.location || undefined,
      lastModified: post.last_modified || undefined,
      seoKeywords: typeof post.seo_keywords === 'string' ? JSON.parse(post.seo_keywords) : (Array.isArray(post.seo_keywords) ? post.seo_keywords : [])
    }
  } catch (error) {
    console.error('Error fetching post from DB:', error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  let post = getStaticPostBySlug(slug)
  if (!post) {
    post = await getDBPost(slug) || undefined
  }

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
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  let post = getStaticPostBySlug(slug)
  if (!post) {
    post = await getDBPost(slug) || undefined
  }

  if (!post) {
    notFound()
  }

  // Related posts
  const allStaticPosts = getAllStaticPosts()
  const relatedPosts = allStaticPosts
    .filter(p => p.slug !== slug && p.category === post!.category)
    .slice(0, 3)

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
        url: 'https://dogwhere.kr/logo.png'
      }
    },
    description: post.excerpt,
    articleBody: post.content,
    keywords: post.seoKeywords?.join(', '),
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-[400px] md:h-[600px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors w-fit bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            블로그 목록으로
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase">
              {post.category}
            </span>
            {post.readTime && (
              <span className="flex items-center text-gray-200 text-xs bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {post.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-[1.1] max-w-5xl tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-gray-300 text-sm md:text-base border-t border-white/10 pt-8">
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 group-hover:bg-emerald-500/40 transition-colors">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-medium text-white">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2.5 text-emerald-400" />
              {post.date}
            </div>
            {post.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2.5 text-emerald-400" />
                {post.location}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <article className="lg:col-span-8 space-y-12">
          {/* 핵심 요약 박스 (SEO/AEO 대응) */}
          <div className="blog-excerpt-box">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="text-emerald-800 font-bold mb-2 flex items-center">
                  전문가 요약 & 핵심 요약
                </h4>
                <p className="blog-excerpt-text">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 md:p-16 border border-gray-100 overflow-hidden">
            <div className="blog-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ''}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">관심 키워드</h4>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-all cursor-pointer border border-gray-100 hover:border-emerald-100"
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold mb-4">반려견과 함께하는 더 많은 정보를 찾으시나요?</h3>
              <p className="text-emerald-100/80 mb-8 max-w-lg">
                어서오개에서는 전국의 강아지 동반 장소 정보와 함께 전문가의 육아 팁을 매주 업데이트합니다.
              </p>
              <Link href="/guide" className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                추천 장소 둘러보기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </article>

        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 p-8 border border-gray-100 sticky top-24">
            <h3 className="font-extrabold text-gray-900 mb-6 text-xl flex items-center">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3" />
              빠른 이동 (목차)
            </h3>
            <TableOfContents content={post.content || ''} />

            <div className="mt-10 pt-8 border-t border-gray-100">
              <AdsenseSlot />
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 p-8 border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
              <Share2 className="w-6 h-6 mr-3 text-emerald-600" />
              정보 공유하기
            </h3>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200">
                카카오톡
              </button>
              <button className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200">
                링크 복사
              </button>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-[1.5rem] shadow-lg shadow-gray-200/50 p-8 border border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">관련 가이드</h3>
              <div className="space-y-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-sm">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {relatedPost.title}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{relatedPost.category}</span>
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