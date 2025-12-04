'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Syringe, CheckCircle, Clock, AlertTriangle, Calendar, ArrowLeft, ShieldCheck, FileText, Info } from 'lucide-react'

interface VaccineRound {
  id: number
  title: string
  age: string
  items: string[]
  completedDate?: string
  status: 'completed' | 'upcoming' | 'overdue'
}

export default function PuppyVaccinationTrackerPage() {
  const [rounds, setRounds] = useState<VaccineRound[]>([
    { id: 1, title: '1차 접종', age: '생후 6주', items: ['종합백신(DHPPL)', '코로나 장염'], status: 'completed', completedDate: '2023-10-01' },
    { id: 2, title: '2차 접종', age: '생후 8주', items: ['종합백신(DHPPL)', '코로나 장염'], status: 'upcoming' },
    { id: 3, title: '3차 접종', age: '생후 10주', items: ['종합백신(DHPPL)', '켄넬코프'], status: 'upcoming' },
    { id: 4, title: '4차 접종', age: '생후 12주', items: ['종합백신(DHPPL)', '켄넬코프'], status: 'upcoming' },
    { id: 5, title: '5차 접종', age: '생후 14주', items: ['종합백신(DHPPL)', '인플루엔자'], status: 'upcoming' },
    { id: 6, title: '6차 접종', age: '생후 16주', items: ['광견병', '인플루엔자', '항체검사'], status: 'upcoming' }
  ])

  const [selectedRound, setSelectedRound] = useState<number | null>(null)

  const toggleComplete = (id: number) => {
    const today = new Date().toISOString().split('T')[0]
    setRounds(rounds.map(r => {
      if (r.id === id) {
        if (r.status === 'completed') {
          return { ...r, status: 'upcoming', completedDate: undefined }
        } else {
          return { ...r, status: 'completed', completedDate: today }
        }
      }
      return r
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-teal-100 text-teal-700 border-teal-200'
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />
      case 'overdue': return <AlertTriangle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">예방접종 스케줄러</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 아이의 건강을 지키는 첫걸음, 예방접종 일정을 관리하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Syringe className="w-5 h-5 mr-2 text-teal-500" />
                기초 접종 일정
              </h2>

              <div className="space-y-4 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                {rounds.map((round) => (
                  <div key={round.id} className="relative pl-16">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 text-center">
                      <span className="text-xs font-bold text-gray-400 block mb-1">{round.age}</span>
                      <div className={`w-4 h-4 rounded-full border-2 mx-auto bg-white ${round.status === 'completed' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                        }`} />
                    </div>

                    <div
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${round.status === 'completed'
                          ? 'border-teal-200 bg-teal-50/30'
                          : 'border-gray-100 bg-white hover:border-teal-200'
                        }`}
                      onClick={() => toggleComplete(round.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className={`font-bold text-lg ${round.status === 'completed' ? 'text-teal-900' : 'text-gray-900'}`}>
                            {round.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {round.items.map((item, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 font-medium">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(round.status)}`}>
                          {getStatusIcon(round.status)}
                          {round.status === 'completed' ? '접종완료' : '접종예정'}
                        </div>
                      </div>

                      {round.completedDate && (
                        <div className="text-xs text-teal-600 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {round.completedDate} 완료
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">접종 현황</h2>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - rounds.filter(r => r.status === 'completed').length / rounds.length)}
                      className="transition-all duration-1000 ease-out rounded-full"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black text-gray-900">
                      {Math.round((rounds.filter(r => r.status === 'completed').length / rounds.length) * 100)}%
                    </span>
                    <span className="text-sm text-gray-500">완료</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                총 {rounds.length}회 중 {rounds.filter(r => r.status === 'completed').length}회 완료
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-teal-400" />
                접종 전 체크리스트
              </h3>
              <ul className="space-y-4 text-teal-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-teal-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">컨디션 확인</strong><br />
                    설사, 구토, 식욕부진이 있다면 미루세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">목욕 금지</strong><br />
                    접종 전후 2-3일은 목욕을 피해주세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-teal-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">오전 방문</strong><br />
                    부작용 발생 시 대처하기 위해 오전에 가세요.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}