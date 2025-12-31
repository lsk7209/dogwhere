/**
 * 공공데이터 중복 체크 유틸리티
 * 배치 처리로 성능 최적화
 */

import { getTursoDatabase } from '@/lib/database/turso-client'

export interface PlaceIdentifier {
  publicDataId: string
  sourceApi: string
}

export interface DuplicateCheckResult {
  isNew: boolean
  existingId?: string
  collectedAt?: string
}

/**
 * 단일 항목 중복 체크
 */
export async function checkDuplicate(
  publicDataId: string,
  sourceApi: string
): Promise<DuplicateCheckResult> {
  const db = getTursoDatabase()

  const result = await db.execute({
    sql: `
      SELECT id, collected_at 
      FROM public_data_places 
      WHERE public_data_id = ? AND source_api = ?
    `,
    args: [publicDataId, sourceApi],
  })

  if (result.rows.length > 0) {
    return {
      isNew: false,
      existingId: result.rows[0][0] as string,
      collectedAt: result.rows[0][1] as string || undefined,
    }
  }

  return { isNew: true }
}

/**
 * 배치 중복 체크 (성능 최적화)
 * 여러 항목을 한 번에 확인하여 DB 쿼리 횟수 감소
 */
export async function checkDuplicatesBatch(
  identifiers: PlaceIdentifier[]
): Promise<Map<string, DuplicateCheckResult>> {
  if (identifiers.length === 0) {
    return new Map()
  }

  const db = getTursoDatabase()
  const results = new Map<string, DuplicateCheckResult>()

  // 배치 크기 제한 (SQLite IN 절 제한 고려)
  const batchSize = 100
  for (let i = 0; i < identifiers.length; i += batchSize) {
    const batch = identifiers.slice(i, i + batchSize)

    // IN 절을 위한 값 준비
    const placeholders = batch.map(() => '(?, ?)').join(', ')
    const args: (string | number)[] = []
    batch.forEach(id => {
      args.push(id.publicDataId, id.sourceApi)
    })

    // 배치 쿼리
    const result = await db.execute({
      sql: `
        SELECT public_data_id, source_api, id, collected_at
        FROM public_data_places
        WHERE (public_data_id, source_api) IN (${placeholders})
      `,
      args,
    })

    // 결과를 Map에 저장
    const existingMap = new Map<string, { id: string; collectedAt: string | null }>()
    for (const row of result.rows) {
      const key = `${row[0] as string}|${row[1] as string}`
      existingMap.set(key, {
        id: row[2] as string,
        collectedAt: row[3] as string | null,
      })
    }

    // 각 항목에 대해 결과 설정
    batch.forEach(id => {
      const key = `${id.publicDataId}|${id.sourceApi}`
      const existing = existingMap.get(key)

      if (existing) {
        results.set(key, {
          isNew: false,
          existingId: existing.id,
          collectedAt: existing.collectedAt || undefined,
        })
      } else {
        results.set(key, { isNew: true })
      }
    })
  }

  return results
}

/**
 * 신규 데이터만 필터링
 */
export async function filterNewPlaces<T extends { publicDataId: string; sourceApi: string }>(
  places: T[]
): Promise<{
  newPlaces: T[]
  existingPlaces: T[]
}> {
  const identifiers: PlaceIdentifier[] = places.map(p => ({
    publicDataId: p.publicDataId,
    sourceApi: p.sourceApi,
  }))

  const duplicateResults = await checkDuplicatesBatch(identifiers)

  const newPlaces: typeof places = []
  const existingPlaces: typeof places = []

  places.forEach(place => {
    const key = `${place.publicDataId}|${place.sourceApi}`
    const result = duplicateResults.get(key)

    if (result?.isNew) {
      newPlaces.push(place)
    } else {
      existingPlaces.push(place)
    }
  })

  return { newPlaces, existingPlaces }
}

/**
 * 증분 수집: 마지막 수집 시간 이후의 신규 데이터만 확인
 */
export async function getNewPlacesSince<T extends { publicDataId: string; sourceApi: string }>(
  sourceApi: string,
  since: string,
  places: T[]
): Promise<{
  newPlaces: T[]
  existingPlaces: T[]
}> {
  const db = getTursoDatabase()

  // 마지막 수집 시간 이후 수집된 데이터 조회
  const existingResult = await db.execute({
    sql: `
      SELECT public_data_id, source_api, collected_at
      FROM public_data_places
      WHERE source_api = ? AND collected_at > ?
    `,
    args: [sourceApi, since],
  })

  const existingSet = new Set<string>()
  for (const row of existingResult.rows) {
    const key = `${row[0] as string}|${row[1] as string}`
    existingSet.add(key)
  }

  const newPlaces: typeof places = []
  const existingPlaces: typeof places = []

  places.forEach(place => {
    const key = `${place.publicDataId}|${place.sourceApi}`
    if (existingSet.has(key)) {
      existingPlaces.push(place)
    } else {
      // 추가로 중복 체크 (전체 데이터 기준)
      newPlaces.push(place)
    }
  })

  // 전체 중복 체크
  const { newPlaces: finalNew, existingPlaces: finalExisting } = await filterNewPlaces(newPlaces)

  return {
    newPlaces: finalNew,
    existingPlaces: [...existingPlaces, ...finalExisting],
  }
}

