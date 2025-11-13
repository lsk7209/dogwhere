# Cloudflare Pages 크론 작업 설정 가이드

## ⚠️ 중요

Cloudflare Pages의 `wrangler.toml`에서는 `[triggers]` 섹션을 지원하지 않습니다.

## 🔧 크론 작업 설정 방법

### 방법 1: Cloudflare Pages 대시보드에서 설정 (권장)

1. **Cloudflare Dashboard 접속**
   - https://dash.cloudflare.com 접속
   - Pages → dogwhere 프로젝트 선택

2. **Functions 설정**
   - Settings → Functions 탭
   - Cron Triggers 섹션으로 이동

3. **크론 트리거 추가**
   - Add Cron Trigger 클릭
   - Cron expression 입력: `0 */6 * * *` (6시간마다 실행)
   - Function 선택: `_cron.ts`

4. **저장**
   - Save 클릭

### 방법 2: 별도의 Workers 프로젝트로 분리

크론 작업만 별도의 Workers 프로젝트로 분리하여 설정할 수 있습니다.

#### 2-1. 새 Workers 프로젝트 생성

```bash
# 새 디렉토리 생성
mkdir dogwhere-cron
cd dogwhere-cron

# wrangler 초기화
wrangler init
```

#### 2-2. wrangler.toml 설정

```toml
name = "dogwhere-cron"
compatibility_date = "2024-10-28"

[triggers]
crons = ["0 */6 * * *"]  # 6시간마다 실행

[[d1_databases]]
binding = "DB"
database_name = "dogwhere-db"
database_id = "7284cd81-bb1c-4d09-a7b0-4cbdd257b7d5"
```

#### 2-3. src/index.ts 작성

```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const db = env.DB as D1Database
    
    // 크론 작업 로직
    console.log(`[Cron] Scheduled event triggered at ${event.scheduledTime}`)
    
    // 통계 업데이트 등 작업 수행
    const countResult = await db
      .prepare('SELECT COUNT(*) as total FROM places')
      .first() as any
    
    console.log(`[Cron] Total places: ${countResult?.total}`)
  }
}
```

#### 2-4. 배포

```bash
wrangler deploy
```

## 📝 현재 구현

현재 `functions/_cron.ts` 파일은 작성되어 있지만, Cloudflare Pages 대시보드에서 크론 트리거를 설정해야 실행됩니다.

### 크론 작업 내용

- 통계 업데이트
- 데이터베이스 정리
- 캐시 무효화
- 기타 정기 작업

## 🔗 참고 자료

- [Cloudflare Pages Cron Triggers 문서](https://developers.cloudflare.com/pages/platform/functions/scheduled-functions/)
- [Cloudflare Workers Cron Triggers 문서](https://developers.cloudflare.com/workers/configuration/cron-triggers/)

