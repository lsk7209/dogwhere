# 어서오개 (EOSEO-O-GAE) 개발문서

## 📋 프로젝트 개요

**어서오개**는 전국 강아지 동반 장소, 행사, 가이드를 통합 관리하는 웹 서비스입니다. 사용자가 강아지와 함께 갈 수 있는 최적의 장소를 찾을 수 있도록 도와주는 플랫폼입니다.

### 🎯 주요 기능
- **장소 검색**: 지역별, 카테고리별 강아지 동반 장소 검색
- **행사 정보**: 강아지 관련 행사 및 이벤트 정보 제공
- **가이드**: 강아지 동반 여행 가이드 및 팁 제공
- **블로그**: 강아지 관련 유용한 정보 블로그
- **관리자 대시보드**: 장소 및 콘텐츠 관리 시스템

## 🏗️ 기술 스택

### Frontend
- **Next.js 16**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui**: 고품질 UI 컴포넌트 라이브러리
- **React Query**: 서버 상태 관리
- **Lucide React**: 아이콘 라이브러리

### Backend & Database
- **클라우드플레어 D1**: SQLite 기반 서버리스 데이터베이스
- **클라우드플레어 Workers**: 서버리스 함수 실행
- **클라우드플레어 R2**: 객체 스토리지
- **클라우드플레어 KV**: 키-값 스토리지

### External APIs
- **Google Places API**: 장소 정보 수집
- **카카오 플레이스 API**: 한국 내 장소 정보
- **OpenAI API**: 콘텐츠 생성 및 향상
- **기상청 API**: 날씨 정보

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # 관리자 페이지
│   │   ├── dashboard/           # 대시보드
│   │   ├── places/             # 장소 관리
│   │   ├── events/             # 행사 관리
│   │   ├── posts/              # 포스트 관리
│   │   ├── templates/          # 템플릿 관리
│   │   └── settings/           # 설정
│   ├── api/                     # API 라우트
│   │   ├── admin/              # 관리자 API
│   │   ├── places/             # 장소 API
│   │   ├── events/             # 행사 API
│   │   ├── jobs/               # 배치 작업 API
│   │   └── recommendations/    # 추천 API
│   ├── blog/                   # 블로그 페이지
│   ├── guide/                  # 가이드 페이지
│   ├── events/                 # 행사 페이지
│   ├── place/                  # 장소 상세 페이지
│   ├── seoul/                  # 서울 지역 페이지
│   └── recommendations/        # 추천 페이지
├── components/                  # 재사용 가능한 컴포넌트
│   ├── common/                 # 공통 컴포넌트
│   ├── layout/                 # 레이아웃 컴포넌트
│   ├── regions/                # 지역 관련 컴포넌트
│   └── ui/                     # UI 컴포넌트
├── lib/                        # 유틸리티 및 라이브러리
│   ├── database/               # 데이터베이스 관련
│   ├── data-collection/        # 데이터 수집 시스템
│   ├── regions/                # 지역 관리
│   ├── scoring/                # 점수 계산
│   ├── seo/                    # SEO 관련
│   └── templates/              # 템플릿 시스템
└── types/                      # TypeScript 타입 정의
```

## 🗄️ 데이터베이스 스키마

### Places 테이블
```sql
CREATE TABLE places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  sido TEXT NOT NULL,
  sigungu TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT,
  website TEXT,
  overall_rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT 0,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 주요 테이블
- **places**: 장소 정보
- **reviews**: 리뷰 및 평점
- **events**: 행사 정보
- **posts**: 블로그 포스트
- **recommendations**: 추천 콘텐츠
- **regions**: 지역 정보

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Git

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 환경변수 설정
```bash
# .env.local 파일 생성
GOOGLE_PLACES_KEY=your_google_places_api_key
KAKAO_API_KEY=your_kakao_api_key
OPENAI_API_KEY=your_openai_api_key
INTERNAL_TOKEN=your_internal_token
CF_KV_NAMESPACE=your_kv_namespace_id
CF_D1_BINDING=your_d1_database_id
CF_R2_BUCKET=your_r2_bucket_name
NEXT_PUBLIC_API_URL=https://your-domain.pages.dev
```

## 🚀 배포 가이드

### 클라우드플레어 Pages 배포

1. **클라우드플레어 계정 설정**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **D1 데이터베이스 생성**
   ```bash
   wrangler d1 create dogwhere-db
   ```

3. **데이터베이스 스키마 적용**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **GitHub 연동 및 자동 배포**
   - GitHub 저장소 생성
   - 클라우드플레어 Pages 프로젝트 생성
   - GitHub 저장소 연결
   - 자동 배포 설정

### 배포 스크립트
```bash
# 수동 배포
npm run deploy

# 데이터베이스 마이그레이션
npm run db:migrate

# 샘플 데이터 삽입
npm run db:seed
```

## 📊 주요 기능 상세

