/**
 * 서울 구 단위 페이지
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Clock, Phone } from 'lucide-react'
import { getPlacesByRegion } from '@/lib/database/simple-places'

interface PageProps {
  params: Promise<{
    sig: string
  }>
}

// 서울시 구 목록
const seoulDistricts: Record<string, string> = {
  'gangnam-gu': '강남구',
  'seocho-gu': '서초구',
  'songpa-gu': '송파구',
  'mapo-gu': '마포구',
  'seodaemun-gu': '서대문구',
  'eunpyeong-gu': '은평구',
  'jongno-gu': '종로구',
  'jung-gu': '중구',
  'yeongdeungpo-gu': '영등포구',
  'yangcheon-gu': '양천구',
  'guro-gu': '구로구',
  'geumcheon-gu': '금천구',
  'gwanak-gu': '관악구',
  'dongjak-gu': '동작구',
  'seongdong-gu': '성동구',
  'dongdaemun-gu': '동대문구',
  'jungnang-gu': '중랑구',
  'nowon-gu': '노원구',
  'dobong-gu': '도봉구',
  'gangbuk-gu': '강북구',
  'seongbuk-gu': '성북구',
  'gangdong-gu': '강동구',
  'yongsan-gu': '용산구',
  'gwangjin-gu': '광진구'
}

export async function generateStaticParams() {
  return Object.keys(seoulDistricts).map(sig => ({ sig }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sig } = await params
  const districtName = seoulDistricts[sig]
  
  if (!districtName) {
    return {
      title: '페이지를 찾을 수 없습니다 | 어서오개',
    }
  }

  return {
    title: `${districtName} 강아지 동반 장소 | 서울 | 어서오개`,
    description: `${districtName} 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.`,
    keywords: `서울 ${districtName}, 강아지 동반, 반려견, ${districtName} 카페`,
    openGraph: {
      title: `${districtName} 강아지 동반 장소 | 서울 | 어서오개`,
      description: `${districtName} 지역의 강아지 동반 가능한 장소를 찾아보세요.`,
      type: 'website',
      locale: 'ko_KR',
    },
  }
}

export default async function SeoulDistrictPage({ params }: PageProps) {
  const { sig } = await params
  const districtName = seoulDistricts[sig]
  
  if (!districtName) {
    notFound()
  }

  // 해당 구의 장소 데이터 가져오기
  const allPlaces = getPlacesByRegion('서울특별시')
  const districtPlaces = allPlaces.filter(place => {
    if (!place.sigungu) return false
    return place.sigungu.includes(districtName.replace('구', '')) || 
           place.address?.includes(districtName)
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            {' > '}
            <Link href="/seoul" className="hover:text-blue-600">서울</Link>
            {' > '}
            <span className="text-gray-900">{districtName}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {districtName} 강아지 동반 장소
          </h1>
          <p className="text-gray-600">
            {districtName} 지역의 강아지 동반 가능한 장소 {districtPlaces.length}개를 찾았습니다.
          </p>
        </div>

        {districtPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtPlaces.map((place) => (
              <Link
                key={place.id}
                href={`/place/${place.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{place.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {place.address && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{place.address}</span>
                    </div>
                  )}
                  {place.category && (
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {place.category}
                      </span>
                    </div>
                  )}
                  {place.rating && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      <span>{place.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {districtName} 지역의 강아지 동반 장소 정보를 준비 중입니다.
            </p>
            <Link
              href="/seoul"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              서울 전체 보기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

