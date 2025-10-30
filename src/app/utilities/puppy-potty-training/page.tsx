'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface TrainingStep {
  id: string
  title: string
  description: string
  completed: boolean
  tips: string[]
}

interface TrainingRecord {
  id: string
  date: string
  time: string
  location: string
  success: boolean
  notes: string
}

export default function PuppyPottyTrainingPage() {
  const [steps, setSteps] = useState<TrainingStep[]>([])
  const [records, setRecords] = useState<TrainingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    success: true,
    notes: ''
  })

  const trainingSteps = [
    {
      id: '1',
      title: '배변 패드 준비',
      description: '강아지가 쉽게 접근할 수 있는 곳에 배변 패드를 준비합니다',
      tips: [
        '강아지가 자주 가는 곳에 배치',
        '패드가 미끄럽지 않도록 고정',
        '여러 개의 패드를 준비하여 선택권 제공'
      ]
    },
    {
      id: '2',
      title: '일정 관리',
      description: '규칙적인 배변 시간을 만들어 강아지의 생체리듬을 조절합니다',
      tips: [
        '식사 후 15-30분 후에 배변 시간 설정',
        '아침, 점심, 저녁 일정한 시간에 배변',
        '강아지가 배변 신호를 보일 때 즉시 대응'
      ]
    },
    {
      id: '3',
      title: '긍정적 강화',
      description: '올바른 배변 행동에 대해 칭찬과 보상을 제공합니다',
      tips: [
        '배변 완료 후 즉시 칭찬',
        '간식이나 장난감으로 보상',
        '목소리 톤을 밝고 긍정적으로'
      ]
    },
    {
      id: '4',
      title: '실수 처리',
      description: '배변 실수가 발생했을 때 올바른 대처 방법을 적용합니다',
      tips: [
        '실수를 발견하면 즉시 정리',
        '강아지를 꾸짖지 말고 무시',
        '실수한 장소를 완전히 소독'
      ]
    },
    {
      id: '5',
      title: '외출 훈련',
      description: '실외 배변으로 전환하는 단계적 훈련을 진행합니다',
      tips: [
        '점진적으로 외출 시간 늘리기',
        '외출 시에도 배변 패드 사용',
        '성공적인 외출 배변에 특별한 보상'
      ]
    }
  ]

  useEffect(() => {
    const savedSteps = localStorage.getItem('pottyTrainingSteps')
    const savedRecords = localStorage.getItem('pottyTrainingRecords')
    
    if (savedSteps) {
      try {
        setSteps(JSON.parse(savedSteps))
      } catch (e) {
        setSteps(trainingSteps.map(step => ({ ...step, completed: false })))
      }
    } else {
      setSteps(trainingSteps.map(step => ({ ...step, completed: false })))
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem('pottyTrainingSteps', JSON.stringify(steps))
    }
  }, [steps])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('pottyTrainingRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleStep = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ))
  }

  const addRecord = () => {
    if (!newRecord.time || !newRecord.location) return

    const record: TrainingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      success: true,
      notes: ''
    })
  }

  const deleteRecord = (recordId: string) => {
    setRecords(records.filter(record => record.id !== recordId))
  }

  const completedSteps = steps.filter(step => step.completed).length
  const successRate = records.length > 0 
    ? Math.round((records.filter(r => r.success).length / records.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Home className="w-10 h-10 text-green-600 mr-3" />
            강아지 배변 훈련 가이드
          </h1>
          <p className="text-xl text-gray-600">강아지 배변 훈련 단계별 방법과 팁을 제공합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedSteps}/{steps.length}</p>
            <p className="text-sm text-gray-600">완료된 단계</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{records.length}회</p>
            <p className="text-sm text-gray-600">훈련 기록</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            <p className="text-sm text-gray-600">성공률</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">배변 훈련 단계</h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">팁:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {step.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`ml-4 p-2 rounded-lg transition-colors ${
                      step.completed
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">훈련 기록</h2>
          <div className="space-y-4 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <input
                  type="time"
                  value={newRecord.time}
                  onChange={(e) => setNewRecord({...newRecord, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">장소</label>
                <input
                  type="text"
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                  placeholder="예: 거실, 화장실, 산책로"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">성공 여부</label>
                <select
                  value={newRecord.success.toString()}
                  onChange={(e) => setNewRecord({...newRecord, success: e.target.value === 'true'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">성공</option>
                  <option value="false">실패</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <textarea
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                rows={3}
                placeholder="훈련 상황이나 특이사항을 기록하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addRecord}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              기록 추가
            </button>
          </div>

          {records.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">최근 기록</h3>
              {records.slice(0, 10).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{record.date}</span>
                      <span className="text-sm text-gray-600">{record.time}</span>
                      <span className="text-sm text-gray-600">{record.location}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        record.success 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {record.success ? '성공' : '실패'}
                      </span>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 배변 훈련 성공 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 강아지의 배변 신호(돌아다니기, 킁킁거리기)를 잘 관찰하세요</li>
            <li>• 실수해도 절대 꾸짖지 말고 무시하세요</li>
            <li>• 성공했을 때는 즉시 칭찬하고 보상하세요</li>
            <li>• 일정한 시간에 배변하도록 규칙을 만드세요</li>
            <li>• 배변 패드는 항상 같은 곳에 두세요</li>
            <li>• 인내심을 가지고 꾸준히 훈련하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
