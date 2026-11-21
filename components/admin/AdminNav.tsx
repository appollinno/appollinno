"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/content", label: "Content & Promotions" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-full border-b border-border bg-charcoal text-cream md:w-56 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <p className="font-display text-lg">Appollo Admin</p>
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-5">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap px-3 py-2 text-sm",
              pathname === link.href
                ? "bg-caramel text-charcoal"
                : "text-cream/70 hover:text-cream"
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="whitespace-nowrap px-3 py-2 text-left text-sm text-cream/70 hover:text-cream"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
