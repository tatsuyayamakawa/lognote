import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || '無題の記事'

    // タイトルを適切な長さに制限
    const truncatedTitle = title.length > 60 ? title.substring(0, 60) + '...' : title

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%)',
            position: 'relative',
          }}
        >
          {/* 幾何学模様の背景 */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              opacity: 0.08,
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 40px, #dee2e6 40px, #dee2e6 41px),
                repeating-linear-gradient(-45deg, transparent, transparent 40px, #dee2e6 40px, #dee2e6 41px)
              `,
            }}
          />
          {/* 装飾の円 */}
          <div
            style={{
              position: 'absolute',
              top: '-80px',
              right: '-80px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: '1px solid #dee2e6',
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              border: '1px solid #dee2e6',
              opacity: 0.3,
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
                color: '#212529',
                textAlign: 'center',
                lineHeight: 1.3,
                marginBottom: '48px',
                letterSpacing: '-0.02em',
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
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#adb5bd',
                  borderRadius: '1px',
                }}
              />
              <div
                style={{
                  fontSize: 28,
                  color: '#495057',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              >
                整えて、創る。
              </div>
              <div
                style={{
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#adb5bd',
                  borderRadius: '1px',
                }}
              />
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          // CDNとブラウザでの長期キャッシュ設定
          'Cache-Control': 'public, immutable, max-age=31536000, s-maxage=31536000',
          // Vercel Edge Networkでのキャッシュ（30日間）
          'CDN-Cache-Control': 'public, max-age=2592000',
        },
      }
    )

    return imageResponse
  } catch (e) {
    console.error('OG Image generation error:', e)
    return new Response(`Failed to generate image: ${e instanceof Error ? e.message : 'Unknown error'}`, {
      status: 500,
    })
  }
}
