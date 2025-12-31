# 코드 검토 및 Vercel + Turso 마이그레이션 가이드

## 📋 개요

이 문서는 dogwhere 프로젝트의 코드 검토 결과와 Cloudflare D1에서 Vercel + Turso 데이터베이스로의 마이그레이션 가이드를 제공합니다.

## 🔍 코드 검토 결과

### ✅ 강점

1. **타입 안전성**: TypeScript와 Zod를 사용한 환경변수 검증
2. **에러 처리**: 적절한 에러 핸들링 및 사용자 친화적 메시지
3. **보안**: JWT 인증, Bearer Token 검증
4. **코드 구조**: Repository 패턴을 통한 깔끔한 데이터 접근 레이어
5. **SEO 최적화**: 메타데이터, sitemap, RSS 피드 지원

### ⚠️ 개선 필요 사항

1. **데이터베이스 의존성**: D1에 강하게 결합되어 있어 다른 DB로 전환 시 수정 필요
   - ✅ **해결됨**: 어댑터 패턴으로 D1과 Turso 모두 지원

2. **환경변수 관리**: 일부 환경변수가 선택사항으로 처리되어 런타임 에러 가능성
   - ✅ **개선됨**: Zod 스키마로 타입 안전성 보장

3. **크론 작업**: Cloudflare Pages 크론에 의존
   - ✅ **해결됨**: GitHub Actions 크론 워크플로우 추가

4. **로깅**: 구조화된 로깅 시스템 부재
   - 💡 **권장**: Winston, Pino 등 구조화된 로거 도입 고려

5. **테스트**: 단위 테스트 및 통합 테스트 부재
   - 💡 **권장**: Jest, Vitest 등 테스트 프레임워크 도입

## 🚀 Vercel + Turso 마이그레이션

### 1. Turso 데이터베이스 설정

#### 1.1 Turso 계정 생성 및 데이터베이스 생성

```bash
# Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 로그인
turso auth login

# 데이터베이스 생성
turso db create dogwhere

# 데이터베이스 URL 및 토큰 확인
turso db show dogwhere
turso db tokens create dogwhere
```

#### 1.2 스키마 마이그레이션

```bash
# 로컬 데이터베이스 생성 (개발용)
turso db create dogwhere-dev --location local

# 스키마 적용
turso db shell dogwhere-dev < schema.sql

# 프로덕션 데이터베이스에 스키마 적용
turso db shell dogwhere < schema.sql
```

### 2. 환경 변수 설정

#### 2.1 Vercel 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
GOOGLE_PLACES_KEY=your_google_places_api_key
KAKAO_API_KEY=your_kakao_api_key
OPENAI_API_KEY=your_openai_api_key
INTERNAL_TOKEN=your_internal_token
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

#### 2.2 GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions에서 다음 시크릿을 추가:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `GOOGLE_PLACES_KEY`
- `KAKAO_API_KEY`
- `INTERNAL_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

### 3. 코드 변경 사항

#### 3.1 데이터베이스 클라이언트

기존 D1 클라이언트 대신 어댑터를 사용:

```typescript
// 기존
import { PlaceRepository } from '@/lib/database/d1-repository'
const repo = new PlaceRepository()

// 변경 후
import { createPlaceRepository } from '@/lib/database/db-adapter'
const repo = createPlaceRepository()
```

#### 3.2 API 라우트 업데이트

모든 API 라우트에서 어댑터 사용:

```typescript
import { createPlaceRepository } from '@/lib/database/db-adapter'

export async function GET() {
  const repo = createPlaceRepository()
  const places = await repo.findAll()
  return Response.json(places)
}
```

### 4. GitHub Actions 크론 설정

#### 4.1 크론 스케줄

현재 설정: 매일 4회 (UTC 기준 21:00, 03:00, 09:00, 15:00)
- 한국시간: 오전 6시, 정오, 오후 6시, 자정

크론 표현식 수정:
```yaml
# 한국시간 기준으로 수정하려면
- cron: '0 0,6,12,18 * * *'  # UTC-9 (한국시간 기준)
```

#### 4.2 크론 작업 모니터링

GitHub Actions 탭에서 크론 작업 실행 내역을 확인할 수 있습니다.

실패 시 자동으로 이슈가 생성됩니다.

### 5. 배포 체크리스트

- [ ] Turso 데이터베이스 생성 및 스키마 적용
- [ ] Vercel 환경 변수 설정
- [ ] GitHub Secrets 설정
- [ ] 코드에서 어댑터 사용으로 변경
- [ ] 로컬 환경에서 테스트
- [ ] Vercel에 배포
- [ ] 크론 작업 테스트 (workflow_dispatch 사용)
- [ ] 프로덕션 모니터링 설정

## 📊 성능 비교

### D1 vs Turso

| 항목 | Cloudflare D1 | Turso |
|------|--------------|-------|
| **지연 시간** | 매우 낮음 (Edge) | 낮음 (글로벌 복제) |
| **읽기 성능** | 우수 | 우수 |
| **쓰기 성능** | 우수 | 우수 |
| **확장성** | 제한적 | 우수 |
| **비용** | 무료 티어 제공 | 무료 티어 제공 |
| **Vercel 통합** | 없음 | 네이티브 지원 |
| **로컬 개발** | wrangler 필요 | Turso CLI |

### 권장 사항

- **Vercel 배포**: Turso 사용 권장
- **Cloudflare Pages 배포**: D1 사용 권장
- **하이브리드**: 어댑터 패턴으로 두 환경 모두 지원 가능

## 🔧 문제 해결

### Turso 연결 오류

```bash
# 연결 테스트
turso db shell dogwhere --execute "SELECT 1"

# 토큰 재생성
turso db tokens create dogwhere
```

### GitHub Actions 크론 실패

1. Secrets 확인: 모든 필수 시크릿이 설정되었는지 확인
2. API 엔드포인트 확인: `/api/jobs/simple-collect` 엔드포인트가 정상 작동하는지 확인
3. 로그 확인: GitHub Actions 로그에서 상세 에러 메시지 확인

### 마이그레이션 문제

```bash
# 데이터베이스 백업
turso db dump dogwhere > backup.sql

# 스키마 확인
turso db shell dogwhere --execute ".schema"
```

## 📝 추가 개선 사항

### 단기 (1-2주)

1. **로깅 시스템 도입**
   - 구조화된 로깅 (Pino, Winston)
   - 에러 추적 (Sentry)

2. **모니터링 설정**
   - Vercel Analytics
   - 데이터베이스 성능 모니터링

3. **테스트 작성**
   - Repository 단위 테스트
   - API 통합 테스트

### 중기 (1-2개월)

1. **캐싱 전략**
   - Redis/Vercel KV 통합
   - API 응답 캐싱

2. **성능 최적화**
   - 데이터베이스 쿼리 최적화
   - 인덱스 추가

3. **백업 전략**
   - 자동 백업 스크립트
   - 복구 프로세스 문서화

## 🔗 참고 자료

- [Turso 공식 문서](https://docs.turso.tech/)
- [Vercel 데이터베이스 가이드](https://vercel.com/docs/storage)
- [GitHub Actions 크론 가이드](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [libSQL 문서](https://libsql.org/docs)

## 📅 마이그레이션 일정

1. **1주차**: Turso 설정 및 스키마 마이그레이션
2. **2주차**: 코드 변경 및 테스트
3. **3주차**: 프로덕션 배포 및 모니터링
4. **4주차**: 최적화 및 문서화

---

**마지막 업데이트**: 2025-01-28
**작성자**: AI Assistant

