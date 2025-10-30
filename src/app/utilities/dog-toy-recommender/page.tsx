'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Gamepad2, Star, Filter, Search } from 'lucide-react'

interface Toy {
  id: string
  name: string
  category: string
  ageGroup: string
  size: string
  material: string
  description: string
  benefits: string[]
  price: string
  rating: number
  image: string
}

export default function DogToyRecommenderPage() {
  const [toys, setToys] = useState<Toy[]>([])
  const [filters, setFilters] = useState({
    category: '',
    ageGroup: '',
    size: '',
    material: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  const toyData: Toy[] = [
    {
      id: '1',
      name: '고무 공',
      category: '운동',
      ageGroup: '전체',
      size: '소형/중형/대형',
      material: '고무',
      description: '튼튼한 고무로 만들어져 오래 사용할 수 있는 공입니다.',
      benefits: ['운동량 증가', '치아 건강', '스트레스 해소'],
      price: '5,000-15,000원',
      rating: 4.5,
      image: '⚽'
    },
    {
      id: '2',
      name: '로프 장난감',
      category: '운동',
      ageGroup: '전체',
      size: '소형/중형/대형',
      material: '면',
      description: '당기기 놀이에 최적화된 로프 장난감입니다.',
      benefits: ['사회성 향상', '운동량 증가', '관절 건강'],
      price: '3,000-10,000원',
      rating: 4.3,
      image: '🪢'
    },
    {
      id: '3',
      name: '퍼즐 피더',
      category: '지능',
      ageGroup: '성견',
      size: '중형/대형',
      material: '플라스틱',
      description: '사료를 넣고 퍼즐을 풀어야 나오는 지능 장난감입니다.',
      benefits: ['지능 발달', '스트레스 해소', '식사 시간 연장'],
      price: '15,000-30,000원',
      rating: 4.7,
      image: '🧩'
    },
    {
      id: '4',
      name: '치아 청소 장난감',
      category: '건강',
      ageGroup: '전체',
      size: '소형/중형/대형',
      material: '고무/실리콘',
      description: '씹는 동안 치아가 깨끗해지는 장난감입니다.',
      benefits: ['구강 건강', '치석 예방', '입 냄새 개선'],
      price: '8,000-20,000원',
      rating: 4.4,
      image: '🦷'
    },
    {
      id: '5',
      name: '인형 장난감',
      category: '안정',
      ageGroup: '강아지/성견',
      size: '소형/중형',
      material: '면/플리스',
      description: '부드러운 재질로 만들어진 안정감을 주는 인형입니다.',
      benefits: ['불안 완화', '수면 도움', '위로감 제공'],
      price: '10,000-25,000원',
      rating: 4.2,
      image: '🧸'
    },
    {
      id: '6',
      name: '공 튀기는 장난감',
      category: '운동',
      ageGroup: '성견',
      size: '중형/대형',
      material: '고무/플라스틱',
      description: '튀어오르는 공으로 혼자서도 놀 수 있는 장난감입니다.',
      benefits: ['독립성 향상', '운동량 증가', '재미 요소'],
      price: '20,000-40,000원',
      rating: 4.6,
      image: '🏀'
    },
    {
      id: '7',
      name: '냄새 나는 장난감',
      category: '지능',
      ageGroup: '성견',
      size: '소형/중형/대형',
      material: '고무/천',
      description: '특별한 냄새가 나는 장난감으로 호기심을 자극합니다.',
      benefits: ['지능 발달', '후각 자극', '흥미 유발'],
      price: '12,000-25,000원',
      rating: 4.1,
      image: '👃'
    },
    {
      id: '8',
      name: '물놀이 장난감',
      category: '운동',
      ageGroup: '전체',
      size: '소형/중형/대형',
      material: '플라스틱',
      description: '물에서도 안전하게 사용할 수 있는 장난감입니다.',
      benefits: ['물놀이 즐김', '운동량 증가', '시원함 제공'],
      price: '5,000-15,000원',
      rating: 4.3,
      image: '🏊'
    }
  ]

  useEffect(() => {
    setToys(toyData)
    const savedFavorites = localStorage.getItem('toyFavorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('toyFavorites', JSON.stringify(favorites))
    }
  }, [favorites])

  const toggleFavorite = (toyId: string) => {
    setFavorites(prev => 
      prev.includes(toyId) 
        ? prev.filter(id => id !== toyId)
        : [...prev, toyId]
    )
  }

  const filteredToys = toys.filter(toy => {
    if (filters.category && toy.category !== filters.category) return false
    if (filters.ageGroup && toy.ageGroup !== filters.ageGroup) return false
    if (filters.size && !toy.size.includes(filters.size)) return false
    if (filters.material && !toy.material.includes(filters.material)) return false
    if (searchTerm && !toy.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const categories = [...new Set(toys.map(toy => toy.category))]
  const ageGroups = [...new Set(toys.map(toy => toy.ageGroup))]
  const sizes = [...new Set(toys.flatMap(toy => toy.size.split('/')))]
  const materials = [...new Set(toys.flatMap(toy => toy.material.split('/')))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Gamepad2 className="w-10 h-10 text-purple-600 mr-3" />
            장난감 추천 시스템
          </h1>
          <p className="text-xl text-gray-600">견종과 연령에 맞는 장난감을 추천합니다</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">필터</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="장난감 이름 검색"
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">전체</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연령대</label>
                  <select
                    value={filters.ageGroup}
                    onChange={(e) => setFilters({...filters, ageGroup: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">전체</option>
                    {ageGroups.map(ageGroup => (
                      <option key={ageGroup} value={ageGroup}>{ageGroup}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">크기</label>
                  <select
                    value={filters.size}
                    onChange={(e) => setFilters({...filters, size: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">전체</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">재질</label>
                  <select
                    value={filters.material}
                    onChange={(e) => setFilters({...filters, material: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">전체</option>
                    {materials.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setFilters({category: '', ageGroup: '', size: '', material: ''})}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  추천 장난감 ({filteredToys.length}개)
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    즐겨찾기: {favorites.length}개
                  </span>
                </div>
              </div>

              {filteredToys.length === 0 ? (
                <p className="text-gray-500 text-center py-8">조건에 맞는 장난감이 없습니다</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredToys.map((toy) => (
                    <div key={toy.id} className="border-2 border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{toy.image}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{toy.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(toy.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{toy.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(toy.id)}
                          className={`p-2 rounded ${
                            favorites.includes(toy.id)
                              ? 'text-red-600 bg-red-100'
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-600 mb-4">{toy.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">카테고리:</span>
                          <span className="font-semibold">{toy.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">연령대:</span>
                          <span className="font-semibold">{toy.ageGroup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">크기:</span>
                          <span className="font-semibold">{toy.size}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">재질:</span>
                          <span className="font-semibold">{toy.material}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">가격:</span>
                          <span className="font-semibold text-green-600">{toy.price}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">장점:</h4>
                        <div className="flex flex-wrap gap-1">
                          {toy.benefits.map((benefit, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">즐겨찾기 장난감</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map(favoriteId => {
                    const toy = toys.find(t => t.id === favoriteId)
                    if (!toy) return null
                    return (
                      <div key={toy.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{toy.image}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{toy.name}</h3>
                          <p className="text-sm text-gray-600">{toy.price}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(toy.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎾 장난감 선택 가이드</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">연령별 추천</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지: 부드러운 재질, 작은 크기</li>
                <li>• 성견: 다양한 활동, 지능 장난감</li>
                <li>• 노령견: 관절에 부담 없는 장난감</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">크기별 추천</h3>
              <ul className="space-y-1 text-sm">
                <li>• 소형견: 작고 가벼운 장난감</li>
                <li>• 중형견: 적당한 크기와 무게</li>
                <li>• 대형견: 튼튼하고 큰 장난감</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
