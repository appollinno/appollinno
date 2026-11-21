import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data/products";
import { JOURNAL_ARTICLES } from "@/lib/data/journal";

const SITE_URL = "https://appollo-coffee.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = JOURNAL_ARTICLES.map((a) => ({
    url: `${SITE_URL}/journal/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
