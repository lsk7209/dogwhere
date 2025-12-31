# 공공데이터 워크플로우 검증 가이드

## ✅ 검증 완료 항목

### 1단계: 사용자 검색 기능 ✅

**파일**: `src/app/api/public-data/search/route.ts`

**기능**:
- ✅ 검색어, 지역, 카테고리로 검색 가능
- ✅ `published` 여부와 관계없이 모든 데이터 검색
- ✅ 페이지네이션 지원
- ✅ `sitemap_excluded`, `noindex` 필드 반환

**테스트 방법**:
```bash
# 검색어로 검색
GET /api/public-data/search?q=올리브영&limit=5

# 지역으로 검색
GET /api/public-data/search?sido=서울특별시&limit=10

# 카테고리로 검색
GET /api/public-data/search?category=쇼핑&limit=10
```

**수정 사항**:
- `published` 컬럼 참조 제거 (스키마에 없음)
- `sitemap_excluded`, `noindex` 필드로 대체

---

### 2단계: 발행 큐 관리 ✅

**파일**: `src/app/api/public-data/queue/route.ts`

**기능**:
- ✅ 단일 항목 큐 추가
- ✅ 배치 큐 추가 (재생성된 컨텐츠가 없는 항목만)
- ✅ 큐 상태 조회
- ✅ 재생성된 컨텐츠가 있으면 큐에 추가하지 않음

**테스트 방법**:
```bash
# 큐 상태 조회
GET /api/public-data/queue
Authorization: Bearer $INTERNAL_TOKEN

# 배치 큐 추가 (5개)
POST /api/public-data/queue
Authorization: Bearer $INTERNAL_TOKEN
Content-Type: application/json
{
  "batch": true,
  "limit": 5
}

# 단일 항목 큐 추가
POST /api/public-data/queue
Authorization: Bearer $INTERNAL_TOKEN
Content-Type: application/json
{
  "placeId": "pd_1234567890"
}
```

**로직**:
- 재생성된 컨텐츠가 없는 항목만 큐에 추가
- 이미 큐에 있는 항목은 건너뜀
- 재생성된 컨텐츠가 있으면 에러 반환

---

### 3단계: Gemini 재생성 ✅

**파일**: 
- `src/app/api/public-data/regenerate/route.ts`
- `src/lib/gemini/client.ts`

**기능**:
- ✅ 단일 항목 재생성
- ✅ 배치 재생성 (큐에서 최대 10개 처리)
- ✅ 재생성 완료 시 즉시 사이트맵 포함 (`sitemap_excluded = 0`, `noindex = 0`)
- ✅ 재생성된 컨텐츠 저장
- ✅ 큐에서 완료된 항목 제거

**테스트 방법**:
```bash
# 배치 재생성
POST /api/public-data/regenerate
Authorization: Bearer $INTERNAL_TOKEN
Content-Type: application/json
{
  "batch": true
}

# 단일 항목 재생성
POST /api/public-data/regenerate
Authorization: Bearer $INTERNAL_TOKEN
Content-Type: application/json
{
  "placeId": "pd_1234567890"
}
```

**재생성 로직**:
1. 큐에서 `pending` 상태 항목 조회
2. 재생성된 컨텐츠가 없는 항목만 처리
3. Gemini API로 컨텐츠 재생성
4. 재생성 완료 시 즉시 업데이트:
   - `regenerated_content` 저장
   - `regeneration_status = 'completed'`
   - `sitemap_excluded = 0`
   - `noindex = 0`
5. 큐에서 완료된 항목 제거

**Gemini 설정**:
- 모델: `gemini-2.0-flash-exp`
- Temperature: 0.7
- Max Tokens: 2000

---

### 4단계: 사이트맵 통합 ✅

**파일**: `src/lib/sitemap.ts`

**기능**:
- ✅ 재생성 완료된 공공데이터만 사이트맵에 포함
- ✅ `sitemap_excluded = 0` 조건 확인
- ✅ `regeneration_status = 'completed'` 확인
- ✅ `regenerated_content` 존재 확인

