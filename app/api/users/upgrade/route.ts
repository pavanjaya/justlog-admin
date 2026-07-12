import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, action } = await req.json();
  if (!userId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const db = adminClient();
  const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  await db.from("subscriptions").delete().eq("user_id", userId);

  if (action === "upgrade") {
    const { error } = await db.from("subscriptions").insert({
      user_id: userId,
      status: "active",
      plan: "yearly",
      valid_until: validUntil,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
