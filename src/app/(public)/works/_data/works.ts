export interface Work {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	technologies: string[];
	url?: string;
	releaseDate: string;
	status: string;
	category: string;
	features: string[];
	challenges: string[];
	images?: string[];
}

export const works: Work[] = [
	{
		id: "lognote",
		title: "整えて、創る。 - ブログCMS",
		description:
			"Next.js 16とTypeScriptで構築した高機能なブログシステム。リッチエディタ、SEO対策、広告管理機能を実装。",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"Next.js 16",
			"TypeScript",
			"TipTap",
			"Supabase",
			"TailwindCSS",
			"shadcn/ui",
			"Framer Motion",
		],
		releaseDate: "2025年12月",
		status: "運用中・継続的アップデート",
		category: "Webアプリケーション",
		features: [
			"TipTapエディタによるリッチテキスト編集",
			"SEO最適化（構造化データ、OGP、サイトマップ）",
			"Google AdSense統合と広告管理",
			"Supabaseによる認証・データベース管理",
			"カテゴリー・タグ管理",
			"画像アップロード・ギャラリー機能",
			"レスポンシブデザイン対応",
			"ダークモード対応",
			"Claude Code（AI開発支援ツール）を活用した効率的な開発",
		],
		challenges: [
			"TipTapエディタのカスタマイズとNode Viewの実装",
			"ISR（Incremental Static Regeneration）による高速化とSEO対策の両立",
			"TypeScript型安全性を保ちながらの柔軟なコンテンツ管理",
			"Claude Codeを活用したコード生成とリファクタリングの効率化",
		],
		images: [
			"screenshot-1.jpg",
			"screenshot-2.jpg",
			"screenshot-3.jpg",
			"screenshot-4.jpg",
			"screenshot-5.jpg",
			"screenshot-6.jpg",
			"screenshot-7.jpg",
		],
	},
];

/**
 * 作品の画像パスを取得するヘルパー関数
 * Route Handlerを経由して_assets内の画像を配信
 */
export function getWorkImagePath(workId: string, filename: string): string {
	return `/works/images/${workId}/${filename}`;
}
