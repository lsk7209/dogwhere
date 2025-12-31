import { createGeminiClient } from '../client';

describe('GeminiClient.generateBlogPost', () => {
    let client: any;

    beforeAll(() => {
        process.env.GEMINI_API_KEY = 'test-key';
        client = createGeminiClient();

        // Mock fetch to avoid real API calls
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    candidates: [{
                        content: {
                            parts: [{
                                text: JSON.stringify({
                                    title: '샘플 제목',
                                    excerpt: '샘플 요약',
                                    content: '## 서론\n본문 내용',
                                    tags: ['강아지', '산책'],
                                    category: '생활',
                                    image_prompt: 'A cute dog in a park',
                                })
                            }]
                        }
                    }]
                })
            })
        );
    });

    it('should return object matching the required schema', async () => {
        const result = await client.generateBlogPost(['Existing Title 1', 'Existing Title 2']);
        expect(result).toMatchObject({
            title: expect.any(String),
            excerpt: expect.any(String),
            content: expect.any(String),
            tags: expect.any(Array),
            category: expect.any(String),
            image_prompt: expect.any(String),
        });
    });
});
