'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, CheckCircle } from 'lucide-react'

export default function SocializationGuidePage() {
  const [selectedAge, setSelectedAge] = useState<string>('puppy')
  
  const ageGuides = {
    puppy: {
      title: '강아지 (2-4개월)',
      activities: [
        '다양한 사람들과 만나기',
        '다른 강아지들과 놀기',
        '새로운 소리와 환경 경험',
        '자동차, 버스 등 교통수단 경험',
        '다양한 표면에서 걷기 (잔디, 모래, 바닥)'
      ],
      tips: [
        '긍정적인 경험으로 만들어주세요',
        '무리하지 말고 천천히 진행하세요',
        '간식과 칭찬을 활용하세요',
        '무서워하면 강요하지 마세요'
      ]
    },
    young: {
      title: '청견 (4-12개월)',
      activities: [
        '다양한 연령대의 사람들과 교류',
        '다른 동물들과의 만남',
        '공원, 카페 등 새로운 장소 방문',
        '소음이 많은 환경 경험',
        '다양한 상황에서의 훈련'
      ],
      tips: [
        '지속적인 사회화가 필요합니다',
        '새로운 경험을 계속 제공하세요',
                '문제 행동이 나타나면 전문가와 상담하세요',
        '일관성 있는 훈련을 유지하세요'
      ]
    },
    adult: {
      title: '성견 (1세 이상)',
      activities: [
        '정기적인 사회적 상호작용',
        '새로운 환경 탐험',
        '다양한 사람들과의 교류',
        '다른 강아지들과의 놀이',
        '새로운 활동과 경험'
      ],
      tips: [
        '사회화는 평생 지속되어야 합니다',
        '새로운 경험을 계속 제공하세요',
        '스트레스 신호를 주의 깊게 관찰하세요',
        '필요시 전문가의 도움을 받으세요'
      ]
    }
  }

  const socializationChecklist = [
    '다양한 사람들과 만나기',
    '다른 강아지들과 놀기',
    '새로운 소리 경험',
    '다양한 환경 방문',
    '교통수단 이용하기',
    '다양한 표면에서 걷기',
    '다른 동물들과 만나기',
    '소음이 많은 환경 경험',
    '새로운 사람들과의 상호작용',
    '다양한 상황에서의 훈련'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-10 h-10 text-purple-600 mr-3" />
            사회화 가이드
          </h1>
          <p className="text-xl text-gray-600">강아지 사회화 단계별 접근 방법과 훈련 가이드</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">연령별 사회화 가이드</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">연령 선택</label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="puppy">강아지 (2-4개월)</option>
              <option value="young">청견 (4-12개월)</option>
              <option value="adult">성견 (1세 이상)</option>
            </select>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {ageGuides[selectedAge as keyof typeof ageGuides].title}
            </h3>
            
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-3">추천 활동</h4>
              <ul className="space-y-2">
                {ageGuides[selectedAge as keyof typeof ageGuides].activities.map((activity, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">주의사항</h4>
              <ul className="space-y-2">
                {ageGuides[selectedAge as keyof typeof ageGuides].tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-purple-600 font-bold">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">사회화 체크리스트</h2>
          <div className="space-y-3">
            {socializationChecklist.map((item, idx) => (
              <label key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                <span className="text-gray-900">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 사회화 성공 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 사회화는 강아지의 일생에 걸쳐 중요한 과정입니다</li>
            <li>• 긍정적인 경험으로 만들어주는 것이 핵심입니다</li>
            <li>• 강아지의 페이스에 맞춰 천천히 진행하세요</li>
            <li>• 무서워하는 상황에서는 강요하지 마세요</li>
            <li>• 문제가 있다면 전문가와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
