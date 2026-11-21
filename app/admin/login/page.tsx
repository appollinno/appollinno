"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "admin@appollo.coffee", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      if (data.user.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      // Hard navigation — see AuthForm.tsx for why (avoids a stale
      // Router Cache entry for /admin from before this login).
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-5 text-cream">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-2xl">Appollo Admin</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="text-cream/60">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full border border-cream/30 bg-transparent px-3 py-2 outline-none focus-visible:border-caramel"
            />
          </label>
          <label className="block text-sm">
            <span className="text-cream/60">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="mt-1 w-full border border-cream/30 bg-transparent px-3 py-2 outline-none focus-visible:border-caramel"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-caramel text-charcoal">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-cream/40">
          Demo credentials — email admin@appollo.coffee, password set via
          ADMIN_SEED_PASSWORD (defaults to AppolloAdmin!2026 in development).
        </p>
      </div>
    </div>
  );
}
