'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Camera, Calendar, Tag, Heart, Download, Upload } from 'lucide-react'

interface Photo {
  id: string
  name: string
  date: string
  event: string
  tags: string[]
  description: string
  favorite: boolean
}

export default function DogPhotoOrganizerPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [newPhoto, setNewPhoto] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    event: '',
    tags: [] as string[],
    description: '',
    favorite: false
  })
  const [filter, setFilter] = useState({
    event: '',
    tag: '',
    favorite: false
  })
  const [newTag, setNewTag] = useState('')

  const eventOptions = [
    '일상', '산책', '놀이', '목욕', '미용', '병원', '여행', '생일', '기타'
  ]

  const commonTags = [
    '귀여움', '웃음', '잠', '먹기', '놀이', '산책', '목욕', '미용', '병원', '여행'
  ]

  useEffect(() => {
    const savedPhotos = localStorage.getItem('dogPhotos')
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('dogPhotos', JSON.stringify(photos))
    }
  }, [photos])

  const addPhoto = () => {
    if (!newPhoto.name || !newPhoto.date) return

    const photo: Photo = {
      id: Date.now().toString(),
      ...newPhoto
    }
    setPhotos([photo, ...photos])
    setNewPhoto({
      name: '',
      date: new Date().toISOString().split('T')[0],
      event: '',
      tags: [],
      description: '',
      favorite: false
    })
  }

  const toggleTag = (tag: string) => {
    setNewPhoto({
      ...newPhoto,
      tags: newPhoto.tags.includes(tag)
        ? newPhoto.tags.filter(t => t !== tag)
        : [...newPhoto.tags, tag]
    })
  }

  const addCustomTag = () => {
    if (newTag && !newPhoto.tags.includes(newTag)) {
      setNewPhoto({
        ...newPhoto,
        tags: [...newPhoto.tags, newTag]
      })
      setNewTag('')
    }
  }

  const toggleFavorite = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
    ))
  }

  const deletePhoto = (photoId: string) => {
    setPhotos(photos.filter(photo => photo.id !== photoId))
  }

  const filteredPhotos = photos.filter(photo => {
    if (filter.event && photo.event !== filter.event) return false
    if (filter.tag && !photo.tags.includes(filter.tag)) return false
    if (filter.favorite && !photo.favorite) return false
    return true
  })

  const favoritePhotos = photos.filter(photo => photo.favorite)
  const totalPhotos = photos.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <Camera className="w-10 h-10 text-purple-600 mr-3" />
            반려견 사진 정리 도구
          </h1>
          <p className="text-xl text-gray-600">반려견 사진을 날짜별, 이벤트별로 자동 분류합니다</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalPhotos}장</p>
            <p className="text-sm text-gray-600">총 사진</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{favoritePhotos.length}장</p>
            <p className="text-sm text-gray-600">즐겨찾기</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {new Set(photos.map(p => p.event)).size}개
            </p>
            <p className="text-sm text-gray-600">이벤트</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Tag className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {new Set(photos.flatMap(p => p.tags)).size}개
            </p>
            <p className="text-sm text-gray-600">태그</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">새 사진 추가</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사진 이름</label>
                  <input
                    type="text"
                    value={newPhoto.name}
                    onChange={(e) => setNewPhoto({...newPhoto, name: e.target.value})}
                    placeholder="예: 멍멍이 산책 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">촬영 날짜</label>
                    <input
                      type="date"
                      value={newPhoto.date}
                      onChange={(e) => setNewPhoto({...newPhoto, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이벤트</label>
                    <select
                      value={newPhoto.event}
                      onChange={(e) => setNewPhoto({...newPhoto, event: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">이벤트 선택</option>
                      {eventOptions.map((event) => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                            newPhoto.tags.includes(tag)
                              ? 'bg-blue-100 border-blue-400 text-blue-700'
                              : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="새 태그 추가"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                      />
                      <button
                        onClick={addCustomTag}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        추가
                      </button>
                    </div>
                    {newPhoto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newPhoto.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                            {tag}
                            <button
                              onClick={() => toggleTag(tag)}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <textarea
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({...newPhoto, description: e.target.value})}
                    rows={3}
                    placeholder="사진에 대한 설명이나 특별한 순간을 기록하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="favorite"
                    checked={newPhoto.favorite}
                    onChange={(e) => setNewPhoto({...newPhoto, favorite: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="favorite" className="text-sm text-gray-700">
                    즐겨찾기에 추가
                  </label>
                </div>
                <button
                  onClick={addPhoto}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  사진 추가
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">필터</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이벤트별</label>
                    <select
                      value={filter.event}
                      onChange={(e) => setFilter({...filter, event: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">전체</option>
                      {eventOptions.map((event) => (
                        <option key={event} value={event}>{event}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">태그별</label>
                    <select
                      value={filter.tag}
                      onChange={(e) => setFilter({...filter, tag: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">전체</option>
                      {Array.from(new Set(photos.flatMap(p => p.tags))).map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="favoriteFilter"
                    checked={filter.favorite}
                    onChange={(e) => setFilter({...filter, favorite: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="favoriteFilter" className="text-sm text-gray-700">
                    즐겨찾기만 보기
                  </label>
                </div>
                <button
                  onClick={() => setFilter({event: '', tag: '', favorite: false})}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">사진 목록</h2>
            {filteredPhotos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">등록된 사진이 없습니다</p>
            ) : (
              <div className="space-y-4">
                {filteredPhotos.map((photo) => (
                  <div key={photo.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{photo.name}</h3>
                        <p className="text-sm text-gray-600">{photo.date}</p>
                        {photo.event && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mt-1">
                            {photo.event}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleFavorite(photo.id)}
                          className={`p-2 rounded ${
                            photo.favorite 
                              ? 'text-red-600 bg-red-100' 
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {photo.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {photo.description && (
                      <p className="text-sm text-gray-600">{photo.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📸 사진 정리 팁</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 일관된 명명 규칙을 사용하세요 (예: 날짜_이벤트_순서)</li>
            <li>• 중요한 순간은 즐겨찾기에 추가하세요</li>
            <li>• 태그를 활용해 쉽게 검색할 수 있도록 하세요</li>
            <li>• 정기적으로 사진을 정리하고 백업하세요</li>
            <li>• 특별한 이벤트는 별도 폴더로 관리하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
