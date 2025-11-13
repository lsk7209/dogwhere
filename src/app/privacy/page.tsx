/**
 * 개인정보처리방침 페이지
 */

import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '개인정보처리방침 | 어서오개',
  description: '어서오개 개인정보처리방침입니다.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>최종 수정일:</strong> 2024년 11월 13일
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (개인정보의 처리목적)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              어서오개(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 
              다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 
              개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>서비스 제공 및 개선</li>
              <li>고객 문의 및 불만 처리</li>
              <li>서비스 이용 통계 분석</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 
              동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 
              각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>서비스 이용 기록: 3년 (통신비밀보호법)</li>
              <li>고객 문의 기록: 3년 (전자상거래법)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>필수항목: 없음 (현재 회원가입 없이 서비스 이용 가능)</li>
              <li>선택항목: 문의 시 이메일 주소, 이름</li>
              <li>자동 수집 항목: IP 주소, 쿠키, 서비스 이용 기록</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 
              정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 
              개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (개인정보처리의 위탁)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>클라우드플레어: 웹 호스팅 및 CDN 서비스</li>
              <li>Google Analytics: 서비스 이용 통계 분석</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              정보주체는 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              위 권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며, 
              회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (개인정보의 파기)</h2>
            <p className="text-gray-700 leading-relaxed">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
              지체 없이 해당 개인정보를 파기합니다. 파기의 절차 및 방법은 다음과 같습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
              <li>파기절차: 불필요한 개인정보는 내부 방침 및 기타 관련 법령에 따라 파기</li>
              <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제8조 (개인정보 보호책임자)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 
              불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                <strong>개인정보 보호책임자</strong><br />
                이메일: privacy@dogswhere.com<br />
                전화: 02-1234-5678
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              본 개인정보처리방침에 대한 문의사항이 있으시면{' '}
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

