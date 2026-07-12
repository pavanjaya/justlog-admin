import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const db = adminClient();

  // Delete subscription first, then auth user
  await db.from("subscriptions").delete().eq("user_id", userId);
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
