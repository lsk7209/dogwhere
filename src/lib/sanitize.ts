/**
 * HTML 콘텐츠 정리 유틸리티
 * XSS 공격 방지를 위한 기본적인 정리 기능
 * 프로덕션에서는 DOMPurify 같은 라이브러리 사용 권장
 */

/**
 * 기본 HTML 태그만 허용하는 화이트리스트
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre',
  'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
]

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  table: ['class'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan']
}

/**
 * 간단한 HTML 정리 함수
 * 주의: 완전한 XSS 방지는 아니며, 기본적인 정리만 수행합니다.
 * 프로덕션에서는 DOMPurify 같은 전문 라이브러리 사용을 권장합니다.
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본 정리만 수행
    // 실제로는 DOMPurify 같은 라이브러리 사용 권장
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
  }

  // 클라이언트 사이드에서는 DOMPurify 사용 권장
  // 현재는 기본 정리만 수행
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

/**
 * 안전한 HTML 렌더링을 위한 컴포넌트 props 생성
 */
export function createSafeHTMLProps(html: string) {
  return {
    dangerouslySetInnerHTML: {
      __html: sanitizeHTML(html)
    }
  }
}

