"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StoryBlockProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: { url: string; alt: string };
  reverse?: boolean;
}

export function StoryBlock({ eyebrow, title, paragraphs, image, reverse }: StoryBlockProps) {
  return (
    <div className="grid gap-10 py-16 md:grid-cols-2 md:items-center md:gap-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className={cn(
          "relative aspect-[4/5] overflow-hidden",
          reverse ? "md:order-2" : "md:order-1"
        )}
      >
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: reverse ? 24 : -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className={reverse ? "md:order-1" : "md:order-2"}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight-display md:text-4xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-foreground-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
