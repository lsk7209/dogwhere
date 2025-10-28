export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generateEventSitemap, generateSitemapXml } from '@/lib/sitemap'

// 이벤트 페이지 사이트맵
export async function GET(request: NextRequest) {
  try {
    const urls = generateEventSitemap()
    const sitemapXml = generateSitemapXml(urls)

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Event sitemap generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '이벤트 사이트맵 생성 중 오류가 발생했습니다.',
        code: 'EVENT_SITEMAP_ERROR'
      }
    }, { status: 500 })
  }
}
