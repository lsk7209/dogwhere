export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'

// 메인 사이트맵 인덱스
export async function GET(request: NextRequest) {
  try {
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

  } catch (error) {
    console.error('Sitemap index error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
