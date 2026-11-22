"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-accent bg-surface p-6 text-sm">
        Thanks for reaching out — we&apos;ll get back to you within one
        business day.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-foreground-muted">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="text-foreground-muted">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-foreground-muted">Subject</span>
        <input
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
        />
      </label>
      <label className="block text-sm">
        <span className="text-foreground-muted">Message</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong — please try again.</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
