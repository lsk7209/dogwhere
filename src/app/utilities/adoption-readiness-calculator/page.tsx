'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Calculator, ArrowLeft, AlertCircle, Check, Info } from 'lucide-react'

interface ReadinessItem {
  id: string
  name: string
  description: string
  checked: boolean
}

const readinessItems: ReadinessItem[] = [
  { id: 'time', name: '충분한 시간 확보', description: '매일 산책, 놀이, 훈련에 투자할 시간이 있나요?', checked: false },
  { id: 'space', name: '적절한 생활 공간', description: '반려견이 편안하게 지낼 수 있는 공간이 마련되었나요?', checked: false },
  { id: 'budget', name: '충분한 예산 준비', description: '사료, 병원비, 용품 등 매달 발생하는 비용을 감당할 수 있나요?', checked: false },
  { id: 'knowledge', name: '반려견 지식 습득', description: '견종 특성, 훈련법, 건강 관리에 대해 충분히 공부했나요?', checked: false },
  { id: 'family', name: '가족 동의', description: '함께 사는 모든 가족 구성원이 입양에 동의했나요?', checked: false },
  { id: 'lifestyle', name: '라이프스타일 조정', description: '여행, 외출 등 생활 패턴을 반려견에 맞춰 조정할 수 있나요?', checked: false },
  { id: 'emergency', name: '응급 상황 대비', description: '갑작스러운 질병이나 사고 시 대처할 수 있는 준비가 되었나요?', checked: false },
  { id: 'commitment', name: '평생 책임', description: '15년 이상 반려견의 평생을 책임질 각오가 되었나요?', checked: false }
]

export default function AdoptionReadinessCalculatorPage() {
  const [items, setItems] = useState<ReadinessItem[]>(readinessItems)
  const [result, setResult] = useState<{
    readiness: number
    level: string
    missingItems: string[]
    recommendation: string
  } | null>(null)

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const calculate = () => {
    const checked = items.filter(item => item.checked).length
    const total = items.length
    const readiness = Math.round((checked / total) * 100)
    const missingItems = items.filter(item => !item.checked).map(item => item.name)

    let level = ''
    let recommendation = ''

    if (readiness >= 90) {
      level = '준비 완료!'
      recommendation = '반려견을 맞이할 준비가 완벽합니다. 행복한 반려생활이 기대되네요!'
    } else if (readiness >= 75) {
      level = '준비됨'
      recommendation = '대부분의 준비가 되었습니다. 부족한 부분만 조금 더 보완하면 훌륭한 보호자가 될 수 있어요.'
    } else if (readiness >= 50) {
      level = '부분 준비됨'
      recommendation = '아직 준비가 더 필요합니다. 체크하지 않은 항목들을 꼼꼼히 다시 생각해보세요.'
    } else {
      level = '준비 필요'
      recommendation = '지금은 입양하기에 이른 시기일 수 있습니다. 충분한 시간을 두고 신중하게 고민해보세요.'
    }

    setResult({
      readiness,
      level,
      missingItems,
      recommendation
    })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">입양 준비도 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            반려견을 맞이할 준비가 되셨나요? 체크리스트를 통해 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checklist Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-emerald-500" />
                체크리스트
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`group relative flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${item.checked
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.checked
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                      {item.checked && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="ml-4">
                      <h3 className={`font-bold text-base mb-1 transition-colors ${item.checked ? 'text-emerald-900' : 'text-gray-900'
                        }`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculate}
                className="w-full mt-8 bg-emerald-600 text-white py-4 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 font-bold text-lg flex items-center justify-center"
              >
                <Calculator className="w-6 h-6 mr-2" />
                결과 확인하기
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${result.readiness >= 75 ? 'border-emerald-100' :
                    result.readiness >= 50 ? 'border-yellow-100' :
                      'border-red-100'
                  }`}>
                  <div className={`p-6 text-center ${result.readiness >= 75 ? 'bg-emerald-50' :
                      result.readiness >= 50 ? 'bg-yellow-50' :
                        'bg-red-50'
                    }`}>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">준비도 점수</span>
                    <div className={`text-5xl font-black my-4 ${result.readiness >= 75 ? 'text-emerald-600' :
                        result.readiness >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                      }`}>
                      {result.readiness}%
                    </div>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${result.readiness >= 75 ? 'bg-emerald-200 text-emerald-800' :
                        result.readiness >= 50 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                      }`}>
                      {result.level}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center">
                      {result.recommendation}
                    </p>

                    {result.missingItems.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1.5 text-red-500" />
                          보완이 필요한 항목
                        </h4>
                        <ul className="space-y-2">
                          {result.missingItems.map((item, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <span className="mr-2 text-red-400">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    왼쪽의 체크리스트를 작성하고<br />결과 확인하기 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                  입양 전 체크포인트
                </h3>
                <ul className="space-y-3 text-emerald-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    가족 모두의 동의가 있었나요?
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    경제적 부담을 고려하셨나요?
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-emerald-400">•</span>
                    반려견과 함께할 시간이 충분한가요?
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
