'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Cake, PartyPopper, ArrowLeft, Camera, Music, Star, Check, Heart, ChefHat } from 'lucide-react'

export default function BirthdayPlannerPage() {
  const [birthday, setBirthday] = useState({
    name: '',
    date: '',
    age: 0,
    theme: 'simple'
  })

  const [checklist, setChecklist] = useState<string[]>([])

  const partyThemes = {
    simple: {
      id: 'simple',
      name: '심플 & 코지',
      description: '집에서 즐기는 편안하고 따뜻한 파티',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      icon: Heart,
      decorations: ['파스텔 풍선', '가랜드', '꼬깔모자'],
      activities: ['좋아하는 간식 먹기', '기념 사진', '새 장난감 선물']
    },
    colorful: {
      id: 'colorful',
      name: '알록달록 팝',
      description: '활기차고 즐거운 분위기의 파티',
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      icon: PartyPopper,
      decorations: ['무지개 풍선', '화려한 리본', '파티 커튼', '꽃장식'],
      activities: ['보물찾기(간식)', '친구 초대', '포토존 촬영', '음악과 댄스']
    },
    elegant: {
      id: 'elegant',
      name: '럭셔리 골드',
      description: '우아하고 고급스러운 특별한 날',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: Star,
      decorations: ['골드/화이트 풍선', '실크 리본', '티아라/왕관', '캔들(LED)'],
      activities: ['수제 케이크 시식', '스튜디오 촬영', '스파/마사지', '호캉스']
    }
  }

  const partyChecklist = [
    '생일 케이크 주문/제작',
    '특별한 간식 준비',
    '생일 선물 고르기',
    '파티룸/장소 꾸미기',
    '초대장 보내기 (친구들)',
    '카메라/촬영 준비',
    '생일 노래 연습하기',
    '당일 컨디션 조절'
  ]

  const cakeRecipes = [
    {
      name: '치킨 & 베지 케이크',
      time: '40분',
      difficulty: '쉬움',
      ingredients: ['닭가슴살 100g', '당근 1/2개', '브로콜리 30g', '계란 1개', '쌀가루 2큰술'],
      steps: [
        '닭가슴살을 삶아 잘게 다져주세요.',
        '당근과 브로콜리는 데쳐서 다져줍니다.',
        '볼에 모든 재료와 계란, 쌀가루를 넣고 섞습니다.',
        '틀에 담아 180도 오븐에서 20분간 구워주세요.',
        '충분히 식힌 후 급여해주세요.'
      ]
    },
    {
      name: '고구마 무스 케이크',
      time: '30분',
      difficulty: '보통',
      ingredients: ['고구마 2개', '무염 치즈 1장', '락토프리 우유 2큰술', '딸기(장식용)'],
      steps: [
        '고구마를 쪄서 껍질을 벗기고 으깨주세요.',
        '우유를 넣어 부드러운 농도를 맞춰줍니다.',
        '틀에 고구마 무스를 채우고 냉장고에서 굳혀주세요.',
        '치즈와 과일로 예쁘게 장식하면 완성!',
        '차가운 상태로 급여하면 더 좋아해요.'
      ]
    }
  ]

  const toggleChecklist = (item: string) => {
    setChecklist(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const currentTheme = partyThemes[birthday.theme as keyof typeof partyThemes]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Gift className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">생일 파티 플래너</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            사랑하는 반려견의 특별한 날을 완벽하게 준비해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input & Theme */}
          <div className="lg:col-span-7 space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Cake className="w-5 h-5 mr-2 text-pink-500" />
                기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    value={birthday.name}
                    onChange={(e) => setBirthday({ ...birthday, name: e.target.value })}
                    placeholder="강아지 이름"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                  <input
                    type="number"
                    min="1"
                    value={birthday.age || ''}
                    onChange={(e) => setBirthday({ ...birthday, age: parseInt(e.target.value) || 0 })}
                    placeholder="몇 살이 되나요?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">생일 날짜</label>
                  <input
                    type="date"
                    value={birthday.date}
                    onChange={(e) => setBirthday({ ...birthday, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                파티 테마 선택
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {Object.values(partyThemes).map((theme) => {
                  const Icon = theme.icon
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setBirthday({ ...birthday, theme: theme.id })}
                      className={`flex items-start p-4 rounded-xl border-2 transition-all text-left ${birthday.theme === theme.id
                          ? theme.color
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                    >
                      <div className={`p-2 rounded-full mr-4 ${birthday.theme === theme.id ? 'bg-white/50' : 'bg-gray-100'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{theme.name}</h3>
                        <p className={`text-sm ${birthday.theme === theme.id ? 'opacity-90' : 'text-gray-500'}`}>
                          {theme.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Theme Preview */}
            <div className={`rounded-2xl p-6 md:p-8 border-2 transition-all ${currentTheme.color}`}>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <PartyPopper className="w-6 h-6 mr-2" />
                {birthday.name ? `${birthday.name}의 ` : ''}파티 미리보기
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                  <h4 className="font-bold mb-3 flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    추천 장식
                  </h4>
                  <ul className="space-y-2">
                    {currentTheme.decorations.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5">
                  <h4 className="font-bold mb-3 flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    추천 활동
                  </h4>
                  <ul className="space-y-2">
                    {currentTheme.activities.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checklist & Recipes */}
          <div className="lg:col-span-5 space-y-8">
            {/* Checklist */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  준비 체크리스트
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {checklist.length} / {partyChecklist.length} 완료
                </span>
              </div>

              <div className="space-y-3">
                {partyChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${checklist.includes(item)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${checklist.includes(item)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 bg-white'
                      }`}>
                      {checklist.includes(item) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checklist.includes(item)}
                      onChange={() => toggleChecklist(item)}
                    />
                    <span className={`text-sm font-medium ${checklist.includes(item) ? 'text-green-800 line-through opacity-70' : 'text-gray-700'
                      }`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(checklist.length / partyChecklist.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Recipes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-orange-500" />
                추천 케이크 레시피
              </h2>
              <div className="space-y-6">
                {cakeRecipes.map((recipe, idx) => (
                  <div key={idx} className="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{recipe.name}</h3>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-white rounded-md text-gray-600 border border-orange-100">
                          ⏱ {recipe.time}
                        </span>
                        <span className="px-2 py-1 bg-white rounded-md text-gray-600 border border-orange-100">
                          💪 {recipe.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-orange-700 mb-1">재료</p>
                      <p className="text-sm text-gray-600">{recipe.ingredients.join(', ')}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-orange-700 mb-1">만드는 법</p>
                      <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                        {recipe.steps.slice(0, 3).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
