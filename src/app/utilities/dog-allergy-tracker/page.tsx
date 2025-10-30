'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, CheckCircle, AlertTriangle, Clock, Heart } from 'lucide-react'

interface AllergySymptom {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  category: 'food' | 'environmental' | 'contact' | 'inhalant'
  triggers: string[]
  symptoms: string[]
  treatments: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface AllergyRecord {
  id: string
  date: string
  symptom: string
  severity: 'mild' | 'moderate' | 'severe'
  trigger: string
  duration: number
  notes: string
}

export default function DogAllergyTrackerPage() {
  const [symptoms, setSymptoms] = useState<AllergySymptom[]>([])
  const [records, setRecords] = useState<AllergyRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    trigger: '',
    duration: 15,
    notes: ''
  })

  const initialSymptoms: AllergySymptom[] = [
    {
      id: '1',
      name: '음식 알레르기',
      description: '특정 음식에 대한 알레르기 반응',
      severity: 'moderate',
      category: 'food',
      triggers: [
        '닭고기',
        '소고기',
        '생선',
        '계란',
        '유제품',
        '밀가루'
      ],
      symptoms: [
        '가려움증',
        '피부 발진',
        '구토',
        '설사',
        '귀 감염',
        '발가락 핥기'
      ],
      treatments: [
        '알레르기 원인 음식 제거',
        '수의사 상담',
        '항히스타민제 복용',
        '저자극 사료 급여'
      ],
      completed: false
    },
    {
      id: '2',
      name: '환경 알레르기',
      description: '환경 요인에 대한 알레르기 반응',
      severity: 'moderate',
      category: 'environmental',
      triggers: [
        '꽃가루',
        '먼지',
        '곰팡이',
        '풀',
        '나무',
        '잡초'
      ],
      symptoms: [
        '가려움증',
        '눈물',
        '재채기',
        '기침',
        '피부 발진',
        '귀 감염'
      ],
      treatments: [
        '알레르기 원인 환경 회피',
        '수의사 상담',
        '항히스타민제 복용',
        '정기적인 목욕'
      ],
      completed: false
    },
    {
      id: '3',
      name: '접촉 알레르기',
      description: '특정 물질과 접촉 시 발생하는 알레르기',
      severity: 'mild',
      category: 'contact',
      triggers: [
        '세제',
        '샴푸',
        '플라스틱',
        '금속',
        '고무',
        '합성 섬유'
      ],
      symptoms: [
        '피부 발진',
        '가려움증',
        '붉은 반점',
        '부종',
        '피부 두꺼워짐',
        '털 빠짐'
      ],
      treatments: [
        '알레르기 원인 물질 회피',
        '수의사 상담',
        '국소 스테로이드 사용',
        '저자극 제품 사용'
      ],
      completed: false
    },
    {
      id: '4',
      name: '흡입 알레르기',
      description: '공기 중 알레르기 물질에 대한 반응',
      severity: 'moderate',
      category: 'inhalant',
      triggers: [
        '꽃가루',
        '먼지 진드기',
        '곰팡이 포자',
        '담배 연기',
        '향수',
        '공기 청정제'
      ],
      symptoms: [
        '기침',
        '재채기',
        '콧물',
        '눈물',
        '호흡 곤란',
        '가려움증'
      ],
      treatments: [
        '알레르기 원인 물질 회피',
        '수의사 상담',
        '항히스타민제 복용',
        '공기 청정기 사용'
      ],
      completed: false
    },
    {
      id: '5',
      name: '약물 알레르기',
      description: '특정 약물에 대한 알레르기 반응',
      severity: 'severe',
      category: 'contact',
      triggers: [
        '항생제',
        '진통제',
        '백신',
        '마취제',
        '비타민',
        '보충제'
      ],
      symptoms: [
        '피부 발진',
        '붉은 반점',
        '부종',
        '호흡 곤란',
        '구토',
        '설사'
      ],
      treatments: [
        '약물 복용 중단',
        '즉시 수의사 연락',
        '응급 처치',
        '대체 약물 사용'
      ],
      completed: false
    },
    {
      id: '6',
      name: '벌레 물림 알레르기',
      description: '벌레 물림에 대한 알레르기 반응',
      severity: 'severe',
      category: 'contact',
      triggers: [
        '벌',
        '말벌',
        '개미',
        '모기',
        '진드기',
        '벼룩'
      ],
      symptoms: [
        '부종',
        '가려움증',
        '붉은 반점',
        '호흡 곤란',
        '구토',
        '설사'
      ],
      treatments: [
        '즉시 수의사 연락',
        '응급 처치',
        '항히스타민제 복용',
        '부종 완화'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedSymptoms = localStorage.getItem('allergySymptoms')
    const savedRecords = localStorage.getItem('allergyRecords')
    
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
      localStorage.setItem('allergySymptoms', JSON.stringify(symptoms))
    }
  }, [symptoms])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('allergyRecords', JSON.stringify(records))
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

    const record: AllergyRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      severity: 'mild',
      trigger: '',
      duration: 15,
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
      case 'food': return 'text-red-600 bg-red-100'
      case 'environmental': return 'text-blue-600 bg-blue-100'
      case 'contact': return 'text-green-600 bg-green-100'
      case 'inhalant': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'food': return '음식'
      case 'environmental': return '환경'
      case 'contact': return '접촉'
      case 'inhalant': return '흡입'
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
            <Zap className="w-10 h-10 text-yellow-600 mr-3" />
            알레르기 증상 추적기
          </h1>
          <p className="text-xl text-gray-600">음식, 환경 알레르기 증상을 상세히 기록하고 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSymptoms}개</p>
            <p className="text-sm text-gray-600">알레르기 유형</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedSymptoms}개</p>
            <p className="text-sm text-gray-600">해결된 알레르기</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{severeSymptoms}개</p>
            <p className="text-sm text-gray-600">심각한 알레르기</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">알레르기 유형</h2>
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
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">유발 요인</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {symptom.triggers.map((trigger, index) => (
                            <li key={index}>• {trigger}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">증상</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {symptom.symptoms.map((symptomItem, index) => (
                            <li key={index}>• {symptomItem}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">치료법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {symptom.treatments.map((treatment, index) => (
                            <li key={index}>• {treatment}</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">알레르기 증상 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">알레르기 유형</label>
                    <select
                      value={newRecord.symptom}
                      onChange={(e) => setNewRecord({...newRecord, symptom: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">유형 선택</option>
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
                    placeholder="알레르기를 유발한 구체적인 요인"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="알레르기 증상의 상세한 상황이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  알레르기 증상 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 알레르기 증상 기록</h3>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ 알레르기 증상 추적 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 증상을 관찰하세요</li>
                <li>• 유발 요인을 파악하고 회피하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
                <li>• 강아지가 편안해하는 환경을 제공하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 심각한 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 알레르기 원인 물질을 즉시 제거하세요</li>
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
