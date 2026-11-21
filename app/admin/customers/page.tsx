import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { listUsers, toPublicUser } from "@/lib/auth/store";

async function CustomersContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const customers = listUsers().map(toPublicUser).filter((u) => u.role === "customer");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl">Customers</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Accounts registered this server session (mock auth — see
        lib/auth/store.ts).
      </p>

      {customers.length === 0 ? (
        <p className="mt-6 text-sm text-foreground-muted">
          No customers have registered yet.
        </p>
      ) : (
        <table className="mt-6 w-full max-w-2xl text-left text-sm">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3">{c.name}</td>
                <td className="py-3 text-foreground-muted">{c.email}</td>
                <td className="py-3 text-foreground-muted">
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <CustomersContent />
    </Suspense>
  );
}
