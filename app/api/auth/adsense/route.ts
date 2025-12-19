import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/google-adsense/oauth";

/**
 * AdSense OAuth認証を開始
 * GET /api/auth/adsense
 */
export async function GET() {
  try {
    const authUrl = generateAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[AdSense Auth] Error generating auth URL:", error);
    return NextResponse.json(
      {
        error: "Failed to generate authentication URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
