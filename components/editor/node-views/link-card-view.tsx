"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useEffect, useState } from "react";

interface PostData {
  title: string;
  description?: string;
}

export function LinkCardView({ node }: NodeViewProps) {
  const { href, title, description } = node.attrs;
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // スラッグから記事データを取得
    const fetchPostData = async () => {
      if (!href || !href.startsWith("/")) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/posts/by-slug?slug=${href.replace("/", "")}`);
        if (response.ok) {
          const data = await response.json();
          setPostData({
            title: data.title,
            description: data.description,
          });
        }
      } catch (error) {
        console.error("Failed to fetch post data:", error);
      } finally {
        setLoading(false);
      }
    };

    // 属性からデータが提供されていない場合のみフェッチ
    if (!title && !description) {
      fetchPostData();
    } else {
      setPostData({ title, description });
    }
  }, [href, title, description]);

  const displayData = postData || { title, description };

  if (loading) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="link-card animate-pulse" data-type="internal">
          <div className="space-y-2">
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <a href={href || "#"} className="link-card" data-type="internal">
        <div className="space-y-1">
          <div className="text-lg font-semibold line-clamp-2">
            {displayData.title || href}
          </div>
          {displayData.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {displayData.description}
            </p>
          )}
        </div>
      </a>
    </NodeViewWrapper>
  );
}
