'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, CheckSquare, Calendar, Save, ArrowLeft, Activity, AlertCircle, CheckCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface HealthCheckItem {
  id: string
  category: string
  items: {
    id: string
    label: string
    checked: boolean
  }[]
}

interface HealthCheckRecord {
  id: string
  date: string
  score: number
  issues: string[]
}

const defaultChecklist: HealthCheckItem[] = [
  {
    id: 'general',
    category: '일반 상태',
    items: [
      { id: 'appetite', label: '밥을 평소처럼 잘 먹나요?', checked: true },
      { id: 'water', label: '물 마시는 양이 적당한가요?', checked: true },
      { id: 'energy', label: '산책 시 활발하게 움직이나요?', checked: true },
      { id: 'sleep', label: '잠을 편안하게 잘 자나요?', checked: true }
    ]
  },
  {
    id: 'physical',
    category: '신체 상태',
    items: [
      { id: 'weight', label: '체중 변화가 없나요?', checked: true },
      { id: 'coat', label: '털에 윤기가 흐르나요?', checked: true },
      { id: 'skin', label: '피부에 붉은 반점이나 상처가 없나요?', checked: true },
      { id: 'eyes', label: '눈곱이나 충혈이 없나요?', checked: true },
      { id: 'ears', label: '귀에서 냄새가 나지 않나요?', checked: true },
      { id: 'teeth', label: '입 냄새가 심하지 않나요?', checked: true }
    ]
  },
  {
    id: 'excretion',
    category: '배변 상태',
    items: [
      { id: 'stool', label: '대변 모양과 색이 정상인가요?', checked: true },
      { id: 'urine', label: '소변 색이 맑고 투명한가요?', checked: true },
      { id: 'frequency', label: '배변 횟수가 규칙적인가요?', checked: true }
    ]
  }
]

export default function HealthChecklistPage() {
  const [checklist, setChecklist] = useState<HealthCheckItem[]>(defaultChecklist)
  const [checkDate, setCheckDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [savedRecords, setSavedRecords] = useState<HealthCheckRecord[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general')

  useEffect(() => {
    const saved = localStorage.getItem('healthCheckRecords')
    if (saved) {
      try {
        setSavedRecords(JSON.parse(saved))
      } catch (e) { }
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

  const calculateScore = () => {
    const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0)
    const checkedItems = checklist.reduce((sum, cat) =>
      sum + cat.items.filter(item => item.checked).length, 0
    )
    return Math.round((checkedItems / totalItems) * 100)
  }

  const getUncheckedItems = () => {
    const issues: string[] = []
    checklist.forEach(cat => {
      cat.items.forEach(item => {
        if (!item.checked) issues.push(item.label)
      })
    })
    return issues
  }

  const saveRecord = () => {
    const score = calculateScore()
    const issues = getUncheckedItems()

    const record: HealthCheckRecord = {
      id: `${Date.now()}`,
      date: checkDate,
      score,
      issues
    }

    const updated = [record, ...savedRecords]
    setSavedRecords(updated)
    localStorage.setItem('healthCheckRecords', JSON.stringify(updated))

    // Reset checklist to all true (default healthy state assumption for next check)
    // Or keep current state? Let's reset to default.
    setChecklist(defaultChecklist)
    setCheckDate(new Date().toISOString().split('T')[0])

    alert('건강 상태가 기록되었습니다.')
  }

  const deleteRecord = (id: string) => {
    const updated = savedRecords.filter(r => r.id !== id)
    setSavedRecords(updated)
    localStorage.setItem('healthCheckRecords', JSON.stringify(updated))
  }

  const currentScore = calculateScore()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
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
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">데일리 건강 체크</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            매일매일 체크하는 작은 습관이 우리 아이의 건강을 지킵니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2 text-red-500" />
                  건강 상태 체크
                </h2>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-4">
                {checklist.map((category) => (
                  <div key={category.id} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-bold text-gray-900">{category.category}</span>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedCategory === category.id && (
                      <div className="p-4 space-y-3 bg-white">
                        {category.items.map((item) => (
                          <label
                            key={item.id}
                            className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${item.checked
                                ? 'bg-green-50 border-green-100'
                                : 'bg-red-50 border-red-100'
                              }`}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${item.checked
                                ? 'border-green-500 bg-green-500 text-white'
                                : 'border-red-300 bg-white'
                              }`}>
                              {item.checked && <CheckCircle className="w-4 h-4" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItem(category.id, item.id)}
                              className="hidden"
                            />
                            <span className={`flex-1 font-medium ${item.checked ? 'text-green-900' : 'text-red-900'}`}>
                              {item.label}
                            </span>
                            <span className={`text-sm font-bold ${item.checked ? 'text-green-600' : 'text-red-500'}`}>
                              {item.checked ? '양호' : '주의'}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block">현재 건강 점수</span>
                    <span className={`text-3xl font-black ${currentScore >= 80 ? 'text-green-500' :
                        currentScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                      {currentScore}점
                    </span>
                  </div>
                </div>
                <button
                  onClick={saveRecord}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-bold flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  기록 저장
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: History & Tips */}
          <div className="space-y-6">
            {/* Recent History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                최근 기록
              </h2>

              <div className="space-y-4">
                {savedRecords.length > 0 ? (
                  savedRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="group relative bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">{record.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${record.score >= 80 ? 'bg-green-100 text-green-700' :
                            record.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {record.score}점
                        </span>
                      </div>
                      {record.issues.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-xs text-red-500 font-bold mb-1">주의 항목:</p>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {record.issues.slice(0, 2).map((issue, idx) => (
                              <li key={idx} className="truncate">• {issue}</li>
                            ))}
                            {record.issues.length > 2 && (
                              <li className="text-gray-400">+ {record.issues.length - 2}개 더보기</li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-xs text-green-600 mt-2 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          모든 상태 양호
                        </p>
                      )}
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    아직 기록이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-red-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                체크 포인트
              </h3>
              <ul className="space-y-3 text-red-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  식욕 부진이 24시간 이상 지속되면 병원에 가야 합니다.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  갑작스러운 체중 변화는 질병의 신호일 수 있습니다.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  잇몸 색깔이 너무 창백하거나 붉지 않은지 확인하세요.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
