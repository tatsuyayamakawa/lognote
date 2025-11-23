import { getCategories } from "@/lib/posts"
import { PostForm } from "../post-form"

export default async function NewPostPage() {
  const categories = await getCategories()

  return <PostForm categories={categories} />
}
