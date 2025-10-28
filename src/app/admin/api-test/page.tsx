'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2, Key, Database, MapPin } from 'lucide-react'

export default function ApiKeyTestPage() {
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const testApiKeys = async () => {
    setIsTesting(true)
    setTestResults(null)

    try {
      // API 키 상태 확인
      const statusResponse = await fetch('/api/jobs/simple-collect')
      const statusData = await statusResponse.json()

      if (statusData.success) {
        const { apiKeysStatus } = statusData.data
        
        // 실제 데이터 수집 테스트
        const testResponse = await fetch('/api/jobs/simple-collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_TOKEN || 'test-token'}`
          },
          body: JSON.stringify({
            region: { 
              sido: '서울특별시', 
              sigungu: '강남구',
              coordinates: {
                latitude: 37.5665,
                longitude: 126.9780,
                radius: 5000
              }
            },
            sources: ['google', 'kakao'],
            keywords: ['강아지 동반 카페', '펫프렌들리 카페']
          })
        })

        const testData = await testResponse.json()
        
        setTestResults({
          apiKeysStatus,
          testResult: testData,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Key className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">API 키 테스트</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">환경변수 설정 가이드</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                프로젝트 루트에 <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> 파일을 생성하고 다음 내용을 추가하세요:
              </p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# API Keys
GOOGLE_PLACES_KEY=your_google_places_api_key_here
KAKAO_API_KEY=your_kakao_rest_api_key_here

# Internal Token
INTERNAL_TOKEN=your_secure_internal_token_here`}
              </pre>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">API 키 발급 가이드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Google Places API</h3>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Google Cloud Console 접속</li>
                  <li>2. 프로젝트 생성 또는 선택</li>
                  <li>3. Places API 활성화</li>
                  <li>4. API 키 생성</li>
                  <li>5. 제한사항 설정 (보안)</li>
                </ol>
                <a 
                  href="https://console.cloud.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                >
                  Google Cloud Console →
                </a>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Kakao Map API</h3>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Kakao Developers 접속</li>
                  <li>2. 애플리케이션 등록</li>
                  <li>3. Web 플랫폼 설정</li>
                  <li>4. REST API 키 확인</li>
                  <li>5. 동의항목 설정</li>
                </ol>
                <a 
                  href="https://developers.kakao.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                >
                  Kakao Developers →
                </a>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={testApiKeys}
              disabled={isTesting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              <span>{isTesting ? '테스트 중...' : 'API 키 테스트 실행'}</span>
            </button>
          </div>

          {testResults && (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">테스트 결과</h3>
              
              {testResults.error ? (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  <span>오류: {testResults.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* API 키 상태 */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">API 키 상태</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        {testResults.apiKeysStatus?.google ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Google Places API</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {testResults.apiKeysStatus?.kakao ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Kakao Map API</span>
                      </div>
                    </div>
                  </div>

                  {/* 데이터 수집 결과 */}
                  {testResults.testResult?.success && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">데이터 수집 결과</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">총 수집:</span> {testResults.testResult.data.summary.totalCollected}개
                          </div>
                          <div>
                            <span className="font-medium">새로 추가:</span> {testResults.testResult.data.summary.added}개
                          </div>
                          <div>
                            <span className="font-medium">업데이트:</span> {testResults.testResult.data.summary.updated}개
                          </div>
                          <div>
                            <span className="font-medium">건너뜀:</span> {testResults.testResult.data.summary.skipped}개
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 오류 메시지 */}
                  {testResults.testResult?.success === false && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">데이터 수집 실패</span>
                      </div>
                      <p className="text-sm text-red-700 mt-2">
                        {testResults.testResult.error?.message}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    테스트 시간: {new Date(testResults.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
