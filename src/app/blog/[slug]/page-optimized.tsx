/**
 * 최적화된 블로그 포스트 상세 페이지
 * ISR (Incremental Static Regeneration) 지원
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostRepository } from '@/lib/database/d1-repository'

interface PageProps {
  params: {
    slug: string
  }
}

/**
 * 정적 파라미터 생성 (빌드 시 최신 포스트만 생성)
 * 나머지는 on-demand로 생성
 */
export async function generateStaticParams() {
  const repository = new PostRepository()
  
  // 최신 포스트 100개만 빌드 시 생성
  const slugs = await repository.findAllSlugs()
  return slugs.slice(0, 100).map((slug) => ({ slug }))
}

/**
 * 동적 메타데이터 생성
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const repository = new PostRepository()
  const post = await repository.findBySlug(params.slug)

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | 어서오개'
    }
  }

  return {
    title: `${post.title} | 어서오개`,
    description: post.excerpt,
    keywords: post.seo_keywords ? JSON.parse(post.seo_keywords) : [],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.date,
    },
  }
}

/**
 * 페이지 컴포넌트
 * ISR: 1시간마다 재생성
 */
export const revalidate = 3600 // 1시간

export default async function BlogPostPage({ params }: PageProps) {
  const repository = new PostRepository()
  const post = await repository.findBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* 브레드크럼 */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-blue-600">홈</a></li>
              <li className="text-gray-400">/</li>
              <li><a href="/blog" className="hover:text-blue-600">블로그</a></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{post.title}</li>
            </ol>
          </nav>

          {/* 헤더 */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 text-sm">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
              {post.read_time && (
                <>
                  <span>•</span>
                  <span>{post.read_time}분 읽기</span>
                </>
              )}
            </div>
          </header>

          {/* 이미지 */}
          {post.image && (
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* 태그 */}
          {post.tags && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {JSON.parse(post.tags).map((tag: string) => (
                  <span 
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}

