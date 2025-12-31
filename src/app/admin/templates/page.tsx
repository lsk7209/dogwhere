'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"
import {
  FileText,
  Code,
  Eye,
  Play,
  Save,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { TemplateRenderer, createRenderer } from '@/lib/templates/renderer'
import { templates, TemplateType } from '@/lib/templates/templates'
import { ContentLinter, createLinter } from '@/lib/templates/validators/linter'

interface TemplatePreview {
  mdx: string
  jsonld: object
  isValid: boolean
  score: number
  errors: string[]
  warnings: string[]
}

export default function TemplatesManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('place')
  const [templateContent, setTemplateContent] = useState('')
  const [templateType, setTemplateType] = useState<'mdx' | 'jsonld'>('mdx')
  const [preview, setPreview] = useState<TemplatePreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testVariables, setTestVariables] = useState({
    slug: 'cafe-paws-seoul',
    name: '카페 포우즈',
    sido_en: 'seoul',
    sig_en: 'mapo-gu',
    sido_ko: '서울',
    sig_ko: '마포구',
    category_en: 'dog-cafe',
    category_ko: '강아지 카페',
    address: '서울 마포구 어쩌구 123',
    lat: 37.551,
    lng: 126.913,
    phone: '02-1234-5678',
    rating: 4.6,
    review_count: 213,
    pet_policy_text: '실내 동반 가능, 목줄 필수, 대형견 허용',
    facility_ambience_text: '그늘 테라스, 좌석 간격 넓음, 포토존',
    access_tip: '홍대입구역 도보 5분, 주차 1시간 무료',
    best_time_tip: '주말 오전 10시 이전 추천',
    safety_badge: 'pm25',
    updated_at: '2025-10-28',
    source_label: 'data.go.kr:dataset_xxx',
    features_summary: '대형견 동반 가능한 아늑한 카페',
    faq_large_dog: '네, 대형견도 동반 가능합니다.',
    opening_hours_summary: '평일 10:00-20:00, 주말 09:00-21:00',
    has_parking: true,
    parking_text: '건물 지하 주차장 이용 가능',
    related_category1: 'dog-park',
    adjacent_sido_en: 'gyeonggi',
    adjacent_sig_en: 'gapyeong-gun',
    related_post_slug: 'seoul-dog-cafe-guide',
    canonical_url: 'https://eoseoogae.com/place/cafe-paws-seoul',
    origin: 'https://eoseoogae.com'
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadTemplate()
  }, [selectedTemplate, templateType])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/login')
      if (!response.ok) {
        router.push('/admin/login')
        return
      }
    } catch {
      router.push('/admin/login')
    }
  }

  const loadTemplate = () => {
    const template = templates[selectedTemplate]
    if (template) {
      setTemplateContent(templateType === 'mdx' ? template.mdx : template.jsonld)
    }
  }

  const handlePreview = async () => {
    setIsLoading(true)
    try {
      const renderer = createRenderer()
      const linter = createLinter()

      let renderedContent: string
      let jsonld: object = {}

      if (templateType === 'mdx') {
        renderedContent = renderer.renderMDX(templateContent, testVariables)
        jsonld = renderer.renderJSONLD(templates[selectedTemplate].jsonld, testVariables)
      } else {
        jsonld = renderer.renderJSONLD(templateContent, testVariables)
        renderedContent = JSON.stringify(jsonld, null, 2)
      }

      const lintResult = linter.lint(renderedContent, selectedTemplate, testVariables)

      setPreview({
        mdx: renderedContent,
        jsonld,
        isValid: lintResult.isValid,
        score: lintResult.score,
        errors: lintResult.errors,
        warnings: lintResult.warnings
      })
    } catch (error) {
      logger.error('Preview error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // 실제 운영에서는 템플릿을 서버에 저장
      logger.info('Saving template', { selectedTemplate, templateType, templateContent })
      alert('템플릿이 저장되었습니다.')
    } catch (error) {
      logger.error('Save error', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify({
      template: selectedTemplate,
      type: templateType,
      content: templateContent,
      variables: testVariables
    }, null, 2)

    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedTemplate}-${templateType}-template.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        setSelectedTemplate(data.template)
        setTemplateType(data.type)
        setTemplateContent(data.content)
        if (data.variables) {
          setTestVariables(data.variables)
        }
      } catch (error) {
        logger.error('Import error', error)
        alert('파일을 읽는 중 오류가 발생했습니다.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>대시보드</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">템플릿 관리</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                <span>내보내기</span>
              </button>
              <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>가져오기</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 템플릿 선택 및 편집 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">템플릿 편집</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value as TemplateType)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="place">장소 (Place)</option>
                      <option value="event">행사 (Event)</option>
                      <option value="areaHub">지역 허브 (Area Hub)</option>
                      <option value="areaCluster">지역 클러스터 (Area Cluster)</option>
                      <option value="blogTopN">블로그 TopN</option>
                    </select>
                    <select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value as 'mdx' | 'jsonld')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="mdx">MDX</option>
                      <option value="jsonld">JSON-LD</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                    <span>미리보기</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="템플릿 내용을 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 미리보기 및 검증 결과 */}
          <div className="space-y-6">
            {/* 검증 결과 */}
            {preview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">검증 결과</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {preview.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-medium ${preview.isValid ? 'text-green-700' : 'text-red-700'}`}>
                      {preview.isValid ? '유효함' : '오류 있음'}
                    </span>
                    <span className="text-sm text-gray-500">
                      (CQS: {(preview.score * 100).toFixed(1)}%)
                    </span>
                  </div>

                  {preview.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">오류:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {preview.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {preview.warnings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-yellow-700 mb-2">경고:</h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        {preview.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 테스트 변수 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">테스트 변수</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(testVariables).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="ml-2 text-gray-600">
                      {typeof value === 'string' ? `"${value}"` : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 미리보기 */}
            {preview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h3>
                <div className="max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {templateType === 'mdx' ? preview.mdx : JSON.stringify(preview.jsonld, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
