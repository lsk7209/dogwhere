'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap, Award, Star, BookOpen, Trophy, ArrowLeft, CheckCircle, Lock, PlayCircle } from 'lucide-react'

interface TrainingTask {
  id: string
  title: string
  desc: string
  steps: string[]
  tips: string
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
}

interface Level {
  id: string
  name: string
  desc: string
  icon: any
  tasks: TrainingTask[]
  isLocked: boolean
}

export default function TrainingPlannerPage() {
  const [levels, setLevels] = useState<Level[]>([
    {
      id: 'beginner',
      name: '기초 과정',
      desc: '반려견과 함께하는 첫 걸음',
      icon: Star,
      isLocked: false,
      tasks: [
        { id: 'eye', title: '아이컨택', desc: '이름을 부르면 쳐다보기', steps: ['간식을 눈가로 가져가기', '이름 부르기', '눈 마주치면 보상'], tips: '짧게 자주 반복하세요.', difficulty: 'easy', completed: false },
        { id: 'sit', title: '앉아', desc: '기본적인 앉기 동작', steps: ['간식을 코 위로 올리기', '엉덩이가 닿으면 보상', '명령어 입히기'], tips: '손동작을 크게 하세요.', difficulty: 'easy', completed: false },
        { id: 'come', title: '이리와', desc: '호출에 반응하여 오기', steps: ['멀리서 이름 부르기', '오면 큰 칭찬과 보상', '점점 거리 늘리기'], tips: '절대 혼낼 때 부르지 마세요.', difficulty: 'medium', completed: false }
      ]
    },
    {
      id: 'intermediate',
      name: '중급 과정',
      desc: '더 깊은 유대감 형성하기',
      icon: BookOpen,
      isLocked: true,
      tasks: [
        { id: 'down', title: '엎드려', desc: '차분하게 엎드리는 동작', steps: ['앉은 상태에서 간식 내리기', '앞발이 닿으면 보상', '기다리기 연습'], tips: '바닥을 치는 신호를 주세요.', difficulty: 'medium', completed: false },
        { id: 'wait', title: '기다려', desc: '충동 조절 능력 기르기', steps: ['잠깐 기다리면 보상', '시간 늘리기', '거리 늘리기'], tips: '성공할 때만 보상하세요.', difficulty: 'hard', completed: false },
        { id: 'hand', title: '손', desc: '발을 건네는 교감 동작', steps: ['손을 쥐고 내밀기', '발로 건드리면 보상', '손바닥 펴기'], tips: '양발을 번갈아 연습하세요.', difficulty: 'easy', completed: false }
      ]
    },
    {
      id: 'advanced',
      name: '고급 과정',
      desc: '완벽한 파트너 되기',
      icon: Trophy,
      isLocked: true,
      tasks: [
        { id: 'heel', title: '옆에', desc: '산책 시 옆에서 걷기', steps: ['간식으로 유도하며 걷기', '멈추면 앉히기', '방향 전환 연습'], tips: '줄을 당기지 않게 하세요.', difficulty: 'hard', completed: false },
        { id: 'leave', title: '놔', desc: '물고 있는 것 놓기', steps: ['장난감 놀이 중 간식 보여주기', '입을 떼면 보상', '다시 놀아주기'], tips: '뺏는 것이 아니라 교환하는 것입니다.', difficulty: 'hard', completed: false },
        { id: 'place', title: '하우스', desc: '지정된 장소로 가기', steps: ['방석에 간식 던지기', '올라가면 보상', '머무르기 연습'], tips: '편안한 장소로 인식시켜주세요.', difficulty: 'medium', completed: false }
      ]
    }
  ])

  const [selectedLevelId, setSelectedLevelId] = useState('beginner')
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)

  // Unlock logic
  useEffect(() => {
    setLevels(prevLevels => {
      const newLevels = [...prevLevels]

      // Check beginner completion to unlock intermediate
      const beginner = newLevels.find(l => l.id === 'beginner')!
      const beginnerComplete = beginner.tasks.every(t => t.completed)

      const intermediate = newLevels.find(l => l.id === 'intermediate')!
      if (beginnerComplete && intermediate.isLocked) {
        intermediate.isLocked = false
      }

      // Check intermediate completion to unlock advanced
      const intermediateComplete = intermediate.tasks.every(t => t.completed)
      const advanced = newLevels.find(l => l.id === 'advanced')!
      if (intermediateComplete && advanced.isLocked) {
        advanced.isLocked = false
      }

      return newLevels
    })
  }, [levels]) // This dependency might cause loop if not careful, but toggleTask creates new array ref so it's ok

  const toggleTask = (levelId: string, taskId: string) => {
    setLevels(levels.map(level => {
      if (level.id === levelId) {
        return {
          ...level,
          tasks: level.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
      }
      return level
    }))
  }

  const selectedLevel = levels.find(l => l.id === selectedLevelId)!
  const levelProgress = Math.round((selectedLevel.tasks.filter(t => t.completed).length / selectedLevel.tasks.length) * 100)
  const isLevelComplete = levelProgress === 100

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">훈련 마스터 플래너</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            체계적인 커리큘럼으로 우리 아이를 모범견으로 만들어보세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Level Selection */}
          <div className="lg:col-span-1 space-y-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => !level.isLocked && setSelectedLevelId(level.id)}
                disabled={level.isLocked}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${selectedLevelId === level.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : level.isLocked
                      ? 'border-gray-100 bg-gray-50 opacity-70 cursor-not-allowed'
                      : 'border-gray-100 bg-white hover:border-indigo-200'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${level.isLocked ? 'bg-gray-200 text-gray-500' :
                      selectedLevelId === level.id ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {level.isLocked ? <Lock className="w-6 h-6" /> : <level.icon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedLevelId === level.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                      {level.name}
                    </h3>
                    <span className="text-xs text-gray-500">{level.tasks.length}개 강의</span>
                  </div>
                </div>
                {level.isLocked && (
                  <div className="absolute inset-0 bg-gray-50/50 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm border">
                      이전 단계 완료 시 잠금 해제
                    </span>
                  </div>
                )}
              </button>
            ))}

            {/* Certificate Card (Only shows when current level is complete) */}
            {isLevelComplete && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg text-center animate-in zoom-in duration-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-yellow-100" />
                <h3 className="font-bold text-xl mb-1">{selectedLevel.name} 수료!</h3>
                <p className="text-yellow-100 text-sm mb-4">모든 훈련을 완벽하게 마쳤습니다.</p>
                <div className="bg-white/20 rounded-lg p-2 text-xs font-medium">
                  다음 단계로 도전해보세요!
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Tasks & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLevel.name}</h2>
                  <p className="text-gray-600">{selectedLevel.desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-indigo-600">{levelProgress}%</div>
                  <div className="text-xs text-gray-500">진행률</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>

              <div className="space-y-4">
                {selectedLevel.tasks.map((task) => (
                  <div key={task.id} className={`border rounded-xl transition-all ${task.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'
                    }`}>
                    <div
                      className="flex items-center p-4 cursor-pointer"
                      onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTask(selectedLevel.id, task.id)
                        }}
                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-indigo-400'
                          }`}
                      >
                        {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {task.difficulty === 'easy' ? '쉬움' : task.difficulty === 'medium' ? '보통' : '어려움'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{task.desc}</p>
                      </div>

                      <PlayCircle className={`w-5 h-5 transition-transform ${expandedTaskId === task.id ? 'rotate-90 text-indigo-500' : 'text-gray-300'}`} />
                    </div>

                    {expandedTaskId === task.id && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-xl animate-in slide-in-from-top-2">
                        <div className="mb-4">
                          <h4 className="font-bold text-sm text-gray-900 mb-2">훈련 단계</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-1">
                            {task.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800 flex items-start gap-2">
                          <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span><strong>Tip:</strong> {task.tips}</span>
                        </div>
                      </div>
                    )}
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
