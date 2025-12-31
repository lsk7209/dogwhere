/**
 * 한국관광공사 반려동물 동반여행 서비스 API 클라이언트
 * 
 * Base URL: apis.data.go.kr/B551011/KorPetTourService
 * 
 * 주요 엔드포인트:
 * - /areaBasedList: 지역기반 관광정보조회
 * - /detailCommon: 공통정보조회
 * - /detailPetTour: 반려동물 동반여행 조회
 * - /petTourSyncList: 동기화 목록 조회 (증분 수집용)
 */

export interface KorPetTourConfig {
  serviceKey: string
  mobileOS?: string // IOS, AND, WIN, ETC
  mobileApp?: string // 서비스명
}

export interface KorPetTourAreaBasedParams {
  contentTypeId?: string // 12:관광지, 32:숙박, 39:음식점 등
  areaCode?: string // 지역코드
  sigunguCode?: string // 시군구코드
  arrange?: string // A=제목순, C=수정일순, D=생성일순
  listYN?: string // Y=목록, N=개수
  modifiedtime?: string // 수정일(YYYYMMDD) - 증분 수집용
}

export interface KorPetTourDetailParams {
  contentId: string
  contentTypeId?: string
}

/**
 * 지역기반 관광정보 조회
 */
export async function fetchAreaBasedList(
  config: KorPetTourConfig,
  params: KorPetTourAreaBasedParams,
  page: number = 1,
  pageSize: number = 100
): Promise<any> {
  const baseUrl = 'https://apis.data.go.kr/B551011/KorPetTourService'
  const url = new URL(`${baseUrl}/areaBasedList`)
  
  // 필수 파라미터
  url.searchParams.set('serviceKey', config.serviceKey)
  url.searchParams.set('MobileOS', config.mobileOS || 'ETC')
  url.searchParams.set('MobileApp', config.mobileApp || 'dogwhere')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('pageNo', page.toString())
  url.searchParams.set('numOfRows', pageSize.toString())
  
  // 선택 파라미터
  if (params.contentTypeId) {
    url.searchParams.set('contentTypeId', params.contentTypeId)
  }
  if (params.areaCode) {
    url.searchParams.set('areaCode', params.areaCode)
  }
  if (params.sigunguCode) {
    url.searchParams.set('sigunguCode', params.sigunguCode)
  }
  if (params.arrange) {
    url.searchParams.set('arrange', params.arrange)
  }
  if (params.listYN) {
    url.searchParams.set('listYN', params.listYN)
  }
  if (params.modifiedtime) {
    url.searchParams.set('modifiedtime', params.modifiedtime)
  }

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`)
  }

  const data = await response.json()
  
  // 에러 확인
  const header = data?.response?.header
  if (header?.resultCode !== '0000') {
    throw new Error(`API 에러: ${header?.resultMsg || 'Unknown error'}`)
  }

  return data
}

/**
 * 공통정보 조회 (상세 정보)
 */
export async function fetchDetailCommon(
  config: KorPetTourConfig,
  params: KorPetTourDetailParams
): Promise<any> {
  const baseUrl = 'https://apis.data.go.kr/B551011/KorPetTourService'
  const url = new URL(`${baseUrl}/detailCommon`)
  
  url.searchParams.set('serviceKey', config.serviceKey)
  url.searchParams.set('MobileOS', config.mobileOS || 'ETC')
  url.searchParams.set('MobileApp', config.mobileApp || 'dogwhere')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('contentId', params.contentId)
  
  if (params.contentTypeId) {
    url.searchParams.set('contentTypeId', params.contentTypeId)
  }
  
  // 모든 정보 조회
  url.searchParams.set('defaultYN', 'Y')
  url.searchParams.set('firstImageYN', 'Y')
  url.searchParams.set('areacodeYN', 'Y')
  url.searchParams.set('catcodeYN', 'Y')
  url.searchParams.set('addrinfoYN', 'Y')
  url.searchParams.set('mapinfoYN', 'Y')
  url.searchParams.set('overviewYN', 'Y')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`)
  }

  const data = await response.json()
  
  const header = data?.response?.header
  if (header?.resultCode !== '0000') {
    throw new Error(`API 에러: ${header?.resultMsg || 'Unknown error'}`)
  }

  return data
}

/**
 * 반려동물 동반여행 상세 정보 조회
 */
export async function fetchDetailPetTour(
  config: KorPetTourConfig,
  contentId: string
): Promise<any> {
  const baseUrl = 'https://apis.data.go.kr/B551011/KorPetTourService'
  const url = new URL(`${baseUrl}/detailPetTour`)
  
  url.searchParams.set('serviceKey', config.serviceKey)
  url.searchParams.set('MobileOS', config.mobileOS || 'ETC')
  url.searchParams.set('MobileApp', config.mobileApp || 'dogwhere')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('contentId', contentId)

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`)
  }

  const data = await response.json()
  
  const header = data?.response?.header
  if (header?.resultCode !== '0000') {
    throw new Error(`API 에러: ${header?.resultMsg || 'Unknown error'}`)
  }

  return data
}

/**
 * 동기화 목록 조회 (증분 수집용)
 */
export async function fetchPetTourSyncList(
  config: KorPetTourConfig,
  params: KorPetTourAreaBasedParams,
  page: number = 1,
  pageSize: number = 100
): Promise<any> {
  const baseUrl = 'https://apis.data.go.kr/B551011/KorPetTourService'
  const url = new URL(`${baseUrl}/petTourSyncList`)
  
  url.searchParams.set('serviceKey', config.serviceKey)
  url.searchParams.set('MobileOS', config.mobileOS || 'ETC')
  url.searchParams.set('MobileApp', config.mobileApp || 'dogwhere')
  url.searchParams.set('_type', 'json')
  url.searchParams.set('pageNo', page.toString())
  url.searchParams.set('numOfRows', pageSize.toString())
  url.searchParams.set('listYN', 'Y')
  
  if (params.contentTypeId) {
    url.searchParams.set('contentTypeId', params.contentTypeId)
  }
  if (params.areaCode) {
    url.searchParams.set('areaCode', params.areaCode)
  }
  if (params.sigunguCode) {
    url.searchParams.set('sigunguCode', params.sigunguCode)
  }
  if (params.arrange) {
    url.searchParams.set('arrange', params.arrange)
  }
  if (params.modifiedtime) {
    url.searchParams.set('modifiedtime', params.modifiedtime)
  }
  // 표출 여부 (1=표출, 0=비표출)
  url.searchParams.set('showflag', '1')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`)
  }

  const data = await response.json()
  
  const header = data?.response?.header
  if (header?.resultCode !== '0000') {
    throw new Error(`API 에러: ${header?.resultMsg || 'Unknown error'}`)
  }

  return data
}

