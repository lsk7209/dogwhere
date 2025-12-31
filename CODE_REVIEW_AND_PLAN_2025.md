# 코드 검토 및 개선 계획 2025

**프로젝트**: 어서오개 (dogwhere)  
**검토 일자**: 2025년 1월  
**검토 범위**: 전체 코드베이스  
**저장소**: https://github.com/lsk7209/dogwhere

---

## 📊 현재 상태 요약

### ✅ 완료된 개선 사항

#### 보안 (이전 검토 대비 개선됨)
- ✅ **JWT 토큰 도입 완료**: `src/lib/auth/jwt-edge.ts` 사용 중
- ✅ **비밀번호 해싱 완료**: `src/lib/auth/password-edge.ts` 사용 중 (Edge Runtime 호환)
- ✅ **환경변수 검증 완료**: `src/lib/env.ts`에서 zod로 검증 중
- ✅ **동적 라우트 설정**: `force-dynamic` 올바르게 설정됨
- ✅ **쿠키 보안 설정**: httpOnly, secure, sameSite 설정 완료

**보안 점수**: 4/10 → **8/10** (개선됨)

### ⚠️ 남은 개선 사항

#### 1. 코드 품질 이슈
- **console.log 과다 사용**: 386개 (30개 파일)
  - 프로덕션에서 불필요한 로그 노출
  - 구조화된 로깅 시스템 필요
- **any 타입 과다 사용**: 75개 (38개 파일)
  - 타입 안전성 저하
  - 명시적 타입 정의 필요

#### 2. 데이터베이스 아키텍처
- **인메모리 데이터베이스 사용**: `src/lib/database/simple-places.ts`
  - 서버 재시작 시 데이터 손실
  - D1/Turso 마이그레이션 필요
  - 현재 사용 위치:
    - `src/app/api/simple-places/route.ts`
    - `src/app/admin/simple-places/page.tsx`
    - `src/lib/data-collection/simple-collector.ts`

#### 3. 에러 처리 표준화
- 일관된 에러 응답 형식 부재
- 공통 에러 핸들러 필요

---

## 📈 종합 평가

### 전체 점수: **7.5/10** (이전 7.0/10에서 개선)

**상세 점수**:
- 보안: **8/10** ✅ (이전 4/10에서 대폭 개선)
- 코드 품질: **7/10** ⚠️ (console.log, any 타입 개선 필요)
- 아키텍처: **8/10** ✅ (구조는 좋으나 DB 마이그레이션 필요)
- 성능: **7/10** ✅ (기본 최적화 완료)
- 타입 안전성: **6/10** ⚠️ (any 타입 제거 필요)
- 에러 처리: **6/10** ⚠️ (표준화 필요)

---

## 🎯 우선순위별 개선 계획

### 🔴 Phase 1: 즉시 개선 (1주차)

#### 1.1 프로덕션 로그 정리 (High Priority)
**예상 시간**: 1-2일  
**영향도**: 높음 (프로덕션 안정성)

**작업 내용**:
- [ ] 구조화된 로깅 시스템 도입
  - `src/lib/logger.ts` 확장 또는 개선
  - 환경별 로그 레벨 설정 (dev: debug, prod: error/warn만)
- [ ] console.log 제거 또는 대체
  - 디버깅용 console.log → logger.debug()
  - 에러 로그 → logger.error()
  - 정보 로그 → logger.info()
- [ ] 프로덕션 빌드에서 console.log 자동 제거 확인
  - `next.config.ts`의 `removeConsole` 설정 확인

**대상 파일** (우선순위):
1. `src/app/api/**/*.ts` (API 라우트)
2. `src/lib/**/*.ts` (라이브러리)
3. `scripts/**/*.ts` (스크립트는 유지 가능)

**예상 결과**: 프로덕션 로그 노출 제거, 디버깅 효율성 향상

#### 1.2 타입 안전성 개선 - 1단계 (High Priority)
**예상 시간**: 2-3일  
**영향도**: 높음 (타입 안전성, 버그 예방)

**작업 내용**:
- [ ] API 응답 타입 정의
  - `src/types/api.ts` 생성
  - 공통 응답 형식 정의
- [ ] 주요 any 타입 제거 (우선순위 높은 파일부터)
  - `src/lib/database/**/*.ts` (데이터베이스 관련)
  - `src/app/api/**/*.ts` (API 라우트)
  - `src/lib/public-data/**/*.ts` (공공데이터 관련)

