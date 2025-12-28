"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { FaXTwitter, FaFacebook, FaLine } from "react-icons/fa6";
import { SiHatenabookmark } from "react-icons/si";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://line.me/R/msg/text/?${encodedTitle}%20${encodedUrl}`,
    hatena: `https://b.hatena.ne.jp/add?mode=confirm&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">シェア:</span>

      {/* X (Twitter) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="gap-2"
      >
        <FaXTwitter className="h-4 w-4" />
        X
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        className="gap-2"
      >
        <FaFacebook className="h-4 w-4" />
        Facebook
      </Button>

      {/* LINE */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("line")}
        className="gap-2"
      >
        <FaLine className="h-4 w-4" />
        LINE
      </Button>

      {/* はてなブックマーク */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("hatena")}
        className="gap-2"
      >
        <SiHatenabookmark className="h-4 w-4" />
        はてブ
      </Button>

      {/* URLコピー */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        {copied ? "コピー済み" : "URLコピー"}
      </Button>
    </div>
  );
}
