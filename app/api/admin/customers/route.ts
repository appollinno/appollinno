import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listUsers, toPublicUser } from "@/lib/auth/store";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ customers: listUsers().map(toPublicUser) });
}