**대상 파일** (우선순위):
1. `src/lib/database/turso-repository.ts` (12개)
2. `src/lib/public-data/collector.ts` (8개)
3. `src/lib/public-data/duplicate-checker.ts` (7개)
4. `src/lib/templates/renderer.ts` (5개)

**예상 결과**: 타입 안전성 향상, 런타임 에러 감소

---

### 🟡 Phase 2: 데이터베이스 마이그레이션 (2-3주차)

#### 2.1 인메모리 DB → D1/Turso 마이그레이션 (Critical)
**예상 시간**: 3-5일  
**영향도**: 매우 높음 (데이터 영속성)

**현재 상태**:
- 인메모리 DB: `src/lib/database/simple-places.ts` (샘플 데이터 20개+)
- D1/Turso: 스키마는 정의되어 있으나 사용되지 않음

**작업 내용**:
- [ ] 마이그레이션 전략 수립
  - 현재 인메모리 데이터 백업
  - D1 vs Turso 선택 (현재 Turso 사용 중인 것으로 보임)
- [ ] Repository 패턴 통합
  - `src/lib/database/turso-repository.ts` 확장
  - `src/lib/database/db-adapter.ts` 활용
- [ ] API 라우트 수정
  - `src/app/api/simple-places/route.ts` → Turso 사용
  - `src/app/admin/simple-places/page.tsx` → Turso 사용
- [ ] 데이터 마이그레이션 스크립트
  - 인메모리 데이터 → Turso 마이그레이션
  - `scripts/migrate-simple-places-to-turso.ts` 생성
- [ ] 인메모리 DB 제거
  - `src/lib/database/simple-places.ts` 삭제 또는 deprecated 처리

**검증 체크리스트**:
- [ ] 데이터 조회 정상 동작
- [ ] 데이터 생성/수정/삭제 정상 동작
- [ ] 관리자 페이지에서 데이터 표시 정상
- [ ] API 응답 시간 확인 (< 500ms)

**예상 결과**: 데이터 영속성 확보, 확장성 개선

---

### 🟢 Phase 3: 코드 품질 개선 (4-5주차)

#### 3.1 타입 안전성 개선 - 2단계 (Medium Priority)
**예상 시간**: 2-3일

**작업 내용**:
- [ ] 나머지 any 타입 제거
  - 유틸리티 페이지 컴포넌트
  - 템플릿 렌더러
  - 기타 라이브러리 파일
- [ ] 함수 반환 타입 명시
  - 모든 public 함수에 명시적 반환 타입 추가

#### 3.2 에러 처리 표준화 (Medium Priority)
**예상 시간**: 2-3일

**작업 내용**:
- [ ] 공통 에러 클래스 생성
  - `src/lib/api-error.ts` 생성
  - `ApiError`, `ValidationError`, `NotFoundError` 등
- [ ] 공통 에러 핸들러
  - `handleApiError` 함수 생성
  - 일관된 에러 응답 형식
- [ ] React Error Boundary 추가
  - `src/components/ErrorBoundary.tsx` 생성
  - 주요 페이지에 적용

---

## 📋 상세 작업 계획

### Week 1: 즉시 개선

#### Day 1-2: 로깅 시스템 개선
```typescript
// src/lib/logger.ts 개선
export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.info(`[INFO] ${message}`, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  error: (message: string, error?: Error, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, error, ...args)
  }
}
```

**대체 작업**:
- `src/app/api/**/*.ts`: `console.log` → `logger.debug`
- `src/app/api/**/*.ts`: `console.error` → `logger.error`
- `src/lib/**/*.ts`: 동일하게 대체

