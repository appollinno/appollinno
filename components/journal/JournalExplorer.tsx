"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import type { JournalArticle } from "@/lib/types";

const CATEGORIES: JournalArticle["category"][] = [
  "Brewing Guides",
  "Origins",
  "Recipes",
  "Craft",
];

function ExplorerInner({ articles }: { articles: JournalArticle[] }) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string>(
    searchParams.get("category") ?? "All"
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = articles;
    if (category !== "All") {
      list = list.filter((a) => a.category === category);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-56 border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:border-primary"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <Link key={article.id} href={`/journal/${article.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <Image
                src={article.coverImage.url}
                alt={article.coverImage.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">
              {`${article.category} · ${article.readMinutes} min read`}
            </p>
            <h3 className="mt-2 font-display text-xl leading-snug">{article.title}</h3>
            <p className="mt-2 text-sm text-foreground-muted">{article.excerpt}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-foreground-muted">
          No articles match that search.
        </p>
      )}
    </div>
  );
}

export function JournalExplorer({ articles }: { articles: JournalArticle[] }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-foreground-muted">Loading articles…</div>}>
      <ExplorerInner articles={articles} />
    </Suspense>
  );
}
