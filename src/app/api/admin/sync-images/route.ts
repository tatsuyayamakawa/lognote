import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Storageから全ての画像を取得
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from("blog-images")
      .list("content", {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (storageError) {
      console.error("[Sync] Error listing storage files:", storageError);
      return NextResponse.json(
        { error: "Failed to list storage files" },
        { status: 500 }
      );
    }

    if (!storageFiles || storageFiles.length === 0) {
      return NextResponse.json({
        message: "No images found in storage",
        synced: 0,
        skipped: 0,
      });
    }

    // 既存のimagesテーブルのレコードを取得
    const { data: existingImages, error: dbError } = await supabase
      .from("images")
      .select("file_name");

    if (dbError) {
      console.error("[Sync] Error fetching existing images:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch existing images" },
        { status: 500 }
      );
    }

    const existingFileNames = new Set(
      existingImages?.map((img) => img.file_name) || []
    );

    // 新しい画像のみを挿入
    const newImages = storageFiles.filter(
      (file) => !existingFileNames.has(file.name)
    );

    if (newImages.length === 0) {
      return NextResponse.json({
        message: "All images are already synced",
        synced: 0,
        skipped: storageFiles.length,
      });
    }

    // 挿入するレコードを準備
    const records = newImages.map((file) => {
      const storagePath = `content/${file.name}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(storagePath);

      return {
        file_name: file.name,
        storage_path: storagePath,
        url: publicUrl,
        size: (file.metadata?.size as number) || 0,
        mimetype: (file.metadata?.mimetype as string) || null,
        post_id: null,
        created_at: file.created_at,
        updated_at: file.updated_at || file.created_at,
      };
    });

    // バッチで挿入
    const { error: insertError } = await supabase.from("images").insert(records);

    if (insertError) {
      console.error("[Sync] Error inserting images:", insertError);
      return NextResponse.json(
        { error: "Failed to insert images" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Images synced successfully",
      synced: newImages.length,
      skipped: storageFiles.length - newImages.length,
    });
  } catch (error) {
    console.error("[Sync] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
