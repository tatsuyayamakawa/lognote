import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '整えて、創る。'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          {/* メインタイトル */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#212529',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: '32px',
              letterSpacing: '0.05em',
            }}
          >
            整えて、創る。
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: 32,
              color: '#495057',
              textAlign: 'center',
              lineHeight: 1.5,
              marginBottom: '48px',
              fontWeight: 400,
            }}
          >
            身体を整え、思考を整え、コードを書く
          </div>

          {/* 装飾ライン */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '2px',
                backgroundColor: '#adb5bd',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                fontSize: 20,
                color: '#6c757d',
                fontWeight: 400,
                letterSpacing: '0.1em',
              }}
            >
              ネット集客に強い整体院サイトを制作
            </div>
            <div
              style={{
                width: '80px',
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
      ...size,
    }
  )
}
