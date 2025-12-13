import { getCategories } from "@/lib/posts"
import { PostForm } from "../post-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "記事作成",
}

export default async function NewPostPage() {
  const categories = await getCategories()

  return <PostForm categories={categories} />
}
