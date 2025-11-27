"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";
import { getBaseURL } from "@/lib/utils";
import type { Category, Post } from "@/types";

interface PostFormProps {
  categories: Category[];
  post?: Post & { categories?: Category[] };
}

export function PostForm({ categories, post }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // カテゴリ作成ダイアログの状態
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6");
  const [availableCategories, setAvailableCategories] =
    useState<Category[]>(categories);

  // フォームの状態
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState<Record<string, unknown>>(
    (post?.content as Record<string, unknown>) || { type: "doc", content: [] }
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map((c) => c.id) || []
  );
  const [status, setStatus] = useState<"draft" | "published" | "private">(
    (post?.status as "draft" | "published" | "private") || "draft"
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url || "");
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(
    post?.published_at ? new Date(post.published_at) : undefined
  );
  const [isFeatured, setIsFeatured] = useState(post?.is_featured || false);

  // タイトルからスラッグを自動生成
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!post) {
      // 新規作成時のみ自動生成
      const autoSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim();
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("ログインしてください");
        return;
      }

      // 記事データ
      const postData = {
        title,
        slug,
        excerpt,
        content, // Tiptap JSON形式（既にオブジェクト）
        status,
        author_id: user.id,
        published_at: publishedAt ? publishedAt.toISOString() : null,
        thumbnail_url: thumbnailUrl || null,
        is_featured: isFeatured,
      };

      let postId: string;

      if (post) {
        // 更新
        const { error: updateError } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (updateError) throw updateError;
        postId = post.id;
      } else {
        // 新規作成
        const { data, error: insertError } = await supabase
          .from("posts")
          .insert([postData])
          .select()
          .single();

        if (insertError) throw insertError;
        postId = data.id;
      }

      // カテゴリの関連付けを更新
      // 既存の関連付けを削除
      await supabase.from("post_categories").delete().eq("post_id", postId);

      // 新しい関連付けを追加
      if (selectedCategories.length > 0) {
        const postCategories = selectedCategories.map((categoryId) => ({
          post_id: postId,
          category_id: categoryId,
        }));

        await supabase.from("post_categories").insert(postCategories);
      }

      // 成功したら記事一覧へリダイレクト（ローディングは継続）
      router.push("/admin/posts");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
      setLoading(false);
    }
  };

  const handleCategoryNameChange = (value: string) => {
    setNewCategoryName(value);
    // 名前が変更されたら自動的にスラッグも生成
    const autoSlug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
    setNewCategorySlug(autoSlug);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !newCategorySlug.trim()) return;

    setCreatingCategory(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: newCategoryName,
            slug: newCategorySlug,
            color: newCategoryColor,
            order: availableCategories.length,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // カテゴリリストに追加
      setAvailableCategories([...availableCategories, data]);
      // 作成したカテゴリを自動選択
      setSelectedCategories([...selectedCategories, data.id]);

      // ダイアログを閉じてフォームをリセット
      setCreateCategoryOpen(false);
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryColor("#3b82f6");
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "カテゴリの作成に失敗しました"
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("このカテゴリを削除しますか？")) return;

    try {
      const supabase = createClient();

      // 他の記事で使用されているかチェック
      const { count } = await supabase
        .from("post_categories")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryId);

      if (count && count > 0) {
        alert(
          `このカテゴリは${count}件の記事で使用されているため削除できません。`
        );
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      // カテゴリリストから削除
      setAvailableCategories(
        availableCategories.filter((c) => c.id !== categoryId)
      );
      // 選択からも削除
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "カテゴリの削除に失敗しました"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {post ? "記事編集" : "新規記事作成"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {post ? "記事を編集します" : "新しい記事を作成します"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={status === "draft" ? "default" : "outline"}
            onClick={() => setStatus("draft")}
            disabled={loading}
          >
            下書き
          </Button>
          <Button
            type="button"
            variant={status === "published" ? "default" : "outline"}
            onClick={() => setStatus("published")}
            disabled={loading}
          >
            公開
          </Button>
          <Button
            type="button"
            variant={status === "private" ? "default" : "outline"}
            onClick={() => setStatus("private")}
            disabled={loading}
          >
            非公開
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* 左カラム: メインコンテンツ (8カラム) */}
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
              <CardDescription>
                記事の基本情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">スラッグ *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-muted-foreground">
                  URL: {getBaseURL()}/{slug || "url-friendly-slug"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">抜粋</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  disabled={loading}
                  placeholder="記事の簡単な説明"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>本文</CardTitle>
              <CardDescription>
                リッチテキストエディタで記事を作成できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                content={content}
                onChange={setContent}
                disabled={loading}
              />
            </CardContent>
          </Card>
        </div>

        {/* 右カラム: サイドバー (4カラム) */}
        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>公開日時</CardTitle>
              <CardDescription>
                記事が公開される日時を設定します。未来の日時を設定すると予約投稿になります
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="datetime-local"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={publishedAt ? format(publishedAt, "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setPublishedAt(new Date(value));
                  } else {
                    setPublishedAt(undefined);
                  }
                }}
                disabled={loading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>サムネイル画像</CardTitle>
              <CardDescription>
                記事一覧やSNSシェア時に表示される画像です。推奨サイズ: 1200×630px
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                onRemove={() => setThumbnailUrl("")}
                disabled={loading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>特集記事</CardTitle>
              <CardDescription>
                トップページの特集セクションに表示する記事として設定します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is-featured" className="text-sm font-normal cursor-pointer">
                  この記事を特集記事として表示
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>カテゴリ</CardTitle>
                  <CardDescription>
                    記事を分類するカテゴリを選択します。複数選択可能です
                  </CardDescription>
                </div>
                <Dialog
                  open={createCategoryOpen}
                  onOpenChange={setCreateCategoryOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      新規作成
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>カテゴリを作成</DialogTitle>
                      <DialogDescription>
                        新しいカテゴリを作成します。作成後、自動的に選択されます。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-category-name">カテゴリ名 *</Label>
                        <Input
                          id="new-category-name"
                          value={newCategoryName}
                          onChange={(e) =>
                            handleCategoryNameChange(e.target.value)
                          }
                          placeholder="例: 技術ブログ"
                          disabled={creatingCategory}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-category-slug">スラッグ *</Label>
                        <Input
                          id="new-category-slug"
                          value={newCategorySlug}
                          onChange={(e) => setNewCategorySlug(e.target.value)}
                          placeholder="url-friendly-slug"
                          disabled={creatingCategory}
                        />
                        <p className="text-xs text-muted-foreground">
                          URL: /category/
                          {newCategorySlug || "url-friendly-slug"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-category-color">カラー</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="new-category-color"
                            type="color"
                            value={newCategoryColor}
                            onChange={(e) =>
                              setNewCategoryColor(e.target.value)
                            }
                            disabled={creatingCategory}
                            className="h-10 w-20"
                          />
                          <Input
                            type="text"
                            value={newCategoryColor}
                            onChange={(e) =>
                              setNewCategoryColor(e.target.value)
                            }
                            disabled={creatingCategory}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateCategoryOpen(false)}
                        disabled={creatingCategory}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategoryName.trim()}
                      >
                        {creatingCategory ? "作成中..." : "作成"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <div key={category.id} className="relative group">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCategories(
                              selectedCategories.filter(
                                (id) => id !== category.id
                              )
                            );
                          } else {
                            setSelectedCategories([
                              ...selectedCategories,
                              category.id,
                            ]);
                          }
                        }}
                        disabled={loading}
                        className={`rounded-full border px-4 py-2 pr-8 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-transparent text-white"
                            : "hover:bg-muted"
                        }`}
                        style={{
                          backgroundColor: isSelected
                            ? category.color || "#e5e7eb"
                            : "transparent",
                          borderColor: category.color || "#e5e7eb",
                          color: isSelected
                            ? "#ffffff"
                            : category.color || "#374151",
                        }}
                      >
                        {category.name}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        disabled={loading}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="削除"
                      >
                        <X
                          className="h-3 w-3"
                          style={{
                            color: isSelected
                              ? "#ffffff"
                              : category.color || "#374151",
                          }}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : post ? "更新" : "作成"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
