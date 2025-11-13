# Cloudflare Pages Functions 가이드

## 📋 개요

Cloudflare Pages는 **정적 사이트 생성(SSG)**과 **서버리스 Functions**를 결합합니다.

**중요**: Next.js의 `output: 'export'` 모드에서는 API Routes가 작동하지 않습니다. 대신 Cloudflare Pages Functions를 사용해야 합니다.

## 🏗 아키텍처

### 파일 구조

```
project-root/
├── src/
│   └── app/
│       └── api/          # Next.js API Routes (개발용, 빌드 시 제외됨)
├── functions/            # Cloudflare Pages Functions (프로덕션)
│   ├── api/
│   │   ├── places.ts     # /api/places 엔드포인트
│   │   └── places/
│   │       └── [slug].ts # /api/places/[slug] 엔드포인트
│   └── _cron.ts          # 크론 작업
└── out/                  # 빌드 출력 (정적 파일)
```

## 🔧 Pages Functions 작성 방법

### 기본 구조

```typescript
// functions/api/places.ts
export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context
  
  // env.DB로 D1 접근
  const db = env.DB as D1Database
  
  // 로직 처리
  const data = await processRequest(db)
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

### 동적 라우트

```typescript
// functions/api/places/[slug].ts
export async function onRequest(
  context: EventContext<{ slug: string }>
): Promise<Response> {
  const { params, env } = context
  const { slug } = params  // 자동으로 파싱됨
  
  const db = env.DB as D1Database
  // ...
}
```

## 🔄 마이그레이션 가이드

### Next.js API Routes → Pages Functions

**Before (Next.js API Route)**:
```typescript
// src/app/api/places/route.ts
export async function GET(request: NextRequest) {
  const db = getD1Database() // ❌ 작동 안 함
  // ...
}
```

**After (Pages Functions)**:
```typescript
// functions/api/places.ts
export async function onRequest(context: EventContext) {
  const { env } = context
  const db = env.DB as D1Database // ✅ 작동함
  // ...
}
```

## ⏰ 크론 작업

### 설정

`wrangler.toml`:
```toml
[triggers]
crons = ["0 */6 * * *"]  # 6시간마다 실행
```

### 구현

```typescript
// functions/_cron.ts
export async function onScheduled(
  event: ScheduledEvent,
  env: Env
): Promise<void> {
  const db = env.DB as D1Database
  // 크론 작업 로직
}
```

## 📊 D1 데이터베이스 접근

### Pages Functions에서

```typescript
export async function onRequest(context: EventContext) {
  const { env } = context
  const db = env.DB as D1Database  // 자동으로 주입됨
  
  const repository = new PlaceRepository(db)
  const result = await repository.findAll(...)
}
```

### 크론에서

```typescript
export async function onScheduled(event: ScheduledEvent, env: Env) {
  const db = env.DB as D1Database  // 자동으로 주입됨
  // ...
}
```

## 🚀 배포

### 빌드 프로세스

1. **Next.js 빌드**: 정적 페이지 생성 (`out/` 디렉토리)
2. **Functions 배포**: `functions/` 디렉토리의 함수들 자동 배포
3. **통합**: 정적 페이지 + Functions = 완전한 애플리케이션

### 빌드 명령어

```bash
npm run build  # Next.js 빌드 (정적 파일 생성)
# Cloudflare Pages가 자동으로 functions/도 배포
```

## ⚠️ 주의사항

### 1. API Routes vs Functions

- ❌ **Next.js API Routes** (`src/app/api/*`): `output: 'export'` 모드에서 작동 안 함
- ✅ **Pages Functions** (`functions/api/*`): 프로덕션에서 작동

### 2. 개발 환경

로컬 개발 시:
- Next.js 개발 서버 사용 (`npm run dev`)
- API Routes는 개발 서버에서 작동
- 프로덕션 배포 시에는 Functions 사용

### 3. 타입 정의

```typescript
// types/cloudflare.d.ts
interface Env {
  DB: D1Database
  KV?: KVNamespace
  R2?: R2Bucket
}

interface EventContext<Params = unknown> {
  request: Request
  env: Env
  params: Params
  waitUntil: (promise: Promise<any>) => void
  passThroughOnException: () => void
  next: () => Promise<Response>
  data: Record<string, any>
}
```

## 📝 예시

### 장소 목록 API

```typescript
// functions/api/places.ts
import { PlaceRepository } from '../../src/lib/database/d1-repository'

export async function onRequest(context: EventContext): Promise<Response> {
  const { request, env } = context
  const { searchParams } = new URL(request.url)
  
  const db = env.DB as D1Database
  const repository = new PlaceRepository(db)
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  
  const result = await repository.findAll(
    {},
    { field: 'created_at', order: 'DESC' },
    { page, limit }
  )
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## 🔗 참고 자료

- [Cloudflare Pages Functions 문서](https://developers.cloudflare.com/pages/platform/functions/)
- [D1 데이터베이스 문서](https://developers.cloudflare.com/d1/)
- [Cron Triggers 문서](https://developers.cloudflare.com/pages/platform/functions/scheduled-functions/)

