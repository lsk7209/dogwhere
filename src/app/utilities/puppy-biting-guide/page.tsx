'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, Heart, Users } from 'lucide-react'

interface BitingProblem {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  age: 'puppy' | 'adult' | 'senior'
  causes: string[]
  solutions: string[]
  prevention: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface BitingRecord {
  id: string
  date: string
  problem: string
  solution: string
  duration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function PuppyBitingGuidePage() {
  const [problems, setProblems] = useState<BitingProblem[]>([])
  const [records, setRecords] = useState<BitingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    problem: '',
    solution: '',
    duration: 15,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialProblems: BitingProblem[] = [
    {
      id: '1',
      name: '놀이 중 물기',
      description: '놀이 중에 강아지가 물어대는 행동',
      severity: 'mild',
      age: 'puppy',
      causes: [
        '놀이 중 흥분으로 인한 물기',
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '놀이를 즉시 중단하고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '놀이 중 과도한 흥분 방지하기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '2',
      name: '손가락 물기',
      description: '손가락을 물어대는 행동',
      severity: 'moderate',
      age: 'puppy',
      causes: [
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '놀이 중 흥분으로 인한 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '손을 즉시 빼고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '손을 장난감으로 사용하지 않기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '3',
      name: '발목 물기',
      description: '발목을 물어대는 행동',
      severity: 'moderate',
      age: 'puppy',
      causes: [
        '놀이 중 흥분으로 인한 물기',
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '걷기를 즉시 중단하고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '걷기 중 과도한 흥분 방지하기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '4',
      name: '옷 물기',
      description: '옷을 물어대는 행동',
      severity: 'mild',
      age: 'puppy',
      causes: [
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '놀이 중 흥분으로 인한 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '옷을 즉시 빼고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '옷을 장난감으로 사용하지 않기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '5',
      name: '가구 물기',
      description: '가구를 물어대는 행동',
      severity: 'moderate',
      age: 'puppy',
      causes: [
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '놀이 중 흥분으로 인한 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '가구를 즉시 빼고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '가구를 장난감으로 사용하지 않기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '6',
      name: '신발 물기',
      description: '신발을 물어대는 행동',
      severity: 'mild',
      age: 'puppy',
      causes: [
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '놀이 중 흥분으로 인한 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '신발을 즉시 빼고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '신발을 장난감으로 사용하지 않기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '7',
      name: '전선 물기',
      description: '전선을 물어대는 위험한 행동',
      severity: 'severe',
      age: 'puppy',
      causes: [
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '놀이 중 흥분으로 인한 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '전선을 즉시 빼고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '전선을 장난감으로 사용하지 않기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    },
    {
      id: '8',
      name: '다른 강아지 물기',
      description: '다른 강아지를 물어대는 행동',
      severity: 'severe',
      age: 'puppy',
      causes: [
        '놀이 중 흥분으로 인한 물기',
        '이빨이 가려워서 물기',
        '관심을 끌기 위해 물기',
        '에너지가 넘쳐서 물기'
      ],
      solutions: [
        '놀이를 즉시 중단하고 무시하기',
        '대체 행동으로 유도하기',
        '적절한 장난감 제공하기',
        '일관성 있게 반응하기'
      ],
      prevention: [
        '놀이 중 과도한 흥분 방지하기',
        '적절한 장난감 사용하기',
        '정기적인 운동 제공하기',
        '일관성 있는 규칙 적용하기'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedProblems = localStorage.getItem('bitingProblems')
    const savedRecords = localStorage.getItem('bitingRecords')
    
    if (savedProblems) {
      try {
        setProblems(JSON.parse(savedProblems))
      } catch (e) {
        setProblems(initialProblems)
      }
    } else {
      setProblems(initialProblems)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('bitingProblems', JSON.stringify(problems))
    }
  }, [problems])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('bitingRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleProblem = (problemId: string) => {
    setProblems(problems.map(problem => 
      problem.id === problemId 
        ? { 
            ...problem, 
            completed: !problem.completed,
            date: !problem.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : problem
    ))
  }

  const addRecord = () => {
    if (!newRecord.problem) return

    const record: BitingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      problem: '',
      solution: '',
      duration: 15,
      result: 'good',
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

  const getAgeText = (age: string) => {
    switch (age) {
      case 'puppy': return '강아지'
      case 'adult': return '성견'
      case 'senior': return '노견'
      default: return age
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return result
    }
  }

  const completedProblems = problems.filter(problem => problem.completed).length
  const totalProblems = problems.length
  const severeProblems = problems.filter(problem => problem.severity === 'severe').length
  const excellentRecords = records.filter(record => record.result === 'excellent').length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-10 h-10 text-red-600 mr-3" />
            강아지 물기 훈련
          </h1>
          <p className="text-xl text-gray-600">강아지의 물기 습관 교정 방법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalProblems}개</p>
            <p className="text-sm text-gray-600">물기 문제</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedProblems}개</p>
            <p className="text-sm text-gray-600">해결된 문제</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{severeProblems}개</p>
            <p className="text-sm text-gray-600">심각한 문제</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">물기 문제 해결</h2>
              <div className="space-y-4">
                {problems.map((problem) => (
                  <div key={problem.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{problem.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{problem.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(problem.severity)}`}>
                            {getSeverityText(problem.severity)}
                          </span>
                          <span className="text-blue-600">{getAgeText(problem.age)}</span>
                          {problem.date && (
                            <span className="text-green-600">해결: {problem.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProblem(problem.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          problem.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">원인</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {problem.causes.map((cause, index) => (
                            <li key={index}>• {cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">해결 방법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {problem.solutions.map((solution, index) => (
                            <li key={index}>• {solution}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">예방법</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {problem.prevention.map((prevention, index) => (
                            <li key={index}>• {prevention}</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">물기 훈련 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">물기 문제</label>
                    <select
                      value={newRecord.problem}
                      onChange={(e) => setNewRecord({...newRecord, problem: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">문제 선택</option>
                      {problems.map((problem) => (
                        <option key={problem.id} value={problem.name}>
                          {problem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">해결 방법</label>
                  <select
                    value={newRecord.solution}
                    onChange={(e) => setNewRecord({...newRecord, solution: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">해결 방법 선택</option>
                    <option value="즉시 중단하고 무시하기">즉시 중단하고 무시하기</option>
                    <option value="대체 행동으로 유도하기">대체 행동으로 유도하기</option>
                    <option value="적절한 장난감 제공하기">적절한 장난감 제공하기</option>
                    <option value="일관성 있게 반응하기">일관성 있게 반응하기</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 시간 (분)</label>
                    <input
                      type="number"
                      value={newRecord.duration}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">훈련 결과</label>
                    <select
                      value={newRecord.result}
                      onChange={(e) => setNewRecord({...newRecord, result: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="excellent">매우 좋음</option>
                      <option value="good">좋음</option>
                      <option value="fair">보통</option>
                      <option value="poor">나쁨</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="훈련 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  물기 훈련 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 물기 훈련 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.problem}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.solution} - {record.duration}분
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getResultColor(record.result)}`}>
                          {getResultText(record.result)}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🐕 강아지 물기 훈련 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 일관성 있게 반응하세요</li>
                <li>• 즉시 중단하고 무시하세요</li>
                <li>• 대체 행동으로 유도하세요</li>
                <li>• 적절한 장난감을 제공하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
                <li>• 과도한 자극을 피하세요</li>
                <li>• 이상 증상이 있으면 즉시 수의사에게 연락하세요</li>
                <li>• 실패해도 괜찮다고 안심시켜주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}