/**
 * Cloudflare Pages Functions Middleware
 * 모든 요청에 대한 공통 처리
 */

export async function onRequest(context: { request: Request; next: () => Promise<Response> }): Promise<Response> {
  const { request, next } = context

  // 다음 핸들러 실행
  const response = await next()
  
  // CORS 헤더가 없으면 추가
  if (!response.headers.get('Access-Control-Allow-Origin')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}
