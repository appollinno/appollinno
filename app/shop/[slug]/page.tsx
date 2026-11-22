import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { SaveButton } from "@/components/product/SaveButton";
import { ReviewsList } from "@/components/product/ReviewsList";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { PRODUCTS, getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0].url }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-5 py-28 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images.map((i) => i.url),
          brand: { "@type": "Brand", name: "Appollo Coffee Shop" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
          offers: product.variants.map((v) => ({
            "@type": "Offer",
            name: v.label,
            sku: v.sku,
            price: (v.priceCents / 100).toFixed(2),
            priceCurrency: "USD",
            availability:
              v.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          })),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground-muted">
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight-display">
            {product.name}
          </h1>
          <p className="mt-2 text-foreground-muted">{product.tagline}</p>

          <div className="mt-8">
            <AddToCartForm product={product} />
            <SaveButton productId={product.id} />
          </div>
        </div>
      </div>

      <ProductDetails product={product} />
      <ReviewsList product={product} />
      <RelatedProducts products={related} />
    </div>
  );
}
