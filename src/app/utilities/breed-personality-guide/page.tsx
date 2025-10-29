'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Dog, Star, Users, Home, GraduationCap } from 'lucide-react'

interface BreedData {
  name: string
  size: 'small' | 'medium' | 'large'
  personality: string[]
  training: 'easy' | 'medium' | 'hard'
  home: string[]
  similar: string[]
}

const breedDatabase: Record<string, BreedData> = {
  'golden': {
    name: '골든리트리버',
    size: 'large',
    personality: ['친절함', '온순함', '활발함', '인내심 강함', '지능 높음'],
    training: 'easy',
    home: ['가족 구성원이 많은 집', '활동적 가정', '아이와 함께 사는 집'],
    similar: ['labrador', 'flat-coated']
  },
  'labrador': {
    name: '라布拉도르',
    size: 'large',
    personality: ['활발함', '친절함', '농구성 강함', '지능 높음', '충성심'],
    training: 'easy',
    home: ['활동적 가정', '야외 활동을 즐기는 집', '가족 구성원이 많은 집'],
    similar: ['golden', 'flat-coated']
  },
  'beagle': {
    name: '비글',
    size: 'medium',
    personality: ['활발함', '호기심 많음', '우호적', '독립적', '끈기 있음'],
    training: 'medium',
    home: ['활동적 가정', '높은 울타리가 있는 집', '정기적인 산책이 가능한 집'],
    similar: ['harrier', 'foxhound']
  },
  'poodle': {
    name: '푸들',
    size: 'medium',
    personality: ['지능 높음', '우아함', '활발함', '학습 능력 뛰어남', '사회성 좋음'],
    training: 'easy',
    home: ['도심 아파트', '활동적 가정', '아이와 함께 사는 집'],
    similar: ['bichon', 'maltese']
  },
  'shiba': {
    name: '시바견',
    size: 'medium',
    personality: ['독립적', '까칠함', '충성심', '똑똑함', '경계심 있음'],
    training: 'hard',
    home: ['조용한 환경', '경험이 있는 집사', '독립적 공간 제공 가능한 집'],
    similar: ['akita', 'jindo']
  },
  'chihuahua': {
    name: '치와와',
    size: 'small',
    personality: ['용감함', '충성심', '경계심', '활발함', '자존심 강함'],
    training: 'medium',
    home: ['아파트 생활', '노인 가정', '작은 공간', '아이 없는 집'],
    similar: ['yorkie', 'pomeranian']
  },
  'husky': {
    name: '시베리안 허스키',
    size: 'large',
    personality: ['활발함', '독립적', '농구성', '친근함', '에너지 넘침'],
    training: 'hard',
    home: ['넓은 공간', '활동적 가정', '추운 기후', '경험이 많은 집사'],
    similar: ['malamute', 'samoyed']
  },
  'pomeranian': {
    name: '포메라니안',
    size: 'small',
    personality: ['활발함', '똑똑함', '용감함', '애정표현 많음', '경계심'],
    training: 'medium',
    home: ['아파트 생활', '도심 생활', '아이 없는 가정', '작은 공간'],
    similar: ['yorkie', 'chihuahua']
  },
  'cocker': {
    name: '코커스패니얼',
    size: 'medium',
    personality: ['우호적', '활발함', '부드러움', '충성심', '애정표현'],
    training: 'easy',
    home: ['가족 구성원이 많은 집', '활동적 가정', '정기적인 미용 가능한 집'],
    similar: ['springer', 'cavalier']
  },
  'jindo': {
    name: '진돗개',
    size: 'medium',
    personality: ['충성심', '경계심', '독립적', '용감함', '지능 높음'],
    training: 'hard',
    home: ['경험이 있는 집사', '넓은 공간', '독립적 공간 제공 가능한 집'],
    similar: ['akita', 'shiba']
  }
}

export default function BreedPersonalityGuidePage() {
  const [selectedBreed, setSelectedBreed] = useState<string>('golden')

  const breed = breedDatabase[selectedBreed]
  const similarBreeds = breed.similar.map(id => breedDatabase[id]).filter(Boolean)

  const getTrainingColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
    }
  }

  const getTrainingText = (level: string) => {
    switch (level) {
      case 'easy': return '쉬움'
      case 'medium': return '보통'
      case 'hard': return '어려움'
    }
  }

  const getSizeText = (size: string) => {
    switch (size) {
      case 'small': return '소형견'
      case 'medium': return '중형견'
      case 'large': return '대형견'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Dog className="w-10 h-10 text-purple-600 mr-3" />
            견종별 성격 가이드
          </h1>
          <p className="text-xl text-gray-600">
            주요 견종을 선택하면 성격, 훈련 난이도, 추천 가정 환경을 안내합니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 견종 선택 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">견종 선택</h2>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              >
                {Object.entries(breedDatabase).map(([id, data]) => (
                  <option key={id} value={id}>{data.name}</option>
                ))}
              </select>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Dog className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">{getSizeText(breed.size)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 견종 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{breed.name}</h2>
              
              {/* 성격 */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Star className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">성격</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {breed.personality.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* 훈련 난이도 */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">훈련 난이도</h3>
                </div>
                <span className={`px-4 py-2 rounded-lg font-medium ${getTrainingColor(breed.training)}`}>
                  {getTrainingText(breed.training)}
                </span>
              </div>

              {/* 추천 가정 환경 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Home className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">추천 가정 환경</h3>
                </div>
                <ul className="space-y-2">
                  {breed.home.map((env, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-green-600">✓</span>
                      <span className="text-gray-700">{env}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 비슷한 견종 */}
            {similarBreeds.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Users className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900">비슷한 견종</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {similarBreeds.map((similar) => (
                    <div 
                      key={similar.name}
                      onClick={() => setSelectedBreed(Object.keys(breedDatabase).find(key => breedDatabase[key].name === similar.name) || selectedBreed)}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 cursor-pointer transition-colors"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">{similar.name}</h4>
                      <p className="text-sm text-gray-600">{getSizeText(similar.size)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

