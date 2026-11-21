import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { updateOrderStatus, type Order } from "@/lib/orders";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body: { status?: Order["fulfillmentStatus"] } = await request.json();
  const allowed: Order["fulfillmentStatus"][] = ["pending", "fulfilled", "shipped", "delivered"];
  if (!body.status || !allowed.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = updateOrderStatus(id, body.status);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}
