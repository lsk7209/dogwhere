import { PlaceRepository, PlaceRow } from '@/lib/database/turso-repository'
import { logger } from './logger'

// 사이트맵 URL 타입 정의
export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// 정적 페이지 사이트맵 생성
export function generateStaticSitemap(): SitemapUrl[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const now = new Date().toISOString()

  return [
    // 메인 페이지들
    {
      loc: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/guide`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/events`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/recommendations/today`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/report`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/seoul`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    // 지역별 페이지들
    {
      loc: `${baseUrl}/seoul/cluster/gangnam-cluster`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/seoul/cluster/hongdae-cluster`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/seoul/cluster/myeongdong-cluster`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/seoul/cluster/jamsil-cluster`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/seoul/cluster/itaewon-cluster`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    }
  ]
}

// 블로그 포스트 사이트맵 생성
export function generateBlogSitemap(): SitemapUrl[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'

  const blogPosts = [
    'jeju-dog-travel-guide',
    'dog-cafe-selection-guide',
    'dog-health-travel-guide',
    'dog-friendly-accommodation-guide',
    'dog-park-seoul-guide',
    'dog-restaurant-etiquette-guide'
  ]

  return blogPosts.map(slug => ({
    loc: `${baseUrl}/blog/${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.6
  }))
}

// 가이드 페이지 사이트맵 생성
export function generateGuideSitemap(): SitemapUrl[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'

  const guides = [
    'dog-travel-transport-guide',
    'dog-accommodation-guide',
    'dog-meal-travel-guide',
    'dog-health-care-guide',
    'dog-safety-travel-guide',
    'dog-behavior-travel-guide'
  ]

  return guides.map(slug => ({
    loc: `${baseUrl}/guide/${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.6
  }))
}

// 이벤트 페이지 사이트맵 생성
export function generateEventSitemap(): SitemapUrl[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'

  const events = [
    'dog-festival-2025'
  ]

  return events.map(slug => ({
    loc: `${baseUrl}/event/${slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly' as const,
    priority: 0.5
  }))
}

// 장소 페이지 사이트맵 생성 (동적)
export async function generatePlaceSitemap(): Promise<SitemapUrl[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'

  try {
    const repo = new PlaceRepository()
    // 기존 places 테이블에서 발행된 항목 (최대 1000개)
    const result = await repo.findAll({}, { field: 'updated_at', order: 'DESC' }, { page: 1, limit: 1000 })
    const placeUrls = result.data.map((place: any) => ({
      loc: `${baseUrl}/place/${place.slug}`,
      lastmod: place.updated_at,
      changefreq: 'weekly' as const,
      priority: 0.5
    }))

    // 공공데이터에서 발행되고 사이트맵 제외되지 않은 항목만 포함
    try {
      const { getTursoDatabase } = await import('@/lib/database/turso-client')
      const db = getTursoDatabase()

      const publicDataResult = await db.execute({
        sql: `
          SELECT slug, updated_at 
          FROM public_data_places 
          WHERE regeneration_status = 'completed'
            AND regenerated_content IS NOT NULL
            AND regenerated_content != ''
            AND sitemap_excluded = 0
          ORDER BY last_regenerated_at DESC
        `,
        args: []
      })

      const publicDataUrls = publicDataResult.rows.map(row => ({
        loc: `${baseUrl}/public-data/place/${row[0] as string}`,
        lastmod: (row[1] as string) || new Date().toISOString(),
        changefreq: 'weekly' as const,
        priority: 0.5
      }))

      return [...placeUrls, ...publicDataUrls]
    } catch (error) {
      // Turso가 없으면 기존 places만 반환
      logger.warn('Turso database not available for public data sitemap')
      return placeUrls
    }
  } catch (error) {
    logger.error('Error generating place sitemap', error)
    return []
  }
}

// 전체 사이트맵 생성
export async function generateFullSitemap(): Promise<SitemapUrl[]> {
  const staticUrls = generateStaticSitemap()
  const blogUrls = generateBlogSitemap()
  const guideUrls = generateGuideSitemap()
  const eventUrls = generateEventSitemap()
  const placeUrls = await generatePlaceSitemap()

  return [
    ...staticUrls,
    ...blogUrls,
    ...guideUrls,
    ...eventUrls,
    ...placeUrls
  ]
}

// 사이트맵 XML 생성
export function generateSitemapXml(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const urlsetClose = '</urlset>'

  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')

  return `${xmlHeader}
${urlsetOpen}${urlEntries}
${urlsetClose}`
}

// 사이트맵 인덱스 XML 생성
export function generateSitemapIndexXml(sitemaps: Array<{ loc: string, lastmod: string }>): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const sitemapIndexOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const sitemapIndexClose = '</sitemapindex>'

  const sitemapEntries = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('')

  return `${xmlHeader}
${sitemapIndexOpen}${sitemapEntries}
${sitemapIndexClose}`
}
