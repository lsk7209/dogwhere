export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generateSitemapIndexXml } from '@/lib/sitemap'

// 메인 사이트맵 인덱스
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eoseo-o-gae.com'
    const now = new Date().toISOString()

    // 개별 사이트맵 목록
    const sitemaps = [
      {
        loc: `${baseUrl}/sitemaps/static.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemaps/blog.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemaps/guide.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemaps/events.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemaps/places.xml`,
        lastmod: now
      }
    ]

    const sitemapIndexXml = generateSitemapIndexXml(sitemaps)

    return new NextResponse(sitemapIndexXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Sitemap index generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '사이트맵 인덱스 생성 중 오류가 발생했습니다.',
        code: 'SITEMAP_INDEX_ERROR'
      }
    }, { status: 500 })
  }
}
