/**
 * 효율적인 지역 분류 시스템
 * 최신 트렌드에 맞는 지역 그룹핑 및 클러스터링
 */

export interface RegionCluster {
  id: string
  name: string
  type: 'hotspot' | 'cluster' | 'district' | 'special'
  priority: number
  sigList: string[]
  description: string
  icon: string
  color: string
}

export interface RegionData {
  sido: string
  sig: string
  name: string
  population: number
  dogFriendlyScore: number
  popularityScore: number
  accessibilityScore: number
  clusterId?: string
}

/**
 * 서울시 지역 클러스터 정의
 * 실제 데이터 기반으로 인기도, 접근성, 강아지 친화도를 고려한 그룹핑
 */
export const seoulClusters: RegionCluster[] = [
  {
    id: 'gangnam-cluster',
    name: '강남권',
    type: 'hotspot',
    priority: 1,
    sigList: ['gangnam-gu', 'seocho-gu', 'songpa-gu'],
    description: '프리미엄 강아지 카페와 펫샵이 집중된 지역',
    icon: '🏢',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'hongdae-cluster',
    name: '홍대/마포권',
    type: 'hotspot',
    priority: 2,
    sigList: ['mapo-gu', 'seodaemun-gu', 'eunpyeong-gu'],
    description: '젊은 층이 선호하는 트렌디한 강아지 동반 장소',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'gangbuk-cluster',
    name: '강북권',
    type: 'cluster',
    priority: 3,
    sigList: ['jongno-gu', 'jung-gu', 'seongdong-gu', 'dongdaemun-gu'],
    description: '전통과 현대가 공존하는 역사적인 지역',
    icon: '🏛️',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'han-river-cluster',
    name: '한강권',
    type: 'special',
    priority: 4,
    sigList: ['yeongdeungpo-gu', 'yangcheon-gu', 'guro-gu'],
    description: '한강변 강아지 공원과 산책로가 풍부한 지역',
    icon: '🌊',
    color: 'bg-cyan-100 text-cyan-800'
  },
  {
    id: 'northeast-cluster',
    name: '동북권',
    type: 'district',
    priority: 5,
    sigList: ['nowon-gu', 'dobong-gu', 'gangbuk-gu'],
    description: '주거지역 중심의 가족 친화적 강아지 동반 장소',
    icon: '🏘️',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'southwest-cluster',
    name: '서남권',
    type: 'district',
    priority: 6,
    sigList: ['gwanak-gu', 'dongjak-gu', 'seocho-gu'],
    description: '대학가와 주거지가 어우러진 지역',
    icon: '🎓',
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 'southeast-cluster',
    name: '동남권',
    type: 'district',
    priority: 7,
    sigList: ['gangdong-gu', 'songpa-gu'],
    description: '신도시와 자연이 공존하는 지역',
    icon: '🌳',
    color: 'bg-emerald-100 text-emerald-800'
  }
]

/**
 * 경기도 지역 클러스터 정의
 */
export const gyeonggiClusters: RegionCluster[] = [
  {
    id: 'suwon-cluster',
    name: '수원권',
    type: 'hotspot',
    priority: 1,
    sigList: ['suwon-si', 'hwasung-si'],
    description: '경기도 최대 도시, 다양한 강아지 동반 시설',
    icon: '🏰',
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'yongin-cluster',
    name: '용인권',
    type: 'cluster',
    priority: 2,
    sigList: ['yongin-si', 'anseong-si'],
    description: '에버랜드와 테마파크가 있는 가족 여행지',
    icon: '🎢',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'gapyeong-cluster',
    name: '가평/양평권',
    type: 'special',
    priority: 3,
    sigList: ['gapyeong-gun', 'yangpyeong-gun'],
    description: '자연 속에서 강아지와 함께하는 힐링 여행',
    icon: '🏔️',
    color: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'north-gyeonggi-cluster',
    name: '경기북부',
    type: 'district',
    priority: 4,
    sigList: ['paju-si', 'goyang-si', 'yangju-si'],
    description: 'DMZ와 접한 특별한 지역의 강아지 동반 장소',
    icon: '🌲',
    color: 'bg-lime-100 text-lime-800'
  }
]

