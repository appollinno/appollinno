import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL_ARTICLES, getArticleBySlug } from "@/lib/data/journal";

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage.url }],
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-28 md:px-8">
      <Link href="/journal" className="text-sm text-foreground-muted hover:text-foreground">
        ← Coffee Journal
      </Link>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-accent">
        {`${article.category} · ${article.readMinutes} min read`}
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-sm text-foreground-muted">
        {new Date(article.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden">
        <Image
          src={article.coverImage.url}
          alt={article.coverImage.alt}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="prose-coffee mt-10 space-y-5 text-foreground">
        {article.body.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </article>
  );
}
