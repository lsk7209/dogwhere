'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, CheckCircle, Clock, AlertTriangle, Home } from 'lucide-react'

interface SleepEnvironmentTask {
  id: string
  name: string
  description: string
  category: 'temperature' | 'lighting' | 'noise' | 'comfort' | 'safety'
  importance: 'high' | 'medium' | 'low'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface SleepEnvironmentRecord {
  id: string
  date: string
  task: string
  temperature: number
  noiseLevel: 'low' | 'medium' | 'high'
  lighting: 'dark' | 'dim' | 'bright'
  dogSleepQuality: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogSleepEnvironmentPage() {
  const [tasks, setTasks] = useState<SleepEnvironmentTask[]>([])
  const [records, setRecords] = useState<SleepEnvironmentRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    temperature: 22,
    noiseLevel: 'low' as 'low' | 'medium' | 'high',
    lighting: 'dark' as 'dark' | 'dim' | 'bright',
    dogSleepQuality: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTasks: SleepEnvironmentTask[] = [
    {
      id: '1',
      name: '적절한 온도 유지',
      description: '강아지가 편안하게 잠들 수 있는 적절한 온도 조절',
      category: 'temperature',
      importance: 'high',
      steps: [
        '실내 온도를 18-22도로 유지',
        '강아지 침대 주변 온도 확인',
        '계절에 따른 온도 조절',
        '온도 변화 모니터링'
      ],
      tips: [
        '강아지가 편안해하는 온도를 찾으세요',
        '과도한 온도 변화를 피하세요',
        '정기적으로 온도를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '조명 환경 조성',
      description: '강아지가 편안하게 잠들 수 있는 조명 환경 만들기',
      category: 'lighting',
      importance: 'high',
      steps: [
        '수면 시간에는 어둡게 유지',
        '자연광 활용하기',
        '인공 조명 조절하기',
        '밤중 조명 최소화'
      ],
      tips: [
        '강아지가 편안해하는 조명을 찾으세요',
        '과도한 조명을 피하세요',
        '정기적으로 조명을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '소음 차단',
      description: '강아지가 편안하게 잠들 수 있는 조용한 환경 만들기',
      category: 'noise',
      importance: 'high',
      steps: [
        '외부 소음 차단하기',
        '실내 소음 최소화하기',
        '화이트 노이즈 활용하기',
        '소음 차단 도구 사용하기'
      ],
      tips: [
        '강아지가 편안해하는 소음 수준을 찾으세요',
        '과도한 소음을 피하세요',
        '정기적으로 소음을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '편안한 침구 준비',
      description: '강아지가 편안하게 잠들 수 있는 침구 준비',
      category: 'comfort',
      importance: 'high',
      steps: [
        '적절한 크기의 침대 선택',
        '부드러운 침구 사용',
        '정기적인 침구 교체',
        '개인별 침구 관리'
      ],
      tips: [
        '강아지가 편안해하는 침구를 찾으세요',
        '과도한 자극을 피하세요',
        '정기적으로 침구를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '안전한 환경 조성',
      description: '강아지가 안전하게 잠들 수 있는 환경 만들기',
      category: 'safety',
      importance: 'high',
      steps: [
        '위험한 물건 제거하기',
        '안전한 장소 선택하기',
        '응급상황 대비하기',
        '정기적인 안전 점검'
      ],
      tips: [
        '강아지가 안전한 환경을 만드세요',
        '과도한 위험을 피하세요',
        '정기적으로 안전을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '습도 관리',
      description: '강아지가 편안하게 잠들 수 있는 적절한 습도 유지',
      category: 'temperature',
      importance: 'medium',
      steps: [
        '실내 습도를 40-60%로 유지',
        '습도 측정기 사용하기',
        '가습기나 제습기 활용하기',
        '습도 변화 모니터링'
      ],
      tips: [
        '강아지가 편안해하는 습도를 찾으세요',
        '과도한 습도 변화를 피하세요',
        '정기적으로 습도를 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '공기 질 관리',
      description: '강아지가 편안하게 잠들 수 있는 깨끗한 공기 유지',
      category: 'comfort',
      importance: 'medium',
      steps: [
        '정기적인 환기하기',
        '공기 청정기 사용하기',
        '먼지 제거하기',
        '공기 질 모니터링'
      ],
      tips: [
        '강아지가 편안해하는 공기 질을 유지하세요',
        '과도한 공기 오염을 피하세요',
        '정기적으로 공기 질을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '개인 공간 확보',
      description: '강아지가 혼자 편안하게 잠들 수 있는 개인 공간 만들기',
      category: 'comfort',
      importance: 'medium',
      steps: [
        '전용 수면 공간 만들기',
        '다른 동물과 분리하기',
        '개인 공간 존중하기',
        '정기적인 공간 점검'
      ],
      tips: [
        '강아지가 편안해하는 개인 공간을 만드세요',
        '과도한 간섭을 피하세요',
        '정기적으로 개인 공간을 확인하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTasks = localStorage.getItem('sleepEnvironmentTasks')
    const savedRecords = localStorage.getItem('sleepEnvironmentRecords')
    
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
      localStorage.setItem('sleepEnvironmentTasks', JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('sleepEnvironmentRecords', JSON.stringify(records))
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

    const record: SleepEnvironmentRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      task: '',
      temperature: 22,
      noiseLevel: 'low',
      lighting: 'dark',
      dogSleepQuality: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'temperature': return 'text-blue-600 bg-blue-100'
      case 'lighting': return 'text-yellow-600 bg-yellow-100'
      case 'noise': return 'text-green-600 bg-green-100'
      case 'comfort': return 'text-purple-600 bg-purple-100'
      case 'safety': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'temperature': return '온도'
      case 'lighting': return '조명'
      case 'noise': return '소음'
      case 'comfort': return '편안함'
      case 'safety': return '안전'
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

  const getNoiseLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getNoiseLevelText = (level: string) => {
    switch (level) {
      case 'low': return '낮음'
      case 'medium': return '보통'
      case 'high': return '높음'
      default: return level
    }
  }

  const getLightingColor = (lighting: string) => {
    switch (lighting) {
      case 'dark': return 'text-gray-600 bg-gray-100'
      case 'dim': return 'text-yellow-600 bg-yellow-100'
      case 'bright': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLightingText = (lighting: string) => {
    switch (lighting) {
      case 'dark': return '어둠'
      case 'dim': return '어둠'
      case 'bright': return '밝음'
      default: return lighting
    }
  }

  const getSleepQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSleepQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return '매우 좋음'
      case 'good': return '좋음'
      case 'fair': return '보통'
      case 'poor': return '나쁨'
      default: return quality
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const highImportanceTasks = tasks.filter(task => task.importance === 'high').length
  const excellentSleepRecords = records.filter(record => record.dogSleepQuality === 'excellent').length
  const totalRecords = records.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Moon className="w-10 h-10 text-purple-600 mr-3" />
            수면 환경 최적화
          </h1>
          <p className="text-xl text-gray-600">강아지 수면 환경 조성과 개선 방법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Moon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTasks}개</p>
            <p className="text-sm text-gray-600">환경 작업</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTasks}개</p>
            <p className="text-sm text-gray-600">완료된 작업</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceTasks}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{excellentSleepRecords}회</p>
            <p className="text-sm text-gray-600">우수한 수면</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 환경 작업</h2>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수면 환경 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">관찰 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">환경 작업</label>
                    <select
                      value={newRecord.task}
                      onChange={(e) => setNewRecord({...newRecord, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">작업 선택</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">온도 (°C)</label>
                    <input
                      type="number"
                      value={newRecord.temperature}
                      onChange={(e) => setNewRecord({...newRecord, temperature: parseInt(e.target.value) || 0})}
                      min="10"
                      max="40"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소음 수준</label>
                    <select
                      value={newRecord.noiseLevel}
                      onChange={(e) => setNewRecord({...newRecord, noiseLevel: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">낮음</option>
                      <option value="medium">보통</option>
                      <option value="high">높음</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">조명</label>
                    <select
                      value={newRecord.lighting}
                      onChange={(e) => setNewRecord({...newRecord, lighting: e.target.value as 'dark' | 'dim' | 'bright'})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="dark">어둠</option>
                      <option value="dim">어둠</option>
                      <option value="bright">밝음</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">수면 품질</label>
                    <select
                      value={newRecord.dogSleepQuality}
                      onChange={(e) => setNewRecord({...newRecord, dogSleepQuality: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
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
                    placeholder="수면 환경 개선 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  환경 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 수면 환경 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.task}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            온도: {record.temperature}°C • 소음: {getNoiseLevelText(record.noiseLevel)} • 조명: {getLightingText(record.lighting)}
                          </p>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getSleepQualityColor(record.dogSleepQuality)}`}>
                          {getSleepQualityText(record.dogSleepQuality)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌙 수면 환경 최적화 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 환경을 만드세요</li>
                <li>• 일관성 있게 환경을 관리하세요</li>
                <li>• 정기적으로 환경을 점검하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 환경 변화를 피하세요</li>
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