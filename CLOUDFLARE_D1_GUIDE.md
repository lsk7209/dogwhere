# Cloudflare D1 데이터베이스 가이드

## 📋 개요

**중요**: Cloudflare D1은 **별도의 저장소가 필요 없습니다**. Cloudflare가 자동으로 데이터를 저장하고 관리합니다.

## 🎯 Cloudflare D1의 특징

### ✅ 자동 관리
- Cloudflare가 데이터를 자동으로 저장
- 백업 및 복구 자동 처리
- 확장성 자동 관리
- **별도 데이터베이스 서버 불필요**

### 📍 데이터 저장 위치
- Cloudflare의 글로벌 네트워크에 분산 저장
- 자동 복제 및 백업
- 사용자가 직접 관리할 필요 없음

## 🚀 설정 방법

### 1. D1 데이터베이스 생성

```bash
# D1 데이터베이스 생성
wrangler d1 create dogwhere-db
```

출력 예시:
```
✅ Successfully created DB 'dogwhere-db'!

[[d1_databases]]
binding = "DB"
database_name = "dogwhere-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. wrangler.toml 설정

`wrangler.toml` 파일에 다음을 추가:

```toml
[[d1_databases]]
binding = "DB"
database_name = "dogwhere-db"
database_id = "your-database-id-here"
```

### 3. 스키마 적용

```bash
# 로컬 D1에 스키마 적용 (개발용)
wrangler d1 execute dogwhere-db --file=./schema.sql --local

# 프로덕션 D1에 스키마 적용
wrangler d1 execute dogwhere-db --file=./schema.sql
```

### 4. Cloudflare Pages에서 사용

Cloudflare Pages에서는 `wrangler.toml`의 설정이 자동으로 적용됩니다.

**별도 설정 불필요!** Pages Functions에서 자동으로 D1 바인딩 사용 가능.

## 💻 코드에서 사용하기

### API Route에서 사용

```typescript
// src/app/api/places/route.ts
import { getD1Database } from '@/lib/database/d1-client'
import { PlaceRepository } from '@/lib/database/d1-repository'

export async function GET(request: Request) {
  const db = getD1Database()
  
  if (!db) {
    // 개발 환경에서는 인메모리 DB 사용
    // 또는 에러 반환
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }
  
  const repository = new PlaceRepository(db)
  const result = await repository.findAll(...)
  
  return NextResponse.json(result)
}
```

### Cloudflare Pages Functions에서 사용

```typescript
// functions/api/places.ts
export async function onRequest(context: EventContext) {
  const { env } = context
  
  // env.DB는 자동으로 주입됨
  const repository = new PlaceRepository(env.DB)
  const result = await repository.findAll(...)
  
  return new Response(JSON.stringify(result))
}
```

## 🔄 개발 환경 vs 프로덕션

### 개발 환경 (로컬)

**옵션 1: 로컬 D1 사용**
```bash
# 로컬 D1 실행
wrangler d1 execute dogwhere-db --local --file=./schema.sql

# 개발 서버 실행
npm run dev
```

**옵션 2: 인메모리 DB 사용 (현재 방식)**
- 개발 중에는 `simple-places.ts` 사용
- 프로덕션에서만 D1 사용

### 프로덕션 (Cloudflare)

- **자동으로 D1 사용**
- `wrangler.toml` 설정만으로 자동 연결
- 별도 설정 불필요

## 📊 데이터 관리

### 데이터 백업

**자동 백업**: Cloudflare가 자동으로 처리
- 정기적인 스냅샷 생성
- 자동 복구 지원

**수동 백업** (선택사항):
```bash
# 데이터 내보내기
wrangler d1 export dogwhere-db --output=backup.sql

# 데이터 가져오기
wrangler d1 execute dogwhere-db --file=backup.sql
```

### 데이터 조회

```bash
# 로컬 D1 쿼리
wrangler d1 execute dogwhere-db --local --command="SELECT * FROM places LIMIT 10"

# 프로덕션 D1 쿼리
wrangler d1 execute dogwhere-db --command="SELECT * FROM places LIMIT 10"
```

## 🔧 Cron 작업에서 사용

Cloudflare Cron Triggers에서도 동일하게 사용:

```typescript
// functions/_cron.ts 또는 src/app/api/cron/route.ts
export async function onSchedule(event: ScheduledEvent, env: Env) {
  const db = env.DB // 자동으로 주입됨
  
  const repository = new PlaceRepository(db)
  
  // 데이터 수집 작업
  const places = await collectPlaces()
  
  for (const place of places) {
    await repository.addPlace(place)
  }
}
```

## ❓ FAQ

### Q: 데이터를 어디에 저장하나요?
**A**: Cloudflare의 글로벌 네트워크에 자동으로 저장됩니다. 별도 저장소가 필요 없습니다.

### Q: 백업은 어떻게 하나요?
**A**: Cloudflare가 자동으로 백업합니다. 필요시 `wrangler d1 export`로 수동 백업 가능.

### Q: 로컬 개발은 어떻게 하나요?
**A**: `wrangler d1 execute --local`로 로컬 D1 사용하거나, 개발 중에는 인메모리 DB 사용.

### Q: 비용은 얼마인가요?
**A**: 
- 무료 플랜: 5GB 저장소, 1억 읽기/월, 5백만 쓰기/월
- 유료 플랜: 추가 용량 및 요청 가능

### Q: 데이터는 안전한가요?
**A**: 네, Cloudflare의 엔터프라이즈급 보안으로 보호됩니다.

## 🎯 현재 프로젝트 적용 방법

### 1단계: D1 데이터베이스 생성

```bash
wrangler d1 create dogwhere-db
```

### 2단계: wrangler.toml 업데이트

```toml
[[d1_databases]]
binding = "DB"
database_name = "dogwhere-db"
database_id = "your-database-id"
```

### 3단계: 스키마 적용

```bash
wrangler d1 execute dogwhere-db --file=./schema.sql
```

### 4단계: 코드 업데이트

기존 인메모리 DB를 D1으로 전환:

```typescript
// 기존
import { getAllPlaces } from '@/lib/database/simple-places'

// 새로운
import { getD1Database } from '@/lib/database/d1-client'
import { PlaceRepository } from '@/lib/database/d1-repository'

const db = getD1Database()
if (db) {
  const repository = new PlaceRepository(db)
  const places = await repository.findAll()
} else {
  // 개발 환경: 인메모리 DB 사용
  const places = getAllPlaces()
}
```

## ✅ 결론

**Cloudflare D1은 별도 저장소가 필요 없습니다!**

- ✅ Cloudflare가 자동 관리
- ✅ 백업 자동 처리
- ✅ 확장성 자동 처리
- ✅ 설정만으로 사용 가능

**해야 할 일**:
1. D1 데이터베이스 생성
2. `wrangler.toml` 설정
3. 스키마 적용
4. 코드에서 사용

**끝!** 별도 저장소 설정 불필요합니다.

