# 배포 문제 수정 가이드

## 🔍 발견된 문제점

### 1. `next.config.ts`의 `output: 'export'` 설정
**문제**: 정적 사이트 생성 모드(`output: 'export'`)는 API 라우트를 지원하지 않습니다.

**해결**: `output: 'export'` 제거
- Cloudflare Pages는 자동으로 정적/동적 라우트를 처리합니다
- API 라우트는 Cloudflare Pages Functions로 자동 변환됩니다

### 2. API 라우트의 `force-static` 설정
**문제**: 많은 API 라우트가 `force-static`으로 설정되어 있지만 동적 기능(cookies, request.json 등)을 사용하고 있습니다.

**해결**: 동적 기능을 사용하는 API 라우트를 `force-dynamic`으로 변경

**수정된 파일들**:
- `src/app/api/admin/auth/login/route.ts`
- `src/app/api/jobs/simple-collect/route.ts`
- `src/app/api/simple-places/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/admin/templates/route.ts`
- `src/app/api/jobs/ingest/[jobType]/route.ts`
- `src/app/api/publish/route.ts`

### 3. 정적 라우트는 그대로 유지
다음 라우트들은 정적 생성이 적합하므로 `force-static` 유지:
- `src/app/api/og/route.tsx` (OG 이미지 생성)
- `src/app/rss*.xml/route.ts` (RSS 피드)
- `src/app/sitemap*.xml/route.ts` (사이트맵)
- `src/app/robots.txt/route.ts` (robots.txt)

## ✅ 수정 완료

### 변경 사항
1. ✅ `next.config.ts`: `output: 'export'` 제거
2. ✅ 동적 API 라우트: `force-static` → `force-dynamic` 변경

## 🚀 배포 방법

### Cloudflare Pages 설정

1. **프로젝트 설정 확인**
   ```
   Build command: npm run build
   Build output directory: .next (또는 자동 감지)
   Framework preset: Next.js
   ```

2. **환경변수 설정** (Settings → Environment variables)
   ```
   GOOGLE_PLACES_KEY=your_key
   KAKAO_API_KEY=your_key
   OPENAI_API_KEY=your_key
   INTERNAL_TOKEN=your_token
   NEXT_PUBLIC_SITE_URL=https://dogwhere.pages.dev
   NODE_ENV=production
   ```

3. **D1 데이터베이스 바인딩** (Settings → Functions → D1 Database bindings)
   ```
   Variable name: DB
   D1 Database: dogwhere-db
   ```

### 빌드 및 배포

```bash
# 로컬 빌드 테스트
npm install
npm run build

# GitHub에 푸시하면 자동 배포
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

## 🔧 문제 해결

### 빌드 실패 시

1. **의존성 확인**
   ```bash
   npm install
   ```

2. **로컬 빌드 테스트**
   ```bash
   npm run build
   ```

3. **빌드 로그 확인**
   - Cloudflare Dashboard → Deployments → 실패한 배포 → Logs

### API 라우트가 작동하지 않을 때

1. **동적 라우트 확인**
   - `export const dynamic = 'force-dynamic'` 설정 확인

2. **Cloudflare Pages Functions 확인**
   - `functions/` 디렉토리의 Functions 확인
   - D1 바인딩 확인

3. **환경변수 확인**
   - Cloudflare Dashboard에서 환경변수 설정 확인

## 📝 참고사항

### Cloudflare Pages와 Next.js

- Cloudflare Pages는 Next.js의 API 라우트를 자동으로 Cloudflare Pages Functions로 변환합니다
- `output: 'export'`를 사용하면 API 라우트가 작동하지 않습니다
- 정적 페이지는 자동으로 최적화됩니다

### 동적 vs 정적 라우트

- **정적 라우트** (`force-static`): 빌드 시 생성, 변경되지 않는 콘텐츠
- **동적 라우트** (`force-dynamic`): 요청 시 생성, 데이터베이스 쿼리, 인증 등

## ✅ 체크리스트

배포 전 확인:
- [x] `next.config.ts`에서 `output: 'export'` 제거
- [x] 동적 API 라우트를 `force-dynamic`으로 변경
- [ ] 로컬 빌드 성공 확인
- [ ] 환경변수 설정 확인
- [ ] D1 데이터베이스 바인딩 확인
- [ ] GitHub에 푸시 및 자동 배포 확인

---

**수정 완료일**: 2025년 1월  
**다음 단계**: 배포 후 기능 테스트

