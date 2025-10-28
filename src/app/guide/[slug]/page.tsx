import { Metadata } from 'next'
import { ArrowLeft, Car, Clock, Shield, CheckCircle, AlertCircle, Star, BookOpen, Home, Utensils, PawPrint, Plane, Heart, Camera, MapPin, Calendar, Users, Scissors, Activity, Brain, Apple, Baby, Stethoscope, GraduationCap, Zap, Coffee, Music, Gamepad2, Palette, Dumbbell, TreePine, Sun, Moon, Wind, Thermometer, Droplets, Sparkles, Target, Award, Gift, Compass, Map, Navigation } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface GuideDetailPageProps {
  params: {
    slug: string
  }
}

// 샘플 가이드 데이터
const guideData: Record<string, {
  title: string
  description: string
  category: string
  difficulty: string
  readTime: string
  author: string
  date: string
  rating: number
  icon: React.ReactNode
  content: string
}> = {
  'dog-travel-transport-guide': {
    title: '교통편 이용 가이드',
    description: '강아지와 함께 대중교통을 이용하는 방법',
    category: '여행 준비',
    difficulty: '초급',
    readTime: '8분',
    author: '어서오개 팀',
    date: '2024-01-15',
    rating: 4.8,
    icon: <Car className="w-8 h-8 text-blue-500" />,
    content: `# 교통편 이용 가이드

강아지와 함께 대중교통을 이용하는 방법을 알아보세요.

## 지하철 이용법

### 기본 준비사항
- 강아지 목줄과 하네스 착용
- 이동용 케이지나 가방 준비
- 응급처치용품과 간식 준비
- 강아지 신분증과 예방접종 증명서

### 이용 규칙
- 소형견은 이동용 케이지에 넣어서 이용
- 중대형견은 목줄과 하네스 착용 후 이용
- 승강기 이용 권장
- 피크타임 이용 자제

## 버스 이용법

### 준비사항
- 강아지 목줄과 하네스 착용
- 이동용 케이지나 가방 준비
- 강아지 신분증과 예방접종 증명서
- 응급처치용품과 간식 준비

### 이용 규칙
- 소형견은 이동용 케이지에 넣어서 이용
- 중대형견은 목줄과 하네스 착용 후 이용
- 뒷자리 이용 권장
- 피크타임 이용 자제

## 택시 이용법

### 준비사항
- 강아지 목줄과 하네스 착용
- 이동용 케이지나 가방 준비
- 강아지 신분증과 예방접종 증명서
- 응급처치용품과 간식 준비

### 이용 규칙
- 소형견은 이동용 케이지에 넣어서 이용
- 중대형견은 목줄과 하네스 착용 후 이용
- 뒷자리 이용 권장
- 피크타임 이용 자제

## 자가용 여행

### 준비사항
- 강아지 목줄과 하네스 착용
- 이동용 케이지나 가방 준비
- 강아지 신분증과 예방접종 증명서
- 응급처치용품과 간식 준비

### 이용 규칙
- 소형견은 이동용 케이지에 넣어서 이용
- 중대형견은 목줄과 하네스 착용 후 이용
- 뒷자리 이용 권장
- 피크타임 이용 자제

## 체크리스트

### 기본 준비사항
- [ ] 강아지 목줄과 하네스 착용
- [ ] 이동용 케이지나 가방 준비
- [ ] 강아지 신분증과 예방접종 증명서
- [ ] 응급처치용품과 간식 준비

### 이용 규칙
- [ ] 소형견은 이동용 케이지에 넣어서 이용
- [ ] 중대형견은 목줄과 하네스 착용 후 이용
- [ ] 뒷자리 이용 권장
- [ ] 피크타임 이용 자제

## 전문가 조언

### 수의사 권장사항
- 강아지 건강 상태 확인
- 예방접종 일정 관리
- 응급처치 방법 숙지
- 정기적인 건강 검진

### 교통 전문가 조언
- 교통편별 이용 규칙 숙지
- 안전한 이동 방법
- 응급상황 대처법
- 정기적인 안전 점검

## 주의사항

### 피해야 할 것들
- 피크타임 이용
- 긴 시간 이동
- 응급처치용품 미준비
- 강아지 신분증 미준비

### 긴급 상황
- 강아지 건강 악화
- 교통편 이용 불가
- 응급처치 필요
- 즉시 전문가 상담

강아지와 함께하는 교통편 이용은 안전이 최우선입니다. 꾸준한 준비와 전문가의 도움으로 안전한 여행을 즐기세요.`
  },
  'dog-accommodation-guide': {
    title: '숙소 선택 가이드',
    description: '강아지 동반 가능한 숙소를 선택하는 방법',
    category: '여행 준비',
    difficulty: '초급',
    readTime: '10분',
    author: '어서오개 팀',
    date: '2024-01-15',
    rating: 4.7,
    icon: <Home className="w-8 h-8 text-green-500" />,
    content: `# 숙소 선택 가이드

강아지 동반 가능한 숙소를 선택하는 방법을 알아보세요.

## 호텔 선택 기준

### 기본 조건
- 강아지 동반 가능 여부 확인
- 강아지 크기와 무게 제한 확인
- 강아지 수수료 및 정책 확인
- 강아지 시설 및 서비스 확인

### 추가 고려사항
- 강아지 전용 시설 유무
- 강아지 전용 서비스 유무
- 강아지 전용 식당 유무
- 강아지 전용 놀이 공간 유무

## 펜션 예약 팁

### 예약 전 확인사항
- 강아지 동반 가능 여부 확인
- 강아지 크기와 무게 제한 확인
- 강아지 수수료 및 정책 확인
- 강아지 시설 및 서비스 확인

### 예약 시 주의사항
- 강아지 동반 여부 명시
- 강아지 크기와 무게 정보 제공
- 강아지 특별 요청사항 전달
- 강아지 응급상황 대비 연락처 제공

## 글램핑 준비물

### 필수 준비물
- 강아지 목줄과 하네스
- 강아지 이동용 케이지
- 강아지 사료와 간식
- 강아지 물그릇과 식기

### 추가 준비물
- 강아지 침대와 담요
- 강아지 장난감
- 강아지 응급처치용품
- 강아지 청소용품

## 숙소 예약 시 주의사항

### 예약 전 확인사항
- 강아지 동반 가능 여부 확인
- 강아지 크기와 무게 제한 확인
- 강아지 수수료 및 정책 확인
- 강아지 시설 및 서비스 확인

### 예약 시 주의사항
- 강아지 동반 여부 명시
- 강아지 크기와 무게 정보 제공
- 강아지 특별 요청사항 전달
- 강아지 응급상황 대비 연락처 제공

## 체크리스트

### 예약 전 확인사항
- [ ] 강아지 동반 가능 여부 확인
- [ ] 강아지 크기와 무게 제한 확인
- [ ] 강아지 수수료 및 정책 확인
- [ ] 강아지 시설 및 서비스 확인

### 예약 시 주의사항
- [ ] 강아지 동반 여부 명시
- [ ] 강아지 크기와 무게 정보 제공
- [ ] 강아지 특별 요청사항 전달
- [ ] 강아지 응급상황 대비 연락처 제공

## 전문가 조언

### 여행 전문가 조언
- 강아지 동반 여행 계획
- 숙소 선택 기준
- 예약 시 주의사항
- 여행 중 관리 방법

### 숙소 전문가 조언
- 강아지 동반 가능 숙소
- 강아지 전용 시설
- 강아지 전용 서비스
- 강아지 전용 정책

## 주의사항

### 피해야 할 것들
- 강아지 동반 불가 숙소
- 강아지 크기 제한 초과
- 강아지 수수료 미확인
- 강아지 시설 미확인

### 긴급 상황
- 강아지 건강 악화
- 숙소 이용 불가
- 강아지 응급처치 필요
- 즉시 전문가 상담

강아지와 함께하는 숙소 선택은 안전과 편의가 최우선입니다. 꾸준한 준비와 전문가의 도움으로 안전한 여행을 즐기세요.`
  },
  'dog-emotion-communication-guide': {
    title: '감정 표현과 소통',
    description: '강아지의 감정을 이해하고 효과적으로 소통하는 방법',
    category: '관리 및 훈련',
    difficulty: '중급',
    readTime: '10분',
    author: '어서오개 팀',
    date: '2024-01-15',
    rating: 4.8,
    icon: <Heart className="w-8 h-8 text-red-400" />,
    content: `# 감정 표현과 소통

강아지의 감정을 이해하고 효과적으로 소통하는 방법을 알아보세요.

## 감정 신호 파악

### 기본 감정 표현
- **기쁨**: 꼬리 흔들기, 귀 세우기, 활발한 움직임
- **불안**: 꼬리 내리기, 귀 뒤로 젖히기, 몸 움츠리기
- **화남**: 으르렁거리기, 이빨 드러내기, 몸 긴장
- **두려움**: 몸 움츠리기, 꼬리 다리 사이에 끼우기, 도망

### 복합 감정 이해
- 기쁨과 불안이 섞인 상태
- 화남과 두려움이 섞인 상태
- 복잡한 상황에서의 감정 변화
- 개별적인 감정 표현 패턴

## 소통 방법

### 기본 소통 기법
1. **언어적 소통**
   - 일관된 명령어 사용
   - 긍정적인 톤과 음성
   - 간단하고 명확한 표현
   - 반복과 강화

2. **비언어적 소통**
   - 몸짓과 제스처 활용
   - 표정과 눈빛 교환
   - 터치와 물리적 접촉
   - 거리와 공간 활용

### 고급 소통 기법
- 상황별 맞춤 소통법
- 개별 성격에 맞는 접근
- 감정 상태별 대응법
- 장기적인 관계 구축

## 감정 표현 훈련

### 기본 감정 훈련
1. **긍정적 감정 표현**
   - 기쁨과 만족감 표현
   - 자신감과 안정감 표현
   - 사랑과 애정 표현
   - 감사와 고마움 표현

2. **부정적 감정 관리**
   - 불안과 두려움 완화
   - 화남과 좌절감 조절
   - 슬픔과 우울감 극복
   - 스트레스와 압박감 해소

### 고급 감정 훈련
- 복잡한 감정 상황 대처
- 감정 조절과 관리 능력
- 감정 표현의 다양성
- 감정적 지능 향상

## 관계 개선

### 신뢰 관계 구축
- 일관된 행동과 반응
- 예측 가능한 환경 조성
- 안전하고 편안한 공간 제공
- 충분한 관심과 애정 표현

### 상호 이해 증진
- 강아지의 개별 특성 이해
- 주인의 감정과 의도 전달
- 서로의 경계와 한계 존중
- 지속적인 소통과 교류

## 체크리스트

### 일일 감정 관리
- [ ] 강아지의 감정 상태 관찰
- [ ] 기본적인 소통 시도
- [ ] 감정 변화 모니터링
- [ ] 긍정적 상호작용 제공

### 주간 소통 점검
- [ ] 소통 방법의 효과성 평가
- [ ] 감정 표현 훈련 진행
- [ ] 관계 개선 사항 확인
- [ ] 문제 상황 대처 방법 검토

### 월간 관계 평가
- [ ] 전체적인 관계 상태 평가
- [ ] 감정적 유대감 강화
- [ ] 소통 능력 향상도 측정
- [ ] 전문가 상담과 조언

## 전문가 조언

### 동물 행동 전문가 조언
- 개별 맞춤형 소통 방법
- 감정 표현 훈련 기법
- 관계 개선 전략
- 지속적인 발전 방향

### 심리학 전문가 조언
- 감정 이해와 해석
- 효과적인 소통 기법
- 관계 역학과 상호작용
- 감정적 지능 개발

## 주의사항

### 피해야 할 것들
- 강압적이고 일방적인 소통
- 감정 상태 무시와 방치
- 일관성 없는 반응과 행동
- 전문가 상담 없는 무리한 훈련

### 긴급 상황
- 심각한 감정적 문제
- 공격적 행동이나 과도한 반응
- 소통 완전 단절
- 즉시 전문가 상담 필요

강아지와의 감정적 소통은 사랑과 이해가 기반입니다. 꾸준한 관심과 전문가의 도움으로 깊은 유대감을 만들어보세요.`
  },
  'dog-immunity-boost-guide': {
    title: '면역력 강화',
    description: '강아지 면역력 향상과 질병 예방 방법',
    category: '건강 관리',
    difficulty: '중급',
    readTime: '10분',
    author: '어서오개 팀',
    date: '2024-01-15',
    rating: 4.9,
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    content: `# 면역력 강화

강아지의 면역력을 강화하여 질병에 대한 저항력을 높이고 건강한 삶을 유지하는 방법을 알아보세요.

## 면역력의 중요성

### 면역 체계의 역할
- **병원체 방어**: 바이러스, 박테리아, 곰팡이 등으로부터 보호
- **질병 예방**: 감염성 질병과 만성 질병 예방
- **회복력 향상**: 질병 후 빠른 회복과 치유
- **노화 지연**: 건강한 노화와 장수

### 면역력 저하 신호
- 자주 아프거나 감기에 걸림
- 상처나 질병 회복이 느림
- 피로감과 무기력증
- 식욕 부진과 체중 감소

## 면역력 강화 방법

### 영양 관리
1. **균형 잡힌 식단**
   - 고품질 단백질 공급
   - 필수 비타민과 미네랄
   - 항산화 성분이 풍부한 식품
   - 오메가-3 지방산 보충

2. **면역력 증진 식품**
   - 블루베리, 크랜베리 등 베리류
   - 당근, 고구마 등 베타카로틴 식품
   - 브로콜리, 시금치 등 녹색 채소
   - 연어, 정어리 등 오메가-3 풍부한 생선

### 운동과 활동
1. **규칙적인 운동**
   - 일일 산책과 활동
   - 적절한 운동 강도 유지
   - 정신적 자극과 놀이
   - 스트레스 해소 활동

2. **운동의 면역 효과**
   - 순환계 기능 향상
   - 스트레스 호르몬 감소
   - 수면 질 개선
   - 전반적인 건강 증진

## 예방 접종 관리

### 필수 예방 접종
- **종합 백신**: 디스템퍼, 파보바이러스, 아데노바이러스
- **켄넬코프**: 기관지염과 기침 예방
- **광견병**: 법정 접종 필수
- **레프토스피라**: 신장과 간 질환 예방

### 접종 일정 관리
- 퍼피 시기 정기 접종
- 성견 연간 접종
- 노령견 맞춤 접종
- 수의사와 상담한 개별 일정

## 건강한 생활습관

### 수면 관리
- 충분한 수면 시간 확보 (12-14시간)
- 편안한 수면 환경 조성
- 규칙적인 수면 패턴 유지
- 방해 요소 제거

### 스트레스 관리
- 예측 가능한 일상 루틴
- 안전하고 편안한 환경
- 충분한 관심과 애정
- 긍정적 경험 제공

## 질병 예방

### 정기 건강 체크
- 연 2회 정기 검진
- 혈액 검사와 소변 검사
- 치과 검진과 구강 관리
- 체중과 체형 모니터링

### 환경 관리
- 깨끗한 생활 환경 유지
- 적절한 온도와 습도 관리
- 공기 질 개선
- 위험 요소 제거

## 체크리스트

### 일일 건강 관리
- [ ] 식욕과 수분 섭취 확인
- [ ] 활동량과 에너지 상태 관찰
- [ ] 대소변 상태 점검
- [ ] 전반적인 기분과 행동 관찰

### 주간 면역력 관리
- [ ] 영양 상태와 식단 점검
- [ ] 운동량과 활동 패턴 평가
- [ ] 스트레스 요인 파악
- [ ] 수면 패턴과 질 확인

### 월간 건강 점검
- [ ] 체중과 체형 변화 모니터링
- [ ] 예방 접종 일정 확인
- [ ] 정기 검진 일정 관리
- [ ] 환경 개선 사항 검토

## 전문가 조언

### 수의사 권장사항
- 개별 맞춤형 면역력 관리 계획
- 정기적인 건강 검진
- 필요시 면역력 증진 보조제 고려
- 질병 조기 발견과 치료

### 영양사 조언
- 균형 잡힌 영양 공급
- 개별 맞춤형 식단 구성
- 보조제 사용 가이드
- 영양 상태 모니터링

## 주의사항

### 피해야 할 것들
- 과도한 보조제 사용
- 무분별한 약물 투여
- 극단적인 식단 변화
- 전문가 상담 없는 자가 치료

### 긴급 상황
- 갑작스러운 면역력 저하 증상
- 심각한 감염 증상
- 지속적인 건강 악화
- 전문가 즉시 상담 필요

강아지의 면역력 관리는 평생에 걸친 투자입니다. 꾸준한 관리와 전문가의 도움으로 건강하고 행복한 삶을 유지하세요.`
  }
}

