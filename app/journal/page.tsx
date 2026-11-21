import type { Metadata } from "next";
import { JournalExplorer } from "@/components/journal/JournalExplorer";
import { JOURNAL_ARTICLES } from "@/lib/data/journal";

export const metadata: Metadata = {
  title: "Coffee Journal",
  description:
    "Brewing guides, origin stories, recipes, and roasting craft from the Appollo Coffee Shop team.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-28 md:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Coffee Journal
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
          Learn, Brew, Taste
        </h1>
        <p className="mt-4 text-foreground-muted">
          Everything we know about brewing, sourcing, and roasting — written
          by the team that does it every day.
        </p>
      </div>

      <div className="mt-10">
        <JournalExplorer articles={JOURNAL_ARTICLES} />
      </div>
    </div>
  );
}
