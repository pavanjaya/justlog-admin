import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { adminClient } from "@/lib/supabase";
import { Resend } from "resend";

const ADMIN_EMAIL = "jangidpavan@gmail.com";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterMs / 60000);
    return NextResponse.json({ error: `Too many attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.` }, { status: 429 });
  }

  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: `Wrong password. ${rate.remaining} attempt${rate.remaining !== 1 ? "s" : ""} remaining.` },
      { status: 401 }
    );
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

  // Store OTP in Supabase
  const db = adminClient();
  await db.from("admin_otps").delete().eq("email", ADMIN_EMAIL); // clear old ones
  await db.from("admin_otps").insert({ email: ADMIN_EMAIL, otp, expires_at: expiresAt });

  // Send email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Justlog Admin <noreply@justlog.live>",
    to: ADMIN_EMAIL,
    subject: `Your admin login code: ${otp}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 24px;">
        <div style="font-size: 11px; font-weight: 800; color: #9748FF; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">Justlog Admin</div>
        <h1 style="font-size: 24px; font-weight: 900; color: #0d0d0d; margin: 0 0 8px;">Login Code</h1>
        <p style="font-size: 14px; color: #666; margin: 0 0 32px;">Use this code to complete your admin login. It expires in 5 minutes.</p>
        <div style="background: #F3F0FF; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px; font-weight: 900; color: #7C3AED; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #bbb;">If you didn't request this, someone has your admin password. Change it immediately.</p>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
