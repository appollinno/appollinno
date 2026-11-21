"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/saved", label: "Saved Products" },
];

export function AccountNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="md:w-56">
      <p className="font-display text-lg">Hi, {userName.split(" ")[0]}</p>
      <nav className="mt-6 flex flex-col gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 px-3 py-2 text-left text-sm text-foreground-muted hover:text-foreground"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
