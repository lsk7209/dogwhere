// RSS 피드 타입 정의
export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
  category?: string
  author?: string
}

export interface RSSChannel {
  title: string
  link: string
  description: string
  language: string
  lastBuildDate: string
  generator: string
  items: RSSItem[]
}

// 블로그 포스트 RSS 아이템 생성
export function generateBlogRSSItems(): RSSItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  
  const blogPosts = [
    {
      slug: 'jeju-dog-travel-guide',
      title: '제주도 강아지 동반 여행 완벽 가이드',
      description: '제주도에서 강아지와 함께하는 즐거운 여행을 위한 모든 정보를 담은 완벽 가이드입니다.',
      pubDate: '2024-01-15T10:00:00Z'
    },
    {
      slug: 'dog-cafe-selection-guide',
      title: '강아지 동반 카페 선택 가이드',
      description: '강아지와 함께 갈 수 있는 카페를 선택하는 방법과 주의사항을 알려드립니다.',
      pubDate: '2024-01-10T14:30:00Z'
    },
    {
      slug: 'dog-health-travel-guide',
      title: '강아지 건강 여행 가이드',
      description: '여행 중 강아지의 건강을 지키는 방법과 응급처치 요령을 알아보세요.',
      pubDate: '2024-01-05T09:15:00Z'
    },
    {
      slug: 'dog-friendly-accommodation-guide',
      title: '강아지 동반 숙박 시설 가이드',
      description: '강아지와 함께 머물 수 있는 숙박 시설을 찾는 방법과 예약 시 주의사항을 안내합니다.',
      pubDate: '2024-01-01T16:45:00Z'
    },
    {
      slug: 'dog-park-seoul-guide',
      title: '서울 강아지 놀이터 완벽 가이드',
      description: '서울 내 강아지 놀이터와 공원 정보를 상세히 소개합니다.',
      pubDate: '2023-12-28T11:20:00Z'
    },
    {
      slug: 'dog-restaurant-etiquette-guide',
      title: '강아지 동반 식당 매너 가이드',
      description: '강아지와 함께 식당을 이용할 때 지켜야 할 매너와 에티켓을 알려드립니다.',
      pubDate: '2023-12-25T13:10:00Z'
    }
  ]

  return blogPosts.map(post => ({
    title: post.title,
    link: `${baseUrl}/blog/${post.slug}`,
    description: post.description,
    pubDate: post.pubDate,
    guid: `${baseUrl}/blog/${post.slug}`,
    category: '강아지 동반 여행',
    author: '어서오개 팀'
  }))
}

// 가이드 RSS 아이템 생성
export function generateGuideRSSItems(): RSSItem[] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  
  const guides = [
    {
      slug: 'dog-travel-transport-guide',
      title: '강아지 동반 교통수단 이용 가이드',
      description: '강아지와 함께 대중교통을 이용하는 방법과 주의사항을 상세히 안내합니다.',
      pubDate: '2024-01-12T08:30:00Z'
    },
    {
      slug: 'dog-accommodation-guide',
      title: '강아지 동반 숙박 완벽 가이드',
      description: '강아지와 함께 머물 수 있는 다양한 숙박 시설과 선택 기준을 알려드립니다.',
      pubDate: '2024-01-08T15:45:00Z'
    },
    {
      slug: 'dog-meal-travel-guide',
      title: '강아지 여행 식사 관리 가이드',
      description: '여행 중 강아지의 식사 관리와 영양 섭취에 대한 완벽한 가이드입니다.',
      pubDate: '2024-01-03T12:15:00Z'
    },
    {
      slug: 'dog-health-care-guide',
      title: '강아지 건강 관리 가이드',
      description: '여행 전후 강아지의 건강 관리 방법과 주의사항을 상세히 안내합니다.',
      pubDate: '2023-12-30T10:00:00Z'
    },
    {
      slug: 'dog-safety-travel-guide',
      title: '강아지 안전 여행 가이드',
      description: '강아지와 함께 안전한 여행을 위한 필수 체크리스트와 안전 수칙을 알려드립니다.',
      pubDate: '2023-12-27T14:20:00Z'
    },
    {
      slug: 'dog-behavior-travel-guide',
      title: '강아지 행동 관리 여행 가이드',
      description: '여행 중 강아지의 행동 관리와 스트레스 해소 방법을 안내합니다.',
      pubDate: '2023-12-22T09:30:00Z'
    }
  ]

  return guides.map(guide => ({
    title: guide.title,
    link: `${baseUrl}/guide/${guide.slug}`,
    description: guide.description,
    pubDate: guide.pubDate,
    guid: `${baseUrl}/guide/${guide.slug}`,
    category: '강아지 동반 가이드',
    author: '어서오개 팀'
  }))
}

// 전체 RSS 채널 생성
export function generateFullRSSChannel(): RSSChannel {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const now = new Date().toISOString()
  
  const blogItems = generateBlogRSSItems()
  const guideItems = generateGuideRSSItems()
  
  // 최신순으로 정렬
  const allItems = [...blogItems, ...guideItems].sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )

  return {
    title: '어서오개 (EOSEO-O-GAE) - 강아지 동반 여행 정보',
    link: baseUrl,
    description: '강아지와 함께하는 즐거운 여행을 위한 모든 정보를 제공하는 어서오개입니다. 강아지 동반 카페, 식당, 숙박, 관광지 정보와 실용적인 여행 가이드를 만나보세요.',
    language: 'ko-KR',
    lastBuildDate: now,
    generator: '어서오개 RSS Generator v1.0',
    items: allItems
  }
}

// RSS XML 생성
export function generateRSSXml(channel: RSSChannel): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const rssOpen = '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'
  const rssClose = '</rss>'

  const channelXml = `
  <channel>
    <title><![CDATA[${channel.title}]]></title>
    <link>${channel.link}</link>
    <description><![CDATA[${channel.description}]]></description>
    <language>${channel.language}</language>
    <lastBuildDate>${channel.lastBuildDate}</lastBuildDate>
    <generator>${channel.generator}</generator>
    <atom:link href="${channel.link}/rss" rel="self" type="application/rss+xml"/>
    
    ${channel.items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
      ${item.category ? `<category><![CDATA[${item.category}]]></category>` : ''}
      ${item.author ? `<author><![CDATA[${item.author}]]></author>` : ''}
    </item>`).join('')}
  </channel>`

  return `${xmlHeader}
${rssOpen}${channelXml}
${rssClose}`
}

// 블로그 전용 RSS 채널 생성
export function generateBlogRSSChannel(): RSSChannel {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const now = new Date().toISOString()
  const blogItems = generateBlogRSSItems()

  return {
    title: '어서오개 블로그 - 강아지 동반 여행 이야기',
    link: `${baseUrl}/blog`,
    description: '강아지와 함께하는 여행의 즐거운 이야기와 실용적인 팁을 공유합니다.',
    language: 'ko-KR',
    lastBuildDate: now,
    generator: '어서오개 RSS Generator v1.0',
    items: blogItems
  }
}

// 가이드 전용 RSS 채널 생성
export function generateGuideRSSChannel(): RSSChannel {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dogswhere.com'
  const now = new Date().toISOString()
  const guideItems = generateGuideRSSItems()

  return {
    title: '어서오개 가이드 - 강아지 동반 여행 완벽 가이드',
    link: `${baseUrl}/guide`,
    description: '강아지와 함께하는 여행을 위한 실용적이고 상세한 가이드 정보를 제공합니다.',
    language: 'ko-KR',
    lastBuildDate: now,
    generator: '어서오개 RSS Generator v1.0',
    items: guideItems
  }
}
