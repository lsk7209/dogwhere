# 공공데이터 수집 워크플로우 가이드

## 📋 워크플로우 개요

### 초기 설정 (1회만 실행)

```
초기 전체 수집 스크립트 실행
    ↓
모든 공공데이터 수집 및 DB 저장
    ↓
초기 데이터 준비 완료
```

### 정기 워크플로우 (자동)

```
공공데이터 증분 수집 (매일 자정)
    ↓
DB 저장 (noindex, 사이트맵 제외)
    ↓
사용자 검색 → DB에서 조회
    ↓
발행 큐 추가
    ↓
Gemini 재생성 (6시간마다)
    ↓
발행 (사이트맵 포함)
```

## 🚀 초기 설정

### 1. 데이터베이스 스키마 생성

```bash
npm run db:public-data:migrate
```

### 2. 초기 전체 수집 (1회만)

```bash
# 환경 변수 설정
export TURSO_DATABASE_URL="libsql://your-database.turso.io"
export TURSO_AUTH_TOKEN="your_token"
export PUBLIC_DATA_API_KEY="your_api_key"

# 초기 수집 실행
npm run public-data:collect:initial
```

또는 스크립트 직접 실행:

```bash
npx tsx scripts/initial-public-data-collect.ts
```

### 3. 수집 소스 설정

`scripts/initial-public-data-collect.ts` 파일에서 수집할 공공데이터 소스를 설정:

```typescript
const COLLECTION_SOURCES: CollectionConfig[] = [
  {
    source: 'data.go.kr',
    config: {
      apiKey: process.env.PUBLIC_DATA_API_KEY || '',
      baseUrl: 'https://apis.data.go.kr',
      endpoint: '/B551011/KorService1/searchKeyword',
      params: {
        keyword: '강아지 동반',
      },
    },
    maxPages: 50, // 최대 50페이지
  },
  // 추가 소스...
]
```

## 🔄 정기 워크플로우

### 매일 자정: 증분 수집

GitHub Actions 크론이 자동으로 실행:

```yaml
# .github/workflows/public-data-cron.yml
schedule:
  - cron: '0 15 * * *'  # UTC 15:00 = KST 00:00
```

**증분 수집 특징:**
- 마지막 수집 시간 이후의 새 데이터만 수집
- 기존 데이터는 건너뜀 (중복 방지)
- 효율적인 API 사용

### 6시간마다: 재생성 및 발행

```yaml
schedule:
  - cron: '0 */6 * * *'  # UTC 0, 6, 12, 18시
```

**처리 내용:**
1. 재생성 완료된 항목 발행
2. 큐에서 다음 항목 재생성

## 📊 데이터 상태

### 수집 직후
- `published: false`
- `sitemap_excluded: true`
- `noindex: true`
- 검색 엔진 인덱싱 안 됨

### 재생성 완료
- `regeneration_status: 'completed'`
- `regenerated_content: '...'`
- 아직 발행 안 됨

### 발행 완료
- `published: true`
- `sitemap_excluded: false`
- `noindex: false`
- 사이트맵에 포함
- 검색 엔진 인덱싱 가능

## 🔍 수동 작업

### 증분 수집 수동 실행

```bash
curl -X POST "https://your-domain.vercel.app/api/public-data/collect" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "data.go.kr",
    "incremental": true,
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

### 전체 수집 (비권장)

```bash
# incremental: false로 설정
curl -X POST "https://your-domain.vercel.app/api/public-data/collect" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "data.go.kr",
    "incremental": false,
    "config": {...}
  }'
```

## 📈 모니터링

### 데이터 통계 확인

```sql
-- 전체 통계
SELECT 
  source_api,
  COUNT(*) as total,
  SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
  SUM(CASE WHEN regeneration_status = 'completed' THEN 1 ELSE 0 END) as regenerated,
  MAX(collected_at) as last_collected
FROM public_data_places
GROUP BY source_api;

-- 오늘 수집된 데이터
SELECT COUNT(*) as today_collected
FROM public_data_places
WHERE DATE(collected_at) = DATE('now');
```

### 큐 상태 확인

```sql
SELECT 
  status,
  COUNT(*) as count
FROM publish_queue
GROUP BY status;
```

## ⚠️ 주의사항

1. **초기 수집은 1회만**
   - 초기 수집 후에는 증분 수집만 사용
   - 전체 수집은 데이터 손실 시에만 사용

2. **증분 수집 최적화**
   - API 호출 최소화
   - 중복 데이터 건너뜀
   - 효율적인 처리

3. **재생성 속도**
   - Gemini API 제한 고려
   - 배치 처리로 점진적 발행

4. **데이터 백업**
   - 정기적으로 데이터베이스 백업
   - 중요 데이터 보호

## 🔧 문제 해결

### 초기 수집 실패

```bash
# 환경 변수 확인
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN
echo $PUBLIC_DATA_API_KEY

# 스키마 확인
npm run db:public-data:migrate

# 재시도
npm run public-data:collect:initial
```

### 증분 수집이 너무 많은 데이터 수집

- API 파라미터 확인
- 날짜 필터 적용 (API 지원 시)
- maxPages 제한 확인

### 재생성이 진행되지 않음

- 큐 상태 확인
- Gemini API 키 확인
- 로그 확인

---

**작성일**: 2025-01-28  
**버전**: 1.0.0

