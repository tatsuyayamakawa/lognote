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
    if (!editor || !showInArticleAd) return;

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length < 2) return;

    const adPositions = [1, 3];

    adPositions.forEach((position, adIndex) => {
      if (position >= h2Elements.length) return;

      const h2 = h2Elements[position];
      const existingAd = h2.previousElementSibling?.querySelector("[data-in-article-ad]");
      if (existingAd) return;

      const adContainer = document.createElement("div");
      adContainer.setAttribute("data-in-article-ad", "true");
      adContainer.setAttribute("data-ad-index", adIndex.toString());
      adContainer.className = "my-10 not-prose";

      h2.parentNode?.insertBefore(adContainer, h2);
    });
  }, [editor, showInArticleAd]);

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
            <>
              {pcSlot && (
                <div className="hidden md:block w-full" style={{ minWidth: "300px", maxWidth: "100%" }}>
                  <span className="text-xs text-muted-foreground block text-center mb-2">
                    スポンサーリンク
                  </span>
                  <AdSense
                    adSlot={pcSlot}
                    adFormat="fluid"
                    fullWidthResponsive={true}
                    layout="in-article"
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
                  <div className="flex justify-center">
                    <AdSense
                      adSlot={mobileSlot}
                      adFormat="rectangle"
                      width="300px"
                      height="250px"
                      fullWidthResponsive={false}
                      showSkeleton={true}
                      placeholderHeight="250px"
                    />
                  </div>
                </div>
              )}
            </>,
            container,
            `in-article-ad-${index}`
          );
        })}
      </>
    );
  };

  return { renderAds };
}
