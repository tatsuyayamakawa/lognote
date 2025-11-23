import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || '無題の記事'

    // タイトルを適切な長さに制限
    const truncatedTitle = title.length > 60 ? title.substring(0, 60) + '...' : title

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
            backgroundColor: '#18181b',
            backgroundImage: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
            position: 'relative',
          }}
        >
          {/* 装飾的な円 */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              left: '-150px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0) 70%)',
            }}
          />

          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              maxWidth: '1100px',
            }}
          >
            {/* タイトル */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.2,
                marginBottom: '40px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {truncatedTitle}
            </div>

            {/* サイト名 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '2px',
                }}
              />
              <div
                style={{
                  fontSize: 32,
                  color: '#d4d4d8',
                  fontWeight: 500,
                }}
              >
                整えて、創る。
              </div>
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: '#a855f7',
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG Image generation error:', e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