### 1. 장소 검색 시스템
- **지역별 검색**: 시/도, 시/군/구 단위 검색
- **카테고리별 검색**: 카페, 식당, 숙박, 쇼핑 등
- **필터링**: 펫 크기, 가격대, 편의시설별 필터
- **거리 기반 검색**: 현재 위치 기준 반경 검색

### 2. 데이터 수집 시스템
- **Google Places API**: 전 세계 장소 정보 수집
- **카카오 플레이스 API**: 한국 내 상세 정보
- **자동 정규화**: 외부 API 데이터를 내부 스키마로 변환
- **중복 제거**: 이름과 주소 기준 중복 장소 제거

### 3. 관리자 대시보드
- **장소 관리**: CRUD 작업, 검증, 추천 설정
- **데이터 수집**: 원클릭 데이터 수집 실행
- **통계 대시보드**: 수집 현황, 검증 상태 모니터링
- **템플릿 관리**: 콘텐츠 생성 템플릿 관리

### 4. SEO/GEO/AEO 최적화
- **메타데이터**: 동적 title, description, keywords
- **구조화된 데이터**: JSON-LD 스키마 적용
- **Open Graph**: 소셜 미디어 공유 최적화
- **지역 정보**: 지역별 SEO 최적화

## 🎨 UI/UX 특징

### 디자인 시스템
- **Pretendard 폰트**: 한국어 최적화 폰트
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크 모드**: 시스템 설정 기반 자동 전환
- **접근성**: WCAG 가이드라인 준수

### 컴포넌트 구조
- **Layout**: Header, Footer, Navigation
- **Cards**: PlaceCard, EventCard, PostCard
- **Forms**: 검색, 필터, 관리자 폼
- **Modals**: 상세 정보, 이미지 뷰어

## 🔒 보안 및 인증

### API 보안
- **Bearer Token**: 관리자 API 인증
- **CORS 설정**: 적절한 CORS 정책
- **Rate Limiting**: API 호출 제한
- **Input Validation**: 입력 데이터 검증

### 데이터 보호
- **SQL Injection 방지**: Prepared Statement 사용
- **XSS 방지**: 입력 데이터 sanitization
- **CSRF 보호**: CSRF 토큰 사용

## 📈 성능 최적화

### 프론트엔드 최적화
- **이미지 최적화**: Next.js Image 컴포넌트
- **코드 분할**: 동적 import 사용
- **캐싱**: React Query 캐싱 전략
- **번들 최적화**: Tree shaking, 압축

### 백엔드 최적화
- **데이터베이스 인덱싱**: 검색 성능 향상
- **API 캐싱**: Cloudflare 캐싱 활용
- **CDN**: 글로벌 콘텐츠 배포
- **압축**: Gzip/Brotli 압축

## 🧪 테스트 전략

### 테스트 유형
- **단위 테스트**: 개별 함수/컴포넌트 테스트
- **통합 테스트**: API 엔드포인트 테스트
- **E2E 테스트**: 사용자 시나리오 테스트
- **성능 테스트**: 로딩 시간, 응답 시간 측정

### 테스트 도구
- **Jest**: 단위 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트
- **Playwright**: E2E 테스트
- **Lighthouse**: 성능 및 접근성 테스트

## 📝 개발 가이드라인

### 코드 스타일
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안전성
- **컴포넌트 네이밍**: PascalCase 사용

### Git 워크플로우
- **브랜치 전략**: main, develop, feature 브랜치
- **커밋 메시지**: Conventional Commits 사용
- **PR 리뷰**: 코드 리뷰 필수
- **CI/CD**: 자동 빌드 및 배포

### 문서화
- **README**: 프로젝트 개요 및 설치 가이드
- **API 문서**: Swagger/OpenAPI 사용
- **컴포넌트 문서**: Storybook 사용
- **코드 주석**: JSDoc 형식 사용

## 🚧 향후 개발 계획

### 단기 계획 (1-2개월)
- [ ] 사용자 인증 시스템 구현
- [ ] 리뷰 및 평점 시스템
- [ ] 실시간 알림 시스템
- [ ] 모바일 앱 (PWA)

### 중기 계획 (3-6개월)
- [ ] 지도 서비스 통합
- [ ] 채팅 시스템
- [ ] 예약 시스템
- [ ] 결제 시스템

### 장기 계획 (6개월+)
- [ ] AI 추천 시스템
- [ ] 다국어 지원
- [ ] 마케팅 자동화
- [ ] 데이터 분석 대시보드

## 📞 지원 및 문의

### 개발팀 연락처
- **프로젝트 관리자**: [이메일]
- **기술 문의**: [이메일]
- **버그 리포트**: GitHub Issues

### 문서 및 리소스
- **API 문서**: [링크]
- **디자인 시스템**: [링크]
- **배포 가이드**: [링크]

---

**마지막 업데이트**: 2024년 10월 28일
**문서 버전**: 1.0.0
