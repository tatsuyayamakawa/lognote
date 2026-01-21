export interface Work {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	technologies: string[];
	url?: string;
	releaseDate: string;
	status: string;
	category: string[];
	features: string[];
	challenges: string[];
	images?: string[];
	fullPageScreenshot?: string;
	relatedPosts?: { title: string; url: string }[];
}

export const works: Work[] = [
	{
		id: "lognote",
		title: "整えて、創る。",
		description:
			"WordPressから移行し、Next.js App RouterとTypeScriptで構築した高機能なフルスタックなブログシステム。リッチエディタ、SEO対策、広告管理機能を実装。",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"Next.js",
			"TypeScript",
			"TipTap",
			"Supabase",
			"TailwindCSS",
			"shadcn/ui",
			"Framer Motion",
		],
    url: "https://lognote.biz/",
		releaseDate: "2025年11月23日",
		status: "運用中",
		category: ["Webアプリケーション","ブログCMS"],
		features: [
			"TipTapエディタによるリッチテキスト編集",
			"SEO最適化（構造化データ、OGP、サイトマップ）",
			"Google Cloudを活用したGoogle Analytics、Search Console、AdSense連携によるデータ表示",
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
			"screenshot-8.jpg",
		],
	},
	{
		id: "bodycare-yumin",
		title: "手もみ整体 癒眠",
		description:
			"山形県山形市の手もみ整体サロンのWebサイト。深層筋ほぐしと自律神経調整を専門とした施術内容をわかりやすく紹介。WordPressからの移行。",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"Next.js",
			"TypeScript",
			"TailwindCSS",
			"Vercel",
		],
		url: "https://bodycare-yumin.com/",
		releaseDate: "2025年4月20日",
		status: "運用中",
		category: ["Webサイト", "コーポレートサイト"],
		features: [
			"シンプルでわかりやすい料金表示",
			"施術内容の詳細な説明",
			"CSSによる簡易的なバブルアニメーション",
			"Intersection Observerを活用したセクション間の遷移アニメーション",
			"レスポンシブデザイン対応",
			"Next.js Image による画像最適化",
			"Google Maps Platform APIでカスタマイズされた地図表示",
		],
		challenges: [
			"専門的な施術内容を一般の方にもわかりやすく説明",
			"安心感を与える落ち着いたデザイン設計",
		],
		images: [],
		fullPageScreenshot: "fullpage.jpg"
	},
	{
		id: "y-shiminuki",
		title: "山川しみぬき店",
		description:
			"山形県山形市の老舗しみぬき専門店のWebサイト。70年の伝統を持つ職人技術をモダンなデザインで表現。",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"Next.js",
			"TypeScript",
			"TailwindCSS",
			"Vercel",
		],
		url: "https://y-shiminuki.com/",
		releaseDate: "2024年7月18日",
		status: "運用中",
		category: ["Webサイト", "コーポレートサイト"],
		features: [
			"和風デザインで伝統を表現",
			"料金表の明確な表示",
			"スマホ時、フッター固定の店舗情報表示でお問合せしやすいUI設計（タップで電話発信も可能）",
			"レスポンシブデザイン対応",
			"Next.js Image による画像最適化",
			"Google Maps Platform APIでカスタマイズされた地図表示",
		],
		challenges: [
			"伝統的なイメージとモダンなWebデザインの融合",
			"専門的なサービス内容のわかりやすい説明",
		],
		images: [],
    fullPageScreenshot: "fullpage.jpg"
	},
	{
		id: "twitch-hidden-carousel",
		title: "Twitch Hidden Carousel",
		description:
			"Twitchのカルーセルを非表示にするChrome拡張機能。軽量で効率的な動作を実現。",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"JavaScript",
			"Chrome Extension API",
			"Manifest V3",
		],
		url: "https://chromewebstore.google.com/detail/twitch-hidden-carousel/fjkloidbkbkoojfananpkkgoankilkko",
		releaseDate: "2022年3月17日",
		status: "公開中",
		category: ["ブラウザ拡張機能"],
		features: [
			"Twitchのカルーセルを自動的に非表示",
			"軽量で高速な動作",
			"ツールバーの拡張機能ボタンから表示切り替え操作が可能",
		],
		challenges: [
			"Manifest V3への対応",
			"Twitchの動的なDOM変更への対応",
		],
		images: [
			"screenshot-1.jpg",
			"screenshot-2.jpg",
		],
	},
	{
		id: "healer",
		title: "Healer",
		description:
			"整体院・サロン専用WordPressテーマ。レスポンシブデザインを標準搭載し、治療院サイトの構築を簡単に。初のアプリ開発・販売として、インフォトップでのアフィリエイト展開を実施。累計250件、440万円の売上を達成。2022年12月販売終了",
		thumbnail: "thumbnail.jpg",
		technologies: [
			"WordPress",
			"PHP",
			"JavaScript",
			"CSS",
			"MySQL",
		],
		releaseDate: "2016年6月14日",
		status: "販売終了",
		category: ["WordPressテーマ"],
		features: [
			"整体院・サロンに特化したデザイン",
			"施術メニュー・料金表管理",
			"スタッフ紹介ページ",
			"お客様の声機能",
			"レスポンシブデザイン対応",
			"SEO最適化",
			"カスタマイザーによる簡単なカスタマイズ",
		],
		challenges: [
			"WordPressテーマとしての汎用性と専門性のバランス",
			"直感的なテーマカスタマイザーの実装",
			"インフォトップへのアフィリエイト登録",
		],
		images: [],
		relatedPosts: [
			{
				title: "整骨院・整体院やカイロプラクティック、サロン向け専門 WordPressテーマ「Healer」 | ワドプラ",
				url: "https://wdplu.com/healer"
			}
		]
	},
];

/**
 * 作品の画像パスを取得するヘルパー関数
 * Route Handlerを経由して_assets内の画像を配信
 */
export function getWorkImagePath(workId: string, filename: string): string {
	return `/works/images/${workId}/${filename}`;
}
