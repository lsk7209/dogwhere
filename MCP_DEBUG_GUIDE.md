# MCP 디버깅 가이드

## 📋 개요

다양한 MCP(Model Context Protocol) 도구를 활용한 디버깅 시스템입니다. 시스템 상태, 데이터 검증, 쿼리 실행, API 테스트 등을 통합적으로 관리할 수 있습니다.

## 🔧 디버깅 API 엔드포인트

### 1. 시스템 상태 조회

**엔드포인트**: `GET /api/debug/system-status`

**기능:**
- 데이터베이스 연결 상태
- 공공데이터 통계
- 큐 상태
- API 키 상태
- 시스템 정보

**사용 예시:**
```bash
curl -X GET "http://localhost:3000/api/debug/system-status" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 2. 데이터베이스 쿼리 실행

**엔드포인트**: `POST /api/debug/query`

**기능:**
- 안전한 SELECT 쿼리만 실행
- 쿼리 실행 시간 측정
- 결과 포맷팅

**사용 예시:**
```bash
curl -X POST "http://localhost:3000/api/debug/query" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM public_data_places LIMIT 5",
    "params": []
  }'
```

**제한사항:**
- SELECT 쿼리만 허용
- DROP, DELETE, UPDATE, INSERT 등 위험한 키워드 차단

### 3. API 엔드포인트 테스트

**엔드포인트**: `POST /api/debug/test-endpoint`

**기능:**
- 내부 API 엔드포인트 테스트
- 응답 시간 측정
- 헤더 및 상태 코드 확인

**사용 예시:**
```bash
curl -X POST "http://localhost:3000/api/debug/test-endpoint" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "/api/public-data/queue",
    "method": "GET"
  }'
```

### 4. 데이터 검증

**엔드포인트**: `GET /api/debug/validate-data`

**기능:**
- 재생성 완료되었지만 사이트맵 제외된 항목 확인
- 큐에 있지만 이미 재생성된 항목 확인
- 슬러그 중복 확인
- 공공데이터 ID 중복 확인
- 재생성 상태 불일치 확인

**사용 예시:**
```bash
curl -X GET "http://localhost:3000/api/debug/validate-data" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 5. 로그 조회

**엔드포인트**: `GET /api/debug/logs`

**기능:**
- 디버그 로그 파일 읽기
- 로그 분석 (가설별, 위치별)
- 에러 로그 필터링

**사용 예시:**
```bash
curl -X GET "http://localhost:3000/api/debug/logs?lines=50" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

**파라미터:**
- `lines`: 조회할 로그 라인 수 (기본값: 100)
- `path`: 로그 파일 경로 (기본값: `.cursor/debug.log`)

## 🎯 디버깅 워크플로우

### 1. 시스템 상태 확인

```bash
# 전체 시스템 상태 확인
curl -X GET "http://localhost:3000/api/debug/system-status" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 2. 데이터 검증

```bash
# 데이터 무결성 검사
curl -X GET "http://localhost:3000/api/debug/validate-data" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

### 3. 문제 발견 시 쿼리로 상세 확인

```bash
# 특정 데이터 조회
curl -X POST "http://localhost:3000/api/debug/query" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM public_data_places WHERE regeneration_status = ?",
    "params": ["completed"]
  }'
```

### 4. API 엔드포인트 테스트

```bash
# 재생성 API 테스트
curl -X POST "http://localhost:3000/api/debug/test-endpoint" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "/api/public-data/regenerate",
    "method": "POST",
    "body": {"batch": true}
  }'
```

### 5. 로그 분석

```bash
# 최근 로그 확인
curl -X GET "http://localhost:3000/api/debug/logs?lines=100" \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
```

## 📊 응답 형식

### 시스템 상태

```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-28T...",
    "environment": "development",
    "database": {
      "type": "turso",
      "available": true,
      "connected": true,
      "tables": ["public_data_places", "publish_queue", ...]
    },
    "publicData": {
      "total": 150,
      "regenerated": 45,
      "inSitemap": 45,
      "indexed": 45
    },
    "queue": {
      "pending": 10,
      "processing": 2,
      "completed": 50
    },
    "api": {
      "googlePlaces": true,
      "kakao": true,
      "gemini": true
    }
  }
}
```

### 데이터 검증

```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-28T...",
    "checks": [
      {
        "name": "재생성 완료되었지만 사이트맵 제외된 항목",
        "status": "pass",
        "count": 0,
        "message": "정상"
      },
      {
        "name": "큐에 있지만 이미 재생성된 항목",
        "status": "warning",
        "count": 2,
        "message": "2개 항목이 중복으로 큐에 있습니다."
      }
    ],
    "summary": {
      "total": 5,
      "pass": 4,
      "warning": 1,
      "error": 0,
      "overall": "warning"
    }
  }
}
```

## 🔒 보안

- 모든 디버깅 API는 `INTERNAL_TOKEN` 인증 필요
- 쿼리 API는 SELECT만 허용
- 엔드포인트 테스트는 내부 URL만 허용
- 프로덕션 환경에서는 추가 보안 검사

## 🚀 활용 예시

### 문제: 재생성이 진행되지 않음

1. **시스템 상태 확인**
   ```bash
   GET /api/debug/system-status
   ```
   → 큐 상태, 데이터베이스 연결 확인

2. **데이터 검증**
   ```bash
   GET /api/debug/validate-data
   ```
   → 중복 항목, 상태 불일치 확인

3. **큐 상태 상세 확인**
   ```bash
   POST /api/debug/query
   {
     "query": "SELECT * FROM publish_queue WHERE status = 'pending'"
   }
   ```

4. **재생성 API 테스트**
   ```bash
   POST /api/debug/test-endpoint
   {
     "endpoint": "/api/public-data/regenerate",
     "method": "POST",
     "body": {"batch": true}
   }
   ```

### 문제: 사이트맵에 포함되지 않음

1. **데이터 검증**
   ```bash
   GET /api/debug/validate-data
   ```
   → "재생성 완료되었지만 사이트맵 제외된 항목" 확인

2. **해당 항목 조회**
   ```bash
   POST /api/debug/query
   {
     "query": "SELECT id, slug, regenerated_content, sitemap_excluded FROM public_data_places WHERE regenerated_content IS NOT NULL AND sitemap_excluded = 1"
   }
   ```

## 📝 주의사항

1. **쿼리 API**: SELECT만 허용, 위험한 키워드 차단
2. **엔드포인트 테스트**: 내부 URL만 허용
3. **로그 파일**: 파일 시스템 접근 필요 (Edge Runtime에서는 제한적)
4. **프로덕션**: 모든 디버깅 API는 인증 필수

---

**작성일**: 2025-01-28  
**버전**: 1.0.0

