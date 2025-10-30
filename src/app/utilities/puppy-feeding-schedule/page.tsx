'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Utensils, Calendar, TrendingUp } from 'lucide-react'

interface FeedingSchedule {
  id: string
  age: string
  frequency: number
  amount: string
  times: string[]
  notes: string[]
}

interface FeedingRecord {
  id: string
  date: string
  time: string
  amount: number
  food: string
  notes: string
}

export default function PuppyFeedingSchedulePage() {
  const [schedules, setSchedules] = useState<FeedingSchedule[]>([])
  const [records, setRecords] = useState<FeedingRecord[]>([])
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    amount: 0,
    food: '',
    notes: ''
  })

  const feedingSchedules: FeedingSchedule[] = [
    {
      id: '1',
      age: '6-8주 (1.5-2개월)',
      frequency: 4,
      amount: '체중 1kg당 15-20g',
      times: ['07:00', '12:00', '17:00', '22:00'],
      notes: [
        '젖에서 떼어낸 직후',
        '부드러운 사료나 젖병 사용',
        '소화가 잘 되는 사료 선택',
        '충분한 수분 공급'
      ]
    },
    {
      id: '2',
      age: '8-12주 (2-3개월)',
      frequency: 4,
      amount: '체중 1kg당 18-25g',
      times: ['07:00', '12:00', '17:00', '22:00'],
      notes: [
        '성장이 가장 빠른 시기',
        '고품질 강아지 사료 사용',
        '규칙적인 급여 시간 유지',
        '급여량을 점진적으로 늘림'
      ]
    },
    {
      id: '3',
      age: '12-16주 (3-4개월)',
      frequency: 3,
      amount: '체중 1kg당 20-30g',
      times: ['08:00', '14:00', '20:00'],
      notes: [
        '급여 횟수를 3회로 줄임',
        '한 번에 더 많은 양 급여',
        '활동량에 따라 조절',
        '체중 증가 모니터링'
      ]
    },
    {
      id: '4',
      age: '16-24주 (4-6개월)',
      frequency: 3,
      amount: '체중 1kg당 25-35g',
      times: ['08:00', '14:00', '20:00'],
      notes: [
        '성장 속도가 둔화됨',
        '급여량을 안정적으로 유지',
        '비만에 주의',
        '운동량과 균형 맞추기'
      ]
    },
    {
      id: '5',
      age: '6-12개월',
      frequency: 2,
      amount: '체중 1kg당 30-40g',
      times: ['08:00', '20:00'],
      notes: [
        '성견용 사료로 전환',
        '급여 횟수를 2회로 줄임',
        '성장 완료 시점',
        '체중 유지에 집중'
      ]
    }
  ]

  const foodTypes = [
    '강아지 사료 (드라이)',
    '강아지 사료 (웻)',
    '강아지 사료 (소프트)',
    '수제 사료',
    '기타'
  ]

  useEffect(() => {
    setSchedules(feedingSchedules)
    const savedRecords = localStorage.getItem('feedingRecords')
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('feedingRecords', JSON.stringify(records))
    }
  }, [records])

  const addRecord = () => {
    if (!newRecord.time || !newRecord.food || newRecord.amount <= 0) return

    const record: FeedingRecord = {
      id: Date.now().toString(),
      ...newRecord
    }
    setRecords([record, ...records])
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      time: '',
      amount: 0,
      food: '',
      notes: ''
    })
  }

  const deleteRecord = (recordId: string) => {
    setRecords(records.filter(record => record.id !== recordId))
  }

  const getTotalAmountToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return records
      .filter(record => record.date === today)
      .reduce((total, record) => total + record.amount, 0)
  }

  const getFeedingCountToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return records.filter(record => record.date === today).length
  }

  const getAverageAmount = () => {
    if (records.length === 0) return 0
    const totalAmount = records.reduce((total, record) => total + record.amount, 0)
    return Math.round(totalAmount / records.length)
  }

  const todayAmount = getTotalAmountToday()
  const todayCount = getFeedingCountToday()
  const averageAmount = getAverageAmount()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-10 h-10 text-green-600 mr-3" />
            강아지 급여 일정표
          </h1>
          <p className="text-xl text-gray-600">강아지 연령별 급여 횟수와 양을 관리합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Utensils className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{todayAmount}g</p>
            <p className="text-sm text-gray-600">오늘 급여량</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{todayCount}회</p>
            <p className="text-sm text-gray-600">오늘 급여 횟수</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{averageAmount}g</p>
            <p className="text-sm text-gray-600">평균 급여량</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{records.length}회</p>
            <p className="text-sm text-gray-600">총 급여 기록</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">연령별 급여 가이드</h2>
              <div className="space-y-6">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{schedule.age}</h3>
                        <p className="text-sm text-gray-600">하루 {schedule.frequency}회 • {schedule.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">급여 시간</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.times.map((time, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">주의사항:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {schedule.notes.map((note, index) => (
                          <li key={index} className="text-sm text-gray-600">{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">급여 기록</h2>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">급여량 (g)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newRecord.amount || ''}
                      onChange={(e) => setNewRecord({...newRecord, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사료 종류</label>
                    <select
                      value={newRecord.food}
                      onChange={(e) => setNewRecord({...newRecord, food: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">사료 종류 선택</option>
                      {foodTypes.map((food) => (
                        <option key={food} value={food}>{food}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    placeholder="급여 시 특이사항이나 강아지 반응"
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
                  <h3 className="text-lg font-semibold text-gray-900">최근 급여 기록</h3>
                  {records.slice(0, 10).map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{record.food}</p>
                          <p className="text-sm text-gray-600">{record.date} {record.time}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-green-600">{record.amount}g</span>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
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

        <div className="bg-green-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🍽️ 급여 관리 팁</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">급여 시 주의사항</h3>
              <ul className="space-y-1 text-sm">
                <li>• 규칙적인 시간에 급여하세요</li>
                <li>• 급여 후 30분 정도 휴식을 취하세요</li>
                <li>• 급여량을 점진적으로 조절하세요</li>
                <li>• 강아지의 체중을 정기적으로 측정하세요</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">사료 선택 가이드</h3>
              <ul className="space-y-1 text-sm">
                <li>• 연령에 맞는 사료를 선택하세요</li>
                <li>• 고품질 단백질이 풍부한 사료를 선택하세요</li>
                <li>• 사료 변경 시 점진적으로 진행하세요</li>
                <li>• 수의사와 상담하여 선택하세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
