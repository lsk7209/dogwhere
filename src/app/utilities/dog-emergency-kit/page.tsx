'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, CheckCircle, AlertTriangle, Phone, MapPin } from 'lucide-react'

interface EmergencyItem {
  id: string
  name: string
  category: string
  essential: boolean
  checked: boolean
  notes: string
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: string
  notes: string
}

export default function DogEmergencyKitPage() {
  const [items, setItems] = useState<EmergencyItem[]>([])
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    type: '',
    notes: ''
  })

  const emergencyItems: EmergencyItem[] = [
    // 기본 응급처치용품
    {
      id: '1',
      name: '응급처치 키트',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '반창고, 소독약, 거즈, 붕대 등'
    },
    {
      id: '2',
      name: '체온계',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '강아지용 직장 체온계'
    },
    {
      id: '3',
      name: '수술용 가위',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '털이나 붕대 자르기용'
    },
    {
      id: '4',
      name: '생리식염수',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '상처 세척용'
    },
    {
      id: '5',
      name: '수소과산화물',
      category: '의료용품',
      essential: false,
      checked: false,
      notes: '독성 물질 섭취 시 구토 유도용 (수의사 상담 후)'
    },
    {
      id: '6',
      name: '활성탄',
      category: '의료용품',
      essential: false,
      checked: false,
      notes: '독성 물질 중화용'
    },
    {
      id: '7',
      name: '강아지용 마스크',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '인공호흡용'
    },
    {
      id: '8',
      name: '의료용 장갑',
      category: '의료용품',
      essential: true,
      checked: false,
      notes: '일회용 의료용 장갑'
    },
    // 식품 및 물
    {
      id: '9',
      name: '응급 사료',
      category: '식품',
      essential: true,
      checked: false,
      notes: '3일분 이상의 사료'
    },
    {
      id: '10',
      name: '물',
      category: '식품',
      essential: true,
      checked: false,
      notes: '3일분 이상의 깨끗한 물'
    },
    {
      id: '11',
      name: '응급 간식',
      category: '식품',
      essential: false,
      checked: false,
      notes: '스트레스 완화용'
    },
    // 안전용품
    {
      id: '12',
      name: '목줄과 하네스',
      category: '안전용품',
      essential: true,
      checked: false,
      notes: '여분의 목줄과 하네스'
    },
    {
      id: '13',
      name: '캐리어',
      category: '안전용품',
      essential: true,
      checked: false,
      notes: '응급 상황 시 이동용'
    },
    {
      id: '14',
      name: '식기',
      category: '안전용품',
      essential: true,
      checked: false,
      notes: '접을 수 있는 식기'
    },
    {
      id: '15',
      name: '담요',
      category: '안전용품',
      essential: true,
      checked: false,
      notes: '보온용 담요'
    },
    // 문서
    {
      id: '16',
      name: '건강 기록부',
      category: '문서',
      essential: true,
      checked: false,
      notes: '예방접종 기록, 알레르기 정보 등'
    },
    {
      id: '17',
      name: '사진',
      category: '문서',
      essential: true,
      checked: false,
      notes: '강아지 사진 (실종 시 사용)'
    },
    {
      id: '18',
      name: '마이크로칩 정보',
      category: '문서',
      essential: true,
      checked: false,
      notes: '마이크로칩 번호와 등록 정보'
    }
  ]

  const contactTypes = [
    '24시 응급동물병원',
    '일반 동물병원',
    '응급처치 전문가',
    '펫시터',
    '가족/친구',
    '기타'
  ]

  useEffect(() => {
    const savedItems = localStorage.getItem('emergencyKitItems')
    const savedContacts = localStorage.getItem('emergencyContacts')
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {
        setItems(emergencyItems)
      }
    } else {
      setItems(emergencyItems)
    }
    
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('emergencyKitItems', JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('emergencyContacts', JSON.stringify(contacts))
    }
  }, [contacts])

  const toggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ))
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    }
    setContacts([contact, ...contacts])
    setNewContact({ name: '', phone: '', type: '', notes: '' })
  }

  const deleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '의료용품': return '🏥'
      case '식품': return '🍽️'
      case '안전용품': return '🛡️'
      case '문서': return '📄'
      default: return '📦'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '의료용품': return 'text-red-600 bg-red-100'
      case '식품': return 'text-green-600 bg-green-100'
      case '안전용품': return 'text-blue-600 bg-blue-100'
      case '문서': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const essentialItems = items.filter(item => item.essential)
  const checkedEssentialItems = essentialItems.filter(item => item.checked)
  const totalCheckedItems = items.filter(item => item.checked).length
  const essentialProgress = essentialItems.length > 0 
    ? Math.round((checkedEssentialItems.length / essentialItems.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-red-600 mr-3" />
            응급 키트 체크리스트
          </h1>
          <p className="text-xl text-gray-600">반려견 응급상황 대비 필수품 체크리스트를 제공합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{items.length}개</p>
            <p className="text-sm text-gray-600">총 아이템</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalCheckedItems}개</p>
            <p className="text-sm text-gray-600">준비 완료</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{essentialItems.length}개</p>
            <p className="text-sm text-gray-600">필수 아이템</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{essentialProgress}%</p>
            <p className="text-sm text-gray-600">필수 준비율</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">응급 키트 아이템</h2>
              <div className="space-y-4">
                {Object.entries(
                  items.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = []
                    acc[item.category].push(item)
                    return acc
                  }, {} as { [key: string]: EmergencyItem[] })
                ).map(([category, categoryItems]) => (
                  <div key={category} className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`mt-1 p-1 rounded transition-colors ${
                              item.checked
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              {item.essential && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  필수
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{item.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">응급 연락처</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="예: 서울동물병원"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="예: 02-1234-5678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                    <select
                      value={newContact.type}
                      onChange={(e) => setNewContact({...newContact, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">유형 선택</option>
                      {contactTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newContact.notes}
                    onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                    rows={3}
                    placeholder="운영시간, 특별한 정보 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addContact}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  연락처 추가
                </button>
              </div>

              {contacts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">등록된 연락처</h3>
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                          {contact.type && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mt-1">
                              {contact.type}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                      {contact.notes && (
                        <p className="text-sm text-gray-600">{contact.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">응급상황 대처법</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">응급상황 발생 시</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>안전한 곳으로 강아지를 이동시키세요</li>
                    <li>응급처치를 시도하세요 (가능한 경우)</li>
                    <li>즉시 동물병원에 연락하세요</li>
                    <li>강아지의 상태를 자세히 관찰하세요</li>
                    <li>응급 키트를 준비하세요</li>
                  </ol>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">응급처치 기본 원칙</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>강아지의 안전을 최우선으로 하세요</li>
                    <li>무리한 응급처치는 피하세요</li>
                    <li>전문가의 도움을 받으세요</li>
                    <li>차분하고 신속하게 대응하세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 응급상황 대비 체크리스트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">정기 점검사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 응급 키트 아이템 유통기한 확인</li>
                <li>• 연락처 정보 업데이트</li>
                <li>• 응급처치 방법 복습</li>
                <li>• 강아지 건강 상태 점검</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">응급상황 시 체크사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지의 안전 확보</li>
                <li>• 응급처치 시도</li>
                <li>• 동물병원 연락</li>
                <li>• 응급 키트 준비</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
