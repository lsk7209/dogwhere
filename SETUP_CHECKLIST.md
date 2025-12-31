# 🚀 공공데이터 수집 시스템 준비 체크리스트

## ✅ 완료된 작업

### 1. 코드 구현
- [x] 공공데이터 수집기 (`src/lib/public-data/collector.ts`)
- [x] 한국관광공사 API 통합 (`src/lib/public-data/kor-pet-tour.ts`)
- [x] 중복 체크 시스템 (`src/lib/public-data/duplicate-checker.ts`)
- [x] 재생성 큐 관리 (`src/app/api/public-data/queue/route.ts`)
- [x] Gemini 재생성 API (`src/app/api/public-data/regenerate/route.ts`)
- [x] 데이터 수집 API (`src/app/api/public-data/collect/route.ts`)
- [x] 검색 API (`src/app/api/public-data/search/route.ts`)
- [x] 사이트맵 통합 (`src/lib/sitemap.ts`)
- [x] 데이터베이스 스키마 마이그레이션 (`scripts/migrate-public-data-schema.ts`)
- [x] 초기 수집 스크립트 (`scripts/initial-public-data-collect.ts`)
- [x] GitHub Actions 크론 작업 (`.github/workflows/public-data-cron.yml`)
- [x] 디버깅 도구 (`src/app/api/debug/*`)

### 2. 문서화
- [x] 공공데이터 계획서 (`PUBLIC_DATA_PLAN.md`)
- [x] 구현 가이드 (`PUBLIC_DATA_IMPLEMENTATION.md`)
- [x] 워크플로우 가이드 (`PUBLIC_DATA_WORKFLOW.md`)
- [x] 한국관광공사 API 가이드 (`KOR_PET_TOUR_API_GUIDE.md`)
- [x] 재생성 개념 업데이트 (`REGENERATION_CONCEPT_UPDATE.md`)

## ⚠️ 설정 필요 사항

### 1. 환경 변수 설정

#### 로컬 개발 환경 (`.env.local`)

```env
# Turso 데이터베이스
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# 내부 인증
INTERNAL_TOKEN=your_secure_internal_token

# API 키
PUBLIC_DATA_API_KEY=your_public_data_portal_api_key
GEMINI_API_KEY=your_gemini_api_key

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Vercel 환경 변수

Vercel 대시보드에서 다음 환경 변수 설정:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `INTERNAL_TOKEN`
- `PUBLIC_DATA_API_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

#### GitHub Secrets

GitHub 저장소 Settings > Secrets and variables > Actions에서 설정:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `INTERNAL_TOKEN`
- `PUBLIC_DATA_API_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

### 2. 데이터베이스 마이그레이션

```bash
# 공공데이터 테이블 생성
npm run db:public-data:migrate
```

**확인 사항:**
- `public_data_places` 테이블 생성
- `publish_queue` 테이블 생성
- 인덱스 생성 확인

### 3. 초기 데이터 수집 (1회만)

```bash
# 전체 데이터 수집 (처음 1회만)
npm run public-data:collect:initial
```

**주의:** 이 명령은 모든 데이터를 수집하므로 시간이 걸릴 수 있습니다.

### 4. GitHub Actions 설정 확인

`.github/workflows/public-data-cron.yml` 파일이 올바르게 설정되었는지 확인:
- 크론 스케줄: 매일 자정 (KST), 6시간마다 재생성
- Secrets가 모두 설정되었는지 확인

## 🧪 테스트 체크리스트

### 1. 데이터베이스 연결 테스트

```bash
npm run db:check:turso
```

### 2. API 엔드포인트 테스트

```bash
# 시스템 상태 확인
curl -X GET "http://localhost:3000/api/debug/system-status" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"

# 큐 상태 확인
curl -X GET "http://localhost:3000/api/public-data/queue" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"

# 데이터 검증
curl -X GET "http://localhost:3000/api/debug/validate-data" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 3. 수집 테스트

```bash
# 증분 수집 테스트
curl -X POST "http://localhost:3000/api/public-data/collect" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "kor-pet-tour",
    "incremental": true,
    "config": {
      "apiKey": "$PUBLIC_DATA_API_KEY",
      "serviceKey": "$PUBLIC_DATA_API_KEY",
      "baseUrl": "https://apis.data.go.kr/B551011/KorPetTourService",
      "endpoint": "/areaBasedList",
      "mobileOS": "ETC",
      "mobileApp": "dogwhere",
      "params": {
        "listYN": "Y",
        "arrange": "C"
      }
    }
  }'
```

### 4. 재생성 테스트

```bash
# 큐에 추가
curl -X POST "http://localhost:3000/api/public-data/queue" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true, "limit": 5}'

# 재생성 실행
curl -X POST "http://localhost:3000/api/public-data/regenerate" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true}'
```

## 📊 실행 순서

### 첫 설정 시

1. **환경 변수 설정**
   ```bash
   cp env.example .env.local
   # .env.local 파일 편집하여 실제 값 입력
   ```

2. **데이터베이스 마이그레이션**
   ```bash
   npm run db:public-data:migrate
   ```

3. **초기 데이터 수집** (선택사항)
   ```bash
   npm run public-data:collect:initial
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **API 테스트**
   - 시스템 상태 확인
   - 데이터 검증
   - 수집 테스트

### 정기 운영

1. **자동 크론 작업**
   - 매일 자정: 증분 수집
   - 6시간마다: 재생성 및 발행

2. **수동 실행** (필요 시)
   - GitHub Actions에서 `workflow_dispatch` 사용
   - 또는 API 직접 호출

## 🔍 문제 해결

### 데이터베이스 연결 실패
- `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN` 확인
- Turso 대시보드에서 데이터베이스 상태 확인

### API 호출 실패
- `PUBLIC_DATA_API_KEY` 확인
- API 호출 제한 확인
- 네트워크 연결 확인

### 재생성 실패
- `GEMINI_API_KEY` 확인
- Gemini API 할당량 확인
- 큐 상태 확인 (`/api/public-data/queue`)

### 크론 작업 실패
- GitHub Secrets 확인
- 워크플로우 로그 확인
- API 엔드포인트 접근 가능 여부 확인

## 📝 다음 단계

1. ✅ 환경 변수 설정
2. ✅ 데이터베이스 마이그레이션
3. ✅ 초기 데이터 수집 (선택)
4. ✅ API 테스트
5. ✅ GitHub Actions 설정
6. ✅ 모니터링 설정

---

**준비 완료!** 🎉

모든 설정이 완료되면 시스템이 자동으로 작동합니다.

