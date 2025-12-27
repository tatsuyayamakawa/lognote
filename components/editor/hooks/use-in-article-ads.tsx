import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Editor } from "@tiptap/react";
import { AdSense } from "@/components/ads/adsense";

interface UseInArticleAdsProps {
  editor: Editor | null;
  showInArticleAd: boolean;
  pcSlots: (string | undefined)[];
  mobileSlots: (string | undefined)[];
}

export function useInArticleAds({
  editor,
  showInArticleAd,
  pcSlots,
  mobileSlots,
}: UseInArticleAdsProps) {
  useEffect(() => {
    if (!editor || !showInArticleAd) return;

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length < 2) return;

    for (let i = 1; i < Math.min(h2Elements.length, 6); i++) {
      const h2 = h2Elements[i];
      const existingAd = h2.parentNode?.querySelector(
        `[data-in-article-ad][data-ad-index="${i}"]`
      );
      if (existingAd) continue;

      const adContainer = document.createElement("div");
      adContainer.setAttribute("data-in-article-ad", "true");
      adContainer.setAttribute("data-ad-index", i.toString());
      adContainer.className = "my-10 not-prose";
      adContainer.setAttribute("contenteditable", "false");
      adContainer.setAttribute("data-tiptap-ignore", "true");

      h2.parentNode?.insertBefore(adContainer, h2);
    }
  }, [editor, showInArticleAd, pcSlots.length, mobileSlots.length]);

  const renderAds = () => {
    if (!showInArticleAd || typeof document === "undefined") return null;

    const adContainers = document.querySelectorAll("[data-in-article-ad]");

    return (
      <>
        {Array.from(adContainers).map((container, index) => {
          const pcSlot = pcSlots[index];
          const mobileSlot = mobileSlots[index];

          if (!pcSlot && !mobileSlot) return null;

          return createPortal(
            <div style={{ pointerEvents: "auto", isolation: "isolate" }}>
              {pcSlot && (
                <div className="hidden md:block w-full" style={{ minWidth: "300px", maxWidth: "100%" }}>
                  <span className="text-xs text-muted-foreground block text-center mb-2">
                    スポンサーリンク
                  </span>
                  <AdSense
                    adSlot={pcSlot}
                    adFormat="fluid"
                    layout="in-article"
                    fullWidthResponsive={true}
                    showSkeleton={true}
                    placeholderHeight="300px"
                  />
                </div>
              )}
              {mobileSlot && (
                <div className="block md:hidden">
                  <span className="text-xs text-muted-foreground block text-center mb-2">
                    スポンサーリンク
                  </span>
                  <AdSense
                    adSlot={mobileSlot}
                    adFormat="fluid"
                    layout="in-article"
                    fullWidthResponsive={true}
                    showSkeleton={true}
                    placeholderHeight="300px"
                  />
                </div>
              )}
            </div>,
            container,
            `in-article-ad-${index}`
          );
        })}
      </>
    );
  };

  return { renderAds };
}
