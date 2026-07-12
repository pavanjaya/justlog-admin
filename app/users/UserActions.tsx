"use client";
import { useState } from "react";

type Modal = "upgrade" | "delete" | null;

export function UserActions({ userId, email, status }: { userId: string; email: string; status?: string }) {
  const [modal, setModal] = useState<Modal>(null);
  const [loading, setLoading] = useState(false);
  const isPro = status === "active";

  async function handleUpgrade() {
    setLoading(true);
    await fetch("/api/users/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: isPro ? "downgrade" : "upgrade" }),
    });
    setLoading(false);
    setModal(null);
    window.location.reload();
  }

  async function handleDelete() {
    setLoading(true);
    await fetch("/api/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setLoading(false);
    setModal(null);
    window.location.reload();
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={() => setModal("upgrade")} style={{
          fontSize: 12, fontWeight: 600,
          padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
          background: isPro ? "#FEF2F2" : "#F3F0FF",
          color: isPro ? "#DC2626" : "#7C3AED",
        }}>
          {isPro ? "Downgrade" : "→ Pro"}
        </button>
        <button onClick={() => setModal("delete")} style={{
          fontSize: 12, fontWeight: 600,
          padding: "5px 10px", borderRadius: 8, border: "1px solid #EBEBEB",
          background: "#fff", color: "#bbb", cursor: "pointer",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#DC2626"; (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EBEBEB"; (e.currentTarget as HTMLButtonElement).style.color = "#bbb"; }}
        >
          🗑
        </button>
      </div>

      {/* Upgrade / Downgrade modal */}
      {modal === "upgrade" && (
        <div onClick={() => setModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, animation: "fadeIn 0.15s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: 28, width: 400,
            boxShadow: "0 24px 64px rgba(0,0,0,0.12)", animation: "slideUp 0.2s ease",
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: isPro ? "#FEF2F2" : "#F3F0FF" }}>
              {isPro ? "⬇️" : "⬆️"}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0d0d0d", marginBottom: 6 }}>
              {isPro ? "Downgrade to Free?" : "Upgrade to Pro?"}
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
              {isPro
                ? <>This will remove Pro access for <strong style={{ color: "#0d0d0d" }}>{email}</strong> immediately.</>
                : <>This will give <strong style={{ color: "#0d0d0d" }}>{email}</strong> full Pro access for <strong style={{ color: "#0d0d0d" }}>1 year</strong>.</>
              }
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #EBEBEB", background: "#fff", fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleUpgrade} disabled={loading} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: isPro ? "#DC2626" : "#7C3AED", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving…" : isPro ? "Downgrade" : "Upgrade to Pro"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {modal === "delete" && (
        <div onClick={() => setModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, animation: "fadeIn 0.15s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: 28, width: 400,
            boxShadow: "0 24px 64px rgba(0,0,0,0.12)", animation: "slideUp 0.2s ease",
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "#FEF2F2" }}>
              🗑️
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0d0d0d", marginBottom: 6 }}>
              Delete user?
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 8 }}>
              This will permanently delete <strong style={{ color: "#0d0d0d" }}>{email}</strong> and all their data.
            </div>
            <div style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, background: "#FEF2F2", padding: "8px 12px", borderRadius: 8, marginBottom: 24 }}>
              ⚠️ This action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #EBEBEB", background: "#fff", fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={loading} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "#DC2626", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Deleting…" : "Delete User"}
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
