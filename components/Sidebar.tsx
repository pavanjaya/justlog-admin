"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", icon: "⚡", label: "Dashboard" },
  { href: "/users", icon: "👥", label: "Users" },
  { href: "/contacts", icon: "💬", label: "Contacts" },
  { href: "/security", icon: "🔒", label: "Security" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 220,
        background: "#fff", borderRight: "1px solid #EBEBEB",
        display: "flex", flexDirection: "column", padding: "20px 12px", zIndex: 10,
      }}>
        <div style={{ padding: "4px 12px 20px", borderBottom: "1px solid #F0F0EE", marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#9748FF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Justlog</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0d0d0d" }}>Admin</div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                fontSize: 13, fontWeight: active ? 600 : 500,
                color: active ? "#7C3AED" : "#555",
                background: active ? "#F3F0FF" : "transparent",
                textDecoration: "none", transition: "all 0.1s",
              }}>
                <span style={{ fontSize: 15 }}>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setConfirmLogout(true)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 10,
          fontSize: 13, fontWeight: 500, color: "#999",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left", transition: "all 0.1s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"; (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#999"; }}
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Logout confirmation modal */}
      {confirmLogout && (
        <div onClick={() => setConfirmLogout(false)} style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, animation: "fadeIn 0.15s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: 28, width: 360,
            boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
            animation: "slideUp 0.2s ease",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, marginBottom: 16,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              background: "#FEF2F2",
            }}>
              🚪
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#0d0d0d", marginBottom: 6 }}>
              Log out?
            </div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
              You'll need to enter the admin password to get back in.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmLogout(false)} style={{
                flex: 1, padding: "11px 0", borderRadius: 12,
                border: "1.5px solid #EBEBEB", background: "#fff",
                fontSize: 14, fontWeight: 600, color: "#555", cursor: "pointer",
              }}>
                Cancel
              </button>
              <form action="/api/auth/logout" method="POST" style={{ flex: 1 }}>
                <button type="submit" style={{
                  width: "100%", padding: "11px 0", borderRadius: 12, border: "none",
                  background: "#DC2626",
                  fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                }}>
                  Log out
                </button>
              </form>
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
