import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const applicationId = process.env.RAKUTEN_APPLICATION_ID
    const affiliateId = process.env.RAKUTEN_AFFILIATE_ID

    if (!applicationId) {
      return NextResponse.json({ error: 'Rakuten API credentials not configured' }, { status: 500 })
    }

    // 楽天商品検索API v2
    const rakutenApiUrl = new URL('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706')
    rakutenApiUrl.searchParams.set('applicationId', applicationId)
    rakutenApiUrl.searchParams.set('keyword', keyword)
    rakutenApiUrl.searchParams.set('hits', '10')
    rakutenApiUrl.searchParams.set('imageFlag', '1')

    if (affiliateId) {
      rakutenApiUrl.searchParams.set('affiliateId', affiliateId)
    }

    const response = await fetch(rakutenApiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Rakuten API Error:', errorText)
      return NextResponse.json({ error: 'Rakuten API request failed', details: errorText }, { status: response.status })
    }

    const data = await response.json()

    // レスポンスを整形
    const results = data.Items?.map((item: any) => ({
      productName: item.Item?.itemName || 'Unknown',
      productImage: item.Item?.mediumImageUrls?.[0]?.imageUrl || '',
      url: item.Item?.affiliateUrl || item.Item?.itemUrl || '',
      price: item.Item?.itemPrice?.toString() || '0',
    })) || []

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Rakuten search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
