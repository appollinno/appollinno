"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountNav } from "@/components/account/AccountNav";
import { ProductCard } from "@/components/shop/ProductCard";
import { useSavedStore } from "@/lib/store/saved";
import { PRODUCTS } from "@/lib/data/products";

export default function SavedProductsPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [checked, setChecked] = useState(false);
  const productIds = useSavedStore((s) => s.productIds);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (checked && !user) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  }, [checked, user]);

  const savedProducts = PRODUCTS.filter((p) => productIds.includes(p.id));

  if (checked && !user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-28 md:px-8">
      <h1 className="font-display text-3xl">My Account</h1>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        {user && <AccountNav userName={user.name} />}
        <div className="flex-1">
          <h2 className="font-display text-xl">Saved Products</h2>
          {savedProducts.length === 0 ? (
            <div className="mt-6">
              <p className="text-sm text-foreground-muted">
                You haven&apos;t saved any products yet.
              </p>
              <Link href="/shop" className="mt-4 inline-block text-sm underline">
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {savedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
