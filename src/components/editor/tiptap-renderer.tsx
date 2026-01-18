"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Code } from "@tiptap/extension-code";
import { CustomYoutube } from "./extensions/custom-youtube";
import { Instagram } from "./extensions/instagram";
import { CustomImage } from "./extensions/custom-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Heading from "@tiptap/extension-heading";
import { SpeechBubble } from "./extensions/speech-bubble";
import { LinkCard } from "./extensions/link-card";
import { CtaButton } from "./extensions/cta-button";
import { ProductLinkBox } from "./extensions/product-link-box";
import { EmbedAdBox } from "./extensions/embed-ad-box";
import { PointBox } from "./extensions/point-box";
import { ImageGallery } from "./extensions/image-gallery";
import { AffiliateBox } from "./extensions/affiliate-box";
import { LeftHeaderTable } from "./extensions/left-header-table";
import { InlineTableOfContents } from "../post/inline-table-of-contents";
import { useInArticleAds } from "./hooks/use-in-article-ads";
import { CustomCodeBlock } from "./extensions/custom-code-block";

class HeadingNumbering {
	private counters: number[] = [0, 0, 0, 0];

	generateId(level: number): string {
		const index = level - 2;
		if (index < 0 || index >= this.counters.length) {
			return `heading-${level}`;
		}

		this.counters[index]++;
		for (let i = index + 1; i < this.counters.length; i++) {
			this.counters[i] = 0;
		}

		// 番号を生成（例: 1-2-3）
		const numbers = this.counters.slice(0, index + 1).filter(n => n > 0);
		return `heading-${numbers.join('-')}`;
	}

	reset() {
		this.counters = [0, 0, 0, 0];
	}
}

interface TiptapRendererProps {
	content: string | JSONContent;
	inArticlePcSlots?: (string | undefined)[];  // 最大5つの広告スロット
	inArticleMobileSlots?: (string | undefined)[];  // 最大5つの広告スロット
	className?: string;
}

