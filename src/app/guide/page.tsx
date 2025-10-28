import { Metadata } from 'next'
import { BookOpen, Heart, Shield, Car, Plane, Home, Utensils, PawPrint, Camera, MapPin, Calendar, Users, Star, Scissors, Activity, Brain, Apple } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '반려가이드 | 어서오개',
  description: '강아지와 함께하는 여행을 위한 완벽한 가이드와 팁을 확인해보세요.',
  keywords: '반려가이드, 강아지 여행 가이드, 반려견 동반 여행, 강아지 케어',
  openGraph: {
    title: '반려가이드 | 어서오개',
    description: '강아지와 함께하는 여행을 위한 완벽한 가이드와 팁을 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function GuidePage() {
  const guideCategories = [
    {
      icon: <Car className="w-8 h-8 text-blue-500" />,
      title: '교통편 이용 가이드',
      description: '강아지와 함께 대중교통을 이용하는 방법',
      items: ['지하철 이용법', '버스 이용법', '택시 이용법', '자가용 여행'],
      slug: 'dog-travel-transport-guide'
    },
    {
      icon: <Home className="w-8 h-8 text-green-500" />,
      title: '숙소 선택 가이드',
      description: '강아지 동반 가능한 숙소를 선택하는 방법',
      items: ['호텔 선택 기준', '펜션 예약 팁', '글램핑 준비물', '숙소 예약 시 주의사항'],
      slug: 'dog-accommodation-guide'
    },
    {
      icon: <Utensils className="w-8 h-8 text-orange-500" />,
      title: '식사 및 간식',
      description: '여행 중 강아지 식사 관리 방법',
      items: ['여행용 사료 준비', '간식 선택법', '급수 관리', '식사 시간 조절'],
      slug: 'dog-meal-travel-guide'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: '안전 관리',
      description: '여행 중 강아지 안전을 지키는 방법',
      items: ['응급처치법', '안전장비 준비', '위험 요소 파악', '응급 연락처'],
      slug: 'dog-safety-travel-guide'
    },
    {
      icon: <PawPrint className="w-8 h-8 text-purple-500" />,
      title: '건강 관리',
      description: '여행 중 강아지 건강 관리 방법',
      items: ['건강 체크리스트', '예방접종 확인', '스트레스 관리', '운동량 조절'],
      slug: 'dog-health-travel-guide'
    },
    {
      icon: <Plane className="w-8 h-8 text-cyan-500" />,
      title: '해외여행 준비',
      description: '강아지와 함께하는 해외여행 준비사항',
      items: ['여권 및 서류', '항공편 예약', '검역 절차', '현지 규정 확인'],
      slug: 'dog-international-travel-guide'
    },
    {
      icon: <Camera className="w-8 h-8 text-pink-500" />,
      title: '여행 사진 촬영',
      description: '강아지와 함께하는 완벽한 여행 사진 촬영법',
      items: ['사진 촬영 팁', '자연스러운 포즈', '조명 활용법', '인스타그램 업로드'],
      slug: 'dog-travel-photography-guide'
    },
    {
      icon: <MapPin className="w-8 h-8 text-indigo-500" />,
      title: '지역별 여행지',
      description: '전국 강아지 동반 추천 여행지 가이드',
      items: ['서울 추천 코스', '제주도 여행지', '강원도 자연여행', '경상도 해안여행'],
      slug: 'dog-regional-travel-guide'
    },
    {
      icon: <Calendar className="w-8 h-8 text-teal-500" />,
      title: '계절별 여행',
      description: '계절에 따른 강아지 여행 준비사항',
      items: ['봄 여행 준비', '여름 더위 대비', '가을 단풍 여행', '겨울 추위 대비'],
      slug: 'dog-seasonal-travel-guide'
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: '가족 여행',
      description: '강아지와 아이들이 함께하는 가족 여행 가이드',
      items: ['아이와 강아지 동반', '가족 여행 준비물', '안전 수칙', '추억 만들기'],
      slug: 'dog-family-travel-guide'
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: '특별한 경험',
      description: '강아지와 함께하는 특별하고 의미있는 여행 경험',
      items: ['펫 페스티벌 참여', '자원봉사 활동', '강아지 카페 투어', '특별한 기념일'],
      slug: 'dog-special-experience-guide'
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: '사회화 훈련',
      description: '강아지 사회화 훈련 방법',
      items: ['기본 사회화 환경', '사람들과의 사회화', '다른 동물들과의 사회화', '지속적인 사회화'],
      slug: 'dog-socialization-guide'
    },
    {
      icon: <Scissors className="w-8 h-8 text-pink-500" />,
      title: '그루밍 관리',
      description: '강아지 그루밍 및 관리 방법',
      items: ['일상 브러싱', '목욕 및 샴푸', '발톱 관리', '정기적인 그루밍'],
      slug: 'dog-grooming-guide'
    },
    {
      icon: <Activity className="w-8 h-8 text-emerald-500" />,
      title: '운동 및 활동',
      description: '강아지 운동 및 활동 방법',
      items: ['일상 산책', '실내 놀이 활동', '훈련과 함께하는 운동', '정기적인 운동'],
      slug: 'dog-exercise-guide'
    },
    {
      icon: <Brain className="w-8 h-8 text-amber-500" />,
      title: '행동 이해 및 교정',
      description: '강아지 행동 이해 및 교정 방법',
      items: ['행동 관찰 및 분석', '문제 행동 원인 파악', '행동 교정 방법 적용', '지속적인 교정'],
      slug: 'dog-behavior-guide'
    },
    {
      icon: <Apple className="w-8 h-8 text-lime-500" />,
      title: '영양 및 사료 선택',
      description: '강아지 영양 및 사료 선택 방법',
      items: ['필수 영양소 이해', '사료 선택 및 구매', '급여 방법 및 관리', '지속적인 영양 관리'],
      slug: 'dog-nutrition-guide'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              반려가이드 📚
            </h1>
            <p className="text-xl text-gray-600">
              강아지와 함께하는 완벽한 여행을 위한 모든 가이드
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guideCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/guide/${category.slug}`} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center">
                  가이드 보기
                </Link>
              </div>
            ))}
          </div>

          {/* 추가 정보 섹션 */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                더 많은 정보가 필요하신가요?
              </h2>
              <p className="text-gray-600">
                강아지와 함께하는 여행에 대한 모든 궁금증을 해결해드립니다
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">상세 가이드</h3>
                <p className="text-gray-600 text-sm">
                  각 카테고리별 상세한 가이드와 팁을 제공합니다
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">전문가 조언</h3>
                <p className="text-gray-600 text-sm">
                  수의사와 반려동물 전문가의 조언을 받아보세요
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">안전 우선</h3>
                <p className="text-gray-600 text-sm">
                  강아지의 안전과 건강을 최우선으로 고려합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
