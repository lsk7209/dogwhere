import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  canonical?: string
  breadcrumb?: BreadcrumbItem[]
  region?: string
  badge?: string
  noindex?: boolean
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface OGImageConfig {
  title: string
  region?: string
  badge?: string
  type?: 'place' | 'event' | 'blog' | 'guide'
}

// SEO 메타데이터 빌더
export function buildSeo(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const siteName = '어서오개'
  
  const title = config.title.includes(siteName) 
    ? config.title 
    : `${config.title} | ${siteName}`
  
  const description = config.description.length > 155 
    ? config.description.substring(0, 152) + '...'
    : config.description

  const canonical = config.canonical || baseUrl

  return {
    title,
    description,
    robots: config.noindex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
      locale: 'ko_KR',
      images: [
        {
          url: buildOgUrl({
            title: config.title,
            region: config.region,
            badge: config.badge
          }),
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [buildOgUrl({
        title: config.title,
        region: config.region,
        badge: config.badge
      })]
    },
    alternates: {
      canonical
    }
  }
}

// OG 이미지 URL 빌더
export function buildOgUrl(config: OGImageConfig): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const params = new URLSearchParams({
    title: config.title,
    ...(config.region && { region: config.region }),
    ...(config.badge && { badge: config.badge }),
    ...(config.type && { type: config.type })
  })
  
  return `${baseUrl}/api/og?${params.toString()}`
}

// 브레드크럼 JSON-LD 생성
export function buildBreadcrumbJsonLd(breadcrumbs: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// 지역명 매핑
export const regionMapping = {
  'seoul': '서울특별시',
  'busan': '부산광역시',
  'daegu': '대구광역시',
  'incheon': '인천광역시',
  'gwangju': '광주광역시',
  'daejeon': '대전광역시',
  'ulsan': '울산광역시',
  'gyeonggi': '경기도',
  'gangwon': '강원도',
  'chungbuk': '충청북도',
  'chungnam': '충청남도',
  'jeonbuk': '전라북도',
  'jeonnam': '전라남도',
  'gyeongbuk': '경상북도',
  'gyeongnam': '경상남도',
  'jeju': '제주특별자치도'
}

// 카테고리명 매핑
export const categoryMapping = {
  'cafe': '카페',
  'restaurant': '식당',
  'accommodation': '숙박',
  'outdoor': '야외',
  'shopping': '쇼핑',
  'entertainment': '엔터테인먼트',
  'medical': '의료',
  'other': '기타'
}

// 안전 배지 매핑
export const badgeMapping = {
  'pet-friendly': '펫프렌들리',
  'dog-park': '강아지 놀이터',
  'indoor': '실내 가능',
  'outdoor': '야외 가능',
  'parking': '주차 가능',
  'wifi': 'Wi-Fi 제공',
  'water-bowl': '물그릇 제공',
  'leash-required': '목줄 필수',
  'large-dog': '대형견 가능'
}
