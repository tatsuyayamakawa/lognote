import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Rate limiting用のシンプルなインメモリキャッシュ
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetTime) {
    // 新しい制限期間を設定（1分間に5回まで）
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + 60 * 1000,
    });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { postId, sessionId } = await request.json();

    if (!postId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // IPアドレスの取得とハッシュ化
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";
    const ipHash = hashValue(ip);

    // User Agentの取得とハッシュ化
    const userAgent = request.headers.get("user-agent") || "unknown";
    const userAgentHash = hashValue(userAgent);

    // Rate limiting チェック（IPベース）
    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // ストアドプロシージャを呼び出してリアクションを追加
    const { data, error } = await supabase.rpc("increment_post_helpful", {
      p_post_id: postId,
      p_session_id: sessionId,
      p_ip_hash: ipHash,
      p_user_agent_hash: userAgentHash,
    });

    if (error) {
      console.error("Error incrementing reaction:", error);
      return NextResponse.json(
        { error: "Failed to add reaction" },
        { status: 500 }
      );
    }

    // ストアドプロシージャからの結果を返す
    if (!data.success) {
      return NextResponse.json(
        { error: data.error, message: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      count: data.count,
    });
  } catch (error) {
    console.error("Error in POST /api/reactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// カウント取得用のGETエンドポイント
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("posts")
      .select("helpful_count")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching reaction count:", error);
      return NextResponse.json(
        { error: "Failed to fetch reaction count" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: data?.helpful_count || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/reactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
