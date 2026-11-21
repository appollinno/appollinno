"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface InventoryRow {
  productId: string;
  productName: string;
  sku: string;
  label: string;
  stock: number;
  reorderThreshold: number;
}

export function InventoryTable({ initialRows }: { initialRows: InventoryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [pending, setPending] = useState<string | null>(null);

  async function adjust(sku: string, delta: number) {
    setPending(sku);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, delta }),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) => (r.sku === sku ? { ...r, stock: data.stock } : r))
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-foreground-muted">
            <th className="py-2 font-medium">Product</th>
            <th className="py-2 font-medium">SKU</th>
            <th className="py-2 font-medium">Stock</th>
            <th className="py-2 font-medium">Adjust</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sku} className="border-b border-border">
              <td className="py-3">
                {row.productName} <span className="text-foreground-muted">({row.label})</span>
              </td>
              <td className="py-3 text-foreground-muted">{row.sku}</td>
              <td className="py-3">
                <span className={row.stock <= row.reorderThreshold ? "text-accent" : ""}>
                  {row.stock}
                </span>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pending === row.sku}
                    onClick={() => adjust(row.sku, -1)}
                    aria-label={`Decrease stock for ${row.productName} ${row.label}`}
                    className="flex h-7 w-7 items-center justify-center border border-border"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={pending === row.sku}
                    onClick={() => adjust(row.sku, 1)}
                    aria-label={`Increase stock for ${row.productName} ${row.label}`}
                    className="flex h-7 w-7 items-center justify-center border border-border"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
