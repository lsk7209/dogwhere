# 다음 단계 실행 가이드

## ✅ 현재 완료된 작업

1. ✅ **데이터베이스 스키마 생성** - 완료
2. ✅ **초기 데이터 수집** - 126개 저장 완료
3. ✅ **검색 API 수정** - `published` 컬럼 제거, `sitemap_excluded`, `noindex` 사용
4. ✅ **재생성 로직 검증** - 재생성 완료 시 즉시 사이트맵 포함
5. ✅ **사이트맵 통합 검증** - 재생성 완료된 항목만 포함

## 📊 현재 데이터베이스 상태

- **전체 데이터**: 126개
- **사이트맵 제외**: 126개 (초기 수집 상태)
- **재생성 완료**: 0개
- **큐에 추가 가능**: 126개

## 🚀 다음 단계 실행 방법

### 방법 1: 자동 테스트 스크립트 (권장)

```bash
# 1. 개발 서버 실행 (별도 터미널)
npm run dev

# 2. 워크플로우 테스트 (새 터미널)
npm run test:queue-regenerate
```

### 방법 2: 수동 테스트

#### 1단계: 개발 서버 실행
```bash
npm run dev
```

#### 2단계: 검색 API 테스트
브라우저에서:
```
http://localhost:3000/api/public-data/search?q=올리브영&limit=5
```

또는 curl:
```bash
curl "http://localhost:3000/api/public-data/search?q=올리브영&limit=5"
```

#### 3단계: 큐에 항목 추가
```bash
curl -X POST "http://localhost:3000/api/public-data/queue" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true, "limit": 5}'
```

#### 4단계: Gemini 재생성 (GEMINI_API_KEY 필요)
```bash
curl -X POST "http://localhost:3000/api/public-data/regenerate" \
  -H "Authorization: Bearer $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"batch": true}'
```

#### 5단계: 사이트맵 확인
```
http://localhost:3000/sitemap.xml
```

### 방법 3: 데이터베이스 직접 확인

```bash
# 현재 상태 확인
npm run verify:workflow
```

## 📋 테스트 체크리스트

### ✅ 코드 검증 완료
- [x] 검색 API - `published` 제거, 올바른 필드 사용
- [x] 큐 관리 API - 재생성된 컨텐츠 없는 항목만 추가
- [x] 재생성 API - 완료 시 즉시 사이트맵 포함
- [x] 사이트맵 통합 - 재생성 완료된 항목만 포함

### ⏳ 실제 테스트 필요
- [ ] 개발 서버 실행
- [ ] 검색 API 동작 확인
- [ ] 큐에 항목 추가 확인
- [ ] Gemini 재생성 테스트 (GEMINI_API_KEY 필요)
- [ ] 사이트맵 포함 확인

## 🔧 환경 변수 확인

`.env.local` 파일에 다음이 설정되어 있어야 합니다:

```env
# 필수
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
INTERNAL_TOKEN=...

# 재생성 테스트용 (선택)
GEMINI_API_KEY=...

# 공공데이터 수집용
PUBLIC_DATA_API_KEY=...
```

## 📝 예상 결과

### 큐 추가 후
- 큐에 5개 항목 추가됨
- 큐 상태: `pending: 5`

### 재생성 후 (GEMINI_API_KEY 있으면)
- 재생성 완료: 5개
- 사이트맵 포함: 5개
- 큐 상태: `pending: 0` (완료된 항목은 큐에서 제거)

### 사이트맵 확인
- `/public-data/place/{slug}` 형태로 URL 생성
- 재생성 완료된 항목만 포함

## ⚠️ 주의사항

1. **개발 서버 실행 필요**: 모든 API 테스트는 개발 서버가 실행 중이어야 합니다.
2. **GEMINI_API_KEY**: 재생성 테스트를 위해서는 Gemini API 키가 필요합니다.
3. **API 제한**: Gemini API는 일일 할당량이 있으므로 테스트 시 주의하세요.

## 🎯 빠른 시작

가장 빠른 테스트 방법:

```bash
# 터미널 1: 개발 서버 실행
npm run dev

# 터미널 2: 상태 확인
npm run verify:workflow

# 터미널 3: 큐 추가 및 재생성 테스트
npm run test:queue-regenerate
```

