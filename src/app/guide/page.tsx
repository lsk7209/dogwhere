'use client'

import { BookOpen, Heart, Shield, Car, Plane, Home, Utensils, PawPrint, Camera, MapPin, Calendar, Users, Star, Scissors, Activity, Brain, Apple, Baby, Stethoscope, GraduationCap, Zap, Coffee, Music, Gamepad2, Palette, Dumbbell, TreePine, Sun, Moon, Wind, Thermometer, Droplets, Sparkles, Target, Award, Gift, Clock, Compass, Map, Navigation, Puzzle } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function GuidePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'alpha' | 'default'>('default')
  const guidesPerPage = 9

  const guideCategories = [
    {
      icon: <Car className="w-8 h-8 text-blue-500" />,
      title: '교통편 이용 가이드',
      description: '강아지와 함께 대중교통을 이용하는 방법',
      items: ['지하철 이용법', '버스 이용법', '택시 이용법', '자가용 여행'],
      slug: 'dog-travel-transport-guide'
    },
    {
      icon: <Home className="w-8 h-8 text-green-500" />,
      title: '숙소 선택 가이드',
      description: '강아지 동반 가능한 숙소를 선택하는 방법',
      items: ['호텔 선택 기준', '펜션 예약 팁', '글램핑 준비물', '숙소 예약 시 주의사항'],
      slug: 'dog-accommodation-guide'
    },
    {
      icon: <Utensils className="w-8 h-8 text-orange-500" />,
      title: '식사 및 간식',
      description: '여행 중 강아지 식사 관리 방법',
      items: ['여행용 사료 준비', '간식 선택법', '급수 관리', '식사 시간 조절'],
      slug: 'dog-meal-travel-guide'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: '안전 관리',
      description: '여행 중 강아지 안전을 지키는 방법',
      items: ['응급처치법', '안전장비 준비', '위험 요소 파악', '응급 연락처'],
      slug: 'dog-safety-travel-guide'
    },
    {
      icon: <PawPrint className="w-8 h-8 text-purple-500" />,
      title: '건강 관리',
      description: '여행 중 강아지 건강 관리 방법',
      items: ['건강 체크리스트', '예방접종 확인', '스트레스 관리', '운동량 조절'],
      slug: 'dog-health-travel-guide'
    },
    {
      icon: <Plane className="w-8 h-8 text-cyan-500" />,
      title: '해외여행 준비',
      description: '강아지와 함께하는 해외여행 준비사항',
      items: ['여권 및 서류', '항공편 예약', '검역 절차', '현지 규정 확인'],
      slug: 'dog-international-travel-guide'
    },
    {
      icon: <Camera className="w-8 h-8 text-pink-500" />,
      title: '여행 사진 촬영',
      description: '강아지와 함께하는 완벽한 여행 사진 촬영법',
      items: ['사진 촬영 팁', '자연스러운 포즈', '조명 활용법', '인스타그램 업로드'],
      slug: 'dog-travel-photography-guide'
    },
    {
      icon: <MapPin className="w-8 h-8 text-indigo-500" />,
      title: '지역별 여행지',
      description: '전국 강아지 동반 추천 여행지 가이드',
      items: ['서울 추천 코스', '제주도 여행지', '강원도 자연여행', '경상도 해안여행'],
      slug: 'dog-regional-travel-guide'
    },
    {
      icon: <Calendar className="w-8 h-8 text-teal-500" />,
      title: '계절별 여행',
      description: '계절에 따른 강아지 여행 준비사항',
      items: ['봄 여행 준비', '여름 더위 대비', '가을 단풍 여행', '겨울 추위 대비'],
      slug: 'dog-seasonal-travel-guide'
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: '가족 여행',
      description: '강아지와 아이들이 함께하는 가족 여행 가이드',
      items: ['아이와 강아지 동반', '가족 여행 준비물', '안전 수칙', '추억 만들기'],
      slug: 'dog-family-travel-guide'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: '특별한 경험',
      description: '강아지와 함께하는 특별하고 의미있는 여행 경험',
      items: ['펫 페스티벌 참여', '자원봉사 활동', '강아지 카페 투어', '특별한 기념일'],
      slug: 'dog-special-experience-guide'
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: '사회화 훈련',
      description: '강아지 사회화 훈련 방법',
      items: ['기본 사회화 환경', '사람들과의 사회화', '다른 동물들과의 사회화', '지속적인 사회화'],
      slug: 'dog-socialization-guide'
    },
    {
      icon: <Scissors className="w-8 h-8 text-pink-500" />,
      title: '그루밍 관리',
      description: '강아지 그루밍 및 관리 방법',
      items: ['일상 브러싱', '목욕 및 샴푸', '발톱 관리', '정기적인 그루밍'],
      slug: 'dog-grooming-guide'
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-500" />,
      title: '운동 및 활동',
      description: '강아지 운동 및 활동 방법',
      items: ['일상 산책', '실내 놀이 활동', '훈련과 함께하는 운동', '정기적인 운동'],
      slug: 'dog-exercise-guide'
    },
    {
      icon: <Brain className="w-8 h-8 text-amber-500" />,
      title: '행동 이해 및 교정',
      description: '강아지 행동 이해 및 교정 방법',
      items: ['행동 관찰 및 분석', '문제 행동 원인 파악', '행동 교정 방법 적용', '지속적인 교정'],
      slug: 'dog-behavior-guide'
    },
    {
      icon: <Apple className="w-8 h-8 text-lime-500" />,
      title: '영양 및 사료 선택',
      description: '강아지 영양 및 사료 선택 방법',
      items: ['필수 영양소 이해', '사료 선택 및 구매', '급여 방법 및 관리', '지속적인 영양 관리'],
      slug: 'dog-nutrition-guide'
    },
    {
      icon: <Baby className="w-8 h-8 text-pink-500" />,
      title: '퍼피 케어',
      description: '새끼 강아지 돌보기 완벽 가이드',
      items: ['퍼피 기본 케어', '예방접종 일정', '사회화 훈련', '퍼피 사료 관리'],
      slug: 'puppy-care-guide'
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-red-500" />,
      title: '응급처치',
      description: '강아지 응급상황 대처법',
      items: ['응급처치 기본', '중독 대처법', '상처 치료', '응급 연락처'],
      slug: 'dog-emergency-guide'
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: '고급 훈련',
      description: '강아지 고급 훈련 기법',
      items: ['고급 명령어', '문제 행동 교정', '사회화 훈련', '특수 훈련'],
      slug: 'dog-advanced-training-guide'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: '에너지 관리',
      description: '강아지 에너지와 활동량 관리',
      items: ['에너지 발산법', '실내 운동', '정신적 자극', '피로 관리'],
      slug: 'dog-energy-management-guide'
    },
    {
      icon: <Coffee className="w-8 h-8 text-amber-600" />,
      title: '카페 문화',
      description: '강아지와 함께하는 카페 문화',
      items: ['펫프렌들리 카페', '카페 매너', '카페 선택법', '카페 활동'],
      slug: 'dog-cafe-culture-guide'
    },
    {
      icon: <Music className="w-8 h-8 text-purple-500" />,
      title: '음악과 소리 치료',
      description: '강아지의 정서 안정을 위한 음악과 소리 치료법',
      items: ['진정 음악 선택', '소리 공포증 대처', '음악 치료법', '소리 환경 조성'],
      slug: 'dog-music-therapy-guide'
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-green-500" />,
      title: '인터랙티브 놀이',
      description: '강아지와 함께하는 인터랙티브 놀이와 게임',
      items: ['퍼즐 장난감', '인터랙티브 게임', '두뇌 자극 놀이', '문제 해결 놀이'],
      slug: 'dog-interactive-play-guide'
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: '창의적 활동',
      description: '강아지와 함께하는 창의적 활동과 예술',
      items: ['펫 아트 만들기', '사진 촬영 기법', '창의적 놀이', '예술 활동'],
      slug: 'dog-creative-activities-guide'
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
      title: '체력 단련',
      description: '강아지 체력 향상과 근력 강화 운동법',
      items: ['근력 운동', '지구력 훈련', '체력 측정', '운동 계획 수립'],
      slug: 'dog-fitness-training-guide'
    },
    {
      icon: <TreePine className="w-8 h-8 text-green-600" />,
      title: '자연 친화 활동',
      description: '강아지와 함께하는 자연 친화적 활동',
      items: ['자연 탐험', '야외 활동', '환경 보호', '자연 학습'],
      slug: 'dog-nature-activities-guide'
    },
    {
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      title: '일광욕과 비타민 D',
      description: '강아지 건강을 위한 일광욕과 비타민 D 관리',
      items: ['일광욕 방법', '비타민 D 중요성', '자외선 보호', '건강한 햇빛 노출'],
      slug: 'dog-sunlight-therapy-guide'
    },
    {
      icon: <Moon className="w-8 h-8 text-indigo-500" />,
      title: '수면 패턴 관리',
      description: '강아지 건강한 수면 패턴과 수면 환경 조성',
      items: ['수면 환경 조성', '수면 패턴 관리', '수면 질 향상', '수면 문제 해결'],
      slug: 'dog-sleep-management-guide'
    },
    {
      icon: <Wind className="w-8 h-8 text-cyan-500" />,
      title: '호흡기 건강 관리',
      description: '강아지 호흡기 건강과 공기 질 관리',
      items: ['호흡기 건강 체크', '공기 질 관리', '호흡 운동', '호흡기 질환 예방'],
      slug: 'dog-respiratory-health-guide'
    },
    {
      icon: <Thermometer className="w-8 h-8 text-red-500" />,
      title: '체온 관리',
      description: '강아지 체온 측정과 체온 관리 방법',
      items: ['체온 측정법', '정상 체온 범위', '체온 이상 대처', '체온 관리 도구'],
      slug: 'dog-temperature-management-guide'
    },
    {
      icon: <Droplets className="w-8 h-8 text-blue-400" />,
      title: '수분 섭취 관리',
      description: '강아지 적절한 수분 섭취와 탈수 예방',
      items: ['수분 섭취량 관리', '탈수 증상 파악', '급수 방법', '수분 보충'],
      slug: 'dog-hydration-management-guide'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      title: '정신 건강 관리',
      description: '강아지 정신 건강과 스트레스 관리',
      items: ['스트레스 신호 파악', '정신 건강 관리', '불안 완화법', '정신적 자극'],
      slug: 'dog-mental-health-guide'
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: '목표 설정과 성취',
      description: '강아지 훈련 목표 설정과 성취 관리',
      items: ['목표 설정 방법', '단계별 훈련', '성취 측정', '동기 부여'],
      slug: 'dog-goal-setting-guide'
    },
    {
      icon: <Award className="w-8 h-8 text-gold-500" />,
      title: '보상 시스템',
      description: '강아지 효과적인 보상과 강화 시스템',
      items: ['보상 종류', '보상 시기', '강화 방법', '보상 효과 극대화'],
      slug: 'dog-reward-system-guide'
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-400" />,
      title: '선물과 장난감',
      description: '강아지에게 적합한 선물과 장난감 선택법',
      items: ['장난감 선택 기준', '안전한 장난감', '장난감 관리', '선물 아이디어'],
      slug: 'dog-toys-gifts-guide'
    },
    {
      icon: <Clock className="w-8 h-8 text-gray-500" />,
      title: '일상 루틴 관리',
      description: '강아지 건강한 일상 루틴과 시간 관리',
      items: ['일상 루틴 설정', '시간 관리', '규칙적인 생활', '루틴 변화 대응'],
      slug: 'dog-daily-routine-guide'
    },
    {
      icon: <Compass className="w-8 h-8 text-teal-500" />,
      title: '방향 감각 훈련',
      description: '강아지 방향 감각과 공간 인식 능력 향상',
      items: ['방향 감각 훈련', '공간 인식', '길 찾기 훈련', '방향 감각 테스트'],
      slug: 'dog-direction-training-guide'
    },
    {
      icon: <Map className="w-8 h-8 text-brown-500" />,
      title: '지리 학습',
      description: '강아지와 함께하는 지리 학습과 탐험',
      items: ['지리 학습법', '지도 활용', '지역 탐험', '지리적 지식'],
      slug: 'dog-geography-learning-guide'
    },
    {
      icon: <Navigation className="w-8 h-8 text-navy-500" />,
      title: '내비게이션 훈련',
      description: '강아지 내비게이션과 길 찾기 능력 개발',
      items: ['내비게이션 훈련', '길 찾기 기술', '방향 지시', '내비게이션 도구'],
      slug: 'dog-navigation-training-guide'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-400" />,
      title: '감정 표현과 소통',
      description: '강아지의 감정을 이해하고 효과적으로 소통하는 방법',
      items: ['감정 신호 파악', '소통 방법', '감정 표현 훈련', '관계 개선'],
      slug: 'dog-emotion-communication-guide'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: '면역력 강화',
      description: '강아지 면역력 향상과 질병 예방 방법',
      items: ['면역력 강화법', '예방접종 관리', '건강한 생활습관', '질병 예방'],
      slug: 'dog-immunity-boost-guide'
    },
    {
      icon: <Activity className="w-8 h-8 text-green-400" />,
      title: '유산소 운동',
      description: '강아지 심폐 기능 향상을 위한 유산소 운동법',
      items: ['유산소 운동 종류', '운동 강도 조절', '심폐 기능 향상', '운동 계획'],
      slug: 'dog-cardio-exercise-guide'
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: '인지 능력 향상',
      description: '강아지 인지 능력과 학습 능력 개발',
      items: ['인지 훈련법', '학습 능력 향상', '기억력 강화', '문제 해결 능력'],
      slug: 'dog-cognitive-enhancement-guide'
    },
    {
      icon: <Apple className="w-8 h-8 text-green-500" />,
      title: '식이 요법과 다이어트',
      description: '강아지 체중 관리와 건강한 식이 요법',
      items: ['체중 관리', '다이어트 계획', '건강한 식단', '칼로리 관리'],
      slug: 'dog-diet-therapy-guide'
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-red-600" />,
      title: '예방 의학',
      description: '강아지 질병 예방과 건강 관리',
      items: ['정기 검진', '예방 접종', '건강 체크', '질병 조기 발견'],
      slug: 'dog-preventive-medicine-guide'
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: '다중 반려동물 관리',
      description: '여러 마리 강아지와 함께 살아가는 방법',
      items: ['다중 반려동물 환경', '갈등 해결', '개별 관리', '집단 생활'],
      slug: 'dog-multi-pet-management-guide'
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-700" />,
      title: '전문 훈련 기법',
      description: '강아지 전문 훈련과 특수 기술 습득',
      items: ['전문 훈련법', '특수 기술', '고급 명령어', '전문가 훈련'],
      slug: 'dog-professional-training-guide'
    },
    {
      icon: <Clock className="w-8 h-8 text-gray-600" />,
      title: '노령견 케어',
      description: '노령견을 위한 특별한 케어와 관리법',
      items: ['노령견 특성', '특별 케어법', '건강 관리', '생활 환경 조성'],
      slug: 'dog-senior-care-guide'
    },
    {
      icon: <Music className="w-8 h-8 text-purple-500" />,
      title: '강아지 음악치료',
      description: '음악을 활용한 강아지 스트레스 해소와 정서 안정',
      items: ['음악 선호도 파악', '진정 음악 활용', '소리 공포증 치료', '음악 환경 조성'],
      slug: 'dog-music-therapy-guide'
    },
    {
      icon: <Puzzle className="w-8 h-8 text-indigo-500" />,
      title: '인터랙티브 놀이',
      description: '뇌 발달을 위한 상호작용 놀이와 퍼즐 게임',
      items: ['퍼즐 장난감', '인터랙티브 게임', '뇌 자극 활동', '문제 해결 능력'],
      slug: 'dog-interactive-play-guide'
    },
    {
      icon: <Palette className="w-8 h-8 text-rose-500" />,
      title: '창의적 활동',
      description: '강아지와 함께하는 예술 활동과 창의적 놀이',
      items: ['펫 아트', '사진 촬영', '창작 활동', '표현력 향상'],
      slug: 'dog-creative-activities-guide'
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-orange-500" />,
      title: '체력 단련',
      description: '강아지의 신체 발달과 근력 강화를 위한 운동',
      items: ['근력 운동', '체력 향상', '근육 발달', '지구력 강화'],
      slug: 'dog-fitness-training-guide'
    },
    {
      icon: <TreePine className="w-8 h-8 text-green-600" />,
      title: '자연 친화 활동',
      description: '자연 환경에서의 안전한 활동과 환경 보호',
      items: ['자연 탐험', '환경 보호', '자연 학습', '생태 교육'],
      slug: 'dog-nature-activities-guide'
    },
    {
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      title: '햇빛 치료',
      description: '적절한 일광욕과 비타민 D 관리법',
      items: ['일광욕 방법', '비타민 D', '자외선 관리', '피부 건강'],
      slug: 'dog-sunlight-therapy-guide'
    },
    {
      icon: <Moon className="w-8 h-8 text-slate-500" />,
      title: '수면 관리',
      description: '건강한 수면 패턴과 숙면 환경 조성',
      items: ['수면 패턴', '숙면 환경', '수면 질 향상', '휴식 관리'],
      slug: 'dog-sleep-management-guide'
    },
    {
      icon: <Wind className="w-8 h-8 text-cyan-500" />,
      title: '호흡 건강',
      description: '호흡기 건강 관리와 공기질 개선',
      items: ['호흡기 관리', '공기질 개선', '호흡 운동', '환경 정화'],
      slug: 'dog-respiratory-health-guide'
    },
    {
      icon: <Thermometer className="w-8 h-8 text-red-500" />,
      title: '체온 관리',
      description: '강아지 체온 측정과 온도 관리법',
      items: ['체온 측정', '온도 관리', '열사병 예방', '저체온 방지'],
      slug: 'dog-temperature-management-guide'
    },
    {
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      title: '수분 관리',
      description: '적절한 수분 섭취와 탈수 예방',
      items: ['수분 섭취', '탈수 예방', '수질 관리', '건강한 수분'],
      slug: 'dog-hydration-management-guide'
    }
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let base = guideCategories
    if (q) {
      base = base.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q) ||
        g.items.some((it: string) => it.toLowerCase().includes(q))
      )
    }
    const sorted = [...base]
    if (sort === 'alpha') sorted.sort((a: any, b: any) => a.title.localeCompare(b.title))
    return sorted
  }, [guideCategories, query, sort])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / guidesPerPage)
  const startIndex = (currentPage - 1) * guidesPerPage
  const endIndex = startIndex + guidesPerPage
  const currentGuides = filtered.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              반려가이드 📚
            </h1>
            <p className="text-xl text-gray-600">
              강아지와 함께하는 완벽한 여행을 위한 모든 가이드
            </p>
          </div>

          {/* 검색/정렬 */}
          <div className="max-w-4xl mx-auto mb-8">
            <input
              value={query}
              onChange={(e)=>{ setQuery(e.target.value); setCurrentPage(1) }}
              placeholder="가이드 검색 (예: 여행, 사회화, 응급, 영양, 수면)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">정렬:</label>
                <select
                  value={sort}
                  onChange={(e)=>{ setSort(e.target.value as any); setCurrentPage(1) }}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                >
                  <option value="default">추천순</option>
                  <option value="alpha">가나다순</option>
                </select>
              </div>
              <span className="text-sm text-gray-500">총 {filtered.length}개</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentGuides.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/guide/${category.slug}`} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center">
                  가이드 보기
                </Link>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </nav>
            </div>
          )}

          {/* 추가 정보 섹션 */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                더 많은 정보가 필요하신가요?
              </h2>
              <p className="text-gray-600">
                강아지와 함께하는 여행에 대한 모든 궁금증을 해결해드립니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">상세 가이드</h3>
                <p className="text-gray-600 text-sm">
                  각 카테고리별 상세한 가이드와 팁을 제공합니다
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">전문가 조언</h3>
                <p className="text-gray-600 text-sm">
                  수의사와 반려동물 전문가의 조언을 받아보세요
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">안전 우선</h3>
                <p className="text-gray-600 text-sm">
                  강아지의 안전과 건강을 최우선으로 고려합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
