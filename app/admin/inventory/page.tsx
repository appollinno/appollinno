import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { listInventory } from "@/lib/inventory";

async function InventoryContent() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl">Inventory</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Stock adjustments here apply for the lifetime of this server
        instance (see lib/inventory.ts — swap for the real `inventory` table
        once Supabase is connected).
      </p>
      <InventoryTable initialRows={listInventory()} />
    </AdminShell>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-foreground-muted">Loading…</div>}>
      <InventoryContent />
    </Suspense>
  );
}
