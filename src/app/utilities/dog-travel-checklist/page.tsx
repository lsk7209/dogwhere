'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Luggage, CheckCircle, Clock, AlertTriangle, MapPin } from 'lucide-react'

interface TravelItem {
  id: string
  name: string
  description: string
  category: 'essentials' | 'food' | 'safety' | 'comfort' | 'documents' | 'emergency'
  importance: 'high' | 'medium' | 'low'
  packed: boolean
  notes?: string
}

interface TravelRecord {
  id: string
  date: string
  destination: string
  duration: number
  items: string[]
  notes: string
}

export default function DogTravelChecklistPage() {
  const [items, setItems] = useState<TravelItem[]>([])
  const [records, setRecords] = useState<TravelRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    destination: '',
    duration: 1,
    items: [] as string[],
    notes: ''
  })

  const initialItems: TravelItem[] = [
    {
      id: '1',
      name: '사료',
      description: '강아지 사료와 간식',
      category: 'food',
      importance: 'high',
      packed: false
    },
    {
      id: '2',
      name: '물병',
      description: '여행용 물병',
      category: 'essentials',
      importance: 'high',
      packed: false
    },
    {
      id: '3',
      name: '목줄과 가슴줄',
      description: '안전한 산책을 위한 줄',
      category: 'safety',
      importance: 'high',
      packed: false
    },
    {
      id: '4',
      name: '여권/신분증',
      description: '강아지 여권이나 신분증',
      category: 'documents',
      importance: 'high',
      packed: false
    },
    {
      id: '5',
      name: '예방접종 증명서',
      description: '예방접종 증명서',
      category: 'documents',
      importance: 'high',
      packed: false
    },
    {
      id: '6',
      name: '응급키트',
      description: '응급상황 대비 키트',
      category: 'emergency',
      importance: 'high',
      packed: false
    },
    {
      id: '7',
      name: '장난감',
      description: '강아지가 좋아하는 장난감',
      category: 'comfort',
      importance: 'medium',
      packed: false
    },
    {
      id: '8',
      name: '담요',
      description: '강아지가 편안해하는 담요',
      category: 'comfort',
      importance: 'medium',
      packed: false
    },
    {
      id: '9',
      name: '배변봉투',
      description: '산책용 배변봉투',
      category: 'essentials',
      importance: 'high',
      packed: false
    },
    {
      id: '10',
      name: '먹이 그릇',
      description: '여행용 먹이 그릇',
      category: 'essentials',
      importance: 'high',
      packed: false
    },
    {
      id: '11',
      name: '수건',
      description: '강아지용 수건',
      category: 'comfort',
      importance: 'medium',
      packed: false
    },
    {
      id: '12',
      name: '약물',
      description: '필요한 약물',
      category: 'emergency',
      importance: 'high',
      packed: false
    },
    {
      id: '13',
      name: '강아지 침대',
      description: '여행용 강아지 침대',
      category: 'comfort',
      importance: 'medium',
      packed: false
    },
    {
      id: '14',
      name: '강아지 가방',
      description: '강아지 운반용 가방',
      category: 'essentials',
      importance: 'high',
      packed: false
    },
    {
      id: '15',
      name: '강아지 옷',
      description: '날씨에 맞는 강아지 옷',
      category: 'comfort',
      importance: 'low',
      packed: false
    },
    {
      id: '16',
      name: '강아지 신발',
      description: '보호용 강아지 신발',
      category: 'safety',
      importance: 'medium',
      packed: false
    },
    {
      id: '17',
      name: '강아지 모자',
      description: '자외선 차단용 모자',
      category: 'safety',
      importance: 'low',
      packed: false
    },
    {
      id: '18',
      name: '강아지 선글라스',
      description: '자외선 차단용 선글라스',
      category: 'safety',
      importance: 'low',
      packed: false
    },
    {
      id: '19',
      name: '강아지 목걸이',
      description: '식별용 목걸이',
      category: 'safety',
      importance: 'high',
      packed: false
    },
    {
      id: '20',
      name: '강아지 사진',
      description: '분실 시 사용할 사진',
      category: 'emergency',
      importance: 'medium',
      packed: false
    }
  ]

  useEffect(() => {
    const savedItems = localStorage.getItem('travelItems')
    const savedRecords = localStorage.getItem('travelRecords')
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {
        setItems(initialItems)
      }
    } else {
      setItems(initialItems)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('travelItems', JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('travelRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, packed: !item.packed } 
        : item
    ))
  }

  const addRecord = () => {
    if (!newRecord.destination) return

    const record: TravelRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      destination: '',
      duration: 1,
      items: [],
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essentials': return 'text-blue-600 bg-blue-100'
      case 'food': return 'text-green-600 bg-green-100'
      case 'safety': return 'text-red-600 bg-red-100'
      case 'comfort': return 'text-purple-600 bg-purple-100'
      case 'documents': return 'text-orange-600 bg-orange-100'
      case 'emergency': return 'text-pink-600 bg-pink-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'essentials': return '필수품'
      case 'food': return '음식'
      case 'safety': return '안전'
      case 'comfort': return '편안함'
      case 'documents': return '서류'
      case 'emergency': return '응급'
      default: return category
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return importance
    }
  }

  const packedItems = items.filter(item => item.packed).length
  const totalItems = items.length
  const highImportanceItems = items.filter(item => item.importance === 'high').length
  const packedHighImportanceItems = items.filter(item => item.importance === 'high' && item.packed).length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Luggage className="w-10 h-10 text-blue-600 mr-3" />
            여행 준비 체크리스트
          </h1>
          <p className="text-xl text-gray-600">반려견과 함께하는 여행 준비사항</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Luggage className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalItems}개</p>
            <p className="text-sm text-gray-600">여행 아이템</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{packedItems}개</p>
            <p className="text-sm text-gray-600">준비 완료</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceItems}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{packedHighImportanceItems}개</p>
            <p className="text-sm text-gray-600">고우선순위 준비</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">여행 체크리스트</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.packed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>
                          {getCategoryText(item.category)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(item.importance)}`}>
                          {getImportanceText(item.importance)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">여행 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">여행 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">여행지</label>
                    <input
                      type="text"
                      value={newRecord.destination}
                      onChange={(e) => setNewRecord({...newRecord, destination: e.target.value})}
                      placeholder="여행지 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">여행 기간 (일)</label>
                  <input
                    type="number"
                    value={newRecord.duration}
                    onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 1})}
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">준비한 아이템</label>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item) => (
                      <label key={item.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newRecord.items.includes(item.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRecord({...newRecord, items: [...newRecord.items, item.name]})
                            } else {
                              setNewRecord({...newRecord, items: newRecord.items.filter(i => i !== item.name)})
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="여행 경험이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  여행 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 여행 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.destination}</p>
                          <p className="text-sm text-gray-600">{record.date} • {record.duration}일</p>
                          <p className="text-sm text-gray-600">
                            준비한 아이템: {record.items.length}개
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className="text-green-600 text-sm">완료</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧳 여행 준비 체크리스트 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 아이템을 준비하세요</li>
                <li>• 일관성 있게 준비하세요</li>
                <li>• 정기적으로 체크리스트를 확인하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 준비를 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 이상 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}