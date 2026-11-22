"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedBean } from "@/components/home/AnimatedBean";

interface CraftsmanshipStoryProps {
  image: { url: string; alt: string };
}

export function CraftsmanshipStory({ image }: CraftsmanshipStoryProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative order-2 md:order-1"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Craftsmanship
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-tight-display md:text-5xl">
            Roasted in small batches, never rushed
          </h2>
          <p className="mt-6 max-w-lg text-foreground-muted">
            Every lot we roast is profiled individually — charge temperature,
            airflow, and drop point tuned to that specific origin&apos;s density
            and moisture. We roast in batches under 12kg, several times a
            week, so what ships is never more than a few days off the drum.
          </p>
          <p className="mt-4 max-w-lg text-foreground-muted">
            It&apos;s slower, and more expensive, than roasting in bulk. We
            think the cup is worth it.
          </p>
          <Link
            href="/our-story"
            className="mt-6 inline-block border-b border-foreground pb-1 text-sm font-semibold uppercase tracking-wide"
          >
            Read our full story
          </Link>
          <AnimatedBean className="absolute -left-6 -top-10 hidden h-20 w-16 opacity-20 md:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative order-1 aspect-[4/5] overflow-hidden md:order-2"
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
