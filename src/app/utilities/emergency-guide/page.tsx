'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Phone, Heart, ChevronDown, ChevronUp } from 'lucide-react'

interface EmergencyGuide {
  situation: string
  symptoms: string[]
  immediateAction: string[]
  contact: string
  severity: 'high' | 'medium' | 'low'
}

const emergencyGuides: EmergencyGuide[] = [
  {
    situation: '쇼크/의식 불명',
    symptoms: ['의식 없음', '호흡 곤란', '맥박 약함', '차갑고 창백한 잇몸'],
    immediateAction: [
      '즉시 응급실로 이동',
      '호흡 확인, 필요시 인공호흡',
      '체온 유지',
      '움직이지 않도록 고정'
    ],
    contact: '24시 응급 동물병원',
    severity: 'high'
  },
  {
    situation: '심장마비/호흡 곤란',
    symptoms: ['호흡 곤란', '기침', '입술 청색', '무기력'],
    immediateAction: [
      '즉시 응급실로 이동',
      '호흡 통로 확보',
      '가슴 압박 (필요시)',
      '평평한 곳에 눕히기'
    ],
    contact: '24시 응급 동물병원',
    severity: 'high'
  },
  {
    situation: '중독',
    symptoms: ['구토', '설사', '경련', '무기력', '과다 침 흘림'],
    immediateAction: [
      '먹은 물질 확인 (병, 포장지)',
      '구강 내 이물 제거',
      '즉시 동물병원 연락',
      '자가 처치 금지 (물 부어주기 X, 토하게 하기 X)'
    ],
    contact: '동물병원 + 중독 상담센터',
    severity: 'high'
  },
  {
    situation: '열사병',
    symptoms: ['고온 노출', '과다 호흡', '체온 상승', '무기력', '구토'],
    immediateAction: [
      '그늘진 곳으로 이동',
      '체온 떨어뜨리기 (물, 선풍기)',
      '발가락 사이, 귀 쪽 냉각',
      '즉시 동물병원으로 이동'
    ],
    contact: '동물병원',
    severity: 'high'
  },
  {
    situation: '출혈',
    symptoms: ['과다 출혈', '상처', '피부 찢김'],
    immediateAction: [
      '깨끗한 천으로 직접 압박',
      '상처 부위를 높이 유지',
      '지혈 후 동물병원 방문',
      '상처 씻지 않기'
    ],
    contact: '동물병원',
    severity: 'medium'
  },
  {
    situation: '골절 의심',
    symptoms: ['다리를 절지 못함', '부종', '통증 표현', '이상한 자세'],
    immediateAction: [
      '움직이지 않도록 고정',
      '목 부목 적용 (목 부상 시)',
      '부드럽게 이동',
      '즉시 동물병원 방문'
    ],
    contact: '동물병원',
    severity: 'high'
  },
  {
    situation: '경련/발작',
    symptoms: ['의식 불명', '떨림', '경직', '침 흘림'],
    immediateAction: [
      '주변 위험 물체 제거',
      '움직이지 않도록 고정하되 강하게 누르지 않기',
      '입 안에 손 넣지 않기',
      '발작 후 동물병원 방문'
    ],
    contact: '동물병원',
    severity: 'high'
  },
  {
    situation: '질식',
    symptoms: ['호흡 곤란', '기침', '입술 청색', '불안한 행동'],
    immediateAction: [
      '입 안 확인 (이물 제거)',
      '뒷다리 들어 올려 기침 유도',
      '하임리히 법 시도 (소형견 주의)',
      '이물 제거 후 동물병원 방문'
    ],
    contact: '동물병원',
    severity: 'high'
  }
]

export default function EmergencyGuidePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [savedContacts, setSavedContacts] = useState({
    hospital: '',
    emergency: '',
    poison: ''
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '응급'
      case 'medium': return '중요'
      case 'low': return '주의'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link href="/utilities" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← 유틸리티 목록으로
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-10 h-10 text-red-600 mr-3" />
            응급처치 가이드
          </h1>
          <p className="text-xl text-gray-600">
            응급 상황별 즉시 대처 방법과 병원 연락처를 관리합니다
          </p>
        </div>

        {/* 응급 연락처 */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Phone className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">응급 연락처</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주치의 병원
              </label>
              <input
                type="text"
                value={savedContacts.hospital}
                onChange={(e) => setSavedContacts({ ...savedContacts, hospital: e.target.value })}
                placeholder="예: 02-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                24시 응급실
              </label>
              <input
                type="text"
                value={savedContacts.emergency}
                onChange={(e) => setSavedContacts({ ...savedContacts, emergency: e.target.value })}
                placeholder="예: 02-9876-5432"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                중독 상담센터
              </label>
              <input
                type="text"
                value={savedContacts.poison}
                onChange={(e) => setSavedContacts({ ...savedContacts, poison: e.target.value })}
                placeholder="예: 02-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* 응급 상황 가이드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">응급 상황별 대처법</h2>
          <div className="space-y-4">
            {emergencyGuides.map((guide, idx) => {
              const isExpanded = expandedId === `guide-${idx}`
              return (
                <div
                  key={idx}
                  className={`border-2 rounded-lg overflow-hidden ${
                    guide.severity === 'high' ? 'border-red-300' :
                    guide.severity === 'medium' ? 'border-yellow-300' :
                    'border-blue-300'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : `guide-${idx}`)}
                    className="w-full p-4 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-6 h-6 ${
                        guide.severity === 'high' ? 'text-red-600' :
                        guide.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <h3 className="text-xl font-bold text-gray-900">{guide.situation}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(guide.severity)}`}>
                        {getSeverityText(guide.severity)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-6 bg-gray-50 space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">증상</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {guide.symptoms.map((symptom, sIdx) => (
                            <li key={sIdx}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">즉시 조치사항</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                          {guide.immediateAction.map((action, aIdx) => (
                            <li key={aIdx}>{action}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex items-center space-x-2 text-red-600 font-medium">
                        <Phone className="w-5 h-5" />
                        <span>{guide.contact}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 응급 상황 대처 원칙</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• 가장 중요한 것은 침착함을 유지하는 것입니다</li>
            <li>• 응급 상황에서는 즉시 동물병원으로 가는 것이 가장 중요합니다</li>
            <li>• 자가 처치는 오히려 상황을 악화시킬 수 있습니다</li>
            <li>• 응급 연락처는 항상 손에 닿는 곳에 보관하세요</li>
            <li>• 응급실 주소와 경로를 미리 파악해 두세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

