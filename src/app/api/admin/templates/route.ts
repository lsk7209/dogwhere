export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { TemplateRenderer, createRenderer } from '@/lib/templates/renderer'
import { templates, TemplateType } from '@/lib/templates/templates'
import { ContentLinter, createLinter } from '@/lib/templates/validators/linter'

/**
 * 관리자 인증 확인
 */
async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')

    if (!token) return false

    // 토큰 검증 로직 (실제 운영에서는 JWT 검증)
    const decoded = Buffer.from(token.value, 'base64').toString('utf-8')
    const [username, timestamp] = decoded.split(':')
    
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    const isExpired = (now - tokenTime) > (60 * 60 * 24 * 1000) // 24시간

    return !isExpired && username === process.env.ADMIN_USERNAME
  } catch {
    return false
  }
}

/**
 * 템플릿 렌더링 및 발행
 */
export async function POST(request: Request) {
  try {
    // 관리자 인증 확인
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({
        success: false,
        message: '관리자 인증이 필요합니다.'
      }, { status: 401 })
    }

    const body = await request.json()
    const {
      templateType,
      variables,
      options = {},
      publish = false
    } = body

    // 필수 필드 검증
    if (!templateType || !variables) {
      return NextResponse.json({
        success: false,
        message: '템플릿 타입과 변수가 필요합니다.'
      }, { status: 400 })
    }

    // 템플릿 존재 확인
    const template = templates[templateType as TemplateType]
    if (!template) {
      return NextResponse.json({
        success: false,
        message: '지원하지 않는 템플릿 타입입니다.'
      }, { status: 400 })
    }

    // 렌더러 및 린터 생성
    const renderer = createRenderer(options.seed)
    const linter = createLinter()

    // MDX 렌더링
    const mdxContent = renderer.renderMDX(template.mdx, variables, {
      enableJosa: true,
      enablePatterns: true,
      enableValidation: true
    })

    // JSON-LD 렌더링
    const jsonldContent = renderer.renderJSONLD(template.jsonld, variables, {
      enableJosa: true,
      enablePatterns: true,
      enableValidation: true
    })

    // 린팅 및 검증
    const lintResult = linter.lint(mdxContent, templateType, variables)

    // 발행 여부 확인
    if (publish) {
      if (!lintResult.isValid) {
        return NextResponse.json({
          success: false,
          message: '템플릿 검증에 실패했습니다.',
          errors: lintResult.errors,
          warnings: lintResult.warnings
        }, { status: 400 })
      }

      // 실제 발행 API 호출
      const publishResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.INTERNAL_TOKEN}`,
          'Idempotency-Key': `${templateType}-${variables.slug}-${variables.updated_at}`
        },
        body: JSON.stringify({
          type: templateType,
          slug: variables.slug,
          content: mdxContent,
          jsonld: jsonldContent,
          variables: variables,
          metadata: {
            template_version: '3.0',
            rendered_at: new Date().toISOString(),
            cqs_score: lintResult.score
          }
        })
      })

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json()
        return NextResponse.json({
          success: false,
          message: '발행에 실패했습니다.',
          error: errorData
        }, { status: publishResponse.status })
      }

      const publishData = await publishResponse.json()
      
      return NextResponse.json({
        success: true,
        message: '템플릿이 성공적으로 발행되었습니다.',
        data: {
          slug: publishData.slug,
          url: publishData.url,
          cqs_score: lintResult.score,
          published_at: new Date().toISOString()
        }
      })
    }

    // 미리보기 모드
    return NextResponse.json({
      success: true,
      data: {
        mdx: mdxContent,
        jsonld: jsonldContent,
        validation: {
          isValid: lintResult.isValid,
          score: lintResult.score,
          errors: lintResult.errors,
          warnings: lintResult.warnings,
          suggestions: lintResult.suggestions
        }
      }
    })

  } catch (error) {
    console.error('Template rendering error:', error)
    return NextResponse.json({
      success: false,
      message: '템플릿 렌더링 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * 템플릿 목록 조회
 */
export async function GET() {
  try {
    // 관리자 인증 확인
    const isAuthenticated = await checkAdminAuth()
    if (!isAuthenticated) {
      return NextResponse.json({
        success: false,
        message: '관리자 인증이 필요합니다.'
      }, { status: 401 })
    }

    // 템플릿 목록 반환
    const templateList = Object.keys(templates).map(key => ({
      type: key,
      name: getTemplateDisplayName(key as TemplateType),
      description: getTemplateDescription(key as TemplateType),
      hasMdx: true,
      hasJsonld: true
    }))

    return NextResponse.json({
      success: true,
      data: {
        templates: templateList,
        total: templateList.length
      }
    })

  } catch (error) {
    console.error('Template list error:', error)
    return NextResponse.json({
      success: false,
      message: '템플릿 목록 조회 중 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

/**
 * 템플릿 표시 이름 반환
 */
function getTemplateDisplayName(type: TemplateType): string {
  const names = {
    place: '장소 (Place)',
    event: '행사 (Event)',
    areaHub: '지역 허브 (Area Hub)',
    areaCluster: '지역 클러스터 (Area Cluster)',
    blogTopN: '블로그 TopN'
  }
  return names[type] || type
}

/**
 * 템플릿 설명 반환
 */
function getTemplateDescription(type: TemplateType): string {
  const descriptions = {
    place: '개별 장소에 대한 상세 페이지 템플릿',
    event: '행사 정보를 위한 템플릿',
    areaHub: '시/도 단위 지역 허브 페이지 템플릿',
    areaCluster: '시/군/구 × 카테고리 클러스터 페이지 템플릿',
    blogTopN: 'Top N 형태의 블로그 포스트 템플릿'
  }
  return descriptions[type] || '템플릿 설명이 없습니다.'
}
