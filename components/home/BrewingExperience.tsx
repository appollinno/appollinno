"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface Step {
  title: string;
  description: string;
  image: { url: string; alt: string };
}

export function BrewingExperience({ steps }: { steps: Step[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-charcoal py-24 text-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-caramel">
              The Ritual
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
              The Brewing Experience
            </h2>
          </div>
          <Link
            href="/journal?category=Brewing+Guides"
            className="border-b border-cream pb-1 text-sm font-semibold uppercase tracking-wide"
          >
            All Brewing Guides
          </Link>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : i * 0.12 }}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={step.image.url}
                  alt={step.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center bg-caramel font-display text-sm text-charcoal">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-cream/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
