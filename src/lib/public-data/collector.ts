/**
 * 공공데이터포털 API 데이터 수집기
 * 
 * 지원 API:
 * - data.go.kr (국가공공데이터포털)
 * - openapi.seoul.go.kr (서울시 열린데이터광장)
 * - apis.data.go.kr/B551011/KorPetTourService (한국관광공사 반려동물 동반여행)
 * - 기타 지자체 Open API
 */

export interface PublicDataConfig {
  apiKey: string
  serviceKey?: string
  baseUrl: string
  endpoint: string
  params?: Record<string, string>
  // 한국관광공사 API 전용 파라미터
  mobileOS?: string // IOS, AND, WIN, ETC
  mobileApp?: string // 서비스명(어플명)
  sourceApi?: string // API 소스 식별자 (자동 감지되지만 명시 가능)
}

/**
 * API 응답 타입 정의
 */
interface KorPetTourResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      items: {
        item: Record<string, unknown> | Record<string, unknown>[]
      }
      numOfRows: number
      pageNo: number
      totalCount: number
    }
  }
}

interface DataGoKrResponse {
  [key: string]: {
    [key: string]: Record<string, unknown>[]
  }
}

interface SeoulOpenApiResponse {
  [key: string]: {
    list_total_count: number
    RESULT: {
      CODE: string
      MESSAGE: string
    }
    row: Record<string, unknown>[]
  }
}

export interface PublicDataPlace {
  // 공공데이터 고유 정보
  publicDataId: string
  sourceApi: string
  rawData: Record<string, unknown>
  
  // 변환된 정보
  name: string
  category?: string
  description?: string
  address?: string
  sido?: string
  sigungu?: string
  dong?: string
  latitude?: number
  longitude?: number
  phone?: string
  website?: string
}

/**
 * 공공데이터포털 API 호출
 */
