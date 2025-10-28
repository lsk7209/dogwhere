export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generatePlaceSitemap, generateSitemapXml } from '@/lib/sitemap'

// 장소 페이지 사이트맵 (동적)
export async function GET(request: NextRequest) {
  try {
    const urls = await generatePlaceSitemap()
    const sitemapXml = generateSitemapXml(urls)

    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800' // 30분 캐시 (동적 데이터)
      }
    })

  } catch (error) {
    console.error('Place sitemap generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '장소 사이트맵 생성 중 오류가 발생했습니다.',
        code: 'PLACE_SITEMAP_ERROR'
      }
    }, { status: 500 })
  }
}
