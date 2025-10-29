'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AllergyCheckerPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])

  const symptomList = [
    '가려움증', '발진', '털 빠짐', '과도한 핥기', '구토', '설사', '호흡곤란', '눈물', '재채기'
  ]

  const allergenList = [
    '닭고기', '소고기', '돼지고기', '생선', '계란', '우유', '밀', '옥수수', '콩', '꽃가루', '진드기', '곰팡이'
  ]

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const toggleAllergen = (allergen: string) => {
    setAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    )
  }

  const getRiskLevel = () => {
    if (symptoms.length >= 5) return { level: 'high', text: '높음', color: 'text-red-600' }
    if (symptoms.length >= 3) return { level: 'medium', text: '보통', color: 'text-yellow-600' }
    if (symptoms.length >= 1) return { level: 'low', text: '낮음', color: 'text-blue-600' }
    return { level: 'none', text: '없음', color: 'text-green-600' }
  }

  const risk = getRiskLevel()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-10 h-10 text-orange-600 mr-3" />
            알레르기 체크리스트
          </h1>
          <p className="text-xl text-gray-600">음식, 환경 알레르기 증상 체크 및 피해야 할 항목 관리</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">증상 체크</h2>
            <div className="space-y-2">
              {symptomList.map((symptom) => (
                <label key={symptom} className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className={symptoms.includes(symptom) ? 'line-through text-gray-500' : 'text-gray-900'}>
                    {symptom}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">알레르기 원인</h2>
            <div className="space-y-2">
              {allergenList.map((allergen) => (
                <label key={allergen} className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={allergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    className="w-5 h-5 text-orange-600 rounded"
                  />
                  <span className={allergens.includes(allergen) ? 'line-through text-gray-500' : 'text-gray-900'}>
                    {allergen}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">알레르기 위험도</h2>
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${risk.color}`}>
              {risk.text}
            </div>
            <p className="text-gray-600 mb-4">
              선택된 증상: {symptoms.length}개 | 알레르기 원인: {allergens.length}개
            </p>
            {symptoms.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">선택된 증상</h3>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <span key={symptom} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 알레르기 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 증상이 지속되면 수의사와 상담하세요</li>
            <li>• 알레르기 원인을 피하는 것이 가장 중요합니다</li>
            <li>• 새로운 사료나 간식을 도입할 때는 소량부터 시작하세요</li>
            <li>• 환경 알레르기의 경우 정기적인 청소가 필요합니다</li>
            <li>• 심한 알레르기 반응 시 즉시 병원을 방문하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
