export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import { generateFullRSSChannel, generateRSSXml } from '@/lib/rss'

// 전체 RSS 피드
export async function GET(request: NextRequest) {
  try {
    const channel = generateFullRSSChannel()
    const rssXml = generateRSSXml(channel)

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800'
      }
    })

  } catch (error) {
    console.error('RSS feed generation error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: 'RSS 피드 생성 중 오류가 발생했습니다.',
        code: 'RSS_FEED_ERROR'
      }
    }, { status: 500 })
  }
}
