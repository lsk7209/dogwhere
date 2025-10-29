'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Plus, Calendar, CheckCircle } from 'lucide-react'

interface Pet {
  id: string
  name: string
  type: string
  age: string
  specialNeeds: string[]
}

interface Schedule {
  id: string
  petId: string
  date: string
  time: string
  activity: string
  completed: boolean
  notes: string
}

export default function MultiPetSchedulerPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'dog',
    age: '',
    specialNeeds: [] as string[]
  })
  const [newSchedule, setNewSchedule] = useState({
    petId: '',
    time: '',
    activity: '',
    notes: ''
  })

  const petTypes = ['dog', 'cat', 'bird', 'fish', 'hamster', 'rabbit', 'other']
  const specialNeedsOptions = [
    '약물 복용', '특별 식이', '물리치료', '정기 검진', '예방접종', '미용', '기타'
  ]
  const activityTypes = [
    '산책', '식사', '약물 복용', '놀이', '훈련', '미용', '병원 방문', '기타'
  ]

  useEffect(() => {
    const savedPets = localStorage.getItem('multiPetPets')
    const savedSchedules = localStorage.getItem('multiPetSchedules')
    
    if (savedPets) {
      try {
        setPets(JSON.parse(savedPets))
      } catch (e) {}
    }
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (pets.length > 0) {
      localStorage.setItem('multiPetPets', JSON.stringify(pets))
    }
  }, [pets])

  useEffect(() => {
    if (schedules.length > 0) {
      localStorage.setItem('multiPetSchedules', JSON.stringify(schedules))
    }
  }, [schedules])

  const addPet = () => {
    if (!newPet.name || !newPet.type) return

    const pet: Pet = {
      id: Date.now().toString(),
      ...newPet
    }
    setPets([...pets, pet])
    setNewPet({ name: '', type: 'dog', age: '', specialNeeds: [] })
  }

  const addSchedule = () => {
    if (!newSchedule.petId || !newSchedule.time || !newSchedule.activity) return

    const schedule: Schedule = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newSchedule,
      completed: false
    }
    setSchedules([schedule, ...schedules])
    setNewSchedule({ petId: '', time: '', activity: '', notes: '' })
  }

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, completed: !schedule.completed }
        : schedule
    ))
  }

  const toggleSpecialNeed = (need: string) => {
    setNewPet({
      ...newPet,
      specialNeeds: newPet.specialNeeds.includes(need)
        ? newPet.specialNeeds.filter(n => n !== need)
        : [...newPet.specialNeeds, need]
    })
  }

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet ? pet.name : '알 수 없음'
  }

  const getPetType = (petId: string) => {
    const pet = pets.find(p => p.id === petId)
    return pet ? pet.type : 'unknown'
  }

  const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split('T')[0])
  const completedToday = todaySchedules.filter(s => s.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-10 h-10 text-green-600 mr-3" />
            다중 반려동물 일정 관리
          </h1>
          <p className="text-xl text-gray-600">여러 마리 반려동물의 일정을 통합 관리합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{pets.length}마리</p>
            <p className="text-sm text-gray-600">등록된 반려동물</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{todaySchedules.length}개</p>
            <p className="text-sm text-gray-600">오늘 일정</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedToday}개</p>
            <p className="text-sm text-gray-600">완료된 일정</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">반려동물 등록</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  value={newPet.name}
                  onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                  placeholder="반려동물 이름"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">종류</label>
                <select
                  value={newPet.type}
                  onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {petTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                <input
                  type="text"
                  value={newPet.age}
                  onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                  placeholder="예: 2세, 6개월"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">특별 관리 사항</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {specialNeedsOptions.map((need) => (
                  <button
                    key={need}
                    onClick={() => toggleSpecialNeed(need)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      newPet.specialNeeds.includes(need)
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={addPet}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              반려동물 등록
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">일정 추가</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">반려동물</label>
                <select
                  value={newSchedule.petId}
                  onChange={(e) => setNewSchedule({...newSchedule, petId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">반려동물 선택</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                <input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">활동</label>
              <select
                value={newSchedule.activity}
                onChange={(e) => setNewSchedule({...newSchedule, activity: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">활동 선택</option>
                {activityTypes.map((activity) => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <input
                type="text"
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                placeholder="특별한 주의사항이나 세부사항"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={addSchedule}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              일정 추가
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">등록된 반려동물</h2>
          {pets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 반려동물이 없습니다
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pet.type} | {pet.age}</p>
                  {pet.specialNeeds.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">특별 관리:</p>
                      <div className="flex flex-wrap gap-1">
                        {pet.specialNeeds.map((need, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">오늘의 일정</h2>
          {todaySchedules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              오늘 일정이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-gray-900">{getPetName(schedule.petId)}</h3>
                        <span className="text-sm text-gray-600">{schedule.time}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {schedule.activity}
                        </span>
                      </div>
                      {schedule.notes && (
                        <p className="text-sm text-gray-500">메모: {schedule.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        schedule.completed
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {schedule.completed ? '완료' : '미완료'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 다중 반려동물 관리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 각 반려동물의 특별한 요구사항을 기록해두세요</li>
            <li>• 일정을 겹치지 않도록 조정하세요</li>
            <li>• 각 반려동물에게 충분한 개별 시간을 제공하세요</li>
            <li>• 긴급상황을 대비해 연락처를 준비해두세요</li>
            <li>• 정기적으로 일정을 검토하고 조정하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
