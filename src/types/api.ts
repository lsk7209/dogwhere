/**
 * Standard API Response Interfaces
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  message?: string
}

export interface ApiErrorResponse {
  success: false,
  error: {
    message: string,
    code: string,
    details?: unknown
  }
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}> { }

export interface SimplePlacesResponse extends ApiResponse<{
  places: any[]
  total: number
  filters: {
    sido?: string
    sigungu?: string
    category?: string
    slug?: string
  }
}> {
  meta?: {
    timestamp: string
    version: string
  }
}

export interface AuthResponse extends ApiResponse<{
  authenticated: boolean
  token?: string
  user?: {
    username: string
    role: string
  }
  username?: string
  message?: string
}> { }

export interface PublicDataPlace {
  id: string
  name: string
  slug: string
  category?: string
  address?: string
  sido?: string
  sigungu?: string
  latitude?: number
  longitude?: number
  phone?: string
  website?: string
  sitemap_excluded: boolean
  noindex: boolean
  regeneration_status: string
  created_at: string
  updated_at: string
}

export interface PublicDataSearchResponse extends ApiResponse<{
  results: PublicDataPlace[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  meta?: {
    timestamp: string
  }
}
