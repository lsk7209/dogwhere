import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTursoDatabase } from '@/lib/database/turso-client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * 공공데이터 장소 상세 페이지
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const db = getTursoDatabase()

  const result = await db.execute({
    sql: 'SELECT name, description, address, regenerated_content, noindex FROM public_data_places WHERE slug = ?',
    args: [slug],
  })

  if (!result || result.rows.length === 0) {
    return { title: '장소를 찾을 수 없습니다' }
  }

  const row = result.rows[0]
  const name = String(row[0] || '')
  const description = String(row[1] || '')
  const regeneratedContent = String(row[3] || '')
  const noindex = !!Number(row[4] || 0)

  const isRegenerated = regeneratedContent.trim() !== ''

  return {
    title: `${name} | 강아지 동반 장소`,
    description: description || `${name} 강아지 동반 장소 정보`,
    robots: (noindex || !isRegenerated) ? 'noindex, nofollow' : 'index, follow',
  }
}

export default async function PublicDataPlacePage(props: PageProps) {
  const params = await props.params
  const { slug } = params
  const db = getTursoDatabase()

  const result = await db.execute({
    sql: `
      SELECT 
        id, name, slug, category, description, address, sido, sigungu,
        latitude, longitude, phone, website,
        regeneration_status, regenerated_content,
        original_content, noindex, sitemap_excluded,
        created_at, updated_at
      FROM public_data_places 
      WHERE slug = ?
    `,
    args: [slug],
  })

  if (!result || result.rows.length === 0) {
    notFound()
  }

  const row = result.rows[0]

  // 모든 값을 문자열이나 숫자로 강제 변환 (Serialization 오류 방지)
  const place = {
    id: String(row[0] || ''),
    name: String(row[1] || ''),
    slug: String(row[2] || ''),
    category: String(row[3] || ''),
    description: String(row[4] || ''),
    address: String(row[5] || ''),
    sido: String(row[6] || ''),
    sigungu: String(row[7] || ''),
    latitude: Number(row[8] || 0),
    longitude: Number(row[9] || 0),
    phone: String(row[10] || ''),
    website: String(row[11] || ''),
    regenerationStatus: String(row[12] || ''),
    regeneratedContent: String(row[13] || ''),
    originalContent: String(row[14] || ''),
    noindex: !!Number(row[15] || 0),
    sitemapExcluded: !!Number(row[16] || 0),
    createdAt: String(row[17] || ''),
    updatedAt: String(row[18] || ''),
  }

  const content = (place.regeneratedContent || place.originalContent || place.description)
  const isRegenerated = place.regeneratedContent.trim() !== ''

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{place.name}</h1>
          {place.category && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {place.category}
            </span>
          )}
        </header>

        <div className="prose max-w-none mb-8 blog-content">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-600">상세 정보가 없습니다.</p>
          )}
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">기본 정보</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {place.address && (
              <>
                <dt className="font-semibold">주소</dt>
                <dd>{place.address}</dd>
              </>
            )}
            {place.phone && (
              <>
                <dt className="font-semibold">전화번호</dt>
                <dd>{place.phone}</dd>
              </>
            )}
            {place.website && (
              <>
                <dt className="font-semibold">웹사이트</dt>
                <dd>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                    {place.website}
                  </a>
                </dd>
              </>
            )}
            <dt className="font-semibold">상태</dt>
            <dd>
              {isRegenerated ? (
                <span className="text-green-600">재생성 완료 (노출 중)</span>
              ) : (
                <span className="text-gray-600">재생성 대기</span>
              )}
            </dd>
          </dl>
        </div>

        {place.noindex && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ 이 페이지는 검색 엔진에 인덱싱되지 않습니다.
            </p>
          </div>
        )}
      </article>
    </div>
  )
}
