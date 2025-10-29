'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Gamepad2, Plus, RotateCcw } from 'lucide-react'

interface Toy {
  id: string
  name: string
  type: string
  lastUsed: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function ToyRotationPlannerPage() {
  const [toys, setToys] = useState<Toy[]>([])
  const [newToy, setNewToy] = useState({
    name: '',
    type: '',
    condition: 'excellent' as const,
    notes: ''
  })
  const [rotationSchedule, setRotationSchedule] = useState<string[]>([])

  const toyTypes = [
    '인형', '공', '로프', '뼈 모양', '퍼즐', '소리나는 장난감', '치킨', '기타'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('toyCollection')
    if (saved) {
      try {
        setToys(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (toys.length > 0) {
      localStorage.setItem('toyCollection', JSON.stringify(toys))
    }
  }, [toys])

  const addToy = () => {
    if (!newToy.name || !newToy.type) return

    const toy: Toy = {
      id: Date.now().toString(),
      name: newToy.name,
      type: newToy.type,
      lastUsed: new Date().toISOString().split('T')[0],
      condition: newToy.condition,
      notes: newToy.notes
    }
    setToys([...toys, toy])
    setNewToy({ name: '', type: '', condition: 'excellent', notes: '' })
  }

  const generateRotation = () => {
    const availableToys = toys.filter(toy => toy.condition !== 'poor')
    const shuffled = [...availableToys].sort(() => Math.random() - 0.5)
    setRotationSchedule(shuffled.slice(0, 3).map(toy => toy.id))
  }

  const updateLastUsed = (toyId: string) => {
    setToys(toys.map(toy => 
      toy.id === toyId 
        ? { ...toy, lastUsed: new Date().toISOString().split('T')[0] }
        : toy
    ))
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return condition
    }
  }

  const getDaysSinceLastUsed = (lastUsed: string) => {
    const today = new Date()
    const lastUsedDate = new Date(lastUsed)
    const diffTime = today.getTime() - lastUsedDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Gamepad2 className="w-10 h-10 text-purple-600 mr-3" />
            장난감 로테이션 플래너
          </h1>
          <p className="text-xl text-gray-600">장난감을 순환하며 사용하는 계획을 수립합니다</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 장난감 추가</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">장난감 이름</label>
              <input
                type="text"
                value={newToy.name}
                onChange={(e) => setNewToy({...newToy, name: e.target.value})}
                placeholder="예: 곰인형, 공, 로프"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">장난감 유형</label>
              <select
                value={newToy.type}
                onChange={(e) => setNewToy({...newToy, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">유형 선택</option>
                {toyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
              <select
                value={newToy.condition}
                onChange={(e) => setNewToy({...newToy, condition: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="excellent">매우 좋음</option>
                <option value="good">좋음</option>
                <option value="fair">보통</option>
                <option value="poor">나쁨</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newToy.notes}
                onChange={(e) => setNewToy({...newToy, notes: e.target.value})}
                placeholder="특이사항이나 주의사항"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={addToy}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            장난감 추가
          </button>
        </div>

        {toys.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">장난감 컬렉션</h2>
              <button
                onClick={generateRotation}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>로테이션 생성</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toys.map((toy) => {
                const daysSince = getDaysSinceLastUsed(toy.lastUsed)
                const isInRotation = rotationSchedule.includes(toy.id)
                
                return (
                  <div
                    key={toy.id}
                    className={`border-2 rounded-lg p-4 ${
                      isInRotation ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{toy.name}</h3>
                      {isInRotation && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          오늘 추천
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{toy.type}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(toy.condition)}`}>
                        {getConditionText(toy.condition)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {daysSince}일 전 사용
                      </span>
                    </div>
                    {toy.notes && (
                      <p className="text-xs text-gray-500 mb-2">{toy.notes}</p>
                    )}
                    <button
                      onClick={() => updateLastUsed(toy.id)}
                      className="w-full text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
                    >
                      사용 완료
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {rotationSchedule.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">오늘의 장난감 로테이션</h2>
            <div className="space-y-3">
              {rotationSchedule.map((toyId, index) => {
                const toy = toys.find(t => t.id === toyId)
                if (!toy) return null
                
                return (
                  <div key={toyId} className="flex items-center space-x-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{toy.name}</h3>
                      <p className="text-sm text-gray-600">{toy.type}</p>
                    </div>
                    <button
                      onClick={() => updateLastUsed(toy.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      사용 완료
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 장난감 로테이션 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 장난감을 로테이션하면 강아지의 흥미를 지속시킬 수 있습니다</li>
            <li>• 3-4개의 장난감을 번갈아 사용하는 것이 효과적입니다</li>
            <li>• 장난감의 상태를 정기적으로 점검하고 교체하세요</li>
            <li>• 강아지의 선호도에 따라 로테이션 주기를 조절하세요</li>
            <li>• 안전한 장난감만 사용하고, 손상된 것은 즉시 제거하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
