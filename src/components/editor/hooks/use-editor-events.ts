import { useEffect } from "react";
import type {
  ProductLinkBoxData,
  ImageGalleryData,
  ImageData,
  EmbedAdBoxData,
  PointBoxData,
  CtaButtonData,
} from "./use-editor-dialogs";

interface UseEditorEventsProps {
  onProductLinkBoxEdit: (data: ProductLinkBoxData) => void;
  onImageGalleryEdit: (data: ImageGalleryData) => void;
  onCustomImageEdit: (data: ImageData) => void;
  onEmbedAdBoxEdit: (data: EmbedAdBoxData) => void;
  onPointBoxEdit: (data: PointBoxData) => void;
  onCtaButtonEdit: (data: CtaButtonData) => void;
}

export function useEditorEvents({
  onProductLinkBoxEdit,
  onImageGalleryEdit,
  onCustomImageEdit,
  onEmbedAdBoxEdit,
  onPointBoxEdit,
  onCtaButtonEdit,
}: UseEditorEventsProps) {
  useEffect(() => {
    const handlers = {
      "edit-product-link-box": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onProductLinkBoxEdit(attrs);
      },
      "edit-image-gallery": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onImageGalleryEdit(attrs);
      },
      "edit-custom-image": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onCustomImageEdit(attrs);
      },
      "edit-embed-ad-box": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onEmbedAdBoxEdit(attrs);
      },
      "edit-point-box": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onPointBoxEdit(attrs);
      },
      "edit-cta-button": (e: Event) => {
        const { attrs } = (e as CustomEvent).detail;
        onCtaButtonEdit(attrs);
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      window.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [
    onProductLinkBoxEdit,
    onImageGalleryEdit,
    onCustomImageEdit,
    onEmbedAdBoxEdit,
    onPointBoxEdit,
    onCtaButtonEdit,
  ]);
}
