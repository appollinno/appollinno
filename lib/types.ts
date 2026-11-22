export type RoastLevel = "Light" | "Medium" | "Medium-Dark" | "Dark";

export type ProcessMethod = "Washed" | "Natural" | "Honey" | "Anaerobic";

export interface ProductVariant {
  id: string;
  weightGrams: number;
  label: string;
  priceCents: number;
  compareAtPriceCents?: number;
  sku: string;
  stock: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "Single Origin" | "Blends" | "Decaf" | "Equipment";
  tagline: string;
  description: string;
  origin: {
    country: string;
    region: string;
    farmOrCooperative: string;
    altitudeMeters: [number, number];
  };
  roastLevel: RoastLevel;
  process: ProcessMethod;
  tastingNotes: string[];
  brewingRecommendations: { method: string; ratio: string; time: string }[];
  images: { url: string; alt: string }[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  bestSeller?: boolean;
  featured?: boolean;
  new?: boolean;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "Brewing Guides" | "Origins" | "Recipes" | "Craft";
  readMinutes: number;
  date: string;
  coverImage: { url: string; alt: string };
  body: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
}
