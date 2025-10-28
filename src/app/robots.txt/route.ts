export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'

// robots.txt 생성
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eoseo-o-gae.com'
    
    const robotsTxt = `User-agent: *
Allow: /

# 네이버 사이트 검증
User-agent: Yeti
Allow: /

# 사이트맵
Sitemap: ${baseUrl}/sitemap.xml

# RSS 피드
Sitemap: ${baseUrl}/rss.xml
Sitemap: ${baseUrl}/rss-blog.xml
Sitemap: ${baseUrl}/rss-guide.xml

# 관리자 페이지 차단
Disallow: /admin/
Disallow: /api/

# 캐시된 페이지 차단
Disallow: /_next/
Disallow: /static/

# 검색 엔진 최적화
Crawl-delay: 1`

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400' // 24시간 캐시
      }
    })

  } catch (error) {
    console.error('Robots.txt generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: 'robots.txt 생성 중 오류가 발생했습니다.',
        code: 'ROBOTS_TXT_ERROR'
      }
    }, { status: 500 })
  }
}
