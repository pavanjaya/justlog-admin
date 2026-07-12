"use client";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Wrong password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-10 w-full max-w-sm">
        <div className="mb-8">
          <div className="text-xs font-bold text-[#9748FF] uppercase tracking-widest mb-2">Justlog</div>
          <h1 className="text-2xl font-black text-[#0d0d0d] tracking-tight">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Enter admin password</p>
        </div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#9748FF] transition mb-3"
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading || !password}
          className="w-full py-3 rounded-xl bg-[#9748FF] text-white text-sm font-bold disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
