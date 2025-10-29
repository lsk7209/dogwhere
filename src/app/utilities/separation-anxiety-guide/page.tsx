'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Clock, CheckCircle } from 'lucide-react'

interface AnxietyRecord {
  id: string
  date: string
  duration: number
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  notes: string
}

export default function SeparationAnxietyGuidePage() {
  const [records, setRecords] = useState<AnxietyRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    duration: 0,
    symptoms: [] as string[],
    severity: 'mild' as const,
    notes: ''
  })
  const [currentStep, setCurrentStep] = useState(1)

  const symptoms = [
    '과도한 짖기', '하울링', '파괴 행동', '실내 배변', '과도한 침 흘리기',
    '걸어다니기', '구토', '과도한 핥기', '탈출 시도', '기타'
  ]

  const trainingSteps = [
    {
      step: 1,
      title: '1단계: 짧은 분리',
      description: '5-10분간 다른 방에 있기',
      duration: '5-10분',
      tips: ['강아지가 평온할 때 시작', '돌아왔을 때 과도한 관심 주지 않기']
    },
    {
      step: 2,
      title: '2단계: 중간 분리',
      description: '30분-1시간간 집에 혼자 두기',
      duration: '30분-1시간',
      tips: ['점진적으로 시간 늘리기', '안전한 장난감 제공']
    },
    {
      step: 3,
      title: '3단계: 긴 분리',
      description: '2-4시간간 집에 혼자 두기',
      duration: '2-4시간',
      tips: ['충분한 운동 후 휴식 시간 활용', '배변 후 나가기']
    },
    {
      step: 4,
      title: '4단계: 하루 종일',
      description: '8시간 이상 집에 혼자 두기',
      duration: '8시간 이상',
      tips: ['정기적인 산책 시간 확보', '다른 강아지와 함께 두기 고려']
    }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('anxietyRecords')
    if (saved) {
      try {
        setRecords(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('anxietyRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (newRecord.duration <= 0 || newRecord.symptoms.length === 0) return

    const record: AnxietyRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      duration: 0,
      symptoms: [],
      severity: 'mild',
      notes: ''
    })
  }

  const toggleSymptom = (symptom: string) => {
    setNewRecord({
      ...newRecord,
      symptoms: newRecord.symptoms.includes(symptom)
        ? newRecord.symptoms.filter(s => s !== symptom)
        : [...newRecord.symptoms, symptom]
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild': return '경미'
      case 'moderate': return '보통'
      case 'severe': return '심각'
      default: return severity
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = records.filter(r => r.duration >= 240).length // 4시간 이상
    return Math.min((completedSteps / 4) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-10 h-10 text-pink-600 mr-3" />
            분리불안 극복 가이드
          </h1>
          <p className="text-xl text-gray-600">분리불안 증상 완화를 위한 훈련과 관리법</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 진행도</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">전체 진행률</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {trainingSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                  records.some(r => r.duration >= (step.step * 60))
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.step}
                </div>
                <p className="text-xs text-gray-600">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">분리불안 증상 기록</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">혼자 있던 시간 (분)</label>
              <input
                type="number"
                min="0"
                value={newRecord.duration || ''}
                onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">관찰된 증상</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newRecord.symptoms.includes(symptom)
                        ? 'bg-pink-100 border-pink-400 text-pink-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
              <select
                value={newRecord.severity}
                onChange={(e) => setNewRecord({...newRecord, severity: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="mild">경미</option>
                <option value="moderate">보통</option>
                <option value="severe">심각</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                placeholder="강아지의 반응이나 특이사항을 기록하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={addRecord}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
            >
              기록 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 단계별 가이드</h2>
          <div className="space-y-6">
            {trainingSteps.map((step) => (
              <div key={step.step} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">목표 시간</h4>
                    <p className="text-pink-600 font-medium">{step.duration}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">훈련 팁</h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-pink-600">•</span>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">증상 기록</h2>
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              아직 기록이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{record.date}</h3>
                      <p className="text-sm text-gray-600">{record.duration}분 혼자 있음</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                      {getSeverityText(record.severity)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">증상:</p>
                    <div className="flex flex-wrap gap-1">
                      {record.symptoms.map((symptom, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-500">메모: {record.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 분리불안 극복 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 점진적으로 분리 시간을 늘려가세요</li>
            <li>• 나가기 전과 돌아온 후 과도한 관심을 주지 마세요</li>
            <li>• 안전한 장난감이나 퍼즐을 제공하세요</li>
            <li>• 충분한 운동과 정신적 자극을 제공하세요</li>
            <li>• 일관된 일상을 만들어주세요</li>
            <li>• 심각한 경우 전문가와 상담하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
