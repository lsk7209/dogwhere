/**
 * Cloudflare KV 캐싱 유틸리티
 * 대규모 컨텐츠 조회 성능 최적화
 */

export interface CacheOptions {
  ttl?: number // Time to live in seconds (default: 300 = 5 minutes)
  tags?: string[] // Cache tags for invalidation
}

/**
 * KV 네임스페이스 가져오기
 */
function getKV(): KVNamespace | null {
  if (typeof process !== 'undefined' && process.env) {
    // 개발 환경
    return null
  }
  
  // @ts-expect-error - Cloudflare Workers global binding
  return globalThis.KV || globalThis.env?.KV || null
}

/**
 * 캐시 키 생성
 */
function createCacheKey(prefix: string, key: string, params?: Record<string, any>): string {
  const paramStr = params 
    ? `:${JSON.stringify(params)}` 
    : ''
  return `${prefix}:${key}${paramStr}`
}

/**
 * 캐시에서 데이터 가져오기
 */
export async function getFromCache<T>(
  key: string,
  options?: CacheOptions
): Promise<T | null> {
  const kv = getKV()
  if (!kv) {
    // 개발 환경에서는 캐시 사용 안 함
    return null
  }

  try {
    const cached = await kv.get(key, {
      type: 'json' as const,
      cacheTtl: options?.ttl || 300
    }) as T | null

    return cached
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

/**
 * 캐시에 데이터 저장
 */
export async function setToCache<T>(
  key: string,
  value: T,
  options?: CacheOptions
): Promise<void> {
  const kv = getKV()
  if (!kv) {
    return
  }

  try {
    const ttl = options?.ttl || 300
    await kv.put(key, JSON.stringify(value), {
      expirationTtl: ttl
    })

    // 태그 저장 (선택사항)
    if (options?.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        await kv.put(`tag:${tag}:${key}`, '1', {
          expirationTtl: ttl
        })
      }
    }
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

/**
 * 캐시에서 데이터 삭제
 */
export async function deleteFromCache(key: string): Promise<void> {
  const kv = getKV()
  if (!kv) {
    return
  }

  try {
    await kv.delete(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

/**
 * 태그로 캐시 무효화
 */
export async function invalidateCacheByTag(tag: string): Promise<void> {
  const kv = getKV()
  if (!kv) {
    return
  }

  try {
    // 태그로 시작하는 모든 키 찾기 (KV는 prefix 검색 지원)
    const keys = await kv.list({ prefix: `tag:${tag}:` })
    
    for (const key of keys.keys) {
      // 실제 캐시 키 추출
      const cacheKey = key.name.replace(`tag:${tag}:`, '')
      await deleteFromCache(cacheKey)
      await kv.delete(key.name)
    }
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

/**
 * 캐시 래퍼 함수 (캐시 미스 시 데이터 페처 실행)
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): Promise<T> {
  // 캐시에서 조회 시도
  const cached = await getFromCache<T>(key, options)
  if (cached !== null) {
    return cached
  }

  // 캐시 미스 - 데이터 페치
  const data = await fetcher()

  // 캐시에 저장
  await setToCache(key, data, options)

  return data
}

/**
 * 장소 관련 캐시 키 생성
 */
export const PlaceCacheKeys = {
  list: (filters: Record<string, any>, page: number, limit: number) =>
    createCacheKey('places', 'list', { ...filters, page, limit }),
  
  bySlug: (slug: string) =>
    createCacheKey('places', 'slug', { slug }),
  
  byId: (id: string) =>
    createCacheKey('places', 'id', { id }),
  
  byRegion: (sido: string, sigungu?: string) =>
    createCacheKey('places', 'region', { sido, sigungu }),
  
  search: (query: string, page: number, limit: number) =>
    createCacheKey('places', 'search', { query, page, limit }),
}

/**
 * 포스트 관련 캐시 키 생성
 */
export const PostCacheKeys = {
  list: (filters: Record<string, any>, page: number, limit: number) =>
    createCacheKey('posts', 'list', { ...filters, page, limit }),
  
  bySlug: (slug: string) =>
    createCacheKey('posts', 'slug', { slug }),
  
  byCategory: (category: string, page: number, limit: number) =>
    createCacheKey('posts', 'category', { category, page, limit }),
  
  search: (query: string, page: number, limit: number) =>
    createCacheKey('posts', 'search', { query, page, limit }),
}

/**
 * 이벤트 관련 캐시 키 생성
 */
export const EventCacheKeys = {
  list: (filters: Record<string, any>, page: number, limit: number) =>
    createCacheKey('events', 'list', { ...filters, page, limit }),
  
  bySlug: (slug: string) =>
    createCacheKey('events', 'slug', { slug }),
}

