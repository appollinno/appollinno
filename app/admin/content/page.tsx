import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { JOURNAL_ARTICLES } from "@/lib/data/journal";
import { COUPONS } from "@/lib/store/cart";

async function ContentContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl">Content &amp; Promotions</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Journal articles are defined in lib/data/journal.ts; the
        `journal_articles` and `promo_banners` tables are ready for a CMS
        write UI once connected (supabase/migrations/0001_init.sql).
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="border border-border p-6">
          <h2 className="font-display text-lg">Coffee Journal Articles</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {JOURNAL_ARTICLES.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b border-border pb-2">
                <span>
                  {a.title}
                  <span className="ml-2 text-xs text-foreground-muted">{a.category}</span>
                </span>
                <Link href={`/journal/${a.slug}`} className="text-xs underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border p-6">
          <h2 className="font-display text-lg">Active Coupons</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {Object.entries(COUPONS).map(([code, rate]) => (
              <li key={code} className="flex justify-between border-b border-border pb-2">
                <span className="font-mono">{code}</span>
                <span className="text-foreground-muted">{Math.round(rate * 100)}% off</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <ContentContent />
    </Suspense>
  );
}
