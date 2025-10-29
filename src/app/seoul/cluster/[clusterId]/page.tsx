import { Metadata } from 'next'
import { ClusterDetailPage } from '@/components/regions/ClusterDetailPage'
import { getPlacesByRegion } from '@/lib/database/simple-places'
import { RegionClusterUtils } from '@/lib/regions/clusters'

interface PageProps {
  params: Promise<{
    clusterId: string
  }>
}

// 정적 파라미터 생성
export async function generateStaticParams() {
  const clusterNames: Record<string, string> = {
    'gangnam-cluster': '강남권',
    'hongdae-cluster': '홍대권',
    'myeongdong-cluster': '명동권',
    'jamsil-cluster': '잠실권',
    'itaewon-cluster': '이태원권'
  }
  
  return Object.keys(clusterNames).map(clusterId => ({ clusterId }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clusterId } = await params
  
  // 실제 운영에서는 클러스터 정보를 가져와서 동적으로 생성
  const clusterNames: Record<string, string> = {
    'gangnam-cluster': '강남권',
    'hongdae-cluster': '홍대/마포권',
    'gangbuk-cluster': '강북권',
    'han-river-cluster': '한강권',
    'northeast-cluster': '동북권',
    'southwest-cluster': '서남권',
    'southeast-cluster': '동남권'
  }

  const clusterName = clusterNames[clusterId] || '클러스터'

  return {
    title: `${clusterName} 강아지 동반 장소 | 서울 | 어서오개`,
    description: `${clusterName} 지역의 강아지 동반 가능한 장소를 효율적으로 탐색해보세요.`,
    keywords: `서울 ${clusterName}, 강아지 동반, 반려견, ${clusterName} 카페`,
    openGraph: {
      title: `${clusterName} 강아지 동반 장소 | 서울 | 어서오개`,
      description: `${clusterName} 지역의 강아지 동반 가능한 장소를 효율적으로 탐색해보세요.`,
      type: 'website',
      locale: 'ko_KR',
    },
  }
}

export default async function SeoulClusterPage({ params }: PageProps) {
  const { clusterId } = await params
  
  // 클러스터에 포함된 지역 목록 가져오기
  const regions = RegionClusterUtils.getRegionsByCluster('seoul', clusterId)
  const clusterSigunguList = regions.map(r => {
    const sig = r.sig || r.name
    return sig.replace('-gu', '구').replace('-gun', '군').replace('-si', '시')
  })

  // 해당 지역의 장소 데이터 가져오기
  const allPlaces = getPlacesByRegion('서울특별시')
  const clusterPlaces = allPlaces.filter(place => {
    if (!place.sigungu) return false
    return clusterSigunguList.some(sig => place.sigungu?.includes(sig) || place.address?.includes(sig))
  }).slice(0, 12) // 최대 12개

  return (
    <ClusterDetailPage 
      region="seoul" 
      regionName="서울" 
      clusterId={clusterId}
      initialPlaces={clusterPlaces}
    />
  )
}
