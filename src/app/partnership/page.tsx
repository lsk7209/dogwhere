/**
 * 제휴문의 페이지
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone, Handshake, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '제휴문의 | 어서오개',
  description: '어서오개와 함께 성장할 파트너를 찾고 있습니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Handshake className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">제휴문의</h1>
          <p className="text-xl text-gray-600">
            어서오개와 함께 성장할 파트너를 찾고 있습니다
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">제휴 유형</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">장소 제휴</h3>
                <p className="text-gray-700 mb-4">
                  강아지 동반 가능한 카페, 식당, 호텔 등 장소 정보를 제공해주시는 파트너를 찾고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>정확한 운영 정보 제공</li>
                  <li>강아지 정책 안내</li>
                  <li>프로모션 정보 공유</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">콘텐츠 제휴</h3>
                <p className="text-gray-700 mb-4">
                  강아지 관련 유용한 정보와 콘텐츠를 제공해주시는 파트너를 찾고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>가이드 콘텐츠 제공</li>
                  <li>블로그 포스트 협업</li>
                  <li>전문 지식 공유</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">기술 제휴</h3>
                <p className="text-gray-700 mb-4">
                  서비스 개선에 도움이 되는 기술 및 도구를 제공해주시는 파트너를 찾고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>API 연동</li>
                  <li>데이터 제공</li>
                  <li>기술 협력</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">마케팅 제휴</h3>
                <p className="text-gray-700 mb-4">
                  함께 성장할 수 있는 마케팅 파트너를 찾고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>크로스 프로모션</li>
                  <li>이벤트 협업</li>
                  <li>브랜드 협업</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">제휴 혜택</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">노출 기회</h3>
                  <p className="text-gray-700">
                    어서오개 플랫폼을 통해 더 많은 사용자에게 노출될 수 있는 기회를 제공합니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">데이터 인사이트</h3>
                  <p className="text-gray-700">
                    사용자 행동 데이터 및 트렌드 분석 정보를 공유합니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">마케팅 지원</h3>
                  <p className="text-gray-700">
                    다양한 마케팅 채널을 통한 홍보 지원을 제공합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">제휴 절차</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-3">
              <li>제휴 문의 및 상담</li>
              <li>제휴 제안서 검토</li>
              <li>제휴 조건 협의</li>
              <li>제휴 계약 체결</li>
              <li>제휴 시작 및 운영</li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">연락처</h2>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <a 
                    href="mailto:partnership@dogswhere.com" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    partnership@dogswhere.com
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">전화</p>
                  <p className="text-gray-900 font-medium">02-1234-5678</p>
                  <p className="text-sm text-gray-600">평일 09:00-18:00</p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-6">
              제휴에 관심이 있으시면 위 연락처로 문의해 주시기 바랍니다.
            </p>
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

