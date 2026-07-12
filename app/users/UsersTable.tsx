"use client";
import { useState, useMemo } from "react";
import { UserActions } from "./UserActions";

type User = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string;
  provider: string;
  sub?: { status: string; valid_until: string; plan: string };
};

function PlanBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    active:    { label: "Pro",       bg: "#DCFCE7", color: "#16A34A" },
    trialing:  { label: "Trial",     bg: "#FEF3C7", color: "#D97706" },
    cancelled: { label: "Cancelled", bg: "#FEE2E2", color: "#DC2626" },
  };
  const s = status && map[status] ? map[status] : { label: "Free", bg: "#F3F3F1", color: "#999" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function exportCSV(users: User[]) {
  const rows = [
    ["Email", "Plan", "Signed Up", "Last Active", "Provider"],
    ...users.map(u => [
      u.email,
      u.sub?.status === "active" ? "Pro" : u.sub?.status === "trialing" ? "Trial" : "Free",
      fmt(u.created_at),
      fmt(u.last_sign_in),
      u.provider,
    ]),
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `justlog-users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const PLAN_FILTERS = ["All", "Pro", "Trial", "Free"] as const;

export function UsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<typeof PLAN_FILTERS[number]>("All");

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase());
      const plan = u.sub?.status === "active" ? "Pro" : u.sub?.status === "trialing" ? "Trial" : "Free";
      const matchPlan = planFilter === "All" || plan === planFilter;
      return matchSearch && matchPlan;
    });
  }, [users, search, planFilter]);

  const pro = users.filter(u => u.sub?.status === "active").length;
  const trial = users.filter(u => u.sub?.status === "trialing").length;

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Users</h1>
        <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
          {users.length} accounts · {pro} Pro · {trial} Trial · {users.length - pro - trial} Free
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#bbb", pointerEvents: "none" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email…"
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              border: "1px solid #EBEBEB", borderRadius: 10,
              fontSize: 13, color: "#0d0d0d", background: "#fff",
              outline: "none",
            }}
          />
        </div>

        {/* Plan filter pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {PLAN_FILTERS.map(f => (
            <button key={f} onClick={() => setPlanFilter(f)} style={{
              padding: "7px 14px", borderRadius: 8, border: "1px solid",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.1s",
              borderColor: planFilter === f ? "#7C3AED" : "#EBEBEB",
              background: planFilter === f ? "#F3F0FF" : "#fff",
              color: planFilter === f ? "#7C3AED" : "#999",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Export CSV */}
        <button onClick={() => exportCSV(filtered)} style={{
          marginLeft: "auto", padding: "8px 16px", borderRadius: 10,
          border: "1px solid #EBEBEB", background: "#fff",
          fontSize: 12, fontWeight: 700, color: "#555", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFAF9", borderBottom: "1px solid #EBEBEB" }}>
              {["Email", "Plan", "Signed Up", "Last Active", "Provider", ""].map(h => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#bbb" }}>
                  No users match your search
                </td>
              </tr>
            ) : filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #F5F5F3" }}>
                <td style={{ padding: "13px 20px", fontSize: 13, fontWeight: 500, color: "#0d0d0d" }}>{u.email || "—"}</td>
                <td style={{ padding: "13px 20px" }}><PlanBadge status={u.sub?.status} /></td>
                <td style={{ padding: "13px 20px", fontSize: 13, color: "#999" }}>{fmt(u.created_at)}</td>
                <td style={{ padding: "13px 20px", fontSize: 13, color: "#999" }}>{fmt(u.last_sign_in)}</td>
                <td style={{ padding: "13px 20px", fontSize: 12, color: "#bbb", textTransform: "capitalize" }}>{u.provider}</td>
                <td style={{ padding: "13px 20px", textAlign: "right" }}>
                  <UserActions userId={u.id} email={u.email} status={u.sub?.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