// 관련 가이드 가져오기 함수
function getRelatedGuides(currentSlug: string) {
  const allGuides = [
    {
      slug: 'dog-travel-transport-guide',
      title: '교통편 이용 가이드',
      description: '강아지와 함께 대중교통을 이용하는 방법',
      difficulty: '초급',
      icon: <Car className="w-8 h-8 text-blue-500" />
    },
    {
      slug: 'dog-accommodation-guide',
      title: '숙소 선택 가이드',
      description: '강아지 동반 가능한 숙소를 선택하는 방법',
      difficulty: '초급',
      icon: <Home className="w-8 h-8 text-green-500" />
    },
    {
      slug: 'dog-emotion-communication-guide',
      title: '감정 표현과 소통',
      description: '강아지의 감정을 이해하고 효과적으로 소통하는 방법',
      difficulty: '중급',
      icon: <Heart className="w-8 h-8 text-red-400" />
    },
    {
      slug: 'dog-immunity-boost-guide',
      title: '면역력 강화',
      description: '강아지 면역력 향상과 질병 예방 방법',
      difficulty: '중급',
      icon: <Shield className="w-8 h-8 text-blue-600" />
    }
  ]

  // 현재 가이드를 제외한 나머지 가이드 중 3개를 랜덤하게 선택
  const otherGuides = allGuides.filter(guide => guide.slug !== currentSlug)
  return otherGuides.slice(0, 3)
}

