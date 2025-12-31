/**
 * 한국관광공사 API 테스트 스크립트
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const API_KEY = process.env.PUBLIC_DATA_API_KEY

if (!API_KEY) {
  console.error('❌ PUBLIC_DATA_API_KEY가 필요합니다.')
  process.exit(1)
}

async function testAPI() {
  const baseUrl = 'https://apis.data.go.kr/B551011/KorPetTourService'
  const url = new URL(`${baseUrl}/areaBasedList`)
  
  // 필수 파라미터 (serviceKey는 이미 인코딩되어 있으므로 직접 추가)
  const params: string[] = []
  params.push(`serviceKey=${API_KEY}`) // 이미 인코딩된 값
  params.push('MobileOS=ETC')
  params.push('MobileApp=dogwhere')
  params.push('_type=json')
  params.push('pageNo=1')
  params.push('numOfRows=10')
  params.push('listYN=Y')
  params.push('arrange=C')
  
  const fullUrl = `${url.toString()}?${params.join('&')}`
  
  console.log('🔍 API 테스트')
  console.log(`URL: ${API_KEY ? fullUrl.replace(API_KEY, '***') : fullUrl}\n`)
  
  try {
    const response = await fetch(fullUrl)
    const text = await response.text()
    
    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log(`Response (first 500 chars):\n${text.substring(0, 500)}\n`)
    
    if (response.ok) {
      const data = JSON.parse(text)
      const header = data?.response?.header
      
      if (header) {
        console.log(`Result Code: ${header.resultCode}`)
        console.log(`Result Msg: ${header.resultMsg}`)
        
        if (header.resultCode === '0000') {
          const body = data.response.body
          const totalCount = body?.totalCount || 0
          const items = body?.items?.item || []
          
          console.log(`\n✅ 성공!`)
          console.log(`   총 개수: ${totalCount}`)
          console.log(`   현재 페이지 항목 수: ${items.length}`)
          
          if (items.length > 0) {
            console.log(`\n   첫 번째 항목:`)
            console.log(`   - contentid: ${items[0]?.contentid}`)
            console.log(`   - title: ${items[0]?.title}`)
            console.log(`   - addr1: ${items[0]?.addr1}`)
          }
        } else {
          console.log(`\n❌ API 에러: ${header.resultMsg}`)
        }
      }
    } else {
      console.log(`\n❌ HTTP 에러: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ 에러:', error instanceof Error ? error.message : 'Unknown error')
  }
}

testAPI()

