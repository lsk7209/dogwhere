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
  token: string
  user: {
    username: string
    role: string
  }
}> { }
