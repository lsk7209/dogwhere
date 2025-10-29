'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartPulse, Calculator } from 'lucide-react'

export default function VitaminCalculatorPage() {
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<string>('adult')
  const [healthStatus, setHealthStatus] = useState<string>('normal')
  const [result, setResult] = useState<{
    vitamins: { name: string; dosage: string; purpose: string }[]
    totalCost: number
  } | null>(null)

  const calculate = () => {
    if (weight <= 0) return

    const baseDosage = Math.round(weight * 0.5) // 기본 복용량 계산
    
    const vitamins = [
      {
        name: '종합 비타민',
        dosage: `${baseDosage}mg`,
        purpose: '전반적인 건강 유지'
      },
      {
        name: '오메가-3',
        dosage: `${Math.round(baseDosage * 0.3)}mg`,
        purpose: '피부, 털 건강'
      },
      {
        name: '칼슘',
        dosage: `${Math.round(baseDosage * 0.8)}mg`,
        purpose: '뼈, 치아 건강'
      }
    ]

    if (age === 'senior') {
      vitamins.push({
        name: '글루코사민',
        dosage: `${Math.round(baseDosage * 0.6)}mg`,
        purpose: '관절 건강'
      })
    }

    if (healthStatus === 'weak') {
      vitamins.push({
        name: '비타민 C',
        dosage: `${Math.round(baseDosage * 0.4)}mg`,
        purpose: '면역력 강화'
      })
    }

    const totalCost = vitamins.length * 15000 // 월간 예상 비용

    setResult({ vitamins, totalCost })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <HeartPulse className="w-10 h-10 text-red-600 mr-3" />
            비타민 보충제 계산기
          </h1>
          <p className="text-xl text-gray-600">체중, 연령, 건강 상태에 따른 적정 비타민/보충제 계산</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연령</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="puppy">강아지 (2-12개월)</option>
                <option value="adult">성견 (1-7세)</option>
                <option value="senior">노령견 (7세 이상)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">건강 상태</label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="normal">정상</option>
                <option value="weak">면역력 약함</option>
                <option value="active">고활동</option>
              </select>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
            >
              비타민 계산하기
            </button>

            {result && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">권장 보충제</h3>
                <div className="space-y-3">
                  {result.vitamins.map((vitamin, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{vitamin.name}</h4>
                        <span className="text-red-600 font-bold">{vitamin.dosage}</span>
                      </div>
                      <p className="text-sm text-gray-600">{vitamin.purpose}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">월간 예상 비용</p>
                  <p className="text-2xl font-bold text-red-700">{result.totalCost.toLocaleString()}원</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 비타민 복용 가이드</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 수의사와 상담 후 보충제를 선택하세요</li>
            <li>• 과다 복용은 오히려 해로울 수 있습니다</li>
            <li>• 정기적인 건강 검진으로 효과를 확인하세요</li>
            <li>• 식이로 충분히 섭취할 수 있는 영양소는 보충제가 불필요할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
