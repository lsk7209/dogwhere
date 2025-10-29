'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Luggage, CheckSquare, Square } from 'lucide-react'

interface Item {
  id: string
  name: string
  essential: boolean
  checked: boolean
}

export default function TravelPackingListPage() {
  const [season, setSeason] = useState<string>('spring')
  const [duration, setDuration] = useState<number>(1)
  const [travelType, setTravelType] = useState<string>('hotel')
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    generateList()
  }, [season, duration, travelType])

  const generateList = () => {
    const baseItems: Item[] = [
      { id: 'food', name: '사료 (충분한 양)', essential: true, checked: false },
      { id: 'water', name: '물병/급수기', essential: true, checked: false },
      { id: 'bowl', name: '사료그릇, 물그릇', essential: true, checked: false },
      { id: 'medicine', name: '약품 (평소 복용약)', essential: true, checked: false },
      { id: 'records', name: '예방접종 기록부', essential: true, checked: false },
      { id: 'collar', name: '목줄, 가슴줄', essential: true, checked: false },
      { id: 'id', name: '신분표, 인식표', essential: true, checked: false },
      { id: 'leash', name: '리드줄', essential: true, checked: false },
      { id: 'towel', name: '수건', essential: true, checked: false },
      { id: 'poop', name: '배변봉투', essential: true, checked: false },
      { id: 'toy', name: '장난감', essential: false, checked: false },
      { id: 'bed', name: '침구/담요', essential: false, checked: false },
      { id: 'brush', name: '빗, 브러시', essential: false, checked: false },
      { id: 'shampoo', name: '샴푸 (여행용)', essential: false, checked: false },
      { id: 'carrier', name: '캐리어 (소형견)', essential: false, checked: false }
    ]

    // 계절별 추가 아이템
    if (season === 'summer') {
      baseItems.push(
        { id: 'cool', name: '쿨링 매트/패드', essential: false, checked: false },
        { id: 'sunblock', name: '자외선 차단제', essential: false, checked: false },
        { id: 'water-spray', name: '스프레이 물병', essential: false, checked: false }
      )
    } else if (season === 'winter') {
      baseItems.push(
        { id: 'clothes', name: '옷/패딩', essential: false, checked: false },
        { id: 'boots', name: '부츠 (발가락 보호)', essential: false, checked: false },
        { id: 'blanket', name: '추가 담요', essential: false, checked: false }
      )
    }

    // 여행 유형별 추가
    if (travelType === 'camping') {
      baseItems.push(
        { id: 'tent', name: '텐트 (강아지용)', essential: false, checked: false },
        { id: 'flashlight', name: '손전등', essential: false, checked: false },
        { id: 'first-aid', name: '응급키트', essential: true, checked: false }
      )
    } else if (travelType === 'beach') {
      baseItems.push(
        { id: 'life-vest', name: '구명조끼', essential: false, checked: false },
        { id: 'shade', name: '그늘막/텐트', essential: false, checked: false },
        { id: 'fresh-water', name: '담수 (해수 사용 방지)', essential: true, checked: false }
      )
    }

    // 여행 기간별
    if (duration > 3) {
      baseItems.push(
        { id: 'extra-food', name: '추가 사료 (여유분)', essential: true, checked: false },
        { id: 'grooming', name: '미용 도구', essential: false, checked: false }
      )
    }

    setItems(baseItems)
  }

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const checkedCount = items.filter(item => item.checked).length
  const essentialCount = items.filter(item => item.essential).length
  const essentialChecked = items.filter(item => item.essential && item.checked).length

  // localStorage 저장
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('travelPackingList', JSON.stringify(items))
    }
  }, [items])

  // localStorage 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('travelPackingList')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(parsed)
      } catch (e) {
        // 저장 실패 시 무시
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Luggage className="w-10 h-10 text-purple-600 mr-3" />
            반려견 여행 짐 리스트
          </h1>
          <p className="text-xl text-gray-600">
            여행 목적지와 계절에 따라 필요한 준비물을 체크리스트로 관리합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계절
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="spring">봄</option>
                <option value="summer">여름</option>
                <option value="fall">가을</option>
                <option value="winter">겨울</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                여행 기간 (일)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                여행 유형
              </label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="hotel">숙박</option>
                <option value="camping">캠핑</option>
                <option value="beach">해변</option>
              </select>
            </div>
          </div>

          {/* 진행률 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                필수품 준비율: {essentialChecked} / {essentialCount}
              </span>
              <span className="text-sm font-medium text-gray-700">
                전체: {checkedCount} / {items.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(essentialChecked / essentialCount) * 100}%` }}
              />
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">필수품</h3>
              <div className="space-y-2">
                {items.filter(item => item.essential).map(item => (
                  <label key={item.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 text-red-600 rounded"
                    />
                    <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">선택품</h3>
              <div className="space-y-2">
                {items.filter(item => !item.essential).map(item => (
                  <label key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-900'}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 여행 준비 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 필수품은 절대 빠뜨리지 마세요!</li>
            <li>• 예방접종 기록부는 비상 상황에 필수입니다.</li>
            <li>• 여행지의 날씨를 미리 확인하고 준비하세요.</li>
            <li>• 급여량과 식사 시간을 일정하게 유지하는 것이 좋습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

