'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Map, CheckCircle } from 'lucide-react'

export default function FirstVisitGuidePage() {
  const [selectedPlace, setSelectedPlace] = useState<string>('hospital')
  const [checklist, setChecklist] = useState<string[]>([])

  const placeGuides = {
    hospital: {
      title: '동물병원 첫 방문',
      preparation: [
        '예방접종 기록서 준비',
        '건강 상태 메모',
        '질문할 내용 정리',
        '강아지 기본 정보 (나이, 견종, 체중)',
        '이전 병원 기록 (있다면)'
      ],
      items: [
        '목줄과 가슴줄',
        '간식과 장난감',
        '담요나 매트',
        '물과 그릇',
        '배변용품'
      ],
      tips: [
        '예약 시간보다 10분 일찍 도착',
        '강아지가 편안해할 수 있는 환경 조성',
        '의사와의 소통을 원활하게',
        '질문을 미리 정리해두기'
      ]
    },
    cafe: {
      title: '반려견 카페 첫 방문',
      preparation: [
        '예방접종 완료 확인',
        '예약 및 이용 규칙 확인',
        '강아지 성격 파악',
        '필요한 준비물 체크',
        '이용 시간 계획'
      ],
      items: [
        '목줄과 가슴줄',
        '간식과 장난감',
        '물과 그릇',
        '수건이나 타월',
        '배변용품'
      ],
      tips: [
        '다른 강아지들과의 상호작용 주의',
        '카페 규칙을 미리 숙지',
        '강아지 상태를 지속적으로 관찰',
        '무리하지 말고 천천히 적응시키기'
      ]
    },
    park: {
      title: '공원 첫 방문',
      preparation: [
        '예방접종 완료 확인',
        '공원 규칙 및 이용 가능 시간 확인',
        '날씨 확인',
        '필요한 준비물 체크',
        '안전한 산책로 파악'
      ],
      items: [
        '목줄과 가슴줄',
        '간식과 장난감',
        '물과 그릇',
        '배변용품',
        '응급처치용품'
      ],
      tips: [
        '다른 강아지들과의 거리 유지',
        '공원 규칙을 준수',
        '강아지 상태를 지속적으로 관찰',
        '안전한 구역에서부터 시작'
      ]
    }
  }

  const generalChecklist = [
    '예방접종 완료',
    '목줄과 가슴줄',
    '간식과 장난감',
    '물과 그릇',
    '배변용품',
    '응급처치용품',
    '강아지 기본 정보',
    '연락처 정보'
  ]

  const toggleChecklist = (item: string) => {
    setChecklist(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const guide = placeGuides[selectedPlace as keyof typeof placeGuides]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Map className="w-10 h-10 text-blue-600 mr-3" />
            첫 방문 가이드
          </h1>
          <p className="text-xl text-gray-600">새로운 장소(병원, 카페, 공원) 첫 방문 시 준비사항 체크리스트</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">장소별 첫 방문 가이드</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">방문 장소</label>
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="hospital">동물병원</option>
              <option value="cafe">반려견 카페</option>
              <option value="park">공원</option>
            </select>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{guide.title}</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">사전 준비</h4>
                <ul className="space-y-2">
                  {guide.preparation.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3">필요한 준비물</h4>
                <ul className="space-y-2">
                  {guide.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-gray-900 mb-3">방문 팁</h4>
              <ul className="space-y-2">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-blue-600 font-bold">💡</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">준비물 체크리스트</h2>
          <div className="space-y-3">
            {generalChecklist.map((item, idx) => (
              <label key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={checklist.includes(item)}
                  onChange={() => toggleChecklist(item)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className={checklist.includes(item) ? 'line-through text-gray-500' : 'text-gray-900'}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 첫 방문 성공 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지가 편안해할 수 있는 환경을 만들어주세요</li>
            <li>• 무리하지 말고 천천히 적응시켜주세요</li>
            <li>• 긍정적인 경험으로 만들어주는 것이 중요합니다</li>
            <li>• 문제가 있다면 즉시 중단하고 전문가와 상담하세요</li>
            <li>• 규칙과 매너를 미리 숙지하고 준수하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