export async function fetchPublicData(
  config: PublicDataConfig,
  page: number = 1,
  pageSize: number = 100
): Promise<PublicDataPlace[]> {
  const apiKey = config.serviceKey || config.apiKey
  
  // serviceKey는 이미 URL 인코딩되어 있을 수 있으므로 직접 URL 문자열 구성
  // URLSearchParams는 자동 인코딩하므로 이미 인코딩된 값은 직접 추가
  const baseUrl = config.baseUrl + config.endpoint
  const params: string[] = []
  
  // serviceKey는 이미 인코딩되어 있으므로 직접 추가 (이중 인코딩 방지)
  params.push(`serviceKey=${apiKey}`)
  params.push(`pageNo=${page}`)
  params.push(`numOfRows=${pageSize}`)
  
  // 한국관광공사 API 전용 파라미터
  if (config.mobileOS) {
    params.push(`MobileOS=${encodeURIComponent(config.mobileOS)}`)
  }
  if (config.mobileApp) {
    params.push(`MobileApp=${encodeURIComponent(config.mobileApp)}`)
  }
  // JSON 응답 형식
  params.push('_type=json')
  
  // 추가 파라미터
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (value && value !== '') {
        params.push(`${key}=${encodeURIComponent(value)}`)
      }
    })
  }
  
  const url = `${baseUrl}?${params.join('&')}`

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API 호출 실패 (${response.status}):`, errorText.substring(0, 200))
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as KorPetTourResponse | DataGoKrResponse | SeoulOpenApiResponse
    
    // 에러 응답 확인 (한국관광공사 API)
    if ('response' in data && data.response?.header?.resultCode && data.response.header.resultCode !== '0000') {
      const errorMsg = data.response.header.resultMsg || 'Unknown error'
      console.error(`API 에러 (${data.response.header.resultCode}):`, errorMsg)
      throw new Error(`API 에러: ${errorMsg}`)
    }
    
    // API 응답 형식에 따라 파싱
    const sourceApi = config.sourceApi || detectSourceApi(config.baseUrl, config.endpoint)
    return parsePublicDataResponse(data, sourceApi)
  } catch (error) {
    console.error('공공데이터 API 호출 실패:', error)
    throw error
  }
}

/**
 * API 소스 자동 감지
 */
function detectSourceApi(baseUrl: string, endpoint: string): string {
  if (baseUrl.includes('B551011/KorPetTourService')) {
    return 'kor-pet-tour'
  }
  if (baseUrl.includes('data.go.kr')) {
    return 'data.go.kr'
  }
  if (baseUrl.includes('openapi.seoul.go.kr')) {
    return 'openapi.seoul.go.kr'
  }
  return 'data.go.kr'
}

/**
 * API 응답 파싱 (API별로 다른 형식 처리)
 */
function parsePublicDataResponse(
  data: KorPetTourResponse | DataGoKrResponse | SeoulOpenApiResponse,
  sourceApi: string
): PublicDataPlace[] {
  // 한국관광공사 반려동물 동반여행 API 형식
  if (sourceApi === 'kor-pet-tour' && 'response' in data) {
    const korData = data as KorPetTourResponse
    // 먼저 에러 응답 확인
    const header = korData.response?.header
    if (header && header.resultCode && header.resultCode !== '0000') {
      console.error('한국관광공사 API 에러:', header.resultMsg || 'Unknown error')
      return []
    }
    
    // 응답 형식: response.body.items.item (단일 객체 또는 배열)
    const body = korData.response?.body
    if (!body || !body.items) {
      return []
    }
    
    const items = body.items
    if (!items.item) {
      return []
    }
    
    // item이 배열인지 단일 객체인지 확인
    const itemArray = Array.isArray(items.item) ? items.item : (items.item ? [items.item] : [])
    return itemArray.map((item: Record<string, unknown>) => parseKorPetTourItem(item))
  }
  
  // 국가공공데이터포털 형식
  if (sourceApi === 'data.go.kr') {
    const dataGoKr = data as DataGoKrResponse
    // data.go.kr 형식은 다양하므로 첫 번째 키의 첫 번째 배열 사용
    const firstKey = Object.keys(dataGoKr)[0]
    const items = firstKey ? (dataGoKr[firstKey]?.[Object.keys(dataGoKr[firstKey] || {})[0]] || []) : []
    const itemArray = Array.isArray(items) ? items : (items ? [items] : [])
    return itemArray.map((item: Record<string, unknown>) => parseDataGoKrItem(item))
  }
  
  // 서울시 열린데이터광장 형식
  if (sourceApi === 'openapi.seoul.go.kr' && 'DATA' in data) {
    const seoulData = data as SeoulOpenApiResponse
    const firstKey = Object.keys(seoulData)[0]
    const items = firstKey ? (seoulData[firstKey]?.row || []) : []
    return items.map((item: Record<string, unknown>) => parseSeoulOpenApiItem(item))
  }
  
  // 기본 형식 (커스텀 파서 필요)
  return []
}

/**
 * 한국관광공사 반려동물 동반여행 API 형식 파싱
 */
function parseKorPetTourItem(item: Record<string, unknown>): PublicDataPlace {
  // contentid가 고유 ID
  const contentId = String(item.contentid || item.contentId || generateId())
  
  // 좌표 변환 (mapx, mapy는 문자열로 제공됨)
  const mapx = item.mapx ? parseFloat(String(item.mapx)) : undefined
  const mapy = item.mapy ? parseFloat(String(item.mapy)) : undefined
  
  // 좌표가 있으면 변환 (한국관광공사는 KATEC 좌표계 사용, WGS84로 변환 필요)
  // 간단한 변환 공식 사용 (정확도는 낮지만 기본 변환)
  let latitude: number | undefined
  let longitude: number | undefined
  
  if (mapx && mapy) {
    // KATEC -> WGS84 변환 (근사치)
    latitude = mapy / 1000000
    longitude = mapx / 1000000
  }
  
  return {
    publicDataId: contentId,
    sourceApi: 'kor-pet-tour',
    rawData: item,
    name: String(item.title || item.place_name || ''),
    category: getCategoryFromContentType(item.contenttypeid ? String(item.contenttypeid) : undefined),
    description: String(item.overview || ''),
    address: String(item.addr1 || ''),
    sido: extractSido(String(item.addr1 || '')),
    sigungu: extractSigungu(String(item.addr1 || '')),
    phone: item.tel ? String(item.tel) : undefined,
    website: item.homepage ? String(item.homepage) : undefined,
    latitude,
    longitude,
  }
}

/**
 * contentTypeId를 카테고리로 변환
 */
function getCategoryFromContentType(contentTypeId?: string): string {
  const typeMap: Record<string, string> = {
    '12': '관광지',
    '14': '문화시설',
    '15': '축제공연행사',
    '25': '여행코스',
    '28': '레포츠',
    '32': '숙박',
    '38': '쇼핑',
    '39': '음식점',
  }
  return typeMap[contentTypeId || ''] || '기타'
}

/**
 * data.go.kr 형식 파싱
 */
function parseDataGoKrItem(item: Record<string, unknown>): PublicDataPlace {
  return {
    publicDataId: item.관리번호 || item.id || generateId(),
    sourceApi: 'data.go.kr',
    rawData: item,
    name: item.시설명 || item.업소명 || item.이름 || '',
    category: item.업종 || item.카테고리 || '기타',
    address: item.소재지 || item.주소 || '',
    sido: extractSido(item.소재지 || item.주소 || ''),
    sigungu: extractSigungu(item.소재지 || item.주소 || ''),
    phone: item.전화번호 || item.연락처 || '',
    website: item.홈페이지 || item.웹사이트 || '',
    latitude: parseFloat(item.위도 || item.latitude || '0'),
    longitude: parseFloat(item.경도 || item.longitude || '0'),
  }
}

/**
 * 서울시 Open API 형식 파싱
 */
function parseSeoulOpenApiItem(item: Record<string, unknown>): PublicDataPlace {
  return {
    publicDataId: item.관리번호 || item.id || generateId(),
    sourceApi: 'openapi.seoul.go.kr',
    rawData: item,
    name: item.시설명 || item.업소명 || '',
    category: item.업종 || '기타',
    address: item.소재지 || '',
    sido: '서울특별시',
    sigungu: extractSigungu(item.소재지 || ''),
    phone: item.전화번호 || '',
    latitude: parseFloat(item.위도 || '0'),
    longitude: parseFloat(item.경도 || '0'),
  }
}

/**
 * 주소에서 시/도 추출
 */
function extractSido(address: string): string {
  if (!address) return ''
  
  const sidoPattern = /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/
  const match = address.match(sidoPattern)
  if (!match) return ''
  
  const sido = match[0]
  const sidoMap: Record<string, string> = {
    '서울': '서울특별시',
    '부산': '부산광역시',
    '대구': '대구광역시',
    '인천': '인천광역시',
    '광주': '광주광역시',
    '대전': '대전광역시',
    '울산': '울산광역시',
    '세종': '세종특별자치시',
    '경기': '경기도',
    '강원': '강원도',
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전라북도',
    '전남': '전라남도',
    '경북': '경상북도',
    '경남': '경상남도',
    '제주': '제주특별자치도',
  }
  
  return sidoMap[sido] || sido
}

/**
 * 주소에서 시/군/구 추출
 */
function extractSigungu(address: string): string {
  const sigunguPattern = /([가-힣]+(?:시|군|구))/
  const match = address.match(sigunguPattern)
  return match ? match[0] : ''
}

/**
 * 고유 ID 생성
 */
function generateId(): string {
  return `pd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 여러 페이지 데이터 수집
 */
export async function collectAllPages(
  config: PublicDataConfig,
  maxPages: number = 10
): Promise<PublicDataPlace[]> {
  const allPlaces: PublicDataPlace[] = []
  let page = 1
  let hasMore = true

  while (hasMore && page <= maxPages) {
    try {
      const places = await fetchPublicData(config, page, 100)
      
      if (places.length === 0) {
        hasMore = false
      } else {
        allPlaces.push(...places)
        page++
        
        // API 제한을 위한 대기
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`페이지 ${page} 수집 실패:`, error)
      hasMore = false
    }
  }

  return allPlaces
}

