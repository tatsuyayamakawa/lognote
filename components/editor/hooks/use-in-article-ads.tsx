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

  useEffect(() => {
    if (!editor || !showInArticleAd) {
      setAdContainers([]);
      return;
    }

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length < 2) {
      setAdContainers([]);
      return;
    }

    const containers: Element[] = [];

    for (let i = 1; i < Math.min(h2Elements.length, 6); i++) {
      const h2 = h2Elements[i];
      const adIndex = i - 1; // Adjust index to start from 0 for slots array
      let adContainer = h2.parentNode?.querySelector(
        `[data-in-article-ad][data-ad-index="${adIndex}"]`
      ) as Element;

      if (!adContainer) {
        adContainer = document.createElement("div");
        adContainer.setAttribute("data-in-article-ad", "true");
        adContainer.setAttribute("data-ad-index", adIndex.toString());
        adContainer.className = "my-10 not-prose";
        adContainer.setAttribute("contenteditable", "false");
        adContainer.setAttribute("data-tiptap-ignore", "true");

        h2.parentNode?.insertBefore(adContainer, h2);
      }

      containers.push(adContainer);
    }

    setAdContainers(containers);
  }, [editor, showInArticleAd, pcSlots, mobileSlots]);

  const renderAds = () => {
    if (!showInArticleAd || adContainers.length === 0) return null;

    return (
      <>
        {adContainers.map((container, index) => {
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
