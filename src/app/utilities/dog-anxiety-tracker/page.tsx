'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Heart } from 'lucide-react'

interface AnxietySymptom {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  category: 'physical' | 'behavioral' | 'emotional' | 'environmental'
  triggers: string[]
  solutions: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface AnxietyRecord {
  id: string
  date: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  duration: number
  trigger: string
  notes: string
}

export default function DogAnxietyTrackerPage() {
  const [symptoms, setSymptoms] = useState<AnxietySymptom[]>([])
  const [records, setRecords] = useState<AnxietyRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    duration: 15,
    trigger: '',
    notes: ''
  })

  const initialSymptoms: AnxietySymptom[] = [
    {
      id: '1',
      name: '과도한 짖음',
      description: '평소보다 많이 짖거나 지속적으로 짖는 증상',
      severity: 'moderate',
      category: 'behavioral',
      triggers: [
        '외로움',
        '낯선 소리',
        '다른 동물',
        '분리 불안'
      ],
      solutions: [
        '안전한 공간 제공하기',
        '점진적 적응 훈련하기',
        '전문가 상담받기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '2',
      name: '과도한 핥기',
      description: '신체 일부를 계속 핥거나 물어뜯는 증상',
      severity: 'mild',
      category: 'behavioral',
      triggers: [
        '스트레스',
        '피부 가려움',
        '지루함',
        '불안감'
      ],
      solutions: [
        '원인 파악하기',
        '대체 활동 제공하기',
        '전문가 상담받기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '3',
      name: '파괴 행동',
      description: '가구나 물건을 물어뜯거나 파괴하는 행동',
      severity: 'moderate',
      category: 'behavioral',
      triggers: [
        '지루함',
        '분리 불안',
        '에너지 과다',
        '주의 끌기'
      ],
      solutions: [
        '충분한 운동 제공하기',
        '적절한 장난감 제공하기',
        '훈련하기',
        '전문가 상담받기'
      ],
      completed: false
    },
    {
      id: '4',
      name: '소변 실수',
      description: '집안에서 소변을 보는 실수 행동',
      severity: 'moderate',
      category: 'behavioral',
      triggers: [
        '불안감',
        '낯선 환경',
        '분리 불안',
        '건강 문제'
      ],
      solutions: [
        '원인 파악하기',
        '훈련하기',
        '전문가 상담받기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '5',
      name: '과도한 침 흘리기',
      description: '평소보다 많이 침을 흘리는 증상',
      severity: 'mild',
      category: 'physical',
      triggers: [
        '스트레스',
        '구강 문제',
        '소화 문제',
        '불안감'
      ],
      solutions: [
        '원인 파악하기',
        '전문가 상담받기',
        '안정적인 환경 제공하기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '6',
      name: '과도한 떨림',
      description: '신체가 계속 떨리는 증상',
      severity: 'severe',
      category: 'physical',
      triggers: [
        '극심한 불안',
        '낯선 환경',
        '큰 소리',
        '건강 문제'
      ],
      solutions: [
        '즉시 안정시키기',
        '전문가 상담받기',
        '안전한 공간 제공하기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '7',
      name: '과도한 하품',
      description: '평소보다 많이 하품하는 증상',
      severity: 'mild',
      category: 'behavioral',
      triggers: [
        '스트레스',
        '불안감',
        '피로',
        '건강 문제'
      ],
      solutions: [
        '원인 파악하기',
        '전문가 상담받기',
        '안정적인 환경 제공하기',
        '일관성 있는 반응하기'
      ],
      completed: false
    },
    {
      id: '8',
      name: '과도한 숨가쁨',
      description: '평소보다 빠르게 숨을 쉬는 증상',
      severity: 'severe',
      category: 'physical',
      triggers: [
        '극심한 불안',
        '건강 문제',
        '과도한 운동',
        '환경 변화'
      ],
      solutions: [
        '즉시 안정시키기',
        '전문가 상담받기',
        '안전한 공간 제공하기',
        '일관성 있는 반응하기'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedSymptoms = localStorage.getItem('anxietySymptoms')
    const savedRecords = localStorage.getItem('anxietyRecords')
    
    if (savedSymptoms) {
      try {
        setSymptoms(JSON.parse(savedSymptoms))
      } catch (e) {
        setSymptoms(initialSymptoms)
      }
    } else {
      setSymptoms(initialSymptoms)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (symptoms.length > 0) {
      localStorage.setItem('anxietySymptoms', JSON.stringify(symptoms))
    }
  }, [symptoms])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('anxietyRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleSymptom = (symptomId: string) => {
    setSymptoms(symptoms.map(symptom => 
      symptom.id === symptomId 
        ? { 
            ...symptom, 
            completed: !symptom.completed,
            date: !symptom.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : symptom
    ))
  }

  const addRecord = () => {
    if (!newRecord.symptom) return

    const record: AnxietyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      severity: 'mild',
      duration: 15,
      trigger: '',
      notes: ''
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-red-600 bg-red-100'
      case 'behavioral': return 'text-blue-600 bg-blue-100'
      case 'emotional': return 'text-purple-600 bg-purple-100'
      case 'environmental': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'physical': return '신체적'
      case 'behavioral': return '행동적'
      case 'emotional': return '감정적'
      case 'environmental': return '환경적'
      default: return category
    }
  }

  const completedSymptoms = symptoms.filter(symptom => symptom.completed).length
  const totalSymptoms = symptoms.length
  const severeSymptoms = symptoms.filter(symptom => symptom.severity === 'severe').length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-10 h-10 text-orange-600 mr-3" />
            불안 증상 추적기
          </h1>
          <p className="text-xl text-gray-600">강아지의 불안 증상과 패턴을 기록하고 분석</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSymptoms}개</p>
            <p className="text-sm text-gray-600">불안 증상</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedSymptoms}개</p>
            <p className="text-sm text-gray-600">해결된 증상</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{severeSymptoms}개</p>
            <p className="text-sm text-gray-600">심각한 증상</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{totalRecords}회</p>
            <p className="text-sm text-gray-600">기록된 증상</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">불안 증상</h2>
              <div className="space-y-4">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{symptom.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{symptom.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(symptom.severity)}`}>
                            {getSeverityText(symptom.severity)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(symptom.category)}`}>
                            {getCategoryText(symptom.category)}
                          </span>
                          {symptom.date && (
                            <span className="text-green-600">해결: {symptom.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          symptom.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">유발 요인</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {symptom.triggers.map((trigger, index) => (
                            <li key={index}>• {trigger}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">해결 방법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {symptom.solutions.map((solution, index) => (
                            <li key={index}>• {solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">불안 증상 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기록 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">불안 증상</label>
                    <select
                      value={newRecord.symptom}
                      onChange={(e) => setNewRecord({...newRecord, symptom: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">증상 선택</option>
                      {symptoms.map((symptom) => (
                        <option key={symptom.id} value={symptom.name}>
                          {symptom.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">심각도</label>
                    <select
                      value={newRecord.severity}
                      onChange={(e) => setNewRecord({...newRecord, severity: e.target.value as 'mild' | 'moderate' | 'severe'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="mild">경미</option>
                      <option value="moderate">보통</option>
                      <option value="severe">심각</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">지속 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">유발 요인</label>
                  <input
                    type="text"
                    value={newRecord.trigger}
                    onChange={(e) => setNewRecord({...newRecord, trigger: e.target.value})}
                    placeholder="불안을 유발한 요인"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="불안 증상의 상세한 상황이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  불안 증상 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 불안 증상 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.symptom}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}분 - {record.trigger}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(record.severity)}`}>
                          {getSeverityText(record.severity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">😰 불안 증상 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 증상을 관찰하세요</li>
                <li>• 원인을 파악하고 해결하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
                <li>• 강아지가 편안해하는 환경을 제공하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 심각한 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 과도한 자극을 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
