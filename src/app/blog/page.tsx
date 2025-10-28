import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '블로그 | 어서오개',
  description: '강아지와 함께하는 여행 이야기와 유용한 정보를 확인해보세요.',
  keywords: '강아지 블로그, 반려견 여행, 강아지 동반 여행 이야기',
  openGraph: {
    title: '블로그 | 어서오개',
    description: '강아지와 함께하는 여행 이야기와 유용한 정보를 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              블로그 📝
            </h1>
            <p className="text-xl text-gray-600">
              강아지와 함께하는 특별한 여행 이야기와 유용한 정보
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                slug: 'jeju-dog-travel-guide',
                title: '강아지와 함께하는 제주도 여행기',
                excerpt: '제주도의 아름다운 자연 속에서 강아지와 함께한 특별한 여행 이야기',
                category: '여행기',
                date: '2024.10.28',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-cafe-selection-guide',
                title: '강아지 카페 선택하는 방법',
                excerpt: '강아지와 함께 갈 수 있는 카페를 선택할 때 고려해야 할 사항들',
                category: '가이드',
                date: '2024.10.25',
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-camping-preparation-guide',
                title: '반려견과 함께하는 캠핑 준비물',
                excerpt: '강아지와 캠핑을 갈 때 꼭 챙겨야 할 준비물과 주의사항',
                category: '캠핑',
                date: '2024.10.22',
                image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'gangnam-dog-cafe-best5',
                title: '서울 강남구 강아지 동반 카페 베스트 5',
                excerpt: '강남구에서 강아지와 함께 갈 수 있는 최고의 카페들을 소개합니다',
                category: '카페',
                date: '2024.10.20',
                image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-health-travel-guide',
                title: '강아지 여행 시 건강 관리법',
                excerpt: '여행 중 강아지의 건강을 지키는 방법과 응급처치 가이드',
                category: '건강',
                date: '2024.10.18',
                image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-international-travel-guide',
                title: '반려견과 함께하는 해외여행 준비',
                excerpt: '강아지와 함께 해외여행을 갈 때 필요한 서류와 준비사항',
                category: '해외여행',
                date: '2024.10.15',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-training-basic-guide',
                title: '강아지 기본 훈련의 모든 것',
                excerpt: '강아지와 함께 살아가기 위한 필수 기본 훈련 방법과 팁',
                category: '훈련',
                date: '2024.11.02',
                image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-food-nutrition-guide',
                title: '강아지 사료 선택과 영양 관리',
                excerpt: '강아지의 건강한 성장을 위한 올바른 사료 선택과 영양 관리법',
                category: '영양',
                date: '2024.11.05',
                image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-grooming-home-guide',
                title: '집에서 하는 강아지 그루밍',
                excerpt: '집에서 강아지를 직접 그루밍하는 방법과 주의사항',
                category: '그루밍',
                date: '2024.11.08',
                image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-behavior-problem-solving',
                title: '강아지 문제 행동 해결하기',
                excerpt: '일상에서 겪는 강아지의 문제 행동을 해결하는 실용적인 방법',
                category: '행동',
                date: '2024.11.10',
                image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-senior-care-guide',
                title: '시니어 강아지 케어 완벽 가이드 - 노령견 돌보기',
                excerpt: '7세 이상 시니어 강아지를 위한 특별한 케어 방법과 건강 관리법을 상세히 알려드립니다.',
                category: '케어',
                date: '2024.11.28',
                image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-winter-care-guide',
                title: '강아지 겨울 케어 완벽 가이드 - 추위 대비법',
                excerpt: '추운 겨울철 강아지 건강 관리와 안전한 겨울 보내기 방법을 상세히 알려드립니다.',
                category: '계절케어',
                date: '2024.12.01',
                image: 'https://images.unsplash.com/photo-1513473448272-20e3e2524a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-summer-care-guide',
                title: '강아지 여름 케어 완벽 가이드 - 더위 대비법',
                excerpt: '더운 여름철 강아지 건강 관리와 안전한 여름 보내기 방법을 상세히 알려드립니다.',
                category: '계절케어',
                date: '2024.12.03',
                image: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-first-time-owner-guide',
                title: '강아지 첫 입양 완벽 가이드 - 초보 집사 필수 지식',
                excerpt: '강아지를 처음 키우는 분들을 위한 완벽한 입양 가이드와 초기 케어 방법을 상세히 알려드립니다.',
                category: '입양',
                date: '2024.12.05',
                image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-multi-pet-household-guide',
                title: '다중 반려동물 가정 완벽 가이드 - 여러 강아지 키우기',
                excerpt: '여러 마리의 강아지를 함께 키우는 방법과 다중 반려동물 가정의 관리법을 상세히 알려드립니다.',
                category: '관리',
                date: '2024.12.07',
                image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-photography-tips-guide',
                title: '강아지 사진 찍는 법 - 완벽한 순간 포착하기',
                excerpt: '강아지의 귀여운 모습을 완벽하게 담는 사진 촬영 팁과 포즈 가이드',
                category: '사진',
                date: '2024.12.10',
                image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-socialization-guide',
                title: '강아지 사회화 훈련 - 다른 강아지와 사람과의 만남',
                excerpt: '강아지가 건강한 사회성을 기를 수 있도록 도와주는 사회화 훈련 방법',
                category: '사회화',
                date: '2024.12.12',
                image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-anxiety-management-guide',
                title: '강아지 불안감 해소하기 - 스트레스 관리법',
                excerpt: '강아지의 불안감과 스트레스를 효과적으로 관리하고 해소하는 방법',
                category: '심리',
                date: '2024.12.14',
                image: 'https://images.unsplash.com/photo-1601758228041-4a72aa1c71c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-dental-care-guide',
                title: '강아지 치아 관리 - 구강 건강 지키기',
                excerpt: '강아지의 치아와 잇몸 건강을 위한 올바른 구강 관리법과 예방법',
                category: '구강관리',
                date: '2024.12.16',
                image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-exercise-routine-guide',
                title: '강아지 운동 루틴 - 체력과 건강을 위한 운동법',
                excerpt: '강아지의 체력 향상과 건강 유지를 위한 효과적인 운동 루틴과 방법',
                category: '운동',
                date: '2024.12.18',
                image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-toy-selection-guide',
                title: '강아지 장난감 선택 가이드 - 안전하고 재미있는 놀이',
                excerpt: '강아지에게 적합한 장난감을 선택하는 방법과 안전한 놀이 환경 조성',
                category: '장난감',
                date: '2024.12.20',
                image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-emergency-first-aid-guide',
                title: '강아지 응급처치 가이드 - 위급상황 대처법',
                excerpt: '강아지에게 응급상황이 발생했을 때 즉시 할 수 있는 응급처치 방법',
                category: '응급처치',
                date: '2024.12.22',
                image: 'https://images.unsplash.com/photo-1601758228041-4a72aa1c71c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-sleep-environment-guide',
                title: '강아지 수면 환경 조성 - 편안한 잠자리 만들기',
                excerpt: '강아지가 편안하고 안전하게 잘 수 있는 수면 환경 조성 방법',
                category: '수면환경',
                date: '2024.12.24',
                image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-seasonal-allergy-guide',
                title: '강아지 계절성 알레르기 관리 - 봄가을 대비법',
                excerpt: '계절 변화에 따른 강아지 알레르기 증상과 효과적인 관리 방법',
                category: '알레르기',
                date: '2024.12.26',
                image: 'https://images.unsplash.com/photo-1601758228041-4a72aa1c71c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              },
              {
                slug: 'dog-communication-signals-guide',
                title: '강아지 신호 이해하기 - 몸짓과 소리로 읽는 마음',
                excerpt: '강아지의 몸짓, 소리, 행동을 통해 강아지의 마음과 상태를 이해하는 방법',
                category: '소통',
                date: '2024.12.28',
                image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            ].map((post, index) => (
              <Link key={index} href={`/blog/${post.slug}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image || `https://images.unsplash.com/photo-${1601758228041 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
  )
}
