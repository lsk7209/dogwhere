/**
 * 환경변수 검증 및 타입 안전성 보장
 * 
 * zod를 사용하여 환경변수를 검증하고 타입 안전하게 사용할 수 있도록 합니다.
 * 필수 환경변수가 없으면 애플리케이션이 시작되지 않습니다.
 */

import { z } from 'zod'

// 환경변수 스키마 정의
const envSchema = z.object({
  // 필수 환경변수
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // 관리자 인증 (필수)
  ADMIN_USERNAME: z.string().min(1, 'ADMIN_USERNAME은 필수입니다'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD는 최소 8자 이상이어야 합니다'),
  
  // JWT 시크릿 (필수)
  JWT_SECRET: z.string().min(32, 'JWT_SECRET은 최소 32자 이상이어야 합니다'),
  
  // API 키 (선택)
  GOOGLE_PLACES_KEY: z.string().optional(),
  KAKAO_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  
  // 내부 토큰 (선택)
  INTERNAL_TOKEN: z.string().optional(),
  
  // 클라우드플레어 설정 (선택)
  CF_KV_NAMESPACE: z.string().optional(),
  CF_D1_BINDING: z.string().optional(),
  CF_R2_BUCKET: z.string().optional(),
  
  // 공개 URL (선택)
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // 슬랙 웹훅 (선택)
  SLACK_WEBHOOK_URL: z.string().url().optional(),
})

// 환경변수 검증 및 파싱
function getEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter(e => e.code === 'too_small' || e.code === 'invalid_type')
        .map(e => `${e.path.join('.')}: ${e.message}`)
      
      // 빌드 시에는 환경변수가 없어도 빌드가 진행되도록 기본값 사용
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        console.warn('⚠️ 환경변수 검증 실패 (빌드 중):', missingVars.join(', '))
        console.warn('⚠️ 기본값을 사용합니다. 프로덕션 배포 시 환경변수를 설정하세요.')
        
        // 기본값으로 fallback
        return envSchema.parse({
          ...process.env,
          ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
          ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'changeme12345678',
          JWT_SECRET: process.env.JWT_SECRET || 'changeme123456789012345678901234567890',
        })
      }
      
      throw new Error(
        `환경변수 검증 실패:\n${missingVars.join('\n')}\n\n` +
        `필수 환경변수를 확인하세요: .env.local 또는 Cloudflare Pages 환경변수 설정`
      )
    }
    throw error
  }
}

// 검증된 환경변수 내보내기
export const env = getEnv()

// 타입 안전성을 위한 타입 내보내기
export type Env = z.infer<typeof envSchema>

