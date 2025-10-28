export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'

// 정적 파라미터 생성
export async function generateStaticParams() {
  return [
    { jobType: 'places' },
    { jobType: 'events' },
    { jobType: 'weather' }
  ]
}

// 배치 작업 API (크론에서 호출)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobType: string }> }
) {
  try {
    const { jobType } = await params
    
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token || token !== process.env.INTERNAL_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 지원하는 작업 타입 확인
    const supportedJobs = ['places', 'events', 'weather', 'content']
    if (!supportedJobs.includes(jobType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job type' },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (jobType) {
      case 'places':
        result = await ingestPlaces()
        break
      case 'events':
        result = await ingestEvents()
        break
      case 'weather':
        result = await ingestWeather()
        break
      case 'content':
        result = await generateContent()
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid job type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        jobType,
        startedAt: new Date().toISOString(),
        result
      }
    })

  } catch (error) {
    console.error('Job API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 장소 데이터 수집
async function ingestPlaces() {
  // 실제로는 공공데이터 API 호출
  console.log('Starting places ingestion...')
  
  // 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    processed: 150,
    new: 12,
    updated: 138,
    errors: 0,
    duration: '1.2s'
  }
}

// 행사 데이터 수집
async function ingestEvents() {
  // 실제로는 TourAPI 호출
  console.log('Starting events ingestion...')
  
  // 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    processed: 45,
    new: 8,
    updated: 37,
    errors: 0,
    duration: '0.8s'
  }
}

// 날씨 데이터 수집
async function ingestWeather() {
  // 실제로는 기상청 API 호출
  console.log('Starting weather ingestion...')
  
  // 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    regions: 17,
    temperature: 'collected',
    airQuality: 'collected',
    duration: '0.5s'
  }
}

// 콘텐츠 생성
async function generateContent() {
  // 실제로는 ChatGPT API 호출
  console.log('Starting content generation...')
  
  // 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    summaries: 45,
    faqs: 135,
    descriptions: 23,
    duration: '2.0s'
  }
}
