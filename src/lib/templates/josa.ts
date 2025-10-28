/**
 * 한국어 조사 함수
 * 단어의 받침 유무에 따라 적절한 조사를 선택합니다.
 */

interface JosaOptions {
  word: string
  josa: string
}

/**
 * 단어의 받침을 확인합니다.
 * @param word 확인할 단어
 * @returns 받침이 있으면 true, 없으면 false
 */
function hasBatchim(word: string): boolean {
  if (!word) return false
  
  const lastChar = word[word.length - 1]
  const lastCharCode = lastChar.charCodeAt(0)
  
  // 한글 유니코드 범위 확인
  if (lastCharCode < 0xAC00 || lastCharCode > 0xD7A3) {
    return false
  }
  
  // 받침이 있는지 확인 (유니코드 계산)
  return (lastCharCode - 0xAC00) % 28 !== 0
}

/**
 * 조사 문자열을 파싱합니다.
 * 예: "은/는" -> { withBatchim: "은", withoutBatchim: "는" }
 * @param josaString 조사 문자열
 * @returns 파싱된 조사 객체
 */
function parseJosa(josaString: string): { withBatchim: string; withoutBatchim: string } {
  const parts = josaString.split('/')
  if (parts.length !== 2) {
    throw new Error(`Invalid josa format: ${josaString}. Expected format: "은/는"`)
  }
  
  return {
    withBatchim: parts[0].trim(),
    withoutBatchim: parts[1].trim()
  }
}

/**
 * 단어에 적절한 조사를 붙입니다.
 * @param word 조사를 붙일 단어
 * @param josaString 조사 문자열 (예: "은/는", "을/를", "이/가")
 * @returns 조사가 붙은 문자열
 */
export function josa(word: string, josaString: string): string {
  if (!word || !josaString) return word
  
  try {
    const { withBatchim, withoutBatchim } = parseJosa(josaString)
    const hasBatchimResult = hasBatchim(word)
    
    return word + (hasBatchimResult ? withBatchim : withoutBatchim)
  } catch (error) {
    console.error('Josa error:', error)
    return word
  }
}

/**
 * Handlebars 헬퍼로 사용할 수 있는 조사 함수
 */
export function josaHelper(word: string, josaString: string): string {
  return josa(word, josaString)
}

/**
 * 자주 사용되는 조사들
 */
export const COMMON_JOSA = {
  SUBJECT: '이/가',      // 주격 조사
  OBJECT: '을/를',       // 목적격 조사
  TOPIC: '은/는',        // 주제격 조사
  LOCATION: '에서/에서',  // 장소격 조사
  TIME: '에/에',         // 시간격 조사
  TOOL: '으로/로',       // 도구격 조사
  WITH: '과/와',         // 공동격 조사
  FROM: '에서/에서',      // 출발격 조사
  TO: '에/에',           // 도착격 조사
} as const

/**
 * 템플릿에서 사용할 수 있는 조사 함수들
 */
export const josaFunctions = {
  josa,
  subject: (word: string) => josa(word, COMMON_JOSA.SUBJECT),
  object: (word: string) => josa(word, COMMON_JOSA.OBJECT),
  topic: (word: string) => josa(word, COMMON_JOSA.TOPIC),
  location: (word: string) => josa(word, COMMON_JOSA.LOCATION),
  time: (word: string) => josa(word, COMMON_JOSA.TIME),
  tool: (word: string) => josa(word, COMMON_JOSA.TOOL),
  with: (word: string) => josa(word, COMMON_JOSA.WITH),
  from: (word: string) => josa(word, COMMON_JOSA.FROM),
  to: (word: string) => josa(word, COMMON_JOSA.TO),
}

/**
 * 테스트 함수들
 */
export const josaTests = {
  testBasic: () => {
    console.log('기본 테스트:')
    console.log('강아지' + josa('강아지', '이/가')) // 강아지가
    console.log('고양이' + josa('고양이', '이/가')) // 고양이가
    console.log('책' + josa('책', '을/를')) // 책을
    console.log('펜' + josa('펜', '을/를')) // 펜을
  },
  
  testComplex: () => {
    console.log('복잡한 테스트:')
    console.log('서울' + josa('서울', '에서/에서')) // 서울에서
    console.log('부산' + josa('부산', '에서/에서')) // 부산에서
    console.log('카페' + josa('카페', '에/에')) // 카페에
    console.log('공원' + josa('공원', '에/에')) // 공원에
  }
}
