# 대규모 컨텐츠 최적화 가이드

## 📋 개요

이 문서는 컨텐츠가 100개에서 1000개 이상으로 증가할 때를 대비한 최적화 구조를 설명합니다.

## 🏗 아키텍처 개선 사항

### 1. 데이터베이스 레이어 (D1)

**기존 문제점**:
- 인메모리 데이터베이스 사용
- 서버 재시작 시 데이터 손실
- 확장성 없음

**개선 사항**:
- Cloudflare D1 데이터베이스 사용
- Repository 패턴으로 데이터 접근 추상화
- 인덱싱을 통한 빠른 조회

**파일**: `src/lib/database/d1-repository.ts`

### 2. 페이지네이션

**기존 문제점**:
- 클라이언트 사이드에서 모든 데이터 로드
- 1000개 컨텐츠를 한 번에 로드하면 성능 저하

**개선 사항**:
- 서버 사이드 페이지네이션
- 커서 기반 또는 오프셋 기반 페이지네이션
- API 응답에 페이지네이션 메타데이터 포함

**예시**:
```typescript
GET /api/posts?page=1&limit=20
// 응답
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 1000,
    totalPages: 50,
    hasMore: true
  }
}
```

### 3. 캐싱 전략 (Cloudflare KV)

**캐싱 계층**:
1. **CDN 캐싱**: Cloudflare 자동 캐싱
2. **KV 캐싱**: 자주 조회되는 데이터
3. **데이터베이스**: 최종 데이터 소스

**캐시 TTL**:
- 목록 조회: 5분 (300초)
- 상세 조회: 1시간 (3600초)
- 검색 결과: 3분 (180초)

**파일**: `src/lib/cache/kv-cache.ts`

### 4. ISR (Incremental Static Regeneration)

**전략**:
- 최신 100개 포스트만 빌드 시 생성
- 나머지는 on-demand로 생성
- 1시간마다 재생성

**장점**:
- 빌드 시간 단축
- 자주 조회되는 페이지는 빠른 응답
- 새로운 컨텐츠도 빠르게 인덱싱

**예시**:
```typescript
export const revalidate = 3600 // 1시간

export async function generateStaticParams() {
  // 최신 100개만 빌드 시 생성
  const slugs = await repository.findAllSlugs()
  return slugs.slice(0, 100).map((slug) => ({ slug }))
}
```

### 5. 검색 최적화

**서버 사이드 검색**:
- 클라이언트 사이드 필터링 제거
- 데이터베이스 인덱스 활용
- FTS (Full Text Search) 지원

**검색 필드**:
- 제목
- 내용
- 주소 (장소의 경우)

### 6. 동적 라우팅

**기존**: `force-static` - 모든 페이지 빌드 시 생성
**개선**: `force-dynamic` + ISR - 필요 시 생성

## 📊 성능 비교

### 기존 구조 (인메모리)
- 100개 컨텐츠: ✅ 문제 없음
- 500개 컨텐츠: ⚠️ 느려짐
- 1000개 컨텐츠: ❌ 매우 느림

### 최적화된 구조
- 100개 컨텐츠: ✅ 매우 빠름
- 500개 컨텐츠: ✅ 빠름
- 1000개 컨텐츠: ✅ 빠름
- 10000개 컨텐츠: ✅ 빠름 (페이지네이션)

## 🚀 마이그레이션 가이드

### 1단계: 데이터베이스 마이그레이션

```bash
# D1 데이터베이스 생성
wrangler d1 create dogwhere-db

# 스키마 적용
npm run db:migrate

# 기존 데이터 마이그레이션
# (인메모리 → D1)
```

### 2단계: API 라우트 업데이트

기존: `src/app/api/simple-places/route.ts`
→ 새로운: `src/app/api/places/route.ts`

변경 사항:
- `getAllPlaces()` → `repository.findAll()`
- 페이지네이션 파라미터 추가
- 캐싱 추가

### 3단계: 페이지 컴포넌트 업데이트

기존: `src/app/blog/page.tsx` (클라이언트 사이드)
→ 새로운: `src/app/blog/page-optimized.tsx` (서버 사이드)

변경 사항:
- 클라이언트 사이드 필터링 제거
- 서버 사이드 데이터 페칭
- URL 쿼리 파라미터로 페이지네이션

### 4단계: 캐싱 설정

```typescript
// wrangler.toml에 KV 네임스페이스 추가
[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
```

## 📈 모니터링

### 주요 메트릭

1. **응답 시간**
   - 목록 조회: < 200ms
   - 상세 조회: < 100ms (캐시 히트 시)
   - 검색: < 500ms

2. **캐시 히트율**
   - 목표: > 80%

3. **데이터베이스 쿼리 시간**
   - 목표: < 50ms

### 로깅

```typescript
// 캐시 히트/미스 로깅
const cached = await getFromCache(key)
if (cached) {
  console.log('Cache hit:', key)
} else {
  console.log('Cache miss:', key)
}
```

## 🔧 최적화 팁

### 1. 인덱스 최적화

```sql
-- 자주 조회되는 필드에 인덱스 추가
CREATE INDEX idx_places_sido_sigungu ON places(sido, sigungu);
CREATE INDEX idx_places_category_rating ON places(category, overall_rating);
CREATE INDEX idx_posts_category_date ON posts(category, date);
```

### 2. 쿼리 최적화

```typescript
// ❌ 나쁜 예: 모든 데이터 조회 후 필터링
const allPlaces = await getAllPlaces()
const filtered = allPlaces.filter(p => p.sido === '서울')

// ✅ 좋은 예: 데이터베이스에서 필터링
const filtered = await repository.findAll({ sido: '서울' })
```

### 3. 캐시 키 전략

```typescript
// 캐시 키에 필터 포함
const cacheKey = `places:list:${JSON.stringify(filters)}:${page}:${limit}`

// 태그로 일괄 무효화
await invalidateCacheByTag('places')
```

### 4. 페이지네이션 최적화

```typescript
// 커서 기반 페이지네이션 (더 효율적)
// 오프셋 기반 페이지네이션 (구현 간단)

// 권장: 오프셋 기반 (1000개 이하)
// 대용량: 커서 기반 (1000개 이상)
```

## 🐛 문제 해결

### 캐시가 업데이트되지 않음

```typescript
// 데이터 업데이트 시 캐시 무효화
await deleteFromCache(PlaceCacheKeys.bySlug(slug))
await invalidateCacheByTag('places')
```

### 빌드 시간이 너무 오래 걸림

```typescript
// generateStaticParams에서 생성할 페이지 수 제한
export async function generateStaticParams() {
  // 최신 100개만 생성
  return slugs.slice(0, 100)
}
```

### 검색이 느림

```sql
-- FTS (Full Text Search) 인덱스 추가
CREATE VIRTUAL TABLE posts_fts USING fts5(
  title, content, excerpt,
  content=posts,
  content_rowid=id
);
```

## 📚 참고 자료

- [Cloudflare D1 문서](https://developers.cloudflare.com/d1/)
- [Cloudflare KV 문서](https://developers.cloudflare.com/kv/)
- [Next.js ISR 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js 페이지네이션 가이드](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

