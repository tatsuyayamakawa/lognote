"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { ImagePreviewDialog } from "@/components/common/image-preview-dialog";
import { getWorkImagePath } from "../_data/works";

interface ScreenshotGalleryProps {
	workId: string;
	workTitle: string;
	images: string[];
}

export function ScreenshotGallery({ workId, workTitle, images }: ScreenshotGalleryProps) {
	const [showAll, setShowAll] = useState(false);
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewSrc, setPreviewSrc] = useState("");
	const hasMore = images.length > 4;

	const handleImageClick = (index: number) => {
		setSelectedImage(index);
		setPreviewSrc(getWorkImagePath(workId, images[index]));
		setPreviewOpen(true);
	};

	const handlePreviewClose = () => {
		setPreviewOpen(false);
		setSelectedImage(null);
	};

	return (
		<>
			<div className="mb-12">
				<h2 className="mb-4 text-2xl font-bold">スクリーンショット</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					{images.map((image, index) => {
						if (!showAll && index >= 4) return null;
						return (
							<button
								key={index}
								onClick={() => handleImageClick(index)}
								className="group relative overflow-hidden rounded-lg border bg-muted cursor-zoom-in transition-opacity hover:opacity-90"
								style={{ aspectRatio: "1912/922" }}
							>
								<Image
									src={getWorkImagePath(workId, image)}
									alt={`${workTitle} スクリーンショット ${index + 1}`}
									fill
									sizes="(max-width: 640px) 100vw, 50vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
									<div className="rounded-full bg-black/50 p-3">
										<ZoomIn className="h-8 w-8 text-white" />
									</div>
								</div>
							</button>
						);
					})}
				</div>
				{hasMore && !showAll && (
					<div className="mt-6 text-center">
						<button
							onClick={() => setShowAll(true)}
							className="inline-flex items-center rounded-lg border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							さらに見る ({images.length - 4}枚)
						</button>
					</div>
				)}
			</div>

			<ImagePreviewDialog
				open={previewOpen}
				onOpenChange={handlePreviewClose}
				src={previewSrc}
				alt={selectedImage !== null ? `${workTitle} スクリーンショット ${selectedImage + 1}` : ""}
			/>
		</>
	);
}
