# Cloudflare Edge Runtime 호환성 가이드

## 개요

이 프로젝트는 Cloudflare Pages의 Edge Runtime에서 실행되도록 최적화되었습니다. Edge Runtime은 Node.js의 일부 기능을 제한하므로, 특정 라이브러리와 패턴을 사용해야 합니다.

## 주요 변경사항

### 1. JWT 인증 (Edge Runtime 호환)

**Before (Node.js 전용)**:
```typescript
import jwt from 'jsonwebtoken'
const token = jwt.sign(payload, secret)
```

**After (Edge Runtime 호환)**:
```typescript
import { generateToken, verifyToken } from '@/lib/auth/jwt-edge'
const token = await generateToken(username, secret, expiresIn)
```

**파일**: `src/lib/auth/jwt-edge.ts`
- Web Crypto API의 HMAC-SHA256 사용
- Base64URL 인코딩/디코딩
- Edge Runtime에서 완전히 작동

### 2. 비밀번호 해싱 (Edge Runtime 호환)

**Before (Node.js 전용)**:
```typescript
import bcrypt from 'bcryptjs'
const hash = await bcrypt.hash(password, 10)
```

**After (Edge Runtime 호환)**:
```typescript
import { hashPassword, verifyPassword } from '@/lib/auth/password-edge'
const hash = await hashPassword(password)
```

**파일**: `src/lib/auth/password-edge.ts`
- Web Crypto API의 PBKDF2 사용
- 100,000 반복, SHA-256 해시
- 상수 시간 비교로 타이밍 공격 방지

### 3. 환경변수 접근

**Before**:
```typescript
const secret = process.env.JWT_SECRET
```

**After**:
```typescript
import { env } from '@/lib/env'
const secret = env.JWT_SECRET
```

**파일**: `src/lib/env.ts`
- zod를 사용한 환경변수 검증
- Edge Runtime에서 안전하게 작동
- 빌드 시 기본값 제공

## Edge Runtime 제한사항

### 사용 불가능한 Node.js API

- ❌ `fs` (파일 시스템)
- ❌ `path` (일부 기능)
- ❌ `Buffer` (대신 `Uint8Array` 사용)
- ❌ `crypto` (Node.js 버전, 대신 Web Crypto API 사용)
- ❌ 네이티브 모듈 (`bcryptjs`, `jsonwebtoken` 등)

### 사용 가능한 API

- ✅ Web Crypto API (`crypto.subtle`)
- ✅ `fetch` API
- ✅ `TextEncoder` / `TextDecoder`
- ✅ `btoa` / `atob` (Base64 인코딩)
- ✅ 표준 JavaScript API

## D1 데이터베이스 접근

### Pages Functions에서

```typescript
// functions/api/places.ts
export async function onRequest(context: { request: Request; env: Env }) {
  const { env } = context
  const db = env.DB // 자동으로 주입됨
  // ...
}
```

### 크론 작업에서

```typescript
// functions/_cron.ts
export async function onScheduled(event: ScheduledEvent, env: Env) {
  const db = env.DB // 자동으로 주입됨
  // ...
}
```

### Next.js API Routes에서

Next.js API Routes는 Edge Runtime으로 실행되지만, D1 접근은 Pages Functions를 통해야 합니다.

**권장 방법**: API Routes는 Pages Functions로 마이그레이션하거나, API Routes에서는 D1을 사용하지 않고 다른 데이터 소스를 사용합니다.

## 크론 작업 설정

Cloudflare Pages에서는 대시보드에서 크론 트리거를 설정해야 합니다:

1. Cloudflare Dashboard → Pages → dogwhere
2. Settings → Functions → Cron Triggers
3. Add Cron Trigger 클릭
4. Cron expression 입력 (예: `0 */6 * * *` - 6시간마다)
5. Function 선택: `_cron.ts`

## 배포 체크리스트

- [x] 모든 API Routes에 `export const runtime = 'edge'` 추가
- [x] JWT 라이브러리를 Edge 호환 버전으로 교체
- [x] 비밀번호 해싱을 Edge 호환 버전으로 교체
- [x] `process.env` 대신 `env` 객체 사용
- [x] Node.js 전용 API 제거
- [x] 크론 작업 설정 확인

## 참고 자료

- [Cloudflare Edge Runtime 문서](https://developers.cloudflare.com/workers/runtime-apis/)
- [Web Crypto API 문서](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Next.js Edge Runtime 문서](https://nextjs.org/docs/app/api-reference/edge)

