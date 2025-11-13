/**
 * Cloudflare Pages/Workers 타입 정의
 */

// D1 Database 타입
interface D1Database {
  prepare(query: string): D1PreparedStatement
  exec(query: string): Promise<D1ExecResult>
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run<T = unknown>(): Promise<D1Result<T>>
  all<T = unknown>(): Promise<D1Result<T>>
}

interface D1Result<T = unknown> {
  results: T[]
  success: boolean
  meta: {
    duration: number
    rows_read: number
    rows_written: number
    last_row_id: number
    changed_db: boolean
    changes: number
  }
}

interface D1ExecResult {
  count: number
  duration: number
}

// KV Namespace 타입
interface KVNamespace {
  get(key: string, options?: { type?: 'text' }): Promise<string | null>
  get(key: string, options: { type: 'json' }): Promise<any>
  get(key: string, options: { type: 'arrayBuffer' }): Promise<ArrayBuffer | null>
  get(key: string, options: { type: 'stream' }): Promise<ReadableStream | null>
  get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream'; cacheTtl?: number }): Promise<string | any | ArrayBuffer | ReadableStream | null>
  put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: { expirationTtl?: number; expiration?: number }): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{ keys: Array<{ name: string; expiration?: number; metadata?: unknown }>; list_complete: boolean; cursor?: string }>
}

// R2 Bucket 타입
interface R2Bucket {
  head(key: string): Promise<R2Object | null>
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions): Promise<R2Object>
  delete(keys: string | string[]): Promise<void>
  list(options?: R2ListOptions): Promise<R2Objects>
}

interface R2Object {
  key: string
  version: string
  size: number
  etag: string
  httpEtag: string
  checksums: R2Checksums
  uploaded: Date
  httpMetadata?: R2HTTPMetadata
  customMetadata?: Record<string, string>
}

interface R2ObjectBody extends R2Object {
  body: ReadableStream
  bodyUsed: boolean
  arrayBuffer(): Promise<ArrayBuffer>
  text(): Promise<string>
  json<T = unknown>(): Promise<T>
  blob(): Promise<Blob>
}

interface R2GetOptions {
  onlyIf?: R2Conditional
  range?: R2Range
}

interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata
  customMetadata?: Record<string, string>
  onlyIf?: R2Conditional
}

interface R2ListOptions {
  limit?: number
  prefix?: string
  cursor?: string
  delimiter?: string
  include?: ('httpMetadata' | 'customMetadata')[]
}

interface R2Objects {
  objects: R2Object[]
  truncated: boolean
  cursor?: string
  delimitedPrefixes: string[]
}

interface R2Conditional {
  etagMatches?: string
  etagDoesNotMatch?: string
  uploadedBefore?: Date
  uploadedAfter?: Date
}

interface R2Range {
  offset?: number
  length?: number
  suffix?: number
}

interface R2Checksums {
  md5?: ArrayBuffer
  sha1?: ArrayBuffer
  sha256?: ArrayBuffer
  sha384?: ArrayBuffer
  sha512?: ArrayBuffer
}

interface R2HTTPMetadata {
  contentType?: string
  contentLanguage?: string
  contentDisposition?: string
  contentEncoding?: string
  cacheControl?: string
  cacheExpiry?: Date
}

// Cloudflare Pages Functions 타입
interface Env {
  DB: D1Database
  KV?: KVNamespace
  R2?: R2Bucket
  [key: string]: unknown
}

interface EventContext<Params = unknown> {
  request: Request
  env: Env
  params: Params
  waitUntil: (promise: Promise<any>) => void
  passThroughOnException: () => void
  next: () => Promise<Response>
  data: Record<string, any>
}

interface ScheduledEvent {
  scheduledTime: number
  cron: string
  noRetry: () => void
}

// Pages Functions 핸들러 타입
type PagesFunction<Params = unknown> = (context: EventContext<Params>) => Response | Promise<Response>
type PagesScheduledFunction = (event: ScheduledEvent, env: Env) => void | Promise<void>

// 전역 타입 확장
declare global {
  interface D1Database {}
  interface KVNamespace {}
  interface R2Bucket {}
}

export {}

