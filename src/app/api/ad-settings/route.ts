import { NextResponse } from 'next/server'
import { upsertAdSettings } from '@/lib/ad-settings'
import type { AdSettingsFormData } from '@/types/ad'

export async function POST(request: Request) {
  try {
    const data: AdSettingsFormData = await request.json()
    const result = await upsertAdSettings(data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in ad-settings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
