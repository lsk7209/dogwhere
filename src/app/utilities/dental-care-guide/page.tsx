'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smile, CheckCircle } from 'lucide-react'

export default function DentalCareGuidePage() {
  const [selectedAge, setSelectedAge] = useState<string>('puppy')
  
  const ageGuides = {
    puppy: {
      title: '강아지 (2-12개월)',
      tips: [
        '유치가 빠지기 시작하는 시기입니다',
        '부드러운 강아지 전용 칫솔 사용',
        '양치를 게임처럼 재미있게 접근',
        '일주일에 2-3회 양치 시작'
      ]
    },
    adult: {
      title: '성견 (1-7세)',
      tips: [
        '매일 양치가 이상적입니다',
        '강아지 전용 치약 사용 (인간용 금지)',
        '치석 제거를 위한 정기적인 스케일링',
        '하드 트리트로 치아 건강 도움'
      ]
    },
    senior: {
      title: '노령견 (7세 이상)',
      tips: [
        '잇몸 질환에 특히 주의',
        '부드러운 음식으로 전환 고려',
        '정기적인 구강 검진 필수',
        '구강 통증 시 즉시 병원 방문'
      ]
    }
  }

  const careChecklist = [
    '매일 양치하기',
    '정기적인 구강 검사',
    '하드 트리트 제공',
    '구강 냄새 체크',
    '잇몸 상태 확인'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Smile className="w-10 h-10 text-blue-600 mr-3" />
            구강 건강 가이드
          </h1>
          <p className="text-xl text-gray-600">치아 관리 방법, 양치 주기, 구강 질환 예방 가이드</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">연령별 구강 관리</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">연령 선택</label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="puppy">강아지 (2-12개월)</option>
              <option value="adult">성견 (1-7세)</option>
              <option value="senior">노령견 (7세 이상)</option>
            </select>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{ageGuides[selectedAge as keyof typeof ageGuides].title}</h3>
            <ul className="space-y-2">
              {ageGuides[selectedAge as keyof typeof ageGuides].tips.map((tip, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">구강 관리 체크리스트</h2>
          <div className="space-y-3">
            {careChecklist.map((item, idx) => (
              <label key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                <span className="text-gray-900">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 구강 건강 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지 전용 치약을 사용하세요 (인간용은 독성 위험)</li>
            <li>• 양치를 게임처럼 재미있게 만들어보세요</li>
            <li>• 정기적인 구강 검진으로 질환을 조기에 발견하세요</li>
            <li>• 구강 냄새가 심하거나 잇몸이 붉으면 병원을 방문하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}