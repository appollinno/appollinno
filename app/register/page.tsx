import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-28 md:px-8">
      <h1 className="text-center font-display text-3xl">Create Account</h1>
      <p className="mt-2 text-center text-sm text-foreground-muted">
        Join Appollo for faster checkout and order tracking.
      </p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
