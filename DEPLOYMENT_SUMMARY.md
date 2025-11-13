# 배포 문제 수정 완료 요약

## 🔍 발견된 문제점

### 1. `next.config.ts`의 `output: 'export'` 설정
**문제**: 정적 사이트 생성 모드(`output: 'export'`)는 API 라우트를 지원하지 않습니다.

**해결**: ✅ `output: 'export'` 제거 완료

### 2. API 라우트의 `force-static` 설정
**문제**: 많은 API 라우트가 `force-static`으로 설정되어 있지만 동적 기능(cookies, request.json 등)을 사용하고 있습니다.

**해결**: ✅ 동적 기능을 사용하는 API 라우트를 `force-dynamic`으로 변경 완료

**수정된 파일 (9개)**:
1. `src/app/api/admin/auth/login/route.ts`
2. `src/app/api/jobs/simple-collect/route.ts`
3. `src/app/api/simple-places/route.ts`
4. `src/app/api/events/route.ts`
5. `src/app/api/admin/templates/route.ts`
6. `src/app/api/jobs/ingest/[jobType]/route.ts`
7. `src/app/api/publish/route.ts`
8. `src/app/api/recommendations/today/route.ts`
9. `src/app/api/og/route.tsx`

## ✅ 수정 완료

### 변경 사항 요약

1. **`next.config.ts`**
   - `output: 'export'` 제거
   - API 라우트 지원 활성화

2. **API 라우트 동적 설정**
   - 동적 기능 사용하는 API: `force-static` → `force-dynamic`
   - 정적 콘텐츠 (RSS, sitemap, robots.txt): `force-static` 유지

## 🚀 다음 단계

### 1. Cloudflare Pages 설정 확인

**중요**: Cloudflare Dashboard에서 다음 설정 확인:

```
Framework preset: Next.js (Static HTML Export 아님!)
Build command: npm run build
Build output directory: .next (또는 자동 감지)
```

### 2. 환경변수 설정

Cloudflare Dashboard → Settings → Environment variables에서 설정:

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

### 3. D1 데이터베이스 바인딩

Cloudflare Dashboard → Settings → Functions → D1 Database bindings:

```
Variable name: DB
D1 Database: dogwhere-db
```

### 4. 배포 실행

```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "Fix deployment: remove output export, update API routes to dynamic"
git push origin main

# 자동 배포 시작! 🚀
```

## 📝 참고 문서

- `DEPLOYMENT_FIX.md` - 상세한 문제 해결 가이드
- `DEPLOYMENT_CHECKLIST.md` - 배포 전 체크리스트
- `DEPLOYMENT.md` - 전체 배포 가이드

## 🔧 문제 해결

### 빌드 실패 시

1. **로컬 빌드 테스트**
   ```bash
   npm install
   npm run build
   ```

2. **빌드 로그 확인**
   - Cloudflare Dashboard → Deployments → 실패한 배포 → Logs

3. **일반적인 문제**
   - 환경변수 누락
   - 의존성 문제
   - Node.js 버전 불일치

### API 라우트가 작동하지 않을 때

1. **동적 라우트 설정 확인**
   - `export const dynamic = 'force-dynamic'` 확인

2. **Cloudflare Pages Functions 확인**
   - `functions/` 디렉토리 확인
   - D1 바인딩 확인

## ✅ 체크리스트

배포 전 확인:
- [x] `next.config.ts`에서 `output: 'export'` 제거
- [x] 동적 API 라우트를 `force-dynamic`으로 변경
- [ ] 로컬 빌드 성공 확인 (`npm run build`)
- [ ] Cloudflare Pages 설정 확인 (Framework preset: Next.js)
- [ ] 환경변수 설정 확인
- [ ] D1 데이터베이스 바인딩 확인
- [ ] GitHub에 푸시 및 자동 배포 확인

---

**수정 완료일**: 2025년 1월  
**다음 단계**: Cloudflare Pages 설정 확인 후 배포

