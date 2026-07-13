import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase";
import { resetRateLimit } from "@/lib/rateLimit";

const ADMIN_EMAIL = "jangidpavan@gmail.com";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { otp } = await req.json();

  const db = adminClient();
  const { data } = await db
    .from("admin_otps")
    .select("*")
    .eq("email", ADMIN_EMAIL)
    .single();

  if (!data) {
    return NextResponse.json({ error: "No OTP found. Request a new one." }, { status: 401 });
  }

  if (new Date(data.expires_at) < new Date()) {
    await db.from("admin_otps").delete().eq("email", ADMIN_EMAIL);
    return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 401 });
  }

  if (data.otp !== otp) {
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 401 });
  }

  // Valid — clean up OTP and set session cookie
  await db.from("admin_otps").delete().eq("email", ADMIN_EMAIL);
  resetRateLimit(ip);

  // Log successful login
  try {
    await db.from("admin_login_logs").insert({ ip, email: ADMIN_EMAIL, success: true });
  } catch {}

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin-token", process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
