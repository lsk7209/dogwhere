'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Plus, Calendar, CheckCircle, ArrowLeft, Dog, Cat, Fish, Rabbit, Bird, Trash2, Clock, AlertCircle } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'pets' | 'schedule'>('schedule')

  const petTypes = [
    { id: 'dog', label: '강아지', icon: Dog },
    { id: 'cat', label: '고양이', icon: Cat },
    { id: 'rabbit', label: '토끼', icon: Rabbit },
    { id: 'bird', label: '새', icon: Bird },
    { id: 'fish', label: '물고기', icon: Fish },
    { id: 'other', label: '기타', icon: Users }
  ]

  const activityTypes = [
    '산책', '식사', '약물 복용', '놀이', '훈련', '미용', '병원 방문', '양치질'
  ]

  useEffect(() => {
    const savedPets = localStorage.getItem('multiPetPets')
    const savedSchedules = localStorage.getItem('multiPetSchedules')

    if (savedPets) {
      try {
        setPets(JSON.parse(savedPets))
      } catch (e) { }
    }
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules))
      } catch (e) { }
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
    setActiveTab('pets')
  }

  const deletePet = (id: string) => {
    const updated = pets.filter(p => p.id !== id)
    setPets(updated)
    localStorage.setItem('multiPetPets', JSON.stringify(updated))
    // Also remove schedules for this pet
    const updatedSchedules = schedules.filter(s => s.petId !== id)
    setSchedules(updatedSchedules)
    localStorage.setItem('multiPetSchedules', JSON.stringify(updatedSchedules))
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

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id)
    setSchedules(updated)
    localStorage.setItem('multiPetSchedules', JSON.stringify(updated))
  }

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === scheduleId
        ? { ...schedule, completed: !schedule.completed }
        : schedule
    ))
  }

  const getPetName = (petId: string) => pets.find(p => p.id === petId)?.name || '알 수 없음'
  const getPetType = (petId: string) => pets.find(p => p.id === petId)?.type || 'dog'

  const getPetIcon = (type: string) => {
    const found = petTypes.find(t => t.id === type)
    const Icon = found ? found.icon : Users
    return <Icon className="w-5 h-5" />
  }

  const todaySchedules = schedules
    .filter(s => s.date === new Date().toISOString().split('T')[0])
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/utilities"
            className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            유틸리티 목록으로
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">다둥이 스케줄러</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            여러 아이들의 일정을 한눈에 관리하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'schedule'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                일정 추가
              </button>
              <button
                onClick={() => setActiveTab('pets')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'pets'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                반려동물 관리
              </button>
            </div>

            {activeTab === 'schedule' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  새 일정 등록
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">누구의 일정인가요?</label>
                    {pets.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {pets.map((pet) => (
                          <button
                            key={pet.id}
                            onClick={() => setNewSchedule({ ...newSchedule, petId: pet.id })}
                            className={`p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${newSchedule.petId === pet.id
                                ? 'bg-green-50 border-green-500 text-green-700 font-bold'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {getPetIcon(pet.type)}
                            {pet.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg text-center">
                        먼저 반려동물을 등록해주세요.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                    <input
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">활동 종류</label>
                    <div className="flex flex-wrap gap-2">
                      {activityTypes.map((activity) => (
                        <button
                          key={activity}
                          onClick={() => setNewSchedule({ ...newSchedule, activity })}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${newSchedule.activity === activity
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                    <input
                      type="text"
                      value={newSchedule.notes}
                      onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                      placeholder="특이사항 입력"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    onClick={addSchedule}
                    disabled={!newSchedule.petId || !newSchedule.time || !newSchedule.activity}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    일정 추가하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-500" />
                  반려동물 등록
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    <input
                      type="text"
                      value={newPet.name}
                      onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">종류</label>
                    <div className="grid grid-cols-3 gap-2">
                      {petTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setNewPet({ ...newPet, type: type.id })}
                          className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${newPet.type === type.id
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <type.icon className="w-5 h-5" />
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                    <input
                      type="text"
                      value={newPet.age}
                      onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                      placeholder="예: 2살"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    onClick={addPet}
                    disabled={!newPet.name}
                    className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    등록하기
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  오늘의 일정 ({todaySchedules.length})
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3">
                {todaySchedules.length > 0 ? (
                  todaySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`flex items-center p-4 rounded-xl border transition-all ${schedule.completed
                          ? 'bg-gray-50 border-gray-100 opacity-70'
                          : 'bg-white border-green-100 shadow-sm hover:shadow-md'
                        }`}
                    >
                      <button
                        onClick={() => toggleSchedule(schedule.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${schedule.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                          }`}
                      >
                        {schedule.completed && <CheckCircle className="w-4 h-4" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-green-600 w-16">{schedule.time}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600`}>
                            {schedule.activity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <span className="mr-2 text-gray-400">{getPetIcon(getPetType(schedule.petId))}</span>
                            {getPetName(schedule.petId)}
                          </div>
                          {schedule.notes && (
                            <span className="text-sm text-gray-500 border-l pl-2 border-gray-200">
                              {schedule.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                    오늘 예정된 일정이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* Pet List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-400" />
                우리 아이들 ({pets.length})
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="group relative flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm mr-4">
                      {getPetIcon(pet.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.age}</p>
                    </div>
                    <button
                      onClick={() => deletePet(pet.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {pets.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
                    등록된 반려동물이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
