'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Calculator } from 'lucide-react'

export default function BreedCompatibilityCalculatorPage() {
  const [lifestyle, setLifestyle] = useState<string>('moderate')
  const [livingSpace, setLivingSpace] = useState<string>('medium')
  const [familyType, setFamilyType] = useState<string>('adult')
  const [experience, setExperience] = useState<string>('beginner')
  const [result, setResult] = useState<{
    compatibility: number
    recommendedBreeds: Array<{ name: string; reason: string }>
    recommendation: string
  } | null>(null)

  const calculate = () => {
    let compatibility = 70 // 기본값
    const recommendedBreeds: Array<{ name: string; reason: string }> = []

    // 라이프스타일별 추천 견종
    if (lifestyle === 'active' && livingSpace === 'large' && experience === 'experienced') {
      compatibility = 90
      recommendedBreeds.push(
        { name: '보더콜리', reason: '높은 활동량과 훈련 능력' },
        { name: '골든 리트리버', reason: '친화적이고 활동적인 성격' },
        { name: '래브라도 리트리버', reason: '가족 친화적이고 활발함' }
      )
    } else if (lifestyle === 'moderate' && livingSpace === 'medium') {
      compatibility = 80
      recommendedBreeds.push(
        { name: '비글', reason: '적당한 크기와 활동량' },
        { name: '코커 스패니얼', reason: '중형견으로 적당한 활동량' },
        { name: '시바견', reason: '독립적이고 적당한 크기' }
      )
    } else if (lifestyle === 'low' && livingSpace === 'small') {
      compatibility = 85
      recommendedBreeds.push(
        { name: '푸들', reason: '소형견으로 실내 생활 적합' },
        { name: '치와와', reason: '매우 작고 저활동' },
        { name: '요크셔 테리어', reason: '소형견으로 실내 생활 적합' }
      )
    } else if (familyType === 'children') {
      compatibility = 75
      recommendedBreeds.push(
        { name: '골든 리트리버', reason: '아이들과 매우 친화적' },
        { name: '래브라도 리트리버', reason: '가족 친화적' },
        { name: '비글', reason: '활발하고 친화적' }
      )
    } else {
      compatibility = 70
      recommendedBreeds.push(
        { name: '믹스견', reason: '개별 특성에 맞는 선택' },
        { name: '보통 활동량 견종', reason: '균형잡힌 선택' }
      )
    }

    let recommendation = ''
    if (compatibility >= 85) {
      recommendation = '매우 적합한 조건입니다. 추천 견종을 고려해보세요.'
    } else if (compatibility >= 75) {
      recommendation = '적합한 조건입니다. 추천 견종을 검토해보세요.'
    } else {
      recommendation = '조건을 조정하면 더 적합한 견종을 찾을 수 있습니다.'
    }

    setResult({
      compatibility,
      recommendedBreeds,
      recommendation
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-pink-600 mr-3" />
            견종 적합도 계산기
          </h1>
          <p className="text-xl text-gray-600">
            생활 방식에 맞는 견종을 추천합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  라이프스타일
                </label>
                <select
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="low">저활동 (실내 위주)</option>
                  <option value="moderate">보통 활동</option>
                  <option value="active">고활동 (운동 좋아함)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  거주 공간
                </label>
                <select
                  value={livingSpace}
                  onChange={(e) => setLivingSpace(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="small">작은 공간 (아파트)</option>
                  <option value="medium">중간 공간</option>
                  <option value="large">넓은 공간 (주택)</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가족 구성
                </label>
                <select
                  value={familyType}
                  onChange={(e) => setFamilyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="adult">성인만</option>
                  <option value="children">아이 있음</option>
                  <option value="senior">노인 있음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  반려견 경험
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="beginner">초보자</option>
                  <option value="moderate">보통</option>
                  <option value="experienced">경험자</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium text-lg"
            >
              추천받기
            </button>

            {result && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">적합도 점수</p>
                  <p className="text-4xl font-bold text-pink-700">{result.compatibility}%</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-pink-600 h-3 rounded-full"
                      style={{ width: `${result.compatibility}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">추천 견종</p>
                  <div className="space-y-3">
                    {result.recommendedBreeds.map((breed, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <p className="font-semibold text-gray-900">{breed.name}</p>
                        <p className="text-sm text-gray-600">{breed.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">권장사항</p>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 견종 선택 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 라이프스타일과 거주 공간에 맞는 견종을 선택하세요</li>
            <li>• 가족 구성원을 고려하여 견종을 선택하세요</li>
            <li>• 반려견 경험 수준에 맞는 견종을 선택하세요</li>
            <li>• 견종별 특성과 요구사항을 충분히 조사하세요</li>
            <li>• 실제로 만나보고 성격을 확인하세요</li>
            <li>• 장기적인 책임을 고려하여 선택하세요</li>
            <li>• 전문가나 브리더와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

