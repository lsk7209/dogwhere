# 개발 로드맵 및 우선순위

**프로젝트**: 어서오개 (dogwhere)  
**작성일**: 2025년 1월  
**현재 상태**: 배포 설정 완료, 핵심 기능 개발 필요

---

## 📊 현재 상태

### ✅ 완료된 작업
- [x] 프로젝트 구조 설정
- [x] 배포 설정 (Cloudflare Pages)
- [x] 기본 라우팅 구조
- [x] SEO 최적화 기본 설정
- [x] TypeScript 타입 정의

### ⚠️ 발견된 문제점
- [ ] 보안 취약점 (Critical)
- [ ] 인메모리 데이터베이스 사용
- [ ] 타입 안전성 개선 필요
- [ ] 에러 처리 표준화 필요

---

## 🎯 개발 우선순위

### 🔴 Phase 1: 보안 및 인프라 (1-2주) - 즉시 시작

#### 1.1 보안 강화 (Critical) ⚠️
**우선순위**: 최우선  
**예상 시간**: 2-3일

- [ ] **인증 시스템 개선**
  - JWT 토큰 도입 (`jsonwebtoken` 패키지)
  - 비밀번호 해싱 (bcrypt)
  - 토큰 갱신 메커니즘
  - 파일: `src/app/api/admin/auth/login/route.ts`

- [ ] **환경변수 필수화**
  - 환경변수 검증 (zod 사용)
  - 기본값 제거
  - 파일: `src/lib/env.ts` 생성

- [ ] **API 보안 강화**
  - Rate Limiting 추가
  - CORS 설정 개선
  - Input Validation 강화

**예상 결과**: 보안 점수 4/10 → 8/10

#### 1.2 데이터베이스 마이그레이션 (High Priority)
**우선순위**: 높음  
**예상 시간**: 3-5일

- [ ] **D1 데이터베이스 마이그레이션**
  - 인메모리 DB → Cloudflare D1
  - 스키마 적용 (`schema.sql` 이미 정의됨)
  - 데이터 마이그레이션 스크립트 작성
  - 파일: `src/lib/database/simple-places.ts` → D1 사용

- [ ] **Repository 패턴 구현**
  - `PlaceRepository` 클래스 생성
  - `EventRepository` 클래스 생성
  - `PostRepository` 클래스 생성
  - 파일: `src/lib/repositories/` 디렉토리

- [ ] **데이터 영속성 확보**
  - 인메모리 DB 제거
  - D1 쿼리 최적화
  - 인덱스 확인 및 추가

**예상 결과**: 데이터 영속성 확보, 확장성 개선

---

### 🟡 Phase 2: 핵심 기능 구현 (2-3주)

#### 2.1 데이터 수집 시스템 (High Priority)
**우선순위**: 높음  
**예상 시간**: 5-7일

- [ ] **공개 API 연동**
  - Google Places API 연동 강화
  - 카카오 플레이스 API 연동 강화
  - 데이터 정규화 로직 개선
  - 파일: `src/lib/data-collection/`

- [ ] **데이터 검증 및 중복 제거**
  - 중복 장소 감지 알고리즘
  - 데이터 품질 검증
  - 자동 정규화 로직

- [ ] **배치 작업 시스템**
  - 크론 작업 설정
  - 자동 데이터 수집
  - 파일: `functions/_cron.ts`, `src/app/api/jobs/`

#### 2.2 콘텐츠 생성 시스템 (High Priority)
**우선순위**: 높음  
**예상 시간**: 5-7일

- [ ] **템플릿 시스템 완성**
  - Place 템플릿 (250±30자)
  - Event 템플릿
  - Blog 템플릿 (TopN/초행가이드/산책코스)
  - 파일: `src/lib/templates/`

- [ ] **AI 콘텐츠 생성**
  - OpenAI API 연동
  - 프롬프트 캐싱
  - 콘텐츠 보강 로직
  - 파일: `src/lib/ai/` (신규)

- [ ] **발행 API 완성**
  - `/api/publish` 엔드포인트 완성
  - 멱등성 키 처리
  - 스키마 버전 관리
  - 파일: `src/app/api/publish/route.ts`

