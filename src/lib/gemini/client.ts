import { logger } from '../logger'

/**
 * Gemini 모델 리스트
 */
export enum GeminiModel {
  FLASH_LITE = 'gemini-2.5-flash-lite',
  FLASH_2_0 = 'gemini-2.0-flash',
  PRO = 'gemini-pro',
}

export interface GeminiConfig {
  apiKey: string
  model?: string | GeminiModel
  temperature?: number
  maxTokens?: number
  retryCount?: number
}

export interface RegenerationPrompt {
  originalData: {
    name: string
    category?: string
    address?: string
    description?: string
    [key: string]: unknown
  }
  template?: string
}

export interface RegenerationResult {
  content: string
  model: string
  tokensUsed?: number
  finishReason?: string
}

/**
 * Gemini API 클라이언트
 */
export class GeminiClient {
  private apiKey: string
  private model: string
  private baseUrl: string
  private temperature: number
  private maxTokens: number
  private retryCount: number

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || GeminiModel.FLASH_LITE
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    this.temperature = config.temperature ?? 0.7
    this.maxTokens = config.maxTokens ?? 2000
    this.retryCount = config.retryCount ?? 3
  }

  /**
   * 공통 요청 메서드 (재시도 로직 포함)
   */
  private async request(payload: any, retries = this.retryCount): Promise<any> {
    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const error = await response.json()
          const message = error.error?.message || response.statusText

          if (response.status === 429 && i < retries) {
            const delay = Math.pow(2, i) * 1000
            logger.warn(`Gemini API Rate Limit (429). Retrying in ${delay}ms... (${i + 1}/${retries})`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }

          throw new Error(`Gemini API 오류: ${message}`)
        }

        return await response.json()
      } catch (error) {
        if (i === retries) throw error
        const delay = Math.pow(2, i) * 500
        logger.error(`Gemini API 요청 실패. 재시도 중... (${i + 1}/${retries})`, error)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  /**
   * 컨텐츠 재생성
   */
  async regenerateContent(
    prompt: RegenerationPrompt
  ): Promise<RegenerationResult> {
    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(prompt)

    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: userPrompt },
          ],
        },
      ],
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
        topP: 0.95,
        topK: 40,
      },
    }

    const data = await this.request(payload)
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return {
      content,
      model: this.model,
      tokensUsed: data.usageMetadata?.totalTokenCount,
      finishReason: data.candidates?.[0]?.finishReason,
    }
  }

  /**
   * 시스템 프롬프트 생성
   */
  private buildSystemPrompt(): string {
    return `당신은 강아지 동반 장소에 대한 고유하고 유용한 컨텐츠를 작성하는 전문가입니다.

다음 원칙을 따라주세요:
1. 원본 데이터를 기반으로 하되, 완전히 새로운 관점과 표현으로 재작성
2. 검색 엔진 최적화(SEO)를 고려한 자연스러운 문장
3. 강아지와 반려인 모두에게 유용한 실용적인 정보 포함
4. 한국어로 자연스럽고 읽기 쉬운 문체
5. 중복되지 않는 고유한 컨텐츠 생성

출력 형식:
- 제목: 장소명을 포함한 매력적인 제목
- 소개: 2-3문단의 간결한 소개
- 특징: 주요 특징 3-5개를 불릿 포인트로
- 주의사항: 강아지 동반 시 주의할 점
- 총평: 마무리 문단`
  }

  /**
   * 사용자 프롬프트 생성
   */
  private buildUserPrompt(prompt: RegenerationPrompt): string {
    const { originalData, template } = prompt

    if (template) {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return (originalData[key] as string) || match
      })
    }

    return `다음 장소 정보를 기반으로 고유한 컨텐츠를 작성해주세요:

장소명: ${originalData.name}
카테고리: ${originalData.category || '기타'}
주소: ${originalData.address || '정보 없음'}
설명: ${originalData.description || '정보 없음'}

위 정보를 바탕으로 강아지 동반 장소에 대한 고유하고 유용한 컨텐츠를 작성해주세요.`
  }

  /**
   * 배치 재생성 (여러 항목)
   */
  async regenerateBatch(
    prompts: RegenerationPrompt[],
    delay: number = 2000
  ): Promise<RegenerationResult[]> {
    const results: RegenerationResult[] = []

    for (let i = 0; i < prompts.length; i++) {
      try {
        const result = await this.regenerateContent(prompts[i])
        results.push(result)

        if (i < prompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      } catch (error) {
        logger.error(`배치 재생성 실패 (${i + 1}/${prompts.length})`, error)
      }
    }

    return results
  }

  /**
   * 강아지 관련 일반 블로그 포스트 생성
   */
  async generateBlogPost(existingTitles: string[]): Promise<{
    title: string
    excerpt: string
    content: string
    tags: string[]
    category: string
    image_prompt: string
  }> {
    const systemPrompt = `당신은 대한민국 최고의 반려견 전문가이자 데이터 기반의 전략적 콘텐츠 마케터입니다.
Google SEO, AEO(답변 엔진 최적화), GEO(생성 엔진 최적화)의 알고리즘을 완벽히 이해하고 있으며, 독자에게 압도적인 가치를 주는 '긴 형식(Long-form)'의 고유 콘텐츠를 작성합니다.

콘텐츠 작성 및 구조 가이드라인:
1. **압도적인 분량 및 품질**: 본문의 길이는 공백 제외 **최소 1700자에서 2500자 사이**여야 합니다. 겉핥기식 정보가 아닌, 심층적인 분석과 전문가의 통찰을 담으세요.
2. **고유성(Originality)**: 다른 블로그와 중복되지 않는 독창적인 관점을 제시하세요. 구글이 'Helpful Content'로 인식할 수 있도록 실제 경험이 묻어나는 구체적인 사례를 포함하세요.
3. **구조화된 서식**: H2(##), H3(###)를 6개 이상 사용하여 글의 뼈대를 잡고, 리스트(-), 볼드(**), 표(Table) 등을 활용해 가독성을 극대화하세요.
4. **검색 최적화(SEO/AEO/GEO)**:
   - 글의 시작 부분에 '핵심 요약' 섹션을 두어 검색 엔진 스니펫에 노출되게 하세요.
   - 글의 끝부분에 최소 3개 이상의 상세한 '자주 묻는 질문(FAQ)' 섹션을 포함하세요.
5. **고유 섬네일 프롬프트**: 이 글의 주제를 가장 잘 나타내는 **고유하고 혁신적인 이미지 생성용 영문 프롬프트**를 작성하세요.

출력은 반드시 다음 구조의 JSON 형식이어야 합니다:
{
  "title": "클릭을 부르는 제목",
  "excerpt": "매력적인 메타 설명 (150자 이내)",
  "content": "마크다운 형식의 본문 (1700~2500자 확보). 반드시 FAQ와 전문가 한마디 포함.",
  "tags": ["키워드1", "키워드2"],
  "category": "건강/훈련/생활/제품/심리 중 하나",
  "image_prompt": "이미지 생성을 위한 상세한 영문 프롬프트"
}`

    const userPrompt = `기존에 작성된 글의 제목들입니다:\n${existingTitles.join('\n')}\n\n위 제목들과 중복되지 않는 새로운 주제를 선정해서 블로그 글을 하나 작성해주세요.`

    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: userPrompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: this.maxTokens,
        responseMimeType: "application/json"
      },
    }

    const data = await this.request(payload)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    try {
      const parsed = JSON.parse(text)
      const blogData = Array.isArray(parsed) ? parsed[0] : parsed
      if (!blogData || !blogData.title) {
        throw new Error("응답에 제목(title)이 포함되어 있지 않습니다.")
      }
      blogData.title = blogData.title.replace(/^#+\s*/, '').trim()
      return blogData
    } catch (e) {
      logger.error("Gemini JSON 파싱 오류", e, { text })
      throw new Error(`Gemini 응답 처리 실패: ${e instanceof Error ? e.message : 'Unknown'}`)
    }
  }
}

/**
 * Gemini 클라이언트 인스턴스 생성
 */
export function createGeminiClient(): GeminiClient {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 필요합니다.')
  }

  return new GeminiClient({
    apiKey,
    model: GeminiModel.FLASH_LITE,
    temperature: 0.8,
    maxTokens: 4000,
  })
}
