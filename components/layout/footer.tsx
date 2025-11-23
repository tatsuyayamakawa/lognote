import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted/50 w-full border-t py-3 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <small>© 整えて、創る。</small>
        <nav className="flex flex-wrap gap-4 text-sm">
          <Link href="/site-map" className="text-muted-foreground hover:text-foreground transition-colors">
            サイトマップ
          </Link>
          <Link href="/feed.xml" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank">
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
