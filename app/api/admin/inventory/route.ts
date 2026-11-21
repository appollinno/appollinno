import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listInventory, adjustStock } from "@/lib/inventory";
import { PRODUCTS } from "@/lib/data/products";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ inventory: listInventory() });
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body: { sku?: string; delta?: number } = await request.json();
  if (!body.sku || typeof body.delta !== "number") {
    return NextResponse.json({ error: "sku and delta are required" }, { status: 400 });
  }

  const variant = PRODUCTS.flatMap((p) => p.variants).find((v) => v.sku === body.sku);
  if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  const stock = adjustStock(variant.sku, variant.stock, body.delta);
  return NextResponse.json({ sku: variant.sku, stock });
}
