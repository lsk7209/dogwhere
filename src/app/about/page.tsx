/**
 * 회사소개 페이지
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { Heart, Users, MapPin, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: '회사소개 | 어서오개',
  description: '어서오개는 강아지와 함께하는 모든 순간을 더 특별하게 만들어드립니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">어서오개</h1>
          <p className="text-xl text-gray-600">
            강아지와 함께하는 모든 순간을 더 특별하게
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-500" />
              우리의 비전
            </h2>
            <p className="text-gray-700 leading-relaxed">
              어서오개는 반려견과 함께하는 여행과 일상이 더욱 즐겁고 편리해지도록 돕는 서비스입니다. 
              전국 어디서나 강아지와 함께 갈 수 있는 장소를 쉽게 찾을 수 있도록 최선을 다하고 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              주요 서비스
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>장소 검색:</strong> 지역별, 카테고리별로 강아지 동반 가능한 장소를 쉽게 검색
              </li>
              <li>
                <strong>상세 정보:</strong> 각 장소의 운영시간, 가격, 강아지 정책 등 상세 정보 제공
              </li>
              <li>
                <strong>가이드:</strong> 강아지와 함께하는 여행 및 일상에 유용한 가이드 제공
              </li>
              <li>
                <strong>블로그:</strong> 강아지 동반 여행 후기 및 유용한 정보 공유
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-green-600" />
              우리의 약속
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">정확한 정보</h3>
                <p className="text-gray-700">
                  신뢰할 수 있는 데이터 소스를 통해 정확한 정보를 제공합니다.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">지속적인 업데이트</h3>
                <p className="text-gray-700">
                  새로운 장소 정보를 지속적으로 추가하고 업데이트합니다.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">사용자 중심</h3>
                <p className="text-gray-700">
                  사용자의 편의를 최우선으로 생각하는 서비스를 제공합니다.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">커뮤니티</h3>
                <p className="text-gray-700">
                  강아지와 함께하는 모든 사람들의 커뮤니티를 만들어갑니다.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-red-600" />
              연락처
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>이메일:</strong> contact@dogswhere.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>전화:</strong> 02-1234-5678 (평일 09:00-18:00)
              </p>
              <p className="text-gray-700">
                <strong>주소:</strong> 서울특별시 강남구 테헤란로 123, 456호
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              어서오개와 함께 강아지와의 특별한 순간을 만들어보세요.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 가기
              </Link>
              <Link 
                href="/partnership" 
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                제휴문의
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

