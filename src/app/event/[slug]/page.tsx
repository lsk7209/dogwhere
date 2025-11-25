import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSafeHTMLProps } from '@/lib/sanitize'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// 행사 데이터 (실제로는 데이터베이스에서 가져옴)
const events: Record<string, {
  title: string
  startDate: string
  endDate: string
  venue: string
  address: string
  lat: number
  lng: number
  ticketInfo: string
  petAllowed: boolean
  description: string
  highlight: string
  faq: Array<{ question: string; answer: string }>
}> = {
  'dog-festival-2025': {
    title: '2025 강아지 축제 - 반려견과 함께하는 특별한 하루',
    startDate: '2025-10-28',
    endDate: '2025-10-30',
    venue: '서울 올림픽공원',
    address: '서울 송파구 올림픽로 424',
    lat: 37.52,
    lng: 127.12,
    ticketInfo: '무료 (사전 등록 필요)',
    petAllowed: true,
    description: `
      <h2>2025 강아지 축제 소개</h2>
      <p>전국 최대 규모의 강아지 축제가 서울 올림픽공원에서 열립니다.</p>
      
      <h3>행사 프로그램</h3>
      <ul>
        <li>강아지 패션쇼</li>
        <li>애견 훈련 시연</li>
        <li>반려견 건강 체크</li>
        <li>강아지 미용 서비스</li>
        <li>펫샵 전시회</li>
      </ul>
      
      <h3>참가 안내</h3>
      <p>사전 등록을 통해 무료로 참가할 수 있습니다. 강아지의 예방접종 증명서를 지참해 주세요.</p>
    `,
    highlight: '전국 최대 규모의 강아지 축제! 무료 참가 가능',
    faq: [
      {
        question: '강아지 없이도 참가할 수 있나요?',
        answer: '네, 강아지 없이도 참가 가능합니다. 다양한 프로그램을 즐기실 수 있습니다.'
      },
      {
        question: '입장료가 있나요?',
        answer: '무료입니다. 다만 일부 체험 프로그램은 별도 비용이 있을 수 있습니다.'
      },
      {
        question: '주차는 어떻게 하나요?',
        answer: '올림픽공원 주차장을 이용하실 수 있습니다. 주차비는 별도입니다.'
      }
    ]
  }
}

// 정적 파라미터 생성
export async function generateStaticParams() {
  return Object.keys(events).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = events[slug]
  
  if (!event) {
    return {
      title: '행사를 찾을 수 없습니다 | 어서오개'
    }
  }

  return {
    title: `${event.title} | 어서오개`,
    description: event.highlight,
    keywords: `${event.title}, 강아지 행사, 반려견 이벤트, ${event.venue}`,
    openGraph: {
      title: `${event.title} | 어서오개`,
      description: event.highlight,
      type: 'article',
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = events[slug]
  
  if (!event) {
    notFound()
  }

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const isMultiDay = startDate.toDateString() !== endDate.toDateString()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">홈</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/events" className="hover:text-blue-600">행사</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{event.title}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              {/* 행사 헤더 */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {event.highlight}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    반려견 가능
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {event.ticketInfo}
                  </span>
                </div>
              </header>

              {/* 행사 이미지 */}
              <div className="mb-8">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">행사 이미지</span>
                </div>
              </div>

              {/* 행사 기본 정보 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  행사 정보
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">일정</h3>
                      <p className="text-gray-600">
                        {isMultiDay 
                          ? `${startDate.toLocaleDateString('ko-KR')} - ${endDate.toLocaleDateString('ko-KR')}`
                          : startDate.toLocaleDateString('ko-KR')
                        }
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">장소</h3>
                      <p className="text-gray-600">{event.venue}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">주소</h3>
                      <p className="text-gray-600">{event.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">참가비</h3>
                      <p className="text-gray-600">{event.ticketInfo}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 행사 설명 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  행사 소개
                </h2>
                <div className="prose prose-lg max-w-none">
                  <div {...createSafeHTMLProps(event.description)} />
                </div>
              </section>

              {/* FAQ */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  자주 묻는 질문
                </h2>
                <div className="space-y-4">
                  {event.faq.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Q. {item.question}
                      </h3>
                      <p className="text-gray-600">
                        A. {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 사이드바 */}
            <div className="lg:col-span-1">
              {/* 행사 요약 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">행사 요약</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5">📅</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">일정</p>
                      <p className="text-xs text-gray-600">
                        {isMultiDay 
                          ? `${startDate.toLocaleDateString('ko-KR')} - ${endDate.toLocaleDateString('ko-KR')}`
                          : startDate.toLocaleDateString('ko-KR')
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5">📍</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">장소</p>
                      <p className="text-xs text-gray-600">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5">🎫</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">참가비</p>
                      <p className="text-xs text-gray-600">{event.ticketInfo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5">🐕</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">반려견</p>
                      <p className="text-xs text-gray-600">
                        {event.petAllowed ? '참가 가능' : '참가 불가'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 지도 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">위치</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">지도 영역</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{event.address}</p>
              </div>

              {/* 관련 행사 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">관련 행사</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">이미지</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          관련 행사 {item}
                        </h4>
                        <p className="text-xs text-gray-600">2025.11.01</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 광고 슬롯 */}
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="h-32 flex items-center justify-center">
                  <span className="text-gray-500">광고 영역</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
