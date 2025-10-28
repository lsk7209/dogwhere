'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Heart, User, Menu, X, Calendar, MapPin, BookOpen, MessageSquare } from 'lucide-react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="container mx-auto px-4">
        {/* 상단 바 */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            어서오개
          </Link>
          
          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              홈
            </Link>
            
            <Link href="/recommendations/today" className="text-gray-700 hover:text-blue-600 font-medium">
              오늘의 추천
            </Link>

            <Link href="/seoul" className="text-gray-700 hover:text-blue-600 font-medium">
              지역 탐색
            </Link>

            <Link href="/events" className="text-gray-700 hover:text-blue-600 font-medium">
              행사
            </Link>
            
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">
              블로그
            </Link>
            
            <Link href="/guide" className="text-gray-700 hover:text-blue-600 font-medium">
              반려가이드
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <User className="w-5 h-5" />
            </button>
            <button 
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="py-4 space-y-2">
              <Link 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>홈</span>
              </Link>
              
              <Link 
                href="/recommendations/today" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>오늘의 추천</span>
              </Link>
              
              <Link 
                href="/seoul" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                <span>지역 탐색</span>
              </Link>
              
              <Link 
                href="/events" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                <span>행사</span>
              </Link>
              
              <Link 
                href="/blog" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                <span>블로그</span>
              </Link>
              
              <Link 
                href="/guide" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                <span>반려가이드</span>
              </Link>
              
              <Link 
                href="/report" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="w-4 h-4" />
                <span>제보하기</span>
              </Link>
            </nav>
          </div>
        )}
        
        {/* 검색바 (모바일) */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="강아지 동반 장소를 검색해보세요"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  )
}