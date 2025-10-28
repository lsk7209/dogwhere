export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generateGuideSitemap, generateSitemapXml } from '@/lib/sitemap'

// 가이드 페이지 사이트맵
export async function GET(request: NextRequest) {
  try {
    const urls = generateGuideSitemap()
    const sitemapXml = generateSitemapXml(urls)

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Guide sitemap generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '가이드 사이트맵 생성 중 오류가 발생했습니다.',
        code: 'GUIDE_SITEMAP_ERROR'
      }
    }, { status: 500 })
  }
}
