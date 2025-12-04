'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pill, Sun, Zap, Bone, Heart, Sparkles, ArrowLeft, Scale, Info, Apple } from 'lucide-react'

interface Supplement {
  id: string
  name: string
  dosage: string
  natural: string
  benefit: string
  icon: any
}

export default function VitaminCalculatorPage() {
  const [weight, setWeight] = useState<number>(5)
  const [age, setAge] = useState<number>(3)
  const [concern, setConcern] = useState<'general' | 'joint' | 'skin' | 'energy'>('general')

  const getSupplements = (): Supplement[] => {
    const base: Supplement[] = [
      { id: 'multi', name: '종합비타민', dosage: `${Math.round(weight * 10)}mg`, natural: '브로콜리, 시금치', benefit: '기초 면역력', icon: Sun },
      { id: 'omega', name: '오메가-3', dosage: `${Math.round(weight * 30)}mg`, natural: '연어, 멸치', benefit: '혈행 개선', icon: Heart },
    ]

    if (concern === 'joint' || age >= 7) {
      base.push({ id: 'gluco', name: '글루코사민', dosage: `${Math.round(weight * 20)}mg`, natural: '초록입홍합', benefit: '관절/연골 강화', icon: Bone })
    }
    if (concern === 'skin') {
      base.push({ id: 'collagen', name: '콜라겐', dosage: `${Math.round(weight * 15)}mg`, natural: '북어 껍질', benefit: '피부 탄력', icon: Sparkles })
    }
    if (concern === 'energy') {
      base.push({ id: 'coq10', name: '코엔자임Q10', dosage: `${Math.round(weight * 2)}mg`, natural: '소고기, 정어리', benefit: '활력 증진', icon: Zap })
    }

    return base
  }

  const supplements = getSupplements()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Pill className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">영양제 맞춤 설계</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이에게 꼭 필요한 영양소만 쏙쏙 골라 추천해드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-orange-500" />
                기본 정보
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">몸무게 (kg)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="40"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="w-16 text-right font-bold text-gray-900 text-lg">
                      {weight} <span className="text-sm font-normal text-gray-500">kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">나이 (살)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="w-16 text-right font-bold text-gray-900 text-lg">
                      {age} <span className="text-sm font-normal text-gray-500">살</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">건강 고민</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'general', label: '기본 관리', icon: Sun },
                      { id: 'joint', label: '관절/뼈', icon: Bone },
                      { id: 'skin', label: '피부/털', icon: Sparkles },
                      { id: 'energy', label: '활력/노화', icon: Zap },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setConcern(item.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${concern === item.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 hover:border-orange-200 text-gray-600'
                          }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="font-bold text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-400" />
                급여 팁
              </h3>
              <ul className="space-y-3 text-orange-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  영양제는 사료와 함께 급여하면 흡수율이 높아집니다.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  새로운 영양제는 소량부터 시작해 적응 기간을 주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">•</span>
                  질병이 있다면 반드시 수의사와 상담하세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
                맞춤 추천 리스트
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {supplements.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all group bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">일일 권장량</div>
                        <div className="text-xl font-black text-gray-900">{item.dosage}</div>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-orange-600 font-medium mb-4">{item.benefit}</p>

                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex items-center gap-2">
                      <Apple className="w-4 h-4 text-green-500" />
                      <span>자연식: <strong>{item.natural}</strong></span>
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
