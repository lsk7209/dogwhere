'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, CheckCircle, Clock, ArrowLeft, Lock, Unlock, Coffee, Play, Pause, RotateCcw, Info } from 'lucide-react'

interface TrainingStep {
  id: number
  title: string
  desc: string
  tips: string[]
  completed: boolean
}

export default function PuppyCrateTrainingPage() {
  const [steps, setSteps] = useState<TrainingStep[]>([
    {
      id: 1,
      title: '친해지기',
      desc: '켄넬 문을 열어두고 간식을 안쪽에 던져주세요. 스스로 들어갔다 나오는 경험을 반복합니다.',
      tips: ['억지로 밀어 넣지 마세요.', '가장 좋아하는 간식을 사용하세요.'],
      completed: false
    },
    {
      id: 2,
      title: '식사하기',
      desc: '밥그릇을 켄넬 안에 넣어주세요. 처음엔 문 근처, 점차 안쪽으로 이동합니다.',
      tips: ['문은 계속 열어두세요.', '식사 중에는 방해하지 마세요.'],
      completed: false
    },
    {
      id: 3,
      title: '문 닫기 연습',
      desc: '식사 중 문을 잠시 닫았다가, 다 먹기 전에 열어주세요. 점차 닫혀있는 시간을 늘립니다.',
      tips: ['불안해하면 즉시 열어주세요.', '아주 짧은 시간부터 시작하세요.'],
      completed: false
    },
    {
      id: 4,
      title: '기다리기',
      desc: '간식 없이도 들어가서 문을 닫고 5분, 10분씩 기다리는 연습을 합니다.',
      tips: ['낑낑거릴 때 열어주면 안 됩니다.', '조용해지면 보상하고 열어주세요.'],
      completed: false
    },
    {
      id: 5,
      title: '혼자 있기',
      desc: '보호자가 방을 나가거나 외출하는 동안 켄넬에서 편안하게 쉬도록 합니다.',
      tips: ['외출 전 충분한 산책을 시켜주세요.', '오래 씹는 간식을 넣어주세요.'],
      completed: false
    }
  ])

  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleStep = (id: number) => {
    setSteps(steps.map(step => step.id === id ? { ...step, completed: !step.completed } : step))
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-amber-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
              <Home className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">켄넬(크레이트) 훈련</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            강아지에게 가장 안전하고 편안한 '나만의 방'을 선물해주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Steps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-amber-600" />
                단계별 훈련 가이드
              </h2>

              <div className="relative pl-4 md:pl-8 space-y-8 before:absolute before:left-4 md:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                {steps.map((step, idx) => (
                  <div key={step.id} className="relative pl-8">
                    <div
                      className={`absolute left-0 top-0 w-8 h-8 -translate-x-1/2 rounded-full border-4 flex items-center justify-center bg-white transition-colors cursor-pointer ${step.completed ? 'border-amber-500' : 'border-gray-200'
                        }`}
                      onClick={() => toggleStep(step.id)}
                    >
                      {step.completed && <div className="w-3 h-3 bg-amber-500 rounded-full" />}
                    </div>

                    <div
                      className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${step.completed
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-gray-100 hover:border-amber-200 bg-white'
                        }`}
                      onClick={() => toggleStep(step.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold text-lg ${step.completed ? 'text-amber-800' : 'text-gray-900'}`}>
                          Step {step.id}. {step.title}
                        </h3>
                        {step.completed && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">완료</span>}
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{step.desc}</p>

                      <div className="bg-white/50 rounded-lg p-3 text-sm text-gray-500 border border-gray-100/50">
                        <strong className="text-amber-600 mr-2">Tip</strong>
                        {step.tips.join(' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Timer & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-600" />
                기다리기 연습 타이머
              </h2>

              <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                <div className="text-5xl font-black text-gray-900 font-mono tracking-wider mb-2">
                  {formatTime(timer)}
                </div>
                <div className="text-sm text-gray-500">훈련 시간</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRunning
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-200'
                    }`}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? '일시정지' : '시작'}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false)
                    setTimer(0)
                  }}
                  className="py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  리셋
                </button>
              </div>

              <p className="text-xs text-center text-gray-400">
                문 닫기 연습 시 시간을 측정해보세요.
              </p>
            </div>

            {/* Why Crate? */}
            <div className="bg-amber-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-amber-400" />
                왜 켄넬 훈련이 필요한가요?
              </h3>
              <ul className="space-y-4 text-amber-100 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">안정감</strong><br />
                    강아지는 본능적으로 좁고 어두운 곳에서 안정을 느낍니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">분리불안 예방</strong><br />
                    혼자 있는 시간을 편안하게 받아들이게 됩니다.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-amber-400 font-bold">•</span>
                  <span>
                    <strong className="text-white">이동 시 안전</strong><br />
                    차량 이동이나 여행 시 필수적입니다.
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