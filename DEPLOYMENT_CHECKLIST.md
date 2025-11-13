# 배포 체크리스트 및 문제 해결 가이드

## ✅ 수정 완료 사항

### 1. `next.config.ts` 수정
- ✅ `output: 'export'` 제거
- ✅ API 라우트 지원 활성화

### 2. API 라우트 동적 설정 수정
다음 파일들이 `force-dynamic`으로 변경되었습니다:
- ✅ `src/app/api/admin/auth/login/route.ts`
- ✅ `src/app/api/jobs/simple-collect/route.ts`
- ✅ `src/app/api/simple-places/route.ts`
- ✅ `src/app/api/events/route.ts`
- ✅ `src/app/api/admin/templates/route.ts`
- ✅ `src/app/api/jobs/ingest/[jobType]/route.ts`
- ✅ `src/app/api/publish/route.ts`
- ✅ `src/app/api/recommendations/today/route.ts`
- ✅ `src/app/api/og/route.tsx`

### 3. 정적 라우트 유지
다음 라우트들은 정적 생성이 적합하므로 `force-static` 유지:
- `src/app/rss*.xml/route.ts` (RSS 피드)
- `src/app/sitemap*.xml/route.ts` (사이트맵)
- `src/app/robots.txt/route.ts` (robots.txt)

## 📋 배포 전 체크리스트

### Cloudflare Pages 설정

- [ ] **프로젝트 생성 완료**
  - Project name: `dogwhere`
  - Production branch: `main`
  - Framework preset: `Next.js` (Static HTML Export 아님!)
  - Build command: `npm run build`
  - Build output directory: `.next` (또는 자동 감지)

- [ ] **환경변수 설정** (Settings → Environment variables)
  ```
  GOOGLE_PLACES_KEY=your_key
  KAKAO_API_KEY=your_key
  OPENAI_API_KEY=your_key
  INTERNAL_TOKEN=your_token
  ADMIN_USERNAME=your_admin_username
  ADMIN_PASSWORD=your_admin_password
  NEXT_PUBLIC_SITE_URL=https://dogwhere.pages.dev
  NODE_ENV=production
  ```

- [ ] **D1 데이터베이스 바인딩** (Settings → Functions → D1 Database bindings)
  ```
  Variable name: DB
  D1 Database: dogwhere-db
  ```

- [ ] **Node.js 버전 설정** (필요시)
  - Settings → Builds & deployments → Environment variables
  - `NODE_VERSION=18` 추가

### 로컬 테스트

- [ ] **의존성 설치**
  ```bash
  npm install
  ```

- [ ] **로컬 빌드 테스트**
  ```bash
  npm run build
  ```

- [ ] **빌드 성공 확인**
  - `out/` 또는 `.next/` 디렉토리 생성 확인
  - 빌드 에러 없음 확인

### 코드 검증

- [ ] **API 라우트 동적 설정 확인**
  - 동적 기능 사용하는 API는 `force-dynamic`
  - 정적 콘텐츠는 `force-static`

- [ ] **환경변수 사용 확인**
  - 하드코딩된 값 없음
  - `process.env` 사용 확인

## 🚀 배포 프로세스

### 1. 코드 커밋 및 푸시

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "Fix deployment configuration: remove output export, update API routes to dynamic"

# 푸시
git push origin main
```

### 2. 자동 배포 확인

1. **Cloudflare Dashboard 접속**
   - Pages → dogwhere → Deployments

2. **배포 상태 확인**
   - 새로운 배포가 자동으로 시작됨
   - 빌드 로그 확인

3. **배포 완료 대기**
   - 빌드 시간: 약 5-10분
   - 성공 시 자동으로 프로덕션에 배포

### 3. 배포 후 테스트

- [ ] **홈페이지 접속 확인**
  - URL: `https://dogwhere.pages.dev`
  - 페이지 로딩 확인

- [ ] **API 엔드포인트 테스트**
  ```bash
  # 장소 API 테스트
  curl https://dogwhere.pages.dev/api/places
  
  # 추천 API 테스트
  curl https://dogwhere.pages.dev/api/recommendations/today
  ```

- [ ] **관리자 페이지 테스트**
  - URL: `https://dogwhere.pages.dev/admin/login`
  - 로그인 기능 확인

## 🔧 문제 해결

### 빌드 실패

**증상**: Cloudflare Dashboard에서 빌드 실패

**해결 방법**:
1. **빌드 로그 확인**
   - Deployments → 실패한 배포 → Logs
   - 에러 메시지 확인

2. **일반적인 원인**:
   - 환경변수 누락
   - 의존성 문제
   - 빌드 타임아웃 (기본 15분)
   - Node.js 버전 불일치

3. **해결**:
   ```bash
   # 로컬에서 빌드 테스트
   npm install
   npm run build
   
   # 에러 수정 후 다시 푸시
   git add .
   git commit -m "Fix build error"
   git push origin main
   ```

### API 라우트가 작동하지 않음

**증상**: API 엔드포인트가 404 또는 500 에러

**해결 방법**:
1. **동적 라우트 설정 확인**
   - `export const dynamic = 'force-dynamic'` 확인

2. **Cloudflare Pages Functions 확인**
   - `functions/` 디렉토리 확인
   - D1 바인딩 확인

3. **환경변수 확인**
   - Cloudflare Dashboard에서 환경변수 설정 확인

### D1 데이터베이스 연결 실패

**증상**: API에서 데이터베이스 연결 오류

**해결 방법**:
1. **바인딩 확인**
   - Settings → Functions → D1 Database bindings
   - Variable name이 `DB`인지 확인

2. **스키마 적용 확인**
   ```bash
   wrangler d1 execute dogwhere-db --file=./schema.sql
   ```

3. **로컬 테스트**
   ```bash
   npm run db:check
   ```

## 📊 배포 상태 모니터링

### Cloudflare Dashboard

1. **배포 상태**
   - Pages → dogwhere → Deployments
   - 각 배포의 상태 확인

2. **빌드 로그**
   - 실패한 배포 → Logs
   - 에러 메시지 확인

3. **함수 로그**
   - Workers & Pages → dogwhere → Logs
   - API 호출 로그 확인

### 성능 모니터링

- **Analytics**
  - Pages → dogwhere → Analytics
  - 요청 수, 응답 시간 확인

- **Web Vitals**
  - Core Web Vitals 확인
  - 성능 최적화 필요시 조치

## ✅ 배포 완료 확인

배포가 성공적으로 완료되면:

- [x] 홈페이지 접속 가능
- [x] API 엔드포인트 정상 작동
- [x] 관리자 페이지 접속 가능
- [x] D1 데이터베이스 연결 정상
- [x] 환경변수 정상 작동

## 🎉 다음 단계

배포 완료 후:

1. **기능 테스트**
   - 모든 주요 기능 테스트
   - 사용자 시나리오 테스트

2. **성능 최적화**
   - 이미지 최적화
   - 캐싱 전략 개선

3. **모니터링 설정**
   - 에러 추적 설정
   - 성능 모니터링 설정

---

**마지막 업데이트**: 2025년 1월  
**배포 상태**: 수정 완료, 배포 대기 중

