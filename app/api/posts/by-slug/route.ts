import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 }
    );
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Return only the necessary fields for the link card
    return NextResponse.json({
      title: post.title,
      description: post.excerpt || post.meta_description,
      thumbnail_url: post.thumbnail_url,
      slug: post.slug,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
