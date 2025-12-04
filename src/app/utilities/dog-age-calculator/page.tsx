'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Dog, Share2, Copy, Check, ArrowLeft, Info, Baby, User, UserCheck } from 'lucide-react'

// 견종별 환산 계수
const breedMultipliers: Record<string, number> = {
  'small': 7,    // 소형견
  'medium': 6.5, // 중형견
  'large': 6     // 대형견
}

export default function DogAgeCalculatorPage() {
  const [breedSize, setBreedSize] = useState<string>('medium')
  const [dogAge, setDogAge] = useState<number>(0)
  const [humanAge, setHumanAge] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const breedSizes = [
    { id: 'small', label: '소형견', desc: '10kg 미만' },
    { id: 'medium', label: '중형견', desc: '10-25kg' },
    { id: 'large', label: '대형견', desc: '25kg 이상' }
  ]

  const calculateHumanAge = (age: number, size: string) => {
    if (age <= 0) {
      setHumanAge(0)
      return
    }

    // 더 정교한 계산식 (AVMA 기준 참고)
    // 첫 1년은 15세, 2년은 24세, 그 이후는 크기별로 다름
    let calculatedAge = 0;
    if (age <= 1) {
      calculatedAge = age * 15;
    } else if (age <= 2) {
      calculatedAge = 15 + (age - 1) * 9;
    } else {
      const baseAge = 24;
      const extraYears = age - 2;
      let multiplier = 5; // 소형/중형 평균

      if (size === 'small') multiplier = 4; // 소형견은 노화가 느림
      else if (size === 'medium') multiplier = 5;
      else if (size === 'large') multiplier = 6; // 대형견은 노화가 빠름

      calculatedAge = baseAge + (extraYears * multiplier);
    }

    setHumanAge(Math.round(calculatedAge * 10) / 10)
  }

  const handleDogAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = parseFloat(e.target.value) || 0
    setDogAge(age)
    calculateHumanAge(age, breedSize)
  }

  const handleBreedSizeChange = (size: string) => {
    setBreedSize(size)
    calculateHumanAge(dogAge, size)
  }

  const shareResult = () => {
    if (humanAge === 0) return

    const text = `우리 강아지(${dogAge}살)는 사람 나이로 약 ${humanAge}세입니다! 🐕`

    if (navigator.share) {
      navigator.share({
        title: '반려견 나이 계산 결과',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const getLifeStage = (age: number) => {
    if (age < 1) return { label: '퍼피 (Puppy)', desc: '호기심이 왕성하고 사회화가 중요한 시기', icon: Baby }
    if (age < 3) return { label: '청년기 (Young Adult)', desc: '에너지가 넘치고 신체 능력이 최고조인 시기', icon: User }
    if (age < 7) return { label: '성견 (Adult)', desc: '성격이 안정되고 건강 관리가 필요한 시기', icon: UserCheck }
    return { label: '노령견 (Senior)', desc: '관절과 치아 등 세심한 건강 관리가 필요한 시기', icon: User }
  }

  const lifeStage = getLifeStage(dogAge)
  const StageIcon = lifeStage.icon

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
            <h1 className="text-3xl font-bold text-gray-900">반려견 나이 계산기</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            우리 강아지의 시간은 사람과 다르게 흐릅니다. 정확한 나이를 확인해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Dog className="w-5 h-5 mr-2 text-blue-500" />
                기본 정보 입력
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">견종 크기</label>
                  <div className="grid grid-cols-3 gap-3">
                    {breedSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleBreedSizeChange(size.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${breedSize === size.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                          }`}
                      >
                        <div className="font-bold mb-1">{size.label}</div>
                        <div className="text-xs opacity-70">{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">강아지 나이 (살)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value={dogAge || ''}
                      onChange={handleDogAgeChange}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">살</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Life Stage Info */}
            {dogAge > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <StageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{lifeStage.label}</h3>
                    <p className="text-gray-600">{lifeStage.desc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {humanAge > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center text-white">
                    <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">사람 나이 환산</span>
                    <div className="text-5xl font-black my-4 flex items-end justify-center leading-none">
                      {humanAge}
                      <span className="text-2xl ml-2 font-medium text-blue-200 mb-1">세</span>
                    </div>
                    <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                      약 {Math.floor(humanAge / 10) * 10}대 {humanAge % 10 < 5 ? '초반' : '후반'}
                    </div>
                  </div>

                  <div className="p-6">
                    <button
                      onClick={shareResult}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-xl transition-colors flex items-center justify-center font-medium border border-gray-200"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          복사되었습니다!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          결과 공유하기
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">결과 대기중</h3>
                  <p className="text-sm text-gray-500">
                    강아지 나이를 입력하면<br />사람 나이로 계산해드립니다.
                  </p>
                </div>
              )}

              {/* Guide Box */}
              <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-indigo-400" />
                  알아두세요
                </h3>
                <ul className="space-y-3 text-indigo-100 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    소형견은 대형견보다 노화가 느리게 진행됩니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    첫 2년 동안은 급격하게 성장하여 성견이 됩니다.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    이 계산은 평균적인 수치이며 개체 차이가 있습니다.
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
