// 유틸리티 데이터 정의
export interface UtilityItem {
  id: string
  title: string
  description: string
  icon: string // Lucide icon name
  slug: string
  category: 'calculator' | 'finder' | 'guide' | 'planner'
  status: 'completed' | 'coming-soon'
}

export const utilitiesData: UtilityItem[] = [
  {
    id: 'dog-age-calculator',
    title: '반려견 나이 계산기',
    description: '강아지의 나이와 견종을 입력하면 사람 나이로 환산해주는 간단한 계산기',
    icon: 'Calendar',
    slug: 'dog-age-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'dog-obesity-calculator',
    title: '반려견 비만도 계산기',
    description: '체중과 견종을 입력하면 비만 여부를 판단하고, 권장 체중 범위를 안내',
    icon: 'Scale',
    slug: 'dog-obesity-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'walking-temperature-check',
    title: '산책 온도 체크기',
    description: '현재 위치의 온도·습도 정보를 불러와 반려견 산책 적정 여부를 알려줌',
    icon: 'Thermometer',
    slug: 'walking-temperature-check',
    category: 'finder',
    status: 'completed'
  },
  {
    id: 'pet-friendly-accommodation',
    title: '반려견 동반 숙소 찾기',
    description: '한국관광공사 반려동물 여행 API를 활용해 지역별 숙소 목록 표시',
    icon: 'Home',
    slug: 'pet-friendly-accommodation',
    category: 'finder',
    status: 'completed'
  },
  {
    id: 'travel-packing-list',
    title: '반려견 여행 짐 리스트',
    description: '여행 목적지, 계절에 따라 자동으로 가져야 할 준비물을 제시',
    icon: 'Luggage',
    slug: 'travel-packing-list',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'food-calorie-calculator',
    title: '반려견 사료 칼로리 계산기',
    description: '체중과 활동량에 따라 1일 적정 사료량과 칼로리 계산',
    icon: 'Utensils',
    slug: 'food-calorie-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'find-veterinary',
    title: '근처 동물병원 찾기',
    description: '위치 기반으로 반려동물 병원 및 24시 응급실 표시',
    icon: 'Stethoscope',
    slug: 'find-veterinary',
    category: 'finder',
    status: 'completed'
  },
  {
    id: 'walking-course-recommender',
    title: '산책 코스 추천기',
    description: '현재 위치를 기준으로 반려견 친화 산책로와 공원 추천',
    icon: 'MapPin',
    slug: 'walking-course-recommender',
    category: 'finder',
    status: 'completed'
  },
  {
    id: 'breed-personality-guide',
    title: '견종별 성격 가이드',
    description: '주요 견종을 선택하면 성격, 훈련 난이도, 추천 가정 환경을 안내',
    icon: 'Dog',
    slug: 'breed-personality-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'pet-travel-planner',
    title: '펫 여행 일정 플래너',
    description: '출발지와 목적지를 입력하면 이동거리, 추천 숙소, 체험 루트를 자동 제안',
    icon: 'Plane',
    slug: 'pet-travel-planner',
    category: 'planner',
    status: 'completed'
  }
]

// 카테고리별 분류
export const getUtilitiesByCategory = (category?: string) => {
  if (!category) return utilitiesData
  return utilitiesData.filter(util => util.category === category)
}

// 완료된 유틸리티만 필터링
export const getCompletedUtilities = () => {
  return utilitiesData.filter(util => util.status === 'completed')
}

// 슬러그로 유틸리티 찾기
export const getUtilityBySlug = (slug: string) => {
  return utilitiesData.find(util => util.slug === slug)
}