// 정적 파라미터 생성
export async function generateStaticParams() {
  return Object.keys(guideData).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = guideData[slug]
  
  if (!guide) {
    return {
      title: '가이드를 찾을 수 없습니다 | 어서오개',
    }
  }

  return {
    title: `${guide.title} | 어서오개 반려가이드`,
    description: guide.description,
    keywords: `${guide.category}, 강아지 교통편, 반려견 여행, 강아지 동반`,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      locale: 'ko_KR',
    },
  }
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params
  const guide = guideData[slug]

  if (!guide) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">가이드를 찾을 수 없습니다</h1>
          <Link href="/guide" className="text-blue-600 hover:text-blue-800">
            ← 반려가이드로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const relatedGuides = getRelatedGuides(slug)

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/guide" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            반려가이드로 돌아가기
          </Link>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                {guide.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.title}</h1>
                <p className="text-lg text-gray-600">{guide.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {guide.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {guide.readTime}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {guide.author}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                {guide.rating}
              </div>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {guide.difficulty}
              </div>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8" id={children?.toString().replace(/\s+/g, '-').toLowerCase()}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </div>

          {/* 메타 정보 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">가이드 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">카테고리</span>
                <p className="font-medium text-gray-900">{guide.category}</p>
              </div>
              <div>
                <span className="text-gray-500">난이도</span>
                <p className="font-medium text-gray-900">{guide.difficulty}</p>
              </div>
              <div>
                <span className="text-gray-500">읽는 시간</span>
                <p className="font-medium text-gray-900">{guide.readTime}</p>
              </div>
              <div>
                <span className="text-gray-500">평점</span>
                <p className="font-medium text-gray-900">{guide.rating}/5.0</p>
              </div>
            </div>
          </div>

          {/* 관련 가이드 */}
          {relatedGuides.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">관련 가이드</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedGuides.map((relatedGuide) => (
                  <Link
                    key={relatedGuide.slug}
                    href={`/guide/${relatedGuide.slug}`}
                    className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        {relatedGuide.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{relatedGuide.title}</h4>
                        <p className="text-xs text-gray-500">{relatedGuide.difficulty}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{relatedGuide.description}</p>
                    <div className="flex items-center text-xs text-blue-600">
                      <BookOpen className="w-3 h-3 mr-1" />
                      가이드 보기
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 공유 버튼 */}
          <div className="flex items-center justify-center space-x-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Heart className="w-4 h-4 mr-2" />
              공유하기
            </button>
            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Star className="w-4 h-4 mr-2" />
              좋아요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}