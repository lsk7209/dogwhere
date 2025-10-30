'use client'

import { useEffect, useMemo } from 'react'

type AdsenseSlotProps = {
  slotId?: string
  style?: React.CSSProperties
  className?: string
}

export default function AdsenseSlot({ slotId, style, className }: AdsenseSlotProps) {
  const clientId = useMemo(() => {
    return process.env.NEXT_PUBLIC_ADS_CLIENT || 'ca-pub-3050601904412736'
  }, [])

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // no-op
    }
  }, [slotId])

  if (!clientId || !slotId) return null

  return (
    <ins
      className={`adsbygoogle block ${className || ''}`.trim()}
      style={style || { display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}


