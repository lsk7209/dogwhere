import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AdSlotProps {
  id: string
  width?: 'full' | 'half' | 'third' | 'quarter'
  height?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  placeholder?: string
}

export function AdSlot({ 
  id, 
  width = 'full', 
  height = 'md',
  className,
  placeholder = '광고 영역'
}: AdSlotProps) {
  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    third: 'w-1/3',
    quarter: 'w-1/4'
  }

  const heightClasses = {
    sm: 'h-16',
    md: 'h-32',
    lg: 'h-48',
    xl: 'h-64'
  }

  return (
    <Card className={cn('bg-gray-100 border-dashed', className)}>
      <CardContent className={cn(
        'flex items-center justify-center p-6',
        widthClasses[width],
        heightClasses[height]
      )}>
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-2">
            {placeholder}
          </div>
          <div className="text-gray-400 text-xs">
            고정 높이: {heightClasses[height]}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MapClusterProps {
  places: Array<{
    id: string
    name: string
    lat: number
    lng: number
    category: string
  }>
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
}

export function MapCluster({ 
  places, 
  center, 
  zoom = 13,
  className 
}: MapClusterProps) {
  // 실제 구현에서는 Google Maps, Naver Maps, Kakao Maps 등을 사용
  // 여기서는 플레이스홀더로 구현
  
  return (
    <div className={cn('bg-gray-200 rounded-lg relative', className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">🗺️</div>
          <div className="text-gray-500 text-sm mb-1">지도 영역</div>
          <div className="text-gray-400 text-xs">
            {places.length}개 장소 표시
          </div>
          {center && (
            <div className="text-gray-400 text-xs mt-1">
              중심: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>
      
      {/* 지도 마커 시뮬레이션 */}
      <div className="absolute top-4 left-4">
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {places.length}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4">
        <div className="bg-white shadow-md rounded-lg p-2">
          <div className="text-xs text-gray-600">
            줌: {zoom}
          </div>
        </div>
      </div>
    </div>
  )
}

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
  }>
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('mb-6', className)}>
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-400 mx-2">/</span>}
            {item.href ? (
              <a 
                href={item.href} 
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
