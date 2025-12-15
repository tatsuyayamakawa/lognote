"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PostData {
  title: string;
  description?: string;
  thumbnail?: string;
}

export function LinkCardView({ node }: NodeViewProps) {
  const { href, title, description, thumbnail } = node.attrs;
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // スラッグから記事データを取得
    const fetchPostData = async () => {
      if (!href || !href.startsWith("/")) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/posts/by-slug?slug=${href.replace("/", "")}`
        );
        if (response.ok) {
          const data = await response.json();
          setPostData({
            title: data.title,
            description: data.description,
            thumbnail: data.og_image_url || data.thumbnail_url,
          });
        }
      } catch (error) {
        console.error("Failed to fetch post data:", error);
      } finally {
        setLoading(false);
      }
    };

    // 属性からデータが提供されていない場合のみフェッチ
    if (!title && !description && !thumbnail) {
      fetchPostData();
    } else {
      setPostData({ title, description, thumbnail });
    }
  }, [href, title, description, thumbnail]);

  const displayData = postData || { title, description, thumbnail };

  if (loading) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="link-card animate-pulse" data-type="internal">
          <div className="link-card-thumbnail">
            <div className="h-full w-full bg-muted" />
          </div>
          <div className="link-card-content">
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <a href={href || "#"} className="link-card" data-type="internal">
        {displayData.thumbnail && (
          <div className="link-card-thumbnail">
            <Image
              src={displayData.thumbnail}
              alt={displayData.title || "Thumbnail"}
              fill
              className="object-cover my-0!"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="link-card-content">
          <div className="link-card-title">{displayData.title || href}</div>
          {displayData.description && (
            <p className="link-card-description">{displayData.description}</p>
          )}
        </div>
      </a>
    </NodeViewWrapper>
  );
}
