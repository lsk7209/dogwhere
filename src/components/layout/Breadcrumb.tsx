import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items || items.length === 0) return null

  return (
    <nav 
      aria-label="브레드크럼 내비게이션"
      className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}
    >
      {/* 홈 링크 */}
      <Link 
        href="/"
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
        aria-label="홈으로 이동"
      >
        <Home className="w-4 h-4" />
        <span>홈</span>
      </Link>

      {/* 브레드크럼 아이템들 */}
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === items.length - 1 ? (
            // 마지막 아이템은 링크가 아닌 텍스트
            <span 
              className="text-gray-900 font-medium"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            // 중간 아이템들은 링크
            <Link 
              href={item.url}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

// 브레드크럼 아이템 생성 헬퍼
export function createBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []
  
  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // 세그먼트 이름 변환
    let name = segment
    
    // 특별한 경우들 처리
    switch (segment) {
      case 'blog':
        name = '블로그'
        break
      case 'guide':
        name = '반려가이드'
        break
      case 'events':
        name = '행사'
        break
      case 'seoul':
        name = '서울특별시'
        break
      case 'recommendations':
        name = '추천'
        break
      case 'today':
        name = '오늘의 추천'
        break
      default:
        // 슬러그를 읽기 쉬운 형태로 변환
        name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }
    
    items.push({
      name,
      url: currentPath
    })
  })
  
  return items
}
