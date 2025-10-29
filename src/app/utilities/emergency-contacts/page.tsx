'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Plus, Edit, Trash2 } from 'lucide-react'

interface Contact {
  id: string
  name: string
  type: string
  phone: string
  address: string
  notes: string
  priority: 'high' | 'medium' | 'low'
}

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState({
    name: '',
    type: 'veterinary',
    phone: '',
    address: '',
    notes: '',
    priority: 'high' as const
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const contactTypes = {
    veterinary: { name: '동물병원', icon: '🏥' },
    emergency: { name: '응급실', icon: '🚨' },
    groomer: { name: '미용실', icon: '✂️' },
    trainer: { name: '훈련사', icon: '🎓' },
    pet_sitter: { name: '펫시터', icon: '👤' },
    insurance: { name: '보험사', icon: '🛡️' },
    other: { name: '기타', icon: '📞' }
  }

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts')
    if (saved) {
      try {
        setContacts(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('emergencyContacts', JSON.stringify(contacts))
    }
  }, [contacts])

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    }
    setContacts([contact, ...contacts])
    setNewContact({
      name: '',
      type: 'veterinary',
      phone: '',
      address: '',
      notes: '',
      priority: 'high'
    })
  }

  const updateContact = (id: string, updatedContact: Partial<Contact>) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, ...updatedContact }
        : contact
    ))
    setEditingId(null)
  }

  const deleteContact = (id: string) => {
    if (confirm('정말로 이 연락처를 삭제하시겠습니까?')) {
      setContacts(contacts.filter(contact => contact.id !== id))
    }
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

  const getTypeName = (type: string) => {
    return contactTypes[type as keyof typeof contactTypes]?.name || type
  }

  const getTypeIcon = (type: string) => {
    return contactTypes[type as keyof typeof contactTypes]?.icon || '📞'
  }

  const highPriorityContacts = contacts.filter(c => c.priority === 'high')
  const veterinaryContacts = contacts.filter(c => c.type === 'veterinary')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="w-10 h-10 text-red-600 mr-3" />
            응급 연락처 관리
          </h1>
          <p className="text-xl text-gray-600">응급상황 시 필요한 연락처를 체계적으로 관리합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{contacts.length}개</p>
            <p className="text-sm text-gray-600">등록된 연락처</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-red-600">{highPriorityContacts.length}개</p>
            <p className="text-sm text-gray-600">높은 우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-blue-600">{veterinaryContacts.length}개</p>
            <p className="text-sm text-gray-600">동물병원</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">새 연락처 추가</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름/업체명</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="예: 서울동물병원"
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
                  {Object.entries(contactTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.icon} {type.name}</option>
                  ))}
                </select>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                <select
                  value={newContact.priority}
                  onChange={(e) => setNewContact({...newContact, priority: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="high">높음</option>
                  <option value="medium">보통</option>
                  <option value="low">낮음</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
              <input
                type="text"
                value={newContact.address}
                onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                placeholder="예: 서울시 강남구 테헤란로 123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newContact.notes}
                onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                rows={3}
                placeholder="특별한 주의사항이나 추가 정보"
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
        </div>

        {highPriorityContacts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">🚨 긴급 연락처</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {highPriorityContacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <span className="mr-2">{getTypeIcon(contact.type)}</span>
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600">{getTypeName(contact.type)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                      {getPriorityText(contact.priority)}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-red-600 mb-1">{contact.phone}</p>
                  {contact.address && (
                    <p className="text-sm text-gray-600 mb-1">{contact.address}</p>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-gray-500">{contact.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">전체 연락처</h2>
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 연락처가 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(contact.type)}</span>
                        <div>
                          <h3 className="font-bold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{getTypeName(contact.type)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                          {getPriorityText(contact.priority)}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-1">{contact.phone}</p>
                      {contact.address && (
                        <p className="text-sm text-gray-600 mb-1">{contact.address}</p>
                      )}
                      {contact.notes && (
                        <p className="text-sm text-gray-500">{contact.notes}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingId(contact.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-red-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 응급 연락처 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 응급상황 시 빠르게 연락할 수 있도록 연락처를 정리해두세요</li>
            <li>• 24시간 응급실 연락처를 우선순위로 등록하세요</li>
            <li>• 정기적으로 연락처 정보를 업데이트하세요</li>
            <li>• 가족 구성원 모두가 연락처를 확인할 수 있도록 하세요</li>
            <li>• 휴대폰에 빠른 전화번호로 저장해두세요</li>
            <li>• 응급상황 시 침착하게 대응하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
