"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  /** Set for the first few cards in an above-the-fold grid so the browser
   * doesn't lazy-load a likely LCP image (Next.js flags this at runtime). */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const cheapestVariant = product.variants[0];
  const inStock = product.variants.some((v) => v.stock > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            loading={priority ? "eager" : undefined}
            fetchPriority={priority ? "high" : undefined}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <Image
              src={product.images[1].url}
              alt=""
              fill
              aria-hidden="true"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {product.bestSeller && (
            <span className="absolute left-3 top-3 bg-charcoal px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
              Best Seller
            </span>
          )}
          {product.new && (
            <span className="absolute left-3 top-3 bg-caramel px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal">
              New
            </span>
          )}
          {!inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-charcoal/60 text-sm font-semibold uppercase tracking-wide text-cream">
              Sold Out
            </span>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            {/* A <p>, not a heading: this card can appear directly under
                the page's own h1 (e.g. /shop) with no intervening h2, and
                marking every grid item as a heading breaks heading order
                and clutters the document outline. The link text already
                names the product for assistive tech. */}
            <p className="font-display text-lg leading-tight">{product.name}</p>
            <p className="mt-1 text-sm text-foreground-muted">{product.tagline}</p>
            <div className="mt-2 flex items-center gap-1">
              <Star size={13} className="fill-caramel text-caramel" />
              <span className="text-xs text-foreground-muted">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          </div>
          <p className="shrink-0 font-display text-base">
            {formatPrice(cheapestVariant.priceCents)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
