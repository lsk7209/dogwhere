import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  maxScore?: number
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ScoreBadge({ 
  score, 
  maxScore = 100, 
  variant = 'default',
  size = 'md',
  className 
}: ScoreBadgeProps) {
  const percentage = (score / maxScore) * 100
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <Badge 
      variant={variant}
      className={cn(
        'font-medium border',
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
    >
      O-Dog {score}
    </Badge>
  )
}

interface SafetyBadgeProps {
  level: 'safe' | 'caution' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SafetyBadge({ level, size = 'md', className }: SafetyBadgeProps) {
  const levelConfig = {
    safe: {
      label: '안전',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    caution: {
      label: '주의',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    warning: {
      label: '경고',
      className: 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const config = levelConfig[level]

  return (
    <Badge 
      className={cn(
        'font-medium border',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </Badge>
  )
}

interface TagIconsProps {
  features: string[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const featureIcons: Record<string, string> = {
  '대형견가능': '🐕',
  '물그릇': '💧',
  '그늘': '🌳',
  '주차': '🅿️',
  '실내': '🏠',
  '야외': '🌞',
  '놀이터': '🎪',
  '목욕': '🛁',
  '미용': '✂️',
  '훈련': '🎯',
  '간식': '🍖',
  '음료': '🥤',
  '와이파이': '📶',
  '에어컨': '❄️',
  '난방': '🔥'
}

export function TagIcons({ 
  features, 
  maxDisplay = 4, 
  size = 'md',
  className 
}: TagIconsProps) {
  const displayFeatures = features.slice(0, maxDisplay)
  const remainingCount = features.length - maxDisplay

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1'
  }

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayFeatures.map((feature) => (
        <Badge 
          key={feature} 
          variant="secondary" 
          className={cn(sizeClasses[size], 'flex items-center space-x-1')}
        >
          <span>{featureIcons[feature] || '🏷️'}</span>
          <span>{feature}</span>
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className={cn(sizeClasses[size])}>
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}
