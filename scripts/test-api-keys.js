// API 키 테스트 스크립트
// 이 파일을 실행하기 전에 .env.local 파일에 API 키를 설정하세요

import { collectFromGoogle, collectFromKakao } from './src/lib/data-collection/simple-collector'

async function testApiKeys() {
  console.log('🔍 API 키 테스트 시작...\n')

  // Google Places API 테스트
  console.log('1. Google Places API 테스트')
  try {
    const googleResults = await collectFromGoogle('서울 강아지 동반 카페')
    console.log(`✅ Google Places API 성공: ${googleResults.length}개 장소 수집`)
    console.log('샘플 결과:', googleResults[0])
  } catch (error) {
    console.log('❌ Google Places API 실패:', error.message)
  }

  console.log('\n' + '='.repeat(50) + '\n')

  // Kakao Map API 테스트
  console.log('2. Kakao Map API 테스트')
  try {
    const kakaoResults = await collectFromKakao('서울 강아지 동반 카페')
    console.log(`✅ Kakao Map API 성공: ${kakaoResults.length}개 장소 수집`)
    console.log('샘플 결과:', kakaoResults[0])
  } catch (error) {
    console.log('❌ Kakao Map API 실패:', error.message)
  }

  console.log('\n🎉 API 키 테스트 완료!')
}

// 환경변수 확인
function checkEnvironmentVariables() {
  const requiredVars = ['GOOGLE_PLACES_KEY', 'KAKAO_API_KEY']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.log('❌ 다음 환경변수가 설정되지 않았습니다:')
    missing.forEach(varName => console.log(`   - ${varName}`))
    console.log('\n📝 .env.local 파일을 생성하고 API 키를 설정하세요:')
    console.log('GOOGLE_PLACES_KEY=your_google_places_api_key_here')
    console.log('KAKAO_API_KEY=your_kakao_rest_api_key_here')
    return false
  }
  
  return true
}

// 메인 실행
if (require.main === module) {
  if (checkEnvironmentVariables()) {
    testApiKeys().catch(console.error)
  }
}

export { testApiKeys, checkEnvironmentVariables }
