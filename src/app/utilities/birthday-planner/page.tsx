'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, Cake, PartyPopper } from 'lucide-react'

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
      name: '심플 파티',
      decorations: ['풍선', '리본', '간단한 배너'],
      activities: ['간식 타임', '사진 촬영', '간단한 게임']
    },
    colorful: {
      name: '컬러풀 파티',
      decorations: ['컬러풀한 풍선', '무지개 리본', '컬러 배너', '꽃다발'],
      activities: ['컬러 간식', '컬러 게임', '사진 부스', '춤추기']
    },
    elegant: {
      name: '우아한 파티',
      decorations: ['화이트/골드 풍선', '우아한 리본', '고급 배너', '꽃장식'],
      activities: ['고급 간식', '우아한 사진', '음악 감상', '특별한 케이크']
    }
  }

  const partyChecklist = [
    '생일 케이크 준비',
    '간식과 장난감 준비',
    '장식품 준비',
    '사진 촬영 준비',
    '손님 초대',
    '특별한 선물 준비',
    '생일 노래 준비',
    '특별한 활동 계획'
  ]

  const cakeRecipes = [
    {
      name: '강아지용 간단 케이크',
      ingredients: ['닭고기 100g', '당근 1개', '계란 1개', '올리브오일 1큰술'],
      steps: [
        '닭고기를 삶아서 잘게 다지기',
        '당근을 갈아서 넣기',
        '계란과 올리브오일 넣고 섞기',
        '오븐에 180도로 20분 굽기'
      ]
    },
    {
      name: '고구마 케이크',
      ingredients: ['고구마 2개', '닭고기 50g', '계란 1개', '코코넛오일 1큰술'],
      steps: [
        '고구마를 삶아서 으깨기',
        '닭고기를 삶아서 다지기',
        '모든 재료를 섞어서 반죽 만들기',
        '오븐에 170도로 25분 굽기'
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

  const theme = partyThemes[birthday.theme as keyof typeof partyThemes]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Gift className="w-10 h-10 text-pink-600 mr-3" />
            반려견 생일 파티 플래너
          </h1>
          <p className="text-xl text-gray-600">생일 파티 준비물, 케이크 레시피, 게임 아이디어 제공</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">생일 정보 입력</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">강아지 이름</label>
              <input
                type="text"
                value={birthday.name}
                onChange={(e) => setBirthday({...birthday, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">생일 날짜</label>
              <input
                type="date"
                value={birthday.date}
                onChange={(e) => setBirthday({...birthday, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
              <input
                type="number"
                min="1"
                value={birthday.age || ''}
                onChange={(e) => setBirthday({...birthday, age: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">파티 테마</label>
              <select
                value={birthday.theme}
                onChange={(e) => setBirthday({...birthday, theme: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="simple">심플 파티</option>
                <option value="colorful">컬러풀 파티</option>
                <option value="elegant">우아한 파티</option>
              </select>
            </div>
          </div>

          {birthday.name && (
            <div className="bg-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {birthday.name}의 {birthday.age}번째 생일 파티 계획
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">장식 아이템</h4>
                  <ul className="space-y-1">
                    {theme.decorations.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <PartyPopper className="w-4 h-4 text-pink-600 mr-2" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">활동 아이디어</h4>
                  <ul className="space-y-1">
                    {theme.activities.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <Gift className="w-4 h-4 text-pink-600 mr-2" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">파티 준비 체크리스트</h2>
          <div className="space-y-3">
            {partyChecklist.map((item, idx) => (
              <label key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={checklist.includes(item)}
                  onChange={() => toggleChecklist(item)}
                  className="w-5 h-5 text-pink-600 rounded"
                />
                <span className={checklist.includes(item) ? 'line-through text-gray-500' : 'text-gray-900'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">강아지용 케이크 레시피</h2>
          <div className="space-y-6">
            {cakeRecipes.map((recipe, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Cake className="w-6 h-6 text-pink-600" />
                  <h3 className="text-xl font-bold text-gray-900">{recipe.name}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">재료</h4>
                    <ul className="space-y-1">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-gray-700">• {ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">만드는 방법</h4>
                    <ol className="space-y-1">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="text-gray-700">{i + 1}. {step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 생일 파티 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지가 스트레스를 받지 않도록 조용한 환경에서 진행하세요</li>
            <li>• 간식은 적당량만 주고, 과식하지 않도록 주의하세요</li>
            <li>• 사진 촬영 시 플래시 사용을 피하세요</li>
            <li>• 강아지의 성격에 맞는 활동을 선택하세요</li>
            <li>• 생일 케이크는 강아지 전용 재료로 만드세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
