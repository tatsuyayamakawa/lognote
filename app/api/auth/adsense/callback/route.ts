import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client, saveTokens } from "@/lib/google-adsense/oauth";

/**
 * AdSense OAuth認証のコールバック
 * GET /api/auth/adsense/callback
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // エラーチェック
    if (error) {
      console.error("[AdSense Callback] OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/admin/ads/reports?adsense_error=${encodeURIComponent(error)}`,
          request.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(
          "/admin/ads/reports?adsense_error=missing_code",
          request.url
        )
      );
    }

    // 認証コードをトークンに交換
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      throw new Error("Failed to get access token");
    }

    // トークンを保存
    await saveTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });

    // AdSenseレポートページにリダイレクト
    return NextResponse.redirect(
      new URL("/admin/ads/reports?adsense_success=true", request.url)
    );
  } catch (error) {
    console.error("[AdSense Callback] Error processing callback:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/admin/ads/reports?adsense_error=${encodeURIComponent(errorMessage)}`,
        request.url
      )
    );
  }
}
