import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PostsFilterProps {
  currentStatus: string;
}

export function PostsFilter({ currentStatus }: PostsFilterProps) {
  const createStatusUrl = (status: string) => {
    const params = new URLSearchParams();
    params.set("status", status);
    return `?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
      <Button
        variant={currentStatus === "all" ? "default" : "outline"}
        size="sm"
        asChild
        className="w-full sm:w-auto"
      >
        <Link href={createStatusUrl("all")}>すべて</Link>
      </Button>
      <Button
        variant={currentStatus === "published" ? "default" : "outline"}
        size="sm"
        asChild
        className="w-full sm:w-auto"
      >
        <Link href={createStatusUrl("published")}>公開</Link>
      </Button>
      <Button
        variant={currentStatus === "draft" ? "default" : "outline"}
        size="sm"
        asChild
        className="w-full sm:w-auto"
      >
        <Link href={createStatusUrl("draft")}>下書き</Link>
      </Button>
      <Button
        variant={currentStatus === "private" ? "default" : "outline"}
        size="sm"
        asChild
        className="w-full sm:w-auto"
      >
        <Link href={createStatusUrl("private")}>非公開</Link>
      </Button>
    </div>
  );
}
