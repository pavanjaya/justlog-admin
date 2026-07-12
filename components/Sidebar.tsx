"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", icon: "⚡", label: "Dashboard" },
  { href: "/users", icon: "👥", label: "Users" },
  { href: "/contacts", icon: "💬", label: "Contacts" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
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

      <form action="/api/auth/logout" method="POST">
        <button type="submit" style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "9px 12px", borderRadius: 10,
          fontSize: 13, fontWeight: 500, color: "#999",
          background: "none", border: "none", cursor: "pointer",
          transition: "all 0.1s", textAlign: "left",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"; (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#999"; }}
        >
          <span>🚪</span> Logout
        </button>
      </form>
    </aside>
  );
}
