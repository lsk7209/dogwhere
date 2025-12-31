export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { handleApiError, ValidationError, DatabaseError } from '@/lib/api-error'
import type { PublicDataSearchResponse, PublicDataPlace } from '@/types/api'

/**
 * 공공데이터 검색 API
 * published 여부와 관계없이 모든 데이터 검색
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const sido = searchParams.get('sido')
    const sigungu = searchParams.get('sigungu')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query && !sido && !category) {
      throw new ValidationError('검색어, 지역, 또는 카테고리가 필요합니다.')
    }

    const db = getTursoDatabase()
    const offset = (page - 1) * limit

    // 검색 조건 구성
    const conditions: string[] = []
    const params: (string | number)[] = []

    if (query) {
      conditions.push('(name LIKE ? OR address LIKE ? OR description LIKE ?)')
      const searchTerm = `%${query}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (sido) {
      conditions.push('sido = ?')
      params.push(sido)
    }

    if (sigungu) {
      conditions.push('sigungu = ?')
      params.push(sigungu)
    }

    if (category) {
      conditions.push('category = ?')
      params.push(category)
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    // 전체 개수 조회
    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM public_data_places ${whereClause}`,
      args: params,
    })
    const total = (countResult.rows[0]?.[0] as number) || 0

    // 데이터 조회
    const dataResult = await db.execute({
      sql: `
        SELECT 
          id, name, slug, category, address, sido, sigungu,
          latitude, longitude, phone, website,
          sitemap_excluded, noindex, regeneration_status,
          created_at, updated_at
        FROM public_data_places 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      args: [...params, limit, offset],
    })

    const data: PublicDataPlace[] = dataResult.rows.map(row => {
      const obj: Record<string, unknown> = {}
      for (let i = 0; i < dataResult.columns.length; i++) {
        obj[dataResult.columns[i]] = row[i]
      }
      return {
        id: String(obj.id || ''),
        name: String(obj.name || ''),
        slug: String(obj.slug || ''),
        category: obj.category ? String(obj.category) : undefined,
        address: obj.address ? String(obj.address) : undefined,
        sido: obj.sido ? String(obj.sido) : undefined,
        sigungu: obj.sigungu ? String(obj.sigungu) : undefined,
        latitude: obj.latitude ? Number(obj.latitude) : undefined,
        longitude: obj.longitude ? Number(obj.longitude) : undefined,
        phone: obj.phone ? String(obj.phone) : undefined,
        website: obj.website ? String(obj.website) : undefined,
        sitemap_excluded: Boolean(obj.sitemap_excluded),
        noindex: Boolean(obj.noindex),
        regeneration_status: String(obj.regeneration_status || ''),
        created_at: String(obj.created_at || ''),
        updated_at: String(obj.updated_at || '')
      }
    })

    const totalPages = Math.ceil(total / limit)

    const response: PublicDataSearchResponse = {
      success: true,
      data: {
        results: data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}

