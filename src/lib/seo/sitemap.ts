import { NextRequest, NextResponse } from 'next/server'

// 사이트맵 생성 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'index'
    
    switch (type) {
      case 'index':
        return generateSitemapIndex()
      case 'hub-sido':
        return generateHubSidoSitemap()
      case 'hub-sig':
        return generateHubSigSitemap(searchParams.get('sido'))
      case 'cluster':
        return generateClusterSitemap(
          searchParams.get('sido'),
          searchParams.get('category'),
          parseInt(searchParams.get('page') || '1')
        )
      case 'posts':
        return generatePostsSitemap()
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid sitemap type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 사이트맵 인덱스 생성
function generateSitemapIndex() {
  const sitemaps = [
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/hub-sido.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/hub-sig-seoul.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/hub-sig-gyeonggi.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/hub-sig-busan.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/hub-sig-jeju.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/cluster-seoul-dog-cafe-1.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/cluster-seoul-dog-park-1.xml',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      loc: 'https://eoseo-o-gae.com/sitemaps/posts.xml',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60'
    }
  })
}

// 시/도 허브 사이트맵 생성
function generateHubSidoSitemap() {
  const sidos = ['seoul', 'gyeonggi', 'busan', 'jeju']
  const urls = sidos.map(sido => ({
    loc: `https://eoseo-o-gae.com/${sido}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.8'
  }))

  return generateSitemapXml(urls)
}

// 시/구 허브 사이트맵 생성
function generateHubSigSitemap(sido: string | null) {
  if (!sido) {
    return NextResponse.json(
      { success: false, error: 'Sido parameter required' },
      { status: 400 }
    )
  }

  // 실제로는 데이터베이스에서 가져옴
  const sigs: Record<string, string[]> = {
    seoul: ['mapo-gu', 'dongjak-gu', 'gangnam-gu', 'seongdong-gu'],
    gyeonggi: ['gapyeong-gun', 'yangpyeong-gun', 'suwon-si', 'yongin-si'],
    busan: ['haeundae-gu', 'saha-gu', 'sasang-gu'],
    jeju: ['jeju-si', 'seogwipo-si']
  }

  const sigList = sigs[sido] || []
  const urls = sigList.map(sig => ({
    loc: `https://eoseo-o-gae.com/${sido}/${sig}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.7'
  }))

  return generateSitemapXml(urls)
}

// 클러스터 사이트맵 생성
function generateClusterSitemap(sido: string | null, category: string | null, page: number) {
  if (!sido || !category) {
    return NextResponse.json(
      { success: false, error: 'Sido and category parameters required' },
      { status: 400 }
    )
  }

  // 실제로는 데이터베이스에서 가져옴
  const mockPlaces = Array.from({ length: 50 }, (_, i) => ({
    id: `place_${i + 1}`,
    slug: `place-${i + 1}`,
    name: `${category} ${i + 1}`,
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }))

  const startIndex = (page - 1) * 5000
  const endIndex = startIndex + 5000
  const places = mockPlaces.slice(startIndex, endIndex)

  const urls = places.map(place => ({
    loc: `https://eoseo-o-gae.com/place/${place.slug}`,
    lastmod: place.updatedAt,
    changefreq: 'weekly',
    priority: '0.6'
  }))

  return generateSitemapXml(urls)
}

// 포스트 사이트맵 생성
function generatePostsSitemap() {
  // 실제로는 데이터베이스에서 가져옴
  const mockPosts = [
    {
      slug: 'seoul-dog-cafe-top10',
      updatedAt: '2025-10-28'
    },
    {
      slug: 'first-time-dog-cafe-guide',
      updatedAt: '2025-10-27'
    }
  ]

  const urls = mockPosts.map(post => ({
    loc: `https://eoseo-o-gae.com/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'monthly',
    priority: '0.5'
  }))

  return generateSitemapXml(urls)
}

// 사이트맵 XML 생성 헬퍼
function generateSitemapXml(urls: Array<{
  loc: string
  lastmod: string
  changefreq?: string
  priority?: string
}>) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60'
    }
  })
}

// 사이트맵 업데이트 로직
export function updateSitemapLastmod(sitemapType: string, identifiers: string[]) {
  // 실제로는 데이터베이스에서 해당 사이트맵의 lastmod를 업데이트
  console.log(`Updating sitemap ${sitemapType} for:`, identifiers)
  
  // 예시: 사이트맵 캐시 무효화
  // await invalidateSitemapCache(sitemapType)
}

// 사이트맵 캐시 무효화
export function invalidateSitemapCache(sitemapType: string) {
  // 실제로는 Cloudflare Cache API 또는 Redis를 사용
  console.log(`Invalidating cache for sitemap: ${sitemapType}`)
}
