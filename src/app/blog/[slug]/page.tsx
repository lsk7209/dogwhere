import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'
import { Calendar, User, Tag, ArrowLeft, Share2, Heart, Bookmark, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// 샘플 블로그 포스트 데이터
const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readTime: string
  image: string
  tags: string[]
  location?: string
  lastModified?: string
  seoKeywords?: string[]
  geoLocation?: {
    latitude: number
    longitude: number
    address: string
  }
}> = {
  'jeju-dog-travel-guide': {
    title: '강아지와 함께하는 제주도 여행기 - 완벽한 반려견 동반 여행 가이드',
    excerpt: '제주도의 아름다운 자연 속에서 강아지와 함께한 특별한 여행 이야기와 실용적인 팁을 공유합니다.',
    content: `# 강아지와 함께하는 제주도 여행기

제주도는 강아지와 함께하는 여행지로 최고의 선택 중 하나입니다. 아름다운 자연과 다양한 강아지 동반 시설들이 우리의 특별한 여행을 더욱 빛나게 해주었습니다.

## 🏖️ 제주도 강아지 동반 여행 준비사항

### 필수 준비물
- **건강진단서**: 수의사 발급 건강진단서 (항공사마다 요구사항 상이)
- **예방접종 증명서**: 종합백신, 켄넬코프 등 최신 접종 증명서
- **항공사 승인**: 미리 항공사에 반려동물 동반 승인 받기
- **여행용 케이지**: 항공사 규격에 맞는 케이지 준비

### 제주도 도착 후 체크리스트
1. **렌터카 예약**: 강아지 동반 가능한 차량 미리 예약
2. **숙소 확인**: 펫 동반 가능 숙소 사전 확인
3. **응급병원**: 제주도 내 동물병원 위치 파악

## 🏨 추천 숙소

### 1. 제주 펫프렌들리 리조트
- **위치**: 서귀포시 중문관광단지
- **특징**: 전용 강아지 놀이터, 펫샤워 시설 완비
- **가격**: 1박 15만원 (강아지 동반 시 추가 요금 없음)

### 2. 제주 글램핑장 '멍멍캠프'
- **위치**: 제주시 애월읍
- **특징**: 텐트 내 강아지 전용 공간, 바베큐 시설
- **가격**: 1박 8만원

## 🍽️ 강아지 동반 식당 추천

### 1. 제주도 강아지 카페 '멍멍카페'
- **메뉴**: 강아지 전용 간식, 사람용 음료
- **특징**: 실내 놀이터, 강아지 전용 메뉴
- **위치**: 제주시 연동

### 2. 바다전망 레스토랑 '오션뷰'
- **메뉴**: 신선한 해산물, 제주 특산물
- **특징**: 강아지 동반 가능한 테라스석
- **위치**: 서귀포시 중문

## 🏞️ 강아지와 함께하는 관광지

### 1. 한라산 국립공원
- **특징**: 강아지 동반 등산 가능 (일부 구간)
- **주의사항**: 목줄 필수, 배변봉투 준비
- **추천 코스**: 어리목 탐방로 (난이도: 쉬움)

### 2. 성산일출봉
- **특징**: 일출 명소, 강아지 동반 가능
- **추천 시간**: 새벽 5시 (일출 시간)
- **주의사항**: 계단이 많아 소형견에 적합

### 3. 제주 올레길
- **특징**: 전 구간 강아지 동반 가능
- **추천 코스**: 1코스 (시흥리~오설록)
- **소요시간**: 2-3시간

## 💡 제주도 여행 실용 팁

### 교통편
- **렌터카**: 가장 편리한 이동수단
- **택시**: 강아지 동반 가능 (사전 문의)
- **버스**: 일부 노선 강아지 동반 가능

### 날씨 대비
- **여름**: 더위 대비 충분한 물 준비
- **겨울**: 보온용품, 발가락 보호용 부츠
- **비**: 강아지용 우비, 휴대용 타월

### 응급상황 대비
- **동물병원**: 제주시, 서귀포시 주요 동물병원 위치 파악
- **응급약**: 설사약, 소독약 등 기본 응급약 준비
- **보험**: 반려동물 여행보험 가입 권장

## 📸 추천 포토스팟

### 1. 협재해수욕장
- **특징**: 에메랄드 빛 바다, 강아지 동반 가능
- **포토타임**: 오후 3-5시 (빛이 가장 좋은 시간)

### 2. 카멜리아힐
- **특징**: 아름다운 정원, 강아지 동반 가능
- **계절**: 겨울~봄 (동백꽃 시즌)

### 3. 제주도 동물원
- **특징**: 다양한 동물들과 함께하는 사진
- **주의사항**: 강아지와 다른 동물들의 안전 거리 유지

## 🛍️ 쇼핑 추천

### 1. 제주도 강아지 용품점 '펫스토어'
- **위치**: 제주시 도두동
- **특징**: 제주도 특산 강아지 간식, 용품
- **추천**: 제주 감귤 강아지 간식

### 2. 제주도 전통시장
- **특징**: 신선한 제주도 특산물
- **주의사항**: 강아지 동반 시 목줄 필수

## 💰 예상 비용 (2박 3일 기준)

- **항공료**: 15만원 (강아지 동반료 포함)
- **숙소**: 30만원 (펫 동반 숙소)
- **렌터카**: 8만원 (3일)
- **식비**: 15만원
- **관광지 입장료**: 5만원
- **총 예상비용**: 약 73만원

## 🎯 마무리

제주도는 강아지와 함께하는 여행지로 정말 완벽한 선택이었습니다. 아름다운 자연과 다양한 강아지 동반 시설들이 우리의 여행을 더욱 특별하게 만들어주었습니다. 

다음 여행도 제주도로 가고 싶을 정도로 만족스러운 여행이었고, 강아지도 정말 즐거워했던 것 같습니다. 여러분도 강아지와 함께하는 제주도 여행을 계획해보시길 추천드립니다!

**여행 후기**: ⭐⭐⭐⭐⭐ (5/5)
**강아지 만족도**: 🐕🐕🐕🐕🐕 (매우 만족)
**재방문 의향**: 100% 예!`,
    author: '김멍멍',
    date: '2024.10.28',
    category: '여행기',
    readTime: '8분',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['제주도', '강아지여행', '펜션', '카페', '관광지', '여행팁'],
    location: '제주도',
    lastModified: '2024.10.28',
    seoKeywords: ['제주도 강아지 여행', '반려견 동반 여행', '펫프렌들리 제주', '강아지 카페 제주', '제주도 펜션'],
    geoLocation: {
      latitude: 33.4996,
      longitude: 126.5312,
      address: '제주특별자치도'
    }
  },
  'dog-cafe-selection-guide': {
    title: '강아지 카페 선택하는 방법 - 완벽한 펫프렌들리 카페 찾기',
    excerpt: '강아지와 함께 갈 수 있는 카페를 선택할 때 고려해야 할 사항들과 실용적인 팁을 알려드립니다.',
    content: `# 강아지 카페 선택하는 방법

강아지와 함께 카페에 가는 것은 정말 즐거운 경험입니다. 하지만 모든 카페가 강아지 동반을 허용하는 것은 아니고, 허용한다고 해도 강아지에게 안전하고 편안한 환경을 제공하는 것은 아닙니다.

## 🐕 강아지 카페 선택 기준

### 1. 펫프렌들리 정책 확인
- **공식 정책**: 카페 웹사이트나 전화로 강아지 동반 정책 확인
- **크기 제한**: 소형견만 허용하는지, 중대형견도 가능한지 확인
- **추가 요금**: 강아지 동반 시 추가 비용이 발생하는지 확인
- **예약 필요**: 사전 예약이 필요한지 확인

### 2. 시설 및 환경
- **실내/실외**: 강아지가 들어갈 수 있는 공간이 있는지 확인
- **안전장치**: 문이 자동으로 닫히는지, 강아지가 탈출할 위험은 없는지 확인
- **청결도**: 카페 내부가 깨끗하고 위생적인지 확인
- **소음 수준**: 너무 시끄러운 환경은 강아지에게 스트레스가 될 수 있음

### 3. 강아지 전용 시설
- **물그릇**: 강아지용 물그릇이 준비되어 있는지 확인
- **간식**: 강아지 전용 간식이나 메뉴가 있는지 확인
- **놀이 공간**: 강아지가 놀 수 있는 공간이 있는지 확인
- **배변 공간**: 강아지 배변을 위한 공간이나 시설이 있는지 확인

## 🏪 추천 강아지 카페

### 서울 강남구 강아지 동반 카페 베스트 5

#### 1. 멍멍카페 (강남점) ⭐⭐⭐⭐⭐
- **위치**: 서울시 강남구 테헤란로 123
- **운영시간**: 평일 10:00-22:00, 주말 09:00-23:00
- **전화번호**: 02-1234-5678
- **주차**: 건물 지하주차장 이용 가능

#### 특징
- **넓은 공간**: 200평 규모의 넓은 실내 공간
- **전용 놀이터**: 강아지 전용 놀이기구와 터널 완비
- **실내/실외**: 실내와 실외 공간 모두 이용 가능
- **전용 메뉴**: 강아지 전용 간식과 케이크 메뉴 풍부

#### 메뉴 및 가격
- **사람용 음료**: 5,000원~ (아메리카노, 라떼, 프라푸치노)
- **강아지 간식**: 3,000원~ (강아지 쿠키, 간식)
- **강아지 케이크**: 8,000원~ (생일 케이크, 특별 케이크)
- **강아지 아이스크림**: 5,000원~ (여름 시즌 한정)

#### 이용 팁
- **예약**: 주말은 사전 예약 필수
- **크기 제한**: 소형견~중형견까지 동반 가능
- **추가 요금**: 강아지 동반 시 추가 요금 없음
- **특별 서비스**: 강아지 생일파티 서비스 제공

## 💡 강남구 강아지 카페 이용 팁

### 예약 및 이용
- **사전 예약**: 인기 카페는 사전 예약 필수
- **이용 시간**: 평일 오후 2-4시가 가장 한산
- **주차**: 대부분 건물 지하주차장 이용 가능
- **대중교통**: 지하철 역세권에 위치한 카페들

### 강아지 준비
- **건강상태**: 강아지가 건강한 상태인지 확인
- **예방접종**: 최신 예방접종 완료 확인
- **목줄**: 강아지 목줄과 가슴줄 준비
- **배변봉투**: 배변봉투 준비

### 매너 및 안전
- **다른 강아지**: 다른 강아지와의 상호작용 주의
- **배변**: 배변 시 즉시 정리
- **소음**: 강아지가 과도하게 짖지 않도록 주의
- **안전**: 강아지가 위험한 곳에 접근하지 않도록 주의

## 🎯 마무리

강남구는 강아지 동반 카페가 가장 많이 집중되어 있는 지역입니다. 위에서 소개한 베스트 5 카페들은 모두 강아지에게 안전하고 편안한 환경을 제공합니다.

강아지와 함께하는 특별한 카페 시간을 만들어보세요. 좋은 카페에서 강아지와 함께하는 즐거운 시간을 보내시길 바랍니다!

**추천 카페**: 멍멍카페 (강남점) ⭐⭐⭐⭐⭐
**강아지 만족도**: 🐕🐕🐕🐕🐕 (매우 만족)`,
    author: '최멍멍',
    date: '2024.10.20',
    category: '카페',
    readTime: '7분',
    image: 'https://images.unsplash.com/photo-1560807341-969085766008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['강남구', '강아지카페', '펫프렌들리', '카페추천', '베스트5'],
    location: '서울 강남구',
    lastModified: '2024.10.20',
    seoKeywords: ['강남구 강아지 카페', '펫프렌들리 카페', '강아지 동반 카페', '멍멍카페', '강아지 카페 추천'],
    geoLocation: {
      latitude: 37.5172,
      longitude: 127.0473,
      address: '서울특별시 강남구'
    }
  },
  'dog-health-travel-guide': {
    title: '강아지 여행 시 건강 관리법 - 완벽한 건강 관리 가이드',
    excerpt: '여행 중 강아지의 건강을 지키는 방법과 응급처치 가이드를 상세히 알려드립니다.',
    content: `# 강아지 여행 시 건강 관리법

여행은 강아지에게 새로운 경험과 즐거움을 제공하지만, 동시에 건강상의 위험도 따릅니다. 안전하고 건강한 여행을 위한 완벽한 건강 관리법을 알아보겠습니다.

## 🏥 여행 전 건강 체크

### 기본 건강 진단
- **전체 검진**: 여행 2주 전 수의사 종합 검진
- **혈액 검사**: 기본 혈액 검사로 건강 상태 확인
- **예방접종**: 최신 예방접종 상태 확인
- **기생충 검사**: 내외부 기생충 검사 및 치료

### 여행지별 특별 검진
- **해외여행**: 목적지 국가별 필수 검진 항목 확인
- **국내여행**: 지역별 특수 질병 위험도 확인
- **계절별**: 계절에 따른 질병 위험도 확인
- **활동별**: 여행 활동에 따른 건강 위험도 확인

## 💊 여행용 구급약품

### 기본 구급약품
- **소화제**: 강아지 전용 소화제 (설사, 구토)
- **소독약**: 상처 소독용 소독약
- **붕대**: 응급처치용 붕대와 거즈
- **체온계**: 강아지 전용 체온계
- **연고**: 상처 치료용 연고

### 특수 구급약품
- **알레르기약**: 강아지 알레르기 대응 약물
- **진통제**: 강아지 전용 진통제
- **안약**: 눈 문제 대응 안약
- **귀약**: 귀 문제 대응 귀약
- **비타민**: 강아지 전용 비타민

## 🚗 이동 중 건강 관리

### 차량 내 건강 관리
- **멀미 방지**: 강아지 멀미 방지 약물
- **안전벨트**: 강아지 전용 안전벨트 사용
- **온도 조절**: 차량 내 적절한 온도 유지
- **휴식**: 2시간마다 휴식 시간 제공

### 항공기 이용 시
- **스트레스 관리**: 항공기 이용 시 스트레스 관리
- **케이지**: 적절한 크기의 여행용 케이지
- **물 공급**: 충분한 물 공급
- **온도**: 화물칸 온도 확인

## 🏨 숙소에서의 건강 관리

### 숙소 내 안전 관리
- **위험물**: 숙소 내 위험한 물건 제거
- **온도**: 적절한 실내 온도 유지
- **습도**: 적절한 실내 습도 유지
- **환기**: 충분한 실내 환기

### 강아지 전용 공간
- **침대**: 강아지 전용 침대 준비
- **그릇**: 강아지 전용 그릇 준비
- **장난감**: 강아지가 좋아하는 장난감
- **안전장치**: 강아지 탈출 방지 안전장치

## 🍽️ 식사 및 간식 관리

### 사료 관리
- **보관**: 밀폐용기에 보관하여 신선도 유지
- **양**: 평소와 동일한 양 유지
- **시간**: 규칙적인 식사 시간 유지
- **물**: 충분한 물 공급

### 간식 관리
- **건강한 간식**: 인공 첨가물이 없는 자연 간식
- **양 조절**: 과도한 간식 제공 금지
- **안전**: 강아지가 삼킬 수 있는 위험한 간식 주의
- **알레르기**: 강아지 알레르기 유발 간식 주의

## 🏃‍♂️ 활동 중 건강 관리

### 산책 및 운동
- **강도**: 강아지 체력에 맞는 운동 강도
- **시간**: 적절한 운동 시간 유지
- **날씨**: 날씨에 따른 운동 조절
- **휴식**: 충분한 휴식 시간 제공

### 수영 및 물놀이
- **안전**: 수영 시 안전 관리
- **온도**: 물 온도 확인
- **청결**: 물의 청결도 확인
- **건조**: 수영 후 충분한 건조

## 🌡️ 날씨별 건강 관리

### 여름 건강 관리
- **더위**: 더위로 인한 탈수 증상 주의
- **일사병**: 일사병 예방 및 대처
- **물 공급**: 충분한 물 공급
- **그늘**: 충분한 그늘 확보

### 겨울 건강 관리
- **추위**: 추위로 인한 저체온증 주의
- **보온**: 충분한 보온 관리
- **발 관리**: 발가락 보호 및 관리
- **실내 온도**: 적절한 실내 온도 유지

## 🚨 응급상황 대처

### 기본 응급처치
- **상처**: 기본적인 상처 소독 및 붕대
- **탈수**: 충분한 물 공급 및 휴식
- **소화불량**: 설사약 및 소화제 투여
- **스트레스**: 강아지가 편안해할 수 있는 환경 조성

### 응급 연락처
- **동물병원**: 가까운 동물병원 연락처
- **응급실**: 24시간 응급실 연락처
- **보험사**: 반려동물 여행보험 가입 권장
- **수의사**: 평소 다니는 수의사 연락처

## 💰 건강 관리 비용

### 기본 비용
- **건강진단**: 5-10만원
- **구급약품**: 3-5만원
- **보험**: 월 1-3만원
- **응급처치 키트**: 2-3만원

### 추가 비용
- **응급실**: 응급상황 시 10-50만원
- **특수 검진**: 해외여행 시 10-20만원
- **특수 약물**: 특수 질병 대응 약물
- **특수 장비**: 특수 건강 관리 장비

## 🎯 마무리

강아지의 건강 관리는 여행의 성공을 좌우하는 가장 중요한 요소입니다. 충분한 준비와 지속적인 관리로 안전하고 건강한 여행을 만들어보세요.

위에서 소개한 건강 관리법을 참고하여 강아지와 함께하는 즐거운 여행을 계획하시길 바랍니다. 건강한 강아지와 함께하는 여행에서 잊지 못할 추억을 만들어보세요!

**건강 관리 후기**: ⭐⭐⭐⭐⭐ (5/5)
**강아지 건강 상태**: 🐕🐕🐕🐕🐕 (매우 양호)`,
    author: '정멍멍',
    date: '2024.10.18',
    category: '건강',
    readTime: '9분',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['강아지건강', '여행건강', '응급처치', '구급약품', '건강관리'],
    location: '전국',
    lastModified: '2024.10.18',
    seoKeywords: ['강아지 건강 관리', '반려견 여행 건강', '강아지 응급처치', '여행 구급약품', '강아지 건강 팁'],
    geoLocation: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: '대한민국'
    }
  },
  'dog-international-travel-guide': {
    title: '반려견과 함께하는 해외여행 준비 - 완벽한 해외여행 가이드',
    excerpt: '강아지와 함께 해외여행을 갈 때 필요한 서류와 준비사항을 상세히 알려드립니다.',
    content: `# 반려견과 함께하는 해외여행 준비

해외여행은 강아지와 함께하는 가장 특별한 경험 중 하나입니다. 하지만 많은 준비와 절차가 필요합니다. 완벽한 해외여행을 위한 모든 준비사항을 알아보겠습니다.

## 📋 필수 서류 준비

### 기본 서류
- **강아지 여권**: 수의사 발급 강아지 여권
- **예방접종 증명서**: 최근 1년 이내 예방접종 증명서
- **건강진단서**: 출국 10일 이내 건강진단서
- **마이크로칩 정보**: 강아지 마이크로칩 등록 정보

### 목적지별 추가 서류
- **검역 증명서**: 목적지 국가별 검역 증명서
- **추가 예방접종**: 목적지 국가별 필수 예방접종
- **번역 공증**: 서류의 공식 번역 및 공증
- **보험 증명서**: 반려동물 해외여행 보험 증명서

## ✈️ 항공편 예약 및 준비

### 항공사별 정책 확인
- **대한항공**: 반려동물 동반 정책 및 요금
- **아시아나항공**: 반려동물 동반 정책 및 요금
- **외국 항공사**: 각 항공사별 반려동물 동반 정책
- **예약**: 항공편 예약 시 반려동물 동반 신청

### 운송 방법 선택
- **기내 동반**: 소형견의 경우 기내 동반 가능
- **수하물 운송**: 중대형견의 경우 수하물 운송
- **전용 운송**: 전용 반려동물 운송 서비스
- **케이지**: 항공사 규격에 맞는 케이지 준비

### 추가 비용 및 제한
- **추가 요금**: 반려동물 동반 시 추가 요금 (20-50만원)
- **크기 제한**: 항공사별 반려동물 크기 제한
- **수량 제한**: 항공편당 반려동물 동반 수량 제한
- **계절 제한**: 계절별 반려동물 동반 제한

## 🏨 목적지 숙소 준비

### 펫프렌들리 숙소
- **호텔**: 강아지 동반 가능한 호텔 예약
- **펜션**: 강아지 동반 가능한 펜션 예약
- **에어비앤비**: 강아지 동반 가능한 에어비앤비
- **추가 요금**: 숙소별 강아지 동반 추가 요금

### 숙소 내 시설
- **펫 시설**: 숙소 내 강아지 전용 시설
- **산책로**: 숙소 주변 강아지 산책로
- **펫 서비스**: 숙소 내 강아지 케어 서비스
- **응급 시설**: 숙소 주변 동물병원 위치

## 🚗 현지 교통편 준비

### 렌터카
- **펫 동반**: 강아지 동반 가능한 렌터카
- **안전장비**: 강아지 전용 안전장비
- **추가 요금**: 강아지 동반 시 추가 요금
- **정책**: 렌터카 회사별 강아지 동반 정책

### 대중교통
- **지하철**: 현지 지하철 강아지 동반 정책
- **버스**: 현지 버스 강아지 동반 정책
- **택시**: 현지 택시 강아지 동반 정책
- **기타**: 현지 기타 교통편 강아지 동반 정책

## 🏥 현지 동물병원 정보

### 응급 동물병원
- **위치**: 목적지 주요 동물병원 위치
- **연락처**: 24시간 응급실 연락처
- **서비스**: 제공하는 의료 서비스
- **언어**: 의료진 언어 지원 여부

### 일반 동물병원
- **위치**: 목적지 일반 동물병원 위치
- **진료시간**: 진료 시간 및 휴무일
- **예약**: 예약 방법 및 절차
- **비용**: 진료 비용 및 결제 방법

## 🍽️ 현지 식사 관리

### 사료 준비
- **수량**: 여행 기간 + 2-3일분 사료 준비
- **보관**: 밀폐용기에 보관하여 신선도 유지
- **구매**: 현지에서 구매 가능한 사료 확인
- **특수 사료**: 특수 사료의 경우 더 많이 준비

### 간식 및 물
- **간식**: 강아지가 좋아하는 간식 준비
- **물**: 충분한 물 공급
- **현지 간식**: 현지에서 구매 가능한 간식
- **안전**: 현지 간식의 안전성 확인

## 🎒 여행용품 준비

### 기본 용품
- **케이지**: 여행용 케이지 또는 가방
- **목줄**: 강아지 목줄과 가슴줄
- **배변봉투**: 충분한 배변봉투
- **그릇**: 강아지 전용 그릇

### 특수 용품
- **안전장비**: 강아지 전용 안전장비
- **보온용품**: 보온용 담요나 옷
- **장난감**: 강아지가 좋아하는 장난감
- **응급처치 키트**: 기본 응급처치 키트

## 💰 예상 비용

### 기본 비용
- **서류 준비**: 10-20만원
- **항공료**: 20-50만원 (추가 요금 포함)
- **숙소**: 1박 10-30만원 (펫 동반 숙소)
- **렌터카**: 1일 5-15만원

### 추가 비용
- **보험**: 월 2-5만원
- **응급실**: 응급상황 시 20-100만원
- **특수 서비스**: 특수 케어 서비스
- **기타**: 기타 예상치 못한 비용

## ⚠️ 주의사항

### 건강 관리
- **스트레스**: 여행으로 인한 스트레스 관리
- **적응**: 새로운 환경에 대한 적응 시간
- **건강**: 지속적인 건강 상태 모니터링
- **응급상황**: 응급상황에 대한 대비

### 안전 관리
- **탈출**: 강아지 탈출 방지
- **위험물**: 현지 위험한 물건 주의
- **다른 동물**: 현지 다른 동물과의 접촉 주의
- **교통**: 현지 교통 안전 주의

### 법적 주의사항
- **규정**: 현지 반려동물 관련 규정 준수
- **신고**: 필요시 현지 관련 기관 신고
- **문서**: 모든 서류의 정확성 확인
- **보험**: 반려동물 해외여행 보험 가입`,
    author: '한멍멍',
    date: '2024.10.15',
    category: '해외여행',
    readTime: '12분',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['해외여행', '강아지해외여행', '서류준비', '항공편', '해외숙소'],
    location: '해외',
    lastModified: '2024.10.15',
    seoKeywords: ['강아지 해외여행', '반려견 해외여행', '강아지 여권', '반려동물 항공편', '해외여행 준비'],
    geoLocation: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: '대한민국 (출발지)'
    }
  },
  'dog-camping-preparation-guide': {
    title: '반려견과 함께하는 캠핑 준비물 - 완벽한 캠핑 체크리스트',
    excerpt: '강아지와 캠핑을 갈 때 꼭 챙겨야 할 준비물과 주의사항을 상세히 알려드립니다.',
    content: `# 반려견과 함께하는 캠핑 준비물

강아지와 함께하는 캠핑은 정말 특별한 경험입니다. 하지만 야외 환경에서 강아지의 안전과 편안함을 위해서는 철저한 준비가 필요합니다. 오늘은 강아지 캠핑을 위한 완벽한 준비물 체크리스트를 공유하겠습니다.

## 🎒 필수 준비물 체크리스트

### 1. 기본 용품
- **목줄과 가슴줄**: 야외 환경에서 필수
- **배변봉투**: 충분한 양 준비 (일반적인 양의 2배)
- **물그릇과 사료그릇**: 접이식 제품 권장
- **사료와 간식**: 평소보다 20% 더 준비
- **수건과 타월**: 강아지 전용 타월 2-3장

### 2. 안전 용품
- **응급처치 키트**: 소독약, 붕대, 체온계 포함
- **강아지용 모기퇴치제**: 야외 모기로부터 보호
- **강아지용 선크림**: 코와 귀 부분 보호
- **안전조끼**: 야간 산책 시 반사 기능
- **GPS 추적기**: 미아 방지용

### 3. 편안함 용품
- **강아지용 텐트**: 또는 텐트 내 전용 공간
- **강아지용 매트**: 바닥 습기 차단
- **강아지용 담요**: 야간 보온용
- **장난감**: 평소 좋아하는 장난감 2-3개
- **강아지용 샴푸**: 긴급 세정용

## 🏕️ 캠핑장 선택 기준

### 1. 펫프렌들리 정책 확인
- **반려동물 동반 허용**: 사전 확인 필수
- **추가 요금**: 반려동물 동반 시 추가 비용 확인
- **제한 사항**: 특정 구역 제한 여부 확인

### 2. 안전한 환경
- **울타리**: 캠핑장 주변 울타리 상태 확인
- **위험 요소**: 절벽, 강, 호수 등 위험 지역 파악
- **야생동물**: 해당 지역 야생동물 정보 확인

### 3. 편의시설
- **배변장**: 강아지 전용 배변 공간 여부
- **세정 시설**: 강아지 세정 가능한 시설
- **응급처치**: 근처 동물병원 위치 확인

## ⚠️ 캠핑 중 주의사항

### 1. 안전 관리
- **목줄 착용**: 항상 목줄 착용 유지
- **감시**: 강아지를 혼자 두지 않기
- **화재 주의**: 캠프파이어 주변에서 강아지 관리
- **음식 관리**: 사람 음식과 강아지 사료 분리 보관

### 2. 건강 관리
- **충분한 수분**: 물 자주 제공
- **체온 관리**: 더위와 추위에 주의
- **스트레스 관리**: 새로운 환경 적응 시간 제공
- **운동량 조절**: 과도한 활동 피하기

### 3. 환경 보호
- **배변 처리**: 배변봉투로 깨끗하게 처리
- **쓰레기 관리**: 강아지 관련 쓰레기 분리 수거
- **자연 보호**: 야생동물과 식물 보호

## 🌡️ 계절별 캠핑 팁

### 봄/가을 캠핑
- **온도 변화**: 일교차가 크므로 보온에 주의
- **알레르기**: 꽃가루 알레르기 주의
- **습도**: 습도 관리로 피부 건강 유지

### 여름 캠핑
- **열사병 예방**: 그늘진 곳에서 충분한 휴식
- **충분한 수분**: 물 자주 제공
- **모기 예방**: 모기퇴치제와 모기장 활용

### 겨울 캠핑
- **보온**: 강아지용 옷과 담요 준비
- **발 관리**: 발가락 사이 얼음 제거
- **실내 활동**: 텐트 내 활동 시간 늘리기

## 🚨 응급상황 대처법

### 1. 일반적인 응급상황
- **상처**: 소독 후 붕대로 응급처치
- **탈수**: 충분한 수분 공급
- **스트레스**: 안정된 환경에서 휴식
- **소화불량**: 사료량 조절

### 2. 심각한 응급상황
- **중독**: 즉시 동물병원 연락
- **골절**: 움직이지 않게 고정 후 병원
- **질식**: 기도 확보 후 인공호흡
- **실신**: 즉시 응급처치 후 병원

## 📱 캠핑 전 체크리스트

### 캠핑장 도착 전
- [ ] 반려동물 동반 허용 확인
- [ ] 응급처치 키트 준비
- [ ] 충분한 사료와 물 준비
- [ ] 목줄과 배변봉투 확인
- [ ] 근처 동물병원 위치 파악

### 캠핑장 도착 후
- [ ] 안전한 구역 확인
- [ ] 강아지 전용 공간 설정
- [ ] 위험 요소 파악
- [ ] 응급 연락처 확인
- [ ] 강아지 상태 점검

## 💡 캠핑 성공을 위한 팁

### 1. 사전 준비
- **단계적 적응**: 짧은 캠핑부터 시작
- **훈련**: 기본 명령어와 배변 훈련 완료
- **건강검진**: 캠핑 전 건강상태 확인

### 2. 캠핑 중 관리
- **일정 조절**: 강아지 리듬에 맞춰 일정 조절
- **충분한 휴식**: 야외 활동 후 충분한 휴식
- [ ] **긍정적 경험**: 즐거운 경험으로 만들어주기

### 3. 캠핑 후 관리
- **목욕**: 캠핑 후 깨끗하게 목욕
- **건강관찰**: 캠핑 후 건강상태 관찰
- **피로회복**: 충분한 휴식과 영양 공급

강아지와 함께하는 캠핑은 정말 특별한 추억을 만들어줍니다. 하지만 안전과 건강이 최우선이므로 철저한 준비를 통해 즐거운 캠핑을 즐기시길 바랍니다!

**캠핑 후기**: ⭐⭐⭐⭐⭐ (5/5)
**강아지 만족도**: 🐕🐕🐕🐕🐕 (매우 만족)
**재캠핑 의향**: 100% 예!`,
    author: '박멍멍',
    date: '2024.10.22',
    category: '캠핑',
    readTime: '10분',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['캠핑', '강아지캠핑', '준비물', '안전', '캠핑팁'],
    location: '전국',
    lastModified: '2024.10.22',
    seoKeywords: ['강아지 캠핑', '반려견 캠핑', '캠핑 준비물', '펫프렌들리 캠핑장', '강아지 캠핑 팁'],
    geoLocation: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: '대한민국'
    }
  },
  'gangnam-dog-cafe-best5': {
    title: '서울 강남구 강아지 동반 카페 베스트 5 - 완벽한 펫프렌들리 카페 가이드',
    excerpt: '강남구에서 강아지와 함께 갈 수 있는 최고의 카페들을 소개합니다. 각 카페의 특징과 장점을 상세히 알려드립니다.',
    content: `# 서울 강남구 강아지 동반 카페 베스트 5

강남구는 강아지 동반 카페가 가장 많이 집중된 지역 중 하나입니다. 오늘은 강남구에서 강아지와 함께 갈 수 있는 최고의 카페 5곳을 소개해드리겠습니다.

## 🏆 강남구 강아지 동반 카페 베스트 5

### 1. 멍멍카페 강남점 ⭐⭐⭐⭐⭐
**위치**: 강남구 테헤란로 123
**운영시간**: 평일 10:00-22:00, 주말 09:00-23:00
**특징**: 
- 강아지 전용 놀이터 완비
- 강아지용 메뉴 다양 (케이크, 아이스크림, 간식)
- 전문 펫시터 상주
- 강아지 목욕 서비스 제공

**가격**: 음료 5,000-8,000원, 강아지 메뉴 3,000-5,000원
**추천 메뉴**: 강아지용 치킨케이크, 사람용 아메리카노
**주차**: 지하 주차장 완비 (2시간 무료)

### 2. 펫프렌들리 카페 강남센터 ⭐⭐⭐⭐⭐
**위치**: 강남구 논현로 456
**운영시간**: 매일 09:00-21:00
**특징**:
- 넓은 실내 공간 (200평)
- 강아지 전용 화장실과 샤워 시설
- 강아지 훈련 프로그램 운영
- 반려동물 용품 판매 코너

**가격**: 음료 4,500-7,500원, 강아지 메뉴 2,500-4,500원
**추천 메뉴**: 강아지용 요거트, 사람용 라떼
**주차**: 건물 지하 주차장 (1시간 무료)

### 3. 강아지와 함께 카페 ⭐⭐⭐⭐
**위치**: 강남구 도곡로 789
**운영시간**: 평일 11:00-20:00, 주말 10:00-21:00
**특징**:
- 아늑한 분위기의 소규모 카페
- 강아지 전용 의자와 테이블
- 강아지 사진 촬영 서비스
- 강아지 생일파티 예약 가능

**가격**: 음료 4,000-6,500원, 강아지 메뉴 2,000-3,500원
**추천 메뉴**: 강아지용 비스킷, 사람용 카페모카
**주차**: 건물 옆 주차장 (유료)

### 4. 댕댕이 카페 강남점 ⭐⭐⭐⭐
**위치**: 강남구 선릉로 321
**운영시간**: 매일 10:00-22:00
**특징**:
- 강아지 크기별 구역 분리
- 강아지 전용 놀이기구 설치
- 강아지 미용 서비스 제공
- 강아지 파티룸 대여 가능

**가격**: 음료 5,500-8,500원, 강아지 메뉴 3,500-5,500원
**추천 메뉴**: 강아지용 치즈케이크, 사람용 에스프레소
**주차**: 건물 지하 주차장 (2시간 무료)

### 5. 강아지 천국 카페 ⭐⭐⭐⭐
**위치**: 강남구 압구정로 654
**운영시간**: 평일 12:00-21:00, 주말 10:00-22:00
**특징**:
- 강아지 전용 수영장 운영 (여름)
- 강아지 호텔 서비스 제공
- 강아지 교육 프로그램 운영
- 강아지 용품 대여 서비스

**가격**: 음료 6,000-9,000원, 강아지 메뉴 4,000-6,000원
**추천 메뉴**: 강아지용 아이스크림, 사람용 콜드브루
**주차**: 건물 지하 주차장 (3시간 무료)

## 🍽️ 강아지 메뉴 가이드

### 강아지용 케이크
- **치킨케이크**: 단백질이 풍부한 건강한 케이크
- **치즈케이크**: 강아지가 좋아하는 치즈 맛
- **당근케이크**: 비타민이 풍부한 건강 케이크

### 강아지용 음료
- **요거트**: 프로바이오틱스가 풍부한 음료
- **아이스크림**: 여름철 시원한 간식
- **비스킷**: 간단한 간식으로 적합

### 강아지용 간식
- **치킨 스트립**: 단백질이 풍부한 간식
- **야채 스틱**: 비타민이 풍부한 건강 간식
- **과일 큐브**: 자연 당분이 들어간 간식

## 📋 카페 선택 가이드

### 강아지 크기별 추천
- **소형견**: 멍멍카페 강남점, 강아지와 함께 카페
- **중형견**: 펫프렌들리 카페 강남센터, 댕댕이 카페
- **대형견**: 강아지 천국 카페 (넓은 공간)

### 목적별 추천
- **놀이**: 멍멍카페 강남점, 댕댕이 카페
- **휴식**: 강아지와 함께 카페, 펫프렌들리 카페
- **서비스**: 강아지 천국 카페 (다양한 서비스)

### 예산별 추천
- **저예산**: 강아지와 함께 카페 (가성비 좋음)
- **중예산**: 펫프렌들리 카페, 댕댕이 카페
- **고예산**: 멍멍카페 강남점, 강아지 천국 카페

## ⚠️ 카페 이용 시 주의사항

### 1. 기본 예의
- **예약**: 주말과 공휴일은 사전 예약 필수
- **시간 준수**: 예약 시간 정확히 지키기
- **정원 확인**: 강아지 수용 가능 인원 확인

### 2. 강아지 관리
- **목줄 착용**: 카페 내에서도 목줄 착용
- **배변 처리**: 배변 시 즉시 처리
- **예방접종**: 최신 예방접종 완료 필수
- **건강상태**: 건강한 강아지만 동반

### 3. 다른 강아지와의 관계
- **사회화**: 다른 강아지와의 상호작용 주의
- **공격성**: 공격적인 성향의 강아지는 주의
- **질병**: 감염병 예방을 위한 주의

## 🚗 주차 및 교통 정보

### 주차 정보
- **멍멍카페**: 지하 주차장 (2시간 무료)
- **펫프렌들리 카페**: 건물 지하 주차장 (1시간 무료)
- **강아지와 함께 카페**: 건물 옆 주차장 (유료)
- **댕댕이 카페**: 건물 지하 주차장 (2시간 무료)
- **강아지 천국 카페**: 건물 지하 주차장 (3시간 무료)

### 대중교통
- **지하철**: 2호선 강남역, 선릉역, 압구정역 근처
- **버스**: 강남구 내 주요 버스 노선 이용 가능
- **택시**: 강아지 동반 택시 이용 시 사전 안내

## 💡 카페 이용 팁

### 1. 첫 방문 시
- **사전 조사**: 카페 정보와 규칙 미리 확인
- **예약**: 주말과 공휴일은 반드시 예약
- **준비물**: 강아지 목줄, 배변봉투, 간식 준비

### 2. 카페 내에서
- **규칙 준수**: 카페 내 규칙과 예의 지키기
- **강아지 관리**: 강아지 상태 지속적으로 관찰
- **다른 고객**: 다른 고객과 강아지 배려

### 3. 방문 후
- **후기 작성**: 카페 후기와 추천 작성
- **재방문**: 좋은 카페는 재방문으로 지원
- **정보 공유**: 다른 강아지 주인들과 정보 공유

강남구의 강아지 동반 카페들은 각각의 특색이 있어서 강아지와 함께하는 특별한 시간을 보낼 수 있습니다. 강아지의 성격과 크기에 맞는 카페를 선택하여 즐거운 시간을 보내시길 바랍니다!

**추천 카페**: 멍멍카페 강남점 ⭐⭐⭐⭐⭐
**강아지 만족도**: 🐕🐕🐕🐕🐕 (매우 만족)
**재방문 의향**: 100% 예!`,
    author: '최멍멍',
    date: '2024.10.20',
    category: '카페',
    readTime: '7분',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    tags: ['강남구', '강아지카페', '펫프렌들리', '카페추천', '베스트5'],
    location: '서울 강남구',
    lastModified: '2024.10.20',
    seoKeywords: ['강남구 강아지 카페', '펫프렌들리 카페', '강아지 동반 카페', '멍멍카페', '강아지 카페 추천'],
    geoLocation: {
      latitude: 37.5172,
      longitude: 127.0473,
      address: '서울특별시 강남구'
    }
  }
}

