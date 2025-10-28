export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'

// 발행 API (Make.com에서 호출)
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token || token !== process.env.INTERNAL_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 멱등성 키 확인
    const idempotencyKey = request.headers.get('idempotency-key')
    const contentVersion = request.headers.get('x-content-version')
    
    if (!idempotencyKey || !contentVersion) {
      return NextResponse.json(
        { success: false, error: 'Missing required headers' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { type, id, name, category, address, lat, lng, openingHours, features, rating, reviewCount, source, updatedAt } = body

    // 스키마 검증
    if (!type || !id || !name || !category || !address || !lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 지원하는 타입 확인
    if (!['place', 'event', 'post'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type' },
        { status: 400 }
      )
    }

    // 지역 코드 추출 (실제로는 더 정교한 로직 필요)
    const regionCode = extractRegionCode(address)
    const slug = generateSlug(name, regionCode)

    // 실제로는 데이터베이스에 저장
    const publishedData = {
      id,
      slug,
      name,
      category,
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      regionCode,
      openingHours: openingHours || [],
      features: features || [],
      rating: parseFloat(rating) || 0,
      reviewCount: parseInt(reviewCount) || 0,
      source,
      updatedAt: updatedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    // 라우팅 경로 생성
    const routes = generateRoutes(publishedData)

    return NextResponse.json({
      success: true,
      data: {
        slug,
        region: {
          sido: regionCode.split('-')[0],
          sig: regionCode.split('-')[1]
        },
        routed: routes
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Publish API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 지역 코드 추출 함수
function extractRegionCode(address: string): string {
  // 간단한 구현 - 실제로는 더 정교한 로직 필요
  if (address.includes('서울')) {
    if (address.includes('마포구')) return 'seoul-mapo-gu'
    if (address.includes('강남구')) return 'seoul-gangnam-gu'
    if (address.includes('송파구')) return 'seoul-songpa-gu'
    return 'seoul-unknown'
  }
  if (address.includes('경기')) return 'gyeonggi-unknown'
  if (address.includes('부산')) return 'busan-unknown'
  if (address.includes('제주')) return 'jeju-unknown'
  return 'kr-unknown'
}

// 슬러그 생성 함수
function generateSlug(name: string, regionCode: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
  
  const region = regionCode.split('-')[0]
  return `${cleanName}-${region}`
}

// 라우팅 경로 생성 함수
function generateRoutes(data: any): string[] {
  const routes = []
  const [sido, sig] = data.regionCode.split('-')
  
  // 허브 경로
  routes.push(`/${sido}`)
  if (sig && sig !== 'unknown') {
    routes.push(`/${sido}/${sig}`)
  }
  
  // 클러스터 경로
  if (data.category) {
    routes.push(`/${sido}/${data.category}`)
    if (sig && sig !== 'unknown') {
      routes.push(`/${sido}/${sig}/${data.category}`)
    }
  }
  
  return routes
}
