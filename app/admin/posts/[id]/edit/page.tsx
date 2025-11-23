import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/posts";
import { PostForm } from "../../post-form";
import type { Category } from "@/types";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPost(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories (
        category:categories (*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    categories:
      data.post_categories
        ?.map((pc: { category: Category | null }) => pc.category)
        .filter((cat: Category | null): cat is Category => Boolean(cat)) || [],
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPost(id), getCategories()]);

  if (!post) {
    notFound();
  }

  return <PostForm categories={categories} post={post} />;
}
