import Link from 'next/link'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { href: '/about', label: '회사소개' },
      { href: '/contact', label: '문의하기' },
      { href: '/partnership', label: '제휴문의' }
    ],
    legal: [
      { href: '/terms', label: '이용약관' },
      { href: '/privacy', label: '개인정보처리방침' },
      { href: '/data-source', label: '데이터 출처' }
    ],
    service: [
      { href: '/sitemap.xml', label: '사이트맵' },
      { href: '/rss.xml', label: 'RSS 피드' },
      { href: '/report', label: '오류 신고' }
    ]
  }

  const socialLinks = [
    { href: 'https://instagram.com/dogswhere', label: 'Instagram', icon: '📷' },
    { href: 'https://facebook.com/dogswhere', label: 'Facebook', icon: '📘' },
    { href: 'https://youtube.com/dogswhere', label: 'YouTube', icon: '📺' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 브랜드 섹션 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">어서오개</span>
            </div>
            <p className="text-gray-300 mb-4">
              강아지와 함께하는 특별한 여행을 위한 최고의 동반자
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 정보</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">법적 정보</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              {footerLinks.service.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail className="w-4 h-4" />
              <span>contact@dogswhere.com</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Phone className="w-4 h-4" />
              <span>02-1234-5678 (평일 09:00-18:00)</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 mt-2">
            <MapPin className="w-4 h-4" />
            <span>서울특별시 강남구 테헤란로 123, 456호</span>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="mb-2">
            © {currentYear} 어서오개. All rights reserved.
          </p>
          <p className="text-sm">
            주식회사 어서오개 | 대표이사 홍길동 | 사업자등록번호 123-45-67890
          </p>
          <p className="text-sm mt-1">
            관광사업자등록번호 제 2024-000001호 | 통신판매업 신고번호 2024-서울강남-0001
          </p>
          <p className="text-sm mt-2 text-gray-500">
            어서오개는 통신판매중개자로서 통신판매의 당사자가 아니며 상품 거래정보 및 거래 등에 대해 책임을 지지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  )
}