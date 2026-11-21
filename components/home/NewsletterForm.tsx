"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
  const inputId = useId();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const dark = variant === "dark";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      noValidate
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "w-full rounded-none border px-4 py-3 text-sm outline-none transition-colors",
          dark
            ? "border-cream/30 bg-transparent text-cream placeholder:text-cream/40 focus-visible:border-caramel"
            : "border-border bg-background text-foreground placeholder:text-foreground-muted focus-visible:border-primary"
        )}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "shrink-0 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-opacity disabled:opacity-60",
          dark
            ? "bg-caramel text-charcoal"
            : "bg-primary text-primary-foreground"
        )}
      >
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>
      <span role="status" className="sr-only" aria-live="polite">
        {status === "success" && "Subscribed successfully"}
        {status === "error" && "Something went wrong, please try again"}
      </span>
      {status === "success" && (
        <p className="text-xs text-caramel sm:absolute sm:mt-12">
          You&apos;re on the list — welcome to Appollo.
        </p>
      )}
    </form>
  );
}
