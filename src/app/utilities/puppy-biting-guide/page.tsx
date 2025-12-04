'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, Heart, Users, ArrowLeft, Bone, Shield, Hand, Zap, Info, ChevronRight } from 'lucide-react'

interface BitingProblem {
  id: string
  name: string
  desc: string
  severity: 'mild' | 'moderate' | 'severe'
  solution: string
  completed: boolean
}

export default function PuppyBitingGuidePage() {
  const [problems, setProblems] = useState<BitingProblem[]>([
    { id: '1', name: '놀이 중 물기', desc: '놀다가 흥분해서 손이나 발을 무는 경우', severity: 'mild', solution: '즉시 놀이를 중단하고 등을 돌려 무시하세요. 얌전해지면 다시 놀아줍니다.', completed: false },
    { id: '2', name: '손가락 물기', desc: '손가락을 장난감처럼 씹으려는 경우', severity: 'moderate', solution: '손 대신 터그나 인형 등 물어도 되는 장난감을 입에 물려주세요.', completed: false },
    { id: '3', name: '발목 쫓아오며 물기', desc: '걸을 때 발뒤꿈치나 바짓단을 무는 경우', severity: 'moderate', solution: '제자리에 멈춰서 반응하지 마세요. 움직임을 멈추면 재미가 없어져 그만둡니다.', completed: false },
    { id: '4', name: '가구/물건 씹기', desc: '이갈이 시기에 가구나 전선을 씹는 경우', severity: 'severe', solution: '기피제를 뿌리거나 울타리로 접근을 막고, 씹기 좋은 우드스틱을 제공하세요.', completed: false }
  ])

  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)

  const toggleComplete = (id: string) => {
    setProblems(problems.map(p => p.id === id ? { ...p, completed: !p.completed } : p))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-700 border-green-200'
      case 'moderate': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'severe': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return '경미함'
      case 'moderate': return '주의'
      case 'severe': return '심각'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
              <Bone className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">입질 교정 가이드</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            이갈이 시기 강아지의 입질, 올바른 대처로 예쁜 습관을 만들어주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Problem List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                입질 유형 체크리스트
              </h2>

              <div className="space-y-4">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${selectedProblem === problem.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 hover:border-orange-200 bg-white'
                      }`}
                    onClick={() => setSelectedProblem(problem.id === selectedProblem ? null : problem.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleComplete(problem.id)
                          }}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${problem.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                            }`}
                        >
                          {problem.completed && <CheckCircle className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{problem.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(problem.severity)}`}>
                              {getSeverityLabel(problem.severity)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{problem.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedProblem === problem.id ? 'rotate-90' : ''}`} />
                    </div>

                    {selectedProblem === problem.id && (
                      <div className="mt-4 pl-10 pt-4 border-t border-orange-200/50 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-white rounded-lg p-4 border border-orange-100">
                          <h4 className="font-bold text-orange-600 mb-2 flex items-center text-sm">
                            <Shield className="w-4 h-4 mr-2" />
                            솔루션
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {problem.solution}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Guide & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">교정 진행률</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 * (1 - problems.filter(p => p.completed).length / problems.length)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black text-gray-900">
                      {Math.round((problems.filter(p => p.completed).length / problems.length) * 100)}%
                    </span>
                    <span className="text-xs text-gray-500">완료</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">
                꾸준한 훈련만이<br />입질을 고칠 수 있습니다.
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-orange-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-400" />
                훈련 핵심 원칙
              </h3>
              <ul className="space-y-4 text-orange-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-orange-400 font-bold">1.</span>
                  <span>
                    <strong className="text-white">무반응이 답이다</strong><br />
                    소리를 지르거나 밀치면 놀이로 착각할 수 있습니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-400 font-bold">2.</span>
                  <span>
                    <strong className="text-white">대체재 제공</strong><br />
                    '안돼'라고만 하지 말고 물어도 되는 것을 주세요.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-orange-400 font-bold">3.</span>
                  <span>
                    <strong className="text-white">타임아웃</strong><br />
                    흥분이 가라앉지 않으면 1-2분간 격리하세요.
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