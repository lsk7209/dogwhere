import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: '강아지 행사 일정 | 어서오개',
  description: '전국 강아지 관련 행사, 이벤트, 축제 일정을 확인하세요. 반려견과 함께 참여할 수 있는 특별한 행사들을 만나보세요.',
  keywords: '강아지 행사, 반려견 이벤트, 강아지 축제, 반려견 행사',
  openGraph: {
    title: '강아지 행사 일정 | 어서오개',
    description: '전국 강아지 관련 행사, 이벤트, 축제 일정을 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function EventsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            강아지 행사 일정 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            반려견과 함께 참여할 수 있는 특별한 행사들을 만나보세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'this-week', label: '이번주', count: 12 },
                { key: 'next-week', label: '다음주', count: 8 },
                { key: 'calendar', label: '달력', count: 45 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    tab.key === 'this-week'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 이번주 행사 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            이번주 행사 (12개)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">행사 이미지</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  강아지 행사 {item}
                </h3>
                <p className="text-gray-600 mb-4">
                  강아지와 함께 참여할 수 있는 특별한 행사입니다.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📅</span>
                    <span>2025.10.28 - 2025.11.03</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📍</span>
                    <span>서울 마포구</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">🎫</span>
                    <span>무료</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    반려견 가능
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    자세히 보기 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 다음주 행사 미리보기 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              다음주 행사 미리보기
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              다음주 탭 보기 →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">행사 이미지</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  다음주 강아지 행사 {item}
                </h3>
                <p className="text-gray-600 mb-4">
                  다음주에 열리는 강아지 관련 특별한 행사입니다.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">2025.11.04 - 2025.11.10</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    반려견 가능
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 달력 미리보기 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              이번달 달력
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              달력 탭 보기 →
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`text-center py-2 text-sm ${
                    day === 28
                      ? 'bg-blue-100 text-blue-800 rounded-full font-medium'
                      : 'text-gray-700 hover:bg-gray-100 rounded-full'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-blue-100 rounded-full mr-2"></span>
              행사가 있는 날
            </div>
          </div>
        </section>

        {/* 광고 슬롯 */}
        <section className="mb-12">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="h-32 flex items-center justify-center">
              <span className="text-gray-500">광고 영역 (고정 높이)</span>
            </div>
          </div>
        </section>
      </div>
      </div>
    </Layout>
  )
}
