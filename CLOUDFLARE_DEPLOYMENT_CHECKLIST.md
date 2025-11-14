# Cloudflare 배포 체크리스트

## ✅ 완료된 작업

### 1. Edge Runtime 호환성
- [x] 모든 API Routes에 `export const runtime = 'edge'` 추가
- [x] JWT 라이브러리를 Web Crypto API 기반으로 교체
- [x] 비밀번호 해싱을 Web Crypto API로 교체
- [x] `process.env` 대신 `env` 객체 사용

### 2. D1 데이터베이스
- [x] D1 바인딩 설정 (`wrangler.toml`)
- [x] D1 접근 실패 시 폴백 처리
- [x] Pages Functions에서 D1 접근 구현

### 3. 크론 작업
- [x] `functions/_cron.ts` 구현 완료
- [x] 크론 작업 타입 정의 완료

### 4. 환경변수
- [x] 환경변수 검증 (`src/lib/env.ts`)
- [x] 빌드 시 기본값 제공
- [x] Edge Runtime 호환성 확인

## 📋 배포 전 확인사항

### Cloudflare Pages 대시보드 설정

1. **환경변수 설정**
   - `ADMIN_USERNAME` - 관리자 사용자명
   - `ADMIN_PASSWORD` - 관리자 비밀번호 (최소 8자)
   - `JWT_SECRET` - JWT 시크릿 키 (최소 32자)
   - `GOOGLE_PLACES_KEY` - Google Places API 키 (선택)
   - `KAKAO_API_KEY` - Kakao API 키 (선택)
   - `OPENAI_API_KEY` - OpenAI API 키 (선택)
   - `INTERNAL_TOKEN` - 내부 API 토큰 (선택)
   - `NEXT_PUBLIC_API_URL` - 공개 API URL (선택)
   - `NEXT_PUBLIC_SITE_URL` - 공개 사이트 URL (선택)

2. **크론 트리거 설정**
   - Pages → Settings → Functions → Cron Triggers
   - Function: `_cron.ts`
   - Cron expression: `0 */6 * * *` (6시간마다 실행)

3. **D1 데이터베이스 확인**
   - D1 데이터베이스가 생성되어 있는지 확인
   - `wrangler.toml`의 `database_id` 확인
   - 프로덕션 D1에 스키마 적용:
     ```bash
     wrangler d1 execute dogwhere-db --file=./schema.sql
     ```

## 🔍 배포 후 확인사항

1. **API 엔드포인트 테스트**
   - `/api/places` - 장소 목록 조회
   - `/api/places/[slug]` - 장소 상세 조회
   - `/api/admin/auth/login` - 관리자 로그인
   - `/api/simple-places` - 간단한 장소 목록

2. **D1 데이터베이스 확인**
   ```bash
   wrangler d1 execute dogwhere-db --command="SELECT COUNT(*) FROM places"
   ```

3. **크론 작업 확인**
   - Cloudflare Dashboard → Workers & Pages → dogwhere → Logs
   - 크론 작업 실행 로그 확인

4. **에러 로그 확인**
   - Cloudflare Dashboard → Workers & Pages → dogwhere → Logs
   - 에러 발생 시 로그 확인

## ⚠️ 알려진 제한사항

1. **Next.js API Routes vs Pages Functions**
   - Next.js API Routes (`src/app/api/*`)는 Edge Runtime에서 실행되지만 D1 접근이 제한적
   - 프로덕션에서는 Pages Functions (`functions/api/*`) 사용 권장
   - 현재는 API Routes에서 D1 접근 실패 시 폴백 처리 구현됨

2. **환경변수 접근**
   - Edge Runtime에서는 `process.env`가 제한적으로 작동
   - 모든 환경변수는 `env` 객체를 통해 접근해야 함

3. **D1 접근**
   - Pages Functions에서는 `env.DB`로 자동 접근 가능
   - Next.js API Routes에서는 `getD1Database()` 사용 (제한적)

## 📚 참고 문서

- `CLOUDFLARE_EDGE_RUNTIME.md` - Edge Runtime 호환성 가이드
- `CLOUDFLARE_D1_GUIDE.md` - D1 데이터베이스 가이드
- `CRON_SETUP.md` - 크론 작업 설정 가이드
- `CLOUDFLARE_PAGES_FUNCTIONS.md` - Pages Functions 가이드

