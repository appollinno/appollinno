import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listOrders } from "@/lib/orders";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ orders: listOrders() });
}
