# 기존 개발된 기능 인벤토리

**프로젝트**: 어서오개 (dogwhere)  
**작성일**: 2025년 1월  
**목적**: 이후 개발 시 참고용 기능 목록 및 구조 정리

---

## 📋 목차

1. [유틸리티 기능](#유틸리티-기능)
2. [블로그 기능](#블로그-기능)
3. [구조 및 패턴](#구조-및-패턴)
4. [개발 참고사항](#개발-참고사항)

---

## 🛠 유틸리티 기능

### 개요
- **총 유틸리티 수**: 102개
- **완료 상태**: 모두 `completed`
- **카테고리**: 4개 (calculator, finder, guide, planner)
- **위치**: `src/app/utilities/`
- **데이터 파일**: `src/lib/utilities/utilities-data.ts`

### 데이터 구조
**파일**: `src/lib/utilities/utilities-data.ts`

```typescript
interface UtilityItem {
  id: string
  title: string
  description: string
  icon: string // Lucide icon name
  slug: string
  category: 'calculator' | 'finder' | 'guide' | 'planner'
  status: 'completed' | 'coming-soon'
}

// 유틸리티 데이터 배열
export const utilitiesData: UtilityItem[] = [ ... ]

// 유틸리티 함수
export const getUtilitiesByCategory = (category?: string) => UtilityItem[]
export const getCompletedUtilities = () => UtilityItem[]
export const getUtilityBySlug = (slug: string) => UtilityItem | undefined
```

### 카테고리별 분류

#### 1. 계산기 (Calculator) - 15개
| ID | 제목 | 설명 | 파일 경로 |
|---|---|---|---|
| dog-age-calculator | 반려견 나이 계산기 | 강아지의 나이와 견종을 입력하면 사람 나이로 환산 | `src/app/utilities/dog-age-calculator/page.tsx` |
| dog-obesity-calculator | 반려견 비만도 계산기 | 체중과 견종을 입력하면 비만 여부를 판단하고, 권장 체중 범위를 안내 | `src/app/utilities/dog-obesity-calculator/page.tsx` |
| food-calorie-calculator | 반려견 사료 칼로리 계산기 | 체중과 활동량에 따라 1일 적정 사료량과 칼로리 계산 | `src/app/utilities/food-calorie-calculator/page.tsx` |
| feeding-amount-calculator | 급여량 계산기 | 견종, 체중, 연령에 따른 하루 급여량을 자동 계산 | `src/app/utilities/feeding-amount-calculator/page.tsx` |
| bath-schedule-calculator | 목욕 주기 계산기 | 견종, 생활 환경, 활동량에 따른 적정 목욕 주기 계산 | `src/app/utilities/bath-schedule-calculator/page.tsx` |
| cost-calculator | 반려견 비용 계산기 | 사료, 병원비, 미용, 장난감 등 월간/연간 예상 비용 계산 | `src/app/utilities/cost-calculator/page.tsx` |
| stress-indicator | 스트레스 지수 계산기 | 행동 패턴과 환경을 분석하여 스트레스 정도 측정 | `src/app/utilities/stress-indicator/page.tsx` |
| water-intake-calculator | 수분 섭취량 계산기 | 체중과 활동량에 따른 적정 수분 섭취량 계산 | `src/app/utilities/water-intake-calculator/page.tsx` |
| vitamin-calculator | 비타민 보충제 계산기 | 체중, 연령, 건강 상태에 따른 적정 비타민/보충제 계산 | `src/app/utilities/vitamin-calculator/page.tsx` |
| playtime-calculator | 놀이 시간 계산기 | 연령과 견종에 따른 적정 놀이 시간 계산 | `src/app/utilities/playtime-calculator/page.tsx` |

#### 2. 찾기 (Finder) - 5개
| ID | 제목 | 설명 | 파일 경로 |
|---|---|---|---|
| walking-temperature-check | 산책 온도 체크기 | 현재 위치의 온도·습도 정보를 불러와 반려견 산책 적정 여부를 알려줌 | `src/app/utilities/walking-temperature-check/page.tsx` |
| pet-friendly-accommodation | 반려견 동반 숙소 찾기 | 한국관광공사 반려동물 여행 API를 활용해 지역별 숙소 목록 표시 | `src/app/utilities/pet-friendly-accommodation/page.tsx` |
| find-veterinary | 근처 동물병원 찾기 | 위치 기반으로 반려동물 병원 및 24시 응급실 표시 | `src/app/utilities/find-veterinary/page.tsx` |
| walking-course-recommender | 산책 코스 추천기 | 현재 위치를 기준으로 반려견 친화 산책로와 공원 추천 | `src/app/utilities/walking-course-recommender/page.tsx` |
| dog-toy-recommender | 장난감 추천 시스템 | 견종과 연령에 맞는 장난감 추천 | `src/app/utilities/dog-toy-recommender/page.tsx` |

#### 3. 가이드 (Guide) - 25개
주요 가이드:
- `breed-personality-guide` - 견종별 성격 가이드
- `health-checklist` - 건강 체크리스트
- `grooming-guide` - 털 관리 가이드
- `emergency-guide` - 응급처치 가이드
- `dental-care-guide` - 구강 건강 가이드
- `socialization-guide` - 사회화 가이드
- `first-visit-guide` - 첫 방문 가이드
- `safety-checklist` - 안전 체크리스트
- `seasonal-care-guide` - 계절별 케어 가이드
- `dog-walking-safety` - 산책 안전 가이드
- `puppy-potty-training` - 강아지 배변 훈련 가이드
- 기타 14개 가이드

#### 4. 플래너 (Planner) - 57개
주요 플래너:
- `travel-packing-list` - 반려견 여행 짐 리스트
- `pet-travel-planner` - 펫 여행 일정 플래너
- `vaccination-scheduler` - 예방접종 일정 관리자
- `training-planner` - 훈련 일정 플래너
- `feeding-schedule` - 식사 시간표 관리
- `daily-routine-tracker` - 일상 생활 패턴 추적
- `weight-growth-tracker` - 체중 성장 추적기
- `mood-tracker` - 기분 상태 추적기
- `behavior-logger` - 행동 일지 작성기
- `sleep-pattern-tracker` - 수면 패턴 추적기
- 기타 47개 플래너

**전체 목록**: `src/lib/utilities/utilities-data.ts` 참조

### 유틸리티 메인 페이지
**파일**: `src/app/utilities/page.tsx`

**주요 기능**:
- ✅ 검색 기능 (제목, 설명, slug 검색)
- ✅ 카테고리 필터 (전체, 계산기, 찾기, 가이드, 플래너)
- ✅ 정렬 (인기순, 가나다순)
- ✅ 페이지네이션 (9개씩 표시)
- ✅ 반응형 그리드 레이아웃 (1/2/3열)

**사용 기술**:
- `useState`, `useMemo` (React Hooks)
- Lucide React 아이콘 (동적 로딩)
- Tailwind CSS 스타일링
- Next.js Link 컴포넌트

**레이아웃**:
- `src/app/utilities/layout.tsx` - 공유/제보/관련 유틸리티 표시

---

## 📝 블로그 기능

### 개요
- **위치**: `src/app/blog/`
- **구조**: 목록 페이지 + 상세 페이지
- **콘텐츠 형식**: 마크다운 (Markdown)
- **컴포넌트**: TableOfContents (목차 자동 생성)

### 파일 구조
```
src/app/blog/
├── layout.tsx              # 블로그 레이아웃 (공유/제보 기능)
├── page.tsx                # 블로그 목록 페이지
├── page-optimized.tsx      # 최적화된 목록 페이지
└── [slug]/
    ├── page.tsx            # 블로그 상세 페이지
    └── page-optimized.tsx  # 최적화된 상세 페이지
```

### 블로그 목록 페이지
**파일**: `src/app/blog/page.tsx`

**주요 기능**:
- ✅ 블로그 포스트 목록 표시
- ✅ 검색 기능
- ✅ 카테고리 필터
- ✅ 정렬 (최신순, 가나다순)
- ✅ 페이지네이션 (9개씩 표시)

**포스트 데이터 구조**:
```typescript
{
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
}
```

**샘플 포스트 카테고리** (11개):
- 여행기
- 가이드
- 캠핑
- 카페
- 건강
- 해외여행
- 훈련
- 영양
- 그루밍
- 행동
- 케어

**샘플 포스트 예시**:
- `jeju-dog-travel-guide` - 강아지와 함께하는 제주도 여행기
- `dog-cafe-selection-guide` - 강아지 카페 선택하는 방법
- `dog-camping-preparation-guide` - 반려견과 함께하는 캠핑 준비물
- `gangnam-dog-cafe-best5` - 서울 강남구 강아지 동반 카페 베스트 5
- `dog-health-travel-guide` - 강아지 여행 시 건강 관리법
- `dog-international-travel-guide` - 반려견과 함께하는 해외여행 준비
- `dog-training-basic-guide` - 강아지 기본 훈련의 모든 것
- `dog-food-nutrition-guide` - 강아지 사료 선택과 영양 관리
- `dog-grooming-home-guide` - 집에서 하는 강아지 그루밍
- `dog-behavior-problem-solving` - 강아지 문제 행동 해결하기
- `dog-senior-care-guide` - 시니어 강아지 케어 완벽 가이드

### 블로그 상세 페이지
**파일**: `src/app/blog/[slug]/page.tsx`

**주요 기능**:
- ✅ 마크다운 콘텐츠 렌더링 (`react-markdown`, `remark-gfm`)
- ✅ 목차 (TableOfContents) 자동 생성
- ✅ 메타데이터 표시 (작성자, 날짜, 카테고리, 읽기 시간)
- ✅ 공유 기능 (Web Share API 또는 클립보드 복사)
- ✅ 관련 포스트 추천
- ✅ 광고 슬롯 (`AdsenseSlot`)
- ✅ SEO 최적화 (메타데이터, JSON-LD, Open Graph)

**포스트 상세 데이터 구조**:
```typescript
{
  title: string
  excerpt: string
  content: string          // 마크다운 형식
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
}
```

**SEO 최적화**:
- 메타데이터 설정 (`Metadata`)
- JSON-LD 스키마 (BlogPosting)
- Open Graph 태그
- 지역 정보 (GEO) - 위도/경도 포함

### 블로그 컴포넌트

#### TableOfContents
**파일**: `src/components/blog/TableOfContents.tsx`

**기능**:
- 마크다운에서 헤딩(h2) 자동 추출
- 스크롤 위치에 따른 활성 섹션 하이라이트
- 클릭 시 해당 섹션으로 스크롤 (smooth scroll)
- 접기/펼치기 기능

**사용 예시**:
```tsx
import TableOfContents from '@/components/blog/TableOfContents'

<TableOfContents content={post.content} />
```

**구현 방식**:
- 정규식으로 마크다운 헤딩 추출 (`/^(#{2})\s+(.+)$/gm`)
- ID 자동 생성 (소문자, 하이픈 변환)
- 스크롤 이벤트 리스너로 활성 섹션 감지

### 블로그 레이아웃
**파일**: `src/app/blog/layout.tsx`

**기능**:
- 공유 기능 (Web Share API 또는 클립보드 복사)
- 제보하기 링크
- 공통 푸터 영역

---

## 🏗 구조 및 패턴

### 공통 패턴

#### 1. 페이지 구조
```tsx
'use client'  // 클라이언트 컴포넌트

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from 'lucide-react'

export default function UtilityPage() {
  // 상태 관리
  const [state, setState] = useState()
  
  // 계산된 값
  const computed = useMemo(() => {
    // ...
  }, [dependencies])
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 내용 */}
    </div>
  )
}
```

#### 2. 데이터 관리
- **유틸리티**: `src/lib/utilities/utilities-data.ts`에 중앙 집중식 관리
- **블로그**: 각 페이지에 하드코딩된 샘플 데이터 (향후 D1 DB로 마이그레이션 필요)

#### 3. 스타일링
- Tailwind CSS 사용
- 반응형 디자인 (모바일 우선)
- 일관된 색상 시스템:
  - 계산기: `text-blue-600`, `bg-blue-100`
  - 찾기: `text-green-600`, `bg-green-100`
  - 가이드: `text-purple-600`, `bg-purple-100`
  - 플래너: `text-orange-600`, `bg-orange-100`

#### 4. 아이콘
- Lucide React 사용
- 동적 아이콘 로딩:
```tsx
import * as LucideIcons from 'lucide-react'
const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Wrench
```

### 유틸리티 페이지 공통 구조

```tsx
// 1. 헤더 (뒤로가기 링크 + 제목)
<Link href="/utilities">← 유틸리티 목록으로</Link>
<h1 className="text-4xl font-bold">유틸리티 제목</h1>

// 2. 입력 폼 (계산기/플래너)
<div className="bg-white rounded-lg shadow p-6">
  <input />
  <select />
  <button onClick={calculate}>계산하기</button>
</div>

// 3. 결과 표시
<div className="bg-blue-50 rounded-lg p-6">
  <h2>결과</h2>
  <div>{result}</div>
</div>

// 4. 추가 정보/가이드
<div className="bg-gray-50 rounded-lg p-6">
  <h3>참고사항</h3>
  <ul>...</ul>
</div>
```

### 블로그 페이지 공통 구조

```tsx
// 1. 메타데이터
export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  // ...
}

// 2. 헤더 (제목, 메타 정보)
<header>
  <h1>{post.title}</h1>
  <div className="flex items-center gap-4">
    <span>{post.author}</span>
    <span>{post.date}</span>
    <span>{post.category}</span>
    <span>{post.readTime}</span>
  </div>
</header>

// 3. 목차
<TableOfContents content={post.content} />

// 4. 콘텐츠 (마크다운)
<article>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {post.content}
  </ReactMarkdown>
</article>

// 5. 관련 포스트
<div>
  <h2>관련 포스트</h2>
  {/* 관련 포스트 목록 */}
</div>
```

---

## 💡 개발 참고사항

### 유틸리티 개발 시

#### 1. 데이터 등록
```typescript
// src/lib/utilities/utilities-data.ts에 추가
{
  id: 'new-utility',
  title: '새 유틸리티',
  description: '설명',
  icon: 'IconName',  // Lucide icon name
  slug: 'new-utility',
  category: 'calculator',  // 또는 'finder', 'guide', 'planner'
  status: 'completed'
}
```

#### 2. 페이지 생성
- `src/app/utilities/{slug}/page.tsx` 생성
- 공통 구조 따르기:
  - 뒤로가기 링크
  - 제목 및 설명
  - 입력 폼
  - 결과 표시
  - 참고사항

#### 3. 아이콘 선택
- Lucide React 아이콘 사용
- 카테고리별 적절한 아이콘 선택
- 예: 계산기 → `Calculator`, 찾기 → `Search`, 가이드 → `BookOpen`

#### 4. 기능 구현 패턴
- **계산기**: 입력 → 계산 → 결과 표시
- **플래너**: 입력 → 일정 생성 → 관리
- **가이드**: 정보 제공 + 체크리스트
- **찾기**: 위치 기반 검색 + 결과 표시

### 블로그 개발 시

#### 1. 포스트 데이터 구조
```typescript
{
  slug: 'post-slug',
  title: '포스트 제목',
  excerpt: '요약',
  content: `# 마크다운 콘텐츠`,
  author: '작성자',
  date: '2024.10.28',
  category: '카테고리',
  readTime: '5분',
  image: '이미지 URL',
  tags: ['태그1', '태그2'],
  location: '지역',
  seoKeywords: ['키워드1', '키워드2'],
  geoLocation: {
    latitude: 37.5665,
    longitude: 126.9780,
    address: '주소'
  }
}
```

#### 2. 목차 자동 생성
- `TableOfContents` 컴포넌트 사용
- 마크다운 헤딩(h2) 자동 추출
- 스크롤 위치에 따른 활성 섹션 하이라이트

#### 3. SEO 최적화
- 메타데이터 설정 (`Metadata`)
- JSON-LD 스키마 (BlogPosting)
- Open Graph 태그
- 지역 정보 (GEO)

#### 4. 향후 개선
- D1 데이터베이스 연동
- 관리자 페이지에서 포스트 관리
- 템플릿 시스템 활용
- 자동 콘텐츠 생성

### 공통 컴포넌트

#### 사용 가능한 컴포넌트
- `TableOfContents` - 목차 컴포넌트 (`src/components/blog/TableOfContents.tsx`)
- `AdsenseSlot` - 광고 슬롯 (`src/components/ads/AdsenseSlot.tsx`)
- `PlaceCard` - 장소 카드 (`src/components/common/PlaceCard.tsx`)
- `EventCard` - 행사 카드 (`src/components/common/EventCard.tsx`)
- shadcn/ui 컴포넌트들 (`src/components/ui/`)

### 데이터 소스

#### 현재 상태
- **유틸리티**: 정적 데이터 (`utilities-data.ts`)
- **블로그**: 하드코딩된 샘플 데이터

#### 향후 개선
- D1 데이터베이스 연동
- API를 통한 동적 데이터 로딩
- 관리자 페이지에서 콘텐츠 관리
- 템플릿 시스템 활용

---

## 📊 통계

### 유틸리티
- **총 개수**: 102개
- **완료**: 102개 (100%)
- **카테고리별 분포**:
  - 계산기: 15개 (14.7%)
  - 찾기: 5개 (4.9%)
  - 가이드: 25개 (24.5%)
  - 플래너: 57개 (55.9%)

### 블로그
- **샘플 포스트**: 10개 이상
- **카테고리**: 11개
- **구조**: 목록 + 상세 페이지 완성
- **기능**: 검색, 필터, 정렬, 페이지네이션

---

## 🔗 관련 파일

### 유틸리티
- `src/lib/utilities/utilities-data.ts` - 유틸리티 데이터 정의 및 헬퍼 함수
- `src/app/utilities/page.tsx` - 유틸리티 목록 페이지
- `src/app/utilities/layout.tsx` - 유틸리티 레이아웃 (공유/제보/관련 유틸리티)
- `src/app/utilities/{slug}/page.tsx` - 각 유틸리티 페이지 (102개)

### 블로그
- `src/app/blog/page.tsx` - 블로그 목록 페이지
- `src/app/blog/[slug]/page.tsx` - 블로그 상세 페이지
- `src/app/blog/layout.tsx` - 블로그 레이아웃 (공유/제보 기능)
- `src/components/blog/TableOfContents.tsx` - 목차 컴포넌트

---

## 🎯 향후 개발 시 활용 방안

### 1. 유틸리티 확장
- 새로운 유틸리티 추가 시 기존 패턴 따르기
- `utilities-data.ts`에 등록 후 페이지 생성
- 공통 컴포넌트 재사용
- 계산 로직 유틸리티 함수화

### 2. 블로그 시스템 개선
- D1 데이터베이스 연동
- 관리자 페이지에서 포스트 작성/수정
- 템플릿 시스템 활용
- 자동 SEO 최적화
- 콘텐츠 자동 생성 (OpenAI)

### 3. 공통 기능 추출
- 계산 로직 유틸리티 함수화
- 폼 컴포넌트 공통화
- 데이터 검증 로직 공통화
- 공유 기능 컴포넌트화

### 4. 성능 최적화
- 이미지 최적화 (Next.js Image)
- 코드 분할 (동적 import)
- 캐싱 전략 (Cloudflare KV)
- 페이지네이션 개선 (Keyset cursor)

### 5. 사용자 경험 개선
- 로딩 상태 표시
- 에러 처리 개선
- 폼 검증 강화
- 결과 저장 기능 (로컬 스토리지)

---

## 📝 코드 예시

### 유틸리티 페이지 예시
```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator } from 'lucide-react'

export default function DogAgeCalculatorPage() {
  const [breedSize, setBreedSize] = useState('medium')
  const [dogAge, setDogAge] = useState(0)
  const [humanAge, setHumanAge] = useState(0)

  const calculateHumanAge = () => {
    const multipliers = { small: 7, medium: 6.5, large: 6 }
    const multiplier = multipliers[breedSize] || 7
    setHumanAge(Math.round(dogAge * multiplier * 10) / 10)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/utilities">← 유틸리티 목록으로</Link>
        <h1 className="text-4xl font-bold mb-4">반려견 나이 계산기</h1>
        
        {/* 입력 폼 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <input
            type="number"
            value={dogAge}
            onChange={(e) => {
              setDogAge(parseFloat(e.target.value) || 0)
              calculateHumanAge()
            }}
          />
          <select
            value={breedSize}
            onChange={(e) => {
              setBreedSize(e.target.value)
              calculateHumanAge()
            }}
          >
            <option value="small">소형견</option>
            <option value="medium">중형견</option>
            <option value="large">대형견</option>
          </select>
        </div>

        {/* 결과 */}
        {humanAge > 0 && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">결과</h2>
            <p className="text-xl">사람 나이로 약 {humanAge}세입니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 블로그 상세 페이지 예시
```tsx
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TableOfContents from '@/components/blog/TableOfContents'

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <div>{post.author} · {post.date}</div>
      </header>

      <TableOfContents content={post.content} />

      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
```

---

## ✅ 체크리스트

### 유틸리티 개발 시
- [ ] `utilities-data.ts`에 항목 추가
- [ ] 페이지 파일 생성 (`src/app/utilities/{slug}/page.tsx`)
- [ ] 공통 구조 따르기
- [ ] 아이콘 선택 및 적용
- [ ] 기능 구현 및 테스트
- [ ] 반응형 디자인 확인

### 블로그 개발 시
- [ ] 포스트 데이터 구조 정의
- [ ] 마크다운 콘텐츠 작성
- [ ] 메타데이터 설정
- [ ] SEO 최적화 (JSON-LD, Open Graph)
- [ ] 목차 자동 생성 확인
- [ ] 관련 포스트 연결

---

**마지막 업데이트**: 2025년 1월  
**다음 리뷰**: 새로운 기능 추가 시
