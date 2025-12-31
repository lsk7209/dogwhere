# Vercel + Turso 마이그레이션 가이드

## 🎯 목표

Cloudflare D1에서 Vercel + Turso 데이터베이스로 마이그레이션하여 더 나은 성능과 확장성을 확보합니다.

## 📋 사전 준비

### 1. Turso 계정 생성

1. [Turso 웹사이트](https://turso.tech/)에서 계정 생성
2. Turso CLI 설치:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
3. 로그인:
   ```bash
   turso auth login
   ```

### 2. 데이터베이스 생성

```bash
# 프로덕션 데이터베이스 생성
turso db create dogwhere

# 개발용 로컬 데이터베이스 생성
turso db create dogwhere-dev --location local

# 데이터베이스 정보 확인
turso db show dogwhere
```

### 3. 인증 토큰 생성

```bash
# 데이터베이스 토큰 생성
turso db tokens create dogwhere

# 토큰 저장 (환경 변수로 사용)
export TURSO_AUTH_TOKEN="your_token_here"
```

## 🔄 마이그레이션 단계

### Step 1: 스키마 적용

```bash
# 로컬 데이터베이스에 스키마 적용
turso db shell dogwhere-dev < schema.sql

# 프로덕션 데이터베이스에 스키마 적용
turso db shell dogwhere < schema.sql
```

### Step 2: 환경 변수 설정

#### 로컬 개발 (.env.local)

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
```

#### Vercel 환경 변수

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 설정:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- 기타 필요한 환경 변수들

#### GitHub Secrets

GitHub 저장소 → Settings → Secrets and variables → Actions에서 설정:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `INTERNAL_TOKEN`
- `GOOGLE_PLACES_KEY`
- `KAKAO_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Step 3: 의존성 설치

```bash
npm install @libsql/client
```

### Step 4: 코드 업데이트

기존 D1 코드를 어댑터 패턴으로 변경:

```typescript
// 기존
import { PlaceRepository } from '@/lib/database/d1-repository'
const repo = new PlaceRepository()

// 변경 후
import { createPlaceRepository } from '@/lib/database/db-adapter'
const repo = createPlaceRepository()
```

### Step 5: 데이터 마이그레이션 (선택)

D1에서 데이터를 export하고 Turso로 import:

```bash
# D1 데이터 export (수동)
# wrangler d1 execute dogwhere-db --command "SELECT * FROM places" > d1_places.json

# Turso로 import
npx tsx scripts/migrate-to-turso.ts
```

### Step 6: 테스트

```bash
# 로컬 개발 서버 실행
npm run dev

# 데이터베이스 연결 테스트
npx tsx scripts/check-turso.ts
```

### Step 7: 배포

```bash
# Vercel에 배포
vercel --prod

# 또는 GitHub에 푸시하여 자동 배포
git push origin main
```

## 🔍 검증

### 1. 데이터베이스 연결 확인

```bash
turso db shell dogwhere --execute "SELECT COUNT(*) FROM places"
```

### 2. API 엔드포인트 테스트

```bash
# 장소 목록 조회
curl https://your-domain.vercel.app/api/places

# 통계 확인
curl -X POST https://your-domain.vercel.app/api/jobs/update-stats \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 3. 크론 작업 테스트

GitHub Actions에서 수동 실행:
- Actions 탭 → "Scheduled Cron Jobs" 워크플로우 선택
- "Run workflow" 클릭

## 🐛 문제 해결

### 연결 오류

```bash
# 토큰 재생성
turso db tokens create dogwhere

# 연결 테스트
turso db shell dogwhere --execute "SELECT 1"
```

### 스키마 오류

```bash
# 스키마 확인
turso db shell dogwhere --execute ".schema"

# 스키마 재적용
turso db shell dogwhere < schema.sql
```

### 크론 작업 실패

1. GitHub Secrets 확인
2. API 엔드포인트 확인
3. 로그 확인: Actions → 해당 워크플로우 → 로그

## 📊 성능 모니터링

### Turso 대시보드

Turso 웹 대시보드에서 다음을 모니터링:
- 쿼리 성능
- 연결 수
- 데이터 사용량

### Vercel Analytics

Vercel 대시보드에서:
- API 응답 시간
- 에러율
- 트래픽

## 🔄 롤백 계획

문제 발생 시 D1으로 롤백:

1. 환경 변수에서 Turso 관련 변수 제거
2. D1 바인딩 복원
3. 코드에서 D1 Repository 직접 사용

## 📝 체크리스트

- [ ] Turso 계정 생성 및 데이터베이스 생성
- [ ] 스키마 적용
- [ ] 환경 변수 설정 (로컬, Vercel, GitHub)
- [ ] 의존성 설치
- [ ] 코드 업데이트
- [ ] 로컬 테스트
- [ ] 데이터 마이그레이션 (필요 시)
- [ ] Vercel 배포
- [ ] 크론 작업 테스트
- [ ] 모니터링 설정

## 🔗 참고 자료

- [Turso 문서](https://docs.turso.tech/)
- [Vercel 데이터베이스 가이드](https://vercel.com/docs/storage)
- [CODE_REVIEW_VERCEL_TURSO.md](./CODE_REVIEW_VERCEL_TURSO.md) - 상세 코드 검토

---

**마지막 업데이트**: 2025-01-28

