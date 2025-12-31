/**
 * 공공데이터 테이블 스키마 마이그레이션 스크립트
 * 
 * 사용법:
 *   npx tsx scripts/migrate-public-data-schema.ts
 */

import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

const schema = `
-- 공공데이터 장소 테이블
CREATE TABLE IF NOT EXISTS public_data_places (
  id TEXT PRIMARY KEY,
  
  -- 공공데이터 원본 정보
  public_data_id TEXT NOT NULL,
  source_api TEXT NOT NULL,
  raw_data TEXT,
  
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
  sitemap_excluded BOOLEAN DEFAULT 1,
  noindex BOOLEAN DEFAULT 1,
  
  -- Gemini 재생성 정보
  original_content TEXT,
  regenerated_content TEXT,
  regeneration_status TEXT DEFAULT 'pending',
  regeneration_attempts INTEGER DEFAULT 0,
  last_regenerated_at DATETIME,
  gemini_model TEXT DEFAULT 'gemini-2.0-flash-exp',
  
  -- 메타데이터
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  collected_at DATETIME
);

-- 발행 큐 테이블
CREATE TABLE IF NOT EXISTS publish_queue (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  scheduled_at DATETIME,
  processed_at DATETIME,
  
  FOREIGN KEY (place_id) REFERENCES public_data_places(id) ON DELETE CASCADE
);

-- 인덱스 생성
-- 중복 체크 최적화: public_data_id + source_api 복합 인덱스 (가장 중요)
CREATE UNIQUE INDEX IF NOT EXISTS idx_public_data_places_unique ON public_data_places(public_data_id, source_api);

-- 증분 수집 최적화: collected_at 인덱스
CREATE INDEX IF NOT EXISTS idx_public_data_places_collected_at ON public_data_places(collected_at);
CREATE INDEX IF NOT EXISTS idx_public_data_places_source_collected ON public_data_places(source_api, collected_at);

-- 기타 인덱스
CREATE INDEX IF NOT EXISTS idx_public_data_places_sitemap_excluded ON public_data_places(sitemap_excluded);
CREATE INDEX IF NOT EXISTS idx_public_data_places_regenerated ON public_data_places(regeneration_status, regenerated_content);
CREATE INDEX IF NOT EXISTS idx_public_data_places_regeneration_status ON public_data_places(regeneration_status);
CREATE INDEX IF NOT EXISTS idx_public_data_places_source_api ON public_data_places(source_api);
CREATE INDEX IF NOT EXISTS idx_public_data_places_slug ON public_data_places(slug);

CREATE INDEX IF NOT EXISTS idx_publish_queue_status ON publish_queue(status);
CREATE INDEX IF NOT EXISTS idx_publish_queue_priority ON publish_queue(priority, scheduled_at);
`

async function main() {
  console.log('🚀 공공데이터 스키마 마이그레이션 시작\n')

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.error('❌ TURSO_DATABASE_URL과 TURSO_AUTH_TOKEN 환경 변수가 필요합니다.')
    process.exit(1)
  }

  const client = createClient({
    url,
    authToken,
  })

  try {
    // 연결 테스트
    const testResult = await client.execute({ 
      sql: 'SELECT 1 as test',
      args: []
    })
    console.log('✅ Turso 데이터베이스 연결 성공\n')

    // 스키마 적용 (개별 쿼리로 분리)
    console.log('📋 스키마 적용 중...')
    
    // 주석 제거 및 개별 쿼리로 분리
    const statements = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.execute({ sql: statement, args: [] })
          console.log(`  ✓ ${statement.substring(0, 50)}...`)
        } catch (error: any) {
          // 이미 존재하는 테이블/인덱스는 무시
          if (error?.message?.includes('already exists') || 
              error?.message?.includes('duplicate') ||
              error?.message?.includes('UNIQUE constraint')) {
            console.log(`  ⊘ 건너뜀: ${statement.substring(0, 50)}...`)
          } else {
            console.warn(`  ⚠️  경고: ${error?.message || 'Unknown error'}`)
            console.warn(`     쿼리: ${statement.substring(0, 100)}...`)
          }
        }
      }
    }
    console.log('✅ 스키마 적용 완료\n')

    // 테이블 확인
    const tablesResult = await client.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'public_data%'",
      args: []
    })
    const tables = tablesResult.rows.map(row => row[0] as string)
    console.log(`✅ 생성된 테이블: ${tables.join(', ')}\n`)

    console.log('✅ 마이그레이션 완료!')
    process.exit(0)
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error)
    process.exit(1)
  }
}

main()

