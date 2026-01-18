import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Heading2,
  Heading3,
  Heading4,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Underline as UnderlineIcon,
  MessageSquare,
  MousePointerClick,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  Package,
  MonitorPlay,
  Youtube as YoutubeIcon,
  Instagram as InstagramIcon,
  Lightbulb,
  Images,
  LayoutList,
} from "lucide-react";
import { ColorPickerPopover } from "./dialogs/color-picker-popover";
import { YoutubePopover } from "./dialogs/youtube-popover";
import { InstagramPopover } from "./dialogs/instagram-popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
  onAddLink: () => void;
  onAddImage: () => void;
  onAddSpeechBubble: () => void;
  onAddCtaButton: () => void;
  onAddProductLinkBox: () => void;
  onAddEmbedAdBox: () => void;
  onAddImageGallery: () => void;
  onAddLeftHeaderTable: () => void;
  onAddPointBox: () => void;
  onAddCodeBlock: () => void;
  youtubePopoverOpen: boolean;
  onYoutubePopoverChange: (open: boolean) => void;
  onYoutubeInsert: (url: string) => void;
  instagramPopoverOpen: boolean;
  onInstagramPopoverChange: (open: boolean) => void;
  onInstagramInsert: (url: string) => void;
}

export function EditorToolbar({
  editor,
  disabled = false,
  onAddLink,
  onAddImage,
  onAddSpeechBubble,
  onAddCtaButton,
  onAddProductLinkBox,
  onAddEmbedAdBox,
  onAddImageGallery,
  onAddLeftHeaderTable,
  onAddPointBox,
  onAddCodeBlock,
  youtubePopoverOpen,
  onYoutubePopoverChange,
  onYoutubeInsert,
  instagramPopoverOpen,
  onInstagramPopoverChange,
  onInstagramInsert,
}: EditorToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="sticky top-0 z-40 flex gap-1 rounded-t-[calc(0.375rem-1px)] border-b bg-muted p-2 shadow-sm overflow-x-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="見出し2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="見出し3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive("heading", { level: 4 }) ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="見出し4"
              >
                <Heading4 className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>見出し関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="太字"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="斜体"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="下線"
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>
              <ColorPickerPopover
                currentColor={editor.getAttributes("textStyle").color}
                onColorChange={(color) => editor.chain().focus().setColor(color).run()}
                disabled={disabled}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent><p>文字装飾関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="箇条書きリスト"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="番号付きリスト"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="引用"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive("code") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="インラインコード"
              >
                <Code2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddCodeBlock}
                className={editor.isActive("codeBlock") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="コードブロック"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>ブロック関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddCtaButton}
                className={editor.isActive("ctaButton") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="CTAボタン"
              >
                <MousePointerClick className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddLink}
                className={editor.isActive("link") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="リンク"
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>リンク関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddImage}
                disabled={disabled}
                title="画像"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddImageGallery}
                className={editor.isActive("imageGallery") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="画像ギャラリー"
              >
                <Images className="h-4 w-4" />
              </Button>
              <YoutubePopover
                open={youtubePopoverOpen}
                onOpenChange={onYoutubePopoverChange}
                onInsert={onYoutubeInsert}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={editor.isActive("youtube") ? "bg-accent border-2 border-primary" : ""}
                  disabled={disabled}
                  title="YouTube動画"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </Button>
              </YoutubePopover>
              <InstagramPopover
                open={instagramPopoverOpen}
                onOpenChange={onInstagramPopoverChange}
                onInsert={onInstagramInsert}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={editor.isActive("instagram") ? "bg-accent border-2 border-primary" : ""}
                  disabled={disabled}
                  title="Instagram投稿"
                >
                  <InstagramIcon className="h-4 w-4" />
                </Button>
              </InstagramPopover>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>画像・動画関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                disabled={disabled}
                title="テーブル挿入"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddLeftHeaderTable}
                disabled={disabled}
                title="左端列見出しテーブル"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              {editor.isActive("table") && (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    disabled={disabled}
                    title="列を前に追加"
                  >
                    <Columns className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    disabled={disabled}
                    title="行を前に追加"
                  >
                    <Rows className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    disabled={disabled}
                    title="テーブル削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent><p>テーブル関連</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddSpeechBubble}
                className={editor.isActive("speechBubble") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="吹き出し"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddPointBox}
                className={editor.isActive("pointBox") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="ポイントボックス"
              >
                <Lightbulb className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>吹き出し・ポイントボックス</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddProductLinkBox}
                className={editor.isActive("productLinkBox") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="商品リンクボックス"
              >
                <Package className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onAddEmbedAdBox}
                className={editor.isActive("embedAdBox") ? "bg-accent border-2 border-primary" : ""}
                disabled={disabled}
                title="埋め込み広告"
              >
                <MonitorPlay className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>アフィリエイトリンク</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const { from, to } = editor.state.selection;
                  if (from === to) {
                    editor.chain().focus().selectParentNode().clearNodes().unsetAllMarks().unsetColor().run();
                  } else {
                    editor.chain().focus().clearNodes().unsetAllMarks().unsetColor().run();
                  }
                }}
                disabled={disabled}
                title="装飾解除"
              >
                <RemoveFormatting className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>装飾解除</p></TooltipContent>
        </Tooltip>
        <div className="mx-1 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo() || disabled}
                title="元に戻す"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo() || disabled}
                title="やり直す"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>操作</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
