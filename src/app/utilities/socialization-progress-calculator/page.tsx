'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Heart, MapPin, Car, Music, ArrowLeft, CheckCircle, Trophy, Star } from 'lucide-react'

interface Mission {
  id: string
  category: 'people' | 'place' | 'sound' | 'object'
  title: string
  desc: string
  completed: boolean
}

export default function SocializationProgressCalculatorPage() {
  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', category: 'people', title: '낯선 사람에게 간식 받기', desc: '모자 쓴 사람, 안경 쓴 사람 등', completed: true },
    { id: '2', category: 'people', title: '아이들과 인사하기', desc: '뛰어노는 아이들을 차분히 바라보기', completed: false },
    { id: '3', category: 'place', title: '동물병원 방문하기', desc: '진료 없이 간식만 먹고 오기', completed: false },
    { id: '4', category: 'place', title: '엘리베이터 타기', desc: '문이 열리고 닫히는 소리 적응', completed: true },
    { id: '5', category: 'sound', title: '청소기 소리 듣기', desc: '작은 소리부터 시작해서 적응하기', completed: true },
    { id: '6', category: 'sound', title: '천둥/빗소리 듣기', desc: '유튜브로 소리 들려주기', completed: false },
    { id: '7', category: 'object', title: '우산 펼치기', desc: '갑자기 펼쳐지는 모습 보여주기', completed: false },
    { id: '8', category: 'object', title: '캐리어/이동장 들어가기', desc: '스스로 들어가서 쉬게 하기', completed: true },
  ])

  const toggleMission = (id: string) => {
    setMissions(missions.map(m => m.id === id ? { ...m, completed: !m.completed } : m))
  }

  const completedCount = missions.filter(m => m.completed).length
  const progress = Math.round((completedCount / missions.length) * 100)

  const getLevel = () => {
    if (progress >= 80) return { name: '사교왕', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (progress >= 50) return { name: '인싸 유망주', color: 'text-pink-600', bg: 'bg-pink-100' }
    if (progress >= 20) return { name: '호기심 대장', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { name: '집순이', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const level = getLevel()

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-100 rounded-2xl text-pink-600">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">사회화 빙고</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            세상은 즐거운 곳이라는 걸 알려주세요. 하나씩 도전해볼까요?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                현재 레벨
              </h2>

              <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#f3f4f6" strokeWidth="8%" />
                  <circle
                    cx="50%" cy="50%" r="45%"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="8%"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-pink-600">{progress}%</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full mt-2 ${level.bg} ${level.color}`}>
                    {level.name}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                총 {missions.length}개 중 <span className="text-pink-600 font-bold">{completedCount}개</span> 완료!
              </div>
            </div>

            <div className="bg-pink-900 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-400" />
                사회화 꿀팁
              </h3>
              <ul className="space-y-3 text-pink-100 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  억지로 시키지 마세요. 스스로 다가갈 때까지 기다려주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  성공하면 즉시 간식으로 보상해주세요.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 font-bold">•</span>
                  무서워하면 바로 중단하고 안아주세요.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Bingo Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {missions.map((mission) => (
                  <button
                    key={mission.id}
                    onClick={() => toggleMission(mission.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden ${mission.completed
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-100 hover:border-pink-200 bg-white'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${mission.category === 'people' ? 'bg-blue-100 text-blue-600' :
                          mission.category === 'place' ? 'bg-green-100 text-green-600' :
                            mission.category === 'sound' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-purple-100 text-purple-600'
                        }`}>
                        {mission.category === 'people' ? '사람' :
                          mission.category === 'place' ? '장소' :
                            mission.category === 'sound' ? '소리' : '물건'}
                      </span>
                      {mission.completed ? (
                        <CheckCircle className="w-6 h-6 text-pink-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-pink-300" />
                      )}
                    </div>

                    <h3 className={`font-bold text-lg mb-1 relative z-10 ${mission.completed ? 'text-pink-900' : 'text-gray-900'
                      }`}>
                      {mission.title}
                    </h3>
                    <p className={`text-sm relative z-10 ${mission.completed ? 'text-pink-700' : 'text-gray-500'
                      }`}>
                      {mission.desc}
                    </p>

                    {mission.completed && (
                      <div className="absolute -bottom-4 -right-4 text-pink-100 transform rotate-12 z-0">
                        <Star className="w-24 h-24" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
