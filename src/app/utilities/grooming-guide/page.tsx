'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Droplet, Brush, Sparkles } from 'lucide-react'

const groomingData: Record<string, {
  name: string
  coatType: string
  bathFrequency: string
  brushingFrequency: string
  tips: string[]
  specialCare: string[]
}> = {
  'poodle': {
    name: '푸들',
    coatType: '곱슬털',
    bathFrequency: '2-4주마다',
    brushingFrequency: '매일',
    tips: ['곱슬털은 매일 빗질 필수', '털이 길어지면 매트 현상 발생', '정기적인 커트 필요'],
    specialCare: ['전문적인 그루밍 필요', '털이 빠지지 않음']
  },
  'golden': {
    name: '골든리트리버',
    coatType: '이중모',
    bathFrequency: '1-2개월마다',
    brushingFrequency: '주 2-3회',
    tips: ['계절별 털갈이 관리 중요', '속털 관리 필수', '물을 좋아하지만 자주 목욕 금지'],
    specialCare: ['털갈이 시기 (봄/가을) 집중 관리', '귀와 발가락 사이털 정기 정리']
  },
  'shiba': {
    name: '시바견',
    coatType: '단단한 이중모',
    bathFrequency: '2-3개월마다',
    brushingFrequency: '주 2회',
    tips: ['털갈이 시기 (봄/가을) 집중 관리', '과도한 목욕은 피부 건조 유발', '자기 정리 능력이 뛰어남'],
    specialCare: ['계절별 집중 털갈이 관리', '목욕 후 완전 건조 필수']
  },
  'chihuahua': {
    name: '치와와',
    coatType: '매끄러운 단모 또는 장모',
    bathFrequency: '3-4주마다',
    brushingFrequency: '장모: 주 2-3회, 단모: 주 1회',
    tips: ['작은 크기에 맞는 소형 빗 사용', '추위에 민감하므로 빠른 건조', '작은 크기에 맞는 그루밍 도구 필요'],
    specialCare: ['사이즈에 맞는 전용 도구 사용', '온도 관리 중요']
  },
  'beagle': {
    name: '비글',
    coatType: '짧은 단모',
    bathFrequency: '1-2개월마다',
    brushingFrequency: '주 1-2회',
    tips: ['단모라서 관리가 쉬움', '털빠짐이 있지만 적당한 수준', '목욕 후 완전 건조'],
    specialCare: ['귀 관리 중요 (드랍 이어)', '발가락 사이털 정리']
  },
  'husky': {
    name: '시베리안 허스키',
    coatType: '두꺼운 이중모',
    bathFrequency: '2-3개월마다',
    brushingFrequency: '주 3-4회',
    tips: ['털갈이 시기 집중 관리 (매우 많음)', '과도한 목욕 금지', '자기 정리 능력 뛰어남'],
    specialCare: ['연중 털갈이 관리', '서늘한 환경 선호']
  }
}

export default function GroomingGuidePage() {
  const [selectedBreed, setSelectedBreed] = useState<string>('golden')

  const breed = groomingData[selectedBreed]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Scissors className="w-10 h-10 text-purple-600 mr-3" />
            털 관리 가이드
          </h1>
          <p className="text-xl text-gray-600">
            견종별 털 관리 방법, 목욕 주기, 빗질 가이드를 제공합니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">견종 선택</h2>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {Object.keys(groomingData).map((key) => (
                  <option key={key} value={key}>{groomingData[key].name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{breed.name} 털 관리 가이드</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Droplet className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">목욕 주기</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{breed.bathFrequency}</p>
                  <p className="text-sm text-gray-600 mt-2">털 종류: {breed.coatType}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Brush className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">빗질 주기</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{breed.brushingFrequency}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-xl font-bold text-gray-900">관리 팁</h3>
                </div>
                <ul className="space-y-2">
                  {breed.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-purple-600">✓</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Scissors className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">특별 관리 사항</h3>
                </div>
                <ul className="space-y-2">
                  {breed.specialCare.map((care, idx) => (
                    <li key={idx} className="flex items-start bg-yellow-50 p-3 rounded-lg">
                      <span className="mr-2 text-yellow-600 font-bold">!</span>
                      <span className="text-gray-700">{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 일반적인 털 관리 원칙</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 정기적인 빗질은 매트 현상을 예방하고 피부 건강을 유지합니다</li>
            <li>• 과도한 목욕은 피부의 자연 오일을 제거해 건조를 유발할 수 있습니다</li>
            <li>• 목욕 후에는 완전히 건조시켜 피부 질환을 예방하세요</li>
            <li>• 견종에 맞는 전용 그루밍 도구를 사용하는 것이 좋습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

