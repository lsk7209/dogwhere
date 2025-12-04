'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle, AlertTriangle, Heart, Users, ArrowLeft, Calendar, Activity, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

interface AgingCareTask {
  id: string
  name: string
  description: string
  category: 'physical' | 'mental' | 'medical' | 'environmental' | 'nutritional'
  priority: 'high' | 'medium' | 'low'
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
}

interface AgingRecord {
  id: string
  date: string
  task: string
  duration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogAgingCarePage() {
  const [tasks, setTasks] = useState<AgingCareTask[]>([])
  const [records, setRecords] = useState<AgingRecord[]>([])
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    duration: 15,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: AgingCareTask[] = [
    {
      id: '1',
      name: '일일 건강 체크',
      description: '매일 아침 눈, 귀, 입, 피부 상태를 확인합니다.',
      category: 'physical',
      priority: 'high',
      frequency: 'daily',
      steps: [
        '눈꼽이나 충혈 여부 확인',
        '귀 냄새 및 분비물 체크',
        '잇몸 색깔 및 치석 확인',
        '몸 전체를 쓰다듬으며 혹이나 상처 확인'
      ],
      tips: [
        '간식을 주며 긍정적인 경험으로 만들어주세요.',
        '이전과 다른 변화가 있다면 사진을 찍어두세요.'
      ],
      completed: false
    },
    {
      id: '4',
      name: '인지 기능 자극',
      description: '치매 예방을 위한 두뇌 활동 시간입니다.',
      category: 'mental',
      priority: 'high',
      frequency: 'daily',
      steps: [
        '노즈워크 장난감에 간식 숨기기',
        '새로운 산책 경로 탐색하기',
        '간단한 트릭 훈련 복습하기'
      ],
      tips: [
        '너무 어려운 과제는 스트레스를 줄 수 있습니다.',
        '성공하면 충분히 칭찬해주세요.'
      ],
      completed: false
    },
    {
      id: '6',
      name: '생활 환경 점검',
      description: '미끄럼 방지 및 안전한 환경을 유지합니다.',
      category: 'environmental',
      priority: 'medium',
      frequency: 'weekly',
      steps: [
        '미끄럼 방지 매트 상태 확인',
        '가구 모서리 보호대 점검',
        '물그릇/밥그릇 높이 조절 확인'
      ],
      tips: [
        '관절 보호를 위해 바닥이 미끄럽지 않게 해주세요.',
        '시력이 나빠질 수 있으니 가구 위치를 자주 바꾸지 마세요.'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('agingCareTasks')
    const savedRecords = localStorage.getItem('agingRecords')

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        setTasks(initialTasks)
      }
    } else {
      setTasks(initialTasks)
    }

    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) { }
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('agingCareTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('agingRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
          ...task,
          completed: !task.completed,
          date: !task.completed ? new Date().toISOString().split('T')[0] : undefined
        }
        : task
    ))
  }

  const addRecord = () => {
    if (!newRecord.task) return

    const record: AgingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      duration: 15,
      result: 'good',
      notes: ''
    })
  }

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('agingRecords', JSON.stringify(updated))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-red-600 bg-red-50 border-red-100'
      case 'mental': return 'text-blue-600 bg-blue-50 border-blue-100'
      case 'medical': return 'text-green-600 bg-green-50 border-green-100'
      case 'environmental': return 'text-purple-600 bg-purple-50 border-purple-100'
      case 'nutritional': return 'text-orange-600 bg-orange-50 border-orange-100'
      default: return 'text-gray-600 bg-gray-50 border-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'physical': return '신체 건강'
      case 'mental': return '정신 건강'
      case 'medical': return '의료 관리'
      case 'environmental': return '환경 관리'
      case 'nutritional': return '영양 관리'
      default: return category
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    records: records.length
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-slate-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">노화 케어 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            노령견의 건강하고 행복한 삶을 위한 체계적인 관리 시스템입니다.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">전체 과제</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}개</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">완료됨</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}개</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">중요 관리</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.highPriority}개</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">기록 수</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.records}건</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Tasks */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-slate-500" />
                케어 체크리스트
              </h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border-2 rounded-xl transition-all ${task.completed ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-white'
                      }`}
                  >
                    <div className="p-4 flex items-start gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400 text-transparent'
                          }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(task.category)}`}>
                            {getCategoryText(task.category)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                        <button
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                          className="text-sm text-slate-600 font-medium flex items-center hover:text-slate-800"
                        >
                          {expandedTask === task.id ? (
                            <>접기 <ChevronUp className="w-4 h-4 ml-1" /></>
                          ) : (
                            <>상세 보기 <ChevronDown className="w-4 h-4 ml-1" /></>
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedTask === task.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100 mt-2">
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 mb-2">체크 포인트</h4>
                            <ul className="space-y-1">
                              {task.steps.map((step, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <span className="mr-2 text-slate-400">•</span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 mb-2">관리 팁</h4>
                            <ul className="space-y-1">
                              {task.tips.map((tip, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <span className="mr-2 text-slate-400">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Records */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-slate-500" />
                케어 기록하기
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관리 항목</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({ ...newRecord, task: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="">선택하세요</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.name}>{task.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    rows={2}
                    placeholder="특이사항을 기록해주세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                  />
                </div>

                <button
                  onClick={addRecord}
                  disabled={!newRecord.task}
                  className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  기록 저장
                </button>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">최근 기록</h3>
                <div className="space-y-3">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="bg-gray-50 rounded-xl p-4 flex justify-between items-start group">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{record.task}</span>
                          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{record.date}</span>
                        </div>
                        {record.notes && <p className="text-sm text-gray-600">{record.notes}</p>}
                      </div>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">아직 기록이 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}