export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getTursoDatabase } from '@/lib/database/turso-client'

/**
 * 데이터베이스 마이그레이션 API
 * API를 통해 스키마를 생성합니다
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          message: '인증이 필요합니다.',
          code: 'AUTH_REQUIRED'
        }
      }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== env.INTERNAL_TOKEN) {
      return NextResponse.json({
        success: false,
        error: {
          message: '유효하지 않은 토큰입니다.',
          code: 'INVALID_TOKEN'
        }
      }, { status: 401 })
    }

    const db = getTursoDatabase()

    // 스키마 SQL
    const statements = [
      `CREATE TABLE IF NOT EXISTS public_data_places (
        id TEXT PRIMARY KEY,
        public_data_id TEXT NOT NULL,
        source_api TEXT NOT NULL,
        raw_data TEXT,
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
        sitemap_excluded BOOLEAN DEFAULT 1,
        noindex BOOLEAN DEFAULT 1,
        original_content TEXT,
        regenerated_content TEXT,
        regeneration_status TEXT DEFAULT 'pending',
        regeneration_attempts INTEGER DEFAULT 0,
        last_regenerated_at DATETIME,
        gemini_model TEXT DEFAULT 'gemini-2.0-flash-exp',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        collected_at DATETIME
      )`,
      `CREATE TABLE IF NOT EXISTS publish_queue (
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
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_public_data_places_unique ON public_data_places(public_data_id, source_api)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_collected_at ON public_data_places(collected_at)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_source_collected ON public_data_places(source_api, collected_at)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_sitemap_excluded ON public_data_places(sitemap_excluded)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_regenerated ON public_data_places(regeneration_status, regenerated_content)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_regeneration_status ON public_data_places(regeneration_status)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_source_api ON public_data_places(source_api)`,
      `CREATE INDEX IF NOT EXISTS idx_public_data_places_slug ON public_data_places(slug)`,
      `CREATE INDEX IF NOT EXISTS idx_publish_queue_status ON publish_queue(status)`,
      `CREATE INDEX IF NOT EXISTS idx_publish_queue_priority ON publish_queue(priority, scheduled_at)`,
    ]

    const results: any[] = []

    for (const statement of statements) {
      try {
        await db.execute({ sql: statement, args: [] })
        results.push({ statement: statement.substring(0, 50) + '...', status: 'success' })
      } catch (error: any) {
        if (error?.message?.includes('already exists') || 
            error?.message?.includes('duplicate') ||
            error?.message?.includes('UNIQUE constraint')) {
          results.push({ statement: statement.substring(0, 50) + '...', status: 'skipped', reason: 'already exists' })
        } else {
          results.push({ statement: statement.substring(0, 50) + '...', status: 'error', error: error?.message })
        }
      }
    }

    // 테이블 확인
    const tablesResult = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'public_data%'",
      args: [],
    })
    const tables = tablesResult.rows.map(row => row[0] as string)

    return NextResponse.json({
      success: true,
      data: {
        results,
        tables,
      },
      message: '마이그레이션이 완료되었습니다.',
    })
  } catch (error) {
    console.error('Migrate API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: '마이그레이션 중 오류가 발생했습니다.',
        code: 'MIGRATE_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

