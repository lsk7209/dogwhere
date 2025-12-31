# 재생성 개념 업데이트 가이드

## 🔄 변경 사항

### 기존 개념
- 재생성 → 발행 → 사이트맵 포함
- `published` 필드로 발행 상태 관리

### 새로운 개념
- 재생성 = 기존 페이지 업데이트
- 재생성 완료 시 즉시 사이트맵 포함
- 재생성된 컨텐츠가 있는 데이터는 재발행 불가

## 📋 주요 변경 내용

### 1. 발행 개념 제거

**변경 전:**
```typescript
// 재생성 → 발행 → 사이트맵 포함
regeneration_status = 'completed'
published = true
sitemap_excluded = false
```

**변경 후:**
```typescript
// 재생성 완료 시 즉시 사이트맵 포함
regeneration_status = 'completed'
regenerated_content = '...'
sitemap_excluded = false  // 즉시 변경
noindex = false           // 즉시 변경
```

### 2. 재생성 큐 관리

**새로운 API: `/api/public-data/queue`**

- 재생성된 컨텐츠가 **없는** 데이터만 큐에 추가
- 재생성된 컨텐츠가 있으면 큐에 추가하지 않음
- 중복 체크 강화

### 3. 재생성 로직

**변경 전:**
```typescript
// 재생성 완료 후 발행 대기
UPDATE public_data_places 
SET regenerated_content = ?, regeneration_status = 'completed'
```

**변경 후:**
```typescript
// 재생성 완료 시 즉시 노출
UPDATE public_data_places 
SET regenerated_content = ?, 
    regeneration_status = 'completed',
    sitemap_excluded = 0,
    noindex = 0,
    updated_at = CURRENT_TIMESTAMP
```

### 4. 사이트맵 로직

**변경 전:**
```sql
WHERE published = 1 AND sitemap_excluded = 0
```

**변경 후:**
```sql
WHERE regeneration_status = 'completed'
  AND regenerated_content IS NOT NULL
  AND regenerated_content != ''
  AND sitemap_excluded = 0
```

## 🔄 워크플로우

### 새로운 워크플로우

```
공공데이터 증분 수집 (매일 자정)
    ↓
DB 저장 (noindex, 사이트맵 제외)
    ↓
사용자 검색 → DB에서 조회
    ↓
재생성 큐 추가 (재생성된 컨텐츠 없는 데이터만)
    ↓
Gemini 재생성 (6시간마다)
    ↓
즉시 사이트맵 포함 (기존 페이지 업데이트)
```

## 📊 데이터베이스 변경

### 제거된 필드
- `published` (더 이상 사용하지 않음)
- `published_at` (더 이상 사용하지 않음)

### 사용 중인 필드
- `regeneration_status`: 재생성 상태
- `regenerated_content`: 재생성된 컨텐츠
- `sitemap_excluded`: 사이트맵 제외 여부
- `noindex`: 검색 엔진 인덱싱 여부

## 🔍 재생성 체크 로직

### 큐에 추가 전 체크

```typescript
// 재생성된 컨텐츠가 있는지 확인
SELECT regenerated_content 
FROM public_data_places 
WHERE id = ?

// 있으면 큐에 추가하지 않음
if (regeneratedContent && regeneratedContent.trim() !== '') {
  return error('이미 재생성된 컨텐츠가 있습니다')
}
```

### 배치 큐 추가 시 필터링

```sql
SELECT id 
FROM public_data_places 
WHERE (regenerated_content IS NULL OR regenerated_content = '')
  AND regeneration_status != 'processing'
  AND id NOT IN (SELECT place_id FROM publish_queue WHERE status IN ('pending', 'processing'))
```

## ⚠️ 주의사항

1. **재생성은 업데이트 개념**
   - 새로운 페이지 생성이 아님
   - 기존 페이지의 컨텐츠를 업데이트

2. **중복 재생성 방지**
   - 재생성된 컨텐츠가 있으면 큐에 추가하지 않음
   - 이미 재생성된 데이터는 재생성하지 않음

3. **즉시 노출**
   - 재생성 완료 시 바로 사이트맵에 포함
   - 별도의 발행 단계 없음

## 📝 마이그레이션

### 기존 데이터 처리

```sql
-- published 필드 제거 (선택사항)
-- ALTER TABLE public_data_places DROP COLUMN published;
-- ALTER TABLE public_data_places DROP COLUMN published_at;

-- 재생성 완료된 데이터는 즉시 노출
UPDATE public_data_places
SET sitemap_excluded = 0,
    noindex = 0
WHERE regeneration_status = 'completed'
  AND regenerated_content IS NOT NULL
  AND regenerated_content != '';
```

## 🔗 관련 API

### 큐 관리
- `POST /api/public-data/queue` - 큐에 추가
- `GET /api/public-data/queue` - 큐 상태 조회

### 재생성
- `POST /api/public-data/regenerate` - 재생성 실행

### 제거된 API
- `POST /api/public-data/publish` - 더 이상 사용하지 않음

---

**작성일**: 2025-01-28  
**버전**: 2.0.0

