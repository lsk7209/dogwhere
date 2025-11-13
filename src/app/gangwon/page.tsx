/**
 * 강원도 지역 페이지
 */

import { Metadata } from 'next'
import { RegionPage } from '@/components/regions/RegionPage'

export const metadata: Metadata = {
  title: '강원도 강아지 동반 장소 | 어서오개',
  description: '강원도 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
  keywords: '강원도, 강아지 동반, 반려견, 강원도 카페, 강원도 여행',
  openGraph: {
    title: '강원도 강아지 동반 장소 | 어서오개',
    description: '강원도 지역의 강아지 동반 가능한 카페, 식당, 호텔, 공원을 찾아보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function GangwonPage() {
  return (
    <RegionPage region="gangwon" regionName="강원도" />
  )
}

