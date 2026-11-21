import { Star } from "lucide-react";
import type { Product } from "@/lib/types";

export function ReviewsList({ product }: { product: Product }) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl">Customer Reviews</h2>
        <div className="flex items-center gap-1 text-caramel">
          <Star size={16} className="fill-caramel" />
          <span className="text-sm text-foreground">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {product.reviews.map((review) => (
          <li key={review.id} className="border border-border p-5">
            <div className="flex items-center gap-1 text-caramel" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={13}
                  className={idx < review.rating ? "fill-caramel" : "fill-transparent"}
                />
              ))}
            </div>
            <h3 className="mt-2 text-sm font-semibold">{review.title}</h3>
            <p className="mt-1 text-sm text-foreground-muted">{review.body}</p>
            <p className="mt-3 text-xs text-foreground-muted">
              {review.author} ·{" "}
              {new Date(review.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
