import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'
import { ClusterDetailPage } from '@/components/regions/ClusterDetailPage'

interface PageProps {
  params: {
    clusterId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const clusterId = params.clusterId
  
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

export default function SeoulClusterPage({ params }: PageProps) {
  return (
    <Layout>
      <ClusterDetailPage 
        region="seoul" 
        regionName="서울" 
        clusterId={params.clusterId} 
      />
    </Layout>
  )
}
