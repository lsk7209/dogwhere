import { Metadata } from 'next'
import { RegionPage } from '@/components/regions/RegionPage'

export const metadata: Metadata = {
  title: '서울 강아지 동반 장소 | 어서오개',
  description: '서울 지역의 강아지 동반 가능한 장소를 효율적으로 탐색해보세요. 강남권, 홍대/마포권, 강북권 등 지역별 클러스터로 정리된 정보를 제공합니다.',
  keywords: '서울 강아지 동반, 강남구, 마포구, 홍대, 강아지 카페, 반려견',
  openGraph: {
    title: '서울 강아지 동반 장소 | 어서오개',
    description: '서울 지역의 강아지 동반 가능한 장소를 효율적으로 탐색해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function SeoulPage() {
  return (
    <RegionPage region="seoul" regionName="서울" />
  )
}