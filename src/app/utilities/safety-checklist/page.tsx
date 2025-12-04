'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle, ArrowLeft, Utensils, Sofa, Bath, TreePine, Home, Info, ChevronDown, ChevronUp } from 'lucide-react'

interface SafetyItem {
  id: string
  text: string
  desc: string
  checked: boolean
  priority: 'high' | 'medium' | 'low'
}

interface Category {
  id: string
  name: string
  icon: any
  items: SafetyItem[]
}

export default function SafetyChecklistPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'kitchen',
      name: '주방',
      icon: Utensils,
      items: [
        { id: 'k1', text: '쓰레기통 뚜껑', desc: '쉽게 열 수 없는 뚜껑이 있는 쓰레기통 사용', checked: false, priority: 'high' },
        { id: 'k2', text: '위험 음식 보관', desc: '초콜릿, 포도, 양파 등은 닿지 않는 곳에 보관', checked: false, priority: 'high' },
        { id: 'k3', text: '세제 및 화학물질', desc: '하부장 잠금장치 설치 또는 높은 곳 보관', checked: false, priority: 'high' },
        { id: 'k4', text: '날카로운 도구', desc: '칼, 가위 등은 사용 후 즉시 정리', checked: false, priority: 'medium' }
      ]
    },
    {
      id: 'living',
      name: '거실/방',
      icon: Sofa,
      items: [
        { id: 'l1', text: '전선 정리', desc: '전선 보호관 사용 또는 숨김 처리', checked: false, priority: 'high' },
        { id: 'l2', text: '작은 물건', desc: '동전, 액세서리, 장난감 부품 등 삼킴 위험 제거', checked: false, priority: 'high' },
        { id: 'l3', text: '식물 확인', desc: '백합, 튤립 등 독성 식물 치우기', checked: false, priority: 'medium' },
        { id: 'l4', text: '가구 틈새', desc: '끼일 수 있는 좁은 틈새 막기', checked: false, priority: 'low' }
      ]
    },
    {
      id: 'bathroom',
      name: '욕실',
      icon: Bath,
      items: [
        { id: 'b1', text: '변기 뚜껑', desc: '익사 사고 및 세균 감염 방지', checked: false, priority: 'medium' },
        { id: 'b2', text: '욕실 용품', desc: '샴푸, 면도기 등은 선반 위에 보관', checked: false, priority: 'medium' },
        { id: 'b3', text: '바닥 미끄럼', desc: '미끄럼 방지 매트 설치', checked: false, priority: 'low' }
      ]
    },
    {
      id: 'outdoor',
      name: '현관/베란다',
      icon: TreePine,
      items: [
        { id: 'o1', text: '중문/안전문', desc: '갑작스러운 뛰쳐나감 방지', checked: false, priority: 'high' },
        { id: 'o2', text: '방충망 확인', desc: '찢어진 곳이나 쉽게 열리는지 확인', checked: false, priority: 'high' },
        { id: 'o3', text: '신발 정리', desc: '신발 씹기 방지 및 이물질 섭취 예방', checked: false, priority: 'medium' }
      ]
    }
  ])

  const [expandedCategory, setExpandedCategory] = useState<string | null>('kitchen')

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        }
      }
      return cat
    }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200'
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-200'
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '필수'
      case 'medium': return '권장'
      case 'low': return '참고'
      default: return ''
    }
  }

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedItems = categories.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0)
  const progress = Math.round((checkedItems / totalItems) * 100)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">우리집 안전 체크리스트</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            호기심 많은 강아지에게 집은 위험한 놀이터일 수 있습니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Home className="w-5 h-5 mr-2 text-red-500" />
                구역별 점검
              </h2>

              <div className="space-y-4">
                {categories.map((category) => {
                  const isExpanded = expandedCategory === category.id
                  const categoryChecked = category.items.filter(i => i.checked).length
                  const categoryTotal = category.items.length
                  const isComplete = categoryChecked === categoryTotal

                  return (
                    <div key={category.id} className={`border rounded-xl overflow-hidden transition-all ${isComplete ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'
                      }`}>
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            <category.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-900">{category.name}</div>
                            <div className="text-xs text-gray-500">
                              {categoryChecked}/{categoryTotal} 완료
                            </div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 space-y-3 animate-in slide-in-from-top-2">
                          {category.items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => toggleItem(category.id, item.id)}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                            >
                              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 group-hover:border-green-400'
                                }`}>
                                {item.checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-1.5 py-0.5 rounded border font-bold ${getPriorityColor(item.priority)}`}>
                                    {getPriorityLabel(item.priority)}
                                  </span>
                                  <span className={`font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {item.text}
                                  </span>
                                </div>
                                <p className={`text-sm ${item.checked ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Safety Score Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">안전 점수</h2>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={progress === 100 ? '#22c55e' : '#ef4444'}
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
                      className="transition-all duration-1000 ease-out rounded-full"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-4xl font-black ${progress === 100 ? 'text-green-600' : 'text-gray-900'}`}>
                      {progress}
                    </span>
                    <span className="text-sm text-gray-500">점</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {progress === 100 ? '완벽합니다! 안전한 집이에요.' : '아직 위험 요소가 남아있습니다.'}
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-red-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                긴급 상황 대비
              </h3>
              <ul className="space-y-4 text-red-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-red-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">24시 동물병원</strong><br />
                    가장 가까운 24시 병원 전화번호를 저장해두세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">이물질 섭취 시</strong><br />
                    억지로 토하게 하지 말고 즉시 병원으로 가세요.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
