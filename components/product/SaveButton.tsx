"use client";

import { Heart } from "lucide-react";
import { useSavedStore } from "@/lib/store/saved";
import { cn } from "@/lib/utils";

export function SaveButton({ productId }: { productId: string }) {
  const isSaved = useSavedStore((s) => s.isSaved(productId));
  const toggle = useSavedStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved products" : "Save product"}
      className="mt-4 flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground"
    >
      <Heart size={16} className={cn(isSaved && "fill-accent text-accent")} />
      {isSaved ? "Saved" : "Save for later"}
    </button>
  );
}
