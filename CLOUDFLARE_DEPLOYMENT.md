# 클라우드플레어 호스팅 가이드

## 🚀 클라우드플레어 Pages 배포 가이드

### 1단계: 클라우드플레어 계정 설정

1. **클라우드플레어 계정 생성**
   - [cloudflare.com](https://cloudflare.com)에서 계정 생성
   - 무료 플랜으로 시작 가능

2. **Wrangler CLI 설치**
   ```bash
   npm install -g wrangler
   ```

3. **클라우드플레어 로그인**
   ```bash
   wrangler login
   ```

### 2단계: D1 데이터베이스 설정

1. **D1 데이터베이스 생성**
   ```bash
   wrangler d1 create dogwhere-db
   ```

2. **데이터베이스 스키마 적용**
   ```bash
   npm run db:migrate
   ```

3. **샘플 데이터 삽입**
   ```bash
   npm run db:seed
   ```

### 3단계: 환경변수 설정

1. **클라우드플레어 대시보드에서 환경변수 설정**
   - Pages 프로젝트 → Settings → Environment variables
   - 다음 변수들을 설정:

   ```
   GOOGLE_PLACES_KEY=your_google_places_api_key
   KAKAO_API_KEY=your_kakao_api_key
   OPENAI_API_KEY=your_openai_api_key
   INTERNAL_TOKEN=your_internal_token
   CF_KV_NAMESPACE=your_kv_namespace_id
   CF_D1_BINDING=your_d1_database_id
   CF_R2_BUCKET=your_r2_bucket_name
   NEXT_PUBLIC_API_URL=https://your-domain.pages.dev
   ```

### 4단계: GitHub 연동

1. **GitHub 저장소 생성**
   - 프로젝트를 GitHub에 푸시

2. **클라우드플레어 Pages 프로젝트 생성**
   - Pages 대시보드 → Create a project
   - GitHub 저장소 연결
   - 빌드 설정:
     - Build command: `npm run build`
     - Build output directory: `out`
     - Root directory: `/`

### 5단계: 도메인 설정

1. **커스텀 도메인 연결**
   - Pages 프로젝트 → Custom domains
   - 도메인 추가 및 DNS 설정

2. **SSL 인증서 자동 설정**
   - 클라우드플레어가 자동으로 SSL 인증서 발급

### 6단계: 배포 및 테스트

1. **자동 배포 확인**
   - GitHub에 푸시하면 자동 배포
   - 또는 수동 배포: `npm run deploy`

2. **기능 테스트**
   - 홈페이지 접속 확인
   - API 엔드포인트 테스트
   - 관리자 대시보드 접속 확인

### 7단계: 성능 최적화

1. **캐시 설정**
   - 이미지 최적화
   - API 응답 캐싱
   - CDN 활용

2. **모니터링 설정**
   - Analytics 활성화
   - 성능 메트릭 확인

## 🔧 문제 해결

### 일반적인 문제들

1. **빌드 실패**
   - 환경변수 확인
   - 의존성 설치 확인
   - Next.js 설정 확인

2. **API 오류**
   - D1 데이터베이스 연결 확인
   - 환경변수 설정 확인
   - CORS 설정 확인

3. **이미지 로딩 문제**
   - 이미지 URL 확인
   - remotePatterns 설정 확인

## 📊 비용 정보

### 무료 플랜 제한
- **Pages**: 월 500회 빌드, 20,000 요청
- **D1**: 월 5GB 읽기, 100,000 쓰기
- **Workers**: 월 100,000 요청
- **R2**: 월 10GB 저장, 1,000,000 요청

### 유료 플랜 (필요시)
- **Pages Pro**: $20/월
- **Workers Paid**: $5/월 + 사용량
- **D1 Paid**: 사용량 기반

## 🎯 다음 단계

1. **실제 데이터 수집**
   - Google Places API 연동
   - 카카오 플레이스 API 연동

2. **사용자 인증**
   - Firebase Auth 또는 Auth0 연동

3. **실시간 기능**
   - WebSocket 또는 Server-Sent Events

4. **모바일 최적화**
   - PWA 설정
   - 모바일 UI 개선

## 📞 지원

문제가 발생하면:
1. 클라우드플레어 문서 확인
2. GitHub Issues 생성
3. 커뮤니티 포럼 활용