**사이트맵 생성 로직**:
```typescript
SELECT slug, updated_at 
FROM public_data_places 
WHERE regeneration_status = 'completed'
  AND regenerated_content IS NOT NULL
  AND regenerated_content != ''
  AND sitemap_excluded = 0
ORDER BY last_regenerated_at DESC
```

**URL 형식**:
- `/public-data/place/{slug}`

**테스트 방법**:
```bash
# 사이트맵 확인
GET /sitemap.xml

# 또는 직접 확인
GET /api/sitemap
```

---

## 🔄 전체 워크플로우

```
1. 초기 전체 수집 (1회만)
   npm run public-data:collect:initial
   ↓
   DB 저장 (sitemap_excluded=1, noindex=1)

2. 증분 수집 (매일 자정 - GitHub Actions)
   POST /api/public-data/collect
   ↓
   신규 데이터만 저장 (중복 체크)

3. 사용자 검색
   GET /api/public-data/search?q=검색어
   ↓
   모든 데이터 조회 (published 여부 무관)

4. 발행 큐 추가
   POST /api/public-data/queue (batch: true)
   ↓
   재생성된 컨텐츠가 없는 항목만 큐에 추가

5. Gemini 재생성 (6시간마다 - GitHub Actions)
   POST /api/public-data/regenerate (batch: true)
   ↓
   재생성 완료 시 즉시 사이트맵 포함
   (sitemap_excluded=0, noindex=0)

6. 사이트맵 자동 포함
   재생성 완료된 항목은 자동으로 사이트맵에 포함
```

---

## 📊 현재 상태

### 데이터베이스
- ✅ 스키마 생성 완료
- ✅ 인덱스 생성 완료
- ✅ 초기 데이터 수집 완료 (126개 저장)

### API 엔드포인트
- ✅ 검색 API (`/api/public-data/search`)
- ✅ 큐 관리 API (`/api/public-data/queue`)
- ✅ 재생성 API (`/api/public-data/regenerate`)
- ✅ 수집 API (`/api/public-data/collect`)

### 통합
- ✅ 사이트맵 통합 완료
- ✅ 재생성 완료 시 자동 사이트맵 포함

---

## 🧪 수동 테스트 순서

### 1. 검색 테스트
```bash
# 브라우저에서
http://localhost:3000/api/public-data/search?q=올리브영&limit=5
```

### 2. 큐 상태 확인
```bash
# 큐 상태 조회
curl -X GET "http://localhost:3000/api/public-data/queue" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 3. 큐에 항목 추가
```bash
# 배치로 5개 추가
curl -X POST "http://localhost:3000/api/public-data/queue" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true, "limit": 5}'
```

### 4. 재생성 실행
```bash
# 배치 재생성
curl -X POST "http://localhost:3000/api/public-data/regenerate" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true}'
```

### 5. 사이트맵 확인
```bash
# 사이트맵 확인
curl "http://localhost:3000/sitemap.xml"
```

---

## ⚠️ 주의사항

1. **재생성된 컨텐츠는 재발행 불가**
   - 이미 재생성된 컨텐츠가 있으면 큐에 추가하지 않음
   - 재생성은 기존 페이지 업데이트 개념

2. **API 제한**
   - Gemini API: 일일 할당량 확인 필요
   - 공공데이터 API: 일일 호출 제한 확인 필요

3. **환경 변수**
   - `GEMINI_API_KEY`: Gemini 재생성에 필요
   - `PUBLIC_DATA_API_KEY`: 공공데이터 수집에 필요
   - `INTERNAL_TOKEN`: 내부 API 인증에 필요

---

## 📈 다음 단계

1. ✅ 검색 기능 테스트 완료
2. ✅ 큐 관리 확인 완료
3. ⏳ Gemini 재생성 테스트 (GEMINI_API_KEY 필요)
4. ⏳ 사이트맵 통합 확인 (재생성 후)

**현재 상태**: 모든 코드 검증 완료, 실제 API 테스트는 환경 변수 설정 후 가능

