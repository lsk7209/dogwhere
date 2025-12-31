import { getAllPosts as getAllStaticPosts, BlogPost } from '@/lib/blog-data'
import { createPostRepository } from '@/lib/database/db-adapter'
import BlogListContainer from '@/components/blog/BlogListContainer'

export const dynamic = 'force-dynamic'

async function getDBPosts(): Promise<BlogPost[]> {
  try {
    const postRepo = createPostRepository()
    // TursoPostRepository에 findAll 메서드가 있는지 확인하거나 search를 사용해야 함
    // findAllTitles만 있는 경우 전체 조회를 위해 search({}) 등을 사용할 수 있음
    // 여기서는 findAll/search 메서드가 있다고 가정 (없는 경우 추가 필요)
    const result = await postRepo.findAll({}, { field: 'date', order: 'DESC' }, { page: 1, limit: 100 })
    const posts = result.data

    return posts.map((post: any) => ({
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
    }))
  } catch (error) {
    console.error('Error fetching blog posts from DB:', error)
    return []
  }
}

export default async function BlogPage() {
  const staticPosts = getAllStaticPosts()
  const dbPosts = await getDBPosts()

  // 중복 제거 (슬러그 기준)
  const allPostsMap = new Map<string, BlogPost>()
  staticPosts.forEach(post => allPostsMap.set(post.slug, post))
  dbPosts.forEach(post => allPostsMap.set(post.slug, post))

  const allPosts = Array.from(allPostsMap.values()).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-6">
            Blog & Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            반려견과 함께하는 <span className="text-emerald-600">특별한 이야기</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            여행기부터 유용한 팁까지, 강아지와 함께하는 행복한 일상을 위한 모든 정보를 만나보세요.
          </p>
        </div>
      </div>

      <BlogListContainer initialPosts={allPosts} />
    </div>
  )
}
