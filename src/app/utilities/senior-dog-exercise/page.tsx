'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, ArrowLeft, Waves, Footprints, Play, Pause, RotateCcw, Heart, Info, Timer } from 'lucide-react'

interface Exercise {
  id: string
  title: string
  desc: string
  duration: number // minutes
  intensity: 'low' | 'medium'
  icon: any
  benefits: string[]
}

export default function SeniorDogExercisePage() {
  const [exercises] = useState<Exercise[]>([
    {
      id: 'walk',
      title: '느긋한 산책',
      desc: '평지 위주의 부드러운 산책 코스',
      duration: 15,
      intensity: 'low',
      icon: Footprints,
      benefits: ['관절 유연성 유지', '기분 전환', '소화 촉진']
    },
    {
      id: 'swim',
      title: '수중 걷기',
      desc: '관절에 무리가 없는 최고의 운동',
      duration: 10,
      intensity: 'medium',
      icon: Waves,
      benefits: ['근력 강화', '심폐 기능 향상', '체중 조절']
    },
    {
      id: 'nosework',
      title: '노즈워크',
      desc: '움직임은 적지만 뇌를 자극하는 활동',
      duration: 20,
      intensity: 'low',
      icon: Activity,
      benefits: ['치매 예방', '스트레스 해소', '자신감 향상']
    }
  ])

  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0])
  const [timeLeft, setTimeLeft] = useState(selectedExercise.duration * 60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setTimeLeft(selectedExercise.duration * 60)
    setIsActive(false)
  }, [selectedExercise])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(selectedExercise.duration * 60)
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
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">노령견 맞춤 운동</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            무리하지 않고 건강하게, 시니어 반려견을 위한 운동 가이드입니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Exercise Selection */}
          <div className="lg:col-span-1 space-y-4">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedExercise.id === exercise.id
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-teal-200'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${selectedExercise.id === exercise.id ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
                    <exercise.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedExercise.id === exercise.id ? 'text-teal-900' : 'text-gray-900'}`}>
                      {exercise.title}
                    </h3>
                    <span className="text-xs text-gray-500">{exercise.duration}분 코스</span>
                  </div>
                </div>
              </button>
            ))}

            <div className="bg-teal-900 rounded-2xl p-6 text-white shadow-lg mt-8">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-teal-400" />
                운동 전 체크리스트
              </h3>
              <ul className="space-y-3 text-teal-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  다리를 절거나 통증 반응이 없나요?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  호흡이 편안하고 안정적인가요?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">✓</span>
                  날씨가 너무 덥거나 춥지 않나요?
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Timer & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedExercise.title}</h2>
                  <p className="text-gray-600">{selectedExercise.desc}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${selectedExercise.intensity === 'low' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                  강도: {selectedExercise.intensity === 'low' ? '낮음' : '보통'}
                </div>
              </div>

              {/* Timer Display */}
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
                <div className="text-7xl font-black text-gray-900 tabular-nums mb-8 tracking-tight">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${isActive
                        ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200'
                      }`}
                  >
                    {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    {isActive ? '일시정지' : '시작하기'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-xl bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  운동 효과
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {selectedExercise.benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-teal-50 p-4 rounded-xl text-center text-teal-800 font-medium text-sm">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}