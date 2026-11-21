"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBeanProps {
  className?: string;
  delay?: number;
}

export function AnimatedBean({ className, delay = 0 }: AnimatedBeanProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 100 140"
      className={cn("text-coffee", className)}
      aria-hidden="true"
      animate={
        prefersReducedMotion
          ? {}
          : { y: [0, -14, 0], rotate: [0, 6, -4, 0] }
      }
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M50 2C27 2 4 28 4 65c0 45 23 73 46 73s46-28 46-73C96 28 73 2 50 2Z"
        fill="currentColor"
      />
      <path
        d="M50 8C36 28 32 50 50 72c18 22 14 44 0 64"
        stroke="var(--color-espresso)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </motion.svg>
  );
}
