export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { collectAllPages } from '@/lib/public-data/collector'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { filterNewPlaces, getNewPlacesSince } from '@/lib/public-data/duplicate-checker'
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-error'
import { logger } from '@/lib/logger'

/**
 * 공공데이터 수집 API
 * GitHub Actions 크론에서 호출
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('인증이 필요합니다.')
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== env.INTERNAL_TOKEN) {
      throw new AuthenticationError('유효하지 않은 토큰입니다.')
    }

    const { source, config, incremental = true } = await request.json()

    if (!source || !config) {
      throw new ValidationError('source와 config가 필요합니다.')
    }

    const db = getTursoDatabase()

    // 증분 수집: 마지막 수집 시간 이후의 데이터만 수집
    let lastCollectedAt: string | null = null
    if (incremental) {
      const lastResult = await db.execute({
        sql: 'SELECT MAX(collected_at) as last_collected FROM public_data_places WHERE source_api = ?',
        args: [source],
      })
      lastCollectedAt = lastResult.rows[0]?.[0] as string | null

      if (lastCollectedAt) {
        logger.info(`[Public Data] 증분 수집: 마지막 수집 시간 ${lastCollectedAt}`)
      } else {
        logger.info(`[Public Data] 전체 수집: 기존 데이터 없음`)
      }
    }

    // 공공데이터 수집
    logger.info(`[Public Data] 수집 시작: ${source} (${incremental ? '증분' : '전체'})`)
    const places = await collectAllPages(config, incremental ? 5 : 10) // 증분 수집은 적은 페이지만

    logger.info(`[Public Data] 수집 완료: ${places.length}개`)

    // 중복 체크 및 신규 데이터 필터링
    let newPlaces: typeof places
    let existingPlaces: typeof places

    if (incremental && lastCollectedAt) {
      // 증분 수집: 마지막 수집 시간 이후의 신규 데이터만 확인
      logger.info(`[Public Data] 증분 수집: 신규 데이터 확인 중...`)
      const result = await getNewPlacesSince(source, lastCollectedAt, places)
      newPlaces = result.newPlaces
      existingPlaces = result.existingPlaces
      logger.info(`[Public Data] 신규: ${newPlaces.length}개, 기존: ${existingPlaces.length}개`)
    } else {
      // 전체 수집: 모든 데이터 중복 체크
      logger.info(`[Public Data] 전체 수집: 중복 체크 중...`)
      const result = await filterNewPlaces(places)
      newPlaces = result.newPlaces
      existingPlaces = result.existingPlaces
      logger.info(`[Public Data] 신규: ${newPlaces.length}개, 기존: ${existingPlaces.length}개`)
    }

    // 신규 데이터만 저장
    let added = 0
    let updated = 0
    let skipped = 0

    // 신규 데이터 저장 (배치 처리)
    if (newPlaces.length > 0) {
      logger.info(`[Public Data] 신규 데이터 ${newPlaces.length}개 저장 중...`)

      for (const place of newPlaces) {
        try {
          const id = `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          const slug = generateSlug(place.name)

          await db.execute({
            sql: `
              INSERT INTO public_data_places (
                id, public_data_id, source_api, raw_data,
                name, slug, category, address, sido, sigungu,
                latitude, longitude, phone, website,
                published, sitemap_excluded, noindex,
                collected_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 1, CURRENT_TIMESTAMP)
            `,
            args: [
              id,
              place.publicDataId,
              place.sourceApi,
              JSON.stringify(place.rawData),
              place.name,
              slug,
              place.category || null,
              place.address || null,
              place.sido || null,
              place.sigungu || null,
              place.latitude || null,
              place.longitude || null,
              place.phone || null,
              place.website || null,
            ],
          })
          added++
        } catch (error) {
          // UNIQUE 제약 위반 시 중복으로 처리
          if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
            skipped++
            logger.debug(`[Public Data] 중복 데이터 건너뜀: ${place.name}`)
          } else {
            logger.error(`[Public Data] 저장 실패: ${place.name}`, error as Error)
            skipped++
          }
        }
      }
    }

    // 기존 데이터 업데이트 (전체 수집 시에만)
    if (!incremental && existingPlaces.length > 0) {
      logger.info(`[Public Data] 기존 데이터 ${existingPlaces.length}개 업데이트 중...`)

      for (const place of existingPlaces) {
        try {
          await db.execute({
            sql: `
              UPDATE public_data_places 
              SET name = ?, category = ?, address = ?, sido = ?, sigungu = ?, 
                  latitude = ?, longitude = ?, phone = ?, website = ?,
                  raw_data = ?, updated_at = CURRENT_TIMESTAMP
              WHERE public_data_id = ? AND source_api = ?
            `,
            args: [
              place.name,
              place.category || null,
              place.address || null,
              place.sido || null,
              place.sigungu || null,
              place.latitude || null,
              place.longitude || null,
              place.phone || null,
              place.website || null,
              JSON.stringify(place.rawData),
              place.publicDataId,
              place.sourceApi,
            ],
          })
          updated++
        } catch (error) {
          logger.error(`[Public Data] 업데이트 실패: ${place.name}`, error as Error)
          skipped++
        }
      }
    } else if (incremental) {
      // 증분 수집 시 기존 데이터는 건너뜀
      skipped = existingPlaces.length
    }

    return NextResponse.json({
      success: true,
      data: {
        collected: places.length,
        new: newPlaces.length,
        existing: existingPlaces.length,
        added,
        updated,
        skipped,
        source,
        incremental,
        lastCollectedAt,
      },
      message: `공공데이터 ${incremental ? '증분' : '전체'} 수집이 완료되었습니다.`,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * 슬러그 생성
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

