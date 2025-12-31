# 공공데이터포털 API 기반 데이터 수집 및 고유 컨텐츠 재생성 계획

## 📋 개요

공공데이터포털 API에서 데이터를 수집하여 DB에 저장하고, 사용자 검색 시 DB에서 제공하며, Gemini API를 활용하여 고유 컨텐츠로 재생성하여 발행하는 시스템입니다.

## 🎯 목표

1. **데이터 수집**: 공공데이터포털 API에서 강아지 관련 장소 데이터 수집
2. **DB 저장**: 수집된 데이터를 Turso DB에 저장 (사이트맵 제외)
3. **검색 제공**: 사용자 검색 시 DB에서 실시간 조회
4. **고유 컨텐츠 생성**: Gemini API로 1개씩 재생성하여 발행
5. **SEO 최적화**: 재생성된 컨텐츠만 사이트맵에 포함

## 🏗️ 시스템 아키텍처

```
공공데이터포털 API
    ↓
[데이터 수집 스케줄러]
    ↓
[Turso DB 저장]
    ├─ published: false (초기 상태)
    ├─ sitemap_excluded: true
    └─ noindex: true
    ↓
[사용자 검색]
    ↓
[DB에서 조회 및 표시]
    ↓
[발행 큐 시스템]
    ↓
[Gemini API 재생성]
    ├─ published: true
    ├─ sitemap_excluded: false
    └─ noindex: false
    ↓
[사이트맵에 포함]
```

## 📊 데이터베이스 스키마

### public_data_places 테이블

```sql
CREATE TABLE IF NOT EXISTS public_data_places (
  id TEXT PRIMARY KEY,
  
  -- 공공데이터 원본 정보
  public_data_id TEXT UNIQUE NOT NULL,  -- 공공데이터 고유 ID
  source_api TEXT NOT NULL,              -- API 출처 (예: 'data.go.kr', 'openapi.seoul.go.kr')
  raw_data TEXT,                         -- 원본 JSON 데이터
  
  -- 기본 정보
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  description TEXT,
  address TEXT,
  sido TEXT,
  sigungu TEXT,
  dong TEXT,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  website TEXT,
  
  -- 상태 관리
  published BOOLEAN DEFAULT 0,            -- 발행 여부
  sitemap_excluded BOOLEAN DEFAULT 1,     -- 사이트맵 제외 여부
  noindex BOOLEAN DEFAULT 1,              -- noindex 설정
  
  -- Gemini 재생성 정보
  original_content TEXT,                  -- 원본 컨텐츠
  regenerated_content TEXT,               -- 재생성된 컨텐츠
  regeneration_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  regeneration_attempts INTEGER DEFAULT 0,
  last_regenerated_at DATETIME,
  gemini_model TEXT DEFAULT 'gemini-2.0-flash-exp', -- 사용한 모델
  
  -- 메타데이터
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  collected_at DATETIME,                  -- 수집 시각
  published_at DATETIME                  -- 발행 시각
);

CREATE INDEX IF NOT EXISTS idx_public_data_places_published ON public_data_places(published);
CREATE INDEX IF NOT EXISTS idx_public_data_places_sitemap_excluded ON public_data_places(sitemap_excluded);
CREATE INDEX IF NOT EXISTS idx_public_data_places_regeneration_status ON public_data_places(regeneration_status);
CREATE INDEX IF NOT EXISTS idx_public_data_places_source_api ON public_data_places(source_api);
```

### publish_queue 테이블

```sql
CREATE TABLE IF NOT EXISTS publish_queue (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  priority INTEGER DEFAULT 0,             -- 우선순위 (높을수록 먼저 처리)
  status TEXT DEFAULT 'pending',          -- pending, processing, completed, failed
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  scheduled_at DATETIME,                 -- 예약 발행 시간
  processed_at DATETIME,
  
  FOREIGN KEY (place_id) REFERENCES public_data_places(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_publish_queue_status ON publish_queue(status);
CREATE INDEX IF NOT EXISTS idx_publish_queue_priority ON publish_queue(priority, scheduled_at);
```

