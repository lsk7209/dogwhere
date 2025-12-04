'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Clock, ArrowLeft, Eye, Bone, Scale, Pill, CheckCircle, Calendar, Activity, AlertCircle } from 'lucide-react'

interface CareTask {
  id: string
  title: string
  desc: string
  frequency: 'daily' | 'weekly' | 'monthly'
  icon: any
  completed: boolean
}

export default function SeniorCarePlannerPage() {
  const [tasks, setTasks] = useState<CareTask[]>([
    { id: '1', title: '관절 마사지', desc: '다리와 허리를 부드럽게 마사지', frequency: 'daily', icon: Bone, completed: false },
    { id: '2', title: '눈 건강 체크', desc: '충혈이나 눈꼽, 백내장 확인', frequency: 'daily', icon: Eye, completed: false },
    { id: '3', title: '영양제 급여', desc: '관절/심장 등 처방 영양제', frequency: 'daily', icon: Pill, completed: false },
    { id: '4', title: '체중 측정', desc: '급격한 체중 변화 확인', frequency: 'weekly', icon: Scale, completed: false },
    { id: '5', title: '심박수 체크', desc: '편안한 상태에서 1분간 측정', frequency: 'weekly', icon: Heart, completed: false },
    { id: '6', title: '정기 건강검진', desc: '혈액검사 및 초음파', frequency: 'monthly', icon: Activity, completed: false }
  ])

  const [selectedFreq, setSelectedFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const filteredTasks = tasks.filter(t => t.frequency === selectedFreq)
  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <Heart className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">시니어 케어 플래너</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            나이 든 반려견의 하루는 더 세심한 관심이 필요합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                  케어 체크리스트
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['daily', 'weekly', 'monthly'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setSelectedFreq(freq as any)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedFreq === freq
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {freq === 'daily' ? '매일' : freq === 'weekly' ? '주간' : '월간'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${task.completed
                          ? 'border-purple-200 bg-purple-50/50'
                          : 'border-gray-100 hover:border-purple-200 bg-white'
                        }`}
                    >
                      <div className={`p-3 rounded-full ${task.completed ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                        <task.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${task.completed ? 'text-purple-900' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500">{task.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                        }`}>
                        {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    해당 기간의 할 일이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Guide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">오늘의 케어 점수</h2>
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
                      stroke="#9333ea"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
                      className="transition-all duration-1000 ease-out rounded-full"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black text-gray-900">
                      {progress}
                    </span>
                    <span className="text-sm text-gray-500">점</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">
                꾸준한 관리가 건강한 노후를 만듭니다.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-purple-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-purple-400" />
                노령견 주의 신호
              </h3>
              <ul className="space-y-4 text-purple-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">음수량 변화</strong><br />
                    갑자기 물을 많이 마시거나 적게 마시면 신장 질환을 의심해보세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">호흡수 증가</strong><br />
                    편안히 쉴 때 호흡이 빠르다면 심장 체크가 필요합니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">방향 감각 상실</strong><br />
                    구석에 갇히거나 멍하니 있다면 인지기능 장애일 수 있습니다.
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
