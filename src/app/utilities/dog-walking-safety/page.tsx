'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle, MapPin, Clock } from 'lucide-react'

interface SafetyCheck {
  id: string
  category: string
  item: string
  checked: boolean
  importance: 'high' | 'medium' | 'low'
  tips: string[]
}

interface WalkingRecord {
  id: string
  date: string
  time: string
  location: string
  duration: number
  weather: string
  incidents: string[]
  notes: string
}

export default function DogWalkingSafetyPage() {
  const [safetyChecks, setSafetyChecks] = useState<SafetyCheck[]>([])
  const [records, setRecords] = useState<WalkingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    duration: 0,
    weather: '',
    incidents: [] as string[],
    notes: ''
  })

  const safetyCheckItems: SafetyCheck[] = [
    // 산책 전 준비
    {
      id: '1',
      category: '산책 전 준비',
      item: '목줄과 하네스 점검',
      checked: false,
      importance: 'high',
      tips: [
        '목줄이 단단히 고정되어 있는지 확인',
        '하네스가 제대로 착용되었는지 확인',
        '목줄이 너무 길거나 짧지 않은지 확인'
      ]
    },
    {
      id: '2',
      category: '산책 전 준비',
      item: '날씨 확인',
      checked: false,
      importance: 'high',
      tips: [
        '온도가 너무 높거나 낮지 않은지 확인',
        '비나 눈이 오는지 확인',
        '바람이 강한지 확인'
      ]
    },
    {
      id: '3',
      category: '산책 전 준비',
      item: '강아지 상태 확인',
      checked: false,
      importance: 'high',
      tips: [
        '건강 상태가 양호한지 확인',
        '식사 후 적절한 시간이 지났는지 확인',
        '스트레스나 불안감이 없는지 확인'
      ]
    },
    {
      id: '4',
      category: '산책 전 준비',
      item: '응급용품 준비',
      checked: false,
      importance: 'medium',
      tips: [
        '응급처치용품 준비',
        '물과 간식 준비',
        '강아지 신분증 지참'
      ]
    },
    // 산책 중 안전
    {
      id: '5',
      category: '산책 중 안전',
      item: '도로 횡단 안전',
      checked: false,
      importance: 'high',
      tips: [
        '신호등을 준수하여 횡단',
        '좌우를 잘 살펴보고 횡단',
        '강아지가 갑자기 뛰어나가지 않도록 주의'
      ]
    },
    {
      id: '6',
      category: '산책 중 안전',
      item: '다른 강아지와의 만남',
      checked: false,
      importance: 'high',
      tips: [
        '상대방 강아지의 상태를 먼저 확인',
        '강아지가 서로 편안해하는지 확인',
        '무리하게 만나지 않기'
      ]
    },
    {
      id: '7',
      category: '산책 중 안전',
      item: '위험한 물건 피하기',
      checked: false,
      importance: 'high',
      tips: [
        '유리 조각, 날카로운 물건 피하기',
        '독성 물질이나 쓰레기 피하기',
        '강아지가 이상한 것을 먹지 않도록 주의'
      ]
    },
    {
      id: '8',
      category: '산책 중 안전',
      item: '자동차와의 거리 유지',
      checked: false,
      importance: 'high',
      tips: [
        '도로에서 충분한 거리 유지',
        '주차된 자동차 사이를 지날 때 주의',
        '자동차 소리에 강아지가 놀라지 않도록 주의'
      ]
    },
    // 산책 후 관리
    {
      id: '9',
      category: '산책 후 관리',
      item: '발과 몸 점검',
      checked: false,
      importance: 'high',
      tips: [
        '발가락 사이에 이물질이 있는지 확인',
        '상처나 자극이 있는지 확인',
        '털에 진드기나 벌레가 있는지 확인'
      ]
    },
    {
      id: '10',
      category: '산책 후 관리',
      item: '목욕 및 청소',
      checked: false,
      importance: 'medium',
      tips: [
        '필요시 발만 씻어주기',
        '털을 빗어주기',
        '귀와 눈 주변 청소'
      ]
    },
    {
      id: '11',
      category: '산책 후 관리',
      item: '충분한 휴식',
      checked: false,
      importance: 'medium',
      tips: [
        '충분한 물 제공',
        '편안한 곳에서 휴식',
        '다음 산책까지 적절한 간격 유지'
      ]
    }
  ]

  const incidentTypes = [
    '다른 강아지와 싸움',
    '자동차에 놀람',
    '위험한 물건 섭취',
    '상처 발생',
    '과도한 흥분',
    '도망 시도',
    '기타'
  ]

  const weatherOptions = [
    '맑음', '흐림', '비', '눈', '바람', '폭염', '한파'
  ]

  useEffect(() => {
    const savedChecks = localStorage.getItem('walkingSafetyChecks')
    const savedRecords = localStorage.getItem('walkingRecords')
    
    if (savedChecks) {
      try {
        setSafetyChecks(JSON.parse(savedChecks))
      } catch (e) {
        setSafetyChecks(safetyCheckItems)
      }
    } else {
      setSafetyChecks(safetyCheckItems)
    }
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (safetyChecks.length > 0) {
      localStorage.setItem('walkingSafetyChecks', JSON.stringify(safetyChecks))
    }
  }, [safetyChecks])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('walkingRecords', JSON.stringify(records))
    }
  }, [records])

  const toggleCheck = (checkId: string) => {
    setSafetyChecks(safetyChecks.map(check => 
      check.id === checkId ? { ...check, checked: !check.checked } : check
    ))
  }

  const addRecord = () => {
    if (!newRecord.time || !newRecord.location) return

    const record: WalkingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      duration: 0,
      weather: '',
      incidents: [],
      notes: ''
    })
  }

  const toggleIncident = (incident: string) => {
    setNewRecord({
      ...newRecord,
      incidents: newRecord.incidents.includes(incident)
        ? newRecord.incidents.filter(i => i !== incident)
        : [...newRecord.incidents, incident]
    })
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

  const completedChecks = safetyChecks.filter(check => check.checked).length
  const totalChecks = safetyChecks.length
  const highPriorityChecks = safetyChecks.filter(check => check.importance === 'high')
  const completedHighPriority = highPriorityChecks.filter(check => check.checked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-10 h-10 text-blue-600 mr-3" />
            산책 안전 가이드
          </h1>
          <p className="text-xl text-gray-600">산책 시 안전사항과 주의점을 제공합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalChecks}개</p>
            <p className="text-sm text-gray-600">총 체크 항목</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{completedChecks}개</p>
            <p className="text-sm text-gray-600">완료된 항목</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{completedHighPriority}개</p>
            <p className="text-sm text-gray-600">고우선순위 완료</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{records.length}회</p>
            <p className="text-sm text-gray-600">산책 기록</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">안전 체크리스트</h2>
              <div className="space-y-6">
                {Object.entries(
                  safetyChecks.reduce((acc, check) => {
                    if (!acc[check.category]) acc[check.category] = []
                    acc[check.category].push(check)
                    return acc
                  }, {} as { [key: string]: SafetyCheck[] })
                ).map(([category, categoryChecks]) => (
                  <div key={category} className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{category}</h3>
                    <div className="space-y-3">
                      {categoryChecks.map((check) => (
                        <div key={check.id} className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleCheck(check.id)}
                            className={`mt-1 p-1 rounded transition-colors ${
                              check.checked
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{check.item}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(check.importance)}`}>
                                {getImportanceText(check.importance)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {check.tips.map((tip, index) => (
                                <p key={index} className="text-sm text-gray-600">• {tip}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">산책 기록</h2>
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
                      placeholder="예: 한강공원"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">산책 시간 (분)</label>
                    <input
                      type="number"
                      min="0"
                      value={newRecord.duration || ''}
                      onChange={(e) => setNewRecord({...newRecord, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">날씨</label>
                  <select
                    value={newRecord.weather}
                    onChange={(e) => setNewRecord({...newRecord, weather: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">날씨 선택</option>
                    {weatherOptions.map((weather) => (
                      <option key={weather} value={weather}>{weather}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">발생한 사고/사건</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {incidentTypes.map((incident) => (
                      <button
                        key={incident}
                        onClick={() => toggleIncident(incident)}
                        className={`p-2 text-sm rounded border transition-colors ${
                          newRecord.incidents.includes(incident)
                            ? 'bg-red-100 border-red-400 text-red-700'
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {incident}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="산책 중 특이사항이나 주의할 점"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={addRecord}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  기록 추가
                </button>
              </div>

              {records.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">최근 산책 기록</h3>
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.location}</p>
                          <p className="text-sm text-gray-600">{record.date} {record.time} • {record.duration}분</p>
                          {record.weather && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mt-1">
                              {record.weather}
                            </span>
                          )}
                        </div>
                      </div>
                      {record.incidents.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {record.incidents.map((incident, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                              {incident}
                            </span>
                          ))}
                        </div>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚶‍♂️ 안전한 산책을 위한 팁</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">산책 전 준비</h3>
              <ul className="space-y-1 text-sm">
                <li>• 날씨와 온도를 확인하세요</li>
                <li>• 목줄과 하네스를 점검하세요</li>
                <li>• 강아지의 건강 상태를 확인하세요</li>
                <li>• 응급용품을 준비하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">산책 중 주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 도로 횡단 시 신호를 준수하세요</li>
                <li>• 다른 강아지와의 만남에 주의하세요</li>
                <li>• 위험한 물건을 피하세요</li>
                <li>• 강아지의 반응을 주의 깊게 관찰하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
