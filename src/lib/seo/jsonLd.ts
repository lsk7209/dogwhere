import { Metadata } from 'next'

// JSON-LD 스키마 생성 함수들

export interface PlaceData {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  phone?: string
  openingHours?: string[]
  rating: number
  reviewCount: number
  category: string
  features: string[]
}

export interface EventData {
  id: string
  title: string
  startDate: string
  endDate: string
  venue: string
  address: string
  lat: number
  lng: number
  ticketInfo: string
  petAllowed: boolean
}

export interface BreadcrumbItem {
  name: string
  url: string
}

// 장소용 JSON-LD 생성
export function generatePlaceJsonLd(place: PlaceData, breadcrumbs?: BreadcrumbItem[]) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://eoseo-o-gae.com/place/${place.id}`,
    "name": place.name,
    "description": `${place.name} - 강아지 동반 가능한 ${getCategoryName(place.category)}`,
    "url": `https://eoseo-o-gae.com/place/${place.id}`,
    "telephone": place.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": place.address,
      "addressCountry": "KR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lng
    },
    "openingHoursSpecification": place.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": extractDaysOfWeek(hours),
      "opens": extractOpenTime(hours),
      "closes": extractCloseTime(hours)
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": place.rating,
      "reviewCount": place.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "amenityFeature": place.features.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    }))
  }

  // 브레드크럼 추가
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLd["breadcrumb"] = {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  }

  return jsonLd
}

// 행사용 JSON-LD 생성
export function generateEventJsonLd(event: EventData, breadcrumbs?: BreadcrumbItem[]) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `https://eoseo-o-gae.com/event/${event.id}`,
    "name": event.title,
    "description": `${event.title} - ${event.petAllowed ? '반려견 동반 가능한' : ''} 행사`,
    "url": `https://eoseo-o-gae.com/event/${event.id}`,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.address,
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": event.lat,
        "longitude": event.lng
      }
    },
    "offers": {
      "@type": "Offer",
      "price": event.ticketInfo,
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    }
  }

  // 브레드크럼 추가
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLd["breadcrumb"] = {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  }

  return jsonLd
}

// FAQ용 JSON-LD 생성
export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

// 리스트용 JSON-LD 생성
export function generateItemListJsonLd(
  items: Array<{ id: string; name: string; url: string }>,
  title: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": title,
    "description": description,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "url": item.url
    }))
  }
}

// 메타데이터 생성 헬퍼
export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noindex = false
}: {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
}): Metadata {
  const metadata: Metadata = {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ko_KR',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: canonical ? { canonical } : undefined,
    robots: noindex ? 'noindex,follow' : 'index,follow',
  }

  return metadata
}

// 유틸리티 함수들
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'dog-cafe': '강아지 카페',
    'dog-park': '강아지 공원',
    'dog-hotel': '강아지 호텔',
    'restaurant': '강아지 식당'
  }
  return categoryNames[category] || category
}

function extractDaysOfWeek(hours: string): string[] {
  // "월-일: 10:00-22:00" -> ["Monday", "Tuesday", ...]
  if (hours.includes('월-일')) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
  if (hours.includes('월-금')) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
  if (hours.includes('토-일')) {
    return ['Saturday', 'Sunday']
  }
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}

function extractOpenTime(hours: string): string {
  const match = hours.match(/(\d{2}:\d{2})/)
  return match ? match[1] : '09:00'
}

function extractCloseTime(hours: string): string {
  const match = hours.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/)
  return match ? match[2] : '22:00'
}
