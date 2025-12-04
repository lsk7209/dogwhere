'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smile, CheckCircle, ArrowLeft, AlertTriangle, Sparkles, Calendar, Stethoscope } from 'lucide-react'

export default function DentalCareGuidePage() {
  const [selectedAge, setSelectedAge] = useState<string>('puppy')
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const ageGuides = {
    puppy: {
      id: 'puppy',
      label: '퍼피 (2-12개월)',
      title: '이갈이 시기의 구강 관리',
      description: '유치가 빠지고 영구치가 나는 중요한 시기입니다. 양치 습관을 형성하는 것이 가장 중요합니다.',
      tips: [
        '손가락 칫솔이나 거즈로 가볍게 마사지하듯 시작하세요.',
        '치약 맛에 익숙해지도록 조금씩 맛보게 해주세요.',
        '이갈이 장난감으로 잇몸 가려움을 해소해주세요.',
        '입 주변을 만지는 것에 대한 거부감을 줄여주세요.'
      ]
    },
    adult: {
      id: 'adult',
      label: '성견 (1-7세)',
      title: '건강한 치아 유지 관리',
      description: '치석이 쌓이기 쉬운 시기입니다. 매일 양치질과 정기적인 스케일링이 필요합니다.',
      tips: [
        '매일 1회 이상 꼼꼼하게 양치질을 해주세요.',
        '치석 제거용 껌이나 장난감을 보조적으로 활용하세요.',
        '1년에 1회 이상 동물병원에서 구강 검진을 받으세요.',
        '치석이 많이 쌓였다면 스케일링을 고려하세요.'
      ]
    },
    senior: {
      id: 'senior',
      label: '노령견 (7세 이상)',
      title: '노화에 따른 세심한 케어',
      description: '잇몸이 약해지고 치주 질환 위험이 높습니다. 부드러운 관리와 잦은 검진이 필요합니다.',
      tips: [
        '잇몸에 자극이 적은 부드러운 칫솔모를 사용하세요.',
        '딱딱한 간식보다는 부드러운 음식을 급여하세요.',
        '입 냄새가 심해지거나 침을 흘리면 즉시 병원에 가세요.',
        '치주염은 심장/신장 질환의 원인이 될 수 있어 주의가 필요합니다.'
      ]
    }
  }

  const careChecklist = [
    '오늘의 양치질 완료',
    '잇몸 색깔 확인 (분홍색이 정상)',
    '치아 흔들림 체크',
    '입 냄새 확인',
    '치석 상태 점검'
  ]

  const warningSigns = [
    '심한 입 냄새가 난다',
    '잇몸이 붉게 붓거나 피가 난다',
    '사료를 잘 씹지 못하거나 흘린다',
    '얼굴이 부어 보이거나 만지면 싫어한다',
    '치아에 누런 치석이 두껍게 쌓였다'
  ]

  const toggleCheck = (item: string) => {
    setCheckedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }

  const currentGuide = ageGuides[selectedAge as keyof typeof ageGuides]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-cyan-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
              <Smile className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">구강 건강 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견의 치아 건강을 위한 연령별 맞춤 관리법을 확인하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Age Selection Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto">
              {Object.values(ageGuides).map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedAge(guide.id)}
                  className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedAge === guide.id
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200'
                      : 'bg-transparent text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {guide.label}
                </button>
              ))}
            </div>

            {/* Guide Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentGuide.title}</h2>
                <p className="text-gray-600">{currentGuide.description}</p>
              </div>

              <div className="space-y-4">
                {currentGuide.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-800 font-medium">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                이런 증상은 주의하세요!
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {warningSigns.map((sign, idx) => (
                  <div key={idx} className="flex items-center p-3 rounded-lg bg-orange-50 text-orange-800 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2"></span>
                    {sign}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 flex items-start">
                <Stethoscope className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />
                위와 같은 증상이 보이면 치주 질환의 신호일 수 있으므로 수의사와 상담하세요.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Checklist */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-cyan-500" />
                오늘의 체크리스트
              </h2>

              <div className="space-y-3">
                {careChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3 rounded-xl border transition-all cursor-pointer ${checkedItems.includes(item)
                        ? 'bg-cyan-50 border-cyan-200'
                        : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${checkedItems.includes(item)
                        ? 'bg-cyan-500 border-cyan-500'
                        : 'border-gray-300 bg-white'
                      }`}>
                      {checkedItems.includes(item) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checkedItems.includes(item)}
                      onChange={() => toggleCheck(item)}
                    />
                    <span className={`text-sm font-medium ${checkedItems.includes(item) ? 'text-cyan-800 line-through opacity-70' : 'text-gray-700'
                      }`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">진행률</span>
                  <span className="font-bold text-cyan-600">
                    {Math.round((checkedItems.length / careChecklist.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(checkedItems.length / careChecklist.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}