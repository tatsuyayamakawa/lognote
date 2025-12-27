import { useState } from "react";

export interface ImageData {
  src: string;
  alt?: string;
  caption?: string;
}

export interface CtaButtonData {
  href: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  bgColor?: string;
  textColor?: string;
  animation?: "none" | "pulse" | "bounce" | "shine" | "glow";
}

export interface ProductLinkBoxData {
  productName?: string;
  productImage?: string;
  amazonUrl?: string;
  amazonPrice?: string;
  rakutenUrl?: string;
  rakutenPrice?: string;
  yahooUrl?: string;
  yahooPrice?: string;
}

export interface ImageGalleryData {
  images: { src: string; alt?: string; caption?: string }[];
  columns: number;
  gap: number;
}

export interface EmbedAdBoxData {
  embedCode?: string;
  pcEmbedCode?: string;
  mobileEmbedCode?: string;
}

export interface PointBoxData {
  type?: "point" | "warning" | "danger" | "success" | "info";
  title?: string;
  content?: string;
}

export interface LinkData {
  href: string;
  text?: string;
}

export function useEditorDialogs() {
  const [imageDialog, setImageDialog] = useState<{
    open: boolean;
    initialData?: ImageData;
  }>({ open: false });

  const [linkDialog, setLinkDialog] = useState<{
    open: boolean;
    initialData?: LinkData;
  }>({ open: false });

  const [speechBubbleDialogOpen, setSpeechBubbleDialogOpen] = useState(false);

  const [ctaButtonDialog, setCtaButtonDialog] = useState<{
    open: boolean;
    initialData?: CtaButtonData;
    isEditing: boolean;
  }>({ open: false, isEditing: false });

  const [productLinkBoxDialog, setProductLinkBoxDialog] = useState<{
    open: boolean;
    initialData?: ProductLinkBoxData;
    isEditing: boolean;
  }>({ open: false, isEditing: false });

  const [embedAdBoxDialog, setEmbedAdBoxDialog] = useState<{
    open: boolean;
    initialData?: EmbedAdBoxData;
    isEditing: boolean;
  }>({ open: false, isEditing: false });

  const [pointBoxDialog, setPointBoxDialog] = useState<{
    open: boolean;
    initialData?: PointBoxData;
    isEditing: boolean;
  }>({ open: false, isEditing: false });

  const [imageGalleryDialog, setImageGalleryDialog] = useState<{
    open: boolean;
    initialData?: ImageGalleryData;
    isEditing: boolean;
  }>({ open: false, isEditing: false });

  const [youtubePopoverOpen, setYoutubePopoverOpen] = useState(false);
  const [instagramPopoverOpen, setInstagramPopoverOpen] = useState(false);
  const [leftHeaderTableDialogOpen, setLeftHeaderTableDialogOpen] = useState(false);

  return {
    imageDialog,
    setImageDialog,
    linkDialog,
    setLinkDialog,
    speechBubbleDialogOpen,
    setSpeechBubbleDialogOpen,
    ctaButtonDialog,
    setCtaButtonDialog,
    productLinkBoxDialog,
    setProductLinkBoxDialog,
    embedAdBoxDialog,
    setEmbedAdBoxDialog,
    pointBoxDialog,
    setPointBoxDialog,
    imageGalleryDialog,
    setImageGalleryDialog,
    youtubePopoverOpen,
    setYoutubePopoverOpen,
    instagramPopoverOpen,
    setInstagramPopoverOpen,
    leftHeaderTableDialogOpen,
    setLeftHeaderTableDialogOpen,
  };
}
