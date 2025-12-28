export default function EditPostLoading() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
}
