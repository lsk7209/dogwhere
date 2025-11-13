'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Calculator } from 'lucide-react'

export default function PetInsuranceCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [age, setAge] = useState<string>('adult')
  const [coverageType, setCoverageType] = useState<string>('basic')
  const [result, setResult] = useState<{
    monthlyPremium: number
    yearlyPremium: number
    coverage: string
    benefits: string[]
  } | null>(null)

  const calculate = () => {
    let basePremium = 20000 // 기본값 (월간)
    
    // 견종 크기별 조정
    if (breedSize === 'small') {
      basePremium = 15000
    } else if (breedSize === 'large') {
      basePremium = 30000
    }

    // 연령별 조정
    if (age === 'puppy') {
      basePremium = Math.round(basePremium * 0.8) // 강아지는 조금 저렴
    } else if (age === 'senior') {
      basePremium = Math.round(basePremium * 1.5) // 노령견은 더 비쌈
    }

    // 보장 종류별 조정
    let coverage = ''
    const benefits: string[] = []
    
    if (coverageType === 'basic') {
      basePremium = basePremium
      coverage = '기본 보장'
      benefits.push('사고 치료비', '응급실 비용', '입원비')
    } else if (coverageType === 'standard') {
      basePremium = Math.round(basePremium * 1.5)
      coverage = '표준 보장'
      benefits.push('사고 치료비', '응급실 비용', '입원비', '수술비', '검진비')
    } else if (coverageType === 'premium') {
      basePremium = Math.round(basePremium * 2.0)
      coverage = '프리미엄 보장'
      benefits.push('사고 치료비', '응급실 비용', '입원비', '수술비', '검진비', '만성 질환 치료비', '치과 치료비')
    }

    const monthlyPremium = basePremium
    const yearlyPremium = monthlyPremium * 12

    setResult({
      monthlyPremium,
      yearlyPremium,
      coverage,
      benefits
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
            <Shield className="w-10 h-10 text-blue-600 mr-3" />
            보험료 계산기
          </h1>
          <p className="text-xl text-gray-600">
            반려동물 보험료를 계산합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  견종 크기
                </label>
                <select
                  value={breedSize}
                  onChange={(e) => setBreedSize(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="small">소형견</option>
                  <option value="medium">중형견</option>
                  <option value="large">대형견</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연령
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="puppy">강아지 (1세 미만)</option>
                  <option value="adult">성견 (1-7세)</option>
                  <option value="senior">노령견 (7세 이상)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보장 종류
              </label>
              <select
                value={coverageType}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="basic">기본 보장</option>
                <option value="standard">표준 보장</option>
                <option value="premium">프리미엄 보장</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              계산하기
            </button>

            {result && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">월간 보험료</p>
                    <p className="text-3xl font-bold text-blue-700">{result.monthlyPremium.toLocaleString()}원</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">연간 보험료</p>
                    <p className="text-3xl font-bold text-blue-700">{result.yearlyPremium.toLocaleString()}원</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">보장 내용</p>
                  <p className="text-lg font-bold text-blue-700 mb-3">{result.coverage}</p>
                  <div className="space-y-2">
                    {result.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-600">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📌 보험 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 반려동물 보험은 예상치 못한 의료비를 대비하는 좋은 방법입니다</li>
            <li>• 강아지일 때 가입하면 보험료가 저렴합니다</li>
            <li>• 노령견은 보험료가 높지만 만성 질환 대비에 중요합니다</li>
            <li>• 보험 가입 전 기존 질환 여부를 확인하세요</li>
            <li>• 보장 범위와 자기부담금을 확인하세요</li>
            <li>• 여러 보험사 상품을 비교하여 선택하세요</li>
            <li>• 보험 가입 후에도 정기 검진과 예방접종은 계속 받으세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

