import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

interface RouteParams {
	params: Promise<{
		workId: string;
		filename: string;
	}>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { workId, filename } = await params;

		// 画像ファイルのパスを構築
		const filePath = path.join(
			process.cwd(),
			"src",
			"app",
			"(public)",
			"works",
			"_assets",
			workId,
			filename
		);

		// ファイルを読み込み
		const fileBuffer = await readFile(filePath);

		// ファイル拡張子からContent-Typeを判定
		const ext = path.extname(filename).toLowerCase();
		const contentTypeMap: Record<string, string> = {
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".webp": "image/webp",
			".svg": "image/svg+xml",
		};

		const contentType = contentTypeMap[ext] || "image/jpeg";

		return new NextResponse(fileBuffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Image load error:", error);
		return new NextResponse("Image not found", { status: 404 });
	}
}
