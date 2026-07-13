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
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Wrong password");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F7F7F5", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "40px 36px",
        width: "100%", maxWidth: 380,
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08)",
        border: "1px solid #EBEBEB",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#9748FF", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Justlog
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0d0d0d", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "#999" }}>Enter your password to continue</p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && password && handleLogin()}
            autoFocus
            style={{
              width: "100%", padding: "13px 16px",
              border: "1.5px solid #EBEBEB", borderRadius: 12,
              fontSize: 14, color: "#0d0d0d", background: "#FAFAF9",
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#9748FF")}
            onBlur={e => (e.currentTarget.style.borderColor = "#EBEBEB")}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FEE2E2",
            borderRadius: 10, padding: "10px 14px", marginBottom: 12,
            fontSize: 12, fontWeight: 600, color: "#DC2626",
          }}>
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
            background: password && !loading ? "#9748FF" : "#E5E5E5",
            color: password && !loading ? "#fff" : "#bbb",
            fontSize: 14, fontWeight: 700, cursor: password && !loading ? "pointer" : "not-allowed",
            transition: "all 0.15s", letterSpacing: "0.01em",
          }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {/* Footer */}
        <p style={{ fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 24 }}>
          🔒 Secured · Session expires in 12 hours
        </p>
      </div>
    </div>
  );
}
