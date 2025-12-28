import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Amazon PA-API 5.0の署名生成
function generateSignature(
  method: string,
  host: string,
  path: string,
  queryString: string,
  payload: string,
  accessKey: string,
  secretKey: string,
  region: string,
  service: string = 'ProductAdvertisingAPI'
) {
  const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const date = timestamp.slice(0, 8)

  // ステップ1: Canonical Request
  const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${timestamp}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`
  const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target'
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex')
  const canonicalRequest = `${method}\n${path}\n${queryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

  // ステップ2: String to Sign
  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${date}/${region}/${service}/aws4_request`
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${canonicalRequestHash}`

  // ステップ3: Signing Key
  const kDate = crypto.createHmac('sha256', `AWS4${secretKey}`).update(date).digest()
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()

  // ステップ4: Signature
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex')

  return {
    authorization: `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    timestamp,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const accessKey = process.env.AMAZON_ACCESS_KEY
    const secretKey = process.env.AMAZON_SECRET_KEY
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG
    const partnerTag = process.env.AMAZON_PARTNER_TAG
    const region = process.env.AMAZON_REGION || 'us-west-2'
    const host = process.env.AMAZON_HOST || 'webservices.amazon.co.jp'

    if (!accessKey || !secretKey || !associateTag) {
      return NextResponse.json({ error: 'Amazon API credentials not configured' }, { status: 500 })
    }

    // リクエストペイロード
    const payload = JSON.stringify({
      Keywords: keyword,
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'Offers.Listings.Price',
      ],
      PartnerTag: partnerTag || associateTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.co.jp',
      ItemCount: 10,
    })

    const method = 'POST'
    const path = '/paapi5/searchitems'
    const queryString = ''

    const { authorization, timestamp } = generateSignature(
      method,
      host,
      path,
      queryString,
      payload,
      accessKey,
      secretKey,
      region
    )

    // Amazon PA-APIへのリクエスト
    const response = await fetch(`https://${host}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Encoding': 'amz-1.0',
        'X-Amz-Date': timestamp,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        Authorization: authorization,
        Host: host,
      },
      body: payload,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Amazon API Error:', errorText)
      return NextResponse.json({ error: 'Amazon API request failed', details: errorText }, { status: response.status })
    }

    const data = await response.json()

    // レスポンスを整形
    const results = data.SearchResult?.Items?.map((item: any) => ({
      productName: item.ItemInfo?.Title?.DisplayValue || 'Unknown',
      productImage: item.Images?.Primary?.Large?.URL || '',
      url: item.DetailPageURL || '',
      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount?.replace(/[^0-9]/g, '') || '0',
    })) || []

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Amazon search error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
