export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generateGuideRSSChannel, generateRSSXml } from '@/lib/rss'

// 가이드 전용 RSS 피드
export async function GET(request: NextRequest) {
  try {
    const channel = generateGuideRSSChannel()
    const rssXml = generateRSSXml(channel)

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800'
      }
    })

  } catch (error) {
    console.error('Guide RSS feed generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: '가이드 RSS 피드 생성 중 오류가 발생했습니다.',
        code: 'GUIDE_RSS_FEED_ERROR'
      }
    }, { status: 500 })
  }
}
