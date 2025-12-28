import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const postId = formData.get("postId") as string | null;
    const overwriteFileName = formData.get("overwriteFileName") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ファイルサイズチェック (10MB制限)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // ファイルタイプチェック
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
        },
        { status: 400 }
      );
    }

    // ファイル名を決定（上書きモードまたは新規作成）
    let fileName: string;
    if (overwriteFileName) {
      // 上書きモード: 既存のファイル名を使用
      fileName = overwriteFileName;
    } else {
      // 新規作成: タイムスタンプ + ランダム文字列
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop();
      fileName = `${timestamp}-${randomString}.${extension}`;
    }

    // カスタムメタデータを準備
    const metadata: Record<string, string> = {};
    if (postId) {
      metadata.postId = postId;
    }

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(`content/${fileName}`, file, {
        cacheControl: "3600",
        upsert: !!overwriteFileName, // 上書きモードの場合はupsert
        contentType: file.type,
        metadata,
      });

    if (error) {
      console.error("[Upload] Error uploading to storage:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("[Upload] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
