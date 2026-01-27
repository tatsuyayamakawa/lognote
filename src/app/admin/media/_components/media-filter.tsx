"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface MediaFilterProps {
  filterMode: "all" | "unassigned";
  onFilterModeChange: (mode: "all" | "unassigned") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  count: number;
}

export function MediaFilter({
  filterMode,
  onFilterModeChange,
  searchQuery,
  onSearchQueryChange,
  count,
}: MediaFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex gap-2">
        <Button
          variant={filterMode === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterModeChange("all")}
        >
          すべて
        </Button>
        <Button
          variant={filterMode === "unassigned" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterModeChange("unassigned")}
        >
          未割当
        </Button>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="記事タイトルまたはファイル名で検索..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <span className="text-sm text-muted-foreground whitespace-nowrap bg-secondary px-3 py-1 rounded-full">
        {count}件
      </span>
    </div>
  );
}

export function MediaFilterStatic() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex gap-2">
        <Button variant="default" size="sm">
          すべて
        </Button>
        <Button variant="outline" size="sm">
          未割当
        </Button>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="記事タイトルまたはファイル名で検索..."
          className="pl-9 pr-9"
          disabled
        />
      </div>
    </div>
  );
}
