"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
    <div className="inline-flex items-center gap-1">
      <span className="text-sm text-muted-foreground">シェア：</span>

      {/* X (Twitter) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShare("twitter")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <FaXTwitter className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>X (Twitter)</TooltipContent>
      </Tooltip>

      {/* Facebook */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShare("facebook")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <FaFacebook className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Facebook</TooltipContent>
      </Tooltip>

      {/* LINE */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShare("line")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <FaLine className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>LINE</TooltipContent>
      </Tooltip>

      {/* はてなブックマーク */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShare("hatena")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <SiHatenabookmark className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>はてなブックマーク</TooltipContent>
      </Tooltip>

      {/* URLコピー */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {copied ? (
              <span className="text-xs">✓</span>
            ) : (
              <Share2 className="size-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "コピーしました" : "URLをコピー"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
