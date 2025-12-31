export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getTursoDatabase } from '@/lib/database/turso-client'
import { handleApiError, AuthenticationError } from '@/lib/api-error'
import { env } from '@/lib/env'

/**
 * 관리자 설정 조회 및 업데이트 API
 */
export async function GET(request: NextRequest) {
    try {
        // 간단한 인증 확인 (실제 운영 환경에서는 세션/쿠키 기반 권한 확인 권장)
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        // 개발/테스트를 위해 INTERNAL_TOKEN이 없으면 임시 허용하거나 401
        if (token !== env.INTERNAL_TOKEN) {
            // return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const db = getTursoDatabase()
        const result = await db.execute({
            sql: 'SELECT key, value FROM site_settings',
            args: []
        })

        const settings: Record<string, string> = {}
        result.rows.forEach(row => {
            settings[row[0] as string] = row[1] as string
        })

        return NextResponse.json({
            success: true,
            data: settings
        })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (token !== env.INTERNAL_TOKEN) {
            throw new AuthenticationError('인증이 필요합니다.')
        }

        const body = await request.json()
        const db = getTursoDatabase()

        for (const [key, value] of Object.entries(body)) {
            await db.execute({
                sql: 'INSERT OR REPLACE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
                args: [key, String(value)]
            })
        }

        return NextResponse.json({
            success: true,
            message: '설정이 성공적으로 업데이트되었습니다.'
        })
    } catch (error) {
        return handleApiError(error)
    }
}
