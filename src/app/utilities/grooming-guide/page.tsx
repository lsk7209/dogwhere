'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Droplet, Brush, Sparkles, ArrowLeft, Dog, Check, AlertCircle, Info } from 'lucide-react'

const groomingData: Record<string, {
  name: string
  coatType: string
  bathFrequency: string
  brushingFrequency: string
  tips: string[]
  specialCare: string[]
  description: string
}> = {
  'poodle': {
    name: '푸들',
    coatType: '곱슬털 (Single Coat)',
    bathFrequency: '2-4주마다',
    brushingFrequency: '매일',
    description: '털이 계속 자라며 잘 빠지지 않지만, 엉키기 쉬워 세심한 관리가 필요합니다.',
    tips: ['슬리커 브러쉬로 속털까지 빗어주세요.', '귀 속 털을 정기적으로 정리해야 합니다.', '미용실 방문 주기는 4-6주가 적당합니다.'],
    specialCare: ['털 엉킴(매트) 주의', '귀 염증 예방', '눈물 자국 관리']
  },
  'golden': {
    name: '골든리트리버',
    coatType: '이중모 (Double Coat)',
    bathFrequency: '4-6주마다',
    brushingFrequency: '주 3-4회',
    description: '풍성한 황금빛 털이 매력적이지만, 털 빠짐이 심하고 방수성 속털을 가집니다.',
    tips: ['핀 브러쉬와 코트킹을 사용하세요.', '털갈이 시기에는 죽은 털 제거가 필수입니다.', '목욕 후 속털까지 완벽히 말려주세요.'],
    specialCare: ['피부병 주의 (습기)', '발바닥 털 정리', '꼬리 털 엉킴 방지']
  },
  'shiba': {
    name: '시바견',
    coatType: '단단한 이중모',
    bathFrequency: '2-3개월마다',
    brushingFrequency: '주 2회',
    description: '깔끔한 성격으로 스스로 털 관리를 잘하지만, 털갈이 시기에는 엄청난 양이 빠집니다.',
    tips: ['실리콘 브러쉬나 죽은 털 제거기를 사용하세요.', '피부가 예민할 수 있어 저자극 샴푸를 추천합니다.', '스트레스를 받지 않게 짧게 자주 빗어주세요.'],
    specialCare: ['털갈이 폭탄 대비', '피부 건조 주의', '발톱 관리']
  },
  'chihuahua': {
    name: '치와와',
    coatType: '단모/장모',
    bathFrequency: '3-4주마다',
    brushingFrequency: '주 1-2회',
    description: '작은 체구라 관리가 쉽지만, 추위에 약하고 피부가 민감할 수 있습니다.',
    tips: ['부드러운 천연모 브러쉬를 사용하세요.', '목욕 후 체온 유지에 신경 써주세요.', '눈 주변을 매일 닦아주세요.'],
    specialCare: ['체온 유지', '눈물 관리', '두개골(천문) 주의']
  },
  'beagle': {
    name: '비글',
    coatType: '짧은 단모',
    bathFrequency: '4-6주마다',
    brushingFrequency: '주 1-2회',
    description: '방수성 털을 가지고 있어 때가 잘 타지 않지만, 특유의 체취가 있을 수 있습니다.',
    tips: ['고무 브러쉬로 마사지하듯 빗어주세요.', '귀가 덮여있어 통풍과 청소가 중요합니다.', '산책 후 발 관리를 꼼꼼히 해주세요.'],
    specialCare: ['귀 염증(외이염) 주의', '비만 관리', '발톱 마모 확인']
  },
  'husky': {
    name: '시베리안 허스키',
    coatType: '두꺼운 이중모',
    bathFrequency: '2-3개월마다',
    brushingFrequency: '주 3-4회',
    description: '추위에 강한 두꺼운 털을 가졌으며, 털갈이 시기에는 털 뭉치가 빠집니다.',
    tips: ['언더코트 레이크로 죽은 털을 긁어내세요.', '여름철 체온 조절을 위해 빗질이 중요합니다.', '털을 빡빡 미는 것은 피해주세요 (체온 조절 불가).'],
    specialCare: ['여름철 열사병 주의', '피부 통풍', '운동 후 발바닥 관리']
  }
}

export default function GroomingGuidePage() {
  const [selectedBreed, setSelectedBreed] = useState<string>('poodle')
  const breed = groomingData[selectedBreed]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Scissors className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">견종별 털 관리 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 강아지의 털 특성에 맞는 올바른 관리법을 알아보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar: Breed Selection */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-8">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center px-2">
                <Dog className="w-4 h-4 mr-2 text-purple-500" />
                견종 선택
              </h2>
              <div className="space-y-1">
                {Object.keys(groomingData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBreed(key)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm ${selectedBreed === key
                        ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {groomingData[key].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{breed.name}</h2>
                  <p className="text-gray-600">{breed.description}</p>
                </div>
                <div className="px-4 py-2 bg-purple-50 rounded-lg text-purple-700 text-sm font-bold whitespace-nowrap self-start">
                  {breed.coatType}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">목욕 주기</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 pl-1">{breed.bathFrequency}</p>
                </div>

                <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg text-pink-600 shadow-sm">
                      <Brush className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">빗질 주기</span>
                  </div>
                  <p className="text-2xl font-bold text-pink-700 pl-1">{breed.brushingFrequency}</p>
                </div>
              </div>
            </div>

            {/* Tips & Care */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  관리 꿀팁
                </h3>
                <ul className="space-y-4">
                  {breed.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <Check className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span className="text-gray-600 text-sm leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  특별 주의사항
                </h3>
                <ul className="space-y-4">
                  {breed.specialCare.map((care, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <Info className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-gray-600 text-sm leading-relaxed">{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* General Guide */}
            <div className="bg-purple-900 rounded-2xl p-6 md:p-8 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-purple-300" />
                알아두세요
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-purple-100 text-sm">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    빗질은 혈액순환을 돕고 유대감을 높여줍니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    목욕 전 빗질로 엉킨 털을 풀어주는 것이 좋습니다.
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    사람용 샴푸는 강아지 피부에 자극적이니 피해주세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-400">•</span>
                    드라이기 사용 시 뜨거운 바람은 화상 위험이 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
