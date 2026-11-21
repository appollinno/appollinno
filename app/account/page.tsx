import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AccountNav } from "@/components/account/AccountNav";

async function AccountContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-5 py-28 md:px-8">
      <h1 className="font-display text-3xl">My Account</h1>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <AccountNav userName={user.name} />
        <div className="flex-1 border border-border p-6">
          <h2 className="font-display text-xl">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-foreground-muted">Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-foreground-muted">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-foreground-muted">Member Since</dt>
              <dd>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={<div className="px-5 py-28 text-center text-foreground-muted">Loading…</div>}
    >
      <AccountContent />
    </Suspense>
  );
}
