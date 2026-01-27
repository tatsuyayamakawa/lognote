"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteImage(fileName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Storageから削除
    const { error: storageError } = await supabase.storage
      .from("blog-images")
      .remove([`content/${fileName}`]);

    if (storageError) {
      console.error("[Delete] Error deleting from storage:", storageError);
      return { success: false, error: "Failed to delete image from storage" };
    }

    // imagesテーブルから削除
    const { error: dbError } = await supabase
      .from("images")
      .delete()
      .eq("file_name", fileName);

    if (dbError) {
      console.error("[Delete] Error deleting from database:", dbError);
      // ストレージからは削除済みなので警告のみ
    }

    // 画像管理ページのキャッシュを再検証
    revalidatePath("/admin/media");

    return { success: true };
  } catch (error) {
    console.error("[Delete] Unexpected error:", error);
    return { success: false, error: "Internal server error" };
  }
}
