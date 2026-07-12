"use client";
import { useState } from "react";
import { publicClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true); setError("");
    const supabase = publicClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-10 w-full max-w-sm">
        <div className="mb-8">
          <div className="text-xs font-bold text-[#9748FF] uppercase tracking-widest mb-2">Justlog</div>
          <h1 className="text-2xl font-black text-[#0d0d0d] tracking-tight">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in with your admin email</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <p className="text-sm font-semibold text-[#0d0d0d]">Check your email</p>
            <p className="text-xs text-gray-500 mt-1">We sent a magic link to <strong>{email}</strong></p>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#9748FF] transition mb-3"
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading || !email}
              className="w-full py-3 rounded-xl bg-[#9748FF] text-white text-sm font-bold disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Magic Link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
