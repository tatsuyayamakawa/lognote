import { useEffect, useState } from "react";
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
  const [adContainers, setAdContainers] = useState<Element[]>([]);

  // Create ad containers before h2 elements
  useEffect(() => {
    if (!editor || !showInArticleAd) return;

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length < 2) return;

    const maxAds = Math.min(h2Elements.length - 1, 5);

    for (let i = 1; i <= maxAds; i++) {
      const h2 = h2Elements[i];
      const existingAd = h2.previousElementSibling?.querySelector("[data-in-article-ad]");
      if (existingAd) continue;

      const adContainer = document.createElement("div");
      adContainer.setAttribute("data-in-article-ad", "true");
      adContainer.setAttribute("data-ad-index", i.toString());
      adContainer.className = "my-10 not-prose";

      h2.parentNode?.insertBefore(adContainer, h2);
    }
  }, [editor, showInArticleAd]);

  // Find ad containers for portal rendering
  useEffect(() => {
    const findContainers = () => {
      const found = Array.from(document.querySelectorAll(`[data-in-article-ad="true"]`));
      if (found.length > 0) {
        setAdContainers(found);
        return true;
      }
      return false;
    };

    if (findContainers()) return;

    const interval = setInterval(() => {
      if (findContainers()) clearInterval(interval);
    }, 100);

    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const renderAds = () => {
    if (!showInArticleAd || adContainers.length === 0) return null;

    return (
      <>
        {adContainers.map((container, index) => {
          const pcSlot = pcSlots[index];
          const mobileSlot = mobileSlots[index];

          if (!pcSlot && !mobileSlot) return null;

          return createPortal(
            <div
              style={{ pointerEvents: "auto", isolation: "isolate" }}
              data-ad-position={index}
            >
              {pcSlot && (
                <div className="hidden md:block w-full" style={{ minWidth: "300px", maxWidth: "100%" }}>
                  <span className="text-xs text-muted-foreground block text-center mb-2">
                    スポンサーリンク
                  </span>
                  <AdSense
                    key={`pc-${pcSlot}-${index}`}
                    adSlot={pcSlot}
                    adFormat="fluid"
                    layout="in-article"
                    fullWidthResponsive={true}
                    showSkeleton={false}
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
                    key={`mobile-${mobileSlot}-${index}`}
                    adSlot={mobileSlot}
                    adFormat="fluid"
                    layout="in-article"
                    fullWidthResponsive={true}
                    showSkeleton={false}
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
