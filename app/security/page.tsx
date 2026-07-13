import { adminClient } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

async function getLogs() {
  const db = adminClient();
  const { data } = await db
    .from("admin_login_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

function fmt(d: string) {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default async function SecurityPage() {
  const logs = await getLogs();
  const failures = logs.filter((l: Record<string, unknown>) => !l.success).length;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: "32px 40px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Security</h1>
          <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
            Last 100 login attempts · {failures} failed
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24, maxWidth: 600 }}>
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "18px 22px" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#0d0d0d" }}>{logs.length}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "18px 22px" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Success</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#16A34A" }}>{logs.length - failures}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "18px 22px" }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Failed</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: failures > 0 ? "#DC2626" : "#0d0d0d" }}>{failures}</p>
          </div>
        </div>

        {/* Log table */}
        <div style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF9", borderBottom: "1px solid #EBEBEB" }}>
                {["Status", "IP Address", "Time"].map(h => (
                  <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#bbb" }}>No login attempts yet</td></tr>
              ) : logs.map((l: Record<string, unknown>, i: number) => (
                <tr key={i} style={{ borderBottom: "1px solid #F5F5F3" }}>
                  <td style={{ padding: "13px 20px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                      background: l.success ? "#DCFCE7" : "#FEE2E2",
                      color: l.success ? "#16A34A" : "#DC2626",
                    }}>
                      {l.success ? "✓ Success" : "✕ Failed"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#555", fontFamily: "monospace" }}>{String(l.ip)}</td>
                  <td style={{ padding: "13px 20px", fontSize: 13, color: "#999" }}>{fmt(String(l.created_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
