export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'

// 행사 목록 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'kr'
    const sido = searchParams.get('sido')
    const sig = searchParams.get('sig')
    const range = searchParams.get('range') || 'this-week'
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 실제로는 데이터베이스에서 가져옴
    const mockEvents = [
      {
        id: 'event_1',
        slug: 'dog-festival-2025',
        title: '2025 강아지 축제 - 반려견과 함께하는 특별한 하루',
        startDate: '2025-10-28',
        endDate: '2025-10-30',
        regionCode: 'seoul-songpa-gu',
        venue: '서울 올림픽공원',
        address: '서울 송파구 올림픽로 424',
        lat: 37.52,
        lng: 127.12,
        ticketInfo: '무료 (사전 등록 필요)',
        petAllowed: true,
        source: 'tourapi',
        updatedAt: '2025-10-28T07:00:00Z',
        createdAt: '2025-10-01T00:00:00Z'
      },
      {
        id: 'event_2',
        slug: 'pet-expo-seoul',
        title: '서울 펫 엑스포 2025',
        startDate: '2025-11-15',
        endDate: '2025-11-17',
        regionCode: 'seoul-gangnam-gu',
        venue: '코엑스',
        address: '서울 강남구 영동대로 513',
        lat: 37.51,
        lng: 127.06,
        ticketInfo: '성인 15,000원, 어린이 10,000원',
        petAllowed: true,
        source: 'tourapi',
        updatedAt: '2025-10-28T07:00:00Z',
        createdAt: '2025-10-01T00:00:00Z'
      },
      {
        id: 'event_3',
        slug: 'dog-training-seminar',
        title: '강아지 훈련 세미나',
        startDate: '2025-11-05',
        endDate: '2025-11-05',
        regionCode: 'seoul-mapo-gu',
        venue: '홍대 문화공간',
        address: '서울 마포구 와우산로 94',
        lat: 37.55,
        lng: 126.92,
        ticketInfo: '무료',
        petAllowed: false,
        source: 'tourapi',
        updatedAt: '2025-10-28T07:00:00Z',
        createdAt: '2025-10-01T00:00:00Z'
      }
    ]

    // 날짜 범위 필터링
    const now = new Date()
    let filteredEvents = mockEvents

    if (range === 'this-week') {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate >= weekStart && eventDate <= weekEnd
      })
    } else if (range === 'next-week') {
      const nextWeekStart = new Date(now)
      nextWeekStart.setDate(now.getDate() + (7 - now.getDay()))
      const nextWeekEnd = new Date(nextWeekStart)
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
      
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate >= nextWeekStart && eventDate <= nextWeekEnd
      })
    }

    // 지역 필터링
    if (sido) {
      filteredEvents = filteredEvents.filter(event => 
        event.address.includes(sido) || event.regionCode.includes(sido)
      )
    }

    if (sig) {
      filteredEvents = filteredEvents.filter(event => 
        event.address.includes(sig) || event.regionCode.includes(sig)
      )
    }

    // 페이지네이션
    let startIndex = 0
    if (cursor) {
      const cursorIndex = filteredEvents.findIndex(event => event.id === cursor)
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0
    }

    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + limit)
    const nextCursor = paginatedEvents.length === limit 
      ? paginatedEvents[paginatedEvents.length - 1]?.id 
      : null

    return NextResponse.json({
      success: true,
      data: {
        events: paginatedEvents,
        pagination: {
          cursor: nextCursor,
          hasMore: !!nextCursor,
          total: filteredEvents.length
        },
        filters: {
          region,
          sido,
          sig,
          range
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    })

  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
