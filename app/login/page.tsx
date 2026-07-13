"use client";
import { useState } from "react";

type Step = "password" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePassword() {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStep("otp");
    } else {
      setError(data.error ?? "Wrong password");
    }
    setLoading(false);
  }

  async function handleOtp() {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(data.error ?? "Invalid code");
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError("");
    setOtp("");
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
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
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#9748FF", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Justlog
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0d0d0d", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: "#999" }}>
            {step === "password" ? "Enter your password to continue" : "Check your email for the 6-digit code"}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {(["password", "otp"] as Step[]).map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: step === "otp" ? "#9748FF" : i === 0 ? "#9748FF" : "#EBEBEB",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === "password" ? (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && password && handlePassword()}
              autoFocus
              style={{
                width: "100%", padding: "13px 16px", marginBottom: 12,
                border: "1.5px solid #EBEBEB", borderRadius: 12,
                fontSize: 14, color: "#0d0d0d", background: "#FAFAF9",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#9748FF")}
              onBlur={e => (e.currentTarget.style.borderColor = "#EBEBEB")}
            />
            {error && <ErrorBox message={error} />}
            <button onClick={handlePassword} disabled={loading || !password} style={btnStyle(!!password && !loading)}>
              {loading ? "Sending code…" : "Continue →"}
            </button>
          </>
        ) : (
          <>
            <div style={{ background: "#F3F0FF", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#7C3AED" }}>
              Code sent to <strong>jangidpavan@gmail.com</strong> · expires in 5 min
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && !loading && otp.length === 6 && handleOtp()}
              autoFocus
              style={{
                width: "100%", padding: "13px 16px", marginBottom: 12,
                border: "1.5px solid #EBEBEB", borderRadius: 12,
                fontSize: 24, fontWeight: 800, color: "#0d0d0d", background: "#FAFAF9",
                outline: "none", boxSizing: "border-box", letterSpacing: 8, textAlign: "center",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#9748FF")}
              onBlur={e => (e.currentTarget.style.borderColor = "#EBEBEB")}
            />
            {error && <ErrorBox message={error} />}
            <button onClick={handleOtp} disabled={loading || otp.length !== 6} style={btnStyle(otp.length === 6 && !loading)}>
              {loading ? "Verifying…" : "Sign In"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
              <button onClick={() => { setStep("password"); setError(""); setOtp(""); }} style={linkStyle}>
                ← Back
              </button>
              <button onClick={resendOtp} style={linkStyle}>
                Resend code
              </button>
            </div>
          </>
        )}

        <p style={{ fontSize: 11, color: "#ccc", textAlign: "center", marginTop: 24 }}>
          🔒 2FA · Session expires in 12 hours
        </p>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      background: "#FEF2F2", border: "1px solid #FEE2E2",
      borderRadius: 10, padding: "10px 14px", marginBottom: 12,
      fontSize: 12, fontWeight: 600, color: "#DC2626",
    }}>
      {message}
    </div>
  );
}

function btnStyle(active: boolean) {
  return {
    width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
    background: active ? "#9748FF" : "#E5E5E5",
    color: active ? "#fff" : "#bbb",
    fontSize: 14, fontWeight: 700,
    cursor: active ? "pointer" : "not-allowed",
    transition: "all 0.15s",
  } as React.CSSProperties;
}

const linkStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 600, color: "#9748FF", padding: 0,
};
