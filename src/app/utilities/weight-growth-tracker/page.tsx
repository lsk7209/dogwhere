'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Scale, Baby, ArrowUpRight, Activity, ArrowLeft, Plus, Calendar } from 'lucide-react'

interface Record {
  id: string
  date: string
  weight: number
  age: number // months
}

export default function WeightGrowthTrackerPage() {
  const [records, setRecords] = useState<Record[]>([
    { id: '1', date: '2023-08-01', weight: 2.5, age: 3 },
    { id: '2', date: '2023-09-01', weight: 3.8, age: 4 },
    { id: '3', date: '2023-10-01', weight: 5.2, age: 5 },
    { id: '4', date: '2023-11-01', weight: 6.5, age: 6 },
  ])
  const [newWeight, setNewWeight] = useState<number>(0)
  const [newAge, setNewAge] = useState<number>(0)

  const addRecord = () => {
    if (!newWeight || !newAge) return
    const record: Record = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: newWeight,
      age: newAge
    }
    setRecords([...records, record].sort((a, b) => a.age - b.age))
    setNewWeight(0)
    setNewAge(0)
  }

  const currentWeight = records[records.length - 1]?.weight || 0
  const prevWeight = records[records.length - 2]?.weight || 0
  const growthRate = prevWeight ? ((currentWeight - prevWeight) / prevWeight * 100).toFixed(1) : 0

  // Simple SVG Graph Calculation
  const maxWeight = Math.max(...records.map(r => r.weight), 10)
  const points = records.map((r, i) => {
    const x = (i / (records.length - 1 || 1)) * 100
    const y = 100 - (r.weight / maxWeight * 100)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">성장 기록장</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            하루가 다르게 크는 우리 아이, 소중한 성장의 순간을 기록하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Stats */}
            <div className="bg-green-900 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-green-400" />
                  현재 체중
                </h3>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
                  {records[records.length - 1]?.age}개월차
                </span>
              </div>

              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black">{currentWeight}</span>
                <span className="text-xl text-green-300 mb-2">kg</span>
              </div>

              <div className="flex items-center gap-2 text-green-200 text-sm bg-white/5 p-3 rounded-xl">
                <ArrowUpRight className="w-4 h-4" />
                지난달 대비 <span className="font-bold text-white">+{growthRate}%</span> 성장
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-green-500" />
                기록 추가
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">나이 (개월)</label>
                  <input
                    type="number"
                    value={newAge || ''}
                    onChange={(e) => setNewAge(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                    placeholder="예: 7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">몸무게 (kg)</label>
                  <input
                    type="number"
                    value={newWeight || ''}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-green-500"
                    placeholder="예: 5.5"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Chart & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" />
                성장 그래프
              </h2>

              <div className="h-64 w-full relative border-l border-b border-gray-100">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#f3f4f6" strokeWidth="1" />
                  ))}

                  {/* Data Line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                  />

                  {/* Data Points */}
                  {records.map((r, i) => {
                    const x = (i / (records.length - 1 || 1)) * 100
                    const y = 100 - (r.weight / maxWeight * 100)
                    return (
                      <g key={r.id}>
                        <circle cx={`${x}%`} cy={`${y}%`} r="6" fill="white" stroke="#16a34a" strokeWidth="3" />
                        <text x={`${x}%`} y={`${y}%`} dy="-15" textAnchor="middle" className="text-xs font-bold fill-gray-600">
                          {r.weight}kg
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400">
                {records.map((r) => (
                  <span key={r.id}>{r.age}개월</span>
                ))}
              </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">히스토리</h3>
              <div className="space-y-2">
                {[...records].reverse().map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{record.date}</div>
                        <div className="text-xs text-gray-500">{record.age}개월차 기록</div>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {record.weight}kg
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
