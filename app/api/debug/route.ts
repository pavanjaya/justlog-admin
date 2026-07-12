import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";

export async function GET() {
  const db = adminClient();
  const { data, error } = await db.auth.admin.listUsers({ perPage: 5 });
  return NextResponse.json({ count: data?.users?.length ?? 0, error: error?.message ?? null });
}
