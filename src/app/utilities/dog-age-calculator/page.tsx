'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Calendar, Dog, Share2, Copy, Check } from 'lucide-react'
import Link from 'next/link'

// 견종별 환산 계수
const breedMultipliers: Record<string, number> = {
  'small': 7,    // 소형견 (푸들, 치와와, 요크셔테리어 등)
  'medium': 6.5, // 중형견 (비글, 코커스패니얼, 샤페이 등)
  'large': 6     // 대형견 (골든리트리버, 라布拉도르, 허스키 등)
}

export default function DogAgeCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [dogAge, setDogAge] = useState<number>(0)
  const [humanAge, setHumanAge] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const calculateHumanAge = () => {
    if (dogAge <= 0) {
      setHumanAge(0)
      return
    }
    
    const multiplier = breedMultipliers[breedSize] || 7
    const calculatedAge = Math.round(dogAge * multiplier * 10) / 10
    setHumanAge(calculatedAge)
  }

  const handleDogAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseFloat(e.target.value) || 0
    setDogAge(age)
    calculateHumanAge()
  }

  const handleBreedSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBreedSize(e.target.value)
    calculateHumanAge()
  }

  const shareResult = () => {
    if (humanAge === 0) return
    
    const text = `우리 강아지(${dogAge}살, ${breedSize === 'small' ? '소형견' : breedSize === 'medium' ? '중형견' : '대형견'})는 사람 나이로 약 ${humanAge}세입니다! 🐕`
    
    if (navigator.share) {
      navigator.share({
        title: '반려견 나이 계산 결과',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/utilities"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-10 h-10 text-blue-600 mr-3" />
            반려견 나이 계산기
          </h1>
          <p className="text-xl text-gray-600">
            강아지의 나이와 견종을 입력하면 사람 나이로 환산해드립니다
          </p>
        </div>

        {/* 계산기 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 크기
                </label>
                <select
                  value={breedSize}
                  onChange={handleBreedSizeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">소형견 (푸들, 치와와, 요크셔테리어 등)</option>
                  <option value="medium">중형견 (비글, 코커스패니얼, 샤페이 등)</option>
                  <option value="large">대형견 (골든리트리버, 라布拉도르, 허스키 등)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  강아지 나이 (살)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={dogAge || ''}
                  onChange={handleDogAgeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="예: 3"
                />
              </div>
            </div>

            {/* 결과 영역 */}
            <div className="flex flex-col justify-center">
              {humanAge > 0 ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="text-center">
                    <Dog className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">사람 나이로 환산하면</p>
                    <p className="text-5xl font-bold text-blue-700 mb-2">{humanAge}세</p>
                    <p className="text-sm text-gray-500">
                      {breedSize === 'small' ? '소형견' : breedSize === 'medium' ? '중형견' : '대형견'} 기준
                    </p>
                    
                    <button
                      onClick={shareResult}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>복사됨!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>결과 공유하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">강아지 나이를 입력해주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 계산 방법</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>소형견:</strong> 강아지 나이 × 7배 (예: 3살 → 약 21세)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>중형견:</strong> 강아지 나이 × 6.5배 (예: 3살 → 약 19.5세)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>대형견:</strong> 강아지 나이 × 6배 (예: 3살 → 약 18세)</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            * 이 계산은 일반적인 기준이며, 개별 강아지의 건강 상태와 견종에 따라 차이가 있을 수 있습니다.
          </p>
        </div>

        {/* 견종별 성장 특징 */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-2">소형견</h3>
            <p className="text-sm text-gray-600">
              작은 크기로 인해 성장이 빠르고 노화도 빨라지는 경향이 있습니다.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-2">중형견</h3>
            <p className="text-sm text-gray-600">
              균형잡힌 성장 속도를 보이며 소형견보다 노화가 느립니다.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-900 mb-2">대형견</h3>
            <p className="text-sm text-gray-600">
              성장이 오래 걸리지만 일반적으로 더 오래 살 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

