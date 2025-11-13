# 유틸리티 및 블로그 템플릿 가이드

이 문서는 dogwhere 프로젝트에서 사용되는 유틸리티 페이지와 블로그 포스트의 구조, 패턴, 템플릿을 상세히 설명합니다.

---

## 📋 목차

1. [유틸리티 페이지 템플릿](#유틸리티-페이지-템플릿)
2. [블로그 포스트 템플릿](#블로그-포스트-템플릿)
3. [공통 컴포넌트 및 패턴](#공통-컴포넌트-및-패턴)
4. [스타일링 가이드](#스타일링-가이드)
5. [데이터 관리](#데이터-관리)

---

## 🛠️ 유틸리티 페이지 템플릿

### 기본 구조

모든 유틸리티 페이지는 다음 구조를 따릅니다:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconName } from 'lucide-react'

export default function UtilityPageName() {
  // 상태 관리
  const [state, setState] = useState(initialValue)

  // 계산/처리 함수
  const handleCalculate = () => {
    // 로직 구현
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <Link 
            href="/utilities"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <IconName className="w-10 h-10 text-[color]-600 mr-3" />
            유틸리티 제목
          </h1>
          <p className="text-xl text-gray-600">
            유틸리티 설명
          </p>
        </div>

        {/* 메인 컨텐츠 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* 입력 폼 및 결과 영역 */}
        </div>

        {/* 안내 정보 */}
        <div className="bg-[color]-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 안내사항</h2>
          {/* 안내 내용 */}
        </div>
      </div>
    </div>
  )
}
```

### 주요 섹션 설명

#### 1. 헤더 섹션

```tsx
<div className="mb-8">
  {/* 뒤로가기 링크 */}
  <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
    ← 유틸리티 목록으로
  </Link>
  
  {/* 제목 (아이콘 + 텍스트) */}
  <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
    <IconName className="w-10 h-10 text-[color]-600 mr-3" />
    유틸리티 제목
  </h1>
  
  {/* 설명 */}
  <p className="text-xl text-gray-600">
    유틸리티 설명
  </p>
</div>
```

**아이콘 색상 가이드:**
- 계산기: `text-blue-600` 또는 `text-orange-600`
- 찾기: `text-green-600` 또는 `text-indigo-600`
- 가이드: `text-purple-600` 또는 `text-pink-600`
- 플래너: `text-indigo-600` 또는 `text-teal-600`

#### 2. 메인 컨텐츠 카드

```tsx
<div className="bg-white rounded-lg shadow-md p-8 mb-8">
  {/* 입력 폼 */}
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        입력 필드명
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color]-500 focus:border-transparent"
        placeholder="예: 입력 예시"
      />
    </div>

    {/* 계산 버튼 */}
    <button
      onClick={handleCalculate}
      className="w-full bg-[color]-600 text-white py-3 px-6 rounded-lg hover:bg-[color]-700 transition-colors font-medium"
    >
      계산하기
    </button>

    {/* 결과 표시 */}
    {result && (
      <div className="bg-[color]-50 border-2 border-[color]-200 rounded-lg p-6">
        {/* 결과 내용 */}
      </div>
    )}
  </div>
</div>
```

#### 3. 안내 정보 섹션

```tsx
<div className="bg-[color]-50 rounded-lg p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">📌 안내사항</h2>
  <ul className="space-y-2 text-gray-700">
    <li className="flex items-start">
      <span className="mr-2">•</span>
      <span>안내 내용 1</span>
    </li>
    <li className="flex items-start">
      <span className="mr-2">•</span>
      <span>안내 내용 2</span>
    </li>
  </ul>
  <p className="mt-4 text-sm text-gray-600">
    * 추가 참고사항
  </p>
</div>
```

### 유틸리티 타입별 템플릿

#### 계산기 (Calculator)

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator } from 'lucide-react'

export default function CalculatorPage() {
  const [input1, setInput1] = useState<number>(0)
  const [input2, setInput2] = useState<number>(0)
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    // 계산 로직
    const calculated = input1 * input2
    setResult(calculated)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-10 h-10 text-blue-600 mr-3" />
            계산기 제목
          </h1>
          <p className="text-xl text-gray-600">
            계산기 설명
          </p>
        </div>

        {/* 계산기 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 입력 영역 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입력 1
                </label>
                <input
                  type="number"
                  value={input1 || ''}
                  onChange={(e) => setInput1(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* 추가 입력 필드 */}
            </div>

            {/* 결과 영역 */}
            <div className="flex flex-col justify-center">
              {result !== null ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">결과</p>
                    <p className="text-5xl font-bold text-blue-700">{result}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">값을 입력해주세요</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            계산하기
          </button>
        </div>

        {/* 안내 정보 */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 계산 방법</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>계산 방법 설명</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
```

#### 플래너 (Planner)

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function PlannerPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [newPlan, setNewPlan] = useState({
    name: '',
    date: '',
    // 기타 필드
  })

  // localStorage 저장/로드
  useEffect(() => {
    const saved = localStorage.getItem('plans')
    if (saved) {
      try {
        setPlans(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('plans', JSON.stringify(plans))
    }
  }, [plans])

  const createPlan = () => {
    const plan: Plan = {
      id: Date.now().toString(),
      ...newPlan,
      createdAt: new Date().toISOString()
    }
    setPlans([plan, ...plans])
    setNewPlan({ name: '', date: '', /* 초기화 */ })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-10 h-10 text-indigo-600 mr-3" />
            플래너 제목
          </h1>
          <p className="text-xl text-gray-600">
            플래너 설명
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 생성 폼 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">새 계획 만들기</h2>
            {/* 입력 폼 */}
            <button
              onClick={createPlan}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              계획 생성
            </button>
          </div>

          {/* 계획 목록 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">계획 목록</h2>
            {plans.length === 0 ? (
              <p className="text-gray-500 text-center py-8">등록된 계획이 없습니다</p>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-lg p-4">
                    {/* 계획 내용 */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 체크리스트/트래커 (Tracker)

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckSquare, Save } from 'lucide-react'

export default function TrackerPage() {
  const [checklist, setChecklist] = useState<CheckItem[]>([])
  const [savedRecords, setSavedRecords] = useState<Record[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('records')
    if (saved) {
      try {
        setSavedRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const saveRecord = () => {
    const record = {
      date: new Date().toISOString().split('T')[0],
      checklist: checklist,
      score: calculateScore()
    }
    const updated = [...savedRecords, record]
    setSavedRecords(updated)
    localStorage.setItem('records', JSON.stringify(updated))
    alert('기록이 저장되었습니다!')
  }

  const calculateScore = () => {
    const total = checklist.length
    const checked = checklist.filter(item => item.checked).length
    return Math.round((checked / total) * 100)
  }

  const totalItems = checklist.length
  const checkedItems = checklist.filter(item => item.checked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="w-10 h-10 text-pink-600 mr-3" />
            트래커 제목
          </h1>
          <p className="text-xl text-gray-600">
            트래커 설명
          </p>
        </div>

        {/* 체크리스트 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* 진행률 표시 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                체크 날짜
              </label>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">진행률</p>
              <p className="text-2xl font-bold text-pink-600">
                {checkedItems} / {totalItems}
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${(checkedItems / totalItems) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 체크리스트 항목 */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 text-pink-600 rounded"
                />
                <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-900'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={saveRecord}
            className="w-full mt-6 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>기록 저장하기</span>
          </button>
        </div>

        {/* 저장된 기록 */}
        {savedRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">과거 기록</h2>
            <div className="space-y-3">
              {savedRecords.slice().reverse().slice(0, 10).map((record, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                  {/* 기록 내용 */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 유틸리티 등록 방법

새로운 유틸리티를 추가할 때는 `src/lib/utilities/utilities-data.ts`에 등록해야 합니다:

```typescript
{
  id: 'utility-id',
  title: '유틸리티 제목',
  description: '유틸리티 설명',
  icon: 'IconName', // Lucide icon name
  slug: 'utility-slug',
  category: 'calculator' | 'finder' | 'guide' | 'planner',
  status: 'completed' | 'coming-soon'
}
```

그리고 `src/app/utilities/[slug]/page.tsx` 파일을 생성합니다.

---

## 📝 블로그 포스트 템플릿

### 기본 구조

블로그 포스트는 마크다운 기반으로 작성되며, 다음과 같은 구조를 가집니다:

```tsx
import { Metadata } from 'next'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TableOfContents from '@/components/blog/TableOfContents'
import AdsenseSlot from '@/components/ads/AdsenseSlot'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// 블로그 포스트 데이터
const blogPosts: Record<string, BlogPost> = {
  'post-slug': {
    title: '포스트 제목',
    excerpt: '포스트 요약',
    content: `# 포스트 제목

마크다운 콘텐츠...

## 섹션 1

내용...

## 섹션 2

내용...
`,
    author: '작성자명',
    date: '2024.10.28',
    category: '카테고리',
    readTime: '8분',
    image: 'https://images.unsplash.com/...',
    tags: ['태그1', '태그2'],
    location: '위치',
    lastModified: '2024.10.28',
    seoKeywords: ['키워드1', '키워드2'],
    geoLocation: {
      latitude: 37.5665,
      longitude: 126.9780,
      address: '서울특별시'
    }
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  
  if (!post) {
    return { title: '포스트를 찾을 수 없습니다' }
  }

  return {
    title: `${post.title} | 어서오개`,
    description: post.excerpt,
    keywords: post.seoKeywords?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastModified,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts[slug]

  if (!post) {
    return <div>포스트를 찾을 수 없습니다</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 뒤로가기 */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          블로그 목록으로
        </Link>

        {/* 헤더 */}
        <article>
          <header className="mb-8">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </div>
              {post.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {post.location}
                </div>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center">
                    <Tag className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 썸네일 이미지 */}
          {post.image && (
            <div className="mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* 목차 */}
          <TableOfContents content={post.content} />

          {/* 광고 */}
          <AdsenseSlot slotId="blog-content-top" />

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 광고 */}
          <AdsenseSlot slotId="blog-content-bottom" />
        </article>

        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: post.image,
              datePublished: post.date,
              dateModified: post.lastModified || post.date,
              author: {
                '@type': 'Person',
                name: post.author
              },
              publisher: {
                '@type': 'Organization',
                name: '어서오개'
              },
              ...(post.geoLocation && {
                contentLocation: {
                  '@type': 'Place',
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: post.geoLocation.latitude,
                    longitude: post.geoLocation.longitude
                  },
                  address: post.geoLocation.address
                }
              })
            })
          }}
        />
      </div>
    </div>
  )
}
```

### 마크다운 작성 가이드

블로그 포스트는 마크다운 형식으로 작성하며, 다음 구조를 권장합니다:

```markdown
# 포스트 제목

간단한 소개 문단...

## 🏖️ 섹션 제목 (이모지 사용 권장)

### 하위 섹션

내용...

#### 더 작은 하위 섹션

- 리스트 항목 1
- 리스트 항목 2
- 리스트 항목 3

**강조 텍스트**와 *기울임 텍스트*를 사용할 수 있습니다.

### 코드 블록

\`\`\`typescript
const example = '코드 예시'
\`\`\`

### 이미지

![이미지 설명](이미지 URL)

### 링크

[링크 텍스트](URL)

### 표

| 열1 | 열2 | 열3 |
|-----|-----|-----|
| 데이터1 | 데이터2 | 데이터3 |

### 인용구

> 인용할 내용
```

**마크다운 작성 팁:**
- `##` (h2) 제목만 목차에 표시됩니다
- 이모지를 사용하여 섹션을 구분하면 가독성이 좋아집니다
- 코드 블록에는 언어를 지정하세요
- 이미지는 Unsplash나 다른 CDN을 사용하세요

### 블로그 포스트 메타데이터

각 블로그 포스트는 다음 메타데이터를 포함해야 합니다:

```typescript
interface BlogPost {
  title: string              // 포스트 제목
  excerpt: string            // 요약 (SEO용)
  content: string            // 마크다운 콘텐츠
  author: string             // 작성자명
  date: string               // 발행일 (YYYY.MM.DD)
  category: string           // 카테고리
  readTime: string           // 예상 읽기 시간 (예: "8분")
  image: string              // 썸네일 이미지 URL
  tags: string[]             // 태그 배열
  location?: string          // 위치 (선택)
  lastModified?: string      // 수정일 (선택)
  seoKeywords?: string[]     // SEO 키워드 (선택)
  geoLocation?: {            // 지리적 위치 (선택)
    latitude: number
    longitude: number
    address: string
  }
}
```

---

## 🧩 공통 컴포넌트 및 패턴

### 레이아웃 컴포넌트

#### 유틸리티 레이아웃 (`src/app/utilities/layout.tsx`)

모든 유틸리티 페이지 하단에 자동으로 표시됩니다:
- 공유/제보 버튼
- 관련 유틸리티 추천

#### 블로그 레이아웃 (`src/app/blog/layout.tsx`)

모든 블로그 페이지 하단에 자동으로 표시됩니다:
- 공유/제보 버튼

### TableOfContents 컴포넌트

블로그 포스트에서 자동으로 목차를 생성합니다:

```tsx
import TableOfContents from '@/components/blog/TableOfContents'

<TableOfContents content={post.content} />
```

**동작 방식:**
- 마크다운에서 `##` (h2) 제목만 추출
- 스크롤 시 현재 섹션 하이라이트
- 클릭 시 해당 섹션으로 스크롤

### AdsenseSlot 컴포넌트

광고 슬롯을 삽입합니다:

```tsx
import AdsenseSlot from '@/components/ads/AdsenseSlot'

<AdsenseSlot slotId="blog-content-top" />
```

---

## 🎨 스타일링 가이드

### 색상 시스템

#### 유틸리티 카테고리별 색상

- **계산기 (Calculator)**: `blue-600`, `orange-600`
- **찾기 (Finder)**: `green-600`, `indigo-600`
- **가이드 (Guide)**: `purple-600`, `pink-600`
- **플래너 (Planner)**: `indigo-600`, `teal-600`

#### 공통 색상

- 배경: `bg-gray-50` (페이지), `bg-white` (카드)
- 텍스트: `text-gray-900` (제목), `text-gray-600` (본문)
- 링크: `text-blue-600 hover:text-blue-800`
- 버튼: `bg-[color]-600 hover:bg-[color]-700`

### 레이아웃 패턴

#### 컨테이너

```tsx
<div className="container mx-auto px-4 py-12 max-w-4xl">
  {/* 콘텐츠 */}
</div>
```

- `max-w-4xl`: 일반 유틸리티
- `max-w-6xl`: 플래너/복잡한 레이아웃
- `max-w-4xl`: 블로그 포스트

#### 카드

```tsx
<div className="bg-white rounded-lg shadow-md p-8">
  {/* 콘텐츠 */}
</div>
```

#### 그리드 레이아웃

```tsx
<div className="grid md:grid-cols-2 gap-6">
  {/* 2열 그리드 (모바일에서는 1열) */}
</div>

<div className="grid md:grid-cols-3 gap-4">
  {/* 3열 그리드 */}
</div>
```

### 반응형 디자인

- 모바일 우선 접근 방식 사용
- `md:` 브레이크포인트로 태블릿/데스크톱 스타일 적용
- 터치 친화적인 버튼 크기 (`py-3 px-6`)

---

## 💾 데이터 관리

### 유틸리티 데이터

유틸리티 목록은 `src/lib/utilities/utilities-data.ts`에서 중앙 관리됩니다:

```typescript
export const utilitiesData: UtilityItem[] = [
  {
    id: 'utility-id',
    title: '제목',
    description: '설명',
    icon: 'IconName',
    slug: 'slug',
    category: 'calculator',
    status: 'completed'
  }
]
```

**헬퍼 함수:**
- `getCompletedUtilities()`: 완료된 유틸리티만 반환
- `getUtilitiesByCategory(category)`: 카테고리별 필터링
- `getUtilityBySlug(slug)`: 슬러그로 검색

### 로컬 스토리지 사용

플래너/트래커 유틸리티는 `localStorage`를 사용하여 데이터를 저장합니다:

```typescript
// 저장
useEffect(() => {
  if (data.length > 0) {
    localStorage.setItem('key', JSON.stringify(data))
  }
}, [data])

// 로드
useEffect(() => {
  const saved = localStorage.getItem('key')
  if (saved) {
    try {
      setData(JSON.parse(saved))
    } catch (e) {
      console.error('Failed to load data:', e)
    }
  }
}, [])
```

**주의사항:**
- `localStorage`는 브라우저별로 독립적입니다
- 용량 제한이 있습니다 (약 5-10MB)
- 민감한 정보는 저장하지 마세요

### 블로그 포스트 데이터

현재는 하드코딩된 객체로 관리되지만, 향후 CMS나 데이터베이스로 마이그레이션할 수 있습니다.

---

## ✅ 체크리스트

### 새 유틸리티 추가 시

- [ ] `utilities-data.ts`에 등록
- [ ] `src/app/utilities/[slug]/page.tsx` 파일 생성
- [ ] 기본 구조 (헤더, 메인 카드, 안내) 구현
- [ ] 반응형 디자인 확인
- [ ] 로컬 스토리지 사용 시 에러 처리 추가
- [ ] 접근성 확인 (키보드 네비게이션, 스크린 리더)

### 새 블로그 포스트 작성 시

- [ ] 마크다운 콘텐츠 작성
- [ ] 메타데이터 (제목, 요약, 태그 등) 작성
- [ ] 썸네일 이미지 준비
- [ ] 목차 생성 확인 (h2 제목 사용)
- [ ] SEO 메타데이터 확인
- [ ] JSON-LD 구조화된 데이터 확인

---

## 📚 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)
- [React Markdown](https://remarkjs.github.io/react-markdown/)
- [마크다운 가이드](https://www.markdownguide.org/)

---

**마지막 업데이트**: 2024.10.28