/**
 * 부산 지역 클러스터 정의
 */
export const busanClusters: RegionCluster[] = [
  {
    id: 'haeundae-cluster',
    name: '해운대권',
    type: 'hotspot',
    priority: 1,
    sigList: ['haeundae-gu', 'suyeong-gu'],
    description: '바다와 함께하는 강아지 동반 해변 휴양지',
    icon: '🏖️',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'jung-cluster',
    name: '중구/서구권',
    type: 'cluster',
    priority: 2,
    sigList: ['jung-gu', 'seo-gu', 'saha-gu'],
    description: '부산의 중심가, 다양한 상업시설과 강아지 동반 장소',
    icon: '🏙️',
    color: 'bg-gray-100 text-gray-800'
  },
  {
    id: 'sasang-cluster',
    name: '사상/강서권',
    type: 'district',
    priority: 3,
    sigList: ['sasang-gu', 'gangseo-gu'],
    description: '공항 접근성이 좋은 지역의 강아지 동반 장소',
    icon: '✈️',
    color: 'bg-indigo-100 text-indigo-800'
  }
]

/**
 * 제주도 지역 클러스터 정의
 */
export const jejuClusters: RegionCluster[] = [
  {
    id: 'jeju-city-cluster',
    name: '제주시권',
    type: 'hotspot',
    priority: 1,
    sigList: ['jeju-si'],
    description: '제주도의 중심, 다양한 강아지 동반 카페와 시설',
    icon: '🏝️',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'seogwipo-cluster',
    name: '서귀포권',
    type: 'special',
    priority: 2,
    sigList: ['seogwipo-si'],
    description: '자연과 함께하는 강아지 동반 힐링 여행지',
    icon: '🌋',
    color: 'bg-orange-100 text-orange-800'
  }
]

/**
 * 강원도 지역 클러스터 정의
 */
export const gangwonClusters: RegionCluster[] = [
  {
    id: 'gangneung-cluster',
    name: '강릉권',
    type: 'hotspot',
    priority: 1,
    sigList: ['gangneung-si', 'sokcho-si'],
    description: '동해안의 대표 관광지, 강아지 동반 해변 휴양지',
    icon: '🌊',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'wonju-cluster',
    name: '원주권',
    type: 'cluster',
    priority: 2,
    sigList: ['wonju-si', 'chuncheon-si'],
    description: '강원도 내륙의 중심, 다양한 강아지 동반 시설',
    icon: '🏔️',
    color: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'pyeongchang-cluster',
    name: '평창/정선권',
    type: 'special',
    priority: 3,
    sigList: ['pyeongchang-gun', 'jeongseon-gun'],
    description: '산과 계곡이 있는 자연 속 강아지 동반 여행지',
    icon: '⛰️',
    color: 'bg-emerald-100 text-emerald-800'
  }
]

/**
 * 모든 지역 클러스터 맵
 */
export const regionClusters = {
  seoul: seoulClusters,
  gyeonggi: gyeonggiClusters,
  busan: busanClusters,
  jeju: jejuClusters,
  gangwon: gangwonClusters
} as const

export type RegionKey = keyof typeof regionClusters

/**
 * 지역 데이터 (실제 운영에서는 API에서 가져옴)
 */
