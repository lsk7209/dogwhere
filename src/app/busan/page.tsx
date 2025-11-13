/**
 * 부산 지역 페이지
 */

import { Metadata } from 'next'
import { RegionPage } from '@/components/regions/RegionPage'

export const metadata: Metadata = {
  title: '부산 강아지 동반 장소 | 어서오개',
  description: '부산 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
  keywords: '부산, 강아지 동반, 반려견, 부산 카페, 부산 여행',
  openGraph: {
    title: '부산 강아지 동반 장소 | 어서오개',
    description: '부산 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function BusanPage() {
  return (
    <RegionPage region="busan" regionName="부산" />
  )
}