## 🔄 워크플로우

### 1단계: 초기 전체 수집 (1회만)

**수동 실행**: 초기 설정 시 1회만

```bash
npm run public-data:collect:initial
```

**처리 내용:**
- 모든 공공데이터 수집
- DB에 저장 (published: false, noindex: true)

### 2단계: 증분 수집 (매일 자정)

**스케줄**: 매일 자정 (GitHub Actions 크론)

```typescript
// 공공데이터포털 API 호출
// 마지막 수집 시간 이후의 새 데이터만 수집
// 중복 데이터는 건너뜀

// 수집된 데이터를 DB에 저장
// - published: false
// - sitemap_excluded: true
// - noindex: true
```

### 3단계: 사용자 검색

```typescript
// 사용자가 검색하면
// - published 여부와 관계없이 DB에서 조회
// - 검색 결과 표시
// - 클릭 시 상세 페이지 (noindex)
```

### 4단계: 발행 큐 추가

```typescript
// 관리자가 발행 요청하거나
// 자동으로 큐에 추가 (예: 하루 10개씩)
// - publish_queue 테이블에 추가
// - priority 설정
```

### 5단계: Gemini 재생성

**스케줄**: 6시간마다 배치 처리

```typescript
// 큐에서 대기 중인 항목 조회
// Gemini API 호출
// - 모델: gemini-2.0-flash-exp (Lite 버전)
// - 프롬프트: 원본 데이터를 기반으로 고유 컨텐츠 생성
// - 재생성된 컨텐츠 저장
```

### 6단계: 발행

```typescript
// 재생성 완료 후
// - published: true
// - sitemap_excluded: false
// - noindex: false
// - 사이트맵에 포함
```

## 📝 구현 계획

### Phase 1: 데이터 수집 시스템 (1주)

- [ ] 공공데이터포털 API 클라이언트 구현
- [ ] 데이터 수집 스케줄러
- [ ] DB 스키마 생성
- [ ] 데이터 저장 로직

### Phase 2: 검색 시스템 (3일)

- [ ] 검색 API 엔드포인트
- [ ] 검색 결과 페이지
- [ ] 상세 페이지 (noindex)

### Phase 3: Gemini 통합 (1주)

- [ ] Gemini API 클라이언트
- [ ] 프롬프트 템플릿
- [ ] 재생성 로직
- [ ] 에러 처리 및 재시도

### Phase 4: 발행 시스템 (1주)

- [ ] 발행 큐 시스템
- [ ] 배치 처리 워커
- [ ] 사이트맵 제외/포함 로직
- [ ] 관리자 대시보드

### Phase 5: 모니터링 및 최적화 (3일)

- [ ] 모니터링 대시보드
- [ ] 성능 최적화
- [ ] 에러 알림

## 🔧 기술 스택

- **데이터베이스**: Turso (libSQL)
- **API**: 공공데이터포털 Open API
- **AI 모델**: Google Gemini 2.0 Flash (Lite)
- **스케줄링**: GitHub Actions Cron
- **큐 시스템**: DB 기반 큐 (향후 Redis로 확장 가능)

## 📊 예상 데이터량

- **수집 속도**: 일 100-500개
- **발행 속도**: 일 10-50개 (Gemini API 제한 고려)
- **누적 데이터**: 월 3,000-15,000개

## ⚠️ 주의사항

1. **API 제한**: 공공데이터포털 API 호출 제한 준수
2. **Gemini API**: 일일 할당량 및 비용 관리
3. **중복 방지**: 동일 데이터 중복 수집 방지
4. **품질 관리**: 재생성된 컨텐츠 품질 검증
5. **법적 준수**: 공공데이터 이용약관 준수

## 📈 성공 지표

- 데이터 수집 성공률 > 95%
- Gemini 재생성 성공률 > 90%
- 발행 대기 시간 < 24시간
- 검색 응답 시간 < 500ms
- 재생성된 컨텐츠 품질 점수 > 4.0/5.0

---

**작성일**: 2025-01-28
**버전**: 1.0.0

