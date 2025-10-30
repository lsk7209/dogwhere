'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cloud, CheckCircle, Clock, AlertTriangle, Sun } from 'lucide-react'

interface WeatherTask {
  id: string
  name: string
  description: string
  category: 'hot' | 'cold' | 'rainy' | 'windy' | 'snowy' | 'general'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface WeatherRecord {
  id: string
  date: string
  task: string
  weather: string
  temperature: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogWeatherAdaptationPage() {
  const [tasks, setTasks] = useState<WeatherTask[]>([])
  const [records, setRecords] = useState<WeatherRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    weather: '',
    temperature: 20,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: WeatherTask[] = [
    {
      id: '1',
      name: '더위 대응하기',
      description: '더운 날씨에서 강아지를 보호하는 방법',
      category: 'hot',
      importance: 'high',
      steps: [
        '충분한 물 공급하기',
        '그늘진 곳에서 휴식하기',
        '산책 시간 조절하기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '추위 대응하기',
      description: '추운 날씨에서 강아지를 보호하는 방법',
      category: 'cold',
      importance: 'high',
      steps: [
        '따뜻한 옷 입히기',
        '따뜻한 곳에서 휴식하기',
        '산책 시간 조절하기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '비 대응하기',
      description: '비 오는 날씨에서 강아지를 보호하는 방법',
      category: 'rainy',
      importance: 'high',
      steps: [
        '비옷 입히기',
        '비에 젖지 않도록 하기',
        '산책 후 몸 말리기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '바람 대응하기',
      description: '바람이 강한 날씨에서 강아지를 보호하는 방법',
      category: 'windy',
      importance: 'medium',
      steps: [
        '바람막이 옷 입히기',
        '바람이 강한 곳 피하기',
        '산책 시간 조절하기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '눈 대응하기',
      description: '눈 오는 날씨에서 강아지를 보호하는 방법',
      category: 'snowy',
      importance: 'high',
      steps: [
        '따뜻한 옷 입히기',
        '눈에 젖지 않도록 하기',
        '산책 후 몸 말리기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '일반적인 날씨 대응',
      description: '일반적인 날씨 변화에 대응하는 방법',
      category: 'general',
      importance: 'medium',
      steps: [
        '날씨 변화 관찰하기',
        '강아지 상태 확인하기',
        '적절한 대응하기',
        '과도한 활동 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 대응하세요',
        '과도한 자극을 피하세요',
        '정기적으로 상태를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '실내 환경 조절',
      description: '실내 환경을 날씨에 맞게 조절하는 방법',
      category: 'general',
      importance: 'medium',
      steps: [
        '실내 온도 조절하기',
        '습도 조절하기',
        '환기하기',
        '과도한 자극 피하기'
      ],
      tips: [
        '강아지가 편안해하는 방법으로 조절하세요',
        '과도한 자극을 피하세요',
        '정기적으로 환경을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '응급상황 대비',
      description: '날씨 관련 응급상황에 대비하는 방법',
      category: 'general',
      importance: 'high',
      steps: [
        '응급상황 대비 계획 세우기',
        '응급상황 대응 방법 숙지하기',
        '응급상황 발생 시 대응하기',
        '응급상황 후 정리하기'
      ],
      tips: [
        '강아지가 안전한 방법으로 대비하세요',
        '과도한 대비를 피하세요',
        '정기적으로 응급상황을 대비하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('weatherTasks')
    const savedRecords = localStorage.getItem('weatherRecords')
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        setTasks(initialTasks)
      }
    } else {
      setTasks(initialTasks)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('weatherTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('weatherRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            date: !task.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : task
    ))
  }

  const addRecord = () => {
    if (!newRecord.task) return

    const record: WeatherRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      weather: '',
      temperature: 20,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hot': return 'text-red-600 bg-red-100'
      case 'cold': return 'text-blue-600 bg-blue-100'
      case 'rainy': return 'text-gray-600 bg-gray-100'
      case 'windy': return 'text-yellow-600 bg-yellow-100'
      case 'snowy': return 'text-white bg-gray-800'
      case 'general': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'hot': return '더위'
      case 'cold': return '추위'
      case 'rainy': return '비'
      case 'windy': return '바람'
      case 'snowy': return '눈'
      case 'general': return '일반'
      default: return category
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high': return '높음'
      case 'medium': return '보통'
      case 'low': return '낮음'
      default: return importance
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

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const highImportanceTasks = tasks.filter(task => task.importance === 'high').length
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
            <Cloud className="w-10 h-10 text-blue-600 mr-3" />
            날씨 적응 가이드
          </h1>
          <p className="text-xl text-gray-600">다양한 날씨 조건에서의 반려견 관리</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Cloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">날씨 대응</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 대응</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceTasks}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">날씨 대응 방법</h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{task.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(task.category)}`}>
                            {getCategoryText(task.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(task.importance)}`}>
                            {getImportanceText(task.importance)}
                          </span>
                          {task.date && (
                            <span className="text-green-600">완료: {task.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.completed
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">단계</h4>
                        <ol className="text-sm text-gray-600 space-y-1">
                          {task.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {task.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">날씨 대응 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대응 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대응 방법</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">방법 선택</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.name}>
                          {task.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
                    <input
                      type="text"
                      value={newRecord.weather}
                      onChange={(e) => setNewRecord({...newRecord, weather: e.target.value})}
                      placeholder="날씨 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">온도 (°C)</label>
                    <input
                      type="number"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseInt(e.target.value) || 0})}
                      min="-20"
                      max="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대응 결과</label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                    <input
                      type="text"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                      placeholder="추가 메모"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  날씨 대응 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 날씨 대응 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.weather} • {record.temperature}°C
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌤️ 날씨 적응 가이드 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 방법으로 대응하세요</li>
                <li>• 일관성 있게 대응하세요</li>
                <li>• 정기적으로 상태를 확인하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 자극을 피하세요</li>
                <li>• 강아지가 불안해하면 즉시 중단하세요</li>
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