#### Day 3-5: 타입 안전성 개선 (1단계)
```typescript
// src/types/api.ts 생성
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
  }
  meta?: {
    timestamp: string
    version: string
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

**대체 작업**:
- `src/lib/database/turso-repository.ts`: any → 명시적 타입
- `src/lib/public-data/collector.ts`: any → 명시적 타입
- `src/app/api/**/*.ts`: 응답 타입 명시

---

### Week 2-3: 데이터베이스 마이그레이션

#### Day 1-2: 마이그레이션 전략 수립
- [ ] 현재 Turso 연결 상태 확인
- [ ] 스키마 확인 및 필요 시 업데이트
- [ ] 마이그레이션 스크립트 작성

#### Day 3-4: Repository 통합
- [ ] `turso-repository.ts`에 SimplePlace 메서드 추가
- [ ] `db-adapter.ts` 활용하여 통합 인터페이스 제공

#### Day 5-7: API 라우트 수정 및 테스트
- [ ] `src/app/api/simple-places/route.ts` 수정
- [ ] `src/app/admin/simple-places/page.tsx` 수정
- [ ] 통합 테스트
- [ ] 인메모리 DB 제거

---

### Week 4-5: 코드 품질 개선

#### Day 1-3: 타입 안전성 개선 (2단계)
- [ ] 나머지 any 타입 제거
- [ ] 함수 반환 타입 명시

#### Day 4-5: 에러 처리 표준화
- [ ] 공통 에러 클래스 생성
- [ ] 에러 핸들러 구현
- [ ] Error Boundary 추가

---

## 📊 진행 상황 추적

### Phase 1: 즉시 개선
- [ ] 프로덕션 로그 정리 (0%)
- [ ] 타입 안전성 개선 - 1단계 (0%)

### Phase 2: 데이터베이스 마이그레이션
- [ ] 마이그레이션 전략 수립 (0%)
- [ ] Repository 통합 (0%)
- [ ] API 라우트 수정 (0%)
- [ ] 인메모리 DB 제거 (0%)

### Phase 3: 코드 품질 개선
- [ ] 타입 안전성 개선 - 2단계 (0%)
- [ ] 에러 처리 표준화 (0%)

---

## 🎯 성공 기준

### Phase 1 완료 기준
- [ ] console.log 사용 386개 → 50개 이하 (스크립트 제외)
- [ ] 주요 API 라우트 any 타입 제거 완료
- [ ] 프로덕션 빌드에서 불필요한 로그 제거 확인

### Phase 2 완료 기준
- [ ] 인메모리 DB 완전 제거
- [ ] 모든 데이터 조회/생성/수정/삭제가 Turso/D1 사용
- [ ] 관리자 페이지 정상 동작 확인
- [ ] API 응답 시간 < 500ms 유지

### Phase 3 완료 기준
- [ ] any 타입 사용 75개 → 10개 이하
- [ ] 모든 public 함수에 명시적 반환 타입
- [ ] 공통 에러 처리 시스템 구축 완료
- [ ] Error Boundary 주요 페이지 적용 완료

---

## 📝 다음 단계 (즉시 시작 가능)

### 1단계: 로깅 시스템 개선
```bash
# 1. logger.ts 확인 및 개선
cat src/lib/logger.ts

# 2. 주요 API 라우트에서 console.log 찾기
grep -r "console.log" src/app/api/ | head -20

# 3. 대체 작업 시작
# - src/app/api/**/*.ts 파일들 수정
```

### 2단계: 타입 정의 생성
```bash
# 1. API 타입 정의 파일 생성
touch src/types/api.ts

# 2. 주요 any 타입 사용 파일 확인
grep -r ": any" src/lib/database/ | head -10
```

### 3단계: 데이터베이스 마이그레이션 준비
```bash
# 1. 현재 Turso 연결 상태 확인
npm run db:check

# 2. 스키마 확인
cat schema.sql | grep -i "simple_place\|place"

# 3. 마이그레이션 스크립트 작성
touch scripts/migrate-simple-places-to-turso.ts
```

---

## 🔗 관련 문서

- [코드 검토 요약](./CODE_REVIEW_SUMMARY.md) - 이전 검토 결과
- [코드 검토 상세](./CODE_REVIEW_DETAILED.md) - 상세 검토 내용
- [개발 로드맵](./DEVELOPMENT_ROADMAP.md) - 전체 개발 계획
- [PRD](./PRD.md) - 제품 요구사항 문서

---

## 📌 참고 사항

### 보안 개선 완료 사항
이전 검토에서 지적된 보안 이슈는 대부분 해결되었습니다:
- ✅ JWT 토큰 사용 (Edge Runtime 호환)
- ✅ 비밀번호 해싱 (Edge Runtime 호환)
- ✅ 환경변수 검증 (zod 사용)
- ✅ 동적 라우트 설정

### 남은 보안 개선 사항 (선택)
- [ ] Rate Limiting 추가 (API 보안 강화)
- [ ] CORS 설정 명시 (필요 시)
- [ ] Input Validation 강화 (zod 스키마 활용)

---

**마지막 업데이트**: 2025년 1월  
**다음 리뷰**: Phase 1 완료 후 (예상 1주 후)

