/**
 * 서울 구 단위 카테고리 페이지
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { getPlacesByRegion } from '@/lib/database/simple-places'

interface PageProps {
  params: Promise<{
    sig: string
    category: string
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

// 카테고리 매핑
const categoryMap: Record<string, string> = {
  'dog-cafe': '강아지 카페',
  'dog-park': '강아지 공원',
  'dog-hotel': '펫 호텔',
  'restaurant': '식당',
  'cafe': '카페',
  'hotel': '호텔',
  'park': '공원'
}

export async function generateStaticParams() {
  const districts = Object.keys(seoulDistricts)
  const categories = Object.keys(categoryMap)
  const params: Array<{ sig: string; category: string }> = []
  
  // 주요 조합만 생성 (전체 조합은 너무 많음)
  const mainDistricts = ['gangnam-gu', 'mapo-gu', 'seocho-gu', 'songpa-gu']
  const mainCategories = ['dog-cafe', 'dog-park', 'restaurant']
  
  for (const sig of mainDistricts) {
    for (const category of mainCategories) {
      params.push({ sig, category })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sig, category } = await params
  const districtName = seoulDistricts[sig]
  const categoryName = categoryMap[category] || category
  
  if (!districtName) {
    return {
      title: '페이지를 찾을 수 없습니다 | 어서오개',
    }
  }

  return {
    title: `${districtName} ${categoryName} | 서울 | 어서오개`,
    description: `${districtName} 지역의 ${categoryName} 강아지 동반 가능한 장소를 찾아보세요.`,
    keywords: `서울 ${districtName}, ${categoryName}, 강아지 동반`,
    openGraph: {
      title: `${districtName} ${categoryName} | 서울 | 어서오개`,
      description: `${districtName} 지역의 ${categoryName} 강아지 동반 가능한 장소를 찾아보세요.`,
      type: 'website',
      locale: 'ko_KR',
    },
  }
}

export default async function SeoulDistrictCategoryPage({ params }: PageProps) {
  const { sig, category } = await params
  const districtName = seoulDistricts[sig]
  const categoryName = categoryMap[category] || category
  
  if (!districtName) {
    notFound()
  }

  // 해당 구와 카테고리의 장소 데이터 가져오기
  const allPlaces = getPlacesByRegion('서울특별시')
  const filteredPlaces = allPlaces.filter(place => {
    const matchesDistrict = place.sigungu?.includes(districtName.replace('구', '')) || 
                           place.address?.includes(districtName)
    const matchesCategory = place.category === categoryName || 
                           place.category?.toLowerCase().includes(category.replace('dog-', ''))
    return matchesDistrict && matchesCategory
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
            <Link href={`/seoul/${sig}`} className="hover:text-blue-600">{districtName}</Link>
            {' > '}
            <span className="text-gray-900">{categoryName}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {districtName} {categoryName}
          </h1>
          <p className="text-gray-600">
            {districtName} 지역의 {categoryName} 강아지 동반 가능한 장소 {filteredPlaces.length}개를 찾았습니다.
          </p>
        </div>

        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
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
              {districtName} 지역의 {categoryName} 강아지 동반 장소 정보를 준비 중입니다.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href={`/seoul/${sig}`}
                className="inline-block px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {districtName} 전체 보기
              </Link>
              <Link
                href="/seoul"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                서울 전체 보기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

