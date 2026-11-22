import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-28 md:px-8">
      <h1 className="text-center font-display text-3xl">Sign In</h1>
      <p className="mt-2 text-center text-sm text-foreground-muted">
        Welcome back to Appollo.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
