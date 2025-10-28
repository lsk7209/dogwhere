'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout'
import { MessageSquare, MapPin, Star, Upload, Send } from 'lucide-react'

export default function ReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    placeName: '',
    address: '',
    category: '',
    description: '',
    rating: 0,
    images: null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 실제 운영에서는 API로 데이터 전송
    alert('제보해주셔서 감사합니다! 검토 후 반영하겠습니다.')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              제보하기 📝
            </h1>
            <p className="text-xl text-gray-600">
              강아지 동반 가능한 새로운 장소를 발견하셨나요? 제보해주세요!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 제보 양식 */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">장소 정보 제보</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이름 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      장소명 *
                    </label>
                    <input
                      type="text"
                      name="placeName"
                      value={formData.placeName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소 *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">카테고리를 선택해주세요</option>
                      <option value="dog-cafe">강아지 카페</option>
                      <option value="dog-park">강아지 공원</option>
                      <option value="dog-hotel">강아지 호텔</option>
                      <option value="restaurant">강아지 식당</option>
                      <option value="pension">펜션</option>
                      <option value="glamping">글램핑</option>
                      <option value="other">기타</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세 설명 *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="장소에 대한 상세한 설명을 작성해주세요..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      강아지 친화도 평가
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`w-8 h-8 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사진 업로드
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">사진을 드래그하거나 클릭하여 업로드하세요</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>제보하기</span>
                  </button>
                </form>
              </div>

              {/* 제보 가이드 */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    제보 가이드
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• 정확한 주소와 연락처를 확인해주세요</li>
                    <li>• 강아지 동반 가능 여부를 사전에 확인해주세요</li>
                    <li>• 실제 방문 경험을 바탕으로 작성해주세요</li>
                    <li>• 사진은 최대 5장까지 업로드 가능합니다</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">
                    제보 혜택
                  </h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li>• 제보 포인트 적립</li>
                    <li>• 우선 추천 리스트 등록</li>
                    <li>• 특별 할인 혜택 제공</li>
                    <li>• 커뮤니티 인증 배지</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                    주의사항
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• 허위 정보 제보 시 제재를 받을 수 있습니다</li>
                    <li>• 개인정보는 안전하게 보호됩니다</li>
                    <li>• 제보 내용은 검토 후 반영됩니다</li>
                    <li>• 문의사항은 고객센터로 연락해주세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