export function TiptapRenderer({
	content,
	inArticlePcSlots = [],
	inArticleMobileSlots = [],
	className,
}: TiptapRendererProps) {
	// contentをメモ化してパース（文字列の場合のみパースし、再計算を防ぐ）
	const parsedContent = useMemo(() => {
		return typeof content === "string" ? JSON.parse(content) : content;
	}, [content]);

	// 最後のノードが空の段落の場合は削除（メモ化して不要な再計算を防ぐ）
	const cleanedContent = useMemo(() => {
		const cleanContent = (data: JSONContent): JSONContent => {
			if (!data.content || data.content.length === 0) {
				return data;
			}

			const lastNode = data.content[data.content.length - 1];

			// 最後のノードが段落で、内容が空またはテキストノードのみで空の場合
			if (lastNode.type === 'paragraph') {
				const hasContent = lastNode.content &&
					lastNode.content.some((node) => {
						if (!node.type) return false;
						if (node.type === 'text' && node.text && node.text.trim()) {
							return true;
						}
						return node.type !== 'text';
					});

				// 最後の段落が空で、かつドキュメントに他のコンテンツがある場合は削除
				if (!hasContent && data.content.length > 1) {
					return {
						...data,
						content: data.content.slice(0, -1)
					};
				}
			}

			return data;
		};

		return cleanContent(parsedContent);
	}, [parsedContent]);

	const [showInArticleAd, setShowInArticleAd] = useState(false);

	// 見出し番号管理インスタンス
	const headingNumbering = new HeadingNumbering();

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				link: false,
				heading: false,
				codeBlock: false,
				code: false,
			}),
			Code.configure({
				HTMLAttributes: {
					class: 'inline-code',
				},
			}),
			CustomCodeBlock.configure({
				enableNodeView: false,
			}),
			Heading.configure({
				levels: [1, 2, 3, 4, 5, 6],
			}).extend({
				renderHTML({ node, HTMLAttributes }) {
					const level = this.options.levels.includes(node.attrs.level)
						? node.attrs.level
						: this.options.levels[0];
					const id = headingNumbering.generateId(level);

					return [`h${level}`, { ...HTMLAttributes, id }, 0];
				},
			}),
			Link.extend({
				addAttributes() {
					return {
						...this.parent?.(),
						class: {
							default: null,
							renderHTML: (attributes) => {
								const href = attributes.href || "";
								const isExternal =
									href.startsWith("http://") || href.startsWith("https://");
								const isInternalDomain = href.includes("lognote.biz");

								if (isExternal && !isInternalDomain) {
									return {
										class:
											"text-primary underline hover:opacity-80 external-link",
									};
								}

								return {
									class: "text-primary underline hover:opacity-80",
								};
							},
						},
					};
				},
			}).configure({
				openOnClick: false,
			}),
			CustomImage.configure({
				inline: false,
				allowBase64: false,
				enableNodeView: false,
				HTMLAttributes: {
					class: "rounded-lg max-w-full h-auto my-4",
				},
			}),
			TextStyle,
			Color,
			Highlight.configure({
				multicolor: true,
			}),
			SpeechBubble.configure({
				HTMLAttributes: {
					class: "speech-bubble",
				},
				enableNodeView: false,
			}),
			LinkCard.configure({
				HTMLAttributes: {
					class: "link-card",
				},
				enableNodeView: false,
			}),
			CtaButton.configure({
				HTMLAttributes: {
					class: "cta-button",
				},
				enableNodeView: false,
			}),
			ProductLinkBox.configure({
				HTMLAttributes: {
					class: "product-link-box",
				},
				enableNodeView: false,
			}),
			EmbedAdBox.configure({
				HTMLAttributes: {
					class: "embed-ad-box",
				},
				enableNodeView: false,
			}),
			PointBox.configure({
				HTMLAttributes: {
					class: "point-box",
				},
				enableNodeView: false,
			}),
			ImageGallery.configure({
				HTMLAttributes: {
					class: "image-gallery",
				},
				enableNodeView: false,
			}),
			LeftHeaderTable.configure({
				HTMLAttributes: {
					class: "left-header-table-wrapper",
				},
				enableNodeView: false,
			}),
			AffiliateBox.configure({
				enableNodeView: false,
			}),
			CustomYoutube.configure({
				width: 640,
				height: 360,
				HTMLAttributes: {
					class: "rounded-lg my-4",
				},
			}),
			Instagram.configure({
				HTMLAttributes: {
					class: "my-4",
				},
			}),
			Table.extend({
				addNodeView() {
					return () => {
						// 外側のコンテナ
						const container = document.createElement('div');
						container.className = 'table-container';

						// スクロールラッパー
						const wrapper = document.createElement('div');
						wrapper.className = 'table-scroll-wrapper';

						const table = document.createElement('table');
						table.className = 'border-collapse table-auto w-full my-4';

						wrapper.appendChild(table);
						container.appendChild(wrapper);

						// スクロールヒント（モバイルのみ表示）
						const hint = document.createElement('div');
						hint.className = 'table-scroll-hint';
						hint.textContent = '←→ スクロール可能';
						container.appendChild(hint);

						return {
							dom: container,
							contentDOM: table,
						};
					};
				},
			}).configure({
				resizable: true,
			}),
			TableRow.configure({
				HTMLAttributes: {
					class: "border-b",
				},
			}),
			TableHeader.extend({
				content: 'inline*',
			}).configure({
				HTMLAttributes: {
					class: "border border-border bg-muted p-2 text-left font-bold",
				},
			}),
			TableCell.extend({
				content: 'inline*',
			}).configure({
				HTMLAttributes: {
					class: "border border-border p-2",
				},
			}),
		],
		content: cleanedContent,
		editable: false,
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-lg dark:prose-invert mx-auto",
					"prose-headings:font-bold prose-headings:tracking-tight",
					"prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
					"prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3",
					"prose-p:leading-relaxed prose-p:mb-4",
					"prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
					"prose-strong:font-bold prose-strong:text-foreground",
					"prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
					"prose-pre:bg-muted prose-pre:border prose-pre:text-foreground dark:prose-pre:text-white",
					"prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
					"prose-ul:list-disc prose-ul:pl-6",
					"prose-ol:list-decimal prose-ol:pl-6",
					"prose-li:mb-2",
					"prose-img:rounded-lg prose-img:shadow-md",
					className
				),
			},
			handleClick: () => true,
			handleDOMEvents: {
				mousedown: () => true,
				mouseup: () => true,
				click: () => true,
				dblclick: () => true,
				focus: () => true,
				blur: () => true,
			},
		},
		onTransaction: () => { },
	});

	useEffect(() => {
		if (!editor) return;

		const loadInstagramScript = () => {
			if (typeof window === "undefined") return;

			const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
			if (!existingScript) {
				const script = document.createElement("script");
				script.src = "https://www.instagram.com/embed.js";
				script.async = true;
				script.onload = () => window.instgrm?.Embeds.process();
				document.body.appendChild(script);
			} else {
				window.instgrm?.Embeds.process();
			}
		};

		const timer = setTimeout(loadInstagramScript, 100);
		return () => clearTimeout(timer);
	}, [editor]);

	useEffect(() => {
		if (!editor) return;

		const content = editor.getJSON();
		let count = 0;

		const countH2 = (node: JSONContent) => {
			if (node.type === "heading" && node.attrs?.level === 2) count++;
			node.content?.forEach(countH2);
		};

		countH2(content);
		const hasAdSlots = inArticlePcSlots.some(slot => slot) || inArticleMobileSlots.some(slot => slot);
		setShowInArticleAd(count >= 2 && hasAdSlots);
	}, [editor, inArticlePcSlots, inArticleMobileSlots]);

	useEffect(() => {
		if (!editor) return;

		const insertToc = () => {
			const h2Elements = editor.view.dom.querySelectorAll("h2");
			if (h2Elements.length > 0 && !document.getElementById("inline-toc-container")) {
				const tocContainer = document.createElement("div");
				tocContainer.setAttribute("data-inline-toc", "true");
				tocContainer.className = "not-prose";
				tocContainer.id = "inline-toc-container";
				h2Elements[0].parentNode?.insertBefore(tocContainer, h2Elements[0]);
			}
		};

		insertToc();
		const timer = setTimeout(insertToc, 100);
		const timer2 = setTimeout(insertToc, 500);

		return () => {
			clearTimeout(timer);
			clearTimeout(timer2);
		};
	}, [editor]);

	// コードブロックのスクロールヒント表示判定
	useEffect(() => {
		if (!editor) return;

		const checkScrollableCodeBlocks = () => {
			const codeBlocks = editor.view.dom.querySelectorAll('.code-block-wrapper');
			codeBlocks.forEach((wrapper) => {
				const pre = wrapper.querySelector('pre');
				const hint = wrapper.querySelector('.code-block-scroll-hint');
				if (pre && hint) {
					// スクロール可能かチェック
					if (pre.scrollWidth > pre.clientWidth) {
						hint.classList.add('show-scroll-hint');
					} else {
						hint.classList.remove('show-scroll-hint');
					}
				}
			});
		};

		checkScrollableCodeBlocks();
		const timer = setTimeout(checkScrollableCodeBlocks, 100);
		const timer2 = setTimeout(checkScrollableCodeBlocks, 500);

		// ウィンドウリサイズ時にも再チェック
		window.addEventListener('resize', checkScrollableCodeBlocks);

		return () => {
			clearTimeout(timer);
			clearTimeout(timer2);
			window.removeEventListener('resize', checkScrollableCodeBlocks);
		};
	}, [editor]);

	const { renderAds } = useInArticleAds({
		editor,
		showInArticleAd,
		pcSlots: inArticlePcSlots,
		mobileSlots: inArticleMobileSlots,
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="relative">
			<EditorContent editor={editor} />
			<InlineTocPortal />
			{renderAds()}
		</div>
	);
}

function InlineTocPortal() {
	const [container, setContainer] = useState<Element | null>(null);

	useEffect(() => {
		const findContainer = () => {
			const found = document.getElementById("inline-toc-container");
			if (found) {
				setContainer(found);
				return true;
			}
			return false;
		};

		if (findContainer()) return;

		const interval = setInterval(() => {
			if (findContainer()) clearInterval(interval);
		}, 100);

		const timeout = setTimeout(() => clearInterval(interval), 5000);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, []);

	if (!container) return null;

	return createPortal(<InlineTableOfContents />, container);
}

declare global {
	interface Window {
		instgrm?: {
			Embeds: {
				process: () => void;
			};
		};
	}
}