#### 2.3 점수 및 추천 시스템 (Medium Priority)
**우선순위**: 중간  
**예상 시간**: 3-5일

- [ ] **O-Dog 점수 계산**
  - 점수 알고리즘 구현
  - 안전 모드 계산
  - 파일: `src/lib/scoring/oDogScore.ts` (확장)

- [ ] **CQS (Content Quality Score) 계산**
  - 품질 게이트 구현
  - CQS < 0.85 → noindex 처리
  - 파일: `src/lib/scoring/cqsScore.ts` (확장)

- [ ] **추천 시스템**
  - 오늘의 추천 알고리즘 개선
  - 지역별 추천 로직
  - 파일: `src/app/api/recommendations/today/route.ts`

---

### 🟢 Phase 3: 프론트엔드 개선 (2-3주)

#### 3.1 페이지 구현 (High Priority)
**우선순위**: 높음  
**예상 시간**: 7-10일

- [ ] **홈페이지 완성**
  - 오늘의 추천 3개 표시
  - O-Dog 점수 표시
  - 안전 배지 표시
  - 광고 슬롯 3개
  - 파일: `src/app/page.tsx`

- [ ] **지역 허브 페이지**
  - `/{sido}` 페이지
  - `/{sido}/{sig}` 페이지
  - 필터 및 정렬 기능
  - 리스트/지도 토글
  - 파일: `src/app/seoul/[sig]/page.tsx` (확장)

- [ ] **클러스터 페이지**
  - `/{sido}/{sig}/{category}` 페이지
  - Thin 게이트 로직 (≥6개 장소)
  - 파일: `src/app/seoul/[sig]/[category]/page.tsx`

- [ ] **상세 페이지**
  - 장소 상세 페이지 (`/place/[slug]`)
  - 행사 상세 페이지 (`/event/[slug]`)
  - 블로그 상세 페이지 (`/blog/[slug]`)
  - 파일: `src/app/place/[slug]/page.tsx` 등

#### 3.2 공통 컴포넌트 (Medium Priority)
**우선순위**: 중간  
**예상 시간**: 3-5일

- [ ] **카드 컴포넌트**
  - `PlaceCard` 개선
  - `EventCard` 개선
  - `PostCard` 생성
  - 파일: `src/components/common/`

- [ ] **UI 컴포넌트**
  - `ScoreBadge` (O-Dog 점수 표시)
  - `SafetyBadge` (안전 배지)
  - `TagIcons` 개선
  - `AdSlot` 개선
  - 파일: `src/components/ui/`, `src/components/common/`

- [ ] **지도 컴포넌트**
  - `MapCluster` 컴포넌트
  - 지도 통합 (선택: Kakao Map, Naver Map)
  - 파일: `src/components/map/` (신규)

---

### 🔵 Phase 4: SEO 및 성능 최적화 (1-2주)

#### 4.1 SEO 최적화 (High Priority)
**우선순위**: 높음  
**예상 시간**: 3-5일

- [ ] **JSON-LD 스키마**
  - ItemList 스키마
  - LocalBusiness/Place 스키마
  - Event 스키마
  - FAQPage 스키마
  - 파일: `src/lib/seo/jsonLd.ts` (확장)

- [ ] **사이트맵 생성**
  - 분할 사이트맵 생성기
  - 증분 lastmod 업데이트
  - 허브/클러스터/포스트 사이트맵
  - 파일: `src/lib/seo/sitemap.ts` (확장)

- [ ] **OG 이미지 생성**
  - `/api/og` 엔드포인트 완성
  - Top3 카드 생성기
  - 파일: `src/app/api/og/route.tsx` (확장)

#### 4.2 성능 최적화 (Medium Priority)
**우선순위**: 중간  
**예상 시간**: 3-5일

- [ ] **캐싱 전략**
  - Cloudflare KV 캐싱
  - API 응답 캐싱
  - 이미지 캐싱

- [ ] **페이지네이션**
  - Keyset cursor 구현
  - 무한 스크롤 (선택)

