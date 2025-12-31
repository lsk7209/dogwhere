# 공공데이터 기반 시스템 구현 완료 가이드

## ✅ 구현 완료 항목

### 1. 데이터베이스 스키마
- ✅ `public_data_places` 테이블 생성
- ✅ `publish_queue` 테이블 생성
- ✅ 인덱스 생성 (성능 최적화)

### 2. 데이터 수집 시스템
- ✅ 공공데이터포털 API 클라이언트 (`src/lib/public-data/collector.ts`)
- ✅ 데이터 수집 API (`src/app/api/public-data/collect/route.ts`)
- ✅ 중복 방지 로직
- ✅ 배치 처리 지원

### 3. 검색 시스템
- ✅ 검색 API (`src/app/api/public-data/search/route.ts`)
- ✅ 필터링 (지역, 카테고리)
- ✅ 페이지네이션

### 4. Gemini 재생성 시스템
- ✅ Gemini API 클라이언트 (`src/lib/gemini/client.ts`)
- ✅ 재생성 API (`src/app/api/public-data/regenerate/route.ts`)
- ✅ 배치 처리 지원
- ✅ 에러 처리 및 재시도

### 5. 발행 시스템
- ✅ 발행 API (`src/app/api/public-data/publish/route.ts`)
- ✅ 사이트맵 제외/포함 로직
- ✅ noindex 설정

### 6. 사이트맵 통합
- ✅ 발행된 공공데이터만 사이트맵에 포함
- ✅ 미발행 데이터는 사이트맵에서 제외

### 7. GitHub Actions 크론
- ✅ 데이터 수집 크론 (매일 자정)
- ✅ 재생성 및 발행 크론 (6시간마다)

## 🚀 사용 방법

### 1. 데이터베이스 스키마 생성

```bash
# 환경 변수 설정
export TURSO_DATABASE_URL="libsql://your-database.turso.io"
export TURSO_AUTH_TOKEN="your_token"

# 스키마 마이그레이션
npm run db:public-data:migrate
```

### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```env
GEMINI_API_KEY=your_gemini_api_key
PUBLIC_DATA_API_KEY=your_public_data_api_key
INTERNAL_TOKEN=your_internal_token
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_token
```

### 3. GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions:

- `GEMINI_API_KEY`
- `PUBLIC_DATA_API_KEY`
- `INTERNAL_TOKEN`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

### 4. 초기 전체 수집 (1회만)

```bash
# 환경 변수 설정 후
npm run public-data:collect:initial
```

### 5. 증분 수집 (수동 - 정기 크론이 자동 실행)

```bash
curl -X POST "https://your-domain.vercel.app/api/public-data/collect" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "data.go.kr",
    "config": {
      "apiKey": "your_api_key",
      "baseUrl": "https://apis.data.go.kr",
      "endpoint": "/B551011/KorService1/searchKeyword",
      "params": {
        "keyword": "강아지 동반"
      }
    }
  }'
```

### 6. 컨텐츠 재생성 (수동)

```bash
# 단일 항목
curl -X POST "https://your-domain.vercel.app/api/public-data/regenerate" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"placeId": "pd_1234567890"}'

# 배치 처리
curl -X POST "https://your-domain.vercel.app/api/public-data/regenerate" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true}'
```

### 7. 발행 (수동)

```bash
# 단일 항목
curl -X POST "https://your-domain.vercel.app/api/public-data/publish" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"placeId": "pd_1234567890"}'

# 배치 처리
curl -X POST "https://your-domain.vercel.app/api/public-data/publish" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true}'
```

### 8. 검색 테스트

```bash
curl "https://your-domain.vercel.app/api/public-data/search?q=강남&page=1&limit=20"
```

## 📊 워크플로우

### 자동 워크플로우

1. **초기 설정 (1회만)**: 전체 데이터 수집
   ```bash
   npm run public-data:collect:initial
   ```

2. **매일 자정**: 공공데이터 증분 수집 (새 데이터만)
3. **6시간마다**: 
   - 재생성 완료된 항목 발행
   - 큐에서 다음 항목 재생성

### 수동 워크플로우

1. 관리자가 발행 요청
2. 큐에 추가
3. 재생성 실행
4. 발행 완료

## 🔍 모니터링

### 데이터베이스 쿼리

```sql
-- 수집된 데이터 통계
SELECT 
  source_api,
  COUNT(*) as total,
  SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
  SUM(CASE WHEN regeneration_status = 'completed' THEN 1 ELSE 0 END) as regenerated
FROM public_data_places
GROUP BY source_api;

-- 발행 큐 상태
SELECT 
  status,
  COUNT(*) as count
FROM publish_queue
GROUP BY status;
```

### API 상태 확인

```bash
# 수집 상태
curl "https://your-domain.vercel.app/api/public-data/search?q=&limit=1"

# 큐 상태 (관리자 API 필요)
```

## ⚠️ 주의사항

1. **API 제한**
   - 공공데이터포털 API: 일일 호출 제한 확인
   - Gemini API: 일일 할당량 및 비용 관리

2. **데이터 품질**
   - 재생성된 컨텐츠 품질 검증 필요
   - 수동 검토 프로세스 권장

3. **성능**
   - 배치 처리 시 API 제한 고려
   - 대기 시간 설정 (2초)

4. **보안**
   - INTERNAL_TOKEN 안전하게 관리
   - API 키 절대 커밋하지 않기

## 📈 최적화 제안

### 단기 (1-2주)

1. **재시도 로직 개선**
   - 지수 백오프
   - 최대 재시도 횟수 조정

2. **캐싱**
   - 검색 결과 캐싱
   - 사이트맵 캐싱

3. **모니터링 대시보드**
   - 수집 현황
   - 재생성 현황
   - 발행 현황

### 중기 (1-2개월)

1. **Redis 큐 시스템**
   - DB 기반 큐 → Redis로 전환
   - 우선순위 큐

2. **품질 검증**
   - 자동 품질 점수 계산
   - 수동 검토 워크플로우

3. **A/B 테스트**
   - 재생성 프롬프트 최적화
   - 발행 전략 테스트

## 🔗 관련 문서

- [PUBLIC_DATA_PLAN.md](./PUBLIC_DATA_PLAN.md) - 전체 계획
- [CODE_REVIEW_VERCEL_TURSO.md](./CODE_REVIEW_VERCEL_TURSO.md) - 코드 검토
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - 마이그레이션 가이드

---

**작성일**: 2025-01-28
**버전**: 1.0.0

