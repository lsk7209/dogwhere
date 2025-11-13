/**
 * 데이터 출처 페이지
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Database, MapPin, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: '데이터 출처 | 어서오개',
  description: '어서오개에서 제공하는 장소 정보의 데이터 출처를 안내합니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function DataSourcePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">데이터 출처</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            어서오개는 신뢰할 수 있는 공공 데이터와 공개 API를 통해 장소 정보를 수집하고 있습니다.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              주요 데이터 출처
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Google Places API</h3>
                <p className="text-gray-700 mb-4">
                  전 세계 장소 정보를 제공하는 Google의 공개 API입니다. 
                  기본적인 장소 정보(이름, 주소, 위치, 평점 등)를 제공합니다.
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a 
                    href="https://developers.google.com/maps/documentation/places" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Google Places API 문서
                  </a>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">카카오맵 API</h3>
                <p className="text-gray-700 mb-4">
                  한국 내 상세한 장소 정보를 제공하는 카카오의 공개 API입니다. 
                  한국어 주소, 전화번호, 운영시간 등 상세 정보를 제공합니다.
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a 
                    href="https://developers.kakao.com/docs/latest/ko/local/dev-guide" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    카카오맵 API 문서
                  </a>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">공공데이터포털</h3>
                <p className="text-gray-700 mb-4">
                  정부에서 제공하는 공공 데이터를 활용하여 정확한 정보를 제공합니다.
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a 
                    href="https://www.data.go.kr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    공공데이터포털
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              데이터 처리 과정
            </h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-3">
              <li>공개 API를 통해 장소 정보 수집</li>
              <li>중복 제거 및 데이터 정규화</li>
              <li>강아지 동반 가능 여부 확인 및 검증</li>
              <li>사용자에게 최적화된 형태로 제공</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              데이터 정확성
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              어서오개는 제공되는 정보의 정확성을 최대한 보장하기 위해 노력하고 있습니다. 
              그러나 다음 사항에 대해 책임을 지지 않습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>장소의 영업 상태 변경</li>
              <li>운영 시간 및 가격 정보 변경</li>
              <li>강아지 동반 정책 변경</li>
              <li>기타 제3자 데이터 제공자의 정보 오류</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              정보가 변경되었거나 오류를 발견하신 경우{' '}
              <Link href="/report" className="text-blue-600 hover:text-blue-800">
                오류 신고
              </Link>
              {' '}페이지를 통해 알려주시기 바랍니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">데이터 업데이트</h2>
            <p className="text-gray-700 leading-relaxed">
              장소 정보는 정기적으로 업데이트되며, 주요 변경사항은 자동으로 반영됩니다. 
              다만, 실시간 정보가 아닐 수 있으므로 방문 전 직접 확인하시는 것을 권장합니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              데이터 출처에 대한 문의사항이 있으시면{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                문의하기
              </Link>
              {' '}페이지를 통해 연락해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

