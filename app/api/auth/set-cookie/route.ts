import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, email } = await req.json();
  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sb-access-token", token, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24,
  });
  return res;
}
