import { NextResponse } from "next/server";
import { syncViewCountsFromAnalytics } from "@/lib/posts";

export async function GET(request: Request) {
  // Vercel Cron Jobsからの呼び出しを検証
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncViewCountsFromAnalytics(true); // 強制更新
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Failed to sync view counts:", error);
    return NextResponse.json(
      { error: "Failed to sync view counts" },
      { status: 500 }
    );
  }
}