- [ ] **성능 모니터링**
  - Core Web Vitals 측정
  - 성능 메트릭 수집
  - LCP < 2.5s 목표

---

### 🟣 Phase 5: 코드 품질 개선 (1-2주)

#### 5.1 타입 안전성 강화 (Medium Priority)
**우선순위**: 중간  
**예상 시간**: 3-5일

- [ ] **타입 정의 개선**
  - `any` 타입 제거 (23개 파일)
  - API 응답 타입 정의
  - 환경변수 타입 정의
  - 파일: `src/types/api.ts` (신규)

- [ ] **함수 반환 타입 명시**
  - 모든 함수에 명시적 반환 타입 추가

#### 5.2 에러 처리 표준화 (Medium Priority)
**우선순위**: 중간  
**예상 시간**: 2-3일

- [ ] **공통 에러 핸들러**
  - `ApiError` 클래스 생성
  - `handleApiError` 함수 생성
  - 파일: `src/lib/api-error.ts` (신규)

- [ ] **에러 바운더리**
  - React Error Boundary 추가
  - 파일: `src/components/ErrorBoundary.tsx` (신규)

#### 5.3 로깅 시스템 개선 (Low Priority)
**우선순위**: 낮음  
**예상 시간**: 1-2일

- [ ] **구조화된 로깅**
  - 로거 유틸리티 생성
  - 프로덕션 로그 제거
  - 파일: `src/lib/logger.ts` (신규)

---

## 📅 개발 일정 (예상)

### 1주차 (Phase 1.1)
- 보안 강화 (JWT, 환경변수 검증)

### 2주차 (Phase 1.2)
- D1 데이터베이스 마이그레이션

### 3-4주차 (Phase 2.1, 2.2)
- 데이터 수집 시스템
- 콘텐츠 생성 시스템

### 5주차 (Phase 2.3, 3.1 시작)
- 점수 및 추천 시스템
- 홈페이지 완성

### 6-7주차 (Phase 3.1, 3.2)
- 페이지 구현 완료
- 공통 컴포넌트

### 8주차 (Phase 4.1, 4.2)
- SEO 최적화
- 성능 최적화

### 9-10주차 (Phase 5)
- 코드 품질 개선
- 테스트 및 버그 수정

---

## 🎯 MVP 목표 (런칭 기준)

### 필수 기능
- [x] 기본 라우팅 구조
- [ ] 보안 강화 완료
- [ ] D1 데이터베이스 연동
- [ ] 데이터 수집 시스템
- [ ] 홈페이지 (추천 3개)
- [ ] 지역 허브 페이지
- [ ] 장소 상세 페이지
- [ ] 기본 SEO 설정

### 성능 목표
- LCP < 2.5s
- CLS < 0.1
- TTFB < 800ms
- API 실패율 < 1%

### KPI 목표 (런칭 D+30)
- 일 500+ PV
- 재방문율 22%+
- RPM 3-5 USD
- 인덱스 1.5k+

---

## 📝 다음 단계 (즉시 시작)

### 1단계: 보안 강화 (즉시 시작)
```bash
# 1. JWT 패키지 설치
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs

# 2. zod 설치 (환경변수 검증)
npm install zod

# 3. 작업 시작
# - src/lib/env.ts 생성
# - src/app/api/admin/auth/login/route.ts 수정
```

### 2단계: D1 마이그레이션 준비
```bash
# 1. D1 스키마 확인
cat schema.sql

# 2. 마이그레이션 스크립트 작성
# - scripts/migrate-to-d1.ts 확장
# - src/lib/database/d1-repository.ts 완성
```

---

## 🔗 관련 문서

- [코드 검토 요약](./CODE_REVIEW_SUMMARY.md)
- [코드 검토 상세](./CODE_REVIEW_DETAILED.md)
- [PRD](./PRD.md)
- [배포 가이드](./DEPLOYMENT_SUMMARY.md)

---

**마지막 업데이트**: 2025년 1월  
**다음 리뷰**: Phase 1 완료 후

