import { GoogleTagManager } from '@next/third-parties/google'

export function GoogleAnalytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!gtmId) {
    return null
  }

  return <GoogleTagManager gtmId={gtmId} />
}

// DataLayerにイベントを送信
export const pushDataLayer = (eventData: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    ;(window as any).dataLayer.push(eventData)
  }
}

// コンセント管理（GDPR対応）
export const grantConsent = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('consent', 'update', {
      analytics_storage: 'granted',
    })
  }
}

export const denyConsent = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('consent', 'update', {
      analytics_storage: 'denied',
    })
  }
}
