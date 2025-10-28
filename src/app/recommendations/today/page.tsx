import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: '오늘의 추천 장소 | 어서오개',
  description: '오늘 강아지와 함께 가기 좋은 추천 장소들을 확인해보세요.',
  keywords: '오늘의 추천, 강아지 동반, 반려견, 추천 장소',
  openGraph: {
    title: '오늘의 추천 장소 | 어서오개',
    description: '오늘 강아지와 함께 가기 좋은 추천 장소들을 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function TodayRecommendationsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              오늘의 추천 장소 🌟
            </h1>
            <p className="text-xl text-gray-600">
              오늘 강아지와 함께 가기 좋은 특별한 장소들을 소개합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${1601758228041 + item}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                    alt={`오늘의 추천 장소 ${item}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    오늘의 특별 추천 {item}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    강아지와 함께하는 특별한 경험을 제공하는 장소입니다.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                        ⭐ 오늘 추천
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        O-Dog {90 + item}
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      자세히 보기 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
