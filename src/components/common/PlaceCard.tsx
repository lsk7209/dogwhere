import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Phone, Clock } from "lucide-react"

interface PlaceCardProps {
  id: string
  name: string
  address: string
  category: string
  rating: number
  reviewCount: number
  oDogScore: number
  safetyLevel: 'safe' | 'caution' | 'warning'
  features: string[]
  openingHours?: string[]
  phone?: string
  imageUrl?: string
  onClick?: () => void
}

const categoryIcons: Record<string, string> = {
  'dog-cafe': '☕',
  'dog-park': '🌳',
  'dog-hotel': '🏨',
  'restaurant': '🍽️'
}

const categoryNames: Record<string, string> = {
  'dog-cafe': '강아지 카페',
  'dog-park': '강아지 공원',
  'dog-hotel': '강아지 호텔',
  'restaurant': '강아지 식당'
}

const safetyLevels: Record<string, { label: string; className: string }> = {
  safe: { label: '안전', className: 'bg-green-100 text-green-800' },
  caution: { label: '주의', className: 'bg-yellow-100 text-yellow-800' },
  warning: { label: '경고', className: 'bg-red-100 text-red-800' }
}

export function PlaceCard({
  id,
  name,
  address,
  category,
  rating,
  reviewCount,
  oDogScore,
  safetyLevel,
  features,
  openingHours,
  phone,
  imageUrl,
  onClick
}: PlaceCardProps) {
  const categoryIcon = categoryIcons[category] || '📍'
  const categoryName = categoryNames[category] || category
  const safety = safetyLevels[safetyLevel]

  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{categoryIcon}</span>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{name}</h3>
              <p className="text-sm text-gray-600">{categoryName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={safety.className}>
              {safety.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              O-Dog {oDogScore}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* 이미지 영역 */}
        <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-500 text-sm">이미지 영역</span>
          )}
        </div>

        {/* 주소 */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{address}</p>
        </div>

        {/* 평점 */}
        <div className="flex items-center space-x-2 mb-3">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-sm text-gray-500">({reviewCount}개 리뷰)</span>
        </div>

        {/* 특징 태그 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
          {features.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{features.length - 3}
            </Badge>
          )}
        </div>

        {/* 추가 정보 */}
        <div className="space-y-1 text-xs text-gray-500">
          {phone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </div>
          )}
          {openingHours && openingHours.length > 0 && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{openingHours[0]}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" onClick={onClick}>
          자세히 보기
        </Button>
      </CardFooter>
    </Card>
  )
}
