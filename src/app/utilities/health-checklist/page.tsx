'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Heart, CheckSquare, Calendar, Save } from 'lucide-react'
import type { HealthRecord } from '@/types/utilities'

interface HealthCheckItem {
  id: string
  category: string
  items: {
    id: string
    label: string
    checked: boolean
  }[]
}

const defaultChecklist: HealthCheckItem[] = [
  {
    id: 'general',
    category: '일반 상태',
    items: [
      { id: 'appetite', label: '식욕이 정상적인가?', checked: false },
      { id: 'water', label: '물 마시는 양이 정상적인가?', checked: false },
      { id: 'energy', label: '활동력이 정상적인가?', checked: false },
      { id: 'sleep', label: '수면 패턴이 정상적인가?', checked: false }
    ]
  },
  {
    id: 'physical',
    category: '신체 상태',
    items: [
      { id: 'weight', label: '체중이 정상 범위인가?', checked: false },
      { id: 'coat', label: '털 상태가 좋은가? (윤기, 탈모 없음)', checked: false },
      { id: 'skin', label: '피부 상태가 좋은가? (발진, 상처 없음)', checked: false },
      { id: 'eyes', label: '눈 상태가 좋은가? (분비물, 충혈 없음)', checked: false },
      { id: 'ears', label: '귀 상태가 좋은가? (냄새, 분비물 없음)', checked: false },
      { id: 'nose', label: '코 상태가 좋은가? (코 막힘, 분비물 없음)', checked: false },
      { id: 'teeth', label: '구강 상태가 좋은가? (냄새, 치석 없음)', checked: false }
    ]
  },
  {
    id: 'behavior',
    category: '행동 상태',
    items: [
      { id: 'mood', label: '기분이 좋아 보이는가?', checked: false },
      { id: 'social', label: '사회적 상호작용이 정상적인가?', checked: false },
      { id: 'stress', label: '스트레스나 불안 징후가 없는가?', checked: false },
      { id: 'habits', label: '이상한 습관이나 행동이 없는가?', checked: false }
    ]
  },
  {
    id: 'excretion',
    category: '배변 상태',
    items: [
      { id: 'stool', label: '대변 상태가 정상적인가? (색, 형태, 빈도)', checked: false },
      { id: 'urine', label: '소변 상태가 정상적인가?', checked: false },
      { id: 'frequency', label: '배변 빈도가 정상적인가?', checked: false }
    ]
  }
]

export default function HealthChecklistPage() {
  const [checklist, setChecklist] = useState<HealthCheckItem[]>(defaultChecklist)
  const [checkDate, setCheckDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [savedRecords, setSavedRecords] = useState<HealthRecord[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('healthCheckRecords')
    if (saved) {
      try {
        setSavedRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  const toggleItem = (categoryId: string, itemId: string) => {
    setChecklist(checklist.map(category => 
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          }
        : category
    ))
  }

  const saveRecord = () => {
    const record = {
      date: checkDate,
      checklist: checklist,
      score: calculateScore()
    }
    const updated = [...savedRecords, record]
    setSavedRecords(updated)
    localStorage.setItem('healthCheckRecords', JSON.stringify(updated))
    
    // 체크리스트 초기화
    const resetChecklist = defaultChecklist.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({ ...item, checked: false }))
    }))
    setChecklist(resetChecklist)
    setCheckDate(new Date().toISOString().split('T')[0])
    
    alert('건강 체크 기록이 저장되었습니다!')
  }

  const calculateScore = () => {
    const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0)
    const checkedItems = checklist.reduce((sum, cat) => 
      sum + cat.items.filter(item => item.checked).length, 0
    )
    return Math.round((checkedItems / totalItems) * 100)
  }

  const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedItems = checklist.reduce((sum, cat) => 
    sum + cat.items.filter(item => item.checked).length, 0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-pink-600 mr-3" />
            건강 체크리스트
          </h1>
          <p className="text-xl text-gray-600">
            일상적인 건강 상태를 정기적으로 체크하고 기록을 관리합니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                체크 날짜
              </label>
              <input
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">진행률</p>
              <p className="text-2xl font-bold text-pink-600">
                {checkedItems} / {totalItems}
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${(checkedItems / totalItems) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {checklist.map((category) => (
              <div key={category.id} className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(category.id, item.id)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-900'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={saveRecord}
            className="w-full mt-6 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>기록 저장하기</span>
          </button>
        </div>

        {/* 저장된 기록 */}
        {savedRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">과거 기록</h2>
            <div className="space-y-3">
              {savedRecords.slice().reverse().slice(0, 10).map((record, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{record.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">건강 점수:</span>
                      <span className={`text-xl font-bold ${
                        record.score >= 80 ? 'text-green-600' :
                        record.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {record.score}점
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 건강 체크 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 주 1-2회 정기적으로 건강 체크를 진행하세요</li>
            <li>• 이상 증상이 발견되면 즉시 수의사와 상담하세요</li>
            <li>• 기록을 통해 건강 상태의 변화 추이를 파악할 수 있습니다</li>
            <li>• 건강 점수가 60점 이하인 경우 주의가 필요합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

