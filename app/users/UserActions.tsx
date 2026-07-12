"use client";
import { useState } from "react";

export function UserActions({ userId, email, status }: { userId: string; email: string; status?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isPro = status === "active";

  async function handleConfirm() {
    setLoading(true);
    await fetch("/api/users/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: isPro ? "downgrade" : "upgrade" }),
    });
    setLoading(false);
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        fontSize: 12, fontWeight: 600,
        padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
        background: isPro ? "#FEF2F2" : "#F3F0FF",
        color: isPro ? "#DC2626" : "#7C3AED",
        transition: "opacity 0.15s",
      }}>
        {isPro ? "Downgrade" : "→ Pro"}
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, animation: "fadeIn 0.15s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: 28, width: 400,
            boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
            animation: "slideUp 0.2s ease",
          }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                background: isPro ? "#FEF2F2" : "#F3F0FF",
              }}>
                {isPro ? "⬇️" : "⬆️"}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0d0d0d", marginBottom: 6 }}>
                {isPro ? "Downgrade to Free?" : "Upgrade to Pro?"}
              </div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                {isPro
                  ? <>This will remove Pro access for <strong style={{ color: "#0d0d0d" }}>{email}</strong> immediately.</>
                  : <>This will give <strong style={{ color: "#0d0d0d" }}>{email}</strong> full Pro access for <strong style={{ color: "#0d0d0d" }}>1 year</strong>.</>
                }
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setOpen(false)} style={{
                flex: 1, padding: "11px 0", borderRadius: 12,
                border: "1.5px solid #EBEBEB", background: "#fff",
                fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={loading} style={{
                flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                background: isPro ? "#DC2626" : "#7C3AED",
                fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? "Saving…" : isPro ? "Downgrade" : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  );
}
