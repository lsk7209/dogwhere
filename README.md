# 어서오개 (EOSEO-O-GAE) 🐕

> 전국 강아지 동반 장소, 행사, 가이드를 통합 관리하는 웹 서비스

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)

## 🚀 주요 기능

### 🏠 사용자 기능
- **지역별 장소 검색**: 시/도, 시/군/구 단위 강아지 동반 장소 검색
- **카테고리별 필터링**: 카페, 식당, 숙박, 쇼핑, 놀이시설 등
- **행사 정보**: 강아지 관련 행사 및 이벤트 정보
- **가이드 & 블로그**: 강아지 동반 여행 가이드 및 유용한 정보
- **실시간 추천**: 오늘의 추천 장소 및 맞춤형 추천

### 🔧 관리자 기능
- **데이터 수집**: Google Places, 카카오 플레이스 API 자동 수집
- **콘텐츠 관리**: 장소, 행사, 블로그 포스트 관리
- **통계 대시보드**: 수집 현황, 검증 상태, 사용자 통계
- **템플릿 시스템**: MDX 기반 콘텐츠 생성 및 관리

## 🛠 기술 스택

### Frontend
- **Next.js 16**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성 보장
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui**: 고품질 UI 컴포넌트 라이브러리
- **React Query**: 서버 상태 관리
- **Pretendard**: 한국어 최적화 폰트

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

## 🔍 SEO/GEO/AEO 최적화

### SEO 최적화
- ✅ **완전한 메타데이터**: title, description, keywords, authors, canonical URL
- ✅ **Open Graph & Twitter Cards**: 소셜 미디어 공유 최적화
- ✅ **구조화된 데이터 (JSON-LD)**: BlogPosting 스키마로 검색엔진 이해도 향상
- ✅ **로봇 최적화**: Google Bot 특별 설정으로 크롤링 효율성 증대

### GEO 최적화
- ✅ **지역 정보 표시**: 포스트별 관련 지역 정보 시각화
- ✅ **지리적 좌표**: 위도/경도 데이터로 지역 검색 최적화
- ✅ **지역별 키워드**: "제주도 강아지 여행", "강남구 강아지 카페" 등 지역 검색 의도 대응

### AEO 최적화
- ✅ **질문-답변 구조**: FAQ 스타일 콘텐츠로 답변 엔진 친화적 구성
- ✅ **키워드 최적화**: 검색 의도별 키워드 설정으로 답변 정확도 향상
- ✅ **구조화된 가이드**: 단계별 가이드와 체크리스트로 사용자 질문에 직접 답변

자세한 내용은 [블로그 템플릿 최적화 규칙문서](docs/blog-template-seo-optimization.md)를 참조하세요.

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
docs/                           # 프로젝트 문서
├── blog-template-seo-optimization.md  # 블로그 템플릿 최적화 규칙
└── DEVELOPMENT.md              # 개발문서
```

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/lsk7209/dogwhere.git
cd dogwhere
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp env.example .env.local
# .env.local 파일을 편집하여 API 키들을 설정하세요
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 확인
- 메인 사이트: `http://localhost:3000`
- 관리자 페이지: `http://localhost:3000/admin/login`

## 🔧 환경 변수 설정

```env
# API 키
GOOGLE_PLACES_KEY=your_google_places_api_key
KAKAO_API_KEY=your_kakao_api_key
OPENAI_API_KEY=your_openai_api_key

# 내부 토큰
INTERNAL_TOKEN=your_internal_token

# 클라우드플레어 설정
CF_KV_NAMESPACE=your_kv_namespace_id
CF_D1_BINDING=your_d1_database_id
CF_R2_BUCKET=your_r2_bucket_name

# 공개 API URL
NEXT_PUBLIC_API_URL=https://your-domain.pages.dev
```

## 🌐 배포

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

자세한 배포 가이드는 [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)를 참조하세요.

## 📊 주요 기능 상세

### 🔍 장소 검색 시스템
- **지역별 검색**: 시/도, 시/군/구 단위 검색
- **카테고리별 검색**: 카페, 식당, 숙박, 쇼핑 등
- **필터링**: 펫 크기, 가격대, 편의시설별 필터
- **거리 기반 검색**: 현재 위치 기준 반경 검색

### 🤖 데이터 수집 시스템
- **Google Places API**: 전 세계 장소 정보 수집
- **카카오 플레이스 API**: 한국 내 상세 정보
- **자동 정규화**: 외부 API 데이터를 내부 스키마로 변환
- **중복 제거**: 이름과 주소 기준 중복 장소 제거

### 👨‍💼 관리자 대시보드
- **장소 관리**: CRUD 작업, 검증, 추천 설정
- **데이터 수집**: 원클릭 데이터 수집 실행
- **통계 대시보드**: 수집 현황, 검증 상태 모니터링
- **템플릿 관리**: 콘텐츠 생성 템플릿 관리

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

## 🧪 테스트

```bash
# 린팅 검사
npm run lint

# 타입 검사
npm run type-check

# 빌드 테스트
npm run build

# 프로덕션 서버 실행
npm start
```

## 📝 문서

- [개발문서](DEVELOPMENT.md) - 상세한 개발 가이드
- [클라우드플레어 배포 가이드](CLOUDFLARE_DEPLOYMENT.md) - 배포 방법
- [블로그 템플릿 최적화](docs/blog-template-seo-optimization.md) - SEO/GEO/AEO 최적화

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

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원 및 문의

- **프로젝트 관리자**: [이메일]
- **기술 문의**: [이메일]
- **버그 리포트**: [GitHub Issues](https://github.com/lsk7209/dogwhere/issues)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

**마지막 업데이트**: 2024년 10월 28일  
**문서 버전**: 1.0.0