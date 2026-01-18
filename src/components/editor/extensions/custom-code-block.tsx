import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import { common, createLowlight } from 'lowlight';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/core';

const lowlight = createLowlight(common);

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		customCodeBlock: {
			setCodeBlock: (attributes?: { language?: string; filename?: string }) => ReturnType;
			toggleCodeBlock: (attributes?: { language?: string; filename?: string }) => ReturnType;
		};
	}
}

// コードブロックのNodeViewコンポーネント
function CodeBlockComponent(props: NodeViewProps) {
	const { node } = props;
	const language = node.attrs.language || '';
	const filename = node.attrs.filename || '';

	return (
		<NodeViewWrapper className="code-block-wrapper">
			{filename && (
				<div className="code-block-filename" contentEditable={false}>
					{filename}
				</div>
			)}
			<pre className={language ? `language-${language}` : ''}>
				<code>
					<NodeViewContent />
				</code>
			</pre>
			<div className="code-block-scroll-hint" contentEditable={false}>
				←→ スクロール可能
			</div>
		</NodeViewWrapper>
	);
}

const CustomCodeBlockBase = CodeBlockLowlight.configure({ lowlight }).extend({
	addAttributes() {
		return {
			...this.parent?.(),
			filename: {
				default: null,
				parseHTML: (element) => element.getAttribute('data-filename'),
				renderHTML: (attributes) => {
					if (!attributes.filename) {
						return {};
					}
					return {
						'data-filename': attributes.filename,
					};
				},
			},
		};
	},

	renderHTML({ HTMLAttributes, node }) {
		const filename = node.attrs.filename;

		// ファイル名がない場合
		if (!filename) {
			return [
				'div',
				{ class: 'code-block-wrapper' },
				[
					'pre',
					mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
					['code', {}, 0],
				],
				[
					'div',
					{ class: 'code-block-scroll-hint' },
					'←→ スクロール可能',
				],
			];
		}

		// ファイル名がある場合
		return [
			'div',
			{ class: 'code-block-wrapper' },
			[
				'div',
				{ class: 'code-block-filename' },
				filename,
			],
			[
				'pre',
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
				['code', {}, 0],
			],
			[
				'div',
				{ class: 'code-block-scroll-hint' },
				'←→ スクロール可能',
			],
		];
	},
});

// エディタ用（NodeView付き）
export const CustomCodeBlockWithNodeView = CustomCodeBlockBase.extend({
	addNodeView() {
		return ReactNodeViewRenderer(CodeBlockComponent);
	},
});

// レンダラー用（NodeViewなし）
export const CustomCodeBlock = CustomCodeBlockBase;
