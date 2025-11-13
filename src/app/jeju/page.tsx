/**
 * 제주도 지역 페이지
 */

import { Metadata } from 'next'
import { RegionPage } from '@/components/regions/RegionPage'

export const metadata: Metadata = {
  title: '제주도 강아지 동반 장소 | 어서오개',
  description: '제주도 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
  keywords: '제주도, 강아지 동반, 반려견, 제주 카페, 제주 여행',
  openGraph: {
    title: '제주도 강아지 동반 장소 | 어서오개',
    description: '제주도 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function JejuPage() {
  return (
    <RegionPage region="jeju" regionName="제주도" />
  )
}

