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
  },
  {
    id: 'sleep-pattern-tracker',
    title: '수면 패턴 추적기',
    description: '강아지의 수면 시간과 패턴을 기록하고 분석',
    icon: 'Moon',
    slug: 'sleep-pattern-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'behavior-logger',
    title: '행동 일지 작성기',
    description: '강아지의 일상 행동을 기록하고 패턴 분석',
    icon: 'BookOpen',
    slug: 'behavior-logger',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'mood-tracker',
    title: '기분 상태 추적기',
    description: '강아지의 기분과 감정 상태를 일일 기록',
    icon: 'Smile',
    slug: 'mood-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'water-intake-calculator',
    title: '수분 섭취량 계산기',
    description: '체중과 활동량에 따른 적정 수분 섭취량 계산',
    icon: 'Droplets',
    slug: 'water-intake-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'toy-rotation-planner',
    title: '장난감 로테이션 플래너',
    description: '장난감을 순환하며 사용하는 계획 수립',
    icon: 'Gamepad2',
    slug: 'toy-rotation-planner',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'grooming-schedule',
    title: '미용 일정 관리자',
    description: '털 관리, 목욕, 발톱 관리 일정을 체계적으로 관리',
    icon: 'Scissors',
    slug: 'grooming-schedule',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'temperature-monitor',
    title: '체온 모니터링기',
    description: '강아지의 체온을 정기적으로 측정하고 기록',
    icon: 'Thermometer',
    slug: 'temperature-monitor',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'playtime-calculator',
    title: '놀이 시간 계산기',
    description: '연령과 견종에 따른 적정 놀이 시간 계산',
    icon: 'Play',
    slug: 'playtime-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'safety-checklist',
    title: '안전 체크리스트',
    description: '집안 안전사항을 정기적으로 점검하고 관리',
    icon: 'Shield',
    slug: 'safety-checklist',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'noise-desensitization',
    title: '소음 적응 훈련 가이드',
    description: '소음 공포증 극복을 위한 단계별 훈련 방법',
    icon: 'Volume2',
    slug: 'noise-desensitization',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'separation-anxiety-guide',
    title: '분리불안 극복 가이드',
    description: '분리불안 증상 완화를 위한 훈련과 관리법',
    icon: 'Heart',
    slug: 'separation-anxiety-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'senior-care-planner',
    title: '노령견 케어 플래너',
    description: '노령견을 위한 특별한 케어 계획 수립',
    icon: 'Clock',
    slug: 'senior-care-planner',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'puppy-milestone-tracker',
    title: '강아지 성장 단계 추적기',
    description: '강아지의 성장 단계별 발달 상황 추적',
    icon: 'TrendingUp',
    slug: 'puppy-milestone-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'weather-activity-planner',
    title: '날씨별 활동 플래너',
    description: '날씨에 따른 적절한 활동 계획 수립',
    icon: 'Cloud',
    slug: 'weather-activity-planner',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'multi-pet-scheduler',
    title: '다중 반려동물 일정 관리',
    description: '여러 마리 반려동물의 일정을 통합 관리',
    icon: 'Users',
    slug: 'multi-pet-scheduler',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'enrichment-activities',
    title: '환경 풍부화 활동 가이드',
    description: '강아지의 정신적 자극을 위한 다양한 활동 제안',
    icon: 'Puzzle',
    slug: 'enrichment-activities',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'emergency-contacts',
    title: '응급 연락처 관리',
    description: '응급상황 시 필요한 연락처를 체계적으로 관리',
    icon: 'Phone',
    slug: 'emergency-contacts',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'health-symptom-tracker',
    title: '건강 증상 추적기',
    description: '건강 관련 증상과 변화를 상세히 기록',
    icon: 'Activity',
    slug: 'health-symptom-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'training-progress-tracker',
    title: '훈련 진도 추적기',
    description: '각종 훈련의 진도와 성과를 체계적으로 추적',
    icon: 'Target',
    slug: 'training-progress-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'socialization-progress',
    title: '사회화 진도 추적기',
    description: '사회화 훈련의 단계별 진도와 성과 추적',
    icon: 'UserPlus',
    slug: 'socialization-progress',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'puppy-potty-training',
    title: '강아지 배변 훈련 가이드',
    description: '강아지 배변 훈련 단계별 방법과 팁 제공',
    icon: 'Home',
    slug: 'puppy-potty-training',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-nutrition-planner',
    title: '영양 관리 플래너',
    description: '견종과 연령에 맞는 영양 균형 식단 계획',
    icon: 'Apple',
    slug: 'dog-nutrition-planner',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'behavior-problem-solver',
    title: '문제 행동 해결 가이드',
    description: '짖음, 물기, 파괴 행동 등 문제 행동 해결 방법',
    icon: 'AlertTriangle',
    slug: 'behavior-problem-solver',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-photo-organizer',
    title: '반려견 사진 정리 도구',
    description: '반려견 사진을 날짜별, 이벤트별로 자동 분류',
    icon: 'Camera',
    slug: 'dog-photo-organizer',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'seasonal-care-guide',
    title: '계절별 케어 가이드',
    description: '봄, 여름, 가을, 겨울별 반려견 케어 방법',
    icon: 'Sun',
    slug: 'seasonal-care-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-toy-recommender',
    title: '장난감 추천 시스템',
    description: '견종과 연령에 맞는 장난감 추천',
    icon: 'Gamepad2',
    slug: 'dog-toy-recommender',
    category: 'finder',
    status: 'completed'
  },
  {
    id: 'puppy-socialization-schedule',
    title: '강아지 사회화 일정표',
    description: '강아지 사회화 단계별 일정과 체크리스트',
    icon: 'Calendar',
    slug: 'puppy-socialization-schedule',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-emergency-kit',
    title: '응급 키트 체크리스트',
    description: '반려견 응급상황 대비 필수품 체크리스트',
    icon: 'FirstAid',
    slug: 'dog-emergency-kit',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-walking-safety',
    title: '산책 안전 가이드',
    description: '산책 시 안전사항과 주의점 가이드',
    icon: 'Shield',
    slug: 'dog-walking-safety',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-feeding-schedule',
    title: '강아지 급여 일정표',
    description: '강아지 연령별 급여 횟수와 양 관리',
    icon: 'Clock',
    slug: 'puppy-feeding-schedule',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-sleep-environment',
    title: '수면 환경 최적화',
    description: '강아지 수면 환경 조성과 개선 방법',
    icon: 'Moon',
    slug: 'dog-sleep-environment',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-communication-guide',
    title: '반려견 소통 가이드',
    description: '강아지의 몸짓과 소리로 의사소통하는 방법',
    icon: 'MessageCircle',
    slug: 'dog-communication-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-exercise-routine',
    title: '운동 루틴 플래너',
    description: '견종별 맞춤 운동 루틴 계획',
    icon: 'Activity',
    slug: 'dog-exercise-routine',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-grooming-tools',
    title: '미용 도구 가이드',
    description: '견종별 필요한 미용 도구와 사용법',
    icon: 'Scissors',
    slug: 'dog-grooming-tools',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-vaccination-tracker',
    title: '강아지 예방접종 추적기',
    description: '강아지 예방접종 일정과 기록 관리',
    icon: 'Syringe',
    slug: 'puppy-vaccination-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-travel-checklist',
    title: '여행 준비 체크리스트',
    description: '반려견과 함께하는 여행 준비사항',
    icon: 'Luggage',
    slug: 'dog-travel-checklist',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-behavior-calendar',
    title: '행동 패턴 캘린더',
    description: '강아지 행동 패턴을 캘린더로 시각화',
    icon: 'Calendar',
    slug: 'dog-behavior-calendar',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'senior-dog-exercise',
    title: '노령견 운동 가이드',
    description: '노령견을 위한 안전한 운동 방법',
    icon: 'Activity',
    slug: 'senior-dog-exercise',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-nail-trimming',
    title: '발톱 관리 가이드',
    description: '강아지 발톱 자르기 방법과 주기',
    icon: 'Scissors',
    slug: 'dog-nail-trimming',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-crate-training',
    title: '켄넬 훈련 가이드',
    description: '강아지 켄넬 적응 훈련 방법',
    icon: 'Home',
    slug: 'puppy-crate-training',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-weather-adaptation',
    title: '날씨 적응 가이드',
    description: '다양한 날씨 조건에서의 반려견 관리',
    icon: 'Cloud',
    slug: 'dog-weather-adaptation',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-social-skills',
    title: '사회성 기술 훈련',
    description: '다른 강아지와 사람과의 사회성 향상',
    icon: 'Users',
    slug: 'dog-social-skills',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-sleep-training',
    title: '강아지 수면 훈련',
    description: '강아지의 규칙적인 수면 패턴 형성',
    icon: 'Moon',
    slug: 'puppy-sleep-training',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-medication-tracker',
    title: '투약 관리 추적기',
    description: '약물 투여 일정과 기록 관리',
    icon: 'Pill',
    slug: 'dog-medication-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-hygiene-routine',
    title: '위생 관리 루틴',
    description: '일상적인 위생 관리 방법과 주기',
    icon: 'Droplets',
    slug: 'dog-hygiene-routine',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-biting-guide',
    title: '강아지 물기 훈련',
    description: '강아지의 물기 습관 교정 방법',
    icon: 'AlertTriangle',
    slug: 'puppy-biting-guide',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-stress-relief',
    title: '스트레스 해소 방법',
    description: '반려견 스트레스 완화와 휴식 방법',
    icon: 'Heart',
    slug: 'dog-stress-relief',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-aging-care',
    title: '노화 관리 가이드',
    description: '노령견의 노화 과정과 케어 방법',
    icon: 'Clock',
    slug: 'dog-aging-care',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'puppy-development-milestones',
    title: '강아지 발달 단계',
    description: '강아지 성장 단계별 발달 특징과 주의사항',
    icon: 'TrendingUp',
    slug: 'puppy-development-milestones',
    category: 'guide',
    status: 'completed'
  },
  {
    id: 'dog-anxiety-tracker',
    title: '불안 증상 추적기',
    description: '강아지의 불안 증상과 패턴을 기록하고 분석',
    icon: 'AlertCircle',
    slug: 'dog-anxiety-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-allergy-tracker',
    title: '알레르기 증상 추적기',
    description: '음식, 환경 알레르기 증상을 상세히 기록하고 관리',
    icon: 'Zap',
    slug: 'dog-allergy-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-sleep-quality-tracker',
    title: '수면 품질 추적기',
    description: '강아지의 수면 품질과 패턴을 분석하여 건강 상태 파악',
    icon: 'Moon',
    slug: 'dog-sleep-quality-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-appetite-tracker',
    title: '식욕 변화 추적기',
    description: '강아지의 식욕 변화를 기록하여 건강 상태 모니터링',
    icon: 'Utensils',
    slug: 'dog-appetite-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-energy-level-tracker',
    title: '활력 수준 추적기',
    description: '강아지의 에너지 레벨과 활동량을 일일 기록',
    icon: 'Battery',
    slug: 'dog-energy-level-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-social-interaction-tracker',
    title: '사회적 상호작용 추적기',
    description: '다른 강아지, 사람과의 상호작용을 기록하고 분석',
    icon: 'Users',
    slug: 'dog-social-interaction-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-training-session-tracker',
    title: '훈련 세션 추적기',
    description: '각종 훈련 세션의 진행 상황과 성과를 상세히 기록',
    icon: 'Target',
    slug: 'dog-training-session-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-grooming-session-tracker',
    title: '미용 세션 추적기',
    description: '목욕, 빗질, 발톱 관리 등 미용 세션을 기록하고 관리',
    icon: 'Scissors',
    slug: 'dog-grooming-session-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-vet-visit-tracker',
    title: '병원 방문 추적기',
    description: '동물병원 방문 기록과 진료 내용을 체계적으로 관리',
    icon: 'Stethoscope',
    slug: 'dog-vet-visit-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-medication-schedule',
    title: '투약 일정 관리',
    description: '약물 투여 일정과 복용 기록을 체계적으로 관리',
    icon: 'Pill',
    slug: 'dog-medication-schedule',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-exercise-intensity-tracker',
    title: '운동 강도 추적기',
    description: '산책, 놀이 등 운동의 강도와 지속 시간을 기록',
    icon: 'Activity',
    slug: 'dog-exercise-intensity-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-weather-adaptation-tracker',
    title: '날씨 적응 추적기',
    description: '다양한 날씨 조건에서의 강아지 반응과 적응도를 기록',
    icon: 'Cloud',
    slug: 'dog-weather-adaptation-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-toy-preference-tracker',
    title: '장난감 선호도 추적기',
    description: '강아지가 선호하는 장난감과 놀이 방식을 분석',
    icon: 'Gamepad2',
    slug: 'dog-toy-preference-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-sleep-environment-tracker',
    title: '수면 환경 추적기',
    description: '수면 환경의 변화와 강아지 반응을 기록하고 분석',
    icon: 'Home',
    slug: 'dog-sleep-environment-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-feeding-behavior-tracker',
    title: '급식 행동 추적기',
    description: '급식 시간, 양, 행동 패턴을 기록하여 건강 상태 파악',
    icon: 'Utensils',
    slug: 'dog-feeding-behavior-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-stress-level-tracker',
    title: '스트레스 레벨 추적기',
    description: '일일 스트레스 지수와 원인을 기록하여 관리',
    icon: 'Heart',
    slug: 'dog-stress-level-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-socialization-milestone-tracker',
    title: '사회화 마일스톤 추적기',
    description: '사회화 훈련의 단계별 성취도를 기록하고 관리',
    icon: 'UserPlus',
    slug: 'dog-socialization-milestone-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-health-vital-signs-tracker',
    title: '건강 바이탈 사인 추적기',
    description: '체온, 심박수, 호흡수 등 기본 생체 신호를 기록',
    icon: 'HeartPulse',
    slug: 'dog-health-vital-signs-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-behavioral-change-tracker',
    title: '행동 변화 추적기',
    description: '강아지의 행동 변화와 패턴을 상세히 기록하고 분석',
    icon: 'TrendingUp',
    slug: 'dog-behavioral-change-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'dog-environmental-enrichment-tracker',
    title: '환경 풍부화 추적기',
    description: '환경 풍부화 활동의 효과와 강아지 반응을 기록',
    icon: 'Puzzle',
    slug: 'dog-environmental-enrichment-tracker',
    category: 'planner',
    status: 'completed'
  },
  {
    id: 'bmi-calculator',
    title: '반려견 체질량지수(BMI) 계산기',
    description: '체중과 신장을 입력하여 BMI를 계산하고 건강 상태를 확인',
    icon: 'Scale',
    slug: 'bmi-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'daily-calorie-burn-calculator',
    title: '일일 칼로리 소모량 계산기',
    description: '활동량과 체중 기반 일일 칼로리 소모량 계산',
    icon: 'Flame',
    slug: 'daily-calorie-burn-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'protein-requirement-calculator',
    title: '단백질 필요량 계산기',
    description: '견종과 체중에 따른 일일 단백질 필요량 계산',
    icon: 'Beef',
    slug: 'protein-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'fat-intake-calculator',
    title: '지방 섭취량 계산기',
    description: '건강 상태에 따른 적정 지방 섭취량 계산',
    icon: 'Droplet',
    slug: 'fat-intake-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'carbohydrate-requirement-calculator',
    title: '탄수화물 필요량 계산기',
    description: '활동량 기반 탄수화물 필요량 계산',
    icon: 'Wheat',
    slug: 'carbohydrate-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'fiber-requirement-calculator',
    title: '식이섬유 권장량 계산기',
    description: '소화 건강을 위한 식이섬유 권장량 계산',
    icon: 'Leaf',
    slug: 'fiber-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'calcium-requirement-calculator',
    title: '칼슘 필요량 계산기',
    description: '성장 단계별 칼슘 필요량 계산',
    icon: 'Bone',
    slug: 'calcium-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'phosphorus-requirement-calculator',
    title: '인 필요량 계산기',
    description: '골격 건강을 위한 인 필요량 계산',
    icon: 'Atom',
    slug: 'phosphorus-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'omega3-requirement-calculator',
    title: '오메가-3 필요량 계산기',
    description: '피부 건강을 위한 오메가-3 필요량 계산',
    icon: 'Fish',
    slug: 'omega3-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'treat-calorie-calculator',
    title: '간식 칼로리 계산기',
    description: '간식의 칼로리를 계산하여 일일 칼로리에 포함',
    icon: 'Cookie',
    slug: 'treat-calorie-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'food-transition-calculator',
    title: '사료 전환 계산기',
    description: '사료 변경 시 점진적 전환 비율 계산',
    icon: 'RefreshCw',
    slug: 'food-transition-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'meal-frequency-calculator',
    title: '식사 횟수 계산기',
    description: '연령과 건강 상태에 따른 적정 식사 횟수 계산',
    icon: 'Clock',
    slug: 'meal-frequency-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'feeding-adjustment-calculator',
    title: '급여량 조정 계산기',
    description: '체중 변화에 따른 급여량 조정 계산',
    icon: 'TrendingUp',
    slug: 'feeding-adjustment-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'vaccination-schedule-calculator',
    title: '예방접종 일정 계산기',
    description: '다음 예방접종일과 일정 계산',
    icon: 'Syringe',
    slug: 'vaccination-schedule-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'deworming-schedule-calculator',
    title: '구충제 투여 주기 계산기',
    description: '구충제 투여 주기와 다음 투여일 계산',
    icon: 'Pill',
    slug: 'deworming-schedule-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'nail-trimming-schedule-calculator',
    title: '발톱 자르기 주기 계산기',
    description: '발톱 자르기 주기와 다음 시기 계산',
    icon: 'Scissors',
    slug: 'nail-trimming-schedule-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'daily-exercise-calculator',
    title: '일일 운동량 계산기',
    description: '견종과 연령에 따른 일일 운동량 계산',
    icon: 'Activity',
    slug: 'daily-exercise-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'walking-distance-calculator',
    title: '산책 거리 계산기',
    description: '적정 산책 거리와 시간 계산',
    icon: 'MapPin',
    slug: 'walking-distance-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'exercise-intensity-calculator',
    title: '운동 강도 계산기',
    description: '현재 운동 강도와 적정 강도 계산',
    icon: 'Gauge',
    slug: 'exercise-intensity-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'recovery-time-calculator',
    title: '회복 시간 계산기',
    description: '운동 후 필요한 회복 시간 계산',
    icon: 'Clock',
    slug: 'recovery-time-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'growth-rate-calculator',
    title: '성장 속도 계산기',
    description: '강아지의 성장 속도와 예상 성체 크기 계산',
    icon: 'TrendingUp',
    slug: 'growth-rate-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'expected-adult-weight-calculator',
    title: '예상 성체 체중 계산기',
    description: '현재 체중과 나이로 성체 체중 예측',
    icon: 'Scale',
    slug: 'expected-adult-weight-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'food-cost-calculator',
    title: '사료 비용 계산기',
    description: '사료 종류별 월간 비용 계산',
    icon: 'DollarSign',
    slug: 'food-cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'vet-cost-calculator',
    title: '병원비 계산기',
    description: '예방접종, 검진 등 병원비 예상 계산',
    icon: 'Stethoscope',
    slug: 'vet-cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'grooming-cost-calculator',
    title: '미용비 계산기',
    description: '미용 주기별 연간 비용 계산',
    icon: 'Scissors',
    slug: 'grooming-cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'pet-insurance-calculator',
    title: '보험료 계산기',
    description: '반려동물 보험료 계산',
    icon: 'Shield',
    slug: 'pet-insurance-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'travel-cost-calculator',
    title: '여행 비용 계산기',
    description: '강아지 동반 여행 비용 계산',
    icon: 'Plane',
    slug: 'travel-cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'lifetime-cost-calculator',
    title: '생애 총 비용 계산기',
    description: '강아지 생애 전체 예상 비용 계산',
    icon: 'DollarSign',
    slug: 'lifetime-cost-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'training-progress-calculator',
    title: '훈련 진도 계산기',
    description: '훈련 진도와 다음 단계 계산',
    icon: 'Target',
    slug: 'training-progress-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'socialization-progress-calculator',
    title: '사회화 진도 계산기',
    description: '사회화 훈련 진도 평가',
    icon: 'Users',
    slug: 'socialization-progress-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'behavior-severity-calculator',
    title: '문제 행동 심각도 계산기',
    description: '문제 행동의 심각도 평가',
    icon: 'AlertTriangle',
    slug: 'behavior-severity-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'training-effect-calculator',
    title: '훈련 효과 계산기',
    description: '훈련의 효과와 개선도 계산',
    icon: 'TrendingUp',
    slug: 'training-effect-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'learning-ability-calculator',
    title: '학습 능력 계산기',
    description: '강아지의 학습 능력과 속도 평가',
    icon: 'Brain',
    slug: 'learning-ability-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'water-intake-calculator',
    title: '물 섭취량 계산기',
    description: '일일 물 섭취량 계산',
    icon: 'Droplet',
    slug: 'water-intake-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'rest-time-calculator',
    title: '수면 시간 계산기',
    description: '적정 수면 시간 계산',
    icon: 'Moon',
    slug: 'rest-time-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'playtime-duration-calculator',
    title: '놀이 시간 계산기',
    description: '적정 놀이 시간 계산',
    icon: 'Gamepad2',
    slug: 'playtime-duration-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'toy-rotation-calculator',
    title: '장난감 교체 주기 계산기',
    description: '장난감 교체 주기와 일정 계산',
    icon: 'ToyBrick',
    slug: 'toy-rotation-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'enrichment-activity-calculator',
    title: '환경 풍부화 활동 계산기',
    description: '정신 자극 활동 계획 계산',
    icon: 'Sparkles',
    slug: 'enrichment-activity-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'emergency-supply-calculator',
    title: '비상용품 계산기',
    description: '비상 상황 대비 용품 계산',
    icon: 'AlertCircle',
    slug: 'emergency-supply-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'space-requirement-calculator',
    title: '생활 공간 계산기',
    description: '필요한 생활 공간 계산',
    icon: 'Home',
    slug: 'space-requirement-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'temperature-comfort-calculator',
    title: '온도 적정성 계산기',
    description: '현재 온도의 적정성 평가',
    icon: 'Thermometer',
    slug: 'temperature-comfort-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'breed-compatibility-calculator',
    title: '견종 적합도 계산기',
    description: '생활 방식에 맞는 견종 추천',
    icon: 'Heart',
    slug: 'breed-compatibility-calculator',
    category: 'calculator',
    status: 'completed'
  },
  {
    id: 'adoption-readiness-calculator',
    title: '입양 준비도 계산기',
    description: '반려견 입양 준비 상태 평가',
    icon: 'CheckCircle',
    slug: 'adoption-readiness-calculator',
    category: 'calculator',
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

