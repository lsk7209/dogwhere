'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Syringe, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react'

interface Vaccination {
  id: string
  name: string
  date: string
  nextDate: string
  cycle: number // 주기 (개월)
}

export default function VaccinationSchedulerPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    date: '',
    cycle: 1
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('vaccinationSchedule')
    if (saved) {
      try {
        setVaccinations(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (vaccinations.length > 0) {
      localStorage.setItem('vaccinationSchedule', JSON.stringify(vaccinations))
    }
  }, [vaccinations])

  const addVaccination = () => {
    if (!newVaccination.name || !newVaccination.date) return

    const date = new Date(newVaccination.date)
    const nextDate = new Date(date)
    nextDate.setMonth(nextDate.getMonth() + newVaccination.cycle)

    const vaccination: Vaccination = {
      id: Date.now().toString(),
      name: newVaccination.name,
      date: newVaccination.date,
      nextDate: nextDate.toISOString().split('T')[0],
      cycle: newVaccination.cycle
    }

    setVaccinations([...vaccinations, vaccination])
    setNewVaccination({ name: '', date: '', cycle: 1 })
    setShowForm(false)
  }

  const deleteVaccination = (id: string) => {
    setVaccinations(vaccinations.filter(v => v.id !== id))
  }

  const getDaysUntilNext = (nextDate: string) => {
    const today = new Date()
    const next = new Date(nextDate)
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Syringe className="w-10 h-10 text-green-600 mr-3" />
            예방접종 일정 관리자
          </h1>
          <p className="text-xl text-gray-600">
            반려견 예방접종 일정을 관리하고 다음 접종일을 알림받습니다
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">예방접종 기록</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>추가하기</span>
            </button>
          </div>

          {showForm && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">새 예방접종 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    접종명
                  </label>
                  <input
                    type="text"
                    value={newVaccination.name}
                    onChange={(e) => setNewVaccination({ ...newVaccination, name: e.target.value })}
                    placeholder="예: 종합예방접종, 광견병 등"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    접종일
                  </label>
                  <input
                    type="date"
                    value={newVaccination.date}
                    onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    재접종 주기 (개월)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newVaccination.cycle}
                    onChange={(e) => setNewVaccination({ ...newVaccination, cycle: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={addVaccination}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {vaccinations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 예방접종이 없습니다
            </div>
          ) : (
            <div className="space-y-4">
              {vaccinations.map((vac) => {
                const daysUntil = getDaysUntilNext(vac.nextDate)
                const isUpcoming = daysUntil <= 30 && daysUntil >= 0
                const isOverdue = daysUntil < 0

                return (
                  <div
                    key={vac.id}
                    className={`border-2 rounded-lg p-6 ${
                      isOverdue ? 'border-red-300 bg-red-50' :
                      isUpcoming ? 'border-yellow-300 bg-yellow-50' :
                      'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{vac.name}</h3>
                          {isOverdue && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                              접종 필요
                            </span>
                          )}
                          {isUpcoming && !isOverdue && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              접종 예정
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>마지막 접종일: {vac.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>다음 접종일: {vac.nextDate}</span>
                          </div>
                          {isOverdue && (
                            <div className="flex items-center space-x-2 text-red-600 font-medium mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>{Math.abs(daysUntil)}일 지났습니다</span>
                            </div>
                          )}
                          {isUpcoming && !isOverdue && (
                            <div className="flex items-center space-x-2 text-yellow-600 font-medium mt-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>{daysUntil}일 후 접종 예정</span>
                            </div>
                          )}
                          {!isUpcoming && !isOverdue && daysUntil > 30 && (
                            <div className="text-gray-500 mt-2">
                              {daysUntil}일 후 접종 예정
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteVaccination(vac.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 예방접종 정보</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 일반적으로 강아지는 생후 6-8주부터 예방접종을 시작합니다</li>
            <li>• 종합예방접종은 보통 매년 또는 3년마다 접종합니다</li>
            <li>• 광견병 예방접종은 법적으로 의무입니다</li>
            <li>• 정확한 접종 일정은 수의사와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

