'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gamepad2, RefreshCw, Box, Star, Trash2, ArrowLeft, Plus, Sparkles, CheckCircle } from 'lucide-react'

interface Toy {
  id: string
  name: string
  type: 'plush' | 'ball' | 'rope' | 'puzzle'
  condition: number // 1-100
  lastUsed: string
}

export default function ToyRotationPlannerPage() {
  const [toys, setToys] = useState<Toy[]>([
    { id: '1', name: '삑삑이 곰돌이', type: 'plush', condition: 80, lastUsed: '2023-11-10' },
    { id: '2', name: '테니스 공', type: 'ball', condition: 60, lastUsed: '2023-11-12' },
    { id: '3', name: '터그 로프', type: 'rope', condition: 90, lastUsed: '2023-11-05' },
    { id: '4', name: '노즈워크 담요', type: 'puzzle', condition: 75, lastUsed: '2023-11-01' },
  ])
  const [todaysPicks, setTodaysPicks] = useState<Toy[]>([])
  const [isSpinning, setIsSpinning] = useState(false)

  const rotateToys = () => {
    setIsSpinning(true)
    setTimeout(() => {
      // Sort by last used (oldest first) and pick top 2
      const sorted = [...toys].sort((a, b) => new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime())
      setTodaysPicks(sorted.slice(0, 2))
      setIsSpinning(false)
    }, 1000)
  }

  const markAsUsed = (id: string) => {
    setToys(toys.map(t => t.id === id ? { ...t, lastUsed: new Date().toISOString().split('T')[0] } : t))
  }

  const getConditionColor = (val: number) => {
    if (val > 70) return 'bg-green-500'
    if (val > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">장난감 로테이션</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            매일 똑같은 장난감은 지루해요! 오늘은 어떤 친구랑 놀까요?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Today's Pick */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-purple-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>

              <h3 className="font-bold text-lg mb-6 flex items-center z-10">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                오늘의 추천 장난감
              </h3>

              <div className="flex-1 flex flex-col justify-center space-y-4 z-10">
                {isSpinning ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-300" />
                    <p className="text-purple-200">고르는 중...</p>
                  </div>
                ) : todaysPicks.length > 0 ? (
                  todaysPicks.map((toy) => (
                    <div key={toy.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 animate-in slide-in-from-bottom-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">{toy.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded text-purple-100">
                          {toy.type === 'plush' ? '인형' : toy.type === 'ball' ? '공' : toy.type === 'rope' ? '로프' : '퍼즐'}
                        </span>
                      </div>
                      <p className="text-xs text-purple-200 mb-3">
                        마지막 사용: {toy.lastUsed}
                      </p>
                      <button
                        onClick={() => markAsUsed(toy.id)}
                        className="w-full py-2 bg-white text-purple-900 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors"
                      >
                        놀이 완료!
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-purple-300 py-12 border-2 border-dashed border-purple-700 rounded-xl">
                    <p>아래 버튼을 눌러<br />오늘의 장난감을 뽑아보세요!</p>
                  </div>
                )}
              </div>

              <button
                onClick={rotateToys}
                disabled={isSpinning}
                className="w-full py-4 mt-6 bg-yellow-400 text-purple-900 rounded-xl font-black text-lg hover:bg-yellow-300 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                {isSpinning ? '고르는 중...' : '장난감 뽑기!'}
              </button>
            </div>
          </div>

          {/* Right Column: Inventory */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Box className="w-5 h-5 mr-2 text-purple-500" />
                  장난감 보관함 ({toys.length})
                </h2>
                <button className="text-sm text-purple-600 font-bold flex items-center hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-4 h-4 mr-1" />
                  추가하기
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {toys.map((toy) => (
                  <div key={toy.id} className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 transition-all group bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{toy.name}</h3>
                        <span className="text-xs text-gray-500">
                          {toy.type === 'plush' ? '인형' : toy.type === 'ball' ? '공' : toy.type === 'rope' ? '로프' : '퍼즐'}
                        </span>
                      </div>
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">상태</span>
                        <span className={`font-bold ${toy.condition > 70 ? 'text-green-600' : toy.condition > 30 ? 'text-yellow-600' : 'text-red-600'
                          }`}>{toy.condition}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getConditionColor(toy.condition)}`}
                          style={{ width: `${toy.condition}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                로테이션의 효과
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• <strong>흥미 유지:</strong> 며칠 만에 보는 장난감은 새것처럼 느껴집니다.</li>
                <li>• <strong>수명 연장:</strong> 번갈아 사용하면 장난감이 덜 망가집니다.</li>
                <li>• <strong>가치 상승:</strong> 항상 널려있는 장난감보다 꺼내주는 장난감이 더 특별합니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
