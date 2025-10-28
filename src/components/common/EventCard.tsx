import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Ticket, Clock } from "lucide-react"

interface EventCardProps {
  id: string
  title: string
  startDate: string
  endDate: string
  venue: string
  address: string
  ticketInfo: string
  petAllowed: boolean
  highlight?: string
  imageUrl?: string
  onClick?: () => void
}

export function EventCard({
  id,
  title,
  startDate,
  endDate,
  venue,
  address,
  ticketInfo,
  petAllowed,
  highlight,
  imageUrl,
  onClick
}: EventCardProps) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const isMultiDay = start.toDateString() !== end.toDateString()
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-2">{title}</h3>
            {highlight && (
              <p className="text-sm text-gray-600 line-clamp-2">{highlight}</p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1 ml-2">
            {petAllowed && (
              <Badge className="bg-green-100 text-green-800">
                반려견 가능
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {ticketInfo}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* 이미지 영역 */}
        <div className="h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-500 text-sm">행사 이미지</span>
          )}
        </div>

        {/* 일정 */}
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {isMultiDay 
              ? `${formatDate(start)} - ${formatDate(end)}`
              : formatDate(start)
            }
          </span>
        </div>

        {/* 장소 */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{venue}</p>
            <p className="text-xs text-gray-600 line-clamp-1">{address}</p>
          </div>
        </div>

        {/* 티켓 정보 */}
        <div className="flex items-center space-x-2">
          <Ticket className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{ticketInfo}</span>
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
