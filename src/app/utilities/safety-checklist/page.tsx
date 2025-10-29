'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'

interface SafetyItem {
  id: string
  category: string
  item: string
  checked: boolean
  priority: 'high' | 'medium' | 'low'
  notes: string
}

export default function SafetyChecklistPage() {
  const [items, setItems] = useState<SafetyItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const safetyCategories = {
    indoor: {
      name: '실내 안전',
      items: [
        { item: '전선과 코드가 강아지가 닿지 않는 곳에 있는가?', priority: 'high' },
        { item: '위험한 화학물질이 잠겨있거나 높은 곳에 있는가?', priority: 'high' },
        { item: '작은 물건들이 바닥에 떨어져 있지 않은가?', priority: 'high' },
        { item: '쓰레기통이 강아지가 열 수 없도록 되어 있는가?', priority: 'medium' },
        { item: '화장실 문이 항상 닫혀있는가?', priority: 'medium' },
        { item: '가구 모서리가 안전하게 처리되어 있는가?', priority: 'low' }
      ]
    },
    outdoor: {
      name: '실외 안전',
      items: [
        { item: '울타리가 안전하고 탈출할 구멍이 없는가?', priority: 'high' },
        { item: '독성 식물이 없는가?', priority: 'high' },
        { item: '연못이나 수영장이 안전하게 막혀있는가?', priority: 'high' },
        { item: '야외 화학물질이 안전하게 보관되어 있는가?', priority: 'medium' },
        { item: '그늘진 곳이 충분한가?', priority: 'medium' },
        { item: '야외 전기 시설이 안전한가?', priority: 'low' }
      ]
    },
    food: {
      name: '음식 안전',
      items: [
        { item: '강아지에게 위험한 음식이 접근 불가능한가?', priority: 'high' },
        { item: '사료가 신선하고 적절히 보관되어 있는가?', priority: 'medium' },
        { item: '물 그릇이 깨끗하고 신선한가?', priority: 'medium' },
        { item: '간식이 적절한 양으로 제공되는가?', priority: 'low' }
      ]
    },
    emergency: {
      name: '응급 대비',
      items: [
        { item: '응급 연락처가 준비되어 있는가?', priority: 'high' },
        { item: '응급처치용품이 준비되어 있는가?', priority: 'high' },
        { item: '강아지의 의료 기록이 준비되어 있는가?', priority: 'medium' },
        { item: '탈출 시 대비책이 있는가?', priority: 'medium' }
      ]
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('safetyChecklist')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        initializeItems()
      }
    } else {
      initializeItems()
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('safetyChecklist', JSON.stringify(items))
    }
  }, [items])

  const initializeItems = () => {
    const allItems: SafetyItem[] = []
    Object.entries(safetyCategories).forEach(([categoryKey, category]) => {
      category.items.forEach((item, index) => {
        allItems.push({
          id: `${categoryKey}-${index}`,
          category: categoryKey,
          item: item.item,
          checked: false,
          priority: item.priority as 'high' | 'medium' | 'low',
          notes: ''
        })
      })
    })
    setItems(allItems)
  }

  const toggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, checked: !item.checked }
        : item
    ))
  }

  const updateNotes = (itemId: string, notes: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, notes }
        : item
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return priority
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory)

  const completedCount = filteredItems.filter(item => item.checked).length
  const totalCount = filteredItems.length
  const highPriorityUnchecked = filteredItems.filter(item => item.priority === 'high' && !item.checked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-10 h-10 text-blue-600 mr-3" />
            안전 체크리스트
          </h1>
          <p className="text-xl text-gray-600">집안 안전사항을 정기적으로 점검하고 관리합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedCount}/{totalCount}</p>
            <p className="text-sm text-gray-600">완료된 항목</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">완료율</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-red-600">{highPriorityUnchecked}</p>
            <p className="text-sm text-gray-600">높은 우선순위 미완료</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">카테고리 선택</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-3 rounded-lg border transition-colors ${
                selectedCategory === 'all'
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            {Object.entries(safetyCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedCategory === key
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {highPriorityUnchecked > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">높은 우선순위 미완료 항목</h2>
            </div>
            <p className="text-red-700">
              {highPriorityUnchecked}개의 높은 우선순위 안전 항목이 아직 완료되지 않았습니다. 
              이 항목들을 우선적으로 점검해주세요.
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' ? '전체 안전 체크리스트' : safetyCategories[selectedCategory as keyof typeof safetyCategories]?.name}
          </h2>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {item.checked && <CheckCircle className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <p className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.item}
                      </p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {getPriorityText(item.priority)}
                      </span>
                    </div>
                    <textarea
                      value={item.notes}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      placeholder="메모나 특이사항을 입력하세요"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 안전 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 정기적으로 안전 체크리스트를 점검하세요</li>
            <li>• 높은 우선순위 항목을 우선적으로 확인하세요</li>
            <li>• 강아지가 성장하면서 새로운 위험 요소가 생길 수 있습니다</li>
            <li>• 계절에 따라 안전 관리 항목이 달라질 수 있습니다</li>
            <li>• 문제가 발견되면 즉시 해결하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
