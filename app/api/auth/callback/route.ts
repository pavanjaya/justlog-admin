import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    // No code — likely a hash-based magic link; redirect to client-side handler
    return NextResponse.redirect(new URL("/auth/confirm", req.url));
  }

  const supabase = createClient(
    "https://vhetrfxndakszuclqaxz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZXRyZnhuZGFrc3p1Y2xxYXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjY0NzcsImV4cCI6MjA5NzI0MjQ3N30.U7KyQMjm2D3Vu6HwCXnqbpu9RtbMKOSKWnMNm43AOpA",
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  if (data.user.email !== process.env.ADMIN_EMAIL) return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24,
  });
  return res;
}
