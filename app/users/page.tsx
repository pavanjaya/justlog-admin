import { adminClient } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { UserActions } from "./UserActions";

export const dynamic = "force-dynamic";

async function getUsers() {
  const db = adminClient();
  const [{ data: authData }, { data: subs }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("subscriptions").select("user_id, status, valid_until, plan, created_at").order("created_at", { ascending: false }),
  ]);

  const subMap = new Map<string, { status: string; valid_until: string; plan: string }>();
  for (const s of subs ?? []) {
    if (!subMap.has(s.user_id)) subMap.set(s.user_id, s);
  }

  return (authData?.users ?? []).map(u => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in: u.last_sign_in_at ?? "",
    provider: u.app_metadata?.provider ?? "email",
    sub: subMap.get(u.id),
  })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

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

export default async function UsersPage() {
  const users = await getUsers();
  const pro = users.filter(u => u.sub?.status === "active").length;
  const trial = users.filter(u => u.sub?.status === "trialing").length;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: "32px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Users</h1>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
            {users.length} accounts · {pro} Pro · {trial} Trial
          </p>
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
              {users.map((u) => (
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
      </main>
    </div>
  );
}
