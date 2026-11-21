"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  image: { url: string; alt: string };
}

export function Hero({ image }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 180]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);

  return (
    <section ref={ref} className="relative h-[100vh] min-h-[640px] overflow-hidden bg-charcoal">
      <motion.div style={{ y }} className="absolute inset-0 h-[120%]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/30 to-charcoal"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-5 pb-20 md:px-8 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-caramel"
        >
          Specialty Coffee, Roasted With Purpose
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-[14vw] leading-[0.9] tracking-tight-display text-cream sm:text-[11vw] md:text-[8vw] lg:text-[7rem]"
        >
          Wake Up
          <br />
          The Beans
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-md text-base text-cream/80 md:text-lg"
        >
          Single-origin lots, sourced directly from the farms that grow them,
          roasted in small batches, and shipped within days of roasting.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Button href="/shop" variant="primary" size="lg" className="bg-caramel text-charcoal">
            Shop Coffee
          </Button>
          <Button
            href="/our-story"
            variant="secondary"
            size="lg"
            // !-prefixed so these reliably win over the "secondary" variant's
            // own text-foreground/border-foreground utilities regardless of
            // Tailwind's generated CSS order — without it this rendered as
            // near-invisible dark text on the hero image (measured ~1.2:1).
            className="!border-cream !text-cream hover:!bg-cream hover:!text-charcoal"
          >
            Our Story
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/70"
        aria-hidden="true"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