// 관련 포스트 추천 함수
function getRelatedPosts(currentSlug: string) {
  const allPosts = [
    {
      slug: 'jeju-dog-travel-guide',
      title: '강아지와 함께하는 제주도 여행기',
      excerpt: '제주도의 아름다운 자연 속에서 강아지와 함께한 특별한 여행 이야기',
      category: '여행기',
      date: '2024.10.28',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      slug: 'dog-cafe-selection-guide',
      title: '강아지 카페 선택하는 방법',
      excerpt: '강아지와 함께 갈 수 있는 카페를 선택할 때 고려해야 할 사항들',
      category: '가이드',
      date: '2024.10.25',
      image: 'https://images.unsplash.com/photo-1560807341-969085766008?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      slug: 'dog-camping-preparation-guide',
      title: '반려견과 함께하는 캠핑 준비물',
      excerpt: '강아지와 캠핑을 갈 때 꼭 챙겨야 할 준비물과 주의사항',
      category: '캠핑',
      date: '2024.10.22',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      slug: 'gangnam-dog-cafe-best5',
      title: '서울 강남구 강아지 동반 카페 베스트 5',
      excerpt: '강남구에서 강아지와 함께 갈 수 있는 최고의 카페들을 소개합니다',
      category: '카페',
      date: '2024.10.20',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      slug: 'dog-health-travel-guide',
      title: '강아지 여행 시 건강 관리법',
      excerpt: '여행 중 강아지의 건강을 지키는 방법과 응급처치 가이드',
      category: '건강',
      date: '2024.10.18',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      slug: 'dog-international-travel-guide',
      title: '반려견과 함께하는 해외여행 준비',
      excerpt: '강아지와 함께 해외여행을 갈 때 필요한 서류와 준비사항',
      category: '해외여행',
      date: '2024.10.15',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ]

  // 현재 포스트를 제외한 나머지 포스트 중 3개를 랜덤하게 선택
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  return otherPosts.slice(0, 3)
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return {
      title: '블로그 포스트를 찾을 수 없습니다 | 어서오개',
    }
  }

  const keywords = post.seoKeywords?.join(', ') || post.tags.join(', ')
  const canonicalUrl = `https://eoseo-ogae.com/blog/${slug}`

  return {
    title: `${post.title} | 어서오개 블로그`,
    description: post.excerpt,
    keywords: keywords,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: '어서오개',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://eoseo-ogae.com'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: 'ko_KR',
      siteName: '어서오개',
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      creator: '@eoseo_ogae',
      site: '@eoseo_ogae',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
    category: post.category,
    other: {
      'article:author': post.author,
      'article:published_time': post.date,
      'article:modified_time': post.lastModified || post.date,
      'article:section': post.category,
      'article:tag': post.tags.join(','),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">블로그 포스트를 찾을 수 없습니다</h1>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800">
              ← 블로그로 돌아가기
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* 네비게이션 */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>블로그로 돌아가기</span>
            </Link>
          </div>

          {/* 포스트 헤더 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.readTime} 읽기</span>
              {post.location && (
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{post.date}</span>
                </div>
                {post.lastModified && post.lastModified !== post.date && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">수정: {post.lastModified}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                  <Heart className="w-5 h-5" />
                  <span>좋아요</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <Bookmark className="w-5 h-5" />
                  <span>북마크</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                  <Share2 className="w-5 h-5" />
                  <span>공유</span>
                </button>
              </div>
            </div>
          </div>

          {/* JSON-LD 구조화된 데이터 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "image": post.image,
                "author": {
                  "@type": "Person",
                  "name": post.author
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "어서오개",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://eoseo-ogae.com/logo.png"
                  }
                },
                "datePublished": post.date,
                "dateModified": post.lastModified || post.date,
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://eoseo-ogae.com/blog/${slug}`
                },
                "articleSection": post.category,
                "keywords": post.seoKeywords?.join(', ') || post.tags.join(', '),
                "wordCount": post.content.length,
                "timeRequired": post.readTime,
                ...(post.geoLocation && {
                  "contentLocation": {
                    "@type": "Place",
                    "name": post.geoLocation.address,
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": post.geoLocation.latitude,
                      "longitude": post.geoLocation.longitude
                    }
                  }
                })
              })
            }}
          />

          {/* 포스트 내용 */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">{children}</h3>,
                    p: ({children}) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="mb-4 space-y-2">{children}</ul>,
                    ol: ({children}) => <ol className="mb-4 space-y-2">{children}</ol>,
                    li: ({children}) => <li className="flex items-start space-x-2"><span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span><span>{children}</span></li>,
                    strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                    code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                    pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700 font-medium">태그</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 관련 포스트 추천 */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">관련 포스트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRelatedPosts(slug).map((relatedPost, index) => (
                <Link key={index} href={`/blog/${relatedPost.slug}`} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mb-2 inline-block">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-semibold mb-2">{relatedPost.title}</h3>
                      <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{relatedPost.date}</span>
                        <span className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          자세히 보기 →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
