export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { logger } from '@/lib/logger'

// OG 이미지 생성 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || '어서오개'
    const region = searchParams.get('region') || 'kr'
    const badge = searchParams.get('badge') || 'default'
    const type = searchParams.get('type') || 'default' // default, top3, card

    if (type === 'top3') {
      return generateTop3Card(title, region, badge)
    }

    if (type === 'card') {
      return generateCardImage(title, region, badge)
    }

    // 기본 OG 이미지
    return generateDefaultOG(title, region, badge)

  } catch (error) {
    logger.error('OG image generation error', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 기본 OG 이미지 생성
function generateDefaultOG(title: string, region: string, badge: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f9ff',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            margin: '0 40px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              marginBottom: '20px',
            }}
          >
            🐕
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: '1.2',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            강아지 동반 장소 추천
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {badge === 'safe' && (
              <div
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                안전
              </div>
            )}
            {badge === 'new' && (
              <div
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                신규
              </div>
            )}
            {badge === 'top' && (
              <div
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                베스트
              </div>
            )}
            <div
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              어서오개
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

// Top3 카드 이미지 생성
function generateTop3Card(title: string, region: string, badge: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              marginBottom: '20px',
            }}
          >
            🏆
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            {title} TOP 3
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            {region === 'kr' ? '전국' : region} 강아지 동반 장소
          </div>
          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
            }}
          >
            {[1, 2, 3].map((rank) => (
              <div
                key={rank}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  padding: '20px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: rank === 1 ? '#f59e0b' : rank === 2 ? '#6b7280' : '#cd7f32',
                    marginBottom: '8px',
                  }}
                >
                  {rank}위
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#374151',
                    textAlign: 'center',
                  }}
                >
                  추천 장소 {rank}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#10b981',
                    fontWeight: 'bold',
                    marginTop: '4px',
                  }}
                >
                  O-Dog {95 - rank * 2}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: '#6366f1',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            어서오개에서 확인하기
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 600,
    }
  )
}

// 카드 이미지 생성 (9:16 비율)
function generateCardImage(title: string, region: string, badge: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f9ff',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '300px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              marginBottom: '20px',
            }}
          >
            🐕
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px',
              lineHeight: '1.2',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '20px',
            }}
          >
            강아지 동반 장소
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            {badge === 'safe' && (
              <div
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                안전
              </div>
            )}
            <div
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              어서오개
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 600,
    }
  )
}
