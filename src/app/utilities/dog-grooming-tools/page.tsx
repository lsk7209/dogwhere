'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scissors, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react'

interface GroomingTool {
  id: string
  name: string
  description: string
  category: 'brushing' | 'bathing' | 'nail' | 'ear' | 'dental' | 'specialty'
  importance: 'high' | 'medium' | 'low'
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed'
  steps: string[]
  tips: string[]
  completed: boolean
  date?: string
  notes?: string
}

interface GroomingRecord {
  id: string
  date: string
  tool: string
  duration: number
  result: 'excellent' | 'good' | 'fair' | 'poor'
  notes: string
}

export default function DogGroomingToolsPage() {
  const [tools, setTools] = useState<GroomingTool[]>([])
  const [records, setRecords] = useState<GroomingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    tool: '',
    duration: 15,
    result: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: ''
  })

  const initialTools: GroomingTool[] = [
    {
      id: '1',
      name: '브러시',
      description: '강아지 털을 빗어주는 기본 도구',
      category: 'brushing',
      importance: 'high',
      frequency: 'daily',
      steps: [
        '적절한 브러시 선택하기',
        '털을 부드럽게 빗기',
        '매듭 제거하기',
        '정리하기'
      ],
      tips: [
        '강아지가 편안해하는 브러시를 선택하세요',
        '과도한 힘을 사용하지 마세요',
        '정기적으로 브러시하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '2',
      name: '샴푸',
      description: '강아지 목욕용 샴푸',
      category: 'bathing',
      importance: 'high',
      frequency: 'weekly',
      steps: [
        '적절한 샴푸 선택하기',
        '온수로 몸 적시기',
        '샴푸로 부드럽게 마사지',
        '깨끗이 헹구기'
      ],
      tips: [
        '강아지 전용 샴푸를 사용하세요',
        '과도한 샴푸를 사용하지 마세요',
        '정기적으로 목욕시키세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '3',
      name: '발톱 깎이',
      description: '강아지 발톱을 깎는 도구',
      category: 'nail',
      importance: 'high',
      frequency: 'monthly',
      steps: [
        '안전한 발톱 깎이 선택',
        '발톱 길이 확인하기',
        '조심스럽게 발톱 깎기',
        '깎은 후 정리하기'
      ],
      tips: [
        '강아지 전용 발톱 깎이를 사용하세요',
        '과도한 발톱을 깎지 마세요',
        '정기적으로 발톱을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '4',
      name: '귀 세정제',
      description: '강아지 귀를 깨끗하게 하는 세정제',
      category: 'ear',
      importance: 'high',
      frequency: 'weekly',
      steps: [
        '적절한 귀 세정제 선택',
        '귀 안쪽 확인하기',
        '부드럽게 세정하기',
        '깨끗이 닦기'
      ],
      tips: [
        '강아지 전용 귀 세정제를 사용하세요',
        '과도한 세정을 하지 마세요',
        '정기적으로 귀를 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '5',
      name: '칫솔',
      description: '강아지 치아를 깨끗하게 하는 칫솔',
      category: 'dental',
      importance: 'high',
      frequency: 'daily',
      steps: [
        '강아지 전용 칫솔 선택',
        '치아 상태 확인하기',
        '부드럽게 칫솔질하기',
        '입안 정리하기'
      ],
      tips: [
        '강아지 전용 칫솔을 사용하세요',
        '과도한 칫솔질을 하지 마세요',
        '정기적으로 칫솔질하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '6',
      name: '털 깎기 기계',
      description: '강아지 털을 깎는 전기 기계',
      category: 'specialty',
      importance: 'medium',
      frequency: 'monthly',
      steps: [
        '안전한 털 깎기 기계 선택',
        '털 상태 확인하기',
        '조심스럽게 털 깎기',
        '깎은 후 정리하기'
      ],
      tips: [
        '강아지 전용 털 깎기 기계를 사용하세요',
        '과도한 털을 깎지 마세요',
        '정기적으로 털을 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '7',
      name: '타월',
      description: '강아지 몸을 닦는 타월',
      category: 'bathing',
      importance: 'medium',
      frequency: 'as_needed',
      steps: [
        '부드러운 타월 선택',
        '몸을 부드럽게 닦기',
        '털을 말리기',
        '타월 정리하기'
      ],
      tips: [
        '강아지 전용 타월을 사용하세요',
        '과도한 힘을 사용하지 마세요',
        '정기적으로 타월을 사용하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    },
    {
      id: '8',
      name: '귀 면봉',
      description: '강아지 귀를 세정하는 면봉',
      category: 'ear',
      importance: 'medium',
      frequency: 'weekly',
      steps: [
        '안전한 귀 면봉 선택',
        '귀 안쪽 확인하기',
        '부드럽게 세정하기',
        '면봉 정리하기'
      ],
      tips: [
        '강아지 전용 귀 면봉을 사용하세요',
        '과도한 세정을 하지 마세요',
        '정기적으로 귀를 관리하세요',
        '필요시 전문가의 도움을 받으세요'
      ],
      completed: false
    }
  ]

  useEffect(() => {
    const savedTools = localStorage.getItem('groomingTools')
    const savedRecords = localStorage.getItem('groomingRecords')
    
    if (savedTools) {
      try {
        setTools(JSON.parse(savedTools))
      } catch (e) {
        setTools(initialTools)
      }
    } else {
      setTools(initialTools)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (tools.length > 0) {
      localStorage.setItem('groomingTools', JSON.stringify(tools))
    }
  }, [tools])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('groomingRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleTool = (toolId: string) => {
    setTools(tools.map(tool => 
      tool.id === toolId 
        ? { 
            ...tool, 
            completed: !tool.completed,
            date: !tool.completed ? new Date().toISOString().split('T')[0] : undefined
          } 
        : tool
    ))
  }

  const addRecord = () => {
    if (!newRecord.tool) return

    const record: GroomingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      tool: '',
      duration: 15,
      result: 'good',
      notes: ''
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'brushing': return 'text-blue-600 bg-blue-100'
      case 'bathing': return 'text-green-600 bg-green-100'
      case 'nail': return 'text-purple-600 bg-purple-100'
      case 'ear': return 'text-pink-600 bg-pink-100'
      case 'dental': return 'text-orange-600 bg-orange-100'
      case 'specialty': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'brushing': return '빗질'
      case 'bathing': return '목욕'
      case 'nail': return '발톱'
      case 'ear': return '귀'
      case 'dental': return '치아'
      case 'specialty': return '전문'
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일'
      case 'weekly': return '주간'
      case 'monthly': return '월간'
      case 'as_needed': return '필요시'
      default: return frequency
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

  const completedTools = tools.filter(tool => tool.completed).length
  const totalTools = tools.length
  const highImportanceTools = tools.filter(tool => tool.importance === 'high').length
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
            <Scissors className="w-10 h-10 text-purple-600 mr-3" />
            미용 도구 가이드
          </h1>
          <p className="text-xl text-gray-600">견종별 필요한 미용 도구와 사용법</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Scissors className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTools}개</p>
            <p className="text-sm text-gray-600">미용 도구</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedTools}개</p>
            <p className="text-sm text-gray-600">완료된 도구</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{highImportanceTools}개</p>
            <p className="text-sm text-gray-600">고우선순위</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{excellentRecords}회</p>
            <p className="text-sm text-gray-600">우수한 결과</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">미용 도구</h2>
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(tool.category)}`}>
                            {getCategoryText(tool.category)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getImportanceColor(tool.importance)}`}>
                            {getImportanceText(tool.importance)}
                          </span>
                          <span className="text-blue-600">{getFrequencyText(tool.frequency)}</span>
                          {tool.date && (
                            <span className="text-green-600">완료: {tool.date}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleTool(tool.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          tool.completed
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
                          {tool.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">팁</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {tool.tips.map((tip, index) => (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">미용 기록</h2>
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 날짜</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 도구</label>
                    <select
                      value={newRecord.tool}
                      onChange={(e) => setNewRecord({...newRecord, tool: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">도구 선택</option>
                      {tools.map((tool) => (
                        <option key={tool.id} value={tool.name}>
                          {tool.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 시간 (분)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">미용 결과</label>
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
                    placeholder="미용 과정이나 강아지 반응"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  미용 기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 미용 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.tool}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                          <p className="text-sm text-gray-600">
                            {record.duration}분
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

        <div className="bg-purple-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✂️ 미용 도구 가이드 핵심 포인트</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">성공을 위한 원칙</h3>
              <ul className="space-y-1 text-sm">
                <li>• 강아지가 편안해하는 도구를 선택하세요</li>
                <li>• 일관성 있게 미용하세요</li>
                <li>• 정기적으로 미용하세요</li>
                <li>• 전문가의 도움을 받으세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 과도한 힘을 사용하지 마세요</li>
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