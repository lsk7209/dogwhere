'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, Calculator, ArrowLeft, Zap, Clock, Lightbulb, GraduationCap } from 'lucide-react'

export default function LearningAbilityCalculatorPage() {
  const [breedType, setBreedType] = useState<string>('average')
  const [age, setAge] = useState<string>('puppy')
  const [trainingSessions, setTrainingSessions] = useState<number>(0)
  const [successfulCommands, setSuccessfulCommands] = useState<number>(0)
  const [result, setResult] = useState<{
    learningSpeed: number
    abilityLevel: string
    estimatedTime: number
    recommendation: string
    score: number
  } | null>(null)

  const calculate = () => {
    if (trainingSessions <= 0 || successfulCommands < 0) return

    // 견종별 학습 능력 계수
    let breedFactor = 1.0
    if (breedType === 'high') breedFactor = 1.5 // 보더콜리, 푸들 등
    else if (breedType === 'low') breedFactor = 0.7 // 일부 하운드 등

    // 연령별 학습 능력 계수
    let ageFactor = 1.0
    if (age === 'puppy') ageFactor = 1.3
    else if (age === 'senior') ageFactor = 0.8

    const successRate = (successfulCommands / trainingSessions) * 100
    const rawScore = successRate * breedFactor * ageFactor
    const learningSpeed = Math.round(rawScore * 10) / 10

    // Normalize score to 0-100 range for progress bar (capped at 100)
    const score = Math.min(Math.round(rawScore), 100)

    let abilityLevel = ''
    let estimatedTime = 0
    let recommendation = ''

    if (learningSpeed >= 80) {
      abilityLevel = '천재견 수준'
      estimatedTime = 5
      recommendation = '놀라운 학습 능력입니다! 복잡한 트릭이나 어질리티 훈련에 도전해보세요.'
    } else if (learningSpeed >= 60) {
      abilityLevel = '우등생'
      estimatedTime = 10
      recommendation = '학습 속도가 빠릅니다. 다양한 명령어를 가르쳐 지적 호기심을 채워주세요.'
    } else if (learningSpeed >= 40) {
      abilityLevel = '평균'
      estimatedTime = 20
      recommendation = '꾸준한 반복 훈련이 중요합니다. 짧게 자주 훈련하는 것이 효과적입니다.'
    } else {
      abilityLevel = '노력파'
      estimatedTime = 40
      recommendation = '인내심이 필요합니다. 쉬운 명령어부터 차근차근 성공 경험을 만들어주세요.'
    }

    setResult({
      learningSpeed,
      abilityLevel,
      estimatedTime, // minutes per new command (estimated)
      recommendation,
      score
    })
  }

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
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">학습 능력 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 강아지의 숨겨진 재능을 발견하고 맞춤형 훈련 전략을 세워보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-purple-500" />
                정보 입력
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">견종 지능 순위</label>
                    <select
                      value={breedType}
                      onChange={(e) => setBreedType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="high">상위권 (보더콜리, 푸들 등)</option>
                      <option value="average">평균 (대부분의 견종)</option>
                      <option value="low">하위권 (일부 하운드 등)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="puppy">퍼피 (2-12개월)</option>
                      <option value="young">청년기 (1-2세)</option>
                      <option value="adult">성견 (2-7세)</option>
                      <option value="senior">노령견 (7세 이상)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최근 훈련 시도 횟수</label>
                    <input
                      type="number"
                      min="0"
                      value={trainingSessions || ''}
                      onChange={(e) => setTrainingSessions(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">성공한 횟수</label>
                    <input
                      type="number"
                      min="0"
                      value={successfulCommands || ''}
                      onChange={(e) => setSuccessfulCommands(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <button
                  onClick={calculate}
                  disabled={trainingSessions <= 0}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  능력 분석하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-purple-200 uppercase tracking-wider">학습 능력 레벨</span>
                    <div className="text-4xl font-black my-4">{result.abilityLevel}</div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      점수: {result.learningSpeed}점
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>잠재력 지수</span>
                        <span className="font-bold text-purple-600">{result.score}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-purple-500" />
                        새 명령어 습득 예상
                      </div>
                      <span className="font-bold text-gray-900">{result.estimatedTime}분</span>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-900">맞춤 조언</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    훈련 데이터를 입력하면<br />학습 능력을 분석해드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  훈련 꿀팁
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-yellow-400">•</span>
                    훈련은 식사 전 배고플 때 가장 효과적입니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yellow-400">•</span>
                    한 번에 5-10분, 하루 2-3회 짧게 진행하세요.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yellow-400">•</span>
                    성공하면 즉시 보상하고 폭풍 칭찬해주세요!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
