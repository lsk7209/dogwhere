/**
 * 유틸리티 관련 타입 정의
 */

export interface WalkingCourse {
  name: string
  address: string
  distance: number
  features: string[]
  mapLink: string
}

export interface Veterinary {
  name: string
  address: string
  phone: string
  distance: number
  emergency: boolean
}

export interface Accommodation {
  name: string
  address: string
  price: number
  petFriendly: boolean
  features: string[]
  distance: number
  mapLink: string
}

export interface HealthRecord {
  id: string
  date: string
  category: string
  value: string | number
  notes?: string
}

export interface TravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  petName: string
  accommodation?: Accommodation
  notes?: string
}

