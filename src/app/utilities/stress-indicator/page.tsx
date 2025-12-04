'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, AlertCircle, HeartPulse, Smile, Zap, Volume2, ArrowLeft, Activity, Moon } from 'lucide-react'

export default function StressIndicatorPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])

  const symptomList = [
    { id: 'barking', label: '과도한 짖음', icon: Volume2 },
    { id: 'panting', label: '심한 헐떡임', icon: Activity },
    { id: 'licking', label: '발사탕/핥기', icon: HeartPulse },
    { id: 'hiding', label: '구석에 숨기', icon: Moon },
    { id: 'pacing', label: '서성거림', icon: Activity },
    { id: 'shaking', label: '몸 떨림', icon: Zap },
    { id: 'yawning', label: '잦은 하품', icon: Moon },
    { id: 'drooling', label: '침 흘림', icon: Activity },
  ]

  const toggleSymptom = (id: string) => {
    setSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const stressLevel = Math.min(100, symptoms.length * 15)

  const getResult = () => {
    if (stressLevel >= 70) return {
      level: '높음',
      desc: '즉각적인 휴식과 안정이 필요해요.',
      color: 'text-red-600',
      bg: 'bg-red-50',
      bar: 'bg-red-500'
    }
    if (stressLevel >= 30) return {
      level: '중간',
      desc: '스트레스 요인을 찾아 제거해주세요.',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      bar: 'bg-orange-500'
    }
    return {
      level: '낮음',
      desc: '편안하고 안정적인 상태입니다.',
      color: 'text-green-600',
      bg: 'bg-green-50',
      bar: 'bg-green-500'
    }
  }

  const result = getResult()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">스트레스 체크</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            말 못하는 우리 아이, 행동으로 마음을 읽어주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Symptom Checker */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                현재 보이는 증상을 선택하세요
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {symptomList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleSymptom(item.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${symptoms.includes(item.id)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-100 hover:border-red-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon className={`w-8 h-8 ${symptoms.includes(item.id) ? 'animate-pulse' : ''}`} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Smile className="w-5 h-5 mr-2 text-yellow-500" />
                스트레스 해소 팁
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-gray-900 mb-1">노즈워크 놀이</strong>
                  <p className="text-sm text-gray-600">후각 활동은 뇌를 자극하고 스트레스를 낮춰줍니다.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-gray-900 mb-1">백색 소음</strong>
                  <p className="text-sm text-gray-600">클래식 음악이나 백색 소음은 심리적 안정을 돕습니다.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-gray-900 mb-1">마사지</strong>
                  <p className="text-sm text-gray-600">귀 뒤나 등을 부드럽게 쓰다듬어 긴장을 풀어주세요.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-gray-900 mb-1">산책 코스 변경</strong>
                  <p className="text-sm text-gray-600">새로운 냄새를 맡게 해주면 기분 전환에 좋습니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <HeartPulse className="w-5 h-5 mr-2 text-red-500" />
                분석 결과
              </h2>

              <div className="text-center mb-8">
                <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#f3f4f6" strokeWidth="12%" />
                    <circle
                      cx="50%" cy="50%" r="45%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12%"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - stressLevel / 100)}`}
                      strokeLinecap="round"
                      className={`transition-all duration-1000 ease-out ${result.color.replace('text-', 'stroke-')}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${result.color}`}>{stressLevel}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase">Score</span>
                  </div>
                </div>

                <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-2 ${result.bg} ${result.color}`}>
                  {result.level} 단계
                </div>
                <p className="text-gray-600 text-sm font-medium">
                  {result.desc}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                <AlertCircle className="w-4 h-4 mb-2 text-gray-400" />
                이 결과는 참고용입니다. 증상이 지속되거나 심각해 보인다면 반드시 수의사와 상담하세요.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
