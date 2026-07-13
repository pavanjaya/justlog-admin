import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";
import { adminClient } from "@/lib/supabase";

async function logAttempt(ip: string, email: string, success: boolean) {
  try {
    const db = adminClient();
    await db.from("admin_login_logs").insert({ ip, email, success, created_at: new Date().toISOString() });
  } catch {
    // non-blocking — don't fail login if logging fails
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterMs / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    await logAttempt(ip, "admin", false);
    return NextResponse.json(
      { error: `Wrong password. ${rate.remaining} attempt${rate.remaining !== 1 ? "s" : ""} remaining.` },
      { status: 401 }
    );
  }

  resetRateLimit(ip);
  await logAttempt(ip, "admin", true);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
