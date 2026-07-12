import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login", req.url));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) return NextResponse.redirect(new URL("/login", req.url));

  if (data.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
  }

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("sb-access-token", data.session.access_token, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24,
  });
  return res;
}
