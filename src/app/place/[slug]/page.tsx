import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// 장소 데이터 (실제로는 데이터베이스에서 가져옴)
const places: Record<string, {
  name: string
  address: string
  lat: number
  lng: number
  region: string
  category: string
  phone: string
  openingHours: string[]
  features: string[]
  rating: number
  reviewCount: number
  policyLevel: string
  summary: string
  description: string
  faq: Array<{ question: string; answer: string }>
}> = {
  'cafe-paws-seoul': {
    name: '카페 포우즈',
    address: '서울 마포구 홍대입구역 1번 출구',
    lat: 37.55,
    lng: 126.91,
    region: 'seoul',
    category: 'dog-cafe',
    phone: '02-1234-5678',
    openingHours: ['월-일: 10:00-22:00'],
    features: ['대형견가능', '물그릇', '그늘', '주차'],
    rating: 4.6,
    reviewCount: 213,
    policyLevel: '안전',
    summary: '강아지와 함께 즐길 수 있는 특별한 카페입니다. 넓은 실내 공간과 야외 테라스를 제공하며, 강아지 전용 메뉴도 있습니다.',
    description: `
      <h2>카페 포우즈 소개</h2>
      <p>카페 포우즈는 강아지와 함께하는 특별한 시간을 제공하는 카페입니다.</p>
      
      <h3>시설 및 특징</h3>
      <ul>
        <li>넓은 실내 공간 (100평)</li>
        <li>야외 테라스 (50평)</li>
        <li>강아지 전용 놀이터</li>
        <li>대형견 전용 공간</li>
        <li>무료 주차장</li>
      </ul>
      
      <h3>메뉴</h3>
      <p>인간과 강아지 모두를 위한 다양한 메뉴를 제공합니다.</p>
      
      <h3>이용 안내</h3>
      <p>사전 예약을 권장하며, 강아지의 예방접종 증명서를 지참해 주세요.</p>
    `,
    faq: [
      {
        question: '대형견도 입장 가능한가요?',
        answer: '네, 대형견도 환영합니다. 다만 사전 예약을 권장합니다.'
      },
      {
        question: '주차는 어떻게 하나요?',
        answer: '무료 주차장을 제공합니다. 주차 공간이 제한적이므로 대중교통 이용을 권장합니다.'
      },
      {
        question: '강아지 전용 메뉴가 있나요?',
        answer: '네, 강아지 전용 간식과 음료를 제공합니다.'
      }
    ]
  }
}

// 정적 파라미터 생성
export async function generateStaticParams() {
  return Object.keys(places).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const place = places[slug]
  
  if (!place) {
    return {
      title: '장소를 찾을 수 없습니다 | 어서오개'
    }
  }

  return {
    title: `${place.name} - ${place.address} | 어서오개`,
    description: place.summary,
    keywords: `${place.name}, ${place.category}, ${place.region}, 강아지 동반`,
    openGraph: {
      title: `${place.name} | 어서오개`,
      description: place.summary,
      type: 'article',
    },
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const place = places[slug]
  
  if (!place) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">홈</a></li>
            <li className="text-gray-400">/</li>
            <li><a href={`/${place.region}`} className="hover:text-blue-600">{place.region}</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{place.name}</li>
          </ol>
        </nav>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              {/* 장소 헤더 */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {place.name}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {place.summary}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      O-Dog {Math.round(place.rating * 20)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {place.policyLevel}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>⭐ {place.rating}</span>
                    <span>({place.reviewCount}개 리뷰)</span>
                  </div>
                </div>
              </header>

              {/* 장소 이미지 */}
              <div className="mb-8">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">장소 이미지</span>
                </div>
              </div>

              {/* 장소 상세 정보 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  상세 정보
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">주소</h3>
                      <p className="text-gray-600">{place.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">전화번호</h3>
                      <p className="text-gray-600">{place.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">영업시간</h3>
                      <div className="text-gray-600">
                        {place.openingHours.map((hours, index) => (
                          <p key={index}>{hours}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">특징</h3>
                      <div className="flex flex-wrap gap-2">
                        {place.features.map((feature) => (
                          <span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 장소 설명 */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  장소 소개
                </h2>
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: place.description }} />
                </div>
              </section>

              {/* FAQ */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  자주 묻는 질문
                </h2>
                <div className="space-y-4">
                  {place.faq.map((item, index) => (
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
              {/* 지도 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">위치</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">지도 영역</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{place.address}</p>
              </div>

              {/* 인근 장소 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">인근 장소</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">이미지</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          인근 장소 {item}
                        </h4>
                        <p className="text-xs text-gray-600">도보 5분</p>
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
