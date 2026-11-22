"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          From Our Customers
        </p>
        <h2 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
          Loved, Cup After Cup
        </h2>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col border border-border p-6"
          >
            <div className="flex gap-1 text-caramel" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={14}
                  className={idx < t.rating ? "fill-caramel" : "fill-transparent"}
                />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold">
              {t.author}
              <span className="block text-xs font-normal text-foreground-muted">
                {t.location}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
