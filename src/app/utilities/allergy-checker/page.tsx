'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, ArrowLeft, Info, ShieldAlert, Activity } from 'lucide-react'

export default function AllergyCheckerPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])

  const symptomList = [
    { id: 'itch', name: '가려움증', desc: '특정 부위를 계속 긁거나 핥음' },
    { id: 'rash', name: '피부 발진', desc: '붉은 반점이나 염증 발생' },
    { id: 'hairloss', name: '털 빠짐', desc: '비정상적인 탈모나 원형 탈모' },
    { id: 'licking', name: '과도한 핥기', desc: '발이나 배 등을 집요하게 핥음' },
    { id: 'vomit', name: '구토', desc: '식사 후 또는 공복 시 구토' },
    { id: 'diarrhea', name: '설사', desc: '묽은 변이나 잦은 배변' },
    { id: 'breath', name: '호흡곤란', desc: '쌕쌕거림이나 거친 숨소리' },
    { id: 'tears', name: '눈물/눈꼽', desc: '과도한 눈물이나 끈적한 눈꼽' },
    { id: 'sneeze', name: '재채기', desc: '연속적인 재채기나 콧물' }
  ]

  const allergenList = [
    { id: 'chicken', name: '닭고기', category: '음식' },
    { id: 'beef', name: '소고기', category: '음식' },
    { id: 'pork', name: '돼지고기', category: '음식' },
    { id: 'fish', name: '생선', category: '음식' },
    { id: 'egg', name: '계란', category: '음식' },
    { id: 'milk', name: '유제품', category: '음식' },
    { id: 'wheat', name: '밀/글루텐', category: '음식' },
    { id: 'corn', name: '옥수수', category: '음식' },
    { id: 'soy', name: '대두(콩)', category: '음식' },
    { id: 'pollen', name: '꽃가루', category: '환경' },
    { id: 'dust', name: '집먼지 진드기', category: '환경' },
    { id: 'mold', name: '곰팡이', category: '환경' }
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
    if (symptoms.length >= 5) return { level: '심각', text: '즉시 수의사 상담 필요', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
    if (symptoms.length >= 3) return { level: '주의', text: '지속적인 관찰 필요', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
    if (symptoms.length >= 1) return { level: '경미', text: '일시적일 수 있음', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    return { level: '정상', text: '현재 증상 없음', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' }
  }

  const risk = getRiskLevel()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">알레르기 체크리스트</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 알레르기 증상을 기록하고 의심되는 원인을 체크해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Symptoms Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-500" />
                현재 나타나는 증상
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {symptomList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleSymptom(item.name)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${symptoms.includes(item.name)
                        ? 'border-orange-500 bg-orange-50/50'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={`font-bold ${symptoms.includes(item.name) ? 'text-orange-900' : 'text-gray-900'}`}>
                        {item.name}
                      </span>
                      {symptoms.includes(item.name) && <CheckCircle className="w-5 h-5 text-orange-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergens Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                의심되는 원인 (알레르기원)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allergenList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleAllergen(item.name)}
                    className={`cursor-pointer px-4 py-3 rounded-xl border-2 text-center transition-all ${allergens.includes(item.name)
                        ? 'border-orange-500 bg-orange-50/50 text-orange-900 font-bold'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <span className="block text-xs text-gray-400 mb-1">{item.category}</span>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Result */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Risk Level Card */}
              <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${risk.border}`}>
                <div className={`p-6 text-center ${risk.bg}`}>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">현재 위험도</span>
                  <div className={`text-4xl font-black my-3 ${risk.color}`}>
                    {risk.level}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{risk.text}</p>
                </div>

                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>체크된 증상</span>
                    <span className="font-bold">{symptoms.length}개</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>의심 원인</span>
                    <span className="font-bold">{allergens.length}개</span>
                  </div>

                  {symptoms.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">기록된 증상</h4>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.map(s => (
                          <span key={s} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-400" />
                  관리 팁
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    식이 알레르기는 가수분해 사료로 교체해보세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    환경 알레르기는 잦은 환기와 청소가 중요합니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    증상이 심하면 반드시 알레르기 검사를 받아보세요.
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