export const regionData: Record<string, RegionData[]> = {
  seoul: [
    { sido: 'seoul', sig: 'gangnam-gu', name: '강남구', population: 550000, dogFriendlyScore: 95, popularityScore: 98, accessibilityScore: 92 },
    { sido: 'seoul', sig: 'mapo-gu', name: '마포구', population: 380000, dogFriendlyScore: 88, popularityScore: 85, accessibilityScore: 90 },
    { sido: 'seoul', sig: 'seocho-gu', name: '서초구', population: 430000, dogFriendlyScore: 90, popularityScore: 88, accessibilityScore: 89 },
    { sido: 'seoul', sig: 'songpa-gu', name: '송파구', population: 680000, dogFriendlyScore: 85, popularityScore: 82, accessibilityScore: 87 },
    { sido: 'seoul', sig: 'jongno-gu', name: '종로구', population: 150000, dogFriendlyScore: 80, popularityScore: 75, accessibilityScore: 95 },
    { sido: 'seoul', sig: 'jung-gu', name: '중구', population: 130000, dogFriendlyScore: 78, popularityScore: 70, accessibilityScore: 98 },
    { sido: 'seoul', sig: 'yeongdeungpo-gu', name: '영등포구', population: 400000, dogFriendlyScore: 82, popularityScore: 78, accessibilityScore: 85 },
    { sido: 'seoul', sig: 'nowon-gu', name: '노원구', population: 520000, dogFriendlyScore: 75, popularityScore: 72, accessibilityScore: 80 },
    { sido: 'seoul', sig: 'gwanak-gu', name: '관악구', population: 500000, dogFriendlyScore: 77, popularityScore: 74, accessibilityScore: 82 },
    { sido: 'seoul', sig: 'gangdong-gu', name: '강동구', population: 450000, dogFriendlyScore: 80, popularityScore: 76, accessibilityScore: 83 }
  ]
}

/**
 * 지역 클러스터 유틸리티 함수들
 */
export class RegionClusterUtils {
  /**
   * 지역별 클러스터 가져오기
   */
  static getClustersByRegion(region: RegionKey): RegionCluster[] {
    return regionClusters[region] || []
  }

  /**
   * 클러스터별 지역 데이터 가져오기
   */
  static getRegionsByCluster(region: RegionKey, clusterId: string): RegionData[] {
    const cluster = this.getClustersByRegion(region).find(c => c.id === clusterId)
    if (!cluster) return []

    const regions = regionData[region] || []
    return regions.filter(r => cluster.sigList.includes(r.sig))
  }

  /**
   * 인기도 기반 클러스터 정렬
   */
  static getClustersSortedByPopularity(region: RegionKey): RegionCluster[] {
    const clusters = this.getClustersByRegion(region)
    return clusters.sort((a, b) => a.priority - b.priority)
  }

  /**
   * 클러스터 타입별 필터링
   */
  static getClustersByType(region: RegionKey, type: RegionCluster['type']): RegionCluster[] {
    return this.getClustersByRegion(region).filter(c => c.type === type)
  }

  /**
   * 지역의 클러스터 찾기
   */
  static findClusterBySig(region: RegionKey, sig: string): RegionCluster | undefined {
    const clusters = this.getClustersByRegion(region)
    return clusters.find(c => c.sigList.includes(sig))
  }

  /**
   * 강아지 친화도 기반 추천 클러스터
   */
  static getRecommendedClusters(region: RegionKey, limit: number = 3): RegionCluster[] {
    const clusters = this.getClustersByRegion(region)
    return clusters
      .sort((a, b) => a.priority - b.priority)
      .slice(0, limit)
  }

  /**
   * 클러스터 통계 정보
   */
  static getClusterStats(region: RegionKey, clusterId: string) {
    const regions = this.getRegionsByCluster(region, clusterId)
    if (regions.length === 0) return null

    const avgDogFriendlyScore = regions.reduce((sum, r) => sum + r.dogFriendlyScore, 0) / regions.length
    const avgPopularityScore = regions.reduce((sum, r) => sum + r.popularityScore, 0) / regions.length
    const totalPopulation = regions.reduce((sum, r) => sum + r.population, 0)

    return {
      regionCount: regions.length,
      avgDogFriendlyScore: Math.round(avgDogFriendlyScore),
      avgPopularityScore: Math.round(avgPopularityScore),
      totalPopulation,
      topRegion: regions.sort((a, b) => b.dogFriendlyScore - a.dogFriendlyScore)[0]
    }
  }
}
