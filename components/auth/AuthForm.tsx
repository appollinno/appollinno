"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      // A hard navigation (not router.push) so the destination is always a
      // fresh server render — the client Router Cache can otherwise serve
      // a stale "signed out" response for /account if it was prefetched
      // (e.g. via the Navbar's account link) before this login/register.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <label className="block text-sm">
          <span className="text-foreground-muted">Full name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
          />
        </label>
      )}
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
      <label className="block text-sm">
        <span className="text-foreground-muted">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="mt-1 w-full border border-border px-3 py-2 outline-none focus-visible:border-primary"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
      </Button>
      <p className="text-center text-sm text-foreground-muted">
        {mode === "login" ? (
          <>
            New to Appollo?{" "}
            <Link href="/register" className="underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
