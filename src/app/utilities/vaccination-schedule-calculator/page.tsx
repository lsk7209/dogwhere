'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Syringe, Calendar, ArrowLeft, ShieldCheck, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface Vaccination {
  id: string
  name: string
  desc: string
  weeks: number // age in weeks
  isMandatory: boolean
}

export default function VaccinationScheduleCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>('')

  const vaccinations: Vaccination[] = [
    { id: '1', name: '종합백신 1차', desc: 'DHPPL + 코로나 장염', weeks: 6, isMandatory: true },
    { id: '2', name: '종합백신 2차', desc: 'DHPPL + 코로나 장염', weeks: 8, isMandatory: true },
    { id: '3', name: '종합백신 3차', desc: 'DHPPL + 켄넬코프', weeks: 10, isMandatory: true },
    { id: '4', name: '종합백신 4차', desc: 'DHPPL + 켄넬코프', weeks: 12, isMandatory: true },
    { id: '5', name: '종합백신 5차', desc: 'DHPPL + 인플루엔자', weeks: 14, isMandatory: true },
    { id: '6', name: '광견병', desc: '광견병 + 인플루엔자', weeks: 16, isMandatory: true },
  ]

  const calculateDate = (weeks: number) => {
    if (!birthDate) return null
    const date = new Date(birthDate)
    date.setDate(date.getDate() + (weeks * 7))
    return date
  }

  const getStatus = (date: Date | null) => {
    if (!date) return 'pending'
    const today = new Date()
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diff < -7) return 'overdue' // 1 week past
    if (diff < 0) return 'due' // passed but recent
    if (diff < 14) return 'upcoming' // within 2 weeks
    return 'future'
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-teal-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
              <Syringe className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">예방접종 스케줄러</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            생년월일만 입력하면 우리 아이의 평생 건강 지킴이 일정이 완성됩니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-teal-500" />
                기본 정보
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  * 정확한 날짜를 모른다면 추정일로 입력해주세요.
                </p>
              </div>
            </div>

            <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-teal-400" />
                접종 전 체크리스트
              </h3>
              <ul className="space-y-4 text-teal-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  컨디션이 좋은 날 오전에 접종하세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  접종 후 2-3일은 목욕을 피해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  구토, 설사 등 부작용을 관찰하세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-500" />
                접종 타임라인
              </h2>

              {!birthDate ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>생년월일을 입력하면 일정이 표시됩니다.</p>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                  {vaccinations.map((vacc) => {
                    const date = calculateDate(vacc.weeks)
                    const status = getStatus(date)

                    return (
                      <div key={vacc.id} className="relative pl-20">
                        {/* Timeline Node */}
                        <div className={`absolute left-0 top-0 w-16 text-right`}>
                          <span className="text-xs font-bold text-gray-400 block mb-1">{vacc.weeks}주차</span>
                          <div className={`absolute right-[-21px] top-1.5 w-3 h-3 rounded-full border-2 bg-white z-10 ${status === 'overdue' ? 'border-red-500' :
                              status === 'due' ? 'border-orange-500' :
                                status === 'upcoming' ? 'border-teal-500' : 'border-gray-300'
                            }`} />
                        </div>

                        {/* Card */}
                        <div className={`p-5 rounded-xl border transition-all ${status === 'overdue' ? 'border-red-200 bg-red-50/50' :
                            status === 'due' ? 'border-orange-200 bg-orange-50/50' :
                              status === 'upcoming' ? 'border-teal-200 bg-teal-50/50 shadow-md transform scale-[1.02]' :
                                'border-gray-100 bg-white'
                          }`}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                {vacc.name}
                                {status === 'upcoming' && (
                                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                                    접종 예정
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">{vacc.desc}</p>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-sm ${status === 'overdue' ? 'text-red-600' :
                                  status === 'due' ? 'text-orange-600' :
                                    status === 'upcoming' ? 'text-teal-600' : 'text-gray-400'
                                }`}>
                                {formatDate(date)}
                              </div>
                              {status === 'overdue' && (
                                <div className="text-xs text-red-500 flex items-center justify-end gap-1 mt-1">
                                  <AlertCircle className="w-3 h-3" /> 지남
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
