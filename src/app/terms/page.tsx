/**
 * 이용약관 페이지
 */

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '이용약관 | 어서오개',
  description: '어서오개 서비스 이용약관입니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">이용약관</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>최종 수정일:</strong> 2024년 11월 13일
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관은 어서오개(이하 "회사")가 제공하는 강아지 동반 장소 추천 서비스(이하 "서비스")의 이용과 관련하여 
              회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>"서비스"란 회사가 제공하는 강아지 동반 가능한 장소 정보 제공 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 의미합니다.</li>
              <li>"콘텐츠"란 서비스를 통해 제공되는 모든 정보, 데이터, 텍스트, 이미지 등을 의미합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 
              변경된 약관은 전항과 같은 방법으로 공지함으로써 효력을 발생합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>강아지 동반 가능한 장소 정보 제공</li>
              <li>지역별, 카테고리별 장소 검색 및 필터링</li>
              <li>장소 상세 정보 제공</li>
              <li>관련 가이드 및 블로그 콘텐츠 제공</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (이용자의 의무)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>서비스의 안정적 운영을 방해하는 행위</li>
              <li>타인의 정보를 도용하는 행위</li>
              <li>서비스에 게시된 정보를 무단으로 복제, 배포하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (면책사항)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 
              서비스 제공에 관한 책임이 면제됩니다. 또한 회사는 이용자가 서비스를 이용하여 기대하는 
              수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 
              손해에 관하여 책임을 지지 않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (준거법 및 관할법원)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따르며, 
              서비스 이용과 관련하여 발생한 분쟁에 대하여는 대한민국 법을 적용하며, 
              관할법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              본 약관에 대한 문의사항이 있으시면{' '}
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

