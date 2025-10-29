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
  },
  {
    id: 'vaccination-scheduler',
    title: '예방접종 일정 관리자',
    description: '반려견 예방접종 일정을 관리하고 다음 접종일을 알림',
    icon: 'Syringe',
    slug: 'vaccination-scheduler',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'feeding-amount-calculator',
    title: '급여량 계산기',
    description: '견종, 체중, 연령에 따른 하루 급여량을 자동 계산',
    icon: 'Utensils',
    slug: 'feeding-amount-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'health-checklist',
    title: '건강 체크리스트',
    description: '일상적인 건강 상태를 정기적으로 체크하고 기록 관리',
    icon: 'Heart',
    slug: 'health-checklist',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'grooming-guide',
    title: '털 관리 가이드',
    description: '견종별 털 관리 방법, 목욕 주기, 빗질 가이드 제공',
    icon: 'Scissors',
    slug: 'grooming-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'bath-schedule-calculator',
    title: '목욕 주기 계산기',
    description: '견종, 생활 환경, 활동량에 따른 적정 목욕 주기 계산',
    icon: 'Droplets',
    slug: 'bath-schedule-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'training-planner',
    title: '훈련 일정 플래너',
    description: '기본 예절부터 특수 기술까지 단계별 훈련 일정 관리',
    icon: 'GraduationCap',
    slug: 'training-planner',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'feeding-schedule',
    title: '식사 시간표 관리',
    description: '규칙적인 식사 시간표를 만들고 급여 기록 관리',
    icon: 'Clock',
    slug: 'feeding-schedule',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'cost-calculator',
    title: '반려견 비용 계산기',
    description: '사료, 병원비, 미용, 장난감 등 월간/연간 예상 비용 계산',
    icon: 'DollarSign',
    slug: 'cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'emergency-guide',
    title: '응급처치 가이드',
    description: '응급 상황별 즉시 대처 방법과 병원 연락처 관리',
    icon: 'AlertTriangle',
    slug: 'emergency-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'stress-indicator',
    title: '스트레스 지수 계산기',
    description: '행동 패턴과 환경을 분석하여 스트레스 정도 측정',
    icon: 'Brain',
    slug: 'stress-indicator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'daily-routine-tracker',
    title: '일상 생활 패턴 추적',
    description: '산책, 식사, 수면 등 일상 패턴을 기록하고 분석',
    icon: 'Activity',
    slug: 'daily-routine-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'appointment-manager',
    title: '병원/미용 예약 관리',
    description: '동물병원, 미용실 예약 일정을 한곳에서 관리',
    icon: 'Calendar',
    slug: 'appointment-manager',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dental-care-guide',
    title: '구강 건강 가이드',
    description: '치아 관리 방법, 양치 주기, 구강 질환 예방 가이드',
    icon: 'Smile',
    slug: 'dental-care-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'vitamin-calculator',
    title: '비타민 보충제 계산기',
    description: '체중, 연령, 건강 상태에 따른 적정 비타민/보충제 계산',
    icon: 'HeartPulse',
    slug: 'vitamin-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'exercise-tracker',
    title: '운동량 추적기',
    description: '산책 거리, 운동 시간, 활동량을 기록하고 분석',
    icon: 'Activity',
    slug: 'exercise-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'medical-record',
    title: '건강 기록부',
    description: '진단 기록, 처방전, 건강 검진 결과를 디지털로 관리',
    icon: 'FileText',
    slug: 'medical-record',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'allergy-checker',
    title: '알레르기 체크리스트',
    description: '음식, 환경 알레르기 증상 체크 및 피해야 할 항목 관리',
    icon: 'AlertCircle',
    slug: 'allergy-checker',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'weight-growth-tracker',
    title: '체중 성장 추적기',
    description: '강아지 성장 과정의 체중 변화를 추적하고 그래프로 표시',
    icon: 'TrendingUp',
    slug: 'weight-growth-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'socialization-guide',
    title: '사회화 가이드',
    description: '강아지 사회화 단계별 접근 방법과 훈련 가이드',
    icon: 'Users',
    slug: 'socialization-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'first-visit-guide',
    title: '첫 방문 가이드',
    description: '새로운 장소(병원, 카페, 공원) 첫 방문 시 준비사항 체크리스트',
    icon: 'Map',
    slug: 'first-visit-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'birthday-planner',
    title: '반려견 생일 파티 플래너',
    description: '생일 파티 준비물, 케이크 레시피, 게임 아이디어 제공',
    icon: 'Gift',
    slug: 'birthday-planner',
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

