'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle, Clock, Users, Heart, ArrowLeft, Volume2, TreePine, Dog, Info, ChevronDown, ChevronUp } from 'lucide-react'

interface SocializationTask {
  id: string
  week: number
  title: string
  desc: string
  category: 'people' | 'environment' | 'sound' | 'animal'
  completed: boolean
  tips: string[]
}

export default function PuppySocializationSchedulePage() {
  const [tasks, setTasks] = useState<SocializationTask[]>([
    // 8-12주
    { id: '1', week: 8, title: '가족과 친해지기', desc: '구성원 한 명씩 부드럽게 스킨십하며 신뢰 쌓기', category: 'people', completed: false, tips: ['낮은 자세로 다가가세요.', '눈을 빤히 쳐다보지 마세요.'] },
    { id: '2', week: 9, title: '집안 소리 적응', desc: '청소기, 드라이기 등 생활 소음 들려주기', category: 'sound', completed: false, tips: ['멀리서 작게 시작하세요.', '소리가 날 때 간식을 주세요.'] },
    { id: '3', week: 10, title: '다양한 바닥 밟기', desc: '타일, 카펫, 잔디 등 다양한 감촉 경험하기', category: 'environment', completed: false, tips: ['미끄러운 바닥은 주의하세요.', '스스로 걷도록 유도하세요.'] },
    { id: '4', week: 11, title: '낯선 사람 관찰', desc: '산책하며 지나가는 사람들 구경하기', category: 'people', completed: false, tips: ['무리하게 인사시키지 마세요.', '안전한 거리에서 관찰하세요.'] },
    { id: '5', week: 12, title: '친구 강아지 인사', desc: '성격 좋은 백신 완료 강아지와 짧은 만남', category: 'animal', completed: false, tips: ['상대 견주에게 먼저 양해를 구하세요.', '목줄을 팽팽하게 당기지 마세요.'] },
    // 13-16주
    { id: '6', week: 13, title: '도시 소음 듣기', desc: '자동차, 오토바이 소리 등에 둔감화하기', category: 'sound', completed: false, tips: ['유튜브로 소리를 들려줘도 좋아요.', '놀라지 않으면 칭찬해주세요.'] },
    { id: '7', week: 14, title: '새로운 장소 방문', desc: '애견 카페나 공원 등 낯선 환경 가보기', category: 'environment', completed: false, tips: ['사람이 적은 시간대를 이용하세요.', '자신의 냄새가 묻은 담요를 챙기세요.'] },
    { id: '8', week: 15, title: '다양한 복장 보기', desc: '모자, 선글라스, 우산 쓴 사람 보기', category: 'people', completed: false, tips: ['집에서 보호자가 먼저 착용해보세요.', '이상한 것이 아니라고 알려주세요.'] },
    { id: '9', week: 16, title: '움직이는 물체', desc: '자전거, 킥보드, 유모차 등 움직임 관찰', category: 'environment', completed: false, tips: ['쫓아가려 하면 제지하세요.', '차분히 앉아서 구경시키세요.'] }
  ])

  const [expandedWeek, setExpandedWeek] = useState<number | null>(8)

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'people': return <Users className="w-4 h-4" />
      case 'environment': return <TreePine className="w-4 h-4" />
      case 'sound': return <Volume2 className="w-4 h-4" />
      case 'animal': return <Dog className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'people': return '사람'
      case 'environment': return '환경'
      case 'sound': return '소리'
      case 'animal': return '동물'
      default: return '기타'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'people': return 'bg-blue-100 text-blue-700'
      case 'environment': return 'bg-green-100 text-green-700'
      case 'sound': return 'bg-yellow-100 text-yellow-700'
      case 'animal': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Group tasks by week range
  const weeks = [8, 9, 10, 11, 12, 13, 14, 15, 16]

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
              <Calendar className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">퍼피 사회화 스케줄</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            생후 3~4개월, 강아지의 평생 성격을 결정짓는 골든타임입니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                주차별 미션
              </h2>

              <div className="space-y-4">
                {weeks.map((week) => {
                  const weekTasks = tasks.filter(t => t.week === week)
                  if (weekTasks.length === 0) return null

                  const isExpanded = expandedWeek === week
                  const completedCount = weekTasks.filter(t => t.completed).length
                  const totalCount = weekTasks.length

                  return (
                    <div key={week} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedWeek(isExpanded ? null : week)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${isExpanded ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${completedCount === totalCount
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                            {week}주
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-900">
                              {week <= 12 ? '사회화 초기 (적응기)' : '사회화 중기 (탐험기)'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {completedCount}/{totalCount} 완료
                            </div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2">
                          {weekTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${task.completed
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-100 hover:border-blue-200'
                                }`}
                              onClick={() => toggleTask(task.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                  }`}>
                                  {task.completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${getCategoryColor(task.category)}`}>
                                      {getCategoryIcon(task.category)}
                                      {getCategoryLabel(task.category)}
                                    </span>
                                    <h4 className={`font-bold ${task.completed ? 'text-blue-900' : 'text-gray-900'}`}>
                                      {task.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{task.desc}</p>
                                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                    <span className="font-bold text-blue-500 mr-1">TIP</span>
                                    {task.tips[0]}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Guide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">전체 진행률</h2>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      진행중
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                  <div style={{ width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                {['people', 'environment', 'sound', 'animal'].map(cat => {
                  const catTasks = tasks.filter(t => t.category === cat)
                  const catCompleted = catTasks.filter(t => t.completed).length
                  return (
                    <div key={cat} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 text-gray-500">
                        {getCategoryIcon(cat)}
                        <span className="text-xs font-bold">{getCategoryLabel(cat)}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {catCompleted}/{catTasks.length}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Guide Box */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-400" />
                사회화 핵심 원칙
              </h3>
              <ul className="space-y-4 text-indigo-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">1.</span>
                  <span>
                    <strong className="text-white">긍정 경험</strong><br />
                    무서워하면 즉시 멈추고 거리를 두세요. 간식으로 좋은 기억을 심어주세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">2.</span>
                  <span>
                    <strong className="text-white">스스로 다가가게</strong><br />
                    억지로 안아서 보여주거나 만지게 하지 마세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400 font-bold">3.</span>
                  <span>
                    <strong className="text-white">다양성</strong><br />
                    매일 조금씩 다른 장소, 다른 소리를 경험시켜주세요.
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